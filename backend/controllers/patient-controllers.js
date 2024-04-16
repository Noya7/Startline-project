const Patient = require('../models/patient')
const Appointment = require('../models/appointment');
const HttpError = require('../models/http-error');

//signup availability check: primer paso del signup, checkea que el usuario este registrado en algun turno.

const patientCheck = async(req, res, next) =>{
    try {

        const {DNI} = req.body;

    //busqueda en base de datos para ver si el usuario no esta registrado aun.
        const existingPatient = await Patient.findOne({DNI: DNI});
        if(!!existingPatient){
            throw new HttpError("Ya estas registrado como paciente, por favor, inicia sesion o recupera tu contraseña si la olvidaste.", 400)
        }

    //busqueda en base de datos para ver si el dni esta registrado en algun turno.

        const existingAppointment = await Appointment.findOne({DNI: DNI});
        if(!existingAppointment){
            throw new HttpError("Tu DNI no esta registrado en nuestra base de datos, no puedes crear una cuenta de paciente sin tener turnos para gestionar.", 404)
        }

    //respuesta positiva, el front redirige a form de registro de paciente.

        res.status(200).json({message: "Disponible para creacion de usuario paciente."})

    } catch (err) {
        if (err instanceof HttpError){
            res.status(err.code).json({error: err.message})
        }else{
            console.log(err)
            res.status(500).json({error: "Lo sentimos, ocurrió un error inesperado en el servidor y estamos trabajando para solucionarlo. Por favor, intenta de nuevo en unos minutos."})
        }
    }
}

//patient signup:

const patientSignup = async(req, res, next) => {
    const {DNI, password} = req.body;
    
    try{
        //validacion:


        //ver si el usuario esta logeado.
        if (req.userData) {
            throw new HttpError("El usuario ya esta autenticado.", 400)
          }

        //si no esta loggeado, verificar que el usuario tenga algun turno en la base de datos.
        let userIsInDb = await Appointment.findOne({DNI: DNI});
        if(!userIsInDb){
            throw new HttpError("Este DNI no esta registrado en nuestra base de datos.", 404)
        }

    }catch(err){
        if (err instanceof HttpError){
            res.status(err.code).json({error: err.message})
        }else{
            console.log(err)
            res.status(500).json({error: "Lo sentimos, ocurrió un error inesperado en el servidor y estamos trabajando para solucionarlo. Por favor, intenta de nuevo en unos minutos."})
        }
        return next();
    }

}  

//get appointments:

const getAppointments = (req, res, next) => {
    
}

//get medical history:

const getMedicalHistory = (req, res, next) => {
    
}

module.exports = {patientCheck, patientSignup}