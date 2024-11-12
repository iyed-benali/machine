// routes/vendingMachineOwnerRoutes.js

const express = require('express');
const vendingMachineOwnerController = require('./Vending-machine-owner-controllers');
const router = express.Router();

// Route to create a new vending machine owner
router.post('/create', vendingMachineOwnerController.createVendingMachineOwner);

module.exports = router;
