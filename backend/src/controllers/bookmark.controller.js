const Bookmark = require('../models/bookmark.model');
const catchAsync = require('../utils/catchAsync');

// --- Controller: Save a new Bookmark ---
const createBookmark = catchAsync(async (req, res, next) => {
  const { title, url, source, tags } = req.body;

  // Check: Ensure the user doesn't accidentally save the exact same link twice.
  // Self-note: Yaha duplicate check lagana zaroori hai warna user gusse me bar bar click karega aur DB me kachra bhar jayega.
  const existingBookmark = await Bookmark.findOne({ user_id: req.user._id, url });
  
  if (existingBookmark) {
    const error = new Error('You have already saved this bookmark');
    error.statusCode = 400;
    throw error;
  }

  // Notice we get 'req.user._id' directly from our 'protect' middleware!
  const bookmark = await Bookmark.create({
    user_id: req.user._id,
    title,
    url,
    source,
    tags: tags || [], // If no tags provided, default to empty array
  });

  res.status(201).json({
    success: true,
    data: bookmark,
  });
});


// --- Controller: Get all saved Bookmarks for the logged-in User ---
const getBookmarks = catchAsync(async (req, res, next) => {
  // Find only the bookmarks linked to this specific user's ID
  // .sort('-createdAt') ensures the newest bookmarks show up at the top
  const bookmarks = await Bookmark.find({ user_id: req.user._id }).sort('-createdAt');

  res.status(200).json({
    success: true,
    count: bookmarks.length,
    data: bookmarks,
  });
});


// --- Controller: Delete a Bookmark ---
const deleteBookmark = catchAsync(async (req, res, next) => {
  // req.params.id comes from the URL (e.g., /api/v1/bookmarks/12345)
  const bookmark = await Bookmark.findById(req.params.id);

  if (!bookmark) {
    const error = new Error('Bookmark not found');
    error.statusCode = 404;
    throw error;
  }


  // SECURITY CHECK: Ensure the user trying to delete it actually owns it!
  // Self-note: Kabhi bhi direct delete mat karo. Pehle check karo ki JWT token wala banda hi iska owner hai ya nahi.
  if (bookmark.user_id.toString() !== req.user._id.toString()) {
    const error = new Error('Not authorized to delete this bookmark');
    error.statusCode = 403; // 403 Forbidden
    throw error;
  }

  await bookmark.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
    message: 'Bookmark removed successfully',
  });
});

module.exports = {
  createBookmark,
  getBookmarks,
  deleteBookmark,
};