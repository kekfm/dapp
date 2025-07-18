import "../../globals.css"
import { useSearchParams } from "react-router-dom"
import { useState, useEffect } from "react"
import axios from "axios"
import LaunchCard from "../components/landing/LaunchCard"
import devpage from "../assets/devpage.svg"
import empty from "../assets/emptiness.svg"
import { useAppKitAccount, useAppKitProvider } from '@reown/appkit/react'
import { ethers } from "ethers"




export default function Account (){

    const {address} = useAppKitAccount()
    const { walletProvider } = useAppKitProvider("eip155")
    const [searchParams, setSerchParams] = useSearchParams()
    const [devData, setDevData] = useState([])
    const [devAddr, setDevAddr] = useState("")
    const [isAdmin, setIsAdmin] = useState(false)   
    const [featured, setFeatured] = useState([])
    
    // Manage featured states
    const [tokenAddress, setTokenAddress] = useState("")
    const [isAddingFeatured, setIsAddingFeatured] = useState(false)
    const [isRemovingFeatured, setIsRemovingFeatured] = useState(false)
    const [manageMessage, setManageMessage] = useState("")
    const [manageError, setManageError] = useState("")

    useEffect(() => {
        const checkAdmin = async () => {
            const adminAddress = import.meta.env.VITE_ADMIN1
            if(address == adminAddress){
                setIsAdmin(true)
            }
        }
        checkAdmin()
    }, [address])



    useEffect(() => {
        const fetchFeatured = async () => {
            if(isAdmin){
                try{
                    const response = await axios.get(`${import.meta.env.VITE_GET_FEATURED}`)
                    console.log("response", response)
                    setFeatured(response.data)
                }
                catch(e){
                    console.log("error fetching featured", e)
                }
            }
        }
        fetchFeatured()
    }, [isAdmin])

    console.log("isAdmin", isAdmin)

    
    useEffect (() => {

        const fetchData = async (devAddress) => {
            try {
                //const response = await axios.get(`https://kek.fm/api/getDev/${devAddress}`) // old implementation using vps
                const response = await axios.get(`${import.meta.env.VITE_GET_DEV}${devAddress}`) // new implementation using render

                const data = response.data
                console.log("devdata", data)

                const filtered =  data.filter((item, index, self) => index === self.findIndex((t) => (
                    item.timestamp === t.timestamp
                )))

                setDevData(filtered)
            }
           catch(e){console.log("error fetching dev data", e)}

        }

        const devAddress = searchParams.get("account")
        setDevAddr(devAddress)

        fetchData(devAddress)
    },[])

    const clearMessages = () => {
        setManageMessage("")
        setManageError("")
    }

    const handleAddFeatured = async () => {
        if (!tokenAddress.trim()) {
            setManageError("Please enter a token address")
            return
        }

        if (!ethers.isAddress(tokenAddress)) {
            setManageError("Please enter a valid token address")
            return
        }

        setIsAddingFeatured(true)
        clearMessages()

        try {
            const timestamp = Math.floor(Date.now() / 1000).toString()
            const message = `Add featured token: ${tokenAddress} at ${timestamp}`

            if (!walletProvider) {
                throw new Error("Wallet not connected")
            }

            const provider = new ethers.BrowserProvider(walletProvider)
            const signer = await provider.getSigner()
            const signature = await signer.signMessage(message)

            // Debug: log the API URL being used
            const apiUrl = import.meta.env.VITE_ADD_FEATURED
            
            const response = await axios.post(`${apiUrl}`, {
                tokenAddress,
                message,
                signature,
                timestamp
            })

            setManageMessage("Token successfully added to featured list")
            setTokenAddress("")
            
            // Refresh featured list
            const featuredResponse = await axios.get(`${import.meta.env.VITE_GET_FEATURED}`)
            setFeatured(featuredResponse.data)

        } catch (error) {
            console.error("Error adding featured token:", error)
            if (error.response?.data?.error) {
                setManageError(error.response.data.error)
            } else if (error.code === 'ACTION_REJECTED') {
                setManageError("Transaction was cancelled by user")
            } else {
                setManageError("Failed to add featured token")
            }
        } finally {
            setIsAddingFeatured(false)
        }
    }

    const handleRemoveFeatured = async () => {
        if (!tokenAddress.trim()) {
            setManageError("Please enter a token address")
            return
        }

        if (!ethers.isAddress(tokenAddress)) {
            setManageError("Please enter a valid token address")
            return
        }

        setIsRemovingFeatured(true)
        clearMessages()

        try {
            const timestamp = Math.floor(Date.now() / 1000).toString()
            const message = `Remove featured token: ${tokenAddress} at ${timestamp}`

            if (!walletProvider) {
                throw new Error("Wallet not connected")
            }

            const provider = new ethers.BrowserProvider(walletProvider)
            const signer = await provider.getSigner()
            const signature = await signer.signMessage(message)

            // Debug: log the API URL being used
            const apiUrl = import.meta.env.VITE_REMOVE_FEATURED
            
            const response = await axios.post(`${apiUrl}`, {
                tokenAddress,
                message,
                signature,
                timestamp
            })

            setManageMessage("Token successfully removed from featured list")
            setTokenAddress("")
            
            // Refresh featured list
            const featuredResponse = await axios.get(`${import.meta.env.VITE_GET_FEATURED}`)
            setFeatured(featuredResponse.data)

        } catch (error) {
            console.error("Error removing featured token:", error)
            if (error.response?.data?.error) {
                setManageError(error.response.data.error)
            } else if (error.code === 'ACTION_REJECTED') {
                setManageError("Transaction was cancelled by user")
            } else {
                setManageError("Failed to remove featured token")
            }
        } finally {
            setIsRemovingFeatured(false)
        }
    }

    if(devData.length == 0 && !isAdmin){
        return(
            <div className="flex h-screen justify-center">
                <div className="flex justify-center w-60">
                    <img src= {empty} alt="empty"></img>
                </div>
            </div>
            
        )
    }

    return(

        <div className="flex flex-col pt-10 items-center mb-10">
            <div className="flex flex-col items-center">
                <div className="font-basic font-extrabold text-2xl mb-4">
                    <img src={devpage}></img>
                </div>
                {
                    <div className="connectbox border-4 border-black bg-base-5 px-4 py-2 font-basic font-semibold text-sm md:text-xl max-w-[300px]">
                        {devAddr.slice(0,10)}...{devAddr.slice(devAddr.length-8,devAddr.length)}
                    </div>
                }
                
            </div>
            <div className="flex flex-col bg-base-5 connectbox border-4 border-black gap-4 items-center w-full mt-20 overflow-x-auto pb-10">
                <div className="font-basic font-extrabold text-2xl pt-2">
                    devs past launches
                </div>
                <div className="flex flex-row flex-wrap justify-center gap-8 p-4 overflow-x-auto">
                    {devData &&
                        devData.map((item,index) => (<LaunchCard key={index} data={item} />))
                    } 
                </div>
            </div> 
            {
                isAdmin && (
                    <>
                        <div className="flex flex-col bg-base-5 connectbox border-4 border-black gap-4 items-center w-full mt-20 overflow-x-auto pb-10">
                            <div className="font-basic font-extrabold text-2xl pt-2">
                                admin tools
                            </div>
                            <div className="flex flex-row flex-wrap justify-center gap-8 p-4 overflow-x-auto">
                                {featured &&
                                    featured.map((item,index) => (<LaunchCard key={index} data={item} />))
                                }
                            </div>
                        </div>
                        
                        <div className="flex flex-col bg-base-5 connectbox border-4 border-black gap-4 items-center w-full mt-20 pb-10 max-w-2xl">
                            <div className="font-basic font-extrabold text-2xl pt-2">
                                manage featured
                            </div>
                            
                            <div className="flex flex-col gap-4 w-full max-w-md px-4">
                                <div className="flex flex-col gap-2">
                                    <label className="font-basic font-medium" htmlFor="tokenAddress">
                                        Token Address
                                    </label>
                                    <input
                                        id="tokenAddress"
                                        type="text"
                                        value={tokenAddress}
                                        onChange={(e) => {
                                            setTokenAddress(e.target.value)
                                            clearMessages()
                                        }}
                                        placeholder="0x..."
                                        className="border-2 border-black px-3 py-2 connectbox focus:outline-none"
                                    />
                                </div>
                                
                                <div className="flex flex-row gap-4 justify-center">
                                    <button
                                        onClick={handleAddFeatured}
                                        disabled={isAddingFeatured || isRemovingFeatured}
                                        className={`font-basic connectbox border-2 border-black bg-green-500 px-4 py-2 hover:scale-105 transition-all duration-200 ${
                                            isAddingFeatured || isRemovingFeatured 
                                                ? 'opacity-50 cursor-not-allowed' 
                                                : 'hover:cursor-pointer'
                                        }`}
                                    >
                                        {isAddingFeatured ? 'Adding...' : 'Add Featured'}
                                    </button>
                                    
                                    <button
                                        onClick={handleRemoveFeatured}
                                        disabled={isAddingFeatured || isRemovingFeatured}
                                        className={`font-basic connectbox border-2 border-black bg-red-500 px-4 py-2 hover:scale-105 transition-all duration-200 ${
                                            isAddingFeatured || isRemovingFeatured 
                                                ? 'opacity-50 cursor-not-allowed' 
                                                : 'hover:cursor-pointer'
                                        }`}
                                    >
                                        {isRemovingFeatured ? 'Removing...' : 'Remove Featured'}
                                    </button>
                                </div>
                                
                                {manageMessage && (
                                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 connectbox text-sm font-basic">
                                        {manageMessage}
                                    </div>
                                )}
                                
                                {manageError && (
                                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 connectbox text-sm font-basic">
                                        {manageError}
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )
            }
        </div>
    )
}