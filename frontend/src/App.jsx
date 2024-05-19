import {RouterProvider, createBrowserRouter} from 'react-router-dom'

import Layout, { HomeLayout } from './pages/Layout'
import Home from './pages/Home';
import AppointmentsPage from './pages/usersArea/medics/AppointmentsPage';
import LoginPage from './pages/auth/Login';
import SignupPage from './pages/auth/Signup';
import PatientVerificationPage from './pages/auth/PatientVerification';
import ForgotPasswordPage from './pages/auth/ForgotPassword';
import ResetPasswordPage from './pages/auth/ResetPassword';
import {PatientVerificationAction, forgotPasswordAction, loginAction, resetPasswordAction, signupAction} from './pages/auth/actions'
import { loginLoader, resetPasswordLoader, signupLoader } from './pages/auth/loaders';

import { patientLoader } from './pages/usersArea/loaders';
import MedicDashboard from './pages/usersArea/medics/MedicDashboard';
import PatientDashboard from './pages/usersArea/patients/PatientDashboard';
import NewAppointmentModal from './pages/usersArea/patients/NewAppointmentModal';
import { newAppointmentLoader } from './pages/appointments/loaders';
import { newAppointmentAction } from './pages/appointments/actions';
import { createReportAction } from './pages/usersArea/medics/actions';
import ReportPage from './pages/usersArea/medics/ReportPage';
import { reportsLoader } from './pages/usersArea/medics/loaders';
import AdminDashboard from './pages/usersArea/admins/AdminDashboard';
import { createMedicAction } from './pages/usersArea/admins/actions';
import PatientAppointmentsPage from './pages/usersArea/patients/PatientAppointmentsPage';
import 'react-toastify/dist/ReactToastify.css';


const App = () => {
  const router = createBrowserRouter([
    {path: '/', element: <HomeLayout />, children: [
      {path: '/', element: <Home />, children: [
        {path: '/new-appointment', element: <NewAppointmentModal />, loader: newAppointmentLoader, action: newAppointmentAction},
        {path: '/auth/login', element: <LoginPage />, loader: loginLoader, action: loginAction},
        {path: '/auth/patient-verify', element: <PatientVerificationPage />, action: PatientVerificationAction},
        {path: '/auth/signup/:usertype', element: <SignupPage />, loader: signupLoader, action: signupAction},
        {path: '/auth/forgot', element: <ForgotPasswordPage />, action: forgotPasswordAction},
        {path: '/auth/reset', element: <ResetPasswordPage />, loader: resetPasswordLoader, action: resetPasswordAction},
      ]}
  ]},
    {path: '/portal/medic', loader: patientLoader, element: <Layout /> , children: [
      {path: '', element: <MedicDashboard />},
      {path: 'appointments', element: <AppointmentsPage />, action: createReportAction, children: [
        {path: ':id', element: <ReportPage />, loader: reportsLoader}
      ]}
    ]},
    {path: '/portal/patient', loader: patientLoader, element: <Layout /> , children: [
      {path: '', element: <PatientDashboard />, children: [
        {path: 'new-appointment', element: <NewAppointmentModal />, action: newAppointmentAction,  loader: newAppointmentLoader},
    ]},
      {path: 'appointments', element: <PatientAppointmentsPage /> , children: [
        {path: ':id', element: <ReportPage />, loader: reportsLoader}
    ]}
    ]},
    {path: '/portal/admin', loader: patientLoader, element: <Layout />, action: createMedicAction , children: [
      {path: '', element: <AdminDashboard /> },
    ]}
])

return (<RouterProvider router={router}/>);
}

export default App