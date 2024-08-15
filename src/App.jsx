import { useState } from 'react'
import Hero from './components/Hero.jsx'
import LaunchTable from './components/LaunchTable.jsx'
import Marquee from "./components/Marquee"
import ChainSelector from "./components/ChainSelector"


function App() {

  return(
    <div className="w-full">
      <div className="w-full pt-4">
        <Marquee />
      </div>
      <div className="pt-4">
        <Hero />
      </div>
      <div className="pt-20">
        <LaunchTable />
      </div>
    </div>

  )
}

export default App
