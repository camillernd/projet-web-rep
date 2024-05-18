const Movie = require('../models/movieModel');

// Créer un nouveau film
exports.createMovie = async (req, res) => {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json(movie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtenir tous les films
exports.getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtenir un film par son ID
exports.getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Film not found' });
    }
    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mettre à jour un film
exports.updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!movie) {
      return res.status(404).json({ message: 'Film not found' });
    }
    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mettre à jour uniquement l'URL d'un film
exports.updateMovieURL = async (req, res) => {
    try {
      const updatedMovie = await Movie.findByIdAndUpdate(
        req.params.id, // ID du film à mettre à jour
        { posterURL: req.body.posterURL }, // Nouvel URL du poster
        { new: true } // Option pour renvoyer le document mis à jour
      );
  
      if (!updatedMovie) {
        return res.status(404).json({ message: 'Film not found' });
      }
  
      res.status(200).json(updatedMovie);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

// Supprimer un film
exports.deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Film not found' });
    }
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
