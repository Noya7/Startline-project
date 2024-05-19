import { useEffect, useState } from 'react';
import TextInput from '../input/TextInput'
import { Form, Link, useActionData, useNavigation } from 'react-router-dom';

import classes from './LoginForm.module.css'

const LoginForm = () => {
    const [userType, setUserType] = useState('patient');
    const [divClass, setDivClass] = useState(classes.patient);
    const [signupLink, setSignupLink] = useState('/auth/patient-verify')
    const [formIsValid, setFormIsValid] = useState(false)
    const [error, setError] = useState(null)

    const navigation = useNavigation()
    const errorData = useActionData()

    const handleUserType = (userType) =>{
        setUserType(userType)
        setDivClass(userType === 'patient' ? classes.patient : userType ==='medic'? classes.medic : classes.admin);
        setSignupLink(userType === 'patient' ? '/auth/patient-verify' : '/auth/signup/admin')
    }

    useEffect(()=>{
        navigation.state === 'idle' ? setError(errorData) : setError(null)
    }, [navigation.state, errorData])

    return (
        <div className={classes.main}>
            <h1>Iniciar sesión</h1>
            <span className={classes.typeSelect}>
                <button className={userType === 'patient' && classes.patient} onClick={() => handleUserType('patient')}>Paciente</button>
                <button onClick={() => handleUserType('medic')}>Médico</button>
                <button onClick={() => handleUserType('admin')}>Administrador</button>
            </span>
            <Form method='post'>
                <input type='hidden' name='userType' value={userType} />
                <TextInput onValidation={(isValid)=>setFormIsValid(isValid)} type={'DNI'} name={'DNI'} placeholder={'Ingresa tu DNI'} />
                <TextInput type={'password'} name={'password'} placeholder={'Ingresa tu contraseña'} />
                <Link className={classes.link} to="/auth/forgot">Olvidé mi contraseña</Link>
                <button disabled={!formIsValid}>Iniciar sesión</button>
            </Form>
            {userType !== 'medic' && <Link className={classes.link} to={signupLink}>Registrarse</Link>}
            {error && <p className={`${classes.error} ${userType === 'medic' ? classes.medicalErr : classes.nonMedicalErr}`}>{error}</p>}
        </div>
    );
}

//TODO: ELIMINATE ERRORS AND INSTEAD SHOW THEM IN TOASTS.

export default LoginForm