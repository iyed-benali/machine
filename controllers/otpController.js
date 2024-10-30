const otpGenerator = require('otp-generator');
const OTP = require('../model/otp');
const Profile = require('../model/profile');

exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
   
    const checkUserPresent = await Profile.findOne({ email });
    
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: 'User is already registered',
      });
    }
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
    const { email, otp } = req.body;
  
    try {
      const otpRecord = await OTP.findOne({ email, otp });
      if (!otpRecord) {
        return res.status(400).json({ message: 'Invalid OTP' });
      }
  
      // Mark the profile as verified
      await Profile.findOneAndUpdate({ email }, { isVerified: true });
      await OTP.deleteMany({ email }); // Optionally delete all OTPs for this email
  
      res.status(200).json({ message: 'Account verified successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };