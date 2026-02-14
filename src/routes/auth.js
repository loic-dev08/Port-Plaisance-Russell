
/**
 * @file auth routes
 */
const express = require('express');
const { body } = require('express-validator');
const { login, logout } = require('../controllers/authController');

const router = express.Router();

router.post('/login', [
  body('email').isEmail().withMessage('Email invalide'),
  body('password').isLength({ min: 8 }).withMessage('Mot de passe invalide')
], login);

router.get('/logout', logout);

module.exports = router;
