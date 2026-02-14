
/**
 * @file auth.js
 * @description Middlewares d'authentification et d'autorisation basés sur JWT en cookie httpOnly
 */
const jwt = require('jsonwebtoken');

/**
 * Vérifie le JWT dans le cookie et ajoute req.user
 */
const requireAuth = (req, res, next) => {
  const token = req.cookies && req.cookies.token;
  if (!token) {
    if (req.accepts('html')) return res.redirect('/');
    return res.status(401).json({ message: 'Authentification requise' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    req.user = decoded;
    next();
  } catch (err) {
    if (req.accepts('html')) return res.redirect('/');
    return res.status(401).json({ message: 'Token invalide' });
  }
};

module.exports = { requireAuth };

