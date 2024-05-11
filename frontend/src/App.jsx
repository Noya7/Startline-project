import {RouterProvider, createBrowserRouter} from 'react-router-dom'

import Layout, { HomeLayout } from './pages/Layout'
import Home from './pages/Home';
import AppointmentsPage from './pages/medics/AppointmentsPage';
import LoginPage from './pages/auth/Login';
import SignupPage from './pages/auth/Signup';
import PatientVerificationPage from './pages/auth/PatientVerification';
import ForgotPasswordPage from './pages/auth/ForgotPassword';
import ResetPasswordPage from './pages/auth/ResetPassword';

import {PatientVerificationAction, forgotPasswordAction, loginAction, resetPasswordAction, signupAction} from './pages/auth/actions'
import { resetPasswordLoader, signupLoader } from './pages/auth/loaders';

const App = () => {
  const router = createBrowserRouter([
    {path: '/', element: <HomeLayout />, children: [
      {path: '/', element: <Home />, children: [
        {path: '/auth/login', element: <LoginPage />, action: loginAction},
        {path: '/auth/patient-verify', element: <PatientVerificationPage />, action: PatientVerificationAction},
        {path: '/auth/signup/:usertype', element: <SignupPage />, loader: signupLoader, action: signupAction},
        {path: '/auth/forgot', element: <ForgotPasswordPage />, action: forgotPasswordAction},
        {path: '/auth/reset', element: <ResetPasswordPage />, loader: resetPasswordLoader, action: resetPasswordAction},
      ]}
  ]},
    {path: '/portal', element: <Layout />, children:[
      {path: 'medicos', children: [
        {path: 'turnos', element: <AppointmentsPage />},
        {path: 'estadisticas'},
        {path: 'config'}
      ]}
    ]}
  ])

return (<RouterProvider router={router}/>);
}

export default App