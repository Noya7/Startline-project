const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const mail = require('../mail/mail');
const {profileImageUpload, deleteImages} = require('../firebase/storageHandling')

const Admin = require('../models/admin')
const Patient = require('../models/patient')
const Medic = require('../models/medic');
const Appointment = require('../models/appointment');
const MedicalAuthCode = require('../models/enabling-code')
const HttpError = require('../models/http-error');
const MedicalReport = require('../models/medical-report');

//HELPER FUNCTIONS:

//first appointment finder, gets first appointment for patient users.

const prevAppointmentFinder = async (DNI, userId, session) => {
  try {
    const appointments = await Appointment.find({DNI}, {DNI: 1});
    if (!appointments.length) throw new HttpError('No hay ningun turno registrado con tu DNI. No podes crear una cuenta sin tener turnos para gestionar.', 404);
    const updatedAppointments = await Appointment.updateMany({DNI}, {$set: {existingPatient: userId}}, {session})
    if(updatedAppointments.modifiedCount !== appointments.length) throw new HttpError('Ocurrio un error durante la actualizacion de turnos previos. Por favor intenta de nuevo en unos minutos.', 500)
    const idArray = appointments.map(appointment => appointment._id)
    return idArray;
  } catch (err) {
    return err
  }
}

//fiprev report finder, gets reports previous to account creation for patient users.

const prevReportFinder = async (DNI, userId, session) => {
  try {
    const reports = await MedicalReport.find({DNI}, {DNI: 1});
    if (!reports.length) return [];
    const updatedReports = await MedicalReport.updateMany({DNI}, {$set: {patient: userId}}, {session})
    if(updatedReports.modifiedCount !== updatedReports.length) throw new HttpError('Ocurrio un error durante la actualizacion de reportes previos. Por favor intenta de nuevo en unos minutos.', 500)
    const idArray = reports.map(report => report._id)
    return idArray;
  } catch (err) {
    return err
  }
}

//**********CONTROLLERS**********

//function signup, for any kind of user:

const signup = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    const {usertype} = req.headers;

    session.startTransaction()
    //primero sacamos los campos globales para cada usuario:
    const { name, surname, DNI, email, password } = req.body;
    const sharedUserData = {name, surname, DNI, email, creationDate: new Date()};
    //hasheo de contraseña, tambien global:
    sharedUserData.password = await bcrypt.hash(password, 10);
    //switch para agregar campos segun el userType:
    let createdUser;
    switch (usertype) {
      case "admin": {
        createdUser = new Admin({ ...sharedUserData });
        break;
      }
      case "medic": {
        const { gender, birthDate, matricula, area } = req.body;
        if (!req.file) throw new HttpError('No se cargo ninguna imagen.', 400);
        createdUser = new Medic({...sharedUserData, gender, birthDate, matricula, area, reviews: []});
        const url = await profileImageUpload(req.file, createdUser.id);
        if (!url) throw new HttpError('ocurrio un error durante la carga de la imagen. Por favor intenta de nuevo en unos minutos.', 500)
        createdUser.image = url;
        break;
      }
      case "patient": {
        const { gender, birthDate, address } = req.body;
        createdUser = new Patient({...sharedUserData, gender, birthDate, address, appointments: []});
        const prevAppointments = await prevAppointmentFinder(DNI, createdUser.id, session);
        createdUser.appointments = prevAppointments;
        const prevReports = await prevReportFinder(DNI, createdUser.id, session);
        createdUser.medicalHistory = prevReports;
        break;
      }
      default:
        throw new HttpError("Tipo de usuario desconocido/invalido.", 500);
    }
    //creacion de usuario en la db:
    await createdUser.save({session});
    //Si es medico, se elimina el codigo de verificacion de la base de datos:
    if (usertype === "medic") {
      await MedicalAuthCode.findOneAndDelete({matricula: req.body.matricula}, {session});
    }
    //creacion de token. En este caso, si el tipo de usuario es paciente, es util enviar en el token name, surname y DNI:
    const userData = {
      userId: createdUser.id,
      DNI: createdUser.DNI,
      name: createdUser.name,
      surname: createdUser.surname,
      userType: usertype,
      area: createdUser.area,
      matricula: createdUser.matricula,
      image: createdUser.image,
    };
    const token = jwt.sign(
      usertype === "patient"
        ? userData
        : { userId: userData.userId, userType: userData.userType },
        process.env.MY_SECRET, { expiresIn: "1h" 
      }
    );
    await session.commitTransaction();
    //respuesta:
    return res.status(201).cookie("token", token, { 
      httpOnly: true, 
      maxAge: 3600000, 
      sameSite: 'none', 
      secure: true, 
      domain: '.vercel.app' 
    }).json({ userData, message: "Usuario creado correctamente!" });
  } catch (err) {
    //falta eliminar imagen de perfil de medico en caso de un error.
    await session.abortTransaction();
    return next(err)
  } finally {
    session.endSession();
  }
};

