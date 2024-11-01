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
  async function generateAndHashOTP() {
    const otp = generateOTP(6);
    const hashedOtp = await bcrypt.hash(otp, 10);
    return { otp, hashedOtp };
  }
  
  
  exports.verifyOTP = async (req, res) => {
    try {
      const { email, otp } = req.body;
      const otpRecord = await OTP.findOne({ email });
      if (!otpRecord) return res.status(400).json({ message: 'Invalid or expired OTP' });
  
      const isMatch = await bcrypt.compare(otp, otpRecord.otp);
      if (!isMatch) return res.status(400).json({ message: 'Invalid or expired OTP' });
  
      await Profile.findOneAndUpdate({ email }, { isVerified: true });
      await OTP.deleteOne({ email });
      res.status(200).json({ message: 'Account verified successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };
  
exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await Profile.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const existingOtp = await OTP.findOne({ email });
    if (existingOtp && (Date.now() - existingOtp.createdAt.getTime()) < 60000) {
      return res.status(429).json({ message: 'Please wait a minute before requesting another OTP' });
    }

    const { otp, hashedOtp } = await generateAndHashOTP();
    await OTP.findOneAndUpdate(
      { email },
      { otp: hashedOtp, createdAt: Date.now() },
      { upsert: true }
    );

    await mailSender(email, 'Your OTP', `<h1>Your OTP is: ${otp}</h1>`);
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

    const { otp, hashedOtp } = await generateAndHashOTP();
    await OTP.findOneAndUpdate(
      { email, type: 'passwordReset' },
      { otp: hashedOtp, createdAt: Date.now(), type: 'passwordReset' },
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

