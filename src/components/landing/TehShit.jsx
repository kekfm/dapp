import { useEffect, useState } from "react";
import axios from "axios";
import "../../../globals.css"
import noimage from "../../assets/noimage.svg"
import chain from "../../assets/chain.svg"
import arrows from "../../assets/arrews.svg"
import realshit from "../../assets/tehshit2.svg"
import crown from "../../assets/crown.svg"
import Progressbar from "./Progressbar";
import { ethers } from "ethers";
import { Link, useNavigate} from "react-router-dom";


export default function TehShit(){

    const [tehShit, setTehShit] = useState([])
    const [d, setD] = useState()
    const [percentage,setPercentage] = useState(0)
    const [jeet, setJeet] = useState(false)

    const navigate = useNavigate()

   
    useEffect(() => {

        const fetchData = async () => {
            try{
                
                //const response = await axios.get("https://kek.fm/api/getShit",{withCredentials: true})
                const response = await axios.get("https://indexer-rx9n.onrender.com/api/getShit",{withCredentials: true})

                const shit = response.data
                shit.sort((a,b) => b.timestamp - a.timestamp)
                //console.log("shit",shit)

                if(shit){
                    const latestShit = shit[0].tokenAddress
                    //console.log("latestshit",latestShit)
                    //const res = await axios.get(`https://kek.fm/api/getOne/${latestShit}`, {withCredentials: true})
                    const res = await axios.get(`https://indexer-rx9n.onrender.com/api/getOne/${latestShit}`, {withCredentials: true})

                    const newShit = res.data[0]
                    //console.log("tehshit", newShit)
                    //console.log("owner", newShit.owner)

                    let trades = [...newShit.buys,...newShit.sells]
                    const uniqueTx = trades.filter((item, index, self) => index === self.findIndex((t) => (t.maker == item.maker && t.timestamp == item.timestamp)))
                    uniqueTx.sort((a,b) => b.timestamp - a.timestamp)
                    //console.log("uniquetx", uniqueTx)

                    const soldTokens = (100000 - Number(ethers.utils.formatEther(uniqueTx[0].contractTokenBalance)))
                    const percentage = soldTokens / 75000 * 100
                    setPercentage(percentage)

                    const des = newShit.description
                    //console.log("d",des)
                    setD(des)
                    setTehShit(newShit)

                    let jeetArray = []
                    newShit.sells.forEach(sell => {
                        if(sell.maker === newShit.owner){
                            jeetArray.push(sell.maker)
                        }
                    })
                    
                    if(jeetArray.length > 0){
                        setJeet(true)
                    }

                }

            }catch(e){console.log("error",e)}

        }
        fetchData()
    },[])

    const handleClick = () => {
        if(tehShit.tokenAddress){
            navigate(`/launch?token=${tehShit.tokenAddress}`)
        }
    }

    return(
        <div className="relative flex flex-col font-basic max-w-72 items-center pb-10" >
            {/*<div className="text-3xl font-bold text-center connectbox border-4 border-black mb-3">
                this is teh shit!
            </div>*/}
            <div className="max-w-[280px]">
                <img className="max-w-[280px]" src={realshit}></img>
            </div>
            <div className=" flex items-center justify-center w-[100px] h-[66px] animate-bounce ">
                <img src={arrows} className="max-h-[66px] max-w-[100px] object-cover"></img>
            </div>
            <div className="flex flex-row shitbox border-4 border-base-2 p-2 gap-2 bg-base-11 relative hover:border-base-5 hover:cursor-pointer hover:scale-110 max-w-[250px] hover:cursor-pointer  hover:border-base-2" onClick={() => handleClick()}>
                <div className="flex rounded-full w-[80px] h-[80px] border-4 border-black overflow-hidden">
                    {d && d.logo &&
                        <img src={d.logo} alt="logo" layout="fill" className="w-full h-full object-cover rounded-full" ></img>
                    }
                    {d && !d.logo &&
                        <img src={noimage} alt="logo" layout="fill" className="w-full h-full object-cover rounded-full" ></img>
                    }
                </div>
                <div className="flex-col">
                    <div className="font-basic text-xs pt-1">
                        <span >name:</span> <span className="font-bold">{tehShit.name}</span>
                    </div>
                    <div className="font-basic text-xs pt-1">
                        <span >ticker:</span> <span className="font-bold">${tehShit.symbol}</span> 
                    </div>
                        
                    <div className="font-basic text-xs">
                        progress <span className="font-basic font-bold text-xs">{percentage.toFixed(1)}%</span>
                    </div>
                    <div>
                        <Progressbar percentage={percentage} />
                    </div>
                    {tehShit && tehShit.owner &&
                        <div className="text-xs pt-1">
                            dev: <span className="text-base-2">{tehShit.owner.slice(0,6)}...{tehShit.owner.slice(tehShit.owner.length -4, tehShit.owner.length)}</span>
                        </div>
                    }
                    <div className="font-basic text-xs pt-1">
                        dev jeeted? {jeet ? <span className="font-bold">yes</span> : <span className="font-bold">no</span>}
                    </div>
                </div>
                <div className="absolute -top-6 -right-8 ">
                    <img src={crown} className="w-16 "></img>
                </div>
            </div>
            <div className="absolute top-72 z-100 " onClick={handleClick}>
                <img src={chain} className="w-[220px] "></img>
            </div>
        </div>
    )

}