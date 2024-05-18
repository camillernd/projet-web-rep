const Message = require('../models/messageModel');
const Like = require('../models/likeModel');

exports.createMessage = async (req, res) => {
  try {
    const { discussionId, userId, content } = req.body;
    const message = await Message.create({ discussionId, userId, content });
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMessagesByDiscussionId = async (req, res) => {
    try {
      const { discussionId } = req.query;
      const messages = await Message.find({ discussionId });
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


// Supprimer un message par son ID
exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    // Supprimer tous les likes associés au message
    await Like.deleteMany({ messageId });
    // Supprimer le message
    await Message.findByIdAndDelete(messageId);
    res.status(200).json({ message: 'Message supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};