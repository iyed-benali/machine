
require('dotenv').config();
const express = require('express');
 require('./config/db');
const routes = require('./routes/routes')


const app = express();
app.use(express.json());


app.use('/auth-api', routes);


module.exports = app;