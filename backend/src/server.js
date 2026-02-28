require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

// Import db connections
const connectDB = require('./config/db');
const { connectRedis } = require('./config/redis');

// Import Route Files
const authRoutes = require('./routes/auth.routes');

const app = express();


// --- Connect to Dds ---
connectDB();
connectRedis();

// --- Global Middleware ---
app.use(helmet()); 
app.use(cors()); 
app.use(express.json()); 

// --- Mount Routes ---
// Any request starting with /api/v1/auth will be sent to authRoutes
app.use('/api/v1/auth', authRoutes);

// --- Health Check Route ---
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'DevFinds API is up.' });
});

// --- Global Error Handler (ALWAYS LAST MIDDLEWARE) ---
const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

// --- Server Startup ---
const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});