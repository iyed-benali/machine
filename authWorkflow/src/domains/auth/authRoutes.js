// routes/auth.js
const express = require('express');
const { register, login,googleLogin,googleCallback } = require('./authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/google', googleLogin);



module.exports = router;
