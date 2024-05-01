const mongoose = require('mongoose')
const dayjs = require('dayjs')

const Appointment = require("../models/appointment");
const MedicalReport = require('../models/medical-report');
const Patient = require('../models/patient');
const Medic = require('../models/medic')
const Review = require('../models/review')
const HttpError = require('../models/http-error');

//function get appointments.

const getAppointments = async (req, res, next) =>{
    try {
        const {date, page} = req.query;
        const allAppointments = await Appointment.countDocuments({date, medic: req.userData.userId})
        const resultsPerPage = 9;
        const totalPages = Math.ceil(allAppointments / resultsPerPage)
        const startIndex = (page - 1) * resultsPerPage;
        const requestedFields = '_id timeIndex name surname existingPatient'
        const appointments = await Appointment.find({date, medic: req.userData.userId})
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
    const session = await mongoose.startSession()
    try {
        session.startTransaction()
        const {appointment, patient, motive, diagnosis, treatment} = req.body;
        const existingAppointment = await Appointment.findById(appointment, {existingPatient: 1, medicalReport: 1}, {session});
        if (!existingAppointment) throw new HttpError('El turno no existe o ha sido eliminado de la base de datos. Si crees que esto es un error, por favor comunicate con adminstracion.', 404);
        if (existingAppointment.medicalReport) throw new HttpError('Este turno ya tiene un reporte asociado. Podes editarlo, pero no craer dos reportes para el mismo turno.', 401);
        const createdReport = new MedicalReport({diagnosis, treatment,
            patient,
            motiveForConsultation: motive,
            observations: req.body.observations || null,
            date: new Date(),
            medic: req.userData.userId
        });
        //if there are image results, extraction and upload to firebase then get link:

        //saving and response:
        await createdReport.save({session})
        existingAppointment.medicalReport = createdReport.id;
        await existingAppointment.save({session})
        const existingPatient = await Patient.findByIdAndUpdate(patient, {$push: {medicalHistory: createdReport.id}}, {session, new: true})
        if (!existingPatient) throw new HttpError('Paciente eliminado u existente. Si crees que esto es un error, por favor comunicate con administracion.', 404)
        await session.commitTransaction()
        return res.status(201).json({message: "Reporte creado exitosamente!"})
    } catch (err) {
        await session.abortTransaction()
        return next(err)
    } finally {
        await session.endSession();
    }
}

//function get statistics. For this, first the average calculator function is declared:

const calculateAverageStats = (stats) => {
    if (!stats) return null;
    let avgStats = new Object;
    Object.keys(stats).forEach(date => {
        const ratings = stats[date];
        const average = ratings.reduce((accumulator, current) => accumulator + current, 0) / ratings.length;
        avgStats[date] = average;
    });
    return avgStats;
};

const getStatistics = async(req, res, next) =>{
    try {
        const { timeFrame } = req.query;
        const {userId} = req.userData;

        if (!["week", "month", "year"].includes(timeFrame)) throw new HttpError('Plazo de tiempo invalido. Por favor verifica este dato.', 400)
        const startDate = dayjs().startOf(timeFrame).toDate();
        const endDate = dayjs().endOf('year').toDate();

        // Obtener estadísticas de revisiones para el período especificado
        const reviews = await Review.find({reviewedMedic: userId, creationDate: { $gte: startDate, $lte: endDate }})
        .select('type rating creationDate');

        if(!reviews.length) return res.status(204).json({message: "No hay suficiente informacion para generar estadisticas"})

        // Procesar las revisiones para el gráfico
        let medicStats, patientStats = new Object;

        reviews.forEach(review => {
            // Agrupar revisiones por tipo (medico/paciente) y por tiempo
            const timeKey = dayjs(review.creationDate).format("YYYY-MM-DD");

            if (review.type === "medic") {
                if (!medicStats[timeKey]) medicStats[timeKey] = [];
                medicStats[timeKey].push(review.rating);
            } else if (review.type === "patient") {
                if (!patientStats[timeKey]) patientStats[timeKey] = [];
                patientStats[timeKey].push(review.rating);
            }
        });

        // Calcular el promedio de ratings por día
        const medicAverage = calculateAverageStats(medicStats);
        const patientAverage = calculateAverageStats(patientStats);

        return res.status(200).json({ medicAverage, patientAverage });
    } catch (err) {
        return next(err);
    }
}

//function colleague search:

const colleagueSearch = async (req, res, next) => {
    try {
        const { query, page, pageSize } = req.query;
        const regexQuery = new RegExp(query, 'i');
        const resultsPerPage = (parseInt(pageSize) >= 3 && parseInt(pageSize) <= 15) ? parseInt(pageSize) : 3;
        const pageNumber = parseInt(page) || 1;
        
        const results = await Medic.find({
            $or: [
                { name: { $regex: regexQuery } },
                { surname: { $regex: regexQuery } },
                { area: { $regex: regexQuery } },
            ]
        },)
        .select('name surname image area matricula gender')
        .limit(resultsPerPage).skip((pageNumber - 1) * resultsPerPage);

        if (!results.length) {
            return res.status(404).json({ message: "No se encontraron médicos que coincidan con la búsqueda." });
        }

        return res.status(200).json({results});
    } catch (err) {
        return next(err);
    }
}

module.exports = {getAppointments, getStatistics, createReport, colleagueSearch};