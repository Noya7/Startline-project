const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const dayjs = require("dayjs")

const Admin = require('../models/admin')
const Patient = require('../models/patient')
const Medic = require('../models/medic');
const MedicalAuthCode = require('../models/enabling-code')

const HttpError = require('../models/http-error');
const enablingCode = require('../models/enabling-code');

//function login, for every kind of user.

const login = (userType) => {
    return async (req, res, next) =>{    
        try{
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
                throw new HttpError("La contraseña provista es incorrecta, por favor checkea tu entrada o recupera tu contraseña si la olvidaste.", 401)
            }
    
            //obtencion de token:
    
            let token = jwt.sign({
                userId: existingUser.id,
                DNI: existingUser.DNI,
                name: existingUser.name,
                surname: existingUser.surname,
                userType: userType
            }, process.env.MY_SECRET, {expiresIn: "1h"})
    
            res.cookie("token", token, {httpOnly: true}).status(200).json({message: "Sesion iniciada correctamente. Bienvenido!"})
    
        }catch(err){
            if (err instanceof HttpError){
                res.status(err.code).json({error: err.message})
            }else{
                console.log(err)
                res.status(500).json({error: "Lo sentimos, ocurrió un error inesperado en el servidor y estamos trabajando para solucionarlo. Por favor, intenta de nuevo en unos minutos."})
            }
        }
    }
}

//function reset password:

const resetPass = async(req, res, next) =>{

}


//***********ADMIN AUTH CONTROLLERS***********


//admin signup:

const adminSignup = async(req, res, next) => {
    try {
        const {name, surname, DNI, email, password} = req.body;

        //verificar que ni el DNI ni el E-mail esten en uso:

        const credentialsAlreadyUsed = await Admin.findOne({
            $or: [{email: email}, {DNI: DNI}]
        });

        if (!!credentialsAlreadyUsed){
            throw new HttpError('Este E-mail o DNI ya esta en uso por una cuenta de administrador. Si olvidaste tu contraseña, podes recuperarla.', 409);
        }

        //encripcion de contraseña:

        let hashedPassword = await bcrypt.hash(password, 10)

        //creacion de usuario:

        const createdUser = new Admin({
            name, surname, email, DNI, password: hashedPassword, creationDate: new Date()
        })

        await createdUser.save();

        //obtencion de token:

        const token = jwt.sign({
            userId: createdUser.id,
            DNI: createdUser.DNI,
            name: createdUser.name,
            surname: createdUser.surname,
            userType: "admin"
        }, process.env.MY_SECRET, {expiresIn: "1h"})

        //respuesta:

        res.status(201).cookie("token", token, {httpOnly: true}).json({message: "Usuario administrador creado correctamente!"})

        //proximamente deberia agregarse una verificacion de email, con un codigo. para esto usar nodemailer.
        //tambien podria agregarse un registo de la ip con la que se registra el admin y todas las ip que utiliza.
        //ya que maneja info sensible, deberia tenerse en cuenta este dato como medida de seguridad.

    } catch (err) {
        if (err instanceof HttpError){
            res.status(err.code).json({error: err.message});
        }else{
            res.status(500).json({error: "Lo sentimos, ocurrió un error inesperado en el servidor y estamos trabajando para solucionarlo. Por favor, intenta de nuevo en unos minutos."})
        }
    }
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
        if (err instanceof HttpError){
            res.status(err.code).json({error: err.message});
        }else{
            res.status(500).json({error: "Lo sentimos, ocurrió un error inesperado en el servidor y estamos trabajando para solucionarlo. Por favor, intenta de nuevo en unos minutos."})
        }
    }
}

//function medic signup: with a code provided by an admin, a new medic should be able to create an account.

const medicSignup = async (req, res, next) =>{
    try {
        const {email, password, name, surname, gender, birthdate, DNI, matricula, position, image} = req.body
        //const image = req.file para cuando se implemente multer
        //deberia crearse un middleware o controlador que verifique que haya un req.file

        //verificar que no haya un medico con esta matricula ya registrado:

        const matriculaAlreadyExists = await Medic.findOne({matricula: matricula})

        if (!!matriculaAlreadyExists){
            throw new HttpError("Ya hay un medico registrado con esta matricula. Por favor, inicia sesion o recupera tu contraseña si la olvidaste.", 409)
        }

        //hash de password:

        const hashedPassword = await bcrypt.hash(password, 10)

        //subida de imagen, se implementara en un futuro, con multer y firebase storage.

        //creacion de usuario:

        const createdUser = new Medic({
            email, password: hashedPassword, name, surname, gender, birthDate: birthdate, DNI, matricula, position, image, reviews: [], creationDate: new Date()
        })

        await createdUser.save()

        //finalmente se elimina el codigo de verificacion de la base de datos:

        await enablingCode.findOneAndDelete({matricula: matricula});

        //obtencion de token:

        const token = jwt.sign({
            userId: createdUser.id,
            DNI: createdUser.DNI,
            name: createdUser.name,
            surname: createdUser.surname,
            userType: "medic"
        }, process.env.MY_SECRET, {expiresIn: "1h"})

        //respuesta:

        res.status(201).cookie("token", token, {httpOnly: true}).json({message: "Usuario medico creado correctamente!"})

    } catch (err) {
        if (err instanceof HttpError){
            res.status(err.code).json({error: err.message});
        }else{
            console.log(err)
            res.status(500).json({error: "Lo sentimos, ocurrió un error inesperado en el servidor y estamos trabajando para solucionarlo. Por favor, intenta de nuevo en unos minutos."})
        }
    }
}


module.exports = {login, resetPass, adminSignup, medicSignupVerification, medicSignup}