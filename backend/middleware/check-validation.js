const HttpError = require('../models/http-error')
const {validationResult} = require('express-validator')

//centralized validator middleware: takes a validation chain as parameter, returns an array that contains:
//The same validation chain + original validation check middleware.
//when express reads the returned array, it reads a middleware array, so it executes it normally.
//Although the code might seem confusing at first, it's not after you understand what is happening.

const validationCheck = (validations) => { return [...validations,
    (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()){
                let validationErrors = [];
                errors.errors.forEach((err) => {
                    let {path} = err;
                    validationErrors.push(path);
                });
                throw new HttpError(
                "Datos invalidos, por favor, corrige tus entradas e intenta de nuevo. Errores en: "
                + validationErrors.join(", "), 400)
            }
            return next();
        } catch (err) {
            return next(err)
        }
    }
]};

module.exports = validationCheck;