
/**
 * @file userController.js
 * @description CRUD utilisateurs
 */
const { validationResult } = require('express-validator');
const User = require('../models/User');

// POST /users
exports.createUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { username, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email déjà utilisé' });
    const user = await User.create({ username, email, password });
    return res.status(201).json({ id: user._id, username: user.username, email: user.email });
  } catch (err) { next(err); }
};

// GET /users
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 });
    return res.json(users);
  } catch (err) { next(err); }
};

// GET /users/:email
exports.getUserByEmail = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.params.email }, { password: 0 });
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    return res.json(user);
  } catch (err) { next(err); }
};

// PUT /users/:email
exports.updateUser = async (req, res, next) => {
  try {
    const updates = { ...req.body };
    if (updates.password) delete updates.password; // mot de passe non modifié ici
    const user = await User.findOneAndUpdate({ email: req.params.email }, updates, { new: true, projection: { password: 0 } });
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    return res.json(user);
  } catch (err) { next(err); }
};

// DELETE /users/:email
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findOneAndDelete({ email: req.params.email });
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    return res.json({ message: 'Utilisateur supprimé' });
  } catch (err) { next(err); }
};
