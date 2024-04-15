require('dotenv').config()

const express = require("express");
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')

const {checkAuth} = require('./middleware/check-auth')

const adminRoutes = require('./routes/user/admin-routes')
const medicRoutes = require('./routes/user/medic-routes')
const patientRoutes = require('./routes/user/patient-routes')

const app = express();

app.use(express.json())
app.use(cookieParser())
app.use(checkAuth)

app.use('/api/admin', adminRoutes)
app.use('/api/medic', medicRoutes)
app.use('/api/patient', patientRoutes)




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