const express = require("express");
const authRoutes = require('./auth-routes')
const adminRoutes = require('./admin-routes')
const medicRoutes = require('./medic-routes')
const patientRoutes = require('./patient-routes');

const { mailResetToken, resetPassword } = require("../controllers/auth-controllers");

const router = express.Router()

router.use('/auth', authRoutes)
router.use('/admin', adminRoutes)
router.use('/medic', medicRoutes)
router.use('/patient', patientRoutes)

module.exports = router;