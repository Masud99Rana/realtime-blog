
// external imports
const express = require('express');

const app = express();

const port = process.env.PORT || 5000;

app.get('/', function(req, res){
  return res.send('Hello Masud!');
})

app.listen(port, ()=> {
  console.log(`Server is running on port: ${port}`);
})