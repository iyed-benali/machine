// routes/vendingMachineRoutes.js
const express = require('express');
const router = express.Router();
const vendingMachineController = require('./vending-machine-controllers');
const adminCheck = require('../../../../authWorkflow/src/middleware/authorize');
const filterUnblocked = require('../../../../authWorkflow/src/middleware/filter-unblocked')

router.post('/vending-machines', adminCheck,vendingMachineController.createVendingMachine);
router.get('/vending-machines', filterUnblocked,vendingMachineController.getAllVendingMachines);
router.get('/vending-machines/:id',filterUnblocked, vendingMachineController.getVendingMachineById);
router.put('/vending-machines/:id', vendingMachineController.updateVendingMachine);
router.delete('/vending-machines/:id', vendingMachineController.deleteVendingMachine);
router.get('/search',filterUnblocked, vendingMachineController.searchVendingMachines);
router.get('/coordinates', vendingMachineController.getAllVendingMachineCoordinates);
router.patch('/:machineId/toggle-block',  vendingMachineController.toggleBlockVendingMachine);



module.exports = router;
