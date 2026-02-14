
/**
 * @file reservationController.js
 * @description CRUD réservations (sous-ressource de catways)
 */
const { validationResult } = require('express-validator');
const Reservation = require('../models/Reservation');
const Catway = require('../models/Catway');

/**
 * Vérifie qu'il n'y a pas de chevauchement pour un catway donné
 */
async function hasOverlap(catwayNumber, startDate, endDate, excludeId) {
  const q = { catwayNumber, $or: [
    { startDate: { $lte: endDate }, endDate: { $gte: startDate } },
  ] };
  if (excludeId) q._id = { $ne: excludeId };
  const count = await Reservation.countDocuments(q);
  return count > 0;
}

// POST /catways/:id/reservations
exports.createReservation = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const catwayNumber = Number(req.params.id);
    const cat = await Catway.findOne({ catwayNumber });
    if (!cat) return res.status(404).json({ message: 'Catway inexistant' });
    const { clientName, boatName, startDate, endDate } = req.body;
    const s = new Date(startDate), e = new Date(endDate);
    if (isNaN(s) || isNaN(e) || s >= e) return res.status(400).json({ message: 'Dates invalides' });
    if (await hasOverlap(catwayNumber, s, e)) return res.status(409).json({ message: 'Chevauchement avec une réservation existante' });
    const r = await Reservation.create({ catwayNumber, clientName, boatName, startDate: s, endDate: e });
    return res.status(201).json(r);
  } catch (err) { next(err); }
};

// GET /catways/:id/reservations
exports.getReservations = async (req, res, next) => {
  try {
    const catwayNumber = Number(req.params.id);
    const list = await Reservation.find({ catwayNumber }).sort({ startDate: -1 });
    return res.json(list);
  } catch (err) { next(err); }
};

// GET /catways/:id/reservations/:idReservation
exports.getReservation = async (req, res, next) => {
  try {
    const { id, idReservation } = req.params;
    const item = await Reservation.findOne({ _id: idReservation, catwayNumber: Number(id) });
    if (!item) return res.status(404).json({ message: 'Réservation non trouvée' });
    return res.json(item);
  } catch (err) { next(err); }
};

// PUT /catways/:id/reservations/:idReservation
exports.updateReservation = async (req, res, next) => {
  try {
    const { id, idReservation } = req.params;
    const updates = { ...req.body };
    if (updates.startDate || updates.endDate) {
      const s = new Date(updates.startDate), e = new Date(updates.endDate);
      if (isNaN(s) || isNaN(e) || s >= e) return res.status(400).json({ message: 'Dates invalides' });
      if (await hasOverlap(Number(id), s, e, idReservation)) return res.status(409).json({ message: 'Chevauchement avec une réservation existante' });
    }
    const item = await Reservation.findOneAndUpdate({ _id: idReservation, catwayNumber: Number(id) }, updates, { new: true });
    if (!item) return res.status(404).json({ message: 'Réservation non trouvée' });
    return res.json(item);
  } catch (err) { next(err); }
};

// DELETE /catways/:id/reservations/:idReservation
exports.deleteReservation = async (req, res, next) => {
  try {
    const { id, idReservation } = req.params;
    const item = await Reservation.findOneAndDelete({ _id: idReservation, catwayNumber: Number(id) });
    if (!item) return res.status(404).json({ message: 'Réservation non trouvée' });
    return res.json({ message: 'Réservation supprimée' });
  } catch (err) { next(err); }
};
