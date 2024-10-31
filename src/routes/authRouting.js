const express = require('express');
const authRoutes = require('../domains/auth/authRoutes');
const router = express.Router();

router.use('/auth', authRoutes);

module.exports = router;