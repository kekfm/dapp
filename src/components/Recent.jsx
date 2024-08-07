import lastbuy from "../assets/Lastbuy.svg"
import lastsale from "../assets/Lastsale.svg"
import newpic from "../assets/new.svg"
import dex from "../assets/dex.svg"
import { io } from "socket.io-client"
import { useEffect, useState } from "react"
import axios from "axios"
import "../../globals.css"
import { ethers } from "ethers"
import { useNavigate } from "react-router-dom"


export default function Recent () {

    const [created, setCreated] = useState([])
    const [buySell, setBuySell] = useState([])
    const [ticker, setTicker] = useState("")
    const [address, setAddress] = useState("")
    const [uniswap, setUniswap] = useState([])


    const navigate = useNavigate()
    const handleClick = () => {
        navigate(`/launch?token=${buySell.tokenAddress}`)
    
    }

    const handleCreated = () =>{
        navigate(`/launch?token=${created.tokenAddress}`)
    }


    const fetchData = async () => {
        try{
            const getCreated = await axios.get('http://103.26.10.88/api/getLastCreated',{withCredentials: true})
            setCreated(getCreated.data)
    
            const getLast = await axios.get('http://103.26.10.88/api/getLast',{withCredentials: true})
            const last = getLast.data
            console.log("getLast",getLast)
            const list = [...last[0].buys,...last[0].sells]
            list.sort((a,b) => b.timestamp - a.timestamp)
            setBuySell(list[0])
            setTicker(list[0].symbol)
            setAddress(list[0].tokenAddress)

            console.log("list[0]", list[0])
    
            const getUniswap = await axios.get('http://103.26.10.88/api/getUniswap',{withCredentials: true})
            setUniswap(getUniswap.data)

            console.log("created", getCreated.data)
            console.log("buysell", list[0])
            console.log("uniswap", getUniswap.data)


        }catch(e){console.log("e",e)}
       
    }
    
    useEffect(()=> {
        const socket = io("http://103.26.10.88:5000")

        socket.on('connect', () => {
            console.log("connected to websocket server")
        })

        socket.on("newBuyEvent", (data) => {
            console.log("new buy event", data)
            setBuySell(data)
        })

        socket.on("newSellEvent", (data) => {
            console.log("new sell event", data)
            setBuySell(data)
        })

        socket.on("newCreationEvent", (data) => {
            console.log("new creation event", data)
            setCreated(data)
        })

        socket.on("newUniswapEvent", (data) => {
            console.log("new uniswap event", data)
            setUniswap(data)
        })

        return () => {
            socket.disconnect();
        };

    },[])

    useEffect(() => {
        fetchData()
    },[])


    return(
        <div className="flex sm:flex-row  gap-4 justify-start flex-col max-sm:items-center">
            <div className="">
                {buySell && buySell.type === "buy" &&
                    <div className="flex flex-col wiggle">
                        <div>
                            <img src={lastbuy} className="w-[50px]"></img>
                        </div>
                        <div className="font-basic text-xs font-semibold py-2 connectbox border-4 border-black w-[200px] overflow-x-hidden bg-base-12 hover:cursor-pointer" >
                            <div className="flex flex-row gap-2 px-2">
                                <div>
                                   {buySell.maker.slice(0,4)+"..."+buySell.maker.slice(buySell.maker.length -4, buySell.maker.length)} bought {Number(ethers.utils.formatEther(buySell.amountETH)).toFixed(3)} ETH                     
                                </div>
                            </div>
                        </div>
                    </div>
                }
                {buySell && buySell.type === "sell" && 
                    <div className="flex flex-col" >
                        <div>
                            <img src={lastsale} className="w-[50px]"></img>
                        </div>
                        <div className="font-basic text-xs py-2 connectbox border-4 border-black w-[200px] bg-base-8 overflow-x-hidden hover:cursor-pointer" >
                            <div className="flex flex-row  gap-2 px-2">
                                <div>
                                    {buySell.maker.slice(0,4)+"..."+buySell.maker.slice(buySell.maker.length -4, buySell.maker.length)} sold {Number(ethers.utils.formatEther(buySell.amountETH)).toFixed(3)} ETH
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
            {created &&
                <div>
                    <div>
                        <img src={newpic} className="w-[50px]"></img>
                    </div>
                    <div onClick={handleCreated} className="font-basic text-xs font-semibold connectbox border-4 px-2 py-2 border-black w-[200px] overflow-x-hidden hover:cursor-pointer hover:bg-base-2">
                        ${created.symbol}
                    </div>
                </div>
               
            }
            
        
        </div>
    )
}