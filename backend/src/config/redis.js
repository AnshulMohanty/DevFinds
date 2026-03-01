const redis = require('redis');

// Create the Redis client using the URL from your .env file
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

// Function to connect to Redis when the server starts
const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log('✅ Redis Connected successfully');
  } catch (err) {
    console.error('❌ Redis Connection Error:', err);
  }
};

// Function to allow other files (like our cache middleware) to use the client
const getRedisClient = () => {
  return redisClient;
};

// Export both functions
module.exports = { 
  connectRedis, 
  getRedisClient 
};