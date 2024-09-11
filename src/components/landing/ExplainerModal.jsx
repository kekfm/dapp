import "../../../globals.css"
import { useEthers } from "@usedapp/core";



export default function ExplainerModal ({isOpen, handleExplainerModal}) {

    if (!isOpen) return null

    return(

        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Overlay background */}
          <div className="fixed inset-0 bg-black opacity-70" onClick={handleExplainerModal}></div>

          {/* Modal content */}
          <div className="relative bg-base-11 connectbox border-4 border-black py-6 px-10 z-50 max-w-md w-full mx-4 shadow-lg">
            <div className={`font-basic font-bold text-3xl pb-2 pt-2 text-center`}>
              how it werks
            </div>
            <div className={`font-basic font-medium text-lg pb-4 pt-2 text-start`}>
              every token on kek.gm is a rug-proof fair launch without any team allocation or presale which has a total supply of 100k tokens.
            </div>
            <div className="flex flex-row">
                <div className={`font-basic font-medium text-lg pb-4 text-start`}>
                    1. 
                </div>
                <div className={`font-basic font-medium text-lg pb-4 text-start`}>
                    buy the token you like on the bonding curve
                </div>
            </div>
            <div className="flex flex-row">
                <div className={`font-basic font-medium text-lg pb-4 text-start`}>
                    2. 
                </div>
                <div className={`font-basic font-medium text-lg pb-4 text-start`}>
                    sell at any time you want to lock in your profit                
                </div>
            </div>
            <div className="flex flex-row">
                <div className={`font-basic font-medium text-lg pb-4 text-start`}>
                    3. 
                </div>
                <div className={`font-basic font-medium text-lg pb-4 text-start`}>
                    once the token hits 100% on the bonding curve, liquidity will be added on uniswap
                </div>
            </div>
          </div>
        </div>
    )
}