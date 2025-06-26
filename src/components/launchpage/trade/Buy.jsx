import { useAppKitProvider, useAppKitAccount, useAppKitNetworkCore } from '@reown/appkit/react'
import { useState, useEffect } from 'react'
import "/globals.css"
import { ethers } from "ethers"
import BuyModal from "./BuyModal"
import WalletInstructionModal from "./WalletInstructionModal"
import change from "../../../assets/change2.svg"
import useTokenBalance from '../../../hooks/useTokenBalance'
import useGetTokensOut from '../../../hooks/useGetTokensOut'
import { contracts } from '../../../helpers/contracts'
import { getWalletName } from '../../../helpers/config'

export default function Buy ({tokenAddress, tokenTicker, setIsBuy, trading }) {
    const { address } = useAppKitAccount()
    const { chainId } = useAppKitNetworkCore()
    const { walletProvider } = useAppKitProvider("eip155")

    const [buyAmountETH, setBuyAmountETH] = useState(0)
    const [parsedETH, setParsedETH] = useState("")
    const [slippage, setSlippage] = useState(5)
    const [buyModalOpen, setBuyModalOpen] = useState(false)
    const [errors, setErrors] = useState({})
    const [tokenAmountOut, setTokenAmountOut] = useState(0)

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [txHash, setTxHash] = useState(null);
    const [txReceipt, setTxReceipt] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [showWalletModal, setShowWalletModal] = useState(false);

    
    const { balance, error:balanceError } = useTokenBalance(tokenAddress)
    const { tokensOut:tokenAmount, error:tokensOutError, getTokenAmount } = useGetTokensOut (tokenAddress)

    // Mobile detection function
    const isMobile = () => {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        
        // Check for mobile user agents
        const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
        const isMobileUA = mobileRegex.test(userAgent);
        
        // Check for small screen size
        const isSmallScreen = window.innerWidth <= 768;
        
        // Check if it's a touch device
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        // Return true if any mobile indicator is found
        return isMobileUA || (isSmallScreen && isTouchDevice);
    };

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
            if(!validateForm()) {
                return
            }
            try {
                setIsLoading(true);
                setError(null);
                setTxHash(null);
                setTxReceipt(null);
                setIsSuccess(false);
                
                // 🔥 SHOW WALLET INSTRUCTION MODAL ONLY ON MOBILE
                const isOnMobile = isMobile();
                if (isOnMobile) {
                    setShowWalletModal(true);
                    console.log("📱 Mobile detected - showing wallet instruction modal");
                } else {
                    console.log("🖥️ Desktop detected - wallet will open automatically");
                }
                
                // calc input params
                const slipPerc = slippage > 0 ? slippage : 5
                const numTokens = Number(tokenAmountOut)
                const slippageTokens = (slipPerc * numTokens / 100)
                const minTokens = numTokens - slippageTokens
                const stringMinTokens = minTokens.toString()
                const parsedTokens = ethers.parseEther(stringMinTokens)

                //calc tx value
                const valNum = Number(buyAmountETH)// + Number(buyAmountETH) * 5 / 1000
                const stringNum = valNum.toString()
                const txValue = ethers.parseEther(stringNum)

                console.log("🎯 Starting transaction - wallet will be triggered automatically...");
                
                //create Contract
                const provider = new ethers.BrowserProvider(walletProvider, chainId);
                const signer = await provider.getSigner();
                const contractAddress = tokenAddress;
                
            
                const newContract = new ethers.Contract(
                    contractAddress,
                    contracts.token.interface[chainId],
                    signer
                );
                console.log("newContract", newContract)
                console.log("parsedTokens", parsedTokens)
                console.log("parsedETH", parsedETH)
                console.log("txValue", txValue)

                const tx = await newContract.buy(parsedTokens, parsedETH, {value: String(txValue)})
                
                // 🔥 HIDE MODAL WHEN TRANSACTION IS SENT (only if mobile)
                if (isOnMobile) {
                    setShowWalletModal(false);
                }
                
                setTxHash(tx.hash);
                console.log("✅ Transaction sent! Hash:", tx.hash);
                
                const receipt = await tx.wait();
                setTxReceipt(receipt);

                if (receipt.status === 1) {
                    console.log("🎉 Transaction successful!");
                    setIsSuccess(true);
                } else {
                    throw new Error('Transaction failed - status 0');
                }

            } catch (err) {
                // 🔥 HIDE MODAL ON ERROR (only if mobile)
                if (isMobile()) {
                    setShowWalletModal(false);
                }
                
                console.error('💥 Transaction error:', {
                    error: err,
                    message: err.message,
                    code: err.code,
                    reason: err.reason
                });
                
                // Set user-friendly error
                let errorMessage = 'Transaction failed';
                if (err.code === 'USER_REJECTED') {
                    errorMessage = 'Transaction was rejected by user';
                } else if (err.code === 'INSUFFICIENT_FUNDS') {
                    errorMessage = 'Insufficient funds for transaction';
                } else if (err.message?.includes('insufficient funds')) {
                    errorMessage = 'Insufficient funds for transaction + gas fees';
                } else if (err.message) {
                    errorMessage = err.message;
                }
                
                setError(errorMessage);
                
            }finally {
                console.log("🏁 Transaction completed");
                setIsLoading(false);
            }
        }
    }

    const switchType = () => {
        setIsBuy(false)
    }

    const handleCancelTransaction = () => {
        setShowWalletModal(false);
        setIsLoading(false);
        setError("Transaction cancelled by user");
    }

    const validateForm = () => {
        let newErrors = {}
        if(slippage < 0){newErrors.slippageUnderflow = "min is 0%"}
        if(slippage > 90){newErrors.slippageOverflow = "max is 90%"}
        if(Number(buyAmountETH) < 0.0001){newErrors.ETHUnderflow = "must be at least 0.0001 ETH"}

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
            <BuyModal isOpen={buyModalOpen} closeModal={handleBuyModal} tx={txReceipt} />
            
            {/* 🔥 WALLET INSTRUCTION MODAL */}
            <WalletInstructionModal 
                isOpen={showWalletModal} 
                onClose={handleCancelTransaction}
                walletName={getWalletName(walletProvider)}
            />
            
            <form name="buy" onSubmit={handleBuySubmitBuy}>
                <div className="flex flex-col">
                    <div className="flex flex-row justify-between pb-2">
                        <div className="font-basic font-semibold">buy ${tokenTicker}</div>
                        <div className="flex flex-row items-center">
                            <div className="font-basic font-medium text-xs pr-2">
                                slippage (%)
                            </div>
                                <input
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
