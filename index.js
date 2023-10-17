const express = require("express");
const app = express();
const port = 8000;
const mongoose = require("mongoose");
// const db = require("./config/mongoose");
// const passportJWT = require('./config/passport-jwt');
const axios = require('axios')
const cors = require('cors');
app.use(cors());
app.use(express.json());       

app.use('/uploads' , express.static(__dirname + '/uploads'));
app.use(express.urlencoded({extended: true})); 
app.use('/', require('./routes'));
app.listen(port, (err) => {
  if (err) {
    return console.log("There is an error", err);
  }
  console.log(`Server is running on port ${port}`);
});