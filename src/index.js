// app.js
const express = require('express');
const mongoose = require('./database/db');
const authRoutes = require('./routes/authRouting');
const otpRoutes = require('./routes/otpRouting')

require('dotenv').config();


const app = express();
app.use(express.json());


app.use('/api', [authRoutes, otpRoutes]);



const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
