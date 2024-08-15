import bnb from "../assets/bnb.svg"
import mods from "../assets/mods.svg"
import modssoon from "../assets/MODULUS.svg"
import basesoon from "../assets/BASE.svg"



import "../../globals.css"



export default function ChainSelector() {

    return(
        <div className="flex flex-col items-center gap-2">
            <div className="flex flex-col sm:flex-row gap-4">
                <img src={bnb} className="w-12 "></img>
                <img src={modssoon} className="w-12"></img>
                <img src={basesoon} className="w-12"></img>
            </div>
        </div>
    )
}