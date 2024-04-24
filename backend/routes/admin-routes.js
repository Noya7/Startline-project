const express = require('express');

const {check} = require('express-validator');
const validationCheck = require('../middleware/check-validation');
const {signup, login} = require('../controllers/auth-controllers')
const {enableMedicSignup} = require('../controllers/admin-controllers');
const { protectRoute } = require('../middleware/check-auth');


const router = express.Router()

//no auth routes

router.post('/signup', protectRoute(false), validationCheck([
    check('email').isEmail(),
    check('password').isStrongPassword({
        minLength: 6,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    }).isLength({max: 32}),
    check(['name', 'surname']).trim().isLength({min: 3, max: 24}),
    check('DNI').trim().notEmpty().isNumeric().isLength(8)
]), signup("admin"))

router.post('/login', protectRoute(false), validationCheck([
    check('DNI').trim().notEmpty().isNumeric().isLength(8),
    check('password').notEmpty(),
]), login('admin'));


//auth routes

router.post('/code-generator', protectRoute(true, 'admin'), validationCheck([
    check('matricula').notEmpty().isNumeric(),
    check('email').isEmail()
]), enableMedicSignup)

module.exports = router;