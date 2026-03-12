const Bookmark = require('../models/bookmark.model'); // Matches your exact filename
const catchAsync = require('../utils/catchAsync');

// @desc    Toggle a bookmark (Save/Unsave)
// @route   POST /api/v1/bookmarks
const toggleBookmark = catchAsync(async (req, res) => {
  const { title, url, source } = req.body;
  const userId = req.user.id; 

  if (!url || !title) {
    return res.status(400).json({ success: false, error: 'Title and URL are required' });
  }

  // Check if it's already saved by this user (Using user_id to match your schema)
  const existingBookmark = await Bookmark.findOne({ user_id: userId, url });

  if (existingBookmark) {
    // If it exists, remove it (Unsave)
    await Bookmark.findByIdAndDelete(existingBookmark._id);
    return res.status(200).json({ 
      success: true, 
      bookmarked: false, 
      message: 'Removed from Saved Finds' 
    });
  }

  // If it doesn't exist, create it (Save)
  const newBookmark = await Bookmark.create({
    user_id: userId, // Matches your schema
    title,
    url,
    source: source.toLowerCase() // Clean formatting
  });

  res.status(201).json({ 
    success: true, 
    bookmarked: true, 
    data: newBookmark 
  });
});

// @desc    Get all saved bookmarks for the logged-in user
// @route   GET /api/v1/bookmarks
const getBookmarks = catchAsync(async (req, res) => {
  // Using user_id to match your schema
  const bookmarks = await Bookmark.find({ user_id: req.user.id }).sort('-createdAt');
  
  res.status(200).json({ 
    success: true, 
    count: bookmarks.length, 
    data: bookmarks 
  });
});

module.exports = { toggleBookmark, getBookmarks };