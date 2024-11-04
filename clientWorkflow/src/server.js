
const express = require('express');
const mongoose = require('../../authWorkflow/src/config/db');
require('dotenv').config();
const app = express();
const routes = require('./routes/routes')
app.use(express.json());

app.use('/client-api',routes)



module.exports = app;