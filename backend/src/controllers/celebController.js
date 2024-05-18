const Celebrity = require('../models/celebModel');

// Créer une nouvelle célébrité
exports.createCelebrity = async (req, res) => {
  try {
    const celebrity = await Celebrity.create(req.body);
    res.status(201).json(celebrity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtenir toutes les célébrités
exports.getAllCelebrities = async (req, res) => {
  try {
    const celebrities = await Celebrity.find();
    res.status(200).json(celebrities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtenir une célébrité par son ID
exports.getCelebrityById = async (req, res) => {
  try {
    const celebrity = await Celebrity.findById(req.params.id);
    if (!celebrity) {
      return res.status(404).json({ message: 'Celebrity not found' });
    }
    res.status(200).json(celebrity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mettre à jour une célébrité
exports.updateCelebrity = async (req, res) => {
  try {
    const celebrity = await Celebrity.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!celebrity) {
      return res.status(404).json({ message: 'Celebrity not found' });
    }
    res.status(200).json(celebrity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Supprimer une célébrité
exports.deleteCelebrity = async (req, res) => {
  try {
    const celebrity = await Celebrity.findByIdAndDelete(req.params.id);
    if (!celebrity) {
      return res.status(404).json({ message: 'Celebrity not found' });
    }
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
