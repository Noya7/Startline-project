import {RouterProvider, createBrowserRouter} from 'react-router-dom'

import Layout, { HomeLayout } from './pages/Layout'
import Home, { HomeLoader } from './pages/Home';
import AppointmentsPage from './pages/usersArea/medics/AppointmentsPage';
import LoginPage from './pages/auth/Login';
import SignupPage from './pages/auth/Signup';
import PatientVerificationPage from './pages/auth/PatientVerification';
import ForgotPasswordPage from './pages/auth/ForgotPassword';
import ResetPasswordPage from './pages/auth/ResetPassword';
import DeleteAppointmentModal from './pages/usersArea/patients/DeleteAppointment';
import ReviewModal from './pages/usersArea/patients/ReviewModal';
import MedicDashboard from './pages/usersArea/medics/MedicDashboard';
import PatientDashboard from './pages/usersArea/patients/PatientDashboard';
import NewAppointmentModal from './pages/usersArea/patients/NewAppointmentModal';
import ReportPage from './pages/usersArea/medics/ReportPage';
import AdminDashboard from './pages/usersArea/admins/AdminDashboard';
import 'react-toastify/dist/ReactToastify.css';

//actions & loaders:

import { newAppointmentLoader, newAppointmentAction } from './pages/actions-loaders/appointments';
import { PatientVerificationAction, forgotPasswordAction, loginAction, resetPasswordAction, signupAction, 
  loginLoader, resetPasswordLoader, signupLoader } from './pages/actions-loaders/auth';
import { createMedicAction, createReportAction, createReviewAction,
  portalLoader, reportsLoader, patientReportLoader, reviewLoader } from './pages/actions-loaders/usersArea';


const App = () => {
  const router = createBrowserRouter([
    {path: '/', element: <HomeLayout />, children: [
      {path: '/', element: <Home />, loader: HomeLoader, children: [
        {path: '/new-appointment', element: <NewAppointmentModal />, loader: newAppointmentLoader, action: newAppointmentAction},
        {path: '/auth/login', element: <LoginPage />, loader: loginLoader, action: loginAction},
        {path: '/auth/patient-verify', element: <PatientVerificationPage />, action: PatientVerificationAction},
        {path: '/auth/signup/:usertype', element: <SignupPage />, loader: signupLoader, action: signupAction},
        {path: '/auth/forgot', element: <ForgotPasswordPage />, action: forgotPasswordAction},
        {path: '/auth/reset', element: <ResetPasswordPage />, loader: resetPasswordLoader, action: resetPasswordAction},
      ]}
  ]},
    {path: '/portal/medic', loader: portalLoader, element: <Layout /> , children: [
      {path: '', element: <MedicDashboard />},
      {path: 'appointments', element: <AppointmentsPage />, action: createReportAction, children: [
        {path: ':type/:id', element: <ReportPage />, loader: reportsLoader, action: createReportAction}
      ]}
    ]},
    {path: '/portal/patient', loader: portalLoader, element: <Layout /> , children: [
      {path: '', element: <PatientDashboard />, children: [
        {path: 'new-appointment', element: <NewAppointmentModal />, action: newAppointmentAction,  loader: newAppointmentLoader},
    ]},
      {path: 'appointments', element: <AppointmentsPage /> , children: [
        {path: ':id', element: <ReportPage />, loader: patientReportLoader},
        {path: 'delete/:id', element: <DeleteAppointmentModal />},
        {path: 'review/:id', element: <ReviewModal />, action: createReviewAction, loader: reviewLoader}
    ]}
    ]},
    {path: '/portal/admin', loader: portalLoader, element: <Layout />, children: [
      {path: '/portal/admin', action: createMedicAction, element: <AdminDashboard />, loader: newAppointmentLoader },
    ]}
])

return (<RouterProvider router={router}/>);
}

export default App