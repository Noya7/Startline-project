import { useSelector } from 'react-redux'
import AppointmentsWidget from '../../../components/appointments/AppointmentsWidget'
import UserDataWidget from '../../../components/userData/UserDataWidget'
import classes from './PatientDashboard.module.css'
import { useEffect, useState } from 'react'
import ButtonPanel from './ButtonPanel'
import { Outlet } from 'react-router-dom'

const PatientDashboard = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const state = useSelector(state => state.auth.userData)
  const appointmentsState = useSelector(state => state.patient.appointments)

  useEffect(()=>{
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className={classes.main}>
      {isMobile ? (
        <>
          <Outlet />
          <UserDataWidget userData={state} />
          <AppointmentsWidget userType={state.userType} nextAppointments={appointmentsState.appointments} />
          <ButtonPanel />
        </>
      ) : (
        <>
          <Outlet />
          <div className={classes.upper}>
            <UserDataWidget userData={state} />
            <ButtonPanel />
          </div>
          <AppointmentsWidget userType={state.userType} nextAppointments={appointmentsState.appointments} />
        </>
      )}
    </div>
  );
}

export default PatientDashboard