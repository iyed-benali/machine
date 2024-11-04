
const express = require('express');
const mongoose = require('./config/db');
const routes = require('./routes/routes')
require('dotenv').config();


const app = express();
app.use(express.json());


app.use('/auth-api', routes);


module.exports = app;