const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  url: { 
    type: String, 
    required: true, 
    unique: true 
  },
  source: { 
    type: String, 
    required: true // <-- SDE FIX: enum array removed entirely!
  },
  clickCount: { 
    type: Number, 
    default: 1 
  },
  saveCount: { 
    type: Number, 
    default: 0 
  }
}, { timestamps: true });

module.exports = mongoose.model('Resource', resourceSchema);