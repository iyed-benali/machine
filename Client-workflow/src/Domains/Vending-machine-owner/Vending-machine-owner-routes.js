// routes/vendingMachineOwnerRoutes.js

const express = require('express');
const vendingMachineOwnerController = require('./Vending-machine-owner-controllers');
const router = express.Router();


router.get('/owner/:ownerId', vendingMachineOwnerController.getVendingMachinesByOwner)
router.post('/owner/:ownerId', vendingMachineOwnerController.createProduct)
router.delete('/remove/:vendingMachineId/:productId', vendingMachineOwnerController.removeProductFromVendingMachine);

module.exports = router;
