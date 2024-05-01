const express = require('express');
const {check} = require('express-validator')

const {validationCheck, uppercaseFirst} = require('../middleware/check-validation')
const {protectRoute} = require('../middleware/check-auth')
const {getAppointments, getStatistics, createReport, colleagueSearch} = require('../controllers/medic-controllers');
const { createReview, reviewValidations } = require('../controllers/review-controllers');

const router = express.Router()

router.use(protectRoute(true, "medic"))

router.get('/appointments', validationCheck([
    check('date').notEmpty().toDate().isISO8601(),
    check('page').notEmpty().isInt({min: 1, max: 2})
]), getAppointments)

router.get('/stats', validationCheck([
    check('timeFrame').notEmpty().isIn(["week", "month", "year"])
]), getStatistics)

router.post('/create-report', validationCheck([
    check(["appointment", "patient"]).notEmpty().isMongoId(),
    check(["motive", "diagnosis", "treatment"]).customSanitizer(uppercaseFirst).notEmpty()
]), createReport)

router.post('/create-review', validationCheck([
    check('reviewedMedic').notEmpty().isMongoId(),
    check('rating').trim().notEmpty().isInt({min: 1, max: 10}),
    check('review').customSanitizer(uppercaseFirst).notEmpty().isLength({min: 25, max: 750})
]), reviewValidations, createReview);

router.get('/colleague-search', validationCheck([
    check('query').trim().notEmpty(),
]), colleagueSearch)

module.exports = router;