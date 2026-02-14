
/**
 * @file views routes (pages EJS)
 */
const express = require('express');
const { requireAuth } = require('../middleware/auth');
const Reservation = require('../models/Reservation');

const router = express.Router();

// Accueil + formulaire de connexion
router.get('/', (req, res) => {
  res.render('home', { title: 'Accueil', errors: [] });
});

// Dashboard
router.get('/dashboard', requireAuth, async (req, res, next) => {
  try {
    const today = new Date();
    const reservations = await Reservation.find({ startDate: { $lte: today }, endDate: { $gte: today } }).sort({ startDate: 1 });
    res.render('dashboard', { title: 'Tableau de bord', user: req.user, today, reservations });
  } catch (err) { next(err); }
});

// Pages CRUD simples (listes) - endpoints qui consomment l'API via fetch côté client
router.get('/catways-page', requireAuth, (req, res) => res.render('catways', { title: 'Catways', user: req.user }));
router.get('/reservations-page', requireAuth, (req, res) => res.render('reservations', { title: 'Réservations', user: req.user }));
router.get('/users-page', requireAuth, (req, res) => res.render('users', { title: 'Utilisateurs', user: req.user }));

module.exports = router;
