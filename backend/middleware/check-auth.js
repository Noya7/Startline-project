const jwt = require('jsonwebtoken');
const HttpError = require('../models/http-error');

const checkAuth = (req, res, next) => {
    try {
        //ver si hay token
    const token = req.cookies && req.cookies.token
    //si no hay token, next
    if(!token){
        req.userData = null
        return next()
    }
    //verificar token
    const decodedToken = jwt.verify(token, process.env.MY_SECRET, (err, decoded) => {
        if (err) throw new HttpError("Error en la verificacion de token: " + err, 400);
        return decoded
    });
    //se agrega a userData la info del token.
    req.userData = {...decodedToken};
    return next();
    } catch (err) {return next(err)}
}

const protectRoute = (routeProtection, userType) => {
    return (req, res, next) => {
        try {
            switch(routeProtection){
                case true : {
                    if(!req.userData){
                        throw new HttpError("No puedes realizar esta accion sin autenticarte primero. Por favor, inicia sesion o registrate e intenta de nuevo.", 401)
                    }
                    //ver que user type coincida con el parametro:
                    if (req.userData.userType !== userType){
                        throw new HttpError("No estas autorizado para acceder a esta ruta.", 401)
                    }
                    return next();
                }
                case false : {
                    //si hay userData, throw:
                    if(!!req.userData){
                        throw new HttpError("No puedes realizar esta accion porque ya iniciaste sesion.", 401)
                    }
                    return next();
                }
                default : throw new HttpError("tipo de proteccion invalido para la ruta.", 500)
            }
        } catch (err) {return next(err)}
    }
}

module.exports = {checkAuth, protectRoute}