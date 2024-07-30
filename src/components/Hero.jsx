import TelegramBtn from "./TelegramBtn"
import TwitterBtn from "./TwitterBtn"
import LaunchBtn from "./LaunchBtn"
import Explainer from "./Explainer"
import ExplainerModal from "./ExplainerModal"
import TehShit from "./TehShit"
import LastTrade from "./LastTrade"
import { useState } from "react"

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
        <div className="flex flex-col gap-6">
            <div className="">
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
               <div className="absolute z-200 -top-28 right-10">
                    <LastTrade />
               </div>
            </div>
            <div className="flex justify-center pt-20 pb-4 overflow-x-auto">
                <TehShit />
            </div>
        </div>

    )
}

