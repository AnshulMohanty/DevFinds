const express = require('express');
const router = express.Router();

const { createBookmark, getBookmarks, deleteBookmark } = require('../controllers/bookmark.controller');
const { protect } = require('../middlewares/auth.middleware');

// All bookmark routes MUST be protected. You can't save things if you aren't logged in.
router.use(protect); // This applies the protect middleware to EVERY route below it automatically! SDE shortcut.

// POST /api/v1/bookmarks -> Create a bookmark
// GET /api/v1/bookmarks -> Get all user's bookmarks
router.route('/')
  .post(createBookmark)
  .get(getBookmarks);

// DELETE /api/v1/bookmarks/:id -> Delete a specific bookmark
router.route('/:id')
  .delete(deleteBookmark);

module.exports = router;