const mongoose = require('mongoose')
const Appointment = require("../models/appointment");
const MedicalReport = require('../models/medical-report');
const Patient = require('../models/patient')

//function get appointments.

const getAppointments = async (req, res, next) =>{
    try {
        const {date, page} = req.query;
        const allAppointments = await Appointment.countDocuments({date, medic: new mongoose.Types.ObjectId(req.userData.userId)})
        const resultsPerPage = 9;
        const totalPages = Math.ceil(allAppointments / resultsPerPage)
        const startIndex = (page - 1) * resultsPerPage;
        const requestedFields = '_id timeIndex name surname existingPatient'
        const appointments = await Appointment.find({date, medic: new mongoose.Types.ObjectId(req.userData.userId)})
        .skip(startIndex).limit(resultsPerPage).select(requestedFields)
        if(!appointments.length){
            return res.status(204).json({message: "No hay turnos programados en esta fecha."})
        }
        return res.status(200).json({totalPages, appointments})
    } catch (err) {
        return next(err)
    }
}

//function create medical report.

const createReport = async(req, res, next) =>{
    try {
        const {appointment, patient, motive, diagnosis, treatment} = req.body;
        const createdReport = new MedicalReport({diagnosis, treatment,
            patient: new mongoose.Types.ObjectId(patient),
            motiveForConsultation: motive,
            observations: req.body.observations || null,
            date: new Date(),
            medic: new mongoose.Types.ObjectId(req.userData.userId)
        });
        //if there are image results, extraction and upload to firebase then get link:

        //saving and response:
        await createdReport.save()
        await Appointment.findByIdAndUpdate(appointment, {$set: {medicalReport: new mongoose.Types.ObjectId(createdReport.id)}})
        await Patient.findByIdAndUpdate(patient, {$push: {medicalHistory: new mongoose.Types.ObjectId(createdReport.id)}})
        return res.status(201).json({message: "Reporte creado exitosamente!"})
    } catch (err) {
        return next(err)
    }
}

//function get statistics.

const getStatistics = async(req, res, next) =>{}

module.exports = {getAppointments, getStatistics, createReport};