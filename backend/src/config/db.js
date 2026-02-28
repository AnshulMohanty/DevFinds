const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Attempt krte hai to connect using the URI from our .env file
    const conn = await mongoose.connect(process.env.MONGO_URI);
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    //  agar db fails to connect -> exit the node process completely 
    process.exit(1); 
  }
};

module.exports = connectDB;