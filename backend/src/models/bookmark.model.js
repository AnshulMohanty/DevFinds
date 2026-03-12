const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Bookmark must have a title'],
      trim: true,
    },
    url: {
      type: String,
      required: [true, 'Bookmark must have a URL'],
    },
    source: {
      type: String,
      required: true, // <-- SDE FIX: enum array removed entirely!
    },
    tags: {
      type: [String], 
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

bookmarkSchema.index({ user_id: 1, tags: 1 });
bookmarkSchema.index({ user_id: 1, url: 1 }, { unique: true });

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);
module.exports = Bookmark;