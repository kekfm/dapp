import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import LaunchForm from './pages/LaunchForm.jsx'
import './index.css'
import { Mainnet, DAppProvider, Goerli } from '@usedapp/core'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AppLayout from './pages/AppLayout.jsx'
import Provider  from './helpers/config.jsx'
import Navbar from './components/Navbar.jsx'




const router = createBrowserRouter([

  {
    element: <AppLayout />,
    children:[
      {
        path:"/",
        element: <App />
      },
      {
        path:"/create",
        element: <LaunchForm />
      }

    ]
  }

])




ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider>      
     <RouterProvider router={router} />

    </Provider>
  </React.StrictMode>,
)
