const Like = require('../models/likeModel');

exports.likeMessage = async (req, res) => {
  try {
    const { messageId, userId } = req.body;
    const like = await Like.create({ messageId, userId });
    res.status(201).json(like);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getLikesCountByMessage = async (req, res) => {
  try {
    const { messageId } = req.query; 
    const likesCount = await Like.countDocuments({ messageId });
    res.status(200).json({ messageId, likesCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};