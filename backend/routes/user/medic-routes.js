const express = require('express');

const {check} = require('express-validator')
const validationCheck = require('../../middleware/check-validation')

const {noAuthRoute} = require('../../middleware/check-auth')

const {medicSignupVerification, medicSignup, login} = require('../../controllers/auth-controllers')
const {getAppointments, getStatistics, createReport} = require('../../controllers/medic-controllers')

const router = express.Router()

//no auth routes:

router.post('/verify-code', noAuthRoute, [
    check('code').notEmpty(),
    check('matricula').notEmpty()
], validationCheck, medicSignupVerification)

router.post('/signup', noAuthRoute, [
    check('email').isEmail(),
    check('password').isStrongPassword({
        minLength: 6,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    }).isLength({max: 16}),
    check(['name', 'surname']).isLength({min: 3, max: 24}),
    check(['gender', "matricula", "position", "image"]).notEmpty(),
    // check('birthdate').isDate({format: "DD-MM-YYYY", strictMode: true}),
    check('DNI').notEmpty().isNumeric().isLength({min: 8, max: 8})
], validationCheck, medicSignup);

router.post('/login', noAuthRoute, [
    check('DNI').notEmpty().isNumeric().isLength({min: 8, max: 8}),
    check('password').notEmpty().isLength({min: 6, max: 16}),
], validationCheck, login('medic'));

//auth routes:

router.get('/appointments', getAppointments)
router.get('/stats', getStatistics)
router.post('/createReport', createReport)

module.exports = router;