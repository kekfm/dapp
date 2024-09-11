import { useEthers, useTokenBalance } from "@usedapp/core";
import {useState} from 'react'
import "/globals.css"
import { ethers } from "ethers";
import {useGetTokenAmount, useGetETHAmount, useBuyToken} from "../../../helpers/tokenHooks.jsx"
import { useEffect } from "react";
import BuyModal from "./BuyModal"
import change from "../../../assets/change2.svg"
import { validateCall } from "@usedapp/core/dist/esm/src/helpers";


export default function Buy ({tokenAddress, tokenTicker, setIsBuy, trading }) {

    const {chainId, account} = useEthers()
    const [buyAmountETH, setBuyAmountETH] = useState(0)
    const [parsedETH, setParsedETH] = useState("")
    const [returnBuyAmountToken, setReturnBuyAmountToken] = useState(null)
    const [slippage, setSlippage] = useState(5)
    const [buyModalOpen, setBuyModalOpen] = useState(false)
    const [errors, setErrors] = useState({})
    
    const tokenAmount = useGetTokenAmount(chainId, tokenAddress, parsedETH)
    const {state, send, events, resetState} = useBuyToken('buy', chainId, {transactionName: 'buy'}, tokenAddress)

    const handleBuySubmitBuy = (e) => {
        e.preventDefault()
        if (buyAmountETH > 0){
            try{

                //calc input params
                let slipPerc
                slippage > 0 ? slipPerc = slippage : 5
                const formattedTokens = ethers.utils.formatEther(tokenAmount)
                const numTokens = Number(formattedTokens)
                const slippageTokens = (slipPerc * numTokens / 100)
                const minTokens = numTokens - slippageTokens
                const stringMinTokens = minTokens.toString()
                const parsedTokens = ethers.utils.parseEther(stringMinTokens)

                //calc tx value
                const valNum = Number(buyAmountETH) + Number(buyAmountETH) * 5 / 1000
                console.log("valNum",valNum)
                const stringNum = valNum.toString()
                const txValue = ethers.utils.parseEther(stringNum)

                if (validateForm()){
                    send(parsedTokens, parsedETH, {value: txValue})
                }
                
            }catch(e){console.log("error buying", e)}
        }
        else(console.log("input an amount greater than zero"))
        
    }

    const switchType = () => {
        setIsBuy(false)
    }

    const validateForm = () => {
        let newErrors = {}
        if(slippage < 0){newErrors.slippageUnderflow = "min is 0%"}
        if(slippage > 90){newErrors.slippageOverflow = "max is 90%"}
        if(Number(buyAmountETH) < 0){newErrors.ETHUnderflow = "must be at least 0.0001 ETH"}

        setErrors(newErrors)

        return Object.keys(newErrors).length === 0
    }

    useEffect(()=>{
        //console.log("state.status", state.status)
        if(state.status === "Success"){
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
        setBuyAmountETH(value)
        const stringValue = value.toString()

        if(value > 0){
            const parsed = ethers.utils.parseEther(stringValue)
            setParsedETH(parsed)
        }

    }

    const handleSlippage = (e) => {
        const {value} = e.target
        setSlippage(value)
        console.log(value)
    }

    if(!trading){
        return(
        <div className="connectbox border-4 border-black bg-gray-400 max-w-[300px] max-sm:mx-1 max-sm:mb-4 max-sm:p-1 max-sm:py-4 sm:p-4">
            <form
                name="buy"
                onSubmit={handleBuySubmitBuy}
            >
            <div className="flex flex-col">
                <div className="flex flex-row justify-between pb-2 ">
                    <div className="font-basic font-semibold">
                            launched
                    </div>
                    <div className="flex flex-row items-center">
                        
                        
                        
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
                                min="1"
                                step="any"
                                className="font-basic font-bold pl-1"
                                disabled
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
                                0 ETH
                            </div>
                        </div>
                    </div>
                </div>
                {(state.status == "None" || state.status == "Success" || state.status == "Fail" || state.status =="Exception") &&
                    <button className=" border-2 border-black connectbox bg-gray-200 font-basic px-4 mt-2"
                        disabled
                        >
                            buy
                    </button>
                }
                
               
         </form>
        </div>
        )
    }

    return(
        <div className="connectbox border-4 border-black bg-base-2 max-w-[300px] max-sm:mx-1 max-sm:mb-4 max-sm:p-1 max-sm:py-4 sm:p-4">
            <BuyModal className="z-100" isOpen={buyModalOpen} closeModal={handleBuyModal}/>
            <form
                name="buy"
                onSubmit={handleBuySubmitBuy}
            >
            <div className="flex flex-col">
                <div className="flex flex-row justify-between pb-2 ">
                    <div className="font-basic font-semibold">
                            buy ${tokenTicker}
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
                    <div className="flex flex-col bg-white px-2 py-2 ">
                    <label className="font-basic text-sm font-medium pl-1" htmlFor="buyETH">buy amount (ETH)</label>

                        <div className="border-2 border-black bg-white">
                            <input
                                placeholder="ETH"
                                type="number"
                                id="buyETH"
                                name="buyAmount (ETH)"
                                onChange={handleChange}
                                value={buyAmountETH}
                                min="0.0001"
                                step="any"
                                className="font-basic font-bold pl-1"
                            >
                            
                            </input>
                        </div>
                        <div className="pt-2">
                            {errors && errors.ETHUnderflow && <span className="text-xs font-basic font-base-8">{errors.ETHUnderflow}</span> }

                        </div>
                        <div className="flex justify-center hover:scale-110 ease-in-out hover:cursor-pointer">
                            <img onClick={switchType} src={change} className="w-[30px]" />
                        </div>
                        <div className="flex flex-col font-basic font-medium text-sm">
                            <div className="pl-1"
                            >
                                you get 
                            </div>
                            <div className="border-2 border-black bg-base-1 p-2 b">
                                {tokenAmount ? ethers.utils.formatEther(tokenAmount.toString()) + "$" + tokenTicker : "0 $" + tokenTicker}
                            </div>
                        </div>
                    </div>
                </div>
                {(state.status == "None" || state.status == "Success" || state.status == "Fail" || state.status == "Exception") &&
                    <button className=" border-2 border-black connectbox bg-base-1 font-basic text-md px-4 mt-2"
                        type="submit"
                        >
                            buy
                    </button>


                }
                {(state.status == "PendingSignature" || state.status == "Mining") &&
                    <button className="animate-pulse border-2 border-black bg-base-11 font-basic px-4 mt-2">
                        buying...
                    </button>
                }
               
         </form>
        </div>
    )

}