
/**
 * @file user routes
 */
const express = require('express');
const { body } = require('express-validator');
const { requireAuth } = require('../middleware/auth');
const ctrl = require('../controllers/userController');

const router = express.Router();

router.use(requireAuth);

router.post('/', [
  body('username').isLength({ min: 3 }),
  body('email').isEmail(),
  body('password').isStrongPassword({ minLength: 8, minSymbols: 0 })
], ctrl.createUser);

router.get('/', ctrl.getUsers);
router.get('/:email', ctrl.getUserByEmail);
router.put('/:email', ctrl.updateUser);
router.delete('/:email', ctrl.deleteUser);

module.exports = router;