//function login, for every kind of user.

const login = async (req, res, next) =>{
  try {
    const {usertype} = req.headers;
    const {DNI, password} = req.body;
    //buscar usuario segun su correspondiente modelo.
    let type;
    switch (usertype) {
      case "admin": type = Admin; break;
      case "medic": type = Medic; break;
      case "patient": type = Patient; break;
      default : throw new HttpError("tipo de usuario invalido.", 400)
    }
    const existingUser = await type.findOne({DNI: DNI}, {password: 1, DNI: 1, name: 1, surname: 1, area: 1, matricula: 1, image: 1});
    if (!existingUser) throw new HttpError("Usuario no encontrado o inexistente.", 404)
    //comparar contraseñas:
    const isRightPass = await bcrypt.compare(password, existingUser.password);
    if (!isRightPass) throw new HttpError("Credenciales incorrectas, por favor controla tus entradas o recupera tu contraseña si la olvidaste.", 401);
    //creacion de objeto de usuario
    const userData = {
        name: existingUser.name,
        surname: existingUser.surname,
        DNI: existingUser.DNI,
        userId: existingUser._id,
        userType: usertype,
        area: existingUser.area,
        matricula: existingUser.matricula,
        image: existingUser.image
      }
    //obtencion de token:
    const token = jwt.sign(
      usertype === "patient"
        ? userData
        : { userId: userData.userId, userType: userData.userType },
      process.env.MY_SECRET, { expiresIn: "1h" });
    //respuesta:
    res.cookie("token", token, { 
      httpOnly: true, 
      maxAge: 3600000, 
      sameSite: 'none', 
      secure: true, 
      // domain: '.vercel.app' 
    }).status(200).json({userData, message: "Sesion iniciada correctamente. Bienvenido!"})
  } catch (err) {
    return next(err)
  }
}

//function auto login, logs user with just token, if not expired:

const autoLogin = async (req, res, next) => {
  try {
    if(!req.userData) throw new HttpError('Credenciales invalidas, caducadas o inexistentes. Por favor, loggeate de nuevo.', 400)
      let type;
      switch (req.userData.userType) {
        case "admin": type = Admin; break;
        case "medic": type = Medic; break;
        case "patient": type = Patient; break;
        default : throw new HttpError("tipo de usuario invalido.", 400)
      }
      const existingUser = await type.findById(req.userData.userId, {DNI: 1, name: 1, surname: 1, area: 1, matricula: 1, image: 1});
      if (!existingUser) throw new HttpError("Usuario no encontrado o inexistente.", 404)
      const userData = {
        name: existingUser.name,
        surname: existingUser.surname,
        DNI: existingUser.DNI,
        userId: existingUser._id,
        userType: req.userData.userType,
        area: existingUser.area,
        matricula: existingUser.matricula,
        image: existingUser.image
      }
      return res.status(200).json(userData)
  } catch (error) {
    return next(error)
  }
}

//function logout: deletes the token cookie. Only way to actually log out since its an httpOnly cookie.

const logout = (req, res, next) => {
  if (!req.userData) throw new HttpError('No hay una sesion activa para cerrar.', 400)
  return res.clearCookie("token", {httpOnly: true}).status(200).json({message: "Sesión finalizada correctamente."})
}

//function reset password:

// send password reset token:

