import "../../globals.css"
import { useNavigate } from "react-router-dom"
import vote from "../assets/vote.png"
import proposal from "../assets/proposal.png"
import about from "../assets/daoabout.png"



export default function DaoLanding() {

    const navigate = useNavigate()


    const draftClick = () =>{
        navigate("/dao/proposal")
    }

    const checkClick = () =>{
        navigate("/dao/vote")
    }

    return(
        <div className="flex flex-col justify-center text-center">
            <div className="font-basic font-bold text-4xl pb-10 pt-10"> DAO </div>
            <div className="flex flex-col sm:flex-row justify-center gap-10">
                <div className="font-basic font-bold flex flex-col connectbox border-4 border-black px-4 pb-4 items-center hover:scale-110 hover:cursor-pointer hover:bg-base-5">
                    <div>readme</div>
                    <img src={about} className="w-20"></img>
                </div>
                <div onClick={checkClick} className="font-basic font-bold flex flex-col connectbox border-4 border-black px-4 pb-4 items-center hover:scale-110 hover:cursor-pointer hover:bg-base-2">
                    <div>check proposals</div>
                    <img src={vote} className="w-20"></img>
                </div>
                <div onClick={draftClick} className="font-basic font-bold flex flex-col connectbox border-4 border-black px-4 pb-4 items-center hover:scale-110 hover:cursor-pointer hover:bg-base-2">
                    <div>draft proposal</div>
                    <img src={proposal} className="w-20"></img>
                </div>
            </div>
        </div>
        
    )
}