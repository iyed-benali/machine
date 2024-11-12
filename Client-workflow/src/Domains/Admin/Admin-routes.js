const express = require('express');
const adminController = require('./Admin-controllers');
const router = express.Router();


router.post('/create', adminController.createAdmin);

module.exports = router;
