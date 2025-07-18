import bnb from "../../assets/bnb.svg"
import modssoon from "../../assets/MODULUS.svg"
import basesoon from "../../assets/BASE.svg"
import "../../../globals.css"
import sonic from "../../assets/SONIC.png"
import base from "../../assets/BASE.png"



export default function ChainSelector() {

    return(
        <div className="flex flex-col items-center gap-2">
            <div className="flex flex-col sm:flex-row gap-4">
                <img src={modssoon} className="w-12"></img>
                <img src={sonic} className="w-12"></img>
                <img src={base} className="w-12"></img>
            </div>
        </div>
    )
}