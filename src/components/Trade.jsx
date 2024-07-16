import Buy from "./Buy";
import Sell from "./Sell";
import { useState } from "react";



export default function Trade ({tokenAddress, tokenTicker, tokenBalance}) {

    const [isBuy, setIsBuy] = useState(true)

    return(
        <div>
            {isBuy &&
                <Buy tokenAddress={tokenAddress} tokenTicker={tokenTicker} setIsBuy={setIsBuy}/>
            }

            {!isBuy &&
                <Sell tokenAddress={tokenAddress} tokenTicker={tokenTicker} setIsBuy={setIsBuy} tokenBalance={tokenBalance}/>
            }

        </div>
       
    )
}