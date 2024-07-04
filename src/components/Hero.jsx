import TelegramBtn from "./TelegramBtn"
import TwitterBtn from "./TwitterBtn"
import LaunchBtn from "./LaunchBtn"
import Explainer from "./Explainer"
import ExplainerModal from "./ExplainerModal"
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
            <div>
                <Explainer handleExplainerModal={handleExplainerModal}/>
                <ExplainerModal isOpen={isExplainerOpen} handleExplainerModal={handleExplainerModal}/>
            </div>
            <div className=" font-basic font-medium flex max-sm:flex-col flex-row max-sm:gap-4 gap-20 justify-center">
                <TelegramBtn />
                <LaunchBtn /> 
                <TwitterBtn />
            </div>
        </div>

    )
}

