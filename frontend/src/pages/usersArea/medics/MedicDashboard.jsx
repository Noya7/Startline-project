import { useSelector } from 'react-redux'
import AppointmentsWidget from '../../../components/appointments/AppointmentsWidget'
import StatsWidget from '../../../components/statistics/StatsWidget'
import UserDataWidget from '../../../components/userData/UserDataWidget'
import classes from './MedicDashboard.module.css'
import { useEffect, useState } from 'react'

const testData = [
  { id: Math.floor(Math.random() * 1000), name: 'John', surname: 'Doe', DNI: '12345678', fullDate: '2024-12-05 09:30' },
  { id: Math.floor(Math.random() * 1000), name: 'Jane', surname: 'Smith', DNI: '98765432', fullDate: '2024-12-05 10:00' },
  { id: Math.floor(Math.random() * 1000), name: 'Alice', surname: 'Johnson', DNI: '45678912', fullDate: '2024-12-05 11:00' },
  { id: Math.floor(Math.random() * 1000), name: 'Bob', surname: 'Williams', DNI: '32165498', fullDate: '2024-12-05 12:00' },
  { id: Math.floor(Math.random() * 1000), name: 'Eve', surname: 'Brown', DNI: '78912345', fullDate: '2024-12-05 13:00' },
  { id: Math.floor(Math.random() * 1000), name: 'Alex', surname: 'Johnson', DNI: '65498732', fullDate: '2024-12-05 14:00' }
];

const chartOptions = {
  plugins: {
    legend: {
      position: 'right',
    },
  },
  responsive: true,
  maintainAspectRatio: true,
};

const Dashboard = () => {
  const state = useSelector(state => state.auth.userData)

  return (
    <div className={classes.main}>
      <UserDataWidget userData={state} />
      <AppointmentsWidget userType={state.userType} nextAppointments={testData} />
      <StatsWidget data={[12, 19]} options={chartOptions} />
    </div>
  );
}

export default Dashboard