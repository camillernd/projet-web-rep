const express = require('express');
const router = express.Router();
const discussionController = require('../controllers/discussionController');

// Route pour la création d'une discussion
router.post('/', discussionController.createDiscussion);

// Route pour obtenir les discussions associées à un film
router.get('/', discussionController.getDiscussionsByFilmId);

// Route pour obtenir une discussion par son ID
router.get('/:discussionId', discussionController.getDiscussionById);

// Route pour supprimer une discussion par ID
router.delete('/:discussionId', discussionController.deleteDiscussion);

module.exports = router;