const mailResetToken = async(req, res, next) =>{
  try {
    const {usertype} = req.headers;
    //get DNI from body and check if it belongs to an existing account:
    const {DNI} = req.body;
    let type;
    switch(usertype){
      case "admin" : type = Admin; break;
      case "medic" : type = Medic; break;
      case "patient" : type = Patient; break;
      default : throw new HttpError("Tipo de usuario invalido.", 400)
    }
    const existingUser = await type.findOne({DNI}).select('email name surname');
    if (!existingUser) throw new HttpError("No existe ningun usuario registrado con este DNI en la base de datos. Por favor, chequea tus entradas.", 404)
    const payload = {existingUser, usertype}
    //generate reset token with different secret, and then generate reset url:
    const resetToken = jwt.sign(payload, process.env.RESET_SECRET, {expiresIn: '15m'})
    const resetURL =  `${process.env.FRONTEND_URL}/auth/reset?token=${resetToken}`
    //send mail with url
    mail.resetPass(existingUser.email, resetURL)
    //response:
    return res.status(200).json({message: 'Codigo de recuperacion enviado con exito a la cuenta de correo asociada. Si no encuentras el mensaje, verifica tu carpeta de correo no deseado.'})
  } catch (err) {
    return next(err)
  }
}

//function verify reset token:

const verifyResetToken = async(req, res, next) => {
  try {
    const {token} = req.headers;
    const decoded = jwt.verify(token, process.env.RESET_SECRET, (err, decoded)=>{
      if (err) throw new HttpError("Error en la verificacion de token: " + err.message, 401);
      return decoded
    })
    return res.status(200).json(decoded)
  } catch (err) {
    return next(err)
  }
}

//function reset password:

const resetPassword = async(req, res, next) => {
  try {
    const {token} = req.headers;
    //verify token
    const decoded = jwt.verify(token, process.env.RESET_SECRET, (err, decoded)=>{
      if (err) throw new HttpError("Error en la verificacion de token: " + err.message, 401);
      return decoded
    })
    //get pass from db to compare it:
    let type;
    switch (decoded.usertype) {
      case "admin": type = Admin; break;
      case "medic": type = Medic; break;
      case "patient": type = Patient; break;
      default : throw new HttpError("tipo de usuario invalido.", 400)
    }
    const user = await type.findById(decoded.existingUser._id).select('password')
    //get new pass from body, compare and if its different, hash.
    const isOldPass = await bcrypt.compare(req.body.password, user.password);
      if (isOldPass) throw new HttpError('Para actualizar tu contraseña, debes elegir una distinta a la actual.', 400);
    //update user
    user.password = await bcrypt.hash(req.body.password, 10);
    await user.save()
    //response
    return res.status(200).json({message: "Contraseña actualizada exitosamente! Podes proceder a iniciar sesion."})
  } catch (err) {
    return next(err)
  }
}

//***********MEDIC AUTH CONTROLLERS***********


//function verify medic signup code.

const medicSignupVerification = async (req, res, next) => {
  try {
    //sacamos token de headers y validamos
    const {token} = req.headers;
    const decoded = jwt.verify(token, process.env.RESET_SECRET, (err, decoded) => {
      if (err) {
        throw new HttpError( err.name === "TokenExpiredError" ?
          "El enlace de registro ha caducado. Por favor solicita un nuevo enlace comunicandote con administracion." :
          "Error en la verificacion de token: " + err.message, 401);
      }
      return decoded;
    }) 
    //respuesta:
    delete decoded.exp;
    delete decoded.iat;
    res.status(200).json(decoded)
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
      const existingPatient = await Patient.findOne({DNI: DNI}, {DNI: 1});
      if(!!existingPatient) throw new HttpError("Ya estas registrado como paciente, por favor, inicia sesion o recupera tu contraseña si la olvidaste.", 400);
      //busqueda en base de datos para ver si el dni esta registrado en algun turno.
      const existingAppointment = await Appointment.findOne({DNI: DNI}, {DNI: 1});
      if(!existingAppointment) throw new HttpError("Tu DNI no esta registrado en nuestra base de datos, no puedes crear una cuenta de paciente sin tener turnos para gestionar.", 404);
      //respuesta positiva, el front redirige a form de registro de paciente.
      return res.status(200).json({DNI, message: "Disponible para creacion de usuario paciente."})
  } catch (err) {
    return next(err)  
  }
}

module.exports = {signup, login, autoLogin, logout, mailResetToken, verifyResetToken, resetPassword, medicSignupVerification, patientCheck}