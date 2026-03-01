// DevFinds/backend/src/controllers/search.controller.js
const StackOverflowProvider = require('../services/providers/StackOverflowProvider');
const DevToProvider = require('../services/providers/DevToProvider');
const RedditProvider = require('../services/providers/RedditProvider');
const catchAsync = require('../utils/catchAsync');
const { getRedisClient } = require('../config/redis'); // <-- IMPORT REDIS

const providers = [
  new StackOverflowProvider(),
  new DevToProvider(),
  new RedditProvider()
];

const searchWeb = catchAsync(async (req, res, next) => {
  const { q } = req.query;

  if (!q) {
    const error = new Error('Please provide a search query (e.g., ?q=react hooks)');
    error.statusCode = 400;
    throw error;
  }

  const fetchPromises = providers.map(provider => provider.search(q));
  const results = await Promise.allSettled(fetchPromises);

  let allCleanData = [];

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      const cleanData = providers[index].normalize(result.value);
      allCleanData = [...allCleanData, ...cleanData];
    }
  });

  allCleanData.sort((a, b) => b.score - a.score);

  // --- NEW REDIS LOGIC ---
  try {
    const redisClient = getRedisClient();
    const cacheKey = `search:${q.toLowerCase()}`;
    // Save to Redis. 'EX 3600' means expire in 3600 seconds (1 hour).
    await redisClient.set(cacheKey, JSON.stringify(allCleanData), { EX: 3600 });
  } catch (err) {
    console.error('Failed to save to Redis cache:', err);
  }
  // -----------------------

  res.status(200).json({
    success: true,
    count: allCleanData.length,
    data: allCleanData,
    source: 'live-api' // Tells us this was a fresh fetch
  });
});

module.exports = { searchWeb };