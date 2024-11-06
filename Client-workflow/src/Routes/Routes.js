// routes.js
const express = require('express');
const categories = require('../Domains/Category/Categories-routes');
const subCategories = require('../Domains/Sub-categories/Subcategories-routes');
const vendingMachines = require('../Domains/Vending-machine/VendingMachine-routes');
const products = require('../domains/Products/Product-routes');
const client = require('../domains/Client/Client-route');

const router = express.Router();

router.use('/category', categories); 
router.use('/sub-Category', subCategories);
router.use('/vending-machine', vendingMachines);
router.use('/product', products); 
router.use('/clients', client);

module.exports = router;
