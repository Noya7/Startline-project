import { useEffect, useState } from 'react';
import TextInput from '../input/TextInput';
import classes from './ForgotPassForm.module.css'
import { Form, useActionData, useNavigation } from 'react-router-dom'

const ForgotPassForm = () => {
    const [userType, setUserType] = useState('patient');
    const [divClass, setDivClass] = useState(classes.patient);
    const [formIsValid, setFormIsValid] = useState(false);
    const [response, setResponse] = useState(null);

    const navigation = useNavigation()
    const responseData = useActionData()

    const handleUserType = (userType) =>{
        setUserType(userType)
        setDivClass(userType === 'patient' ? classes.patient : userType ==='medic'? classes.medic : classes.admin);
    }

    useEffect(()=>{
        navigation.state === 'idle' ? setResponse(responseData) : setResponse(null)
    }, [navigation.state, responseData])

    return (
      <div className={`${classes.container}`}>
        <h1>Recuperar Contraseña</h1>
        <span className={classes.typeSelect}>
            <button onClick={() => handleUserType('patient')}>Paciente</button>
            <button onClick={() => handleUserType('medic')}>Médico</button>
            <button onClick={() => handleUserType('admin')}>Administrador</button>
        </span>
          <Form method='post'>
            <input type='hidden' name='userType' value={userType}/>
            <label htmlFor='DNI'>Ingresa el DNI asociado a tu cuenta:</label>
            <TextInput type='DNI' name='DNI' placeholder='DNI' onValidation={(isValid)=>setFormIsValid(isValid)}/>
            <button className={`${classes.button}`} disabled={!formIsValid}>Recuperar</button>
            {response && <p className={`${classes.response} ${responseData.name ? classes.error : classes.success}`}>{response.message}</p>}
          </Form>
      </div>
    )
}

export default ForgotPassForm;