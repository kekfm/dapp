import TelegramBtn from "./TelegramBtn"
import TwitterBtn from "./TwitterBtn"
import LaunchBtn from "./LaunchBtn"
import Explainer from "./Explainer"
import ExplainerModal from "./ExplainerModal"
import TehShit from "./TehShit"
import Recent from "./Recent"
import LastTrade from "./LastTrade"
import { useState } from "react"
import modulus from "../assets/buildon.svg"
import time from "../assets/time.svg"
import memes from "../assets/memes.svg"
import many from "../assets/themany.svg"
import cult from "../assets/cult.svg"





export default function Hero () {

    const [isExplainerOpen, setIsExplainerOpen] = useState(false)

    const handleExplainerModal=() => {

        if(isExplainerOpen){
            setIsExplainerOpen(false)
        }
        if(!isExplainerOpen){
            setIsExplainerOpen(true)
        }
    }

    return(
        <div className="relative flex flex-col gap-6">
            <div className="absolute w-[300px] -rotate-6 max-lg:hidden">
                <img src={modulus} className="w-[300px]"></img>
            </div>
            <div className="absolute w-[300px] rotate-6 right-10 top-60 max-lg:hidden">
                <img src={time} className="w-[300px]"></img>
            </div>
            <div className="absolute w-[300px] -rotate-12 left-52 top-60 max-lg:hidden">
                <img src={memes} className="w-[300px]"></img>
            </div>
            <div className="absolute w-[200px] rotate-6 left-40 bottom-10 max-lg:hidden">
                <img src={many} className="w-[200px]"></img>
            </div>
            <div className="absolute w-[300px] -rotate-6 right-40 bottom-10 max-lg:hidden">
                <img src={cult} className="w-[300px]"></img>
            </div>
            <div className="lg:hidden">
                <Recent />
            </div>
            <div className="flex justify-center pt-20 ">
                <Explainer handleExplainerModal={handleExplainerModal}/>
                <ExplainerModal isOpen={isExplainerOpen} handleExplainerModal={handleExplainerModal}/>
            </div>
            <div className="relative font-basic font-bold flex flex-col sm:flex-row sm:gap-20 gap-4 sm:justify-center sm:w-full text-center">
                <div className="flex justify-center">
                    <TelegramBtn />
                </div>
                <div className="flex justify-center">
                    <LaunchBtn /> 
                </div>
                <div className="flex justify-center">
                    <TwitterBtn />
                </div>
               {/*<div className="absolute z-200 -top-44 right-10">
                    <LastTrade />
                </div>*/}
              
            </div>
            <div className="flex justify-center pt-20 pb-4 overflow-x-auto">
                <TehShit />
            </div>
        </div>

    )
}

