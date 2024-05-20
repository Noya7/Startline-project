import { useState } from 'react';
import TextInput from '../input/TextInput';
import classes from './ForgotPassForm.module.css'
import { Form, useActionData } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import useResponseToast from '../../../hooks/useResponseToast';

const ForgotPassForm = () => {
    const [userType, setUserType] = useState('patient');
    const [formIsValid, setFormIsValid] = useState(false);
    const responseData = useActionData()

    useResponseToast(responseData)
    return (
    <>
      <div className={`${classes.container}`}>
        <h1>Recuperar Contraseña</h1>
        <span className={classes.typeSelect}>
          <button onClick={() => setUserType('patient')}>Paciente</button>
          <button onClick={() => setUserType('medic')}>Médico</button>
          <button onClick={() => setUserType('admin')}>Administrador</button>
        </span>
        <Form method='post'>
          <input type='hidden' required readOnly name='userType' value={userType}/>
          <label htmlFor='DNI'>Ingresa el DNI asociado a tu cuenta:</label>
          <TextInput type='DNI' name='DNI' placeholder='DNI' onValidation={(isValid)=>setFormIsValid(isValid)}/>
          <button className={`${classes.button}`} disabled={!formIsValid}>Recuperar</button>
        </Form>
      </div>
      <ToastContainer />
    </>
    )
}

export default ForgotPassForm;