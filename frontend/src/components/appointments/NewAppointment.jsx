import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, useActionData, useLoaderData, useNavigation } from 'react-router-dom';
import { getMedicsAsync, getUnavailableAsync } from '../../store/appointments-thunks';
import TextInput from '../forms/input/TextInput';
import {toast, ToastContainer} from 'react-toastify';

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

//TODO: VALIDACION DE FORM

const NewAppointment = () => {
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const navigation = useNavigation()
  const responseData = useActionData()

  const areas = useLoaderData();
  const doctors = useSelector(state => state.appointments.medics);
  const unavailableAppointments = useSelector(state => state.appointments.unavailable);

  const dispatch = useDispatch();

  useEffect(() => {
    //SI EN UN FUTURO ESTO SE GENERA UN LOOP EN ESTE COMPONENTE, ES POR ESTE IF PROBABLEMENTE.
    if (selectedArea && !selectedDoctor) {
      dispatch(getMedicsAsync(selectedArea));
    }
    if (selectedDoctor && selectedDate) {
      dispatch(getUnavailableAsync({selectedDoctor, selectedDate}));
    }

  }, [dispatch, selectedArea, selectedDoctor, selectedDate]);

  useEffect(() => {
    if (navigation.state === 'idle' && responseData) {
      responseData.error?.message && toast.error(responseData.error.message);
      responseData.payload?.message && toast.success(responseData.payload.message);
      }
  }, [navigation.state, responseData]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    switch(name){
      case 'area': setSelectedArea(value); setSelectedDoctor(''); break;
      case 'medic': setSelectedDoctor(value); break;
      case 'date': setSelectedDate(value); break;
      default: break;
    }
  }

  const availableAppointments = possibleAppointments
  .filter(appointment => !unavailableAppointments?.includes(appointment.index))
  .map(appointment => <option key={appointment.index} value={appointment.index}>{appointment.time}</option>);

  return (
    <div className={classes.main}>
      <h2>Nuevo Turno</h2>
      <Form method='post' className={classes.form}>
        <span className={classes.inputs}>
          <TextInput type="text" name="name" placeholder="Nombre" />
          <TextInput type="text" name="surname" placeholder="Apellido" />
          <TextInput type="text" name="DNI" placeholder="DNI" />
        </span>
        <span className={classes.selection}>
          <select name='area' value={selectedArea} onChange={handleInputChange}>
            <option value="">Seleccionar área</option>
            {areas && areas.map( (area, i) => <option key={`${area}_${i}`} value={area}>{area}</option> ) }
          </select>
          <select name='medic' value={selectedDoctor} onChange={handleInputChange} disabled={!selectedArea}>
            <option value="">Seleccionar médico</option>
            {doctors?.map(doctor =>  <option key={doctor._id} value={doctor._id}>{`${doctor.name} ${doctor.surname}`}</option> )}
          </select>
        </span>
        <input name='date' type="date" min={minDate} max={maxDate} value={selectedDate} onChange={handleInputChange} disabled={!selectedDoctor} />
        <select name='timeIndex' className={classes.appointmentSelection} disabled={!selectedDate}>
          <option value="">Seleccionar turno</option>
          {availableAppointments}
        </select>
        <button type="submit" disabled={false}>Programar turno</button>
      </Form>
      <ToastContainer />
    </div>
  );
};

export default NewAppointment;