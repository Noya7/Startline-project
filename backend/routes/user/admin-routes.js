const express = require('express');

const {check} = require('express-validator');
const validationCheck = require('../../middleware/check-validation');

const {adminSignup, login} = require('../../controllers/auth-controllers')
const {enableMedicSignup} = require('../../controllers/admin-controllers');
const { noAuthRoute, protectRoute } = require('../../middleware/check-auth');


const router = express.Router()

//no auth routes

router.post('/signup', noAuthRoute, [
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

router.post('/login', noAuthRoute, [
    check('DNI').notEmpty().isNumeric().isLength({min: 8, max: 8}),
    check('password').notEmpty().isLength({min: 6, max: 16}),
], validationCheck, login('admin'));


//auth routes

router.post('/code-generator', protectRoute('admin'), [
    check('matricula').notEmpty().isNumeric(),
    check('email').isEmail()
], validationCheck, enableMedicSignup)

module.exports = router;