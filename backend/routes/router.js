const express = require("express");
const authRoutes = require('./auth-routes')
const adminRoutes = require('./admin-routes')
const medicRoutes = require('./medic-routes')
const patientRoutes = require('./patient-routes');

const { mailResetToken, resetPassword } = require("../controllers/auth-controllers");

//boot controller, since the BE needs to be booted up when using Render:
const bootController = async (req, res, next) => {res.status(200).json({message: "The server is up!"})}

const router = express.Router()

router.get('/boot', bootController)
router.use('/auth', authRoutes)
router.use('/admin', adminRoutes)
router.use('/medic', medicRoutes)
router.use('/patient', patientRoutes)

module.exports = router;