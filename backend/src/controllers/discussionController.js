const Discussion = require('../models/discussionModel');
const Message = require('../models/messageModel');

// Créer une nouvelle discussion
exports.createDiscussion = async (req, res) => {
  try {
    const { filmId, userId, title } = req.body;
    
    // Validation des données
    if (!filmId || !userId || !title) {
      return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }

    const discussion = await Discussion.create({ filmId, userId, title });
    res.status(201).json(discussion);
  } catch (error) {
    console.error('Erreur lors de la création de la discussion :', error);
    res.status(500).json({ error: 'Erreur lors de la création de la discussion.' });
  }
};

// Obtenir une discussion par son ID
exports.getDiscussionById = async (req, res) => {
  try {
    const { discussionId } = req.params;
    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion non trouvée.' });
    }
    res.status(200).json(discussion);
  } catch (error) {
    console.error('Erreur lors de la récupération de la discussion par ID :', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de la discussion.' });
  }
};

// Obtenir les discussions associées à un film
exports.getDiscussionsByFilmId = async (req, res) => {
  try {
    const { filmId } = req.query;
    const discussions = await Discussion.find({ filmId });
    res.status(200).json(discussions);
  } catch (error) {
    console.error('Erreur lors de la récupération des discussions par film ID :', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des discussions.' });
  }
};

// Supprimer une discussion par son ID
exports.deleteDiscussion = async (req, res) => {
  try {
    const { discussionId } = req.params;
    // Supprimer tous les messages associés à la discussion
    await Message.deleteMany({ discussionId });
    // Supprimer la discussion
    await Discussion.findByIdAndDelete(discussionId);
    res.status(200).json({ message: 'Discussion supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};