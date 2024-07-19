import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { useState, useEffect} from 'react'
import axios from 'axios'
import "../../globals.css"
import noimage from "../assets/noimage.svg"
import Buy from "../components/Buy"
import { useTokenBalance, useEthers } from '@usedapp/core'
import { ethers } from 'ethers'
import Trade from '../components/Trade'
import CommentSection from '../components/CommentSection'
import Holders from '../components/Holders'
import Progressbar from '../components/Progressbar'
import ChartSection from '../components/ChartSection'


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


    const {account } = useEthers()

    useEffect(()=>{
        const fetchData = async (tokenAddress) =>{
            try{
                const response = await axios.get(`http://103.26.10.88/api/getOne/${tokenAddress}`)
                const data = response.data[0]
                console.log("launch page data",data)
                setProps(data)

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
                    const {maker} = transactions
                    if(!latestTxns[maker]){
                        latestTxns[maker] = transaction
                    }
                })
                const latestTxnsArray = Object.values(latestTxns);
                setLatestTx(latestTxnsArray)

                const last = latestTxnsArray[0]

                if(last){
                    const soldTokens = (100000 - Number(ethers.utils.formatEther(last.contractTokenBalance)))
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

                const d = JSON.parse(data.description)
                setD(d)
               
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
                                progress {percentage.toFixed(1)}%
                            </div>
                            {<Progressbar percentage={percentage} />}
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
                        <div className="flex flex-row gap-2 text-xs pt-2">
                            <div>
                                buys: {uniqueBuys.length}
                            </div>
                            <div>
                                sells: {uniqueSells.length}
                            </div>
                        </div>
                        <div className="text-xs pt-2">
                            dev jeeted? {jeet}
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
            <div className="flex flex-row grid grid-cols-2">
                <div>
                    <CommentSection tokenAddress={tokenAddr} props={props}/>
                </div>
                <div>
                    <Holders data={latestTx}/>
                </div>
            </div>
            <ChartSection data={transactions} buys={uniqueBuys} sells={uniqueSells}/>
        </div>
        }
    </div>
        
    )
}



