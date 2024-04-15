const HttpError = require('../models/http-error')
const {validationResult} = require('express-validator')

const validationCheck = (req, res, next) => {
    try {
      //validacion:
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        let validationErrors = [];
        errors.errors.forEach((err) => {
          let { path } = err;
          validationErrors.push(path);
        });
        throw new HttpError(
          "Datos invalidos, por favor, corrige tus entradas e intenta de nuevo. Errores en: " + validationErrors.join(", "), 400)
      }

      return next();

    } catch (err) {
        if (err instanceof HttpError){
            res.status(err.code).json({error: err.message})
        }else{
            console.log(err)
            res.status(500).json({error: "Lo sentimos, ocurrió un error inesperado en el servidor y estamos trabajando para solucionarlo. Por favor, intenta de nuevo en unos minutos."})
        }
    }
};

module.exports = validationCheck;