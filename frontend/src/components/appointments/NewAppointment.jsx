import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, useNavigate, useActionData, useLoaderData, useSubmit } from 'react-router-dom';
import { getMedicsAsync, getUnavailableAsync } from '../../store/appointments-thunks';
import TextInput from '../forms/input/TextInput';
import useResponseToast from '../../hooks/useResponseToast';

import classes from './NewAppointment.module.css';

const possibleAppointments = [
  { time: '08:00', index: 0 },
  { time: '08:30', index: 1 },
  { time: '09:00', index: 2 },
  { time: '09:30', index: 3 },
  { time: '10:00', index: 4 },
  { time: '10:30', index: 5 },
  { time: '11:00', index: 6 },
  { time: '11:30', index: 7 },
  { time: '12:00', index: 8 },
  { time: '12:30', index: 9 },
  { time: '14:00', index: 10 },
  { time: '14:30', index: 11 },
  { time: '15:00', index: 12 },
  { time: '15:30', index: 13 },
  { time: '16:00', index: 14 },
  { time: '16:30', index: 15 },
  { time: '17:00', index: 16 },
  { time: '17:30', index: 17 }
];

// Obtener la fecha de hoy
const today = new Date();
const thisYear = today.getFullYear();
const thisMonth = String(today.getMonth() + 1).padStart(2, '0');
const thisDay = String(today.getDate()).padStart(2, '0');
const minDate = `${thisYear}-${thisMonth}-${thisDay}`;

// Calcular la fecha máxima (dos meses desde hoy)
const twoMonths = new Date(today);
twoMonths.setMonth(twoMonths.getMonth() + 2);
const maxYear = twoMonths.getFullYear();
const maxMonth = String(twoMonths.getMonth() + 1).padStart(2, '0');
const maxDay = String(twoMonths.getDate()).padStart(2, '0');
const maxDate = `${maxYear}-${maxMonth}-${maxDay}`;

const defaultFields = {
  area: '',
  medic: '',
  date: '',
  timeIndex: ''
}

const NewAppointment = () => {
  const [fields, setFields] = useState(defaultFields);
  const responseData = useActionData()
  const areas = useLoaderData();
  const {medics, unavailable} = useSelector(state => state.appointments);
  const userData = useSelector(state => state.auth.userData);
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const submit = useSubmit();

  useEffect(() => {
    if (fields.area.length && !fields.medic.length) {
      dispatch(getMedicsAsync(fields.area));
    }
    if (fields.medic.length && fields.date.length) {
      dispatch(getUnavailableAsync({selectedDoctor: fields.medic, selectedDate: fields.date}));
    }
  }, [dispatch, fields]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFields( name === 'area' ? {...fields, [name]: value, medic: '', date: '', timeIndex: ''} : {...fields, [name]: value});
  }

  const availableAppointments = possibleAppointments
  .filter(appointment => !unavailable?.includes(appointment.index))
  .map(appointment => <option key={appointment.index} value={appointment.index}>{appointment.time}</option>);

  useResponseToast(responseData)

  const submitHandler = () => {
    submit();
    setTimeout(()=>{navigate('../')}, 500)
  }

  return (
    <div className={classes.main}>
      <h2>Nuevo Turno</h2>
      <Form method='post' className={classes.form}>
        <span className={classes.inputs}>
          <TextInput type="text" name="name" placeholder="Nombre" value={userData?.userType === 'patient' && userData.name} />
          <TextInput type="text" name="surname" placeholder="Apellido" value={userData?.userType === 'patient' && userData.surname} />
          <TextInput type="DNI" name="DNI" placeholder="DNI" value={userData?.userType === 'patient' && userData.DNI} />
        </span>
        <span className={classes.selection}>
          <select name='area' value={fields.area} onChange={handleInputChange}>
            <option value="">Seleccionar área</option>
            {areas && areas.map( (area, i) => <option key={`${area}_${i}`} value={area}>{area}</option> ) }
          </select>
          <select name='medic' value={fields.medic} onChange={handleInputChange} disabled={!fields.area.length}>
            <option value="">Seleccionar médico</option>
            {medics?.map(doctor =>  <option key={doctor._id} value={doctor._id}>{`${doctor.name} ${doctor.surname}`}</option> )}
          </select>
        </span>
        <input name='date' type="date" min={minDate} max={maxDate} value={fields.date} onChange={handleInputChange} disabled={!fields.medic.length} />
        <select name='timeIndex' onChange={handleInputChange} className={classes.appointmentSelection} disabled={!fields.date.length}>
          <option value="">Seleccionar turno</option>
          {availableAppointments}
        </select>
        <button onClick={submitHandler} disabled={!fields.timeIndex.length}>Programar turno</button>
      </Form>
    </div>
  );
};

export default NewAppointment;