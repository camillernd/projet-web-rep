const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  releaseYear: {
    type: Number,
    required: true
  },
  director: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Celebrity' // Référence au modèle de la célébrité pour le réalisateur
  },
  posterURL: {
    type: String,
    required: true
  },
  // Autres champs d'informations sur le film
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
