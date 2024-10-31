const otpGenerator = require('otp-generator');
const {OTP} = require('../otp/otpModel');
const Profile = require('../auth/authModel')
const { sendVerificationEmail } = require('../otp/otpModel');
const mailSender = require('../../utils/mailsender')
const bcrypt = require('bcrypt');

exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
   
    const checkUserPresent = await Profile.findOne({ email });
    
   
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    let result = await OTP.findOne({ otp: otp });
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
      });
      result = await OTP.findOne({ otp: otp });
    }
    const otpPayload = { email, otp };
    const otpBody = await OTP.create(otpPayload);
    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      otp,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};
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

    // Generate new OTP
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    // Save OTP to the database, replacing any existing one
    await OTP.findOneAndUpdate(
      { email },
      { otp, createdAt: Date.now() },
      { upsert: true }
    );

    // Send the OTP via email
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

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    await OTP.create({ email, otp });
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
