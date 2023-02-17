
// external imports
const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);


// Load env vars
// dotenv.config({ path: './config/config.env' });
// dotenv.config()
dotenv.config({ path: './backend/.env' });

// Internal imports
const connectDB = require('./config/db');




// Connect to database
connectDB();


// Route files




const app = express();

// Body parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const port = process.env.PORT || 5000;

app.get('/', function(req, res){
  return res.send('Hello Masud!');
})

app.listen(port, ()=> {
  console.log(`Server is running on port: ${port}`);
})