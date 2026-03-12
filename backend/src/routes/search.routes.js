const express = require('express');
const router = express.Router();
const { searchWeb } = require('../controllers/search.controller');
const { protect } = require('../middlewares/auth.middleware');
const { checkCache } = require('../middlewares/cache.middleware');
const Resource = require('../models/Resource.model'); // <-- Import the new model

// Main search endpoint
router.get('/', protect, checkCache, searchWeb);

/**
 * @route   POST /api/v1/search/click
 * @desc    Track user behavior and save to MongoDB
 * @access  Private
 */
router.post('/click', protect, async (req, res) => {
  try {
    const { url, title, source } = req.body;

    if (!url) {
      return res.status(400).json({ success: false, error: 'URL is required' });
    }

    // Upsert: Update if exists, Create if it doesn't
    await Resource.findOneAndUpdate(
      { url: url },
      { 
        $inc: { clickCount: 1 }, // Increase click count by 1
        $setOnInsert: { title, source } // Only set title and source if creating a new entry
      },
      { new: true, upsert: true }
    );

    console.log(`[DB SAVED] Click incremented for: ${url}`);

    res.status(200).json({ 
      success: true, 
      message: 'Click behavior recorded to database' 
    });
  } catch (err) {
    console.error('Analytics DB error:', err);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

module.exports = router;