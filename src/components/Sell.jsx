import { useEthers, useTokenBalance } from "@usedapp/core";
import {useState} from 'react'
import "../../globals.css"
import { ethers } from "ethers";
import {useGetTokenAmount, useGetETHAmount, useSellToken} from "../helpers/tokenHooks.jsx"
import { useEffect } from "react";
import SellModal from "./SellModal"
import change from "../assets/change2.svg"


export default function Sell ({tokenAddress, tokenTicker, setIsBuy, tokenBalance}) {

    const {chainId, account} = useEthers()
    const [sellAmountToken, setSellAmountToken] = useState(0)
    const [parsedToken, setParsedToken] = useState("0")
    const [returnBuyAmountToken, setReturnBuyAmountToken] = useState(null)
    const [slippage, setSlippage] = useState(5)
    const [buyModalOpen, setBuyModalOpen] = useState(false)
    const [errors, setErrors] = useState({})
    
    const ETHAmount = useGetETHAmount(chainId, tokenAddress, parsedToken)
    const {state, send, events, resetState} = useSellToken('sell', chainId, {transactionName: 'sell'}, tokenAddress)

    const handleBuySubmitBuy = (e) => {
        e.preventDefault()
        if (sellAmountToken > 0){
            try{

                //calc input params
                let slipPerc
                slippage > 0 ? slipPerc = slippage : 5
                const minETH = Number(ETHAmount) - (Number(ETHAmount) * slipPerc / 100)
                const stringETH = minETH.toString()

                if (validateForm()){
                    console.log("stringETH", stringETH)
                    console.log("parsedToken", parsedToken)
                    send(parsedToken, stringETH)
                    
                }
                
            }catch(e){console.log("error buying", e)}
        }
        else(console.log("input an amount greater than zero"))
        
    }

    const switchType = () => {
        setIsBuy(true)
    }

    const validateForm = () => {
        let newErrors = {}
        if(slippage < 0){newErrors.slippageUnderflow = "min is 0%"}
        if(slippage > 90){newErrors.slippageOverflow = "max is 90%"}
        if(Number(sellAmountToken) < 0){newErrors.tokenUnderflow = "must be at least 0.0001 ETH"}
        if(Number(sellAmountToken) > Number(ethers.utils.formatEther(tokenBalance))){newErrors.tokenOverflow = "amount exceeds your balance"}

        setErrors(newErrors)

        return Object.keys(newErrors).length === 0
    }

    useEffect(()=>{
        if(state.status == "Success"){
            setBuyModalOpen(true)
        }
    },[state.status])


    const handleBuyModal = () => {
        if(buyModalOpen){
            setBuyModalOpen(false)
        }
    }
    

    const handleChange = (e) => {
        const {value} = e.target
        setSellAmountToken(value)
        const stringValue = value.toString()

        if(value > 0){
            const parsed = ethers.utils.parseEther(stringValue)
            setParsedToken(parsed)
            console.log("parsed", ethers.utils.formatEther(parsed))
        }

    }

    const handleSlippage = (e) => {
        const {value} = e.target
        setSlippage(value)
        console.log(value)
    }

    return(
        <div className="connectbox border-4 border-black bg-base-4 max-w-[300px] max-sm:mx-1 max-sm:mb-4 max-sm:p-1 max-sm:py-4 sm:p-4">
            <SellModal className="z-10" isOpen={buyModalOpen} closeModal={handleBuyModal}/>
            <form
                name="buy"
                onSubmit={handleBuySubmitBuy}
            >
            <div className="flex flex-col">
                <div className="flex flex-row justify-between pb-2 ">
                    <div className="font-basic font-semibold">
                            sell ${tokenTicker}
                    </div>
                    <div className="flex flex-row items-center">
                        <div className="flex self-start">
                            <label className="font-basic font-medium text-xs pr-2">slippage (%)</label>
                        </div>
                        <div className="flex flex-col self-start">
                            <input 
                                id="slippage"
                                type="number"
                                placeholder="5%"
                                value={slippage}
                                onChange={handleSlippage}
                                className="flex font-basic font-medium text-xs border border-black w-10 pl-1"
                                step="any"
                                >
                                
                            </input>
                            {errors && errors.slippageUnderflow && <span className="text-xs font-basic text-base-8">{errors.slippageUnderflow}</span> }
                            {errors && errors.slippageOverflow && <span className="text-xs font-basic text-base-8">{errors.slippageOverflow}</span> }

                        </div>
                        
                    </div>
                </div>
                
            </div>
            
            
            <div className="flex flex-col bg-base-4 border-2 border-black">
                    <div className="flex flex-col bg-white px-2 py-2">
                    <label className="font-basic text-sm font-medium pl-1" htmlFor="buyETH">sell amount (${tokenTicker})</label>

                        <div className="border-2 border-black bg-white">
                            <input
                                placeholder={"$"+`${tokenTicker}`}
                                type="number"
                                id="buyETH"
                                name="buyAmount (ETH)"
                                onChange={handleChange}
                                value={sellAmountToken}
                                min="1"
                                step="any"
                                className="font-basic font-bold pl-1"
                            >
                            
                            </input>
                        </div>
                        <div className="mt-0 pt-0 pb-2">
                            {errors && errors.tokenUnderflow && <span className="text-xs font-basic text-base-8">{errors.tokenUnderflow}</span> }
                            {errors && errors.tokenOverflow && <span className="text-xs font-basic text-base-8">{errors.tokenOverflow}</span> }
                        </div>
                        <div className="flex justify-center hover:scale-110 ease-in-out hover:cursor-pointer">
                            <img onClick={switchType} src={change} className="w-[30px]" />
                        </div>
                        <div className="flex flex-col font-basic font-medium text-sm">
                            <div className="pl-1">
                                you get 
                            </div>
                            <div className="border-2 border-black bg-base-1 p-2 b">
                                {ETHAmount ? ethers.utils.formatEther(ETHAmount.toString()) + " ETH" : "0 " + "ETH"}
                            </div>
                        </div>
                    </div>
                </div>
                {(state.status == "None" || state.status == "Success" || state.status == "Fail" || state.status =="Exception") &&
                    <button className=" border-2 border-black bg-base-1 font-base px-4 mt-2"
                        type="submit"
                        >
                            sell
                    </button>
                }
                {(state.status == "PendingSignature" || state.status == "Mining") &&
                    <button className="animate-pulse  border-2 border-black bg-base-2 font-base px-4 mt-2">
                        loading
                    </button>
                }
               
         </form>
        </div>
    )

}