require('dotenv').config()

const express = require("express");
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')

const {checkAuth} = require('./middleware/check-auth')

const app = express();

app.use(express.json())
app.use(cookieParser())
app.use(checkAuth)

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