// app.js
const express = require('express');
const mongoose = require('./database/db');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile')
const auth = require('./middleware/auth');
const authorize = require('./middleware/authorize'); 
require('dotenv').config();


const app = express();
app.use(express.json());

app.use('/auth', authRoutes);


app.use('/profile', auth, profileRoutes); 

app.get('/admin', auth, authorize('admin'), (req, res) => {
  res.status(200).json({ message: 'Welcome Admin!' });
});


app.get('/machine-owner', auth, authorize('machine owner'), (req, res) => {
  res.status(200).json({ message: 'Welcome Machine Owner!' });
});



const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
