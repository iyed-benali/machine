// app.js
const express = require('express');
const mongoose = require('./database/db');
const routes = require('./routes/routes')
const categories = require('../../clientWorkflow/src/domains/category/categoriesRoutes')
const subCat = require ('../../clientWorkflow/src/domains/subCategories/subCategoriesRoutes')
const vendingMachines = require('../../clientWorkflow/src/domains/vending-machine/vending-machine-routes');
const products = require('../../clientWorkflow/src/domains/products/product-routes')
const client = require('../../clientWorkflow/src/domains/client/client-route')
require('dotenv').config();


const app = express();
app.use(express.json());


app.use('/api', routes);
app.use('/cat',categories)
app.use('/sub',subCat)
app.use('/vending',vendingMachines)
app.use('/product', products); 
app.use('/search', client);


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
