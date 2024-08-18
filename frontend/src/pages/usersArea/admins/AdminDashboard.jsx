import { useSelector } from 'react-redux'
import UserDataWidget from '../../../components/userData/UserDataWidget'
import { Outlet } from 'react-router-dom'
import CreateMedic from '../../../components/forms/admin/CreateMedic'

import classes from './AdminDashboard.module.css'

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