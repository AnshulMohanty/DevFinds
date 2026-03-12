const StackOverflowProvider = require('../services/providers/StackOverflowProvider');
const TavilyProvider = require('../services/providers/TavilyProvider');
const { generateDeveloperAnswer } = require('../services/ai.service');
const catchAsync = require('../utils/catchAsync');
const { getRedisClient } = require('../config/redis');

// Our new RAG Provider array: Meta-Search + Dedicated StackOverflow Fallback
const providers = [
  new TavilyProvider(),
  new StackOverflowProvider()
];

// Heuristic Ranking Function to sort the cards below the AI answer
const calculateRelevance = (item, query) => {
  let weight = item.score || 0;
  const title = item.title.toLowerCase();
  const content = (item.content || "").toLowerCase();
  const q = query.toLowerCase();

  if (title.includes(q)) weight += 100;

  const codeMarkers = ['const', 'function', 'import', 'def', 'public', 'class', '=>', '{', '<code>'];
  codeMarkers.forEach(marker => {
    if (content.includes(marker)) weight += 15;
  });

  if (item.source === 'stackoverflow.com' || item.source === 'stackoverflow') weight += 50;
  if (item.source === 'github.com') weight += 40;

  return weight;
};

const searchWeb = catchAsync(async (req, res, next) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ success: false, error: 'Query required' });

  // 1. Parallel Data Retrieval
  const fetchPromises = providers.map(p => p.search(q));
  const results = await Promise.allSettled(fetchPromises);

  let allCleanData = [];
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      const cleanData = providers[index].normalize(result.value);
      allCleanData = [...allCleanData, ...cleanData];
    }
  });

  // 2. Smart Ranking for the Source Cards
  allCleanData = allCleanData.map(item => ({
    ...item,
    relevanceScore: calculateRelevance(item, q)
  })).sort((a, b) => b.relevanceScore - a.relevanceScore);

  // 3. THE RAG PIPELINE: Feed the top data to Gemini
  // We don't await the AI if there is no data found
  let aiAnswer = "No relevant developer context found on the web to generate an answer.";
  if (allCleanData.length > 0) {
    aiAnswer = await generateDeveloperAnswer(q, allCleanData);
  }

  const finalPayload = { 
    success: true, 
    count: allCleanData.length, 
    aiSummary: aiAnswer, // <--- New AI field sent to frontend
    data: allCleanData 
  };

  // 4. Cache the ENTIRE result (Data + AI Answer) in Redis for instant subsequent loads
  try {
    const redisClient = getRedisClient();
    await redisClient.set(`search:${q.toLowerCase()}`, JSON.stringify(finalPayload), { EX: 3600 });
  } catch (err) { 
    console.error('Redis Error:', err); 
  }

  // 5. Send back to user
  res.status(200).json(finalPayload);
});

module.exports = { searchWeb };