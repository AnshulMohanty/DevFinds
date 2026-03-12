const express = require('express');
const router = express.Router();
const { searchWeb, getHistory, clearHistory, deleteHistoryItem } = require('../controllers/search.controller');
const { protect } = require('../middlewares/auth.middleware');

router.get('/', searchWeb);
router.get('/history', protect, getHistory);
router.delete('/history', protect, clearHistory);
router.delete('/history/:id', protect, deleteHistoryItem); // <-- NEW

module.exports = router;