import "../../globals.css"
import { useEthers } from "@usedapp/core"
import { useSearchParams } from "react-router-dom"
import { useState, useEffect } from "react"
import axios from "axios"
import LaunchCard from "../components/LaunchCard"


export default function Account (){

    const {account, chainId} = useEthers()
    const [searchParams, setSerchParams] = useSearchParams()
    const [devData, setDevData] = useState([])


    useEffect (() => {

        const fetchData = async (devAddress) => {
            try {
                const response = await axios.get(`http://103.26.10.88/api/getDev/${devAddress}`)
                const data = response.data
                setDevData(data)
                console.log("dev data", data)
            }
           catch(e){console.log("error fetching dev data", e)}

        }

        const devAddress = searchParams.get("account")

        fetchData(devAddress)
    },[])

    return(

        <div className="flex flex-col pt-10 items-center">
            <div className="flex flex-col items-center">
                <div className="font-basic font-extrabold text-2xl">
                    account
                </div>
                <div className="connectbox border-4 border-black bg-base-5 px-4 py-2 font-basic font-extrabold text-xl">
                    {account}
                </div>
            </div>
            <div className=" flex flex-col bg-base-5 connectbox border-2 border-black gap-4 items-center w-full mt-20">
                
                <div className="font-basic font-extrabold text-2xl">
                    devs past launches
                </div>
                <div className="flex flex-row flex-wrap justify-center gap-4">
                    {devData &&
                        devData.map((item,index) => (<LaunchCard key={index} data={item} />))
                    } 
                </div>
                <div>
                    dev rating:
                </div>
            </div>
            
        </div>
    )
}