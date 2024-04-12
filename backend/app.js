require('dotenv').config()

const express = require("express");
const mongoose = require('mongoose')

const app = express();

app.use(express.json())

const startServer = async() => {
    const mongoURI = process.env.MONGODB_URI;
    const port = process.env.PORT;

    try{
        await mongoose.connect(mongoURI)
        app.listen(port)
    }catch(err){
        console.log(err)
    }
}

startServer();