import { useState } from 'react';
import TextInput from '../input/TextInput'
import { Form, useActionData } from 'react-router-dom';
import classes from './PatientVerificationForm.module.css'
import useResponseToast from '../../../hooks/useResponseToast';

const PatientVerificationForm = () => {
    const [formIsValid, setFormIsValid] = useState(false)
    const responseData = useActionData();

    useResponseToast(responseData)
    return (
        <div className={classes.main}>
            <h1>Verificacion de Paciente</h1>
            <p>Ingresa tu DNI para verificar que exista en la base de datos:</p>
            <Form method='post'>
                <TextInput onValidation={(isValid)=>setFormIsValid(isValid)} type={'DNI'} name={'DNI'} placeholder={'Ingresa tu DNI'} />
                <button disabled={!formIsValid}>Verificar</button>
            </Form>
        </div>
    );
}

export default PatientVerificationForm;