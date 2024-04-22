require('dotenv').config()

const express = require("express");
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')

const {checkAuth} = require('./middleware/check-auth')
const {errorHandler} = require('./middleware/error-handler')

const router = require('./routes/router')

const app = express();
app.use(express.json(), cookieParser(), checkAuth)
app.use('/api', router)
app.use(errorHandler)

const startServer = async() => {
    try{
        await mongoose.connect(process.env.MONGODB_URI)
        app.listen(process.env.PORT)
    }catch(err){
        console.log(err)
    }
}
startServer();