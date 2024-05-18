const mongoose = require('mongoose');

const celebritySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  // Autres champs d'informations sur la célébrité
});

const Celebrity = mongoose.model('Celebrity', celebritySchema);

module.exports = Celebrity;
