import { Form, useActionData, useLoaderData } from 'react-router-dom';
import classes from './CreateMedic.module.css';
import TextInput from '../input/TextInput';
import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import useResponseToast from '../../../hooks/useResponseToast';

const CreateMedic = () => {
  const areas = useLoaderData()
  const [createNew, setCreateNew] = useState(false)
  const responseData = useActionData()
  useResponseToast(responseData)
  return (
      <div className={classes.container}>
        <h2>Habilitar un nuevo profesional:</h2>
        <Form method='post' className={classes.form}>
          <label htmlFor='area'>Area:</label>
          <select name='area' onChange={(e) => setCreateNew(e.target.value === 'new')} required>
            <option value=''>Selecciona un area</option>
            {areas?.map(area => <option key={area.id} value={area.id}>{area.name}</option>)}
            <option value='new'>Crear nuevo area</option>
          </select>
          {createNew && <TextInput type='text' name='area' placeholder='area' />}
          <label htmlFor='matricula'>Matricula</label>
          <TextInput type='text' name='matricula' placeholder='matricula' />
          <label htmlFor='email'>E-Mail</label>
          <TextInput type='email' name='email' placeholder='e-mail' />
          <button type="submit">Enviar mail de registro</button>
        </Form>
        <ToastContainer />
      </div>
  );
};

export default CreateMedic;