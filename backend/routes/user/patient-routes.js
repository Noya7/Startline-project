const express = require('express');

const {check} = require('express-validator');
const checkValidation = require('../../middleware/check-validation')
const {patientCheck, createAppointment} = require('../../controllers/patient-controllers')

const router = express.Router();

router.post('/check-availability', check('DNI').isNumeric().isLength({min: 8, max: 8}), checkValidation, patientCheck);

const test = (req, res, next) => {console.log('testing'); return next()}

router.post('/create-appointment', [
    check('medic').notEmpty().isMongoId(),
    check('area').notEmpty().isLength({min: 5, max: 32}),
    // check('date').notEmpty().isDate(),
    check('timeIndex').notEmpty().isInt({min: 0, max: 16})
], checkValidation, createAppointment)

module.exports = router;