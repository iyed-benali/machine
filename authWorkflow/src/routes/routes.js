const express = require('express');
const otpRoutes = require('../domains/otp/otproute');
const authRoutes = require('../domains/auth/authRoutes');
const router = express.Router();
router.use('/otp', otpRoutes);
router.use('/auth', authRoutes);

module.exports = router