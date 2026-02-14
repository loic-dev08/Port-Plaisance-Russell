
/**
 * @file db.js
 * @description Connexion à MongoDB avec Mongoose
 */
const mongoose = require('mongoose');

/**
 * Établit la connexion MongoDB
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/port_russell';
  try {
    await mongoose.connect(uri, { 
      serverSelectionTimeoutMS: 5000
    });
    console.log('🗄️  Connecté à MongoDB');
  } catch (err) {
    console.error('Erreur connexion MongoDB', err.message);
    process.exit(1);
  }
};

module.exports = { connectDB };
