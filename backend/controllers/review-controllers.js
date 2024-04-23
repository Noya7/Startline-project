const mongoose = require('mongoose');
const Review = require('../models/review');
const Medic = require('../models/medic');
const Appointment = require('../models/appointment');
const HttpError = require('../models/http-error');
const dayjs = require('dayjs');
const { MongoServerError } = require('mongodb');

const reviewValidations =  async (req, res, next) => {
    try {
        const {userType, userId} = req.userData
        const {reviewedMedic} = req.body
        //validar que el medico en cuestion exista:
        const medicExists = await Medic.findById(reviewedMedic)
        if(!medicExists){throw new HttpError("El usuario seleccionado no existe.", 404)}
        //Si user es medico, validar que no haya realizado un review de este mismo medico en los ultimos 2 meses:
        if(userType === 'medic'){
            const recentReview = await Review.findOne({
                reviewedMedic: new mongoose.Types.ObjectId(reviewedMedic),
                reviewingMedic: new mongoose.Types.ObjectId(userId)
            }).select('creationDate');
            if(recentReview){
                const enoughTimePassed = dayjs().isAfter(dayjs(recentReview).add(2, 'months'))
                if(!enoughTimePassed){throw new HttpError("No pasó tiempo suficiente desde tu ultima revision de este medico. Solo podes realizar una revision por medico cada 2 meses.", 400)}
            }
            return next()
        }
        //si user es paciente, validar:
        if(userType === 'patient'){
            //que no haya hecho una revision de este appointment.
            const existingReview = await Review.findOne({appointment: req.body.appointment});
            if (existingReview){throw new HttpError("Este turno ya tiene asignada una revision. No podes crear mas de una revision por turno.", 409)}
            //que el appointment le pertenezca y que no haya pasado mas de un mes, ni que estemos antes del appointment.
            const existingAppointment = await Appointment.findById(req.body.appointment).select('fullDate existingPatient');
            const mongoUserId = new mongoose.Types.ObjectId(req.userData.userId)
            const isCreator = existingAppointment.existingPatient.equals(mongoUserId)
            if(!isCreator){throw new HttpError("No podes hacer una revision de un turno que no te pertenece.", 401)}
            const isTooLate = dayjs().isAfter(dayjs(existingAppointment.fullDate).add(1, 'month'));
            const isTooSoon = dayjs().isBefore(dayjs(existingAppointment.fullDate))
            if(isTooSoon || isTooLate){
                throw new HttpError(
                    `Estas fuera del rango de tiempo para crear una revision de este turno: ${isTooSoon
                        ? 'Demasiado pronto, la reunion aun no sucedió.'
                        : 'Demasiado tarde, la reunion fue hace mas de un mes.'}`, 400
                    )
            }
            return next()
        }
    } catch (err) {
        return next(err)
    }
}


const createReview = async (req, res, next) => {
    try {
        //obtener valores globales:
        const {reviewedMedic, rating, review} = req.body;
        const {userType, userId} = req.userData
        //creacion de review:
        const createdReview = new Review({rating, review, type: userType, creationDate: new Date(), reviewedMedic: new mongoose.Types.ObjectId(reviewedMedic)})
        //switch para extraer datos de cada tipo:
        switch(userType){
            case('patient') : {
                createdReview.appointment = new mongoose.Types.ObjectId(req.body.appointment)
                break;
            }
            case('medic') : {
                createdReview.reviewingMedic = new mongoose.Types.ObjectId(userId);
                break;
            }
            default : throw new HttpError("Tipo de usuario invalido.", 400)
        }
        //guardar y actualizar documentos implicados:
        await createdReview.save();
        await Medic.findByIdAndUpdate(reviewedMedic, {$push: {reviews: new mongoose.Types.ObjectId(createdReview.id)}})
        if(userType === "patient"){
            await Appointment.findByIdAndUpdate(req.body.appointment ,{$set: {review: new mongoose.Types.ObjectId(createdReview.id)}})
        }
        //respuesta:
        return res.status(201).json({message: "Revisión creada exitosamente!"})
    } catch (err) {
        if (err instanceof MongoServerError && err.code === 11000){
            return next(new HttpError("Este turno ya tiene asignada una revision. Si queres, podes modificarla, pero no podes crear mas de una revision por turno.", 409))
        }
        return next (err)
    }
}


module.exports = {reviewValidations, createReview}