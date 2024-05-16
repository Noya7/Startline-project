import { useSelector } from 'react-redux'
import UserDataWidget from '../../../components/userData/UserDataWidget'
import classes from './AdminDashboard.module.css'
import { Outlet } from 'react-router-dom'
import CreateMedic from '../../../components/forms/admin/CreateMedic'

const AdminDashboard = () => {
  const state = useSelector(state => state.auth.userData)

  return (
    <div className={classes.main}>
      <Outlet />
      <UserDataWidget userData={state} />
      <CreateMedic />
    </div>
  );
}

export default AdminDashboard