const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');

router.post('/', likeController.likeMessage);
router.get('/', likeController.getLikesCountByMessage);

module.exports = router;
