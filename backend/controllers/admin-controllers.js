const {v4} = require('uuid');
const dayjs = require('dayjs')
const jwt = require('jsonwebtoken')
const mail = require('../mail/mail');

const EnablingCode = require('../models/enabling-code');
const Medic = require('../models/medic')
const HttpError = require('../models/http-error');
const mongoose = require('mongoose');

//function enable medic signup. Esta funcion carga la matricula de un nuevo medico de la institucion, junto con un codigo
// que tiene fecha de expiracion. este codigo debe enviarse al mail del nuevo medico, y sirve para que este pueda crear
//su cuenta de medico.

const enableMedicSignup = async (req, res, next) => {
    const session = await mongoose.startSession()
    try {
        session.startTransaction()
        const {matricula, email, area} = req.body;
        //validar que no exista un medico con esta matricula o email ya registrado:
        const isExistingMedic = await Medic.findOne({$or: [{matricula},{email}]}, {matricula: 1})
        if(isExistingMedic) throw new HttpError('Ya hay un usuario registrado en la base de datos con estas credenciales.', 409)
        //verificar si existe un codigo creado para este medico:
        const existingCode = await EnablingCode.findOne({matricula: matricula}, {expDate: 1})
        //si existe codigo, verificar su expDate. si esta activo, dar error. si esta expirado, borrarlo para generar otro.
        if(existingCode && !dayjs().isAfter(existingCode.expDate)){
            throw new HttpError('ya hay un codigo activo para un medico con esta matricula.', 409);
        }else if (existingCode) await EnablingCode.findByIdAndDelete(existingCode.id, {session});
        //si pasamos a esta etapa es porque no existe un codigo activo ni uno expirado.
        //generamos un token con expiracion en 2 dias:
        const token = jwt.sign({matricula, area}, process.env.RESET_SECRET, {expiresIn: 3600*48})
        const url = `${process.env.FRONTEND_URL}/auth/signup/medic?token=${token}`
        //guardar en base de datos
        await new EnablingCode({ matricula, email, expDate: dayjs().add(2,'days'), isActive: true }).save({session})
        //envio de codigo por mail mediante nodemailer:
        mail.medicalAuthCode(email, url)
        //respuesta:
        await session.commitTransaction()
        return res.status(201).json({message: "codigo de registro creado con exito. El profesional ha sido notificado por mail."})
    } catch (err) {
        await session.abortTransaction()
        return next(err)
    } finally {
        await session.endSession()
    }
}

module.exports = {enableMedicSignup}