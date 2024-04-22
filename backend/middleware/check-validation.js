const HttpError = require('../models/http-error')
const {validationResult} = require('express-validator')

const validationCheck = (req, res, next) => {

  const errors = validationResult(req);
    
  if (!errors.isEmpty()) {

    let validationErrors = [];

    errors.errors.forEach((err) => {
      let { path } = err;
      validationErrors.push(path);
    });

    throw new HttpError("Datos invalidos, por favor, corrige tus entradas e intenta de nuevo. Errores en: " + validationErrors.join(", "), 400);
  
  }

  return next();
  
};

module.exports = validationCheck;