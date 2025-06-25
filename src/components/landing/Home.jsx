import { useState } from 'react'
import Hero from './Hero.jsx'
import LaunchTable from './LaunchTable.jsx'
import Marquee from "../nav/Marquee.jsx"


function Home() {

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

export default Home
