// routes/profile.js
const express = require('express');
const auth = require('../middleware/auth'); // Ensure middleware is imported
const { getProfile } = require('../controllers/profileController');

const router = express.Router();

    
router.get('/', auth, getProfile);

module.exports = router;
