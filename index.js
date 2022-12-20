const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');

//configure dotenv to use and retrieve needs
dotenv.config();
const uriString = process.env.MONGO_URL1 + process.env.MONGO_PASS + process.env.MONGO_URL2;
const listenPort = process.env.PORT;

// set mongoose strictquering to true
mongoose.set('strictQuery', true);

// connect to db
mongoose.connect(uriString)
        .then(() => console.log("Connection Mongoose Established"))
        .catch((err) => console.log(uriString));

// listen for changes on port
app.listen( process.env.PORT || 5000, ()=>{
    console.log("Megatron Backend is Running Live");
})