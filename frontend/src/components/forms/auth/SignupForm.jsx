import { useEffect, useState } from 'react';
import TextInput from '../input/TextInput'
import { Form, useActionData, useLoaderData, useNavigation } from 'react-router-dom';

import classes from './SignupForm.module.css'
import ImageInput from '../input/ImageInput';

const fieldToValidate = {
    name: false,
    surname: false,
    password: false,
    DNI: false,
    email: false,
}

const SignupForm = ({userType}) => {
    const [formIsValid, setFormIsValid] = useState(false)
    const [fieldValidation, setFieldValidation] = useState(fieldToValidate)
    const [error, setError] = useState(null)

    const signupData = useLoaderData()
    const navigation = useNavigation();
    const errorData = useActionData();

    const handleFieldValidation = (fieldName, isValid) => {
        setFieldValidation(prev => ({ ...prev, [fieldName]: isValid, }) );
    };

    useEffect(()=>{
        const allFieldsValid = Object.values(fieldValidation).every(field => !!field);
        setFormIsValid(allFieldsValid);
    },[fieldValidation])

    useEffect(()=>{
        navigation.state === 'idle' ? setError(errorData) : setError(null)
    }, [navigation.state, errorData])

    return (
        <div className={classes.main}>
            <h1>Registro</h1>
            <Form method='post' encType='multipart/form-data' className={classes.form}>
                <input type='hidden' value={userType} name='userType'/>
                {userType === 'medic' && <span className={classes.medicOnly}>
                    <input type='hidden' name='matricula' value={signupData?.matricula} readOnly required />
                    <input type='hidden' name='area' value={signupData?.area} readOnly required />
                    <ImageInput />
                </span>}
                <div className={classes.sharedData}>
                    <TextInput onValidation={(isValid)=>handleFieldValidation('DNI', isValid)} type={'DNI'} name={'DNI'} placeholder={'Ingresa tu DNI'} value={signupData?.DNI || ''}/>
                    <TextInput onValidation={(isValid)=>handleFieldValidation('password', isValid)} type={'signup_password'} name={'password'} placeholder={'Crea una contraseña segura'}/>
                    <TextInput onValidation={(isValid)=>handleFieldValidation('name', isValid)} type={'name'} name={'name'} placeholder={'Nombre'} />
                    <TextInput onValidation={(isValid)=>handleFieldValidation('surname', isValid)} type={'surname'} name={'surname'} placeholder={'Apellidos'} />
                    <TextInput onValidation={(isValid)=>handleFieldValidation('email', isValid)} type={'email'} name={'email'} placeholder={'Dirección de e-mail'} />
                </div>
                {userType !== 'admin' && 
                <div className={classes.notAdmin}>
                    <p>Ingresa tu genero y fecha de nacimiento:</p>
                    <span >
                        <select name='gender' required>
                            <option className={classes.options} value={'male'}>Hombre</option>
                            <option value={'female'}>Mujer</option>
                            <option value={'non-binary'}>No Binario</option>
                        </select>
                        <input type="date" name="birthDate" required/>
                    </span>
                </div>
                }
                <button type='submit' className={classes.submit} disabled={!formIsValid}>Registrarme</button>
            </Form>
            {!!error && <p className={`${classes.error} ${userType !== 'medic' ? classes.nonMedicalErr : classes.medicalErr} `}>{error}</p>}
        </div>
    );
}

export default SignupForm;