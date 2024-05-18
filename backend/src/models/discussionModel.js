const mongoose = require('mongoose');

const discussionSchema = new mongoose.Schema({
  filmId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Film',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  }
});

const Discussion = mongoose.model('Discussion', discussionSchema);

module.exports = Discussion;
