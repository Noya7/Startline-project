const express = require('express');

const {check} = require('express-validator')
const validationCheck = require('../middleware/check-validation')

const {protectRoute} = require('../middleware/check-auth')

const {medicSignupVerification, signup, login} = require('../controllers/auth-controllers')
const {getAppointments, getStatistics, createReport} = require('../controllers/medic-controllers')

const router = express.Router()

//no auth routes:

router.post('/verify-code', protectRoute(false), [
    check('code').notEmpty(),
    check('matricula').notEmpty()
], validationCheck, medicSignupVerification)

router.post('/signup', protectRoute(false), [
    check('email').isEmail(),
    check('password').isStrongPassword({
        minLength: 6,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    }).isLength({max: 32}),
    check(['name', 'surname']).trim().isLength({min: 3, max: 24}),
    check(['gender', "matricula", "position", "image"]).trim().notEmpty(),
    check('birthDate').notEmpty().toDate().isISO8601(),
    check('DNI').trim().notEmpty().isNumeric().isLength({min: 8, max: 8})
], validationCheck, signup("medic"));

router.post('/login', protectRoute(false), [
    check('DNI').trim().notEmpty().isNumeric().isLength({min: 8, max: 8}),
    check('password').notEmpty(),
], validationCheck, login('medic'));

//auth routes:

router.get('/appointments', getAppointments)
router.get('/stats', getStatistics)
router.post('/createReport', createReport)

module.exports = router;