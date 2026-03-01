// DevFinds/backend/src/routes/search.routes.js
const express = require('express');
const router = express.Router();

const { searchWeb } = require('../controllers/search.controller');
const { protect } = require('../middlewares/auth.middleware');
const { checkCache } = require('../middlewares/cache.middleware'); // <-- IMPORT CACHE

// GET /api/v1/search?q=your_query
// Flow: 1. Is user logged in? -> 2. Is data in cache? -> 3. Fetch live data
router.get('/', protect, checkCache, searchWeb);

module.exports = router;