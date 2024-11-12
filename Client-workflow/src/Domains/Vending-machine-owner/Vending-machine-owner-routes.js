// routes/vendingMachineOwnerRoutes.js

const express = require('express');
const vendingMachineOwnerController = require('./Vending-machine-owner-controllers');
const router = express.Router();


router.get('/:ownerId', vendingMachineOwnerController.getVendingMachinesByOwner)
router.post('/owner/:ownerId', vendingMachineOwnerController.createProduct)
router.delete('/remove/:vendingMachineId/:productId', vendingMachineOwnerController.removeProductFromVendingMachine);
router.post('/vending-machine/category', vendingMachineOwnerController.createCategoryAndAddToVendingMachine);
router.post('/vending-machine/sub-category', vendingMachineOwnerController.createSubCategoryAndAddToVendingMachine);


module.exports = router;
