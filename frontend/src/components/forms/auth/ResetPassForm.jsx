import { useState } from 'react';
import TextInput from '../input/TextInput';
import classes from './ResetPassForm.module.css'
import { Form, useActionData } from 'react-router-dom'
import useResponseToast from '../../../hooks/useResponseToast';
import { ToastContainer } from 'react-toastify';

const ResetPassForm = ({data}) => {
    const [formIsValid, setFormIsValid] = useState(false);
    const responseData = useActionData()

    useResponseToast(responseData)
    return (
      <>
        <div className={`${classes.container}`}>
          <h1>Nueva Contraseña</h1>
          <Form method='post'>
            <input type='hidden' name='token' value={data.token}/>
            <label htmlFor="password" className={classes.label}>
              <p>{`Hola ${data.userData.name}, vamos a crear una nueva contraseña para tu cuenta. Esta debe contener:`}</p>
              <ul className={classes.list}>
                <li>Entre 6 y 32 caracteres</li>
                <li>Al menos 1 mayúscula</li>
                <li>Al menos 1 número</li>
                <li>Al menos 1 carácter especial (@$!%*?&)</li>
              </ul>
            </label>
            <TextInput type='signup_password' name='password' placeholder='Nueva Contraseña' onValidation={(isValid)=>setFormIsValid(isValid)}/>
            <button className={`${classes.button} ${!formIsValid && classes.buttonDisabled}`} disabled={!formIsValid}>Recuperar</button>
          </Form>
        </div>
        <ToastContainer />
      </>

    )
}

export default ResetPassForm;