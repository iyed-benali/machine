// app.js
const express = require('express');
const mongoose = require('./database/db');
const routes = require('./routes/routes')

require('dotenv').config();


const app = express();
app.use(express.json());


app.use('/api', routes);



const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
