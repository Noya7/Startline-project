import {RouterProvider, createBrowserRouter} from 'react-router-dom'
import Layout, { HomeLayout } from './pages/Layout'
import Home from './pages/Home';
import AppointmentsPage from './pages/medics/AppointmentsPage';

const App = () => {
  const router = createBrowserRouter([
    {path: '/', element: <HomeLayout />, children: [
      {path: '/', element: <Home />}
  ]},
    {path: '/portal', element: <Layout />, children:[
      {path: 'medicos', children: [
        {path: 'turnos', element: <AppointmentsPage />},
        {path: 'estadisticas'},
        {path: 'config'}
      ]}
    ]}
  ])

return <RouterProvider router={router}/>;
}

export default App