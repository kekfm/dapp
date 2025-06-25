import React from 'react'
import ReactDOM from 'react-dom/client'
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
import Navbar from './components/nav/Navbar.jsx'
import Home from './components/landing/Home.jsx'
import Footer from './components/landing/Footer.jsx'
import './index.css'

import { AppKitProvider } from './helpers/config.jsx'



const App = () => (
    <AppKitProvider>
        <BrowserRouter>
            <div className="min-h-screen bg-base-1 flex flex-col ">
                <Navbar />
                    <main className="flex-grow">
                        <Routes>
                            {/* Landing pages - no sidebar */}
                            <Route index element={<Home />} />
                            <Route path="terms" element={<Terms />} />
                            <Route path="paper" element={<Paper />} />
                            

                            {/* App pages - with sidebar */}
                            <Route path="create" element={<LaunchForm />} />
                            <Route path="launch" element={<LaunchPage />} />
                            <Route path="me" element={<Account />} />
                            <Route path="dao" element={<DaoLanding />} />
                            {/*<Route path="dao/proposal" element={<Proposal />} />*/}
                            <Route path="dao/vote" element={<Vote />} />
                            {/*<Route path="dao/vote/:proposalId" element={<ProposalPage />} />*/}
                            <Route path="game" element={<Game />} />
                        

                            {/* Catch all - 404 page */}
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </main>
                <Footer />
            </div>
        </BrowserRouter>
    </AppKitProvider>
  
)

export default App