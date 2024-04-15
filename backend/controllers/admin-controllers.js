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

        //validar que no haya un codigo activo creado para este medico:

        const hasActiveCode = await EnablingCode.findOne({matricula: matricula, status: "active"})

        if(!!hasActiveCode){
            throw new HttpError('ya hay un codigo activo para un medico con esta matricula', 400)
        }

        //crear codigo:

        const code = v4();

        //crear fecha de expiracion:

        const expDate = dayjs().add(2, 'day').toDate()

        //guardar en base de datos

        const createdCode = new EnablingCode({ matricula, email, code, expDate, status: "active" })

        await createdCode.save();

        //envio de codigo por mail mediante nodemailer:

        //respuesta:

        res.status(201).json({message: "codigo de registro creado con exito. El profesional ha sido notificado por mail."})

    } catch (err) {
        if (err instanceof HttpError){
            res.status(err.code).json({error: err.message});
        }else{
            res.status(500).json({error: "Lo sentimos, ocurrió un error inesperado en el servidor y estamos trabajando para solucionarlo. Por favor, intenta de nuevo en unos minutos."})
        }
    }
}

//generate appointment.


module.exports = {enableMedicSignup}