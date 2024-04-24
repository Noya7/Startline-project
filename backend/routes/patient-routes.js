const express = require('express');
const {check} = require('express-validator');
const validationCheck = require('../middleware/check-validation')
const { protectRoute } = require('../middleware/check-auth');
const {createAppointment, deleteAppointment, getUnavailableAppointments, appointmentUserCheck} = require('../controllers/appointment-controllers')
const {patientCheck, signup, login} = require('../controllers/auth-controllers');
const { reviewValidations, createReview } = require('../controllers/review-controllers');

const router = express.Router();

router.post('/signup', protectRoute(false), validationCheck([
    check('email').isEmail(),
    check('password').isStrongPassword({
        minLength: 6,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    }).isLength({max: 32}),
    check(['name', 'surname']).trim().isLength({min: 3, max: 24}),
    check(['gender', "address"]).trim().notEmpty(),
    check('birthDate').notEmpty().toDate().isISO8601(),
    check('DNI').trim().notEmpty().isNumeric().isLength({min: 8, max: 8})
]), signup("patient"));

router.post('/login', protectRoute(false), validationCheck([
    check('DNI').trim().notEmpty().isNumeric().isLength({min: 8, max: 8}),
    check('password').notEmpty(),
]), login('patient'));

router.post('/check-patient-availability', protectRoute(false), validationCheck([
    check('DNI').trim().isNumeric().isLength({min: 8, max: 8})
]), patientCheck);

router.post('/unavailable-appointments', validationCheck([
    check('date').notEmpty().toDate().isISO8601(),
    check('medic').notEmpty().isMongoId()
]), getUnavailableAppointments)

router.post('/create-appointment', appointmentUserCheck, validationCheck([
    check('DNI').trim().isNumeric().isLength({min: 8, max: 8}),
    check(['name', 'surname']).trim().isLength({min: 3, max: 24}),
    check('medic').notEmpty().isMongoId(),
    check('area').notEmpty().isLength({min: 5, max: 32}),
    check('date').notEmpty().toDate().isISO8601(),
    check('timeIndex').notEmpty().isInt({min: 0, max: 17})
]), createAppointment)

router.delete('/delete-appointment', protectRoute(true, 'patient'), validationCheck([
    check('id').notEmpty().isMongoId()
]), deleteAppointment)

router.post('/create-review', protectRoute(true, 'patient'), validationCheck([
    check(['reviewedMedic', 'appointment']).notEmpty().isMongoId(),
    check('rating').notEmpty().isInt({min: 1, max: 10}),
    check('review').notEmpty().isLength({min: 25, max: 500}),
]), reviewValidations, createReview)

module.exports = router;