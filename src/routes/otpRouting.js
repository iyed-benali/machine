const express = require('express');
const otpRoutes = require('../domains/otp/otproute');
const router = express.Router();

router.use('/otp', otpRoutes);

module.exports = router;