const express = require('express');
const router = express.Router();
const celebController = require('../controllers/celebController');

// Routes pour les célébrités
router.post('/', celebController.createCelebrity);
router.get('/', celebController.getAllCelebrities);
router.get('/:id', celebController.getCelebrityById);
router.put('/:id', celebController.updateCelebrity);
router.delete('/:id', celebController.deleteCelebrity);

module.exports = router;
