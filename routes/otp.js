const express = require('express');
const otpController = require('../controllers/otpController');
const router = express.Router();
router.post('/send-otp', otpController.sendOTP);
router.post('/verify-otp',otpController.verifyOTP)
router.post('/resend-otp', otpController.resendOTP);
router.post('/request-password-reset', otpController.requestPasswordReset);
router.post('/verify-password-reset-otp', otpController.verifyPasswordResetOTP);
router.post('/reset-password', otpController.resetPassword);
module.exports = router;
