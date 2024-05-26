import { useSelector } from 'react-redux'
import AppointmentsWidget from '../../../components/appointments/AppointmentsWidget'
import UserDataWidget from '../../../components/userData/UserDataWidget'
import classes from './MedicDashboard.module.css'
import StatsWidget from '../../../components/statistics/StatsWidget';

const Dashboard = () => {
  const state = useSelector(state => state.auth.userData)

  return (
    <div className={classes.main}>
      <UserDataWidget userData={state} />
      <AppointmentsWidget userType={state.userType} />
      <StatsWidget />
    </div>
  );
}

export default Dashboard