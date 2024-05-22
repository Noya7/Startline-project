import { Outlet } from 'react-router-dom';
import Table from '../../../components/layout/table/Table';

const AppointmentsPage = () => {
  return (
    <>
      <Outlet />
      <Table />
    </>
  )
}

export default AppointmentsPage;