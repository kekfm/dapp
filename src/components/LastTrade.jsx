import lastbuy from "../assets/Lastbuy.svg"
import lastsale from "../assets/Lastsale.svg"
import { io } from "socket.io-client"
import { useEffect, useState } from "react"
import axios from "axios"
import "../../globals.css"
import { ethers } from "ethers"
import { useNavigate } from "react-router-dom"


export default function LastTrade () {
    
    const [event, setEvent] = useState([])
    const [name, setName] = useState("")
    const [symbol, setSymbol] = useState("")
    const [type, setType] = useState("")
    const [fetched, setFetched] = useState([])

    const navigate = useNavigate()
    const handleClick = () => {
        navigate(`/launch?token=${event.tokenAddress}`)
    }

    const fetchTradeData = async () => {
        if(event){
            const response = await axios.get(`http://103.26.10.88/api/getOne/${event.tokenAddress}`, {withCredentials: true})
            const props = response.data[0]
            console.log("props", props)
            setName(props.name)
            setSymbol(props.symbol)
        }
    }

    useEffect(()=> {
        const socket = io("http://103.26.10.88:5000")

        socket.on('connect', () => {
            console.log("connected to websocket server")
        })

        socket.on("newBuyEvent", (data) => {
            console.log("new buy event", data)
            setEvent(data)
        })

        socket.on("newSellEvent", (data) => {
            console.log("new sell event", data)
            setEvent(data)
        })

        return () => {
            socket.disconnect();
        };

    },[])

    useEffect(() => {
            fetchTradeData()
    },[event])


    return(
        <div className="wiggle">
            {event && event.type === "Buy" && name && symbol &&
                <div className="flex flex-col">
                    <div>
                        <img src={lastbuy} className="w-[50px]"></img>
                    </div>
                    <div className="font-basic text-xs py-2 connectbox border-4 border-black w-[200px] bg-base-12 overflow-x-hidden hover:cursor-pointer" onClick={handleClick}>
                        <div className="flex flex-row col-span-3 gap-2 px-2">
                            <div>
                                ${symbol}
                            </div>
                            <div>
                                {Number(ethers.utils.formatEther(event.amountETH)).toFixed(4)} ETH                     
                            </div>
                        </div>
                    </div>
                </div>
            }
             {event && event.type === "Sell" && name && symbol &&
               <div className="flex flex-col" >
               <div>
                   <img src={lastsale} className="w-[50px]"></img>
               </div>
               <div className="font-basic text-xs py-2 connectbox border-4 border-black w-[200px] bg-base-8  overflow-x-hidden hover:cursor-pointer" onClick={handleClick}>
                   <div className="flex flex-row col-span-3 gap-2 px-2">

                       <div>
                           ${symbol}
                       </div>
                       <div>
                            {Number(ethers.utils.formatEther(event.amountETH)).toFixed(4)} ETH
                       </div>
                   </div>
               </div>
           </div>
            }
        </div>
    )
}