const { getRedisClient } = require('../config/redis');

const checkCache = async (req, res, next) => {
  const { q } = req.query;
  if (!q) return next();

  try {
    const redisClient = getRedisClient();
    // Create a unique predictable key, e.g., "search:javascript closures"
    const cacheKey = `search:${q.toLowerCase()}`;
    
    // Check if Redis has the data
    const cachedData = await redisClient.get(cacheKey);
    
    if (cachedData) {
      // // Self-note: Agar data Redis me mil gaya, toh external API call karne ki zaroorat hi nahi.
      // Wahi se response return kar do. Ye 1.2s ka kaam 10ms me kar dega!
      console.log(`⚡ CACHE HIT: Returning fast results for "${q}"`);
      
      return res.status(200).json({
        success: true,
        count: JSON.parse(cachedData).length,
        data: JSON.parse(cachedData),
        source: 'redis-cache' // Extra flag to prove it came from our cache
      });
    }
    
    console.log(`🐢 CACHE MISS: Fetching fresh data for "${q}"`);
    next(); // Move to the actual search controller
  } catch (err) {
    // Flex stuff: Fault Tolerance. If Redis crashes, don't break the app. Just fetch from APIs normally.
    console.error('Redis Cache Error:', err);
    next(); 
  }
};

module.exports = { checkCache };