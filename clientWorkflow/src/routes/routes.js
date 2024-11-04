// routes.js
const express = require('express');
const categories = require('../domains/category/categoriesRoutes');
const subCategories = require('../domains/subCategories/subCategoriesRoutes');
const vendingMachines = require('../domains/vending-machine/vending-machine-routes');
const products = require('../domains/products/product-routes');
const client = require('../domains/client/client-route');

const router = express.Router();

router.use('/category', categories); 
router.use('/sub-Category', subCategories);
router.use('/vending-machine', vendingMachines);
router.use('/product', products); 
router.use('/clients', client);

module.exports = router;
