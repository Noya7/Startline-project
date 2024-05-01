const jwt = require('jsonwebtoken');
const HttpError = require('../models/http-error');

const checkAuth = (req, res, next) => {
    try {
        if(req.cookies.token){
            const decodedToken = jwt.verify(req.cookies.token, process.env.MY_SECRET, (err, decoded) => {
                if (err) throw new HttpError("Error en la verificacion de token: " + err.message, 401);
                return decoded
            });
            req.userData = {...decodedToken};
        }        
        return next();
    } catch (err) {return next(err)}
}

const protectRoute = (routeProtection, userType) => {
    return (req, res, next) => {
        try {
            if(routeProtection){
                if(!req.userData || req.userData.userType !== userType){
                    throw new HttpError(req.userData ?
                        "No estas autorizado para acceder a esta ruta.":
                        "No puedes realizar esta accion sin autenticarte primero. Por favor, inicia sesion o registrate e intenta de nuevo."
                        , 401)
                }
                return next()
            }
            if(req.userData){
                throw new HttpError("No puedes realizar esta accion porque ya iniciaste sesion.", 401)
            }
            return next()
        } catch (err) {return next(err)}
    }
}

module.exports = {checkAuth, protectRoute}