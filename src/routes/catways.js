
/**
 * @file catways routes
 */
const express = require('express');
const { body } = require('express-validator');
const { requireAuth } = require('../middleware/auth');
const ctrl = require('../controllers/catwayController');

const router = express.Router();

router.use(requireAuth);

router.get('/', ctrl.getCatways);
router.get('/:id', ctrl.getCatway);
router.post('/', [
  body('catwayNumber').isInt({ min: 1 }),
  body('catwayType').isIn(['long', 'short']),
  body('catwayState').optional().isString()
], ctrl.createCatway);
router.put('/:id', [
  body('catwayState').isString().withMessage('catwayState requis')
], ctrl.updateCatway);
router.delete('/:id', ctrl.deleteCatway);

module.exports = router;
