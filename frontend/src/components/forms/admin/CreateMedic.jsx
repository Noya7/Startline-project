import { Form, useActionData, useLoaderData, useSubmit } from 'react-router-dom';
import classes from './CreateMedic.module.css';
import TextInput from '../input/TextInput';
import { useEffect, useState } from 'react';
import useResponseToast from '../../../hooks/useResponseToast';
import Modal from '../../layout/modal/Modal'

const defaultFields = {
  area: false,
  matricula: false,
  email: false,
}

const CreateMedic = () => {
  const [formIsValid, setFormIsValid] = useState(false);
  const [fields, setFields] = useState(defaultFields);
  const [toggleModal, setToggleModal] = useState(false)
  const [createNew, setCreateNew] = useState(false)
  const areas = useLoaderData()
  const responseData = useActionData()
  const submit = useSubmit()
  useResponseToast(responseData)
  const submitHandler = () => {
    submit();
    setTimeout(()=>setToggleModal(false), 500)
  }

  const handleFieldValidation = (fieldName, isValid) => {
    setFields(prev => ({ ...prev, [fieldName]: isValid, }) );
  };

  useEffect(()=>{
    console.log(fields)
    const allFieldsValid = Object.values(fields).every(field => !!field);
    setFormIsValid(allFieldsValid);
  },[handleFieldValidation])

  return (
    <>
    <button className={classes.openButton} onClick={()=>setToggleModal(true)}>Habilitar un nuevo profesional</button>
    {toggleModal && <Modal onClose={()=>setToggleModal(false)}>
        <div className={classes.container}>
          <h2>Habilitar un nuevo profesional:</h2>
          <Form method='post' className={classes.form}>
            <label htmlFor='area'>Area:</label>
            <select name='area' onChange={(e) => {setCreateNew(e.target.value === 'new'); handleFieldValidation('area', !!e.target.value)}} required>
              <option value=''>Selecciona un area</option>
              {areas?.map(area => <option key={area} value={area}>{area}</option>)}
              <option value='new'>Crear nuevo area</option>
            </select>
            {createNew && <TextInput type='text' name='area' placeholder='area' />}
            <label htmlFor='matricula'>Matricula</label>
            <TextInput onValidation={(isValid)=>handleFieldValidation('matricula', isValid)} type='text' name='matricula' placeholder='matricula' />
            <label htmlFor='email'>E-Mail</label>
            <TextInput onValidation={(isValid)=>handleFieldValidation('email', isValid)} type='email' name='email' placeholder='e-mail' />
            <button disabled={!formIsValid} onClick={submitHandler}>Enviar mail de registro</button>
          </Form>
        </div>
      </Modal>}
    </>
  );
};

export default CreateMedic;