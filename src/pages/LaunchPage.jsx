import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { useState, useEffect} from 'react'
import axios from 'axios'
import "../../globals.css"
import noimage from "../assets/noimage.svg"
import bnb from "../assets/bnbconnect.svg"
import base from "../assets/baseconnect.svg"
import modulus from "../assets/modulusconnect.svg"
import tokenpage from "../assets/tokenpage.svg"
import { ethers } from 'ethers'
import Trade from '../components/launchpage/trade/Trade'
import CommentSection from '../components/launchpage/comments/CommentSection'
import Holders from '../components/launchpage/Holders'
import Progressbar from '../components/landing/Progressbar'
import ChartSection from '../components/launchpage/chart/ChartSection'
import { io } from "socket.io-client"
import factoryAbi from '../abis/factoryABI.json'
import tokenAbi from '../abis/tokenABI.json'
import { useAppKitAccount } from '@reown/appkit/react';
import useTokenBalance from '../hooks/useTokenBalance'





export default function LaunchPage () {

    const [searchParams, setSearchParams] = useSearchParams()
    const [props, setProps] = useState([])
    const [d,setD] = useState()
    const [tokenAddr, setTokenAddr] = useState("")
    const [uniqueBuys, setUniqueBuys] = useState([])
    const [uniqueSells, setUniqueSells] = useState([])
    const [latestTx, setLatestTx] = useState([])
    const [jeet, setJeet] = useState("no")
    const [percentage, setPercentage] = useState(0)
    const [transactions, setTransactions] = useState([])
    const [trading, setTrading] = useState(true)
    const [comments, setComments] = useState([])

    const { address, chainId } = useAppKitAccount()

    const navigate = useNavigate()

    const { balance:tokenBalance, error } = useTokenBalance(tokenAddr)

    useEffect(()=>{
        const fetchData = async (tokenAddress) =>{
            try{
                //const response = await axios.get(`https://kek.fm/api/getOne/${tokenAddress}`) //use for vps
                const response = await axios.get(`${import.meta.env.VITE_GET_ONE}${tokenAddress}`) //new implementation on render
                const data = response.data[0]
                //console.log("launch page data",data)
                setProps(data)
                setComments(data.comments)
                //console.log("launch page data", data)

                //get unique tx
                const uBuys = data.buys.filter((buy, index, self) => index === self.findIndex((t) => (t.maker === buy.maker && t.timestamp === buy.timestamp)))
                const uSells = data.sells.filter((sell, index, self) => index === self.findIndex((t) => (t.maker === sell.maker && t.timestamp === sell.timestamp)))
                setUniqueBuys(uBuys)
                setUniqueSells(uSells)

                //holders section
                const transactions = [...uBuys, ...uSells]
                setTransactions(transactions)
                transactions.sort((a,b) => b.timestamp - a.timestamp)
                let latestTxns = {}
                transactions.forEach(transaction => {
                    const {maker} = transaction
                    if(!latestTxns[maker]){
                        latestTxns[maker] = transaction
                    }
                })
                const latestTxnsArray = Object.values(latestTxns);
                setLatestTx(latestTxnsArray)

                console.log("latestTxns", latestTxns)
                console.log("latestTxnsArray", latestTxnsArray)
                console.log("transactions", transactions)

                const last = latestTxnsArray[0]

                if(last){
                    const soldTokens = (100000 - Number(ethers.formatEther(last.contractTokenBalance)))
                    const percentage = soldTokens / 75000 * 100
                    setPercentage(percentage)
                }

                //set jeet
                let jeet = {}
                    uSells.forEach(sell => {
                        if(sell.maker == data.owner){
                            jeet = {...data.owner}
                        }
                    })
                const jeetArray = Object.values(jeet)

                if(jeetArray.length >0){
                    setJeet("yes")
                }

               
                //const d = JSON.parse(data.description) //old implementation without parsing in backend
                const d = data.description //new implementation with parsing in backend
                setD(d)

                //console.log("data.description", data.description)
                //console.log("d.des", d.des)


                //const uniswap = await axios.get(`https://kek.fm/api/getOneUniswap/${tokenAddress}`) //implementation when using a vps
                const uniswap = await axios.get(`${import.meta.env.VITE_GET_ONE_UNISWAP}${tokenAddress}`) // new implementation on render

                if(uniswap.data.length > 0){
                    setTrading(false)
                }
               
            }catch(e){
                console.log("error", e)
            }
           
        }
        const tokenAddress = searchParams.get("token")
        setTokenAddr(tokenAddress)
       fetchData(tokenAddress) 
    },[])

   
      

    useEffect(() => {
        //const socket = io('https://kek.fm', { // old implementation using vps
        const socket = io(`${import.meta.env.VITE_SOCKET_IO}`, { // old implementation using vps

            path: '/socket.io/',
            transports: ['websocket', 'polling'], // Allow both transports
            withCredentials: true,
        });

        socket.on("newComment", (data) => {
            setComments((prevValue) => {
               const newData = [...prevValue, data]
               return newData
            })
        })

        return () => {
            socket.disconnect();
        };

    },[])

   

    console.log("tokenBalance", tokenBalance)
   
    const goToDev = () => {
        navigate(`/me?account=${props.owner}`)
    }

    return(
        <div className="flex flex-col items-center w-full pt-10 pb-20 bg-base-1 min-h-screen">
            {/* Header */}
            <div className="flex justify-center pb-8">
                <img src={tokenpage} className="max-w-[280px]" alt="Token Page" />
            </div>

            {props && d && (
                <div className="flex flex-col w-full max-w-6xl px-4 gap-8">
                    {/* Main Content Row */}
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Left Column - Token Info Card */}
                        <div className="flex-1">
                            <div className="connectbox border-4 border-black bg-base-7 p-6">
                                {/* Token Header */}
                                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                                    <div className="w-32 h-32 flex-shrink-0">
                                        {d && d.logo ? (
                                            <img 
                                                src={d.logo} 
                                                alt={props.name} 
                                                className="w-full h-full object-cover border-4 border-black connectbox bg-white"
                                            />
                                        ) : (
                                            <img 
                                                src={noimage} 
                                                alt="No image" 
                                                className="w-full h-full object-cover border-4 border-black connectbox bg-white"
                                            />
                                        )}
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        <h1 className="font-basic font-bold text-2xl text-black mb-2">
                                            {props.name} (${props.symbol})
                                        </h1>
                                        
                                        {/* Progress Section */}
                                        <div className="mb-4">
                                            <div className="font-basic text-sm font-bold text-black mb-1">
                                                Progress: {percentage.toFixed(1)}%
                                            </div>
                                            <Progressbar percentage={percentage} />
                                        </div>
                                        
                                        {/* Creator Info */}
                                        <div className="font-basic text-sm text-black hover:cursor-pointer mb-2" onClick={goToDev}>
                                            Created by <span className='text-base-2 font-semibold'>
                                                {props.owner.slice(0,6)}...{props.owner.slice(-4)}
                                            </span>
                                        </div>
                                        
                                        {/* Chain Info */}
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="font-bold">Chain:</span>
                                            {props.chainId == 97 && <img className="w-5 h-5" src={bnb} alt="BSC" />}
                                            {props.chainId == 8453 && <img className="w-5 h-5" src={base} alt="Base" />}
                                            {props.chainId == 6666 && <img className="w-5 h-5" src={modulus} alt="Modulus" />}
                                        </div>
                                    </div>
                                </div>

                                {/* Stats Row */}
                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    <div className="text-center p-3 bg-base-2 border-4 border-black connectbox">
                                        <div className="font-bold text-lg text-black">{uniqueBuys?.length}</div>
                                        <div className="text-xs font-bold">Buys</div>
                                    </div>
                                    <div className="text-center p-3 bg-base-2 border-4 border-black connectbox">
                                        <div className="font-bold text-lg text-black">{uniqueSells?.length}</div>
                                        <div className="text-xs font-bold">Sells</div>
                                    </div>
                                    <div className={`text-center p-3 border-4 border-black connectbox ${jeet == "no" ? "bg-base-12" : "bg-base-8"}`}>
                                        <div className="font-bold text-lg text-black">{jeet}</div>
                                        <div className="text-xs font-bold text-black">Dev Jeeted?</div>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="mb-6">
                                    <h3 className="font-basic font-bold text-lg mb-2">Description</h3>
                                    <div className='connectbox border-4 border-black bg-white p-4 text-sm max-h-32 overflow-auto'>
                                        {d.des}
                                    </div>
                                </div>

                                {/* Links */}
                                {(d?.website || d?.twitter || d?.telegram) && (
                                    <div>
                                        <h3 className="font-basic font-bold text-lg mb-2">Links</h3>
                                        <div className="flex flex-wrap gap-3">
                                            {d?.website && (
                                                <Link 
                                                    to={d.website} 
                                                    className="connectbox border-4 border-black bg-base-1 px-4 py-2 text-sm font-bold hover:bg-base-2 transition-colors"
                                                >
                                                    🌐 Website
                                                </Link>
                                            )}
                                            {d?.twitter && (
                                                <Link 
                                                    to={d.twitter} 
                                                    className="connectbox border-4 border-black bg-base-1 px-4 py-2 text-sm font-bold hover:bg-base-2 transition-colors"
                                                >
                                                    🐦 Twitter
                                                </Link>
                                            )}
                                            {d?.telegram && (
                                                <Link 
                                                    to={d.telegram} 
                                                    className="connectbox border-4 border-black bg-base-1 px-4 py-2 text-sm font-bold hover:bg-base-2 transition-colors"
                                                >
                                                    💬 Telegram
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Column - Trading Card */}
                        <div className="lg:w-80">
                            <div className="connectbox border-4 border-black bg-base-2 p-6">
                                <h2 className="font-basic font-bold text-xl mb-4">Trade</h2>
                                
                                {/* Trading Component */}
                                <div className="mb-4">
                                    <Trade 
                                        tokenAddress={props?.tokenAddress} 
                                        tokenTicker={props?.symbol} 
                                        tokenBalance={tokenBalance} 
                                        trading={trading} 
                                        chain={props?.chainId}
                                    />
                                </div>
                                
                                {/* Your Balance */}
                                <div className="connectbox border-4 border-black bg-base-7 p-4">
                                    <div className="font-basic font-semibold text-sm">
                                        Your Balance
                                    </div>
                                    <div className="font-basic font-bold text-lg">
                                        {tokenBalance ? ethers.formatEther(tokenBalance.toString()) : '0'} ${props?.symbol}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Secondary Content Row */}
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Holders Card */}
                        <div className="lg:w-80">
                            <div className="connectbox border-4 border-black bg-base-1 p-6">
                                <h2 className="font-basic font-bold text-xl mb-4">Top Holders</h2>
                                <Holders data={latestTx} />
                            </div>
                        </div>

                        {/* Chart Card */}
                        <div className="flex-1">
                            <div className="connectbox border-4 border-black bg-white p-6">
                                <h2 className="font-basic font-bold text-xl mb-4">Price Chart & Trades</h2>
                                <ChartSection data={transactions} buys={uniqueBuys} sells={uniqueSells} />
                            </div>
                        </div>
                    </div>

                    {/* Comments Section */}
                    <div className="w-full">
                        <div className="connectbox border-4 border-black bg-base-4 p-6 flex flex-col justify-center items-center">
                            <h2 className="font-basic font-bold text-xl mb-4">Comments</h2>
                            <CommentSection tokenAddress={tokenAddr} props={comments} txns={latestTx} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}



