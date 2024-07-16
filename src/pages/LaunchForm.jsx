import '../../globals.css'
import { useEffect, useState} from 'react'
import { useEthers} from "@usedapp/core";
import { Contract, ethers } from "ethers";
import {contracts} from "../helpers/contracts"
import {useFeeInfo, useCreateToken} from "../helpers/factoryHooks.jsx"
import Modal from "../components/Modal"



export default function Page () {

    const {account, chainId} = useEthers()

    console.log("chainID", chainId)
    
    const {state, send, events, resetState} = useCreateToken('deployNewToken', chainId, {transactionName: 'create'})
    const fee = useFeeInfo(chainId)

    console.log("fee", fee ? ethers.utils.formatEther(fee) : 0)
    console.log("state.status", state ? state.status : 0)

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
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        if(state.status == "Success"){
            setIsOpen(true)

        }
    },[state.status])

    const closeModal = () =>{
        setIsOpen(false)
        router.push('/')
    }


    const handleChange = (e) => {
        const {name, value} = e.target
        setFormData({...formData, [name]: value})

        console.log("formData",formData)
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
        if(formData.image && !isValidURL(formData.image)){newErrors.image = "has to be a valid url"}

        if(formData.buyAmount && isNaN(formData.buyAmount)){buyAmountErrors.number = "has to be a number"}
        if(formData.buyAmount && formData.buyAmount < 0){buyAmountErrors.negative = "cannot be a negative amount"}
        if(Object.keys(buyAmountErrors).length > 0){newErrors.buyAmount = buyAmountErrors}
        
        setErrors(newErrors)

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

    const handleSubmit = (e) =>{
        e.preventDefault()

        if(validateForm()){
            try{
                const contractAddresses = [contracts.eventhandler.addresses[chainId], contracts.WETH.addresses[chainId], contracts.sushiV2Factory.addresses[chainId], contracts.sushiV2Router.addresses[chainId]]
                const tokenName = formData.name
                const tokenSymbol = formData.ticker
                const tokenInfo = `{"des": "${formData.description || ""}", "twitter": "${formData.twitter || ""}", "telegram": "${formData.telegram || ""}", "website": "${formData.website || ""}", "logo": "${formData.image || ""}"}`
                const feeAddress = contracts.feeAddress[chainId]
                const buyAmount = formData.buyAmount > 0 ? ethers.utils.parseEther(formData.buyAmount.toString()) : 0
                const txValue= buyAmount > 0 ? (buyAmount.mul(5).div(1000)).add(fee) : fee
                {account && chainId &&
                    send(contractAddresses, tokenName, tokenSymbol, tokenInfo, feeAddress, buyAmount, {value: txValue}) // corrected to txValue from fee. not tested yet
                }

                console.log("formData try", formData)
            }
            catch(error){
                console.error("error on launch", error)
                console.log("formData fail", formData)

            }
            
        } else{
            console.log("newErrors", errors.ticker)
            console.log("newErrors", errors.buyAmount)
        }

    }


    return(
        <div className="flex flex-col font-medium items-center justify-center min-h-screen bg-base-1 pb-20">
            <Modal className="z-10" tx={state} isOpen={isOpen} closeModal={() => closeModal()}/>

            <div className={`font-base pb-8 pt-20 text-3xl z-0`}>
                almost there...
            </div>
            <form className={`connectbox border-4 border-black bg-base-4 py-2 pl-10 pr-20 h-auto content-center sm:max-2xl:w-[550px] z-0`}
                name="launch"
                onSubmit={handleSubmit}
            >
                <div className={`font-base pb-8 pt-2 text-xl`}>
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
                    >

                    </input>
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

                    >
                   
                    </input>
                    {errors && errors.ticker?.empty && <span className={`font-basic text-base-8 text-xs`}>{errors.ticker.empty}</span>}
                    {errors && errors.ticker?.length && <span className={`font-basic text-base-8 text-xs`}>{errors.ticker.length}</span>}

                </div>
                <div className={`flex flex-col justify-between py-3`}>
                <label className={`font-basic`} htmlFor="description">description</label>

                    <textarea className=" flex border-2 border-black px-1 text-sm min-h-24 h-auto w-auto"
                        placeholder="token description"
                        type="text"
                        id="description"
                        name="description"
                        onChange={handleChange}
                        value={formData.description}


                    >

                    </textarea>
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

                    >

                    </input>
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

                        >

                    </input>
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

                    >

                    </input>
                    {errors && errors.telegram && <span className={`font-basic text-base-8 text-xs`}>{errors.telegram}</span>}

                </div>
                <div className={`flex flex-col justify-between py-2`}>
                <label className={`font-basic`} htmlFor="image">logo <span className={`font-basic text-xs`}>(optional)</span></label>

                    <input className="border-2 border-black px-1 text-sm"
                            placeholder="https://yourimageurl.com"
                            type="text"
                            id="image"
                            name="image"
                            onChange={handleChange}
                            value={formData.image}

                    
                    >
                    </input>
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

                    
                    >
                    </input>
                    {errors && errors.buyAmount?.number && <span className={`font-basic text-base-8 text-xs`}>{errors.buyAmount.number}</span>}
                    {errors && errors.buyAmount?.negative && <span className={`font-basic text-base-8 text-xs`}>{errors.buyAmount.negative}</span>}

                </div>
                
                {(state.status === "None" || state.status === 'Success' || state.status === 'Fail') &&
                    <div className="flex flex-row justify-end gap-8 py-4">
                       {/*<Image className="animate-bounce" src="/sendit.svg" width={imgWidth} height={imgHeight} alt="arrow"/>*/}
                        <button type="submit" className={`font-basic connectbox border-4 border-black bg-base-7 py-2 px-8 hover:-translate-y-2 delay-50 hover:scale-110 ease-in-out hover:cursor-pointer`}> launch </button>
                    </div>
                }
                {(state.status === 'Mining' || state.status === 'Pending Signature') && 
                    <div className="flex flex-row justify-end gap-8 py-4">
                        <button className={`font-basic connectbox border-4 border-black bg-base-2 py-2 px-8 hover:-translate-y-2 delay-50 hover:scale-110 ease-in-out hover:cursor-pointer animate-pulse`} disabled> launching... </button>
                    </div>

                }

                
            </form>
            <div className={`font-base pt-4`}> launch price 0.001 ETH</div>


        </div>
    )
}