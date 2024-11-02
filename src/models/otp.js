const mongoose = require('mongoose');
const mailSender = require("../utils/mailsender");

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['emailVerification', 'passwordReset'],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 5, // 5 minutes
  },
});

// Send verification email
async function sendVerificationEmail(email, otp) {
  try {
    const mailResponse = await mailSender(
      email,
      "Verification Email",
      `<h1>Please confirm your OTP</h1><p>Here is your OTP code: ${otp}</p>`
    );
    console.log("Email sent successfully: ", mailResponse);
  } catch (error) {
    console.log("Error occurred while sending email: ", error.message);
    throw error;
  }
}

otpSchema.pre("save", async function (next) {
  if (this.isNew && this.type === 'emailVerification') {
    await sendVerificationEmail(this.email, this.otp);
  }
  next();
});

module.exports = {
  OTP: mongoose.model("OTP", otpSchema),
  sendVerificationEmail
};
