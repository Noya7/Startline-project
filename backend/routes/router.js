const express = require("express");
const HttpError = require("../models/http-error");
const adminRoutes = require('./admin-routes')
const medicRoutes = require('./medic-routes')
const patientRoutes = require('./patient-routes');
const { protectRoute } = require("../middleware/check-auth");

const router = express.Router()

const test = (req, res, next) =>{
    console.log("test")
    throw new HttpError("testing", 400)
}

router.post('/test', protectRoute, test)

router.use('/admin', adminRoutes)
router.use('/medic', medicRoutes)
router.use('/patient', patientRoutes)

module.exports = router;