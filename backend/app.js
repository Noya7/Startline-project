require('dotenv').config()

const express = require("express");
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const {checkAuth} = require('./middleware/check-auth')
const {errorHandler} = require('./middleware/error-handler')

const router = require('./routes/router')

const app = express();

const corsOptions = {
    origin: true,
    credentials: true,
    optionsSuccessStatus: 200
};

app.options('*', cors(corsOptions));
app.use(express.json(), cors(corsOptions), cookieParser(), checkAuth)
app.use('/api', router)
app.use(errorHandler)

const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`) );
    } catch (err) {
        console.error('Error starting server:', err.message);
        return {
            error: 'Server Error',
            message: 'Ha ocurrido un error al iniciar el servidor. Err: ' + err.message
        };
    }
};

startServer();