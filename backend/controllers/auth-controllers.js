const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const dayjs = require("dayjs")

const Admin = require('../models/admin')
const Patient = require('../models/patient')
const Medic = require('../models/medic');
const Appointment = require('../models/appointment');
const MedicalAuthCode = require('../models/enabling-code')

const HttpError = require('../models/http-error');
const mongoose = require('mongoose');

//first appointment finder, gets first appointment for patient users.

const firstAppointmentFinder = async (DNI, userId) => {
  const appointment = await Appointment.findOne({DNI});
  if (!appointment){throw new HttpError('No hay ningun turno registrado con tu DNI.', 404)};
  appointment.existingPatient = new mongoose.Types.ObjectId(userId);
  await appointment.save()
  return new mongoose.Types.ObjectId(appointment.id);
}

//function signup, for any kind of user:

const signup = (userType) => {
  return async (req, res, next) => {
    try {
      //primero sacamos los campos globales para cada usuario:
      const { name, surname, DNI, email, password } = req.body;
      const sharedUserData = {name, surname, DNI, email, creationDate: new Date()};
      //hasheo de contraseña, tambien global:
      sharedUserData.password = await bcrypt.hash(password, 10);
      //switch para agregar campos segun el userType:
      let createdUser;
      switch (userType) {
        case "admin": {
          createdUser = new Admin({ ...sharedUserData });
          //proximamente deberia agregarse una verificacion de email, con un codigo. para esto usar nodemailer.
          //tambien podria agregarse un registo de la ip con la que se registra el admin y todas las ip que utiliza.
          //ya que maneja info sensible, deberia tenerse en cuenta este dato como medida de seguridad.
          break;
        }
        case "medic": {
          const { gender, birthDate, matricula, position, image } = req.body;
          //aca debera sacarse la imagen de req.file y gestionar con una funcion su carga y obtencion de url.
          createdUser = new Medic({...sharedUserData, gender, birthDate, matricula, position, image, reviews: []});
          break;
        }
        case "patient": {
          const { gender, birthDate, address } = req.body;
          createdUser = new Patient({...sharedUserData, gender, birthDate, address, medicalHistory: [], appointments: []});
          const firstAppointment = await firstAppointmentFinder(DNI, createdUser.id);
          createdUser.appointments.push(firstAppointment)
          break;
        }
        default:
          throw new HttpError("Tipo de usuario desconocido/invalido.", 500);
      }
      //creacion de usuario en la db:
      await createdUser.save();
      //Si es medico, se elimina el codigo de verificacion de la base de datos:
      if (userType === "medic") {
        await MedicalAuthCode.findOneAndDelete({matricula: req.body.matricula});
      }
      //creacion de token. En este caso, si el tipo de usuario es paciente, es util enviar en el token name, surname y DNI:
      const userData = {
        userId: createdUser.id,
        DNI: createdUser.DNI,
        name: createdUser.name,
        surname: createdUser.surname,
        userType,
      };
      const token = jwt.sign(
        userType === "patient"
          ? userData
          : { userId: userData.userId, userType: userData.userType },
        process.env.MY_SECRET, { expiresIn: "1h" });
      //respuesta:
      return res.status(201).cookie("token", token, { httpOnly: true, maxAge: 3600000 }).json({ userData, message: "Usuario creado correctamente!" });
    } catch (err) {
      return next(err)
    }
  };
};

//function login, for every kind of user.

const login = (userType) => {
    return async (req, res, next) =>{
        try {
            const {DNI, password} = req.body;
            //buscar usuario segun su correspondiente modelo.
            let existingUser;
            switch(userType){
                case "admin":{
                    existingUser = await Admin.findOne({DNI: DNI});
                    break;
                }
                case "patient":{
                    existingUser = await Patient.findOne({DNI: DNI});
                    break;
                }
                case "medic":{
                    existingUser = await Medic.findOne({DNI: DNI});
                    break;
                }
            }
            if (!existingUser){
                throw new HttpError("Usuario no encontrado o inexistente.", 404)
            }
            //comparar contraseñas:
            const hashedPassword = existingUser.password;
            const isRightPass = await bcrypt.compare(password, hashedPassword);
            if(!isRightPass){
                throw new HttpError("Credenciales incorrectas, por favor controla tus entradas o recupera tu contraseña si la olvidaste.", 401)
            }
            //creacion de objeto de usuario
            const userData = {
                userId: existingUser.id,
                DNI: existingUser.DNI,
                name: existingUser.name,
                surname: existingUser.surname,
                userType: userType
            }
            //obtencion de token:
            const token = jwt.sign(
              userType === "patient"
                ? userData
                : { userId: userData.userId, userType: userData.userType },
              process.env.MY_SECRET, { expiresIn: "1h" });
            //respuesta:
            res.cookie("token", token, {httpOnly: true, maxAge: 3600000}).status(200).json({userData, message: "Sesion iniciada correctamente. Bienvenido!"})
        } catch (err) {
            return next(err)
        }
    }
}

//function auto login, logs user with just token, if not expired:

const autoLogin = (userType) => {
  return (req, res) => {
    
  }
}

//function reset password:

const resetPass = async(req, res, next) =>{

}

//***********MEDIC AUTH CONTROLLERS***********


//function verify medic signup code.

const medicSignupVerification = async (req, res, next) => {
    try {
        const {code, matricula} = req.body
        //buscar si la matricula ingresada tiene un codigo asociado en la db:
        const existingCode = await MedicalAuthCode.findOne({matricula: matricula, status: 'active'})
        if(!existingCode){
            throw new HttpError("Tu matricula no esta habilitada para registro. Comunicate con administracion para solucionar esto.", 404)
        }
        //comparar el codigo ingresado con el codigo de la db:
        if(existingCode.code !== code){
            throw new HttpError("El codigo de verificacion ingresado no es correcto, por favor chequea tu entrada e intenta de nuevo.", 400)
        }
        //verificar que el codigo no hay expirado
        const codeHasExpired = dayjs().isAfter(existingCode.expDate)
        if (codeHasExpired){
            existingCode.status = "expired"
            await existingCode.save()
            throw new HttpError("El codigo de verificacion ingresado ha caducado. Por favor, solicita otro.", 400)
        }
        //respuesta:
        res.status(200).json({message: "Codigo verificado con exito, proceda a formulario de registro."})
    } catch (err) {
        return next(err)
    }
}


//***********PATIENT AUTH CONTROLLERS***********


//signup availability check: primer paso del signup, checkea que el usuario este registrado en algun turno.

const patientCheck = async (req, res, next) =>{
    try {
        const {DNI} = req.body;
        //busqueda en base de datos para ver si el usuario no esta registrado aun.
        const existingPatient = await Patient.findOne({DNI: DNI});
        if(!!existingPatient){
            return next(new HttpError("Ya estas registrado como paciente, por favor, inicia sesion o recupera tu contraseña si la olvidaste.", 400))
        }
        //busqueda en base de datos para ver si el dni esta registrado en algun turno.
        const existingAppointment = await Appointment.findOne({DNI: DNI});
        if(!existingAppointment){
            return next(new HttpError("Tu DNI no esta registrado en nuestra base de datos, no puedes crear una cuenta de paciente sin tener turnos para gestionar.", 404))
        }
        //respuesta positiva, el front redirige a form de registro de paciente.
        return res.status(200).json({message: "Disponible para creacion de usuario paciente."})
    } catch (err) {
      return next(err)  
    }
}


module.exports = {signup, login, resetPass, medicSignupVerification, patientCheck}