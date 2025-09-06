const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    default: null
  },
  imageBase64: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Post', postSchema);
