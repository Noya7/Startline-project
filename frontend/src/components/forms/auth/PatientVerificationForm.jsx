import { useEffect, useState } from 'react';
import TextInput from '../input/TextInput'
import { Form, useActionData, useNavigation } from 'react-router-dom';

import classes from './PatientVerificationForm.module.css'

const PatientVerificationForm = () => {
    const [formIsValid, setFormIsValid] = useState(false)
    const [error, setError] = useState(null)

    const navigation = useNavigation()
    const errorData = useActionData();

    useEffect(()=>{
        navigation.state === 'idle' ? setError(errorData) : setError(null)
    }, [navigation.state, errorData])

    return (
        <div className={`${classes.container}`}>
            <div className={classes.main}>
                <h1>Verificacion de Paciente</h1>
                <p>Ingresa tu DNI para verificar que exista en la base de datos:</p>
                <Form method='post'>
                    <TextInput onValidation={(isValid)=>setFormIsValid(isValid)} type={'DNI'} name={'DNI'} placeholder={'Ingresa tu DNI'} />
                    <button disabled={!formIsValid}>Verificar</button>
                    {error && <p className={classes.error}>{error}</p>}
                </Form>
            </div>
        </div>
    );
}

export default PatientVerificationForm;