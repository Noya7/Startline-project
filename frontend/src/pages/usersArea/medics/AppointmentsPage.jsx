import { Outlet } from 'react-router-dom';
import List from '../../../components/layout/list/List'
import classes from './AppointmentsPage.module.css'
import MedicalReportForm from '../../../components/forms/medic/MedicalReportForm';
import { useState } from 'react';

const AppointmentsPage = () => {
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  return (
    <>
      <Outlet />
      <div className={classes.main}>
        <List onSelectAppointment={(obj)=>setSelectedAppointment(obj)} />
        <div className={classes.reportContainer} >
          <MedicalReportForm data={selectedAppointment}/>
        </div>
      </div>
    </>
  )
}

export default AppointmentsPage;