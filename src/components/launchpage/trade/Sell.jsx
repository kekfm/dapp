import { useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react'
import { useState, useEffect } from 'react'
import "/globals.css"
import { ethers } from "ethers"
import SellModal from "./SellModal"
import change from "../../../assets/change2.svg"
import useSellToken from '../../../hooks/useSellToken'
import useCultBalance from '../../../hooks/useCultBalance'
import useGetCultOut from '../../../hooks/useGetCultOut'

export default function Sell ({tokenAddress, tokenTicker, setIsBuy, tokenBalance, trading}) {
    const { address } = useAppKitAccount()
    const { chainId } = useAppKitNetwork()
    const [sellAmountToken, setSellAmountToken] = useState(0)
    const [parsedToken, setParsedToken] = useState("0")
    const [slippage, setSlippage] = useState(5)
    const [sellModalOpen, setSellModalOpen] = useState(false)
    const [errors, setErrors] = useState({})
    const [calcCultOut, setCalcCultOut] = useState(0)
    
    const { sellToken, isLoading, isSuccess, isError, receipt } = useSellToken(tokenAddress)
    const { balance:ethBalance, error } = useCultBalance()
    const { cultOut, error:cultOutError, getCultOut } = useGetCultOut(tokenAddress)

    useEffect(() => {
        async function fetchCultOut() {
            if(sellAmountToken > 0) {
                const cultOut = await getCultOut(sellAmountToken)
                console.log("cultOut", cultOut)
                setCalcCultOut(cultOut)
            } else {
                setCalcCultOut(0)
            }
        }
        fetchCultOut()
    }, [sellAmountToken])

    const handleSellSubmit = async (e) => {
        e.preventDefault()
        if (sellAmountToken > 0) {
            try {
                // calc input params
                const slipPerc = slippage > 0 ? slippage : 5
                const minETH = Number(calcCultOut) - (Number(calcCultOut) * slipPerc / 100)
                const stringETH = minETH.toString()

                if (validateForm()) {
                    await sellToken(parsedToken, ethers.parseEther(stringETH))
                }
            } catch (e) {
                console.log("error selling", e)
            }
        } else {
            console.log("input an amount greater than zero")
        }
    }

    const switchType = () => {
        setIsBuy(true)
    }

    const validateForm = () => {
        let newErrors = {}
        if(slippage < 0){newErrors.slippageUnderflow = "min is 0%"}
        if(slippage > 90){newErrors.slippageOverflow = "max is 90%"}
        if(Number(sellAmountToken) < 0){newErrors.tokenUnderflow = "must be at least 0.0001 ETH"}
        if(Number(sellAmountToken) > Number(ethers.formatEther(tokenBalance))){newErrors.tokenOverflow = "amount exceeds your balance"}

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    useEffect(() => {
        if(isSuccess) {
            setSellModalOpen(true)
        }
    }, [isSuccess])

    const handleSellModal = () => {
        if(sellModalOpen) {
            setSellModalOpen(false)
        }
    }

    const handleChange = (e) => {
        const {value} = e.target
        setSellAmountToken(value)
        const stringValue = value.toString()

        if(value > 0) {
            const parsed = ethers.parseEther(stringValue)
            setParsedToken(parsed)
        }
    }

    const handleSlippage = (e) => {
        const {value} = e.target
        setSlippage(value)
    }

    if(!trading) {
        return(
            <div className="connectbox border-4 border-black bg-gray-400 max-w-[300px] max-sm:mx-1 max-sm:mb-4 max-sm:p-1 max-sm:py-4 sm:p-4">
                <form name="sell" onSubmit={handleSellSubmit}>
                    <div className="flex flex-col">
                        <div className="flex flex-row justify-between pb-2">
                            <div className="font-basic font-semibold">
                                launched
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col bg-base-4 border-2 border-black">
                        <div className="flex flex-col bg-white px-2 py-2">
                            <label className="font-basic text-sm font-medium pl-1" htmlFor="sellToken">sell amount (${tokenTicker})</label>
                            <div className="border-2 border-black bg-white">
                                <input
                                    placeholder={"$"+`${tokenTicker}`}
                                    type="number"
                                    id="sellToken"
                                    name="sellAmount"
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
                </form>
            </div>
        )
    }

    return(
        <div className="connectbox border-4 border-black bg-base-4 max-w-[300px] max-sm:mx-1 max-sm:mb-4 max-sm:p-1 max-sm:py-4 sm:p-4">
            <SellModal isOpen={sellModalOpen} closeModal={handleSellModal} tx={receipt} />
            <form name="sell" onSubmit={handleSellSubmit}>
                <div className="flex flex-col">
                    <div className="flex flex-row justify-between pb-2">
                        <div className="font-basic font-semibold">sell</div>
                        <div className="flex flex-row">
                            <div className="font-basic text-sm pr-2">slippage</div>
                            <input
                                type="number"
                                className="w-[40px] text-sm font-basic pl-1"
                                onChange={handleSlippage}
                                value={slippage}
                            />
                            <div className="font-basic text-sm pl-1">%</div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col bg-base-4 border-2 border-black">
                    <div className="flex flex-col bg-white px-2 py-2">
                        <label className="font-basic text-sm font-medium pl-1" htmlFor="sellToken">sell amount (${tokenTicker})</label>
                        <div className="border-2 border-black bg-white">
                            <input
                                placeholder={"$"+`${tokenTicker}`}
                                type="number"
                                id="sellToken"
                                name="sellAmount"
                                onChange={handleChange}
                                value={sellAmountToken}
                                min="1"
                                step="any"
                                className="font-basic font-bold pl-1"
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
                            <div className="border-2 border-black bg-base-1 p-2 b">
                                {calcCultOut ? calcCultOut + " CULT" : "0 CULT"}
                            </div>
                        </div>
                    </div>
                </div>
                {!isLoading ? (
                    <button className="border-2 border-black connectbox bg-base-1 font-basic px-4 mt-2" type="submit">
                        sell
                    </button>
                ) : (
                    <button className="animate-pulse border-2 border-black bg-base-11 font-basic px-4 mt-2">
                        selling...
                    </button>
                )}
            </form>
        </div>
    )
}
