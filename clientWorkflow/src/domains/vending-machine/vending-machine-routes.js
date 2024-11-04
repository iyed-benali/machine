// routes/vendingMachineRoutes.js
const express = require('express');
const router = express.Router();
const vendingMachineController = require('./vending-machine-controllers');

// CRUD routes for vending machines
router.post('/vending-machines', vendingMachineController.createVendingMachine);
router.get('/vending-machines', vendingMachineController.getAllVendingMachines);
router.get('/vending-machines/:id', vendingMachineController.getVendingMachineById);
router.put('/vending-machines/:id', vendingMachineController.updateVendingMachine);
router.delete('/vending-machines/:id', vendingMachineController.deleteVendingMachine);
router.get('/search', vendingMachineController.searchVendingMachines);
router.get('/coordinates', vendingMachineController.getAllVendingMachineCoordinates);


module.exports = router;
