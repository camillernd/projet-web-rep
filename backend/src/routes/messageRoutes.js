const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

router.post('/', messageController.createMessage);
router.get('/', messageController.getMessagesByDiscussionId);

// Route pour supprimer un message par ID
router.delete('/:messageId', messageController.deleteMessage);

module.exports = router;
