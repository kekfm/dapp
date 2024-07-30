import '../../globals.css'
import icon from '../assets/loading3.svg'
import noimage from '../assets/noimage.svg'
import Progressbar from './Progressbar';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';



export default function LaunchCard ({tag, data}) {

    const imgWidth = 30
    const imgHeight = 30

    const navigate = useNavigate()

    const [percentage,setPercentage] = useState(0)
    const [color, setColor] = useState("")

    const handleClick = () => {
        const tokenAddress = data.tokenAddress
        console.log("tokenAddress", tokenAddress)
        navigate(`/launch?token=${tokenAddress}`)
    }
    const d = JSON.parse(data.description)


   

    useEffect(() => {
    
        const {buys, sells} = data
        const transactions = [...buys, ...sells]
        const filtered = transactions.filter((item, index, self) => index === self.findIndex((t) => (
            t.maker === item.maker && t.timestamp === item.timestamp)
        ))
        filtered.sort((a,b) => (b.timestamp - a.timestamp))
        const latest = filtered[0]
        console.log("latest", latest)
        
        if(latest){
            const soldTokens = (100000 - Number(ethers.utils.formatEther(latest.contractTokenBalance)))
            const percentage = soldTokens / 75000 * 100
            setPercentage(percentage)
        }

        if((tag / 3) % 1 === 0){
            setColor('#bafca2')
        }

        else if((tag / 2) % 1 === 0 && (tag / 3) % 1 !== 0){
            setColor('#7df9ff')
        }
        else{
            setColor('#ffb2ef')
        }

    },[data, tag])
    

    return(
    <div onClick={handleClick} className={`flex flex-col connectbox border-4 border-black w-[280px] h-[200px]`} style={{backgroundColor:`${color}`}}>
        <div className= "flex flex-row">
            <div className="flex flex-row justify-between">
                <div className="relative w-[120px] h-[100px] border-4 bg-base-4 border-black mx-2 my-4 content-center overflow-hidden">
                    {d && d.logo &&
                        <img src={d.logo} layout="fill" className="w-full h-full object-contain" alt="logo"/>
                    }
                    {d && !d.logo &&
                        <img src={noimage} layout="fill" className="w-full h-full object-contain" alt="logo"/>
                    }
                </div>
                <div className="flex flex-col pl-2 pt-2 overflow-hidden" >
                    <div className={`font-basic font-bold text-md text-black`}>{data.name}</div>
    
                    <div className="flex flex-col items-start justify-start w-[120px]">
                        <div className={`font-basic flex text-xs text-black font-bold items-center`}>
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
                    <div className={` mt-2 text-xs text-black`}>
                        created by <span className='text-base-2'>{data.owner.slice(0,4)}...{data.owner.slice(data.owner.length -4, data.owner.length)}</span>
                    </div>

                </div>
                
            </div>
        </div>
        <div className='font-basic font-bold text-xs text-wrap truncate px-1 py-1 mx-2 h-12'>
            {d.des.slice(0,205)}...
        </div>
    </div>
    )
}

