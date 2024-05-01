const express = require('express')
const multer = require('multer')
const {login, signup, mailResetToken, resetPassword, medicSignupVerification, patientCheck} = require('../controllers/auth-controllers')
const {validationCheck, uppercaseField} = require('../middleware/check-validation')
const {check} = require('express-validator')
const { protectRoute } = require('../middleware/check-auth')

const router = express.Router()
const upload = multer();

router.post('/signup', protectRoute(false), upload.single('image'), [
    validationCheck([
        check('usertype').notEmpty().isIn(['admin','medic','patient']),
        check('email').trim().isEmail(),
        check('password').isStrongPassword({
            minLength: 6,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        }).isLength({max: 32}),
        check(['name', 'surname']).customSanitizer(uppercaseField).isLength({min: 3, max: 24}),
        check('DNI').trim().notEmpty().isNumeric().isLength({ min: 8, max: 8 }),
        check('usertype').custom((value, {req}) => {
            if (value === 'medic') return [
                    check(['gender', "matricula", "area"]).trim().notEmpty(),
                    check('birthDate').notEmpty().toDate().isISO8601()
                ]
            return [
                check(['gender', "address"]).trim().notEmpty(),
                check('birthDate').notEmpty().toDate().isISO8601()
            ]
        })
    ])
], signup)

router.post('/login', protectRoute(false), validationCheck([
    check('DNI').trim().notEmpty().isNumeric().isLength({ min: 8, max: 8 }),
    check('password').notEmpty(),
]), login);

router.post('/reset-mail', validationCheck([
    check('DNI').trim().isNumeric().isLength({ min: 8, max: 8 })
]), mailResetToken)

router.post('/reset-password', validationCheck([
    check('password').isStrongPassword({
        minLength: 6,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    }).isLength({max: 32}),
    check('token').notEmpty()
]), resetPassword)

router.get('/verify-code', protectRoute(false), validationCheck([
    check('token').notEmpty(),
]), medicSignupVerification)

router.post('/patient-availability', protectRoute(false), validationCheck([
    check('DNI').trim().isNumeric().isLength({min: 8, max: 8})
]), patientCheck);


module.exports = router;