const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');

const checkAuth = (req, res, next) => {
    try{
        const token = req.cookies.token;
        if(!token){
            req.userData = null
            return next()
        }
        const decodedToken = jwt.verify(token, process.env.MY_SECRET);
        req.userData = { userId: decodedToken.userId, userType: decodedToken.userType};
        return next();
    }catch(err){
        res.status(500).json({error: "Lo sentimos, ha ocurrido un error interno en el servidor y estamos trabajando para arreglarlo. Por favor, intenta de nuevo en unos minutos. Error: " + err.message})
    }
}

const protectRoute = (userType) => {
    return (req, res, next) => {
        try {
            //ver si hay userData:

            if(!req.userData){
                throw new HttpError("No puedes realizar esta accion sin autenticarte primero. Por favor, inicia sesion o registrate e intenta de nuevo.", 401)
            }

            //ver que user type coincida con el parametro:

            if (req.userData.userType !== userType){
                throw new HttpError("No estas autorizado para acceder a esta ruta.", 401)
            }else{
                return next()
            }
        } catch (err) {
            if (err instanceof HttpError){
                res.status(err.code).json({error: err.message})
            }
        }
    }
}

const noAuthRoute = (req, res, next) => {
    if(!!req.userData){
        res.status(401).json({error: "No puedes realizar esta accion porque ya iniciaste sesion."})
    }else{
        return next();
    }
}

module.exports = {checkAuth, protectRoute, noAuthRoute}