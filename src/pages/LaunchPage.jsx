import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { useState, useEffect} from 'react'
import axios from 'axios'
import "../../globals.css"
import noimage from "../assets/noimage.svg"
import tokenpage from "../assets/tokenpage.svg"
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
    const navigate = useNavigate()

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
   
    const goToDev = () => {
        navigate(`/me?account=${props.owner}`)
    }

return(
    <div className="flex flex-col items-center py-20">
        <div className="flex justify-center pb-4">
            <img src={tokenpage} className="max-w-[280px]"></img>
        </div>
        {props && d && 
        <div className="flex flex-col sm:connectbox sm:border-4 sm:border-black sm:w-11/12 max-w-[1200px] w-full h-full sm:bg-base-2 justify-center ">
            <div className="flex flex-col grid md:grid-cols-2 md:flex-row justify-center mb-10 md:gap-10 lg:gap-20 max-md:items-center">
                <div className="flex flex-col lg:flex-row justify-center mt-10 lg:mt-10 sm:p-4 ">
                    <div className="flex-col">
                        <div className="flex flex-col lg:flex-row">
                            <div className="max-w-[300px] lg:max-w-[300px] h-auto px-2 pt-4">
                                { d && d.logo && <img src={d.logo} alt="no image" className="aspect-square object-contain border-4 border-black bg-black connectbox"/>}
                                { d && !d.logo && <img src={noimage} alt="no image" className="aspect-square object-contain border-4 border-black bg-black connectbox"/>}
                            </div>
                            <div className="flex flex-col pl-2 pt-2 w-full ">
                                <div className={`font-basic font-bold text-md text-black`}>
                                    {props.name} (${props.symbol})
                                </div>
                                <div className="flex flex-col items-start justify-start">
                                    <div className={`font-basic flex text-xs text-black font-bold pt-2 items-center`}>
                                        progress {percentage.toFixed(1)}%
                                    </div>
                                        <Progressbar percentage={percentage} />
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
                                <div className={`mt-2 text-xs text-black `} onClick={goToDev}>
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
                        <div className='flex text-sm connectbox max-w-[300px] lg:max-w-[500px] h-28 border-2 border-black mt-6 px-1 mb-4 bg-base-4 mx-2 overflow-auto'>
                            {d.des}
                        </div>
                    </div>
                    
                </div>
                <div className="flex flex-col max-sm:w-full "> 
                    <div className="flex font-basic font-semibold text-xl text-start pr-4 mr-2 mt-10 pt-6 pb-4 w-full max-md:justify-center"> 
                        <Trade tokenAddress={props.tokenAddress} tokenTicker={props.symbol} tokenBalance={tokenBalance}/>
                    </div>

                    {tokenBalance ? 
                        <div className="flex justify-start">
                            <div className="flex text-sm border-4 border-black font-basic font-semibold connectbox bg-base-8 p-1 mr-2 max-md:ml-4 max-sm:w-[250px] max-w-[300px]"> 
                                your balance: {ethers.utils.formatEther(tokenBalance)} ${props.symbol}
                            </div>
                        </div>
                        
                        :
                        <div className="flex justify-start">
                            <div className="flex text-sm border-4 border-black font-basic font-semibold connectbox bg-base-8 p-1 mr-2 max-md:ml-4 max-sm:w-[250px] max-w-[300px]">
                                your balance: 0 ${props.symbol}
                            </div>
                        </div>
                        
                    }

                </div>
            </div>
            
            <div className="flex flex-col md:flex-row max-md:items-center justify-center pb-10 border-t-4 border-b-4 border-black bg-base-11 gap-4">
                <div className="flex pt-4 pl-4 md:w-1/2 justify-center w-full">
                    <CommentSection tokenAddress={tokenAddr} props={props}/>
                </div>
                <div className="flex pt-4 pl-4 pr-4 md:w-1/2 justify-center w-full">
                    <Holders data={latestTx}/>
                </div>
            </div>
            <ChartSection data={transactions} buys={uniqueBuys} sells={uniqueSells}/>
        </div>
        }
    </div>
        
    )
}



