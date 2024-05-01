const express = require('express');

const {check} = require('express-validator');
const {validationCheck} = require('../middleware/check-validation');
const {enableMedicSignup} = require('../controllers/admin-controllers');
const { protectRoute } = require('../middleware/check-auth');

const router = express.Router()

router.use(protectRoute(true, 'admin'))

router.post('/code-generator', validationCheck([
    check('matricula').trim().notEmpty().isNumeric(),
    check('area').trim().notEmpty(),
    check('email').trim().isEmail()
]), enableMedicSignup)

module.exports = router;