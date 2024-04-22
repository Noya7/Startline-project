const express = require('express');

const {check} = require('express-validator');
const validationCheck = require('../middleware/check-validation')
const { protectRoute } = require('../middleware/check-auth');

const {appointmentUserCheck, firstAppointmentCheck, createAppointment, deleteAppointment, getUnavailableAppointments} = require('../controllers/appointment-controllers')
const {patientCheck, signup, login} = require('../controllers/auth-controllers');

const router = express.Router();

router.post('/signup', protectRoute(false), [
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
], validationCheck, signup("patient"));

router.post('/login', protectRoute(false), [
    check('DNI').trim().notEmpty().isNumeric().isLength({min: 8, max: 8}),
    check('password').notEmpty(),
], validationCheck, login('patient'));

router.post('/check-patient-availability', protectRoute(false), [
    check('DNI').trim().isNumeric().isLength({min: 8, max: 8})
], validationCheck, patientCheck);

router.post('/unavailable-appointments', [
    check('date').notEmpty().toDate().isISO8601(),
    check('medic').notEmpty().isMongoId()
], validationCheck, getUnavailableAppointments)

router.post('/create-appointment', appointmentUserCheck, [
    check('DNI').trim().isNumeric().isLength({min: 8, max: 8}),
    check(['name', 'surname']).trim().isLength({min: 3, max: 24}),
    check('medic').notEmpty().isMongoId(),
    check('area').notEmpty().isLength({min: 5, max: 32}),
    check('date').notEmpty().toDate().isISO8601(),
    check('timeIndex').notEmpty().isInt({min: 0, max: 17})
], validationCheck, firstAppointmentCheck, createAppointment)

router.delete('/delete-appointment', protectRoute(true, 'patient'), check('id').notEmpty().isMongoId(), validationCheck, deleteAppointment)
module.exports = router;