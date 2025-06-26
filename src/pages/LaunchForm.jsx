import '../../globals.css'
import { useEffect, useState} from 'react'
import { useAppKitProvider, useAppKitAccount, useAppKitNetworkCore } from '@reown/appkit/react'
import { useAppKitNetwork } from '@reown/appkit/react'
import { useNavigate } from 'react-router-dom'
import { ethers } from "ethers";
import {contracts} from "../helpers/contracts"
import SuccessModal from "../components/launchform/SuccessModal"
import FailModal from "../components/launchform/FailModal"
import bump from "../assets/sendit.svg"
import launch from "../assets/launch.svg"
import supported from "../assets/supported.svg"
import bnb from "../assets/s_bnb.svg"
import modulus from "../assets/s_modulus.svg"
import base from "../assets/s_base.svg"
import { supportedChainIds } from '../helpers/chains';
import factoryAbi from '../abis/factoryABI.json'
import useFeeInfo from '../hooks/useFeeInfo'
import useCreateToken from '../hooks/useCreateToken'
import WalletInstructionModal from "../components/launchpage/trade/WalletInstructionModal"
import { getWalletName } from '../helpers/config'



export default function LaunchForm() {
    const { isConnected, address } = useAppKitAccount()
    const { chainId } = useAppKitNetworkCore()
    const { switchNetwork } = useAppKitNetwork()
    const navigate = useNavigate()

    // Read fee directly from contract
    const { feeInfo } = useFeeInfo()

    // Factory contract hook
    const { contract, isLoading: isCreateLoading, error: createError, txHash, txReceipt, isSuccess, createToken } = useCreateToken()

    const imgWidth = 120
    const imgHeight = 60
    const loadSize = 60

    const [formData, setFormData] = useState({
        name:'',
        ticker:'',
        description:'',
        website:'',
        twitter:'',
        telegram:'',
        image:'',
        buyAmount:''
    })
    const [errors, setErrors] = useState({})
    const [showWalletModal, setShowWalletModal] = useState(false);
    const { walletProvider } = useAppKitProvider("eip155")
    const [error, setError] = useState(null);



    // Handle success modal - open when transaction succeeds
    useEffect(() => {
        if (isSuccess && txReceipt) {
            console.log("Token creation successful, opening success modal");
            // Hide wallet instruction modal on success
            setShowWalletModal(false);
        }
    }, [isSuccess, txReceipt])

    // Handle transaction errors
    useEffect(() => {
        if (createError) {
            console.log("Token creation failed:", createError);
            // Hide wallet instruction modal on error
            setShowWalletModal(false);
        }
    }, [createError])

    const closeModal = () => {
        navigate('/')
    }

    const closeFailModal = () => {
        // Clear error state when closing fail modal
        // This will be handled by the hook state
    }
    const handleCancelTransaction = () => {
        setShowWalletModal(false);
        setError("Transaction cancelled by user");
    }

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
        const result = isMobileUA || (isSmallScreen && isTouchDevice);
        
        console.log("🔍 Mobile Detection:", {
            userAgent: userAgent,
            isMobileUA,
            isSmallScreen,
            isTouchDevice,
            windowWidth: window.innerWidth,
            finalResult: result
        });
        
        return result;
    };

    const handleChange = (e) => {
        const {name, value} = e.target
        setFormData({...formData, [name]: value})
    }

    const validateForm = () => {
        let newErrors = {};
        let tickerErrors = {}
        let buyAmountErrors = {}

        if(!formData.name){newErrors.name = "name cannot be empty"}
        if(!formData.ticker){tickerErrors.empty = "ticker cannot be empty"}
        if(formData.ticker.length > 12){tickerErrors.length = "max 12 characters"}
        if(Object.keys(tickerErrors).length > 0){newErrors.ticker = tickerErrors}

        if(!formData.description){newErrors.description = "description cannot be empty"}

        if(formData.website && !isValidURL(formData.website)){newErrors.website = "has to be a valid url"}
        if(formData.twitter && !isValidURL(formData.twitter)){newErrors.twitter = "has to be a valid url"}
        if(formData.telegram && !isValidURL(formData.telegram)){newErrors.telegram = "has to be a valid url"}
        if(formData.image && !isValidImageURL(formData.image)){newErrors.image = "has to end with .png or .jpg"}

        if(formData.buyAmount && isNaN(formData.buyAmount)){buyAmountErrors.number = "has to be a number"}
        if(formData.buyAmount && formData.buyAmount < 0){buyAmountErrors.negative = "cannot be a negative amount"}
        if(Object.keys(buyAmountErrors).length > 0){newErrors.buyAmount = buyAmountErrors}
        
        setErrors(newErrors)
        console.log("newErrors", newErrors)
        return Object.keys(newErrors).length === 0;
    }

    function isValidURL(str) {
        var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
          '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
          '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
          '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
          '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
          '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
        return !!pattern.test(str);
    }

    function isValidImageURL(str) {
        return /\.(png|jpg)$/i.test(str);
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("isConnected", isConnected)
        console.log("fee", feeInfo)

        if (!feeInfo) {
            console.error("Fee not loaded yet");
            return;
        }

        if(validateForm() && isConnected){
            try{
                const isOnMobile = isMobile();
                if (isOnMobile) {
                    setShowWalletModal(true);
                    console.log("📱 Mobile detected - showing wallet instruction modal");
                } else {
                    console.log("🖥️ Desktop detected - wallet will open automatically");
                }

                const contractAddresses = [contracts.eventhandler.addresses[chainId], contracts.WETH.addresses[chainId], contracts.sushiV2Factory.addresses[chainId], contracts.sushiV2Router.addresses[chainId]]
                const tokenName = formData.name
                const tokenSymbol = formData.ticker
                const tokenInfo = JSON.stringify({
                    des: formData.description || "",
                    twitter: formData.twitter || "",
                    telegram: formData.telegram || "",
                    website: formData.website || "",
                    logo: formData.image || ""
                });

                const feeAddress = contracts.feeAddress[chainId]
                const parsedBuyAmount = formData.buyAmount > 0 ? ethers.parseEther(formData.buyAmount.toString()) : 0n
                //console.log("parsedBuyAmount", parsedBuyAmount)
                const totalValue = parsedBuyAmount > 0n ? (parsedBuyAmount + (parsedBuyAmount * 5n) / 1000n) + BigInt(feeInfo) : BigInt(feeInfo)
                //console.log("totalValue", totalValue)

                //console.log("calling writeContract")
                createToken(contractAddresses, tokenName, tokenSymbol, tokenInfo, feeAddress, parsedBuyAmount, totalValue)
                
                // Don't hide modal immediately - let it stay open until transaction completes
            }
            catch(error){
                console.error("Error creating token:", error)
                // Hide modal on error
                if (isMobile()) {
                    setShowWalletModal(false);
                }
            }
        }
    }

    
    return(
        <div className="flex flex-col font-basic font-medium items-center justify-center min-h-screen bg-base-1 pb-20 ">
            {/* Success Modal - controlled by hook state */}
            <SuccessModal 
                className="z-10" 
                isOpen={isSuccess && txReceipt} 
                closeModal={closeModal}
                tx={txReceipt}
            />
            {/* Fail Modal - controlled by hook state */}
            <FailModal 
                className="z-10" 
                isOpen={!!createError} 
                closeModal={closeFailModal}
                error={createError}
            />
            <WalletInstructionModal 
                isOpen={showWalletModal} 
                onClose={handleCancelTransaction}
                walletName={getWalletName(walletProvider)}
            />
            
            <div className={`pb-8 pt-20`}>
                <img src={launch} alt="launch"></img>
            </div>
            <form className={`connectbox border-4 border-black bg-base-4 py-2 pl-4 sm:pl-10 pr-4 sm:pr-20 h-auto content-center w-5/6 max-w-[700px] z-0`}
                name="launch"
                onSubmit={handleSubmit}
            >
                <div className={`font-bold pb-8 pt-2 text-xl`}>
                    input your token params
                </div>
                <div className={`flex flex-col justify-between py-3`}>
                    <label className={`font-basic`} htmlFor="name">name</label>
                    <input className="border-2 border-black px-1 text-sm"
                        placeholder="Coin"
                        type="text"
                        id="name"
                        name="name"
                        onChange={handleChange}
                        value={formData.name}
                    />
                    {errors && errors.name && <span className={`font-basic text-base-8 text-xs`}>{errors.name}</span>}
                </div>
                <div className={`flex flex-col justify-between py-3`}>
                    <label className={`font-basic`} htmlFor="ticker">ticker</label>
                    <input className="border-2 border-black px-1 text-sm"
                        placeholder="COIN"
                        type="text"
                        id="ticker"
                        name="ticker"
                        onChange={handleChange}
                        value={formData.ticker}
                    />
                    {errors && errors.ticker?.empty && <span className={`font-basic text-base-8 text-xs`}>{errors.ticker.empty}</span>}
                    {errors && errors.ticker?.length && <span className={`font-basic text-base-8 text-xs`}>{errors.ticker.length}</span>}
                </div>
                <div className={`flex flex-col justify-between py-3`}>
                    <label className={`font-basic`} htmlFor="description">description</label>
                    <textarea className="flex border-2 border-black px-1 text-sm min-h-24 h-auto w-auto"
                        placeholder="token description"
                        type="text"
                        id="description"
                        name="description"
                        onChange={handleChange}
                        value={formData.description}
                    />
                    {errors && errors.description && <span className={`font-basic text-base-8 text-xs`}>{errors.description}</span>}
                </div>
                <div className={`flex flex-col justify-between py-2`}>
                    <label className={`font-basic`} htmlFor="website">website <span className={`font-basic text-xs`}>(optional)</span></label>
                    <input className="border-2 border-black px-1 text-sm"
                        placeholder="https://yourwebsite.com"
                        type="text"
                        id="website"
                        name="website"
                        onChange={handleChange}
                        value={formData.website}
                    />
                    {errors && errors.website && <span className={`font-basic text-base-8 text-xs`}>{errors.website}</span>}
                </div>
                <div className={`flex flex-col justify-between py-2`}>
                    <label className={`font-basic`} htmlFor="twitter">twitter <span className={`font-basic text-xs`}>(optional)</span></label>
                    <input className="border-2 border-black px-1 text-sm"
                        placeholder="https://x.com/YourX"
                        type="text"
                        id="twitter"
                        name="twitter"
                        onChange={handleChange}
                        value={formData.twitter}
                    />
                    {errors && errors.twitter && <span className={`font-basic text-base-8 text-xs`}>{errors.twitter}</span>}
                </div>
                <div className={`flex flex-col justify-between py-2`}>
                    <label className={`font-basic`} htmlFor="telegram">telegram <span className={`font-basic text-xs`}>(optional)</span></label>
                    <input className="border-2 border-black px-1 text-sm"
                        placeholder="https://t.me/YourTG"
                        type="text"
                        id="telegram"
                        name="telegram"
                        onChange={handleChange}
                        value={formData.telegram}
                    />
                    {errors && errors.telegram && <span className={`font-basic text-base-8 text-xs`}>{errors.telegram}</span>}
                </div>
                <div className={`flex flex-col justify-between py-2`}>
                    <label className={`font-basic`} htmlFor="image">logo <span className={`font-basic text-xs`}>(optional)</span></label>
                    <input className="border-2 border-black px-1 text-sm"
                        placeholder=".png or .jpg"
                        type="text"
                        id="image"
                        name="image"
                        onChange={handleChange}
                        value={formData.image}
                    />
                    {errors && errors.image && <span className={`font-basic text-base-8 text-xs`}>{errors.image}</span>}
                </div>
                <div className={`flex flex-col justify-between py-3`}>
                    <label className={`font-basic`} htmlFor="buyAmount">buy amount[ETH] <span className={`font-basic text-xs`}>(optional)</span></label>
                    <input className="border-2 border-black px-1 text-sm"
                        placeholder="0.001"
                        type="number"
                        id="buyAmount"
                        name="buyAmount"
                        onChange={handleChange}
                        value={formData.buyAmount}
                        step="any"
                    />
                    {errors && errors.buyAmount?.number && <span className={`font-basic text-base-8 text-xs`}>{errors.buyAmount.number}</span>}
                    {errors && errors.buyAmount?.negative && <span className={`font-basic text-base-8 text-xs`}>{errors.buyAmount.negative}</span>}
                </div>
                
                {isCreateLoading ? (
                    <div className="flex flex-row justify-end gap-8 py-4">
                        <button className={`font-basic connectbox border-4 border-black bg-base-2 py-2 px-8 hover:-translate-y-2 delay-50 hover:scale-110 ease-in-out hover:cursor-pointer animate-pulse`} disabled> launching... </button>
                    </div>
                ) : (
                    <div className="flex flex-row justify-end gap-8 py-4">
                        <img className="animate-bounce max-sm:hidden" src={bump} width={imgWidth} height={imgHeight} alt="arrow"></img>
                        <button type="submit" className={`font-basic connectbox border-4 border-black bg-base-7 py-2 px-8 hover:-translate-y-2 delay-50 hover:scale-110 ease-in-out hover:cursor-pointer`}> launch </button>
                    </div>
                )}
            </form>
            <div className={`font-bold pt-4`}> 
                launch price: {feeInfo ? `${ethers.formatEther(feeInfo.toString())} CULT` : 'loading...'} 
            </div>
        </div>
    )
}