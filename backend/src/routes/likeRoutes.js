const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');

// Route pour liker un message
router.post('/', likeController.likeMessage);

// Route pour retirer un like d'un message
router.delete('/', likeController.unlikeMessage);

// Route pour obtenir le nombre de likes pour un message donné
router.get('/count', likeController.getLikesCountByMessage);

// Route pour vérifier si un utilisateur a liké un message donné
router.get('/check', likeController.checkUserLikeStatus);

module.exports = router;
