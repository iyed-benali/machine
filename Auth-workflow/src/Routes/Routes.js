const express = require('express');
const otpRoutes = require('../domains/Otp/Otp-route');
const authRoutes = require('../domains/Auth/Auth-routes');
const router = express.Router();
router.use('/otp', otpRoutes);
router.use('/auth', authRoutes);

module.exports = router