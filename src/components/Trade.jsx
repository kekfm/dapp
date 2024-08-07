import Buy from "./Buy";
import Sell from "./Sell";
import { useState } from "react";
import "../../globals.css"



export default function Trade ({tokenAddress, tokenTicker, tokenBalance}) {

    const [isBuy, setIsBuy] = useState(true)

    return(
        <div>
            <div className="fomnt-basic text-lg font-bold">
                trade
            </div>
            <div>
                {isBuy &&
                    <Buy tokenAddress={tokenAddress} tokenTicker={tokenTicker} setIsBuy={setIsBuy}/>
                }

                {!isBuy &&
                    <Sell tokenAddress={tokenAddress} tokenTicker={tokenTicker} setIsBuy={setIsBuy} tokenBalance={tokenBalance}/>
                }
            </div>
            

        </div>
       
    )
}