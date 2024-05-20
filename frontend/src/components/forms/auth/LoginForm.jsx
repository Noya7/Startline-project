import { useState } from 'react';
import TextInput from '../input/TextInput'
import { Form, Link, useActionData } from 'react-router-dom';
import useResponseToast from '../../../hooks/useResponseToast';
import { ToastContainer } from 'react-toastify';
import classes from './LoginForm.module.css'

const LoginForm = () => {
    const [userType, setUserType] = useState('patient');
    const [signupLink, setSignupLink] = useState('/auth/patient-verify')
    const [formIsValid, setFormIsValid] = useState(false)

    const responseData = useActionData()

    const handleUserType = (event) =>{
        setUserType(event.target.value)
        setSignupLink(event.target.value === 'patient' ? '/auth/patient-verify' : '/auth/signup/admin')
    }
    useResponseToast(responseData)
    return (
        <>
            <div className={classes.main}>
                <h1>Iniciar sesión</h1>
                <span className={classes.typeSelect}>
                    <button value='patient' onClick={ e => handleUserType(e)}>Paciente</button>
                    <button value='medic' onClick={ e => handleUserType(e)}>Médico</button>
                    <button value='admin' onClick={ e => handleUserType(e)}>Administrador</button>
                </span>
                <Form method='post'>
                    <input type='hidden' name='userType' value={userType} />
                    <TextInput onValidation={(isValid)=>setFormIsValid(isValid)} type={'DNI'} name={'DNI'} placeholder={'Ingresa tu DNI'} />
                    <TextInput type={'password'} name={'password'} placeholder={'Ingresa tu contraseña'} />
                    <Link className={classes.link} to="/auth/forgot">Olvidé mi contraseña</Link>
                    <button disabled={!formIsValid}>Iniciar sesión</button>
                </Form>
            {userType !== 'medic' && <Link className={classes.link} to={signupLink}>Registrarse</Link>}
            </div>
            <ToastContainer />
        </>
    );
}

export default LoginForm