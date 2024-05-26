import { useSelector } from 'react-redux'
import AppointmentsWidget from '../../../components/appointments/AppointmentsWidget'
import UserDataWidget from '../../../components/userData/UserDataWidget'
import classes from './PatientDashboard.module.css'
import ButtonPanel from './ButtonPanel'
import { Outlet } from 'react-router-dom'

const PatientDashboard = () => {
  const state = useSelector(state => state.auth.userData)
  return (
    <div className={classes.main}>
      <Outlet />
      <UserDataWidget userData={state} />
      <AppointmentsWidget userType={state.userType} />
      <ButtonPanel />
    </div>
  );
}

export default PatientDashboard