import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { useState, useEffect} from 'react'
import axios from 'axios'
import "../../globals.css"
import noimage from "../assets/noimage.svg"
import Buy from "../components/Buy"
import { useTokenBalance, useEthers } from '@usedapp/core'
import { ethers } from 'ethers'
import Trade from '../components/Trade'


export default function LaunchPage () {

    const [searchParams, setSearchParams] = useSearchParams()
    const [props, setProps] = useState([])
    const [d,setD] = useState()
    const [tokenAddr, setTokenAddr] = useState("")

    const {account } = useEthers()

    useEffect(()=>{
        const fetchData = async (tokenAddress) =>{
            try{
                const response = await axios.get(`http://103.26.10.88/api/getOne/${tokenAddress}`)
                const data = response.data[0]
                console.log("launch page data",data)
                setProps(data)
                const d = JSON.parse(data.description)
                setD(d)
                console.log("data", data)
                console.log("des", d)
            }catch(e){
                console.log("error", e)
            }
           
        }
        const tokenAddress = searchParams.get("token")
        setTokenAddr(tokenAddress)
       fetchData(tokenAddress) 
    },[])

    const tokenBalance = useTokenBalance(tokenAddr, account)
   


    return(
        <div className="flex justify-center py-20">
        {props && d && 
            <div className="flex flex-col connectbox border-4 border-black w-3/4 h-full bg-base-2">
            <div className= "flex flex-row justify-between">
                <div className="flex flex-row justify-between">
                    <div className="relative max-w-[300px] max-h-[400px] border-4 bg-base-4 border-black mx-2 my-4 content-center">
                        {<img src={d.logo} layout="fill" objectfit="cover" alt={noimage}/>}
                    </div>
                    <div className="flex flex-col pl-2 pt-2 w-full">
                        <div className={`font-basic font-bold text-md text-black`}>{props.name}</div>
        
                        <div className="flex flex-col items-start justify-start">
                            <div className={`font-basic flex text-xs text-black font-bold pt-2 items-center`}>
                                {/*progress {info.progress}%*/}
                            </div>
                            {/*<Progressbar percentage={info.progress} />*/}
                        </div>
                        <div className= "flex flex-row justify-start gap-2 pt-1">
                            <div className="text-xs">
                                <Link to={d.website}>
                                    [web]
                                </Link>
                            </div>
                            <div className="text-xs">
                                <Link to={d.twitter}>
                                    [x]
                                </Link>
                            </div>
                            <div className="text-xs">
                                <Link to={d.telegram}>
                                    [telegram]
                            </Link>
                            </div>
                        </div>
                        <div className={` mt-2 text-xs text-black`}>
                            created by <span className='text-base-6'>{props.owner.slice(0,4)}...{props.owner.slice(props.owner.length -4, props.owner.length)}</span>
                        </div>
    
                    </div>
                    
                </div>
                <div className="flex flex-col"> 
                    <div> 
                        <Trade tokenAddress={props.tokenAddress} tokenTicker={props.symbol} tokenBalance={tokenBalance}/>
                    </div>

                    {tokenBalance ? 
                        <div className=" text-sm border-4 border-black font-basic font-semibold connectbox bg-base-8 mx-4 p-1"> 
                            your balance: {ethers.utils.formatEther(tokenBalance)} ${props.symbol}
                        </div>
                        :
                        <div className=" text-sm border-4 border-black font-basic connectbox bg-base-8 mx-4 p-1"> 
                            your balance: 0 ${props.symbol}
                        </div>
                        
                    }

                </div>
            </div>
            <div className='text-sm text-wrap truncate connectbox w-1/3 border-2 border-black px-1 mb-4 mx-2 h-24 bg-base-4'>
                {d.des.slice(0,205)}...
            </div>
        </div>
        }
    </div>
        
    )
}