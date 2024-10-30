// controllers/authController.js
const Profile = require('../model/profile');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Register Controller
exports.register = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;    
    const existingUser = await Profile.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already registered' });

    const profile = new Profile({ fullName, email, password, role });
    await profile.save();

    res.status(201).json({ message: 'Profile created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Login Controller
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const profile = await Profile.findOne({ email });
    if (!profile) return res.status(400).json({ message: 'Invalid email or password' });

    const isValidPassword = await profile.isPasswordValid(password);
    if (!isValidPassword) return res.status(400).json({ message: 'Invalid email or password' });

    // Include role in the JWT payload
   // Example from authController.js
const jwt = require('jsonwebtoken');
const token = jwt.sign({ id: profile._id, role: profile.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
