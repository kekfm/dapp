import Buy from "./Buy";
import Sell from "./Sell";
import { useState } from "react";
import "/globals.css"
import { useEthers } from "@usedapp/core";



export default function Trade ({tokenAddress, tokenTicker, tokenBalance, trading, chain}) {

    const [isBuy, setIsBuy] = useState(true)
    const {account, chainId} = useEthers()

    if (account && chain != chainId){
        return(
            <div className="connectbox border-4 border-black bg-gray-400 max-w-[300px] max-sm:mx-1 max-sm:mb-4 max-sm:p-1 max-sm:py-4 sm:p-4">
                switch network to trade token
            </div>
        )
    }
    
    if (!account){
        return(
            <div className="connectbox border-4 border-black bg-base-5 max-w-[300px] max-sm:mx-1 max-sm:mb-4 max-sm:p-1 max-sm:py-4 sm:p-4">
                connect to trade token
            </div>
        )
    }

    return(
        <div>
            <div className="fomnt-basic text-lg font-bold">
                trade
            </div>
            <div>
                {isBuy &&
                    <Buy tokenAddress={tokenAddress} tokenTicker={tokenTicker} setIsBuy={setIsBuy} tokenBalance={tokenBalance} trading={trading} />
                }

                {!isBuy &&
                    <Sell tokenAddress={tokenAddress} tokenTicker={tokenTicker} setIsBuy={setIsBuy} tokenBalance={tokenBalance} trading={trading}/>
                }
            </div>
            

        </div>
       
    )
}