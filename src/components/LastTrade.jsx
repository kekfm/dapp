import buy from "../assets/Lastbuy.svg"
import sale from "../assets/Lastsale.svg"
import { io } from "socket.io-client"
import { useEffect, useState } from "react"
import axios from "axios"
import "../../globals.css"


export default function LastTrade () {
    
    const [event, setEvent] = useState([])
    const [name, setName] = useState("")
    const [symbol, setSymbol] = useState("")
    const [type, setType] = useState("")
    const [fetched, setFetched] = useState([])

    const fetchTradeData = async () => {
        if(event){
            const response = await axios.get(`http://103.26.10.88/api/getOne/${event.tokenAddress}`)
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
        <div className="">
            {event && name && symbol &&
                <div className="flex flex-row font-basic font-semibold connectbox border-4 border-black w-[200px] bg-base-2 gap-2">
                    <div>
                        {event.type}:
                    </div>
                    <div>
                        {name}
                    </div>
                    <div>
                        ${symbol}
                    </div>
                </div>
            }
        </div>
    )
}