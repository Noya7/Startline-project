const express = require('express');

const {check} = require('express-validator');
const validationCheck = require('../middleware/check-validation');

const {signup, login} = require('../controllers/auth-controllers')
const {enableMedicSignup} = require('../controllers/admin-controllers');
const { protectRoute } = require('../middleware/check-auth');


const router = express.Router()

//no auth routes

router.post('/signup', protectRoute(false), [
    check('email').isEmail(),
    check('password').isStrongPassword({
        minLength: 6,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    }).isLength({max: 32}),
    check(['name', 'surname']).trim().isLength({min: 3, max: 24}),
    check('DNI').trim().notEmpty().isNumeric().isLength(8)
], validationCheck, signup("admin"))

router.post('/login', protectRoute(false), [
    check('DNI').trim().notEmpty().isNumeric().isLength(8),
    check('password').notEmpty(),
], validationCheck, login('admin'));


//auth routes

router.post('/code-generator', protectRoute(true, 'admin'), [
    check('matricula').notEmpty().isNumeric(),
    check('email').isEmail()
], validationCheck, enableMedicSignup)

module.exports = router;