import {RouterProvider, createBrowserRouter} from 'react-router-dom'
import Layout from './pages/Layout'
import Home from './pages/Home';

const App = () => {
  const router = createBrowserRouter([
    {path: '/', element: <Home />},
    {path: '/:usertype', element: <Layout />, children:[
    ]}
  ])

return <RouterProvider router={router}/>;
}

export default App