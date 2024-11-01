const otpGenerator = require('otp-generator');
const {OTP} = require('../../models/otpModel');
const Profile = require('../../models/authModel')
const { sendVerificationEmail } = require('../../models/otpModel');
const mailSender = require('../../utils/mailsender')
const bcrypt = require('bcrypt');

function generateOTP(length = 6) {
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += Math.floor(Math.random() * 10); 
    }
    return otp;
  }
  
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    console.log(req.body)
    console.log(OTP)
    console.log(Profile)

   
    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    await Profile.findOneAndUpdate({ email }, { isVerified: true });
    await OTP.deleteOne({ email, otp });
    res.status(200).json({ message: 'Account verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
exports.resendOTP = async (req, res) => {
    try {
      const { email } = req.body;
  
      // Check if the user exists
      const user = await Profile.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const existingOtp = await OTP.findOne({ email });
      if (existingOtp && (Date.now() - existingOtp.createdAt.getTime()) < 60000) {
        return res.status(429).json({ message: 'Please wait a minute before requesting another OTP' });
      }
  
      const otp = generateOTP(6);
      await OTP.findOneAndUpdate(
        { email },
        { otp, createdAt: Date.now() },
        { upsert: true }
      );
  
      await sendVerificationEmail(email, otp);
  
      res.status(200).json({ message: 'OTP resent successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  exports.requestPasswordReset = async (req, res) => {
    try {
      const { email } = req.body;
      const user = await Profile.findOne({ email });
      if (!user) return res.status(404).json({ message: 'Email not found' });
  
      const existingOtp = await OTP.findOne({ email, type: 'passwordReset' });
      if (existingOtp && (Date.now() - existingOtp.createdAt.getTime()) < 60000) {
        return res.status(429).json({ message: 'Please wait a minute before requesting another OTP' });
      }
  
      const otp = generateOTP(6);
      await OTP.findOneAndUpdate(
        { email },
        { otp, createdAt: Date.now(), type: 'passwordReset' },
        { upsert: true }
      );
  
      await mailSender(email, 'Password Reset OTP', `<h1>Your OTP is: ${otp}</h1>`);
      res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  
  exports.verifyPasswordResetOTP = async (req, res) => {
    try {
      const { email, otp } = req.body;
  
      const otpRecord = await OTP.findOne({ email, otp });
      if (!otpRecord) return res.status(400).json({ message: 'Invalid or expired OTP' });
  
      await OTP.deleteOne({ email, otp });
      res.status(200).json({ message: 'OTP verified, proceed to reset password' });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  exports.resetPassword = async (req, res) => {
    try {
      const { email, newPassword } = req.body;
  
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await Profile.findOneAndUpdate({ email }, { password: hashedPassword });
  
      res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };

