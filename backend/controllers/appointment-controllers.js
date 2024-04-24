const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc")
const Appointment = require("../models/appointment");
const Patient = require('../models/patient')
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

//este check sirve para verificar que si el usuario esta tratando de sacar un turno solo con su DNI,
//sea su primer turno, de lo contrario indicarle que inicie sesion.

// const firstAppointmentCheck = async (req, res, next) =>{
//     try {
//         if (!req.userData){
//             const isNotFirstAppointment = await Appointment.findOne({DNI: req.body.DNI})
//             if (!!isNotFirstAppointment){
//                 throw new HttpError("Hay una cuenta registrada con tu DNI. Por favor, inicia sesion, y programa tu turno. Si olvidaste tu contraseña, podes recuperarla.", 400)
//             }
//         }
//         return next()
//     } catch (err) {
//         return next(err)
//     }
// }

//time validation: helper function que valida que la fecha ingresada para consultar o programar un turno no sea en el pasado,
//ni mas de 2 meses en el futuro.

const timeValidation = (date) => {
    //primero validar que la fecha no sea en el pasado.
    const isBeforeToday = dayjs(date).isBefore(dayjs().startOf('day'));
    if(isBeforeToday){throw new HttpError("No se pueden programar turnos en el pasado.", 400)}
    //Validar que la fecha este dentro del periodo de dos meses desde hoy.
    const maxDate = dayjs().add(2, "months");
    const isLaterThanMax = dayjs(date).isAfter(maxDate)
    if(isLaterThanMax){throw new HttpError("Lo sentimos, no programamos turnos con mas de dos meses de antelación.", 400)}
    return;
}

//get available appointments: dada una fecha (no mayor a dos meses) y un medico,
//devuelve los time index que no poseen un turno.

const getUnavailableAppointments = async (req, res, next) => {
    try {
        const {date, medic} = req.body
        timeValidation(date)
        //obtener los turnos disponibles para esa fecha:
        const takenAppointments = await Appointment.find({date: date, medic})
        //Verificamos si en esta fecha hay turnos tomados. Si esto no pasa, devolvemos null.
        if(takenAppointments.length === 0){
            return res.status(204).json({unavailableAppointments: null})
        }
        //si hay turnos tomados, entonces devolvemos un array con estos.
        const unavailableAppointments = takenAppointments.map(appointment => appointment.timeIndex);
        //respuesta
        return res.status(200).json({unavailableAppointments})
    } catch (err) {
        return next(err)
    }
}

//create appointment:

const createAppointment = async(req, res, next) => {
    try {
        const {userId, DNI, name, surname, date, timeIndex, area, medic} = req.body;
        //validacion de fecha:
        timeValidation(date)
        //conversion de fecha y time index a una sola fecha y hora:
        dayjs.extend(utc)
        let initialDate, finalDate;
        if (timeIndex >= 0 && timeIndex <= 9) {
            initialDate = dayjs(date).utcOffset(-3).add(8, 'hours');
            finalDate = dayjs(initialDate).utcOffset(-3).add((0.5 * timeIndex), 'hour');
        } else if (timeIndex >= 10 && timeIndex <= 17) {
            initialDate = dayjs(date).utcOffset(-3).add(14, 'hours');
            finalDate = dayjs(initialDate).utcOffset(-3).add((0.5 * (timeIndex - 10)), 'hour');
        } else {
            throw new HttpError('El horario escogido es invalido. Por favor, escoge un horario de la lista.', 401);
        }
        //verificar que no haya un appointment creado para esa fecha en ese time index:     
        const existingAppointment = await Appointment.findOne({fullDate: finalDate})        
        if (!!existingAppointment){
            throw new HttpError("Este turno no esta disponible, por favor elige un horario disponible e intenta de nuevo.", 409)
        }       
        //se procede a crear el appointment.        
        const createdAppointment = new Appointment({
            fullDate: finalDate,
            date: date,
            timeIndex: timeIndex,
            area, medic, name, surname, DNI,
            existingPatient: userId ? userId : undefined,
            creationDate: new Date()
        })      
        await createdAppointment.save();
        //agregar el appointment a los appointments del paciente, si este esta registrado:
        if(userId){
            await Patient.findByIdAndUpdate(userId, {$push : {appointments: new mongoose.Types.ObjectId(createdAppointment.id)}})
        }
        //respuesta:
        const successMessage = userId ?
        "Turno creado! Recorda que con tu cuenta podes gestionar tus turnos, diagnosticos y tratamientos." :
        "Turno creado! Te invitamos a crear una cuenta de paciente para gestionar tus turnos, diagnosticos y tratamientos."     
        return res.status(200).json({message: successMessage})
    } catch (err) {
        return next(err)
    }
}

//delete appointment:

const deleteAppointment = async (req, res, next) => {
    try {
        const appointment = await Appointment.findById(req.body.id);
        if(!appointment){throw new HttpError('Este turno fue eliminado o no existe.', 404)}
        const mongoUserId = new mongoose.Types.ObjectId(req.userData.userId)
        const isCreator = appointment.existingPatient.equals(mongoUserId) 
        if (!isCreator){throw new HttpError('No podes eliminar turnos que no te pertenecen.', 409)}
        await Appointment.findByIdAndDelete(req.body.id)
        await Patient.findByIdAndUpdate(req.userData.userId, {$pull: {appointments: new mongoose.Types.ObjectId(req.body.id)}})
        return res.status(204).json({message: "Turno eliminado."})
    } catch (err) {
        return next(err)
    }
}

module.exports = {appointmentUserCheck, createAppointment, deleteAppointment, getUnavailableAppointments}