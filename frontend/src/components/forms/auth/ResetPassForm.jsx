import { useEffect, useState } from 'react';
import TextInput from '../input/TextInput';
import classes from './ResetPassForm.module.css'
import { Form, useActionData, useNavigation } from 'react-router-dom'

const ResetPassForm = ({data}) => {
    const [formIsValid, setFormIsValid] = useState(false);
    const [response, setResponse] = useState(null);

    const navigation = useNavigation()
    const responseData = useActionData()

    const divClass = data.userType === 'patient' ? classes.patient : data.userType ==='medic'? classes.medic : classes.admin

    useEffect(()=>{
        navigation.state === 'idle' ? setResponse(responseData) : setResponse(null)
    }, [navigation.state, responseData])

    return (
      <div className={`${classes.container} ${divClass}`}>
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
          {response && <p className={`${classes.response} ${responseData.name ? classes.error : classes.success}`}>{response.message}</p>}
        </Form>
      </div>
    )
}

export default ResetPassForm;