const { createClient } = require('redis');

//  Redis client bna using the URL from .env
const redisClient = createClient({
  url: process.env.REDIS_URL
});

// Event listeners use honge for 'debugging' and 'logging'
redisClient.on('error', (err) => console.error('❌ Redis Client Error:', err));
redisClient.on('connect', () => console.log('✅ Redis Connected successfully'));

const connectRedis = async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    console.error(`❌ Failed to connect to Redis: ${error.message}`);
 
    // agar Redis se connect nahi ho pata, toh hum process ko exit nahi karenge. 
    // Agar Redis down ho jata hai, toh hamara app gracefully degrade kar sakta hai aur APIs se directly fetch kar sakta hai (though slower ==> trade off kr liya ).
  }
};

module.exports = { redisClient, connectRedis };