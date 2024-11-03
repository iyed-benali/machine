const Profile = require('../../models/Profile.js');
const jwt = require('jsonwebtoken');
const { OTP, sendVerificationEmail } = require('../../models/otp.js');
const { OAuth2Client } = require('google-auth-library');
const bcrypt = require('bcrypt');
const { registerSchema } = require('../../utils/validators'); 
const axios = require('axios');
const { generateAndHashOTP } = require('../../utils/generateOtp.js');
require('dotenv').config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

// Google Login
exports.googleLogin = (req, res) => {
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=profile email`;
  res.redirect(url);
};

// Google Callback
exports.googleCallback = async (req, res) => {
  const { code } = req.query;

  try {
    // Exchange authorization code for tokens
    const { data } = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
    });

    const { access_token } = data;

    // Use access_token to fetch user profile
    const { data: profile } = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    let user = await Profile.findOne({ email: profile.email });
    if (!user) {
      user = new Profile({
        fullName: profile.name,
        email: profile.email,
        role: 'user',
        isVerified: true,
        source: 'Google',
      });
      await user.save();
    }

    // Generate a JWT token including email, role, and source
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
        source: user.source,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error('Google Authentication Error:', error.response?.data?.error || error.message);
    res.redirect('/login'); 
  }
};

// Register
exports.register = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;
    const { error } = registerSchema.validate({ fullName, email, password });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const existingUser = await Profile.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already registered' });

    const profile = new Profile({ fullName, email, password, role });
    await profile.save();

    const { otp, hashedOtp } = await generateAndHashOTP();
    const otpPayload = { email, otp: hashedOtp, type: 'emailVerification', userId: profile._id };
    const data = new OTP(otpPayload);
    await data.save();

    await sendVerificationEmail(email, otp);
    console.log('OTP sent for email verification');
    
    res.status(201).json({ message: 'Profile created successfully and OTP sent' });
  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login
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

    const token = jwt.sign(
      {
        id: profile._id,
        name: profile.fullName,
        email: profile.email,
        role: profile.role,
        source: profile.source,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
