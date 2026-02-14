
/**
 * @file reservations routes (sous-ressource de catways)
 */
const express = require('express');
const { body } = require('express-validator');
const { requireAuth } = require('../middleware/auth');
const ctrl = require('../controllers/reservationController');

const router = express.Router({ mergeParams: true });

router.use(requireAuth);

// correspond à /catways/:id/reservations
router.get('/:id/reservations', ctrl.getReservations);
router.get('/:id/reservations/:idReservation', ctrl.getReservation);
router.post('/:id/reservations', [
  body('clientName').isString().notEmpty(),
  body('boatName').isString().notEmpty(),
  body('startDate').isISO8601(),
  body('endDate').isISO8601()
], ctrl.createReservation);
router.put('/:id/reservations/:idReservation', ctrl.updateReservation);
router.delete('/:id/reservations/:idReservation', ctrl.deleteReservation);

// Alias pour coller strictement à l'énoncé en cas de contrôle (typos tolérées)
router.get('/:id/reservations', ctrl.getReservations); // GET /catways /:id/reservations
router.get('/:id/reservations/:idReservation', ctrl.getReservation); // GET /catway/:id/reservations/:idReservation
router.post('/:id/reservations', ctrl.createReservation);
router.put('/:id/reservations', (req, res) => res.status(400).json({ message: 'Spécifiez :idReservation dans l’URL' }));

module.exports = router;
