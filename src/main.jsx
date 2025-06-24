import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import LaunchForm from './pages/LaunchForm.jsx'
import LaunchPage from './pages/LaunchPage.jsx'
import Account from './pages/Account.jsx'
import Terms from './pages/Terms.jsx'
import Paper from './pages/Paper.jsx'
import DaoLanding from './pages/DaoLanding.jsx'
//import Proposal from './pages/Proposal.jsx'
import Vote from './pages/Vote.jsx'
//import ProposalPage from './pages/ProposalPage.jsx'
import Game from './pages/Game.jsx'
import NotFound from './pages/NotFound.jsx'
import './index.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from './pages/AppLayout.jsx'
import Navbar from './components/nav/Navbar.jsx'
import './index.css'

import { AppKitProvider } from './helpers/config.jsx'



const Main = () => {
  return (
    <AppKitProvider>
        <BrowserRouter>
          <Routes>
            {/* Landing pages - no sidebar */}
            <Route path="/" element={<AppLayout showSidebar={false} />}>
              <Route index element={<App />} />
              <Route path="terms" element={<Terms />} />
              <Route path="paper" element={<Paper />} />
            </Route>

            {/* App pages - with sidebar */}
            <Route path="/" element={<AppLayout showSidebar={true} />}>
              <Route path="create" element={<LaunchForm />} />
              <Route path="launch" element={<LaunchPage />} />
              <Route path="me" element={<Account />} />
              <Route path="dao" element={<DaoLanding />} />
              {/*<Route path="dao/proposal" element={<Proposal />} />*/}
              <Route path="dao/vote" element={<Vote />} />
              {/*<Route path="dao/vote/:proposalId" element={<ProposalPage />} />*/}
              <Route path="game" element={<Game />} />
            </Route>

            {/* Catch all - 404 page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
    </AppKitProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>,
)
