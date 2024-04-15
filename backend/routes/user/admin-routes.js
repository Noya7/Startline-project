const express = require('express');

const {check} = require('express-validator');
const validationCheck = require('../../middleware/check-validation');

const {adminSignup} = require('../../controllers/auth-controllers')
const {enableMedicSignup} = require('../../controllers/admin-controllers')


const router = express.Router()

router.post('/signup', [
    check('email').isEmail(),
    check('password').isStrongPassword({
        minLength: 6,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    }).isLength({max: 16}),
    check(['name', 'surname']).isLength({min: 3, max: 24}),
    check('DNI').notEmpty().isNumeric().isLength({min: 8, max: 8})
], validationCheck, adminSignup)

router.post('/code-generator', [
    check('matricula').notEmpty().isNumeric(),
    check('email').isEmail()
], validationCheck, enableMedicSignup)

module.exports = router;