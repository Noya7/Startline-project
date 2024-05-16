import { Outlet } from 'react-router-dom';
import List from '../../../components/layout/list/List'
import classes from './PatientAppointmentsPage.module.css'
import MedicalReportForm from '../../../components/forms/medic/MedicalReportForm';
import { useState } from 'react';

const PatientAppointmentsPage = () => {
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  return (
    <>
      <Outlet />
      <div className={classes.main}>
        <List onSelectAppointment={(obj)=>setSelectedAppointment(obj)} />
        <div className={classes.reportContainer} >
          <MedicalReportForm readOnly={true} data={selectedAppointment}/>
        </div>
      </div>
    </>
  )
}

export default PatientAppointmentsPage;