const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc")
const Appointment = require("../models/appointment");
const Patient = require('../models/patient')
const Medic = require('../models/medic')
const HttpError = require("../models/http-error");
const mongoose = require("mongoose");

//function appointment user check: chequea si hay userData y la agrega al body para que luego sea validada.

const appointmentUserCheck = (req, res, next) => {
    try {
        if (!!req.userData && req.userData.userType === 'patient'){
            const {userId, DNI, name, surname} = req.userData;
            req.body = {...req.body, userId, DNI, name, surname}
        }
        return next()
    } catch (err) {
        return next(err)
    }
}

//getFullDate: dada una fecha y un time index, devuelve la fullDate:

const getFullDate = (date, timeIndex) => {
    dayjs.extend(utc);
    let initialDate, finalDate;
    if (timeIndex >= 0 && timeIndex <= 9) {
        initialDate = dayjs(date).utcOffset(-3).add(8, 'hours');
        finalDate = dayjs(initialDate).utcOffset(-3).add((0.5 * timeIndex), 'hour');
    } else if (timeIndex >= 10 && timeIndex <= 17) {
        initialDate = dayjs(date).utcOffset(-3).add(14, 'hours');
        finalDate = dayjs(initialDate).utcOffset(-3).add((0.5 * (timeIndex - 10)), 'hour');
    }
    return finalDate;
}

//time validation: helper function que valida que la fecha ingresada este en el constraint de tiempo.

const timeValidation = (date, timeIndex) => {
    const input = dayjs(date);
    //primero validar que la fecha no sea en el pasado.
    const inputFullDate = timeIndex ? getFullDate(input, timeIndex) : input;
    if (inputFullDate.isBefore(dayjs().add(-3, "hours"))) throw new HttpError("No se pueden programar turnos en el pasado.", 400)
    //Validar que la fecha este dentro del periodo de dos meses desde hoy.
    const maxDate = dayjs().add(2, "months");
    if (input.isAfter(maxDate)) throw new HttpError("Lo sentimos, no programamos turnos con mas de dos meses de antelación.", 400);
    if ([5, 6].includes(dayjs(date).day())) throw new HttpError("Lo sentimos, no programamos turnos en fines de semana.", 400)
    return;
}

//get available areas:

const getAvailableAreas = async (req, res, next) => {
    try{
        const areas = await Medic.distinct('area');
        if (!areas.length) return res.status(204).json({message: 'No hay areas disponibles para elegir.'});
        return res.status(200).json(areas)
    } catch (err) {
        return next(err)
    }
}

//get medics by area:

const getMedicsByArea = async (req, res, next) => {
    try{
        const {area} = req.query
        const medics = await Medic.find({area}).select('name surname matricula image');
        if (!medics.length) return res.status(204).json({message: 'No hay medicos disponibles para mostrar.'});
        return res.status(200).json(medics)
    } catch (err) {
        return next(err)
    }
}

//get available appointments: dada una fecha (no mayor a dos meses) y un medico,
//devuelve los time index que no poseen un turno.

const getUnavailableAppointments = async (req, res, next) => {
    try {
        const {date, medic} = req.body
        timeValidation(date)
        //validar que el medico exista:
        const existingMedic = await Medic.findById(medic, {DNI: 1});
        if (!existingMedic) throw new HttpError('El medico seleccionado no existe.', 404)
        //obtener los turnos disponibles para esa fecha:
        const takenAppointments = await Appointment.find({date: date, medic}, {fullDate: 1, date: 1, timeIndex: 1})
        //Verificamos si en esta fecha hay turnos tomados. Si esto no pasa, devolvemos null.
        if(!takenAppointments.length){
            return res.status(204).json({unavailableAppointments: null})
        }
        //si hay turnos tomados, entonces devolvemos un array con estos.
        const unavailableAppointments = takenAppointments.map(appointment => appointment.timeIndex);
        //respuesta
        return res.status(200).json(unavailableAppointments)
    } catch (err) {
        return next(err)
    }
}

//create appointment:

const createAppointment = async(req, res, next) => {
    const session = await mongoose.startSession()
    try {
        session.startTransaction()
        const {userId, DNI, name, surname, date, timeIndex, area, medic} = req.body;
        //validacion de fecha:
        timeValidation(date, timeIndex)
        //validar que el medico exista:
        const existingMedic = await Medic.findById(medic, {DNI: 1});
        if (!existingMedic) throw new HttpError('El medico seleccionado no existe.', 404)
        //conversion de fecha y time index a una sola fecha y hora:
        const fullDate = getFullDate(date, timeIndex)
        //verificar que no haya un appointment creado para el medico en esa fecha, en ese time index:
        const existingAppointment = await Appointment.findOne({fullDate, medic}, {fullDate: 1}); 
        if (existingAppointment){
            throw new HttpError("Este turno no esta disponible, por favor elige un horario disponible e intenta de nuevo.", 409)
        }
        //se verifica si el DNI ingresado tiene un usuario asociado. Si esto sucede, el turno se carga a su cuenta.
        const existingPatient = await Patient.findOne({DNI, name, surname}, {DNI: 1, name: 1, surname: 1})
        if (existingPatient && (existingPatient.name !== name || existingPatient.surname !== surname)){
            throw new HttpError('Ya existe un paciente registrado con este DNI, pero diferente nombre y apellido. Por favor, ingresa tus datos correctamente, o saca el turno iniciando sesion en tu cuenta de paciente.', 409)
        }
        //se procede a crear el appointment.
        const createdAppointment = await new Appointment({
            fullDate,
            date: date,
            timeIndex: timeIndex,
            area, medic, name, surname, DNI,
            existingPatient: userId ? userId : existingPatient ? existingPatient.id : null,
            creationDate: new Date()
        }).save({session})     
        //agregar el appointment a los appointments del paciente, si este esta registrado:
        if(userId || (existingPatient && existingPatient.id)){
            await Patient.findByIdAndUpdate(userId ? userId : existingPatient.id, {$push : {appointments: createdAppointment.id}}, {session})
        }
        //respuesta:
        const successMessage = userId ?
        "Turno creado! Recorda que con tu cuenta podes gestionar tus turnos, diagnosticos y tratamientos." :
        "Turno creado! Si aun no te registraste, te invitamos a crear una cuenta de paciente para gestionar tus turnos, diagnosticos y tratamientos."
        await session.commitTransaction()
        return res.status(200).json({message: successMessage})
    } catch (err) {
        await session.abortTransaction()
        return next(err)
    } finally {
        await session.endSession()
    }
}

//delete appointment:

const deleteAppointment = async (req, res, next) => {
    const session = await mongoose.startSession()
    try {
        session.startTransaction()
        const appointment = await Appointment.findById(req.query.id, {existingPatient: 1});
        if(!appointment) throw new HttpError('Este turno fue eliminado o no existe.', 404);
        const isCreator = appointment.existingPatient.equals(req.userData.userId) 
        if (!isCreator) throw new HttpError('No podes eliminar turnos que no te pertenecen.', 409);
        await Appointment.findByIdAndDelete(req.query.id, {session})
        await Patient.findByIdAndUpdate(req.userData.userId, {$pull: {appointments: req.query.id}}, {session})
        await session.commitTransaction()
        return res.status(200).json({message: "Turno eliminado."})
    } catch (err) {
        await session.abortTransaction()
        return next(err)
    } finally {
        await session.endSession()
    }
}

const getAppointments = async (req, res, next) => {
    try {
        //si es medico, no necesita page porque como maximo recibe 17 turnos por dia.
        if (req.userData.userType === 'medic'){
            const {date} = req.query;
            const appointments = await Appointment.find({medic: req.userData.userId, date})
            .select('fullDate date timeIndex name surname medicalReport existingPatient DNI')
            .sort({timeIndex: 1})
            return res.status(200).json(appointments)
        }
        //si es paciente, necesita page para paginar los resultados.
        if(!req.userData.userType === 'patient') throw new HttpError('Tipo de usuario invalido.', 403)
        let { page } = req.query;
        const allAppointments = await Appointment.countDocuments({ existingPatient: req.userData.userId });
        const resultsPerPage = 12;
        const totalPages = Math.ceil(allAppointments / resultsPerPage);
        if (page < 1) page = 1;
        else if (page > totalPages && !!totalPages) page = totalPages;
        const startIndex = (page - 1) * resultsPerPage;
        const requestedFields = 'fullDate area medic medicalReport review';
        const appointments = await Appointment.find({ existingPatient: req.userData.userId }).select(requestedFields)
        .populate({path: 'medic', select: 'name surname image'})
        .sort({fullDate: -1}).skip(startIndex).limit(resultsPerPage);
        if (!appointments.length) {
            return res.status(404).json({ message: "No hay ninguna cita en el historial. Si crees que esto es un error, por favor contactate con administracion." });
        }
        return res.status(200).json({ currentPage: +page, totalPages, appointments });
    } catch (err) {
        return next(err)
    }
}

module.exports = {appointmentUserCheck, getAvailableAreas, getMedicsByArea, createAppointment, deleteAppointment, getUnavailableAppointments, getAppointments}