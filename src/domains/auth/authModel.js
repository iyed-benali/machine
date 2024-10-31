// models/Profile.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const profileSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['machine owner', 'user', 'admin'], 
    default: 'user' 
  },
  isVerified: {
    type: Boolean,
    default: false
  }
});

// Hash password before saving
profileSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Password verification method
profileSchema.methods.isPasswordValid = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Profile', profileSchema);
