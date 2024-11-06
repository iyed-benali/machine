
require('./config/db');
const express = require('express');
require('dotenv').config();
const app = express();
const routes = require('./routes/routes')
app.use(express.json());

app.use('/client-api',routes)



module.exports = app;