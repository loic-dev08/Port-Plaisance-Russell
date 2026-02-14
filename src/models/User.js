
/**
 * @file User.js
 * @description Modèle Utilisateur
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, minlength: 3, maxlength: 50 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, match: /.+@.+\..+/ },
  password: { type: String, required: true, minlength: 8 },
}, { timestamps: true });

userSchema.index({ email: 1 }, { unique: true });

// Hash du mot de passe
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function(candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);
