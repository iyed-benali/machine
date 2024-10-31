// controllers/authController.js
const Profile = require('../model/profile');
const jwt = require('jsonwebtoken');
const {OTP} = require ('../model/otp')
const otpGenerator = require('otp-generator');
const { sendVerificationEmail } = require('../model/otp');
const mailSender = require('../utils/mailsender')
require('dotenv').config();


// Register Controller
// controllers/authController.js
exports.register = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    console.log('Before checking existing user');
    const existingUser = await Profile.findOne({ email });
    console.log('After checking existing user');
    
    if (existingUser) return res.status(400).json({ message: 'Email already registered' });

    const profile = new Profile({ fullName, email, password, role });
    await profile.save();

    // Generate and send OTP
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    const otpPayload = { email, otp };
   const data = new OTP(otpPayload)
   await data.save() 
    await mailSender(email,"Your OTP Code", `<h1>Your OTP is: ${otp}</h1>`)
    console.log('ggggg')
    await sendVerificationEmail(email, otp); 

    res.status(201).json({ message: 'Profile created successfully and OTP sent' });
  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
  
};


// Login Controller
// controllers/authController.js
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the profile by email
    const profile = await Profile.findOne({ email });
    if (!profile) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check if the account is verified
    if (!profile.isVerified) {
      return res.status(403).json({ message: 'Account not verified. Please verify your account.' });
    }

    // Validate the password
    const isValidPassword = await profile.isPasswordValid(password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate and return the JWT token
    const token = jwt.sign({ id: profile._id, role: profile.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (error) {
    console.error('Login error:', error); // Log the error for debugging
    res.status(500).json({ message: 'Server error' });
  }
};
