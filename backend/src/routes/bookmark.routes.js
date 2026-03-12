const express = require('express');
const router = express.Router();
const { toggleBookmark, getBookmarks } = require('../controllers/bookmark.controller');
const { protect } = require('../middlewares/auth.middleware');

// Base route: /api/v1/bookmarks
router.route('/')
  // POST: Creates a new bookmark or deletes it if it already exists (Toggle)
  .post(protect, toggleBookmark)
  // GET: Fetches all saved bookmarks for the currently authenticated user
  .get(protect, getBookmarks);

module.exports = router;