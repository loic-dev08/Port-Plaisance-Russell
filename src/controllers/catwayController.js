
/**
 * @file catwayController.js
 * @description CRUD catways
 */
const { validationResult } = require('express-validator');
const Catway = require('../models/Catway');

// POST /catways
exports.createCatway = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { catwayNumber, catwayType, catwayState } = req.body;
    const exists = await Catway.findOne({ catwayNumber });
    if (exists) return res.status(409).json({ message: 'catwayNumber déjà existant' });
    const catway = await Catway.create({ catwayNumber, catwayType, catwayState });
    return res.status(201).json(catway);
  } catch (err) { next(err); }
};

// GET /catways
exports.getCatways = async (req, res, next) => {
  try {
    const list = await Catway.find().sort({ catwayNumber: 1 });
    return res.json(list);
  } catch (err) { next(err); }
};

// GET /catways/:id
exports.getCatway = async (req, res, next) => {
  try {
    const catwayNumber = Number(req.params.id);
    const item = await Catway.findOne({ catwayNumber });
    if (!item) return res.status(404).json({ message: 'Catway non trouvé' });
    return res.json(item);
  } catch (err) { next(err); }
};

// PUT /catways/:id (seule la state modifiable)
exports.updateCatway = async (req, res, next) => {
  try {
    const catwayNumber = Number(req.params.id);
    const updates = { catwayState: req.body.catwayState };
    const item = await Catway.findOneAndUpdate({ catwayNumber }, updates, { new: true });
    if (!item) return res.status(404).json({ message: 'Catway non trouvé' });
    return res.json(item);
  } catch (err) { next(err); }
};

// DELETE /catways/:id
exports.deleteCatway = async (req, res, next) => {
  try {
    const catwayNumber = Number(req.params.id);
    const item = await Catway.findOneAndDelete({ catwayNumber });
    if (!item) return res.status(404).json({ message: 'Catway non trouvé' });
    return res.json({ message: 'Catway supprimé' });
  } catch (err) { next(err); }
};
