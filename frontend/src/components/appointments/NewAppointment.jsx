import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, useActionData, useLoaderData, useNavigation } from 'react-router-dom';
import TextInput from '../forms/input/TextInput';

import classes from './NewAppointment.module.css';
import { getMedicsAsync, getUnavailableAsync } from '../../store/appointments-thunks';

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

//TODO: VALIDACION DE FORM

const NewAppointment = () => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [dni, setDni] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [response, setResponse] = useState(null);

  const navigation = useNavigation()
  const responseData = useActionData()

  const areas = useLoaderData();
  const doctors = useSelector(state => state.appointments.medics);
  const unavailableAppointments = useSelector(state => state.appointments.unavailable);
  console.log(doctors)

  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedArea) {
      dispatch(getMedicsAsync(selectedArea));
    }
  }, [dispatch, selectedArea]);

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      dispatch(getUnavailableAsync({selectedDoctor, selectedDate}));
    }
  }, [dispatch, selectedDoctor, selectedDate]);

  useEffect(()=>{
    navigation.state === 'idle' ? setResponse(responseData) : setResponse(null)
  }, [navigation.state, responseData])

  const handleAreaChange = (event) => {
    setSelectedArea(event.target.value);
    setSelectedDoctor('');
  };

  const handleDoctorChange = (event) => {
    setSelectedDoctor(event.target.value);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };


  useEffect(()=>{
    console.log(selectedArea)
  }, [selectedArea])

  console.log(unavailableAppointments)

  const availableAppointments = possibleAppointments
  .filter(appointment => !unavailableAppointments?.includes(appointment.index))
  .map(appointment => <option key={appointment.index} value={appointment.index}>{appointment.time}</option>);

  return (
    <div className={classes.main}>
      <h2>Nuevo Turno</h2>
      <Form method='post' className={classes.form}>
        <span className={classes.inputs}>
          <TextInput type="text" name="name" onChange={(event) => setName(event.target.value)} placeholder="Nombre" />
          <TextInput type="text" name="surname" onChange={(event) => setSurname(event.target.value)} placeholder="Apellido" />
          <TextInput type="text" name="DNI" onChange={(event) => setDni(event.target.value)} placeholder="DNI" />
        </span>
        <span className={classes.selection}>
          <select name='area' value={selectedArea} onChange={handleAreaChange}>
            <option value="">Seleccionar área</option>
            {areas && areas.map( (area, i) => <option key={`${area}_${i}`} value={area}>{area}</option> ) }
          </select>
          <select name='medic' value={selectedDoctor} onChange={handleDoctorChange} disabled={!selectedArea}>
            <option value="">Seleccionar médico</option>
            {doctors?.map(doctor =>  <option key={doctor._id} value={doctor._id}>{`${doctor.name} ${doctor.surname}`}</option> )}
          </select>
        </span>
        <input name='date' type="date" value={selectedDate} onChange={handleDateChange} disabled={!selectedDoctor} />
        <select name='timeIndex' className={classes.appointmentSelection} disabled={!selectedDate}>
          <option value="">Seleccionar turno</option>
          {availableAppointments}
        </select>
        <button type="submit" disabled={false}>Programar turno</button>
      </Form>
      {response && <p className={`${classes.response} ${responseData.name ? classes.error : classes.success}`}>{response.message}</p>}
    </div>
  );
};

export default NewAppointment;