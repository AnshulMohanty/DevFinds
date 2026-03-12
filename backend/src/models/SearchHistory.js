const mongoose = require('mongoose');

const searchHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  query: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// We only want to keep unique queries per user to keep the sidebar clean
searchHistorySchema.index({ user: 1, query: 1 }, { unique: true });

module.exports = mongoose.model('SearchHistory', searchHistorySchema);