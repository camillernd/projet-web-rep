const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Route pour créer un nouvel utilisateur
router.post('/', userController.createUser);

// Route pour récupérer tous les utilisateurs
router.get('/', userController.getAllUsers);

// Route pour récupérer un utilisateur par son ID
router.get('/:id', userController.getUserById);

// Route pour mettre à jour les informations d'un utilisateur
router.put('/:id', userController.updateUser);

// Route pour supprimer un utilisateur
router.delete('/:id', userController.deleteUser);

// Endpoint pour créer un nouvel utilisateur
router.post('/signup', userController.createUser);

router.post('/login', userController.loginUser);

module.exports = router;
