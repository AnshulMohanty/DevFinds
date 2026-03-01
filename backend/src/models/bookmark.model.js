const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema(
  {
    // Har bookmark ek specific user se belong karta hai, isliye hum user_id ko reference ke roop me define karte hain.
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
      enum: ['StackOverflow', 'Reddit', 'DevTo', 'GitHub'],
      required: true,
    },
    // Tags allow krta hai users ko apne saved bookmarks ko filter karne me (e.g., "React", "Docker")
    tags: {
      type: [String], 
      default: [],
    },
  },
  {
    timestamps: true,
  }
);


// Agar humne ye compound index nahi banaya, toh MongoDB ko poore collection me scan karna padega 
// jab hum user_id aur tags ke basis par bookmarks search karenge, jo ki bahut inefficient hoga jab data badh jayega.
bookmarkSchema.index({ user_id: 1, tags: 1 });

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);
module.exports = Bookmark;