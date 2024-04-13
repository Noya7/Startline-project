const jwt = require('jsonwebtoken');

const httpError = require('../models/http-error')

const checkAuth = (req, res, next) => {
    try{
        const token = req.cookies.token;
        if(!token){
            req.userData = null
            console.log("no token")
            return next()
        }
        console.log("there's a token")

        const decodedToken = jwt.verify(token, process.env.MY_SECRET);
        req.userData = { userId: decodedToken.userId, userType: decodedToken.userType};
        next();
    }catch(err){
        res.status(500).json({error: "Lo sentimos, ha ocurrido un error interno en el servidor y estamos trabajando para arreglarlo. Por favor, intenta de nuevo en unos minutos. Error: " + err.message})
        return next()
    }
}

const protectRoute = (req, res, next) => {
    if(!!req.userData){
        return next()
    }else{
        res.status(401).json({error: "No puedes realizar esta accion sin autenticarte primero. Por favor, inicia sesion o registrate e intenta de nuevo."})
        return next();
    }
}

module.exports = {checkAuth, protectRoute}