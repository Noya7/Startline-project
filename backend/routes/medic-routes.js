const express = require('express');
const {check} = require('express-validator')

const {validationCheck, uppercaseFirst} = require('../middleware/check-validation')
const {protectRoute} = require('../middleware/check-auth')
const {getStatistics, createReport, colleagueSearch, editReport} = require('../controllers/medic-controllers');
const { createReview, reviewValidations } = require('../controllers/review-controllers');
const { getMedicalReport } = require('../controllers/patient-controllers');
const { getAppointments } = require('../controllers/appointment-controllers');

const router = express.Router()

router.use(protectRoute(true, "medic"))

router.get('/appointments', validationCheck([
    check('date').notEmpty().toDate().isISO8601(),
]), getAppointments)

router.get('/stats', getStatistics)

router.post('/create-report', validationCheck([
    check(["appointment"]).notEmpty().isMongoId(),
    check('DNI').trim().notEmpty().isNumeric().isLength({ min: 8, max: 8 }),
    check(["motive", "diagnosis", "treatment"]).notEmpty().customSanitizer(uppercaseFirst)
]), createReport)

router.patch('/edit-report', validationCheck([
    check(["report"]).notEmpty().isMongoId(),
    check(["motive", "diagnosis", "treatment"]).notEmpty().customSanitizer(uppercaseFirst)
]), editReport)

router.get('/get-report', validationCheck([
    check('reportId').notEmpty().isMongoId()
]), getMedicalReport)

router.post('/create-review', validationCheck([
    check('reviewedMedic').notEmpty().isMongoId(),
    check('rating').trim().notEmpty().isInt({min: 1, max: 10}),
    check('review').customSanitizer(uppercaseFirst).notEmpty().isLength({min: 25, max: 750})
]), reviewValidations, createReview);

router.get('/colleague-search', validationCheck([
    check('query').trim().notEmpty(),
]), colleagueSearch)

module.exports = router;