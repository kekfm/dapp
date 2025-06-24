import { useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react'
import { useState, useEffect } from 'react'
import "/globals.css"
import { ethers } from "ethers"
import BuyModal from "./BuyModal"
import change from "../../../assets/change2.svg"
import useBuyToken from '../../../hooks/useBuyToken'
import useTokenBalance from '../../../hooks/useTokenBalance'
import useGetTokensOut from '../../../hooks/useGetTokensOut'

export default function Buy ({tokenAddress, tokenTicker, setIsBuy, trading }) {
    const { address } = useAppKitAccount()
    const { chainId } = useAppKitNetwork()
    const [buyAmountETH, setBuyAmountETH] = useState(0)
    const [parsedETH, setParsedETH] = useState("")
    const [slippage, setSlippage] = useState(5)
    const [buyModalOpen, setBuyModalOpen] = useState(false)
    const [errors, setErrors] = useState({})
    const [tokenAmountOut, setTokenAmountOut] = useState(0)
    
    const { buyToken, isLoading, isSuccess, isError, receipt } = useBuyToken(tokenAddress)
    const { balance, error } = useTokenBalance(tokenAddress)
    const { tokensOut:tokenAmount, error:tokensOutError, getTokenAmount } = useGetTokensOut (tokenAddress)

    useEffect(() => {
        const fetchTokenAmount = async () => {
            if(buyAmountETH > 0 && getTokenAmount) {
                try {
                    const tokensOut = await getTokenAmount(ethers.parseEther(buyAmountETH.toString()))
                    setTokenAmountOut(tokensOut || "0")
                } catch (error) {
                    console.error("Error fetching token amount:", error)
                    setTokenAmountOut("0")
                }
            } else {
                setTokenAmountOut("0")
            }
        }
        fetchTokenAmount()
    }, [buyAmountETH, getTokenAmount])



    const handleBuySubmitBuy = async (e) => {
        e.preventDefault()
        if (buyAmountETH > 0) {
            try {
                // calc input params
                const slipPerc = slippage > 0 ? slippage : 5
                const numTokens = Number(tokenAmount)
                const slippageTokens = (slipPerc * numTokens / 100)
                const minTokens = numTokens - slippageTokens
                const stringMinTokens = minTokens.toString()
                const parsedTokens = ethers.parseEther(stringMinTokens)

                //calc tx value
                const valNum = Number(buyAmountETH)// + Number(buyAmountETH) * 5 / 1000
                console.log("valNum",valNum)
                const stringNum = valNum.toString()
                const txValue = ethers.parseEther(stringNum)

                console.log("parsedTokens", ethers.formatEther(parsedTokens.toString()))
                console.log("parsedETH", ethers.formatEther(parsedETH.toString()))
                console.log("txValue", ethers.formatEther(txValue.toString()))

                if (validateForm()) {
                    await buyToken(parsedTokens, parsedETH, txValue)
                }
            } catch (e) {
                console.log("error buying", e)
            }
        } else {
            console.log("input an amount greater than zero")
        }
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

    useEffect(() => {
        if(isSuccess) {
            setBuyModalOpen(true)
        }
    }, [isSuccess])

    const handleBuyModal = () => {
        if(buyModalOpen) {
            setBuyModalOpen(false)
        }
    }

    const handleChange = (e) => {
        const {value} = e.target
        setBuyAmountETH(value)
        const stringValue = value.toString()

        if(value > 0) {
            const parsed = ethers.parseEther(stringValue)
            setParsedETH(parsed)
        }
    }

    const handleSlippage = (e) => {
        const {value} = e.target
        setSlippage(value)
    }

    if(!trading) {
        return(
            <div className="connectbox border-4 border-black bg-gray-400 max-w-[300px] max-sm:mx-1 max-sm:mb-4 max-sm:p-1 max-sm:py-4 sm:p-4">
                <form name="buy" onSubmit={handleBuySubmitBuy}>
                    <div className="flex flex-col">
                        <div className="flex flex-row justify-between pb-2">
                            <div className="font-basic font-semibold">
                                launched
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
                                />
                            </div>
                            <div className="mt-0 pt-0 pb-2">
                                {errors && errors.tokenUnderflow && <span className="text-xs font-basic text-base-8">{errors.tokenUnderflow}</span>}
                                {errors && errors.tokenOverflow && <span className="text-xs font-basic text-base-8">{errors.tokenOverflow}</span>}
                            </div>
                            <div className="flex justify-center hover:scale-110 ease-in-out hover:cursor-pointer">
                                <img onClick={switchType} src={change} className="w-[30px]" alt="switch" />
                            </div>
                            <div className="flex flex-col font-basic font-medium text-sm">
                                <div className="pl-1">you get</div>
                                <div className="border-2 border-black bg-base-1 p-2 b">0 ETH</div>
                            </div>
                        </div>
                    </div>
                    <button className="border-2 border-black connectbox bg-gray-200 font-basic px-4 mt-2" disabled>
                        buy
                    </button>
                </form>
            </div>
        )
    }

    return(
        <div className="connectbox border-4 border-black bg-base-4 max-w-[300px] max-sm:mx-1 max-sm:mb-4 max-sm:p-1 max-sm:py-4 sm:p-4">
            <BuyModal isOpen={buyModalOpen} closeModal={handleBuyModal} tx={receipt} />
            <form name="buy" onSubmit={handleBuySubmitBuy}>
                <div className="flex flex-col">
                    <div className="flex flex-row justify-between pb-2">
                        <div className="font-basic font-semibold">buy ${tokenTicker}</div>
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
                                />
                                {errors && errors.slippageUnderflow && <span className="text-xs font-basic text-base-8">{errors.slippageUnderflow}</span>}
                                {errors && errors.slippageOverflow && <span className="text-xs font-basic text-base-8">{errors.slippageOverflow}</span>}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col bg-base-4 border-2 border-black">
                    <div className="flex flex-col bg-white px-2 py-2">
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
                            />
                        </div>
                        <div className="pt-2">
                            {errors && errors.ETHUnderflow && <span className="text-xs font-basic text-base-8">{errors.ETHUnderflow}</span>}
                        </div>
                        <div className="flex justify-center hover:scale-110 ease-in-out hover:cursor-pointer">
                            <img onClick={switchType} src={change} className="w-[30px]" alt="switch" />
                        </div>
                        <div className="flex flex-col font-basic font-medium text-sm">
                            <div className="pl-1">you get</div>
                            <div className="border-2 border-black bg-base-1 p-2 b">
                                {tokenAmountOut ? tokenAmountOut + "$" + tokenTicker : "0 $" + tokenTicker}
                            </div>
                        </div>
                    </div>
                </div>
                <button 
                    className={`border-2 border-black connectbox font-basic px-4 mt-2 ${isLoading ? 'bg-base-11 animate-pulse' : 'bg-base-1'}`}
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading ? 'buying...' : 'buy'}
                </button>
            </form>
        </div>
    )
}
