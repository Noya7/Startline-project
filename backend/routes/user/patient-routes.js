const express = require('express');

const {check} = require('express-validator');
const checkValidation = require('../../middleware/check-validation')
const { noAuthRoute } = require('../../middleware/check-auth');

const {appointmentUserCheck, firstAppointmentCheck, createAppointment, deleteAppointment, getUnavailableAppointments} = require('../../controllers/appointment-controllers')
const {patientCheck} = require('../../controllers/patient-controllers');

const router = express.Router();

router.post('/check-patient-availability', noAuthRoute, [
    check('DNI').isNumeric().isLength({min: 8, max: 8})
], checkValidation, patientCheck);

router.post('/unavailable-appointments', [
    // check('date').notEmpty().isDate(),
    check('medic').notEmpty().isMongoId()
], getUnavailableAppointments)

router.post('/create-appointment', appointmentUserCheck, [
    check('DNI').isNumeric().isLength({min: 8, max: 8}),
    check(['name', 'surname']).isLength({min: 3, max: 24}),
    check('medic').notEmpty().isMongoId(),
    check('area').notEmpty().isLength({min: 5, max: 32}),
    // check('date').notEmpty().isDate(),
    check('timeIndex').notEmpty().isInt({min: 0, max: 16})
], checkValidation, firstAppointmentCheck, createAppointment)

module.exports = router;