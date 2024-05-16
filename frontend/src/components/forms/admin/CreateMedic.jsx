import { Form } from 'react-router-dom';
import classes from './CreateMedic.module.css';
import TextInput from '../input/TextInput';

const CreateMedic = () => {
  return (
    <div className={classes.container}>
      <h2>Habilitar un nuevo profesional:</h2>
      <Form method='post' className={classes.form}>
        <label htmlFor='area'>Area:</label>
        <TextInput type='text' name='area' placeholder='area' />
        <label htmlFor='matricula'>Matricula</label>
        <TextInput type='text' name='matricula' placeholder='matricula' />
        <label htmlFor='email'>E-Mail</label>
        <TextInput type='email' name='email' placeholder='e-mail' />
        <button type="submit">Enviar mail de registro</button>
      </Form>
    </div>
  );
};

export default CreateMedic;