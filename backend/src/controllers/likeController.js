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

exports.unlikeMessage = async (req, res) => {
  try {
    const { messageId, userId } = req.body;
    await Like.deleteOne({ messageId, userId });
    
    res.status(200).json({ message: 'Like removed' });
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

exports.checkUserLikeStatus = async (req, res) => {
  try {
    const { messageId, userId } = req.query;
    const like = await Like.findOne({ messageId, userId });
    res.status(200).json({ liked: !!like });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
