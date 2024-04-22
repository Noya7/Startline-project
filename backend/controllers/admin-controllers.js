const {v4} = require('uuid');
const dayjs = require('dayjs')

const EnablingCode = require('../models/enabling-code');
const Medic = require('../models/medic')

const HttpError = require('../models/http-error');

//function enable medic signup. Esta funcion carga la matricula de un nuevo medico de la institucion, junto con un codigo
// que tiene fecha de expiracion. este codigo debe enviarse al mail del nuevo medico, y sirve para que este pueda crear
//su cuenta de medico.

const enableMedicSignup = async (req, res, next) => {
    try {
        const {matricula, email} = req.body;
        //validar que no exista un medico con esta matricula ya registrado:
        const isExistingMedic = await Medic.findOne({matricula: matricula})
        if(!!isExistingMedic){
            throw new HttpError('Este numero de matricula ya esta registrado en la base de datos.', 409)
        }
        //verificar si existe un codigo creado para este medico:
        const existingCode = await EnablingCode.findOne({matricula: matricula})
        //si existe codigo, verificar su status. si esta activo, dar error. si esta expirado, borrarlo para generar otro.
        if(!!existingCode){
            switch(existingCode.status){
                case 'active' : {
                    //en este caso hay que verificar si el codigo no paso su fecha de expiracion sin uso, porque en
                    //ese caso, seguiria figurando como activo pero no seria realmente utilizable.
                    const codeHasExpired = dayjs().isAfter(existingCode.expDate);
                    if(!codeHasExpired){
                        throw new HttpError('ya hay un codigo activo para un medico con esta matricula.', 400);   
                    }else if(!!codeHasExpired){
                        await EnablingCode.findByIdAndDelete(existingCode.id);
                    }
                    break;
                }
                case 'expired' : {
                    await EnablingCode.findByIdAndDelete(existingCode.id);
                    break;
                }
            }
        }
        //si pasamos a esta etapa es porque no existe un codigo activo ni uno expirado.
        const code = v4();
        //crear fecha de expiracion:
        const expDate = dayjs().add(2, 'day').toDate()
        //guardar en base de datos
        const createdCode = new EnablingCode({ matricula, email, code, expDate, status: "active" })
        await createdCode.save();
        //envio de codigo por mail mediante nodemailer:
        //respuesta:
        return res.status(201).json({message: "codigo de registro creado con exito. El profesional ha sido notificado por mail."})
    } catch (err) {
        return next(err)
    }
}

module.exports = {enableMedicSignup}