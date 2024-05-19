const express = require('express');
const {check} = require('express-validator');
const {validationCheck, uppercaseField} = require('../middleware/check-validation')
const { protectRoute } = require('../middleware/check-auth');
const {createAppointment, deleteAppointment, getUnavailableAppointments, appointmentUserCheck, getAvailableAreas, getMedicsByArea, getAppointments} = require('../controllers/appointment-controllers')
const { reviewValidations, createReview } = require('../controllers/review-controllers');
const { getPatientAppointments, getMedicalHistory, getMedicalReport } = require('../controllers/patient-controllers');

const router = express.Router();

router.get('/available-areas', getAvailableAreas);

router.get('/available-medics', validationCheck([
    check('area').trim().notEmpty()
]), getMedicsByArea)

router.post('/unavailable-appointments', validationCheck([
    check('date').notEmpty().toDate().isISO8601(),
    check('medic').notEmpty().isMongoId()
]), getUnavailableAppointments)

router.post('/create-appointment', appointmentUserCheck, validationCheck([
    check('DNI').trim().isNumeric().isLength({min: 8, max: 8}),
    check(['name', 'surname']).customSanitizer(uppercaseField).isLength({min: 3, max: 24}),
    check('medic').notEmpty().isMongoId(),
    check('area').notEmpty().isLength({min: 5, max: 32}),
    check('date').notEmpty().toDate().isISO8601(),
    check('timeIndex').trim().notEmpty().isInt({min: 0, max: 17})
]), createAppointment)

router.use(protectRoute(true, 'patient'));

router.get('/appointments', validationCheck([
    check('page').notEmpty().isInt()
]), getAppointments)

router.delete('/delete-appointment', validationCheck([
    check('id').notEmpty().isMongoId()
]), deleteAppointment)

router.post('/create-review', validationCheck([
    check(['reviewedMedic', 'appointment']).notEmpty().isMongoId(),
    check('rating').trim().notEmpty().isInt({min: 1, max: 10}),
    check('review').trim().notEmpty().isLength({min: 25, max: 500}),
]), reviewValidations, createReview);

router.get('/get-medical-history', getMedicalHistory)

router.get('/get-report', validationCheck([
    check('reportId').notEmpty().isMongoId()
]), getMedicalReport)

module.exports = router;