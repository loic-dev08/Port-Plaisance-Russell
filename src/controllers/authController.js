
/**
 * @file authController.js
 * @description Gestion de l'authentification
 */
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

/**
 * POST /login
 */
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    if (req.accepts('html')) return res.status(400).render('home', { title: 'Accueil', errors: errors.array() });
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    if (req.accepts('html')) return res.status(401).render('home', { title: 'Accueil', errors: [{ msg: 'Identifiants invalides' }] });
    return res.status(401).json({ message: 'Identifiants invalides' });
  }
  const ok = await user.comparePassword(password);
  if (!ok) {
    if (req.accepts('html')) return res.status(401).render('home', { title: 'Accueil', errors: [{ msg: 'Identifiants invalides' }] });
    return res.status(401).json({ message: 'Identifiants invalides' });
  }
  const token = jwt.sign({ id: user._id, email: user.email, username: user.username }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '8h' });
  res.cookie('token', token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 8*60*60*1000 });
  if (req.accepts('html')) return res.redirect('/dashboard');
  return res.json({ message: 'Connecté', user: { email: user.email, username: user.username } });
};

/**
 * GET /logout
 */
exports.logout = async (req, res) => {
  res.clearCookie('token');
  if (req.accepts('html')) return res.redirect('/');
  return res.json({ message: 'Déconnecté' });
};
