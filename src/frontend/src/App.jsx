import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Landing from './pages/Landing'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import Mail from './pages/Mail'
import Group from './pages/Group'
import DeleteGroup from './pages/DeleteGroup'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/sign-up',
    element: <SignUp />,
  },
  {
    path: '/sign-in',
    element: <SignIn />,
  },
  {
    path: '/mail',
    element: <Mail />,
  },
  {
    path: '/group',
    element: <Group />,
  },
  {
    path: '/delete-group',
    element: <DeleteGroup />,
  },
])

const App = () => (
  <RouterProvider router={router} />
)

export default App
