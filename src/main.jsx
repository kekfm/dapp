import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import LaunchForm from './pages/LaunchForm.jsx'
import LaunchPage from './pages/LaunchPage.jsx'
import Account from './pages/Account.jsx'
import Terms from './pages/Terms.jsx'
import Paper from './pages/Paper.jsx'
import DaoLanding from './pages/DaoLanding.jsx'
import Proposal from './pages/Proposal.jsx'
import Vote from './pages/Vote.jsx'
import ProposalPage from './pages/ProposalPage.jsx'
import Game from './pages/Game.jsx'
import './index.css'
import { Mainnet, DAppProvider, Goerli } from '@usedapp/core'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AppLayout from './pages/AppLayout.jsx'
import Provider  from './helpers/config.jsx'
import Navbar from './components/nav/Navbar.jsx'
import './index.css'




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
      },
      { 
        path:"/launch",
        element: <LaunchPage />

      },
      { 
        path:"/me",
        element: <Account />

      },
      { 
        path:"/terms",
        element: <Terms />

      },
      { 
        path:"/paper",
        element: <Paper />

      },
      { 
        path:"/dao",
        element: <DaoLanding />

      },
      { 
        path:"/dao/proposal",
        element: <Proposal />

      },
      { 
        path:"/dao/vote",
        element: <Vote />

      },
      { 
        path:"/dao/vote/:proposalId",
        element: <ProposalPage />

      },
      { 
        path:"/game",
        element: <Game />

      },
     
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
