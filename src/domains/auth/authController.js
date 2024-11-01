// controllers/authController.js
const Profile = require('../../models/authModel');
const jwt = require('jsonwebtoken');
const {OTP} = require ('../../models/otpModel')
const otpGenerator = require('otp-generator');
const { sendVerificationEmail } = require('../../models/otpModel');
const mailSender = require('../../utils/mailsender')
require('dotenv').config();



exports.register = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    console.log('Before checking existing user');
    const existingUser = await Profile.findOne({ email });
    console.log('After checking existing user');
    
    if (existingUser) return res.status(400).json({ message: 'Email already registered' });

    const profile = new Profile({ fullName, email, password, role });
    await profile.save();

    // Generate OTP
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    // Save OTP with type 'emailVerification'
    const otpPayload = { email, otp, type: 'emailVerification' };
    const data = new OTP(otpPayload);
    await data.save();

    // Send the OTP via email
    await mailSender(email, "Your OTP Code", `<h1>Your OTP is: ${otp}</h1>`);
    console.log('OTP sent for email verification');
    
    res.status(201).json({ message: 'Profile created successfully and OTP sent' });
  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};



exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const profile = await Profile.findOne({ email });
    if (!profile) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    
    if (!profile.isVerified) {
      return res.status(403).json({ message: 'Account not verified. Please verify your account.' });
    }

    
    const isValidPassword = await profile.isPasswordValid(password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

 
    const token = jwt.sign({ id: profile._id, role: profile.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
