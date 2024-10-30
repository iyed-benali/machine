// app.js
const express = require('express');
const mongoose = require('./database/db');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile')
const auth = require('./middleware/auth');
const authorize = require('./middleware/authorize'); 
const otpRoute = require ('./routes/otp')
require('dotenv').config();


const app = express();
app.use(express.json());

app.use('/auth', authRoutes);
; 
app.use('/otp',otpRoute)




const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
