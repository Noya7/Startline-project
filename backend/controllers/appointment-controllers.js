const Appointment = require("../models/appointment");
const HttpError = require("../models/http-error");

//function appointment user check: chequea si hay userData y la agrega al body para que luego sea validada.

const appointmentUserCheck = (req, res, next) => {
    let userId, DNI, name, surname;

    if (!!req.userData && req.userData.userType === 'patient'){
        ({userId, DNI, name, surname} = req.userData);
        req.body = {...req.body, userId, DNI, name, surname}
    }

    return next()
}

//este check sirve para verificar que si el usuario esta tratando de sacar un turno solo con su DNI, efectivamente,
//sea su primer turno, de lo contrario indicarle que inicie sesion.

const firstAppointmentCheck = async (req, res, next) =>{
    try {
        if (!req.userdata){
            const isNotFirstAppointment = await Appointment.findOne({DNI: req.body.DNI})
    
            if (!!isNotFirstAppointment){
                throw new HttpError("Hay una cuenta registrada con tu DNI. Por favor, inicia sesion, y programa tu turno. Si olvidaste tu contraseña, podes recuperarla.", 400)
            }

            next()
        }
    } catch (err) {
        if (err instanceof HttpError) {
            res.status(err.code).json({error: err.message})
        }else{
            console.log(err)
            res.status(500).json({error: "Lo sentimos, ocurrio un error interno en el servidor y estamos trabajando para solucionarlo. Por favor, intenta de nuevo en unos minutos."})
        }
    }
}


//create appointment:

const createAppointment = async(req, res, next) => {
    try{        
        const {userId, DNI, name, surname, date, timeIndex, area, medic} = req.body;

        //verificar que no haya un appointment creado para esa fecha en ese time index:

        const existingAppointment = await Appointment.findOne({appointmentDate: date, timeIndex: timeIndex})

        if (!!existingAppointment){
            throw new HttpError("Este turno no esta disponible, por favor elige un horario disponible e intenta de nuevo.", 409)
        }

        //se procede a crear el appointment.

        const createdAppointment = new Appointment({
            appointmentDate: date,
            appointmentTimeIndex: timeIndex,
            area,
            medic,
            name,
            surname,
            DNI,
            existingPatient: userId ? userId : undefined,
            creationDate: new Date(),
        })

        await createdAppointment.save()

        const successMessage = userId ?
        "Turno creado, recorda que con tu cuenta podes gestionar tus turnos, diagnosticos y tratamientos." :
        "Turno creado, te invitamos a crear una cuenta de paciente para gestionar tus turnos, diagnosticos y tratamientos."

        res.status(200).json({message: successMessage})

    }catch(err){
        if (err instanceof HttpError){
            res.status(err.code).json({error: err.message})
        }else{
            console.log(err)
            res.status(500).json({error: "Lo sentimos, ocurrió un error inesperado en el servidor y estamos trabajando para solucionarlo. Por favor, intenta de nuevo en unos minutos."})
        }
    }
}

//delete appointment:

const deleteAppointment = (req, res, next) => {
    
}

//get available appointments: dada una fecha (no mayor a dos meses) y un medico,
//devuelve los time index que no poseen un turno.

const getUnavailableAppointments = async (req, res, next) => {
    try {
        const {date, medicId} = req.body

        //primero validar que la fecha este dentro del periodo de dos meses desde hoy.

        //obtener los turnos disponibles para esa fecha:

        const takenAppointments = await Appointment.find({appointmentDate: date, medic: medicId})

        //primero verificamos si en esta fecha hay turnos tomados. Si esto no pasa, devolvemos null.

        if(takenAppointments.length === 0){
            console.log('no taken appointments')
            return res.status(204).json({unavailableAppointments: null})
        }

        //si hay turnos tomados, entonces devolvemos un array con estos.

        const unavailableAppointments = takenAppointments.map(appointment => appointment.appointmentTimeIndex);

        res.status(200).json({unavailableAppointments})

    } catch (err) {
        if (err instanceof HttpError){
            res.status(err.code).json({error: err.message})
        }else{
            console.log(err)
            res.status(500).json({error: "Lo sentimos, ocurrió un error inesperado en el servidor y estamos trabajando para solucionarlo. Por favor, intenta de nuevo en unos minutos."})
        }
    }
}


module.exports = {appointmentUserCheck, firstAppointmentCheck, createAppointment, deleteAppointment, getUnavailableAppointments}