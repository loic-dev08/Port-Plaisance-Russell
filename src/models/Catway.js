
/**
 * @file Catway.js
 * @description Modèle Catway
 */
const mongoose = require('mongoose');

const catwaySchema = new mongoose.Schema({
  catwayNumber: { type: Number, required: true, unique: true },
  catwayType: { type: String, enum: ['long', 'short'], required: true },
  catwayState: { type: String, default: '' }
}, { timestamps: true });

catwaySchema.index({ catwayNumber: 1 }, { unique: true });

module.exports = mongoose.model('Catway', catwaySchema);

