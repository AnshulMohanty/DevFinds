const StackOverflowProvider = require('../services/providers/StackOverflowProvider');
const TavilyProvider = require('../services/providers/TavilyProvider');
const { generateDeveloperAnswer } = require('../services/ai.service');
const SearchHistory = require('../models/SearchHistory');
const catchAsync = require('../utils/catchAsync');
const { getRedisClient } = require('../config/redis');
const jwt = require('jsonwebtoken');

const providers = [new TavilyProvider(), new StackOverflowProvider()];

const calculateRelevance = (item, query) => {
  let weight = item.score || 0;
  const title = item.title.toLowerCase();
  const q = query.toLowerCase();
  if (title.includes(q)) weight += 100;
  return weight;
};

const searchWeb = catchAsync(async (req, res, next) => {
  const { q, proMode } = req.query;
  if (!q) return res.status(400).json({ success: false, error: 'Query required' });

  const isProMode = proMode === 'true';
  const redisClient = getRedisClient();
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip;

  let isAuthed = false;
  let userId = null;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      isAuthed = true;
      userId = decoded.id;
    } catch (err) {}
  }

  let remainingCredits = 'Unlimited';
  if (!isAuthed) {
    const rateLimitKey = `ratelimit:search:${ip}`;
    const currentUsage = await redisClient.get(rateLimitKey);
    if (currentUsage && parseInt(currentUsage) >= 5) return res.status(403).json({ success: false, error: 'CREDITS_EXHAUSTED' });
    await redisClient.incr(rateLimitKey);
    const newUsage = await redisClient.get(rateLimitKey);
    remainingCredits = 5 - parseInt(newUsage);
  } else if (userId) {
    await SearchHistory.findOneAndUpdate({ user: userId, query: q }, { createdAt: Date.now() }, { upsert: true });
  }

  const cacheKey = `search:${q.toLowerCase()}:pro:${isProMode}`;
  const cachedResult = await redisClient.get(cacheKey);
  if (cachedResult) {
    const parsedCache = JSON.parse(cachedResult);
    parsedCache.remainingCredits = remainingCredits;
    return res.status(200).json(parsedCache);
  }

  const fetchPromises = providers.map(p => p.search(q));
  const results = await Promise.allSettled(fetchPromises);
  let allCleanData = [];
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') allCleanData = [...allCleanData, ...providers[index].normalize(result.value)];
  });

  allCleanData = allCleanData.map(item => ({ ...item, relevanceScore: calculateRelevance(item, q) })).sort((a, b) => b.relevanceScore - a.relevanceScore);

  let aiAnswer = "No relevant context found.";
  if (allCleanData.length > 0) aiAnswer = await generateDeveloperAnswer(q, allCleanData, isProMode);

  const finalPayload = { success: true, aiSummary: aiAnswer, data: allCleanData, remainingCredits };
  try { await redisClient.set(cacheKey, JSON.stringify(finalPayload), { EX: 3600 }); } catch (err) {}

  res.status(200).json(finalPayload);
});

const getHistory = catchAsync(async (req, res) => {
  const history = await SearchHistory.find({ user: req.user.id }).sort({ createdAt: -1 }).limit(15);
  res.status(200).json({ success: true, data: history });
});

// NEW: Delete individual log
const deleteHistoryItem = catchAsync(async (req, res) => {
  await SearchHistory.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  res.status(200).json({ success: true, message: 'Log deleted' });
});

const clearHistory = catchAsync(async (req, res) => {
  await SearchHistory.deleteMany({ user: req.user.id });
  res.status(200).json({ success: true, message: 'History wiped' });
});

module.exports = { searchWeb, getHistory, clearHistory, deleteHistoryItem };