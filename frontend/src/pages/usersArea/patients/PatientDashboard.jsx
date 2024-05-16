import { useSelector } from 'react-redux'
import AppointmentsWidget from '../../../components/appointments/AppointmentsWidget'
import UserDataWidget from '../../../components/userData/UserDataWidget'
import classes from './PatientDashboard.module.css'
import ButtonPanel from './ButtonPanel'
import { Outlet } from 'react-router-dom'

const PatientDashboard = () => {
  const state = useSelector(state => state.auth.userData)
  const appointmentsState = useSelector(state => state.patient.appointments)

  return (
    <div className={classes.main}>
      <Outlet />
      <UserDataWidget userData={state} />
      <ButtonPanel />
      <AppointmentsWidget userType={state.userType} nextAppointments={appointmentsState.appointments} />
    </div>
  );
}

export default PatientDashboard