import "../../globals.css"
import { useEffect, useState } from "react"
import moment from "moment/moment"
import { ethers } from "ethers"


export default function TradeTable({buys, sells}) {

    const [transactions, setTransactions] = useState([])

    useEffect (() => {
        const t = [...buys,...sells]
        t.sort((a,b) => b.timestamp - a.timestamp)
        setTransactions(t)
        console.log("t",t)
    },[])

    return(
        <div className="flex flex-col justify-center m-4">
            <div className="font-bold font-basic text-xl">
                traders
            </div>
            <table className="connectbox border-4 border-black bg-base-4 font-base">
                <thead>
                    <tr>
                        <th className="px-4 text-left">time</th>
                        <th className="px-4 text-left">maker</th>
                        <th className="px-4 text-left">amount</th>
                        <th className="px-4 text-left">ETH</th>
                        <th className="px-4 text-left">price</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions && transactions.map((t,index) => (   
                        <tr key={index} className="p-4 text-xs text-left">
                            {t.type == "buy"? <td className="px-4 text-left text-green-700">{moment.unix(t.timestamp ).format('YYYY-MM-DD HH:mm:ss')}</td> : <td className="px-4 text-left text-red-700">{moment.unix(t.timestamp ).format('YYYY-MM-DD HH:mm:ss')}</td>}
                            {t.type == "buy" ? <td className="px-4 text-left text-green-700">{t.maker.slice(0,4)}...{t.maker.slice(t.maker.length -6, t.maker.length)}</td> : <td className="px-4 text-left text-red-700">{t.maker.slice(0,4)}...{t.maker.slice(t.maker.length -6, t.maker.length)} </td>}
                            {t.type == "buy" ? <td className="px-4 text-left font-semibold text-green-700">{ethers.utils.formatEther(t.amountToken)}</td> : <td className="px-4 text-left font-semibold text-red-700">{ethers.utils.formatEther(t.amountToken)}</td> }
                            {t.type == "buy" ? <td className="px-4 text-left font-semibold text-green-700">{parseFloat(ethers.utils.formatEther(t.amountETH)).toFixed(5)}</td> : <td className="px-4 text-left font-semibold text-red-700">{parseFloat(ethers.utils.formatEther(t.amountETH)).toFixed(5)}</td>}
                            {t.type == "buy" ? <td className="px-4 text-left font-semibold text-green-700">{parseFloat(ethers.utils.formatEther(t.lastTokenPrice) / 1e18).toFixed(9)}</td> : <td className="px-4 text-left font-semibold text-red-700">{parseFloat(ethers.utils.formatEther(t.lastTokenPrice) / 1e18).toFixed(9)}</td>}
                        </tr>
                    ))

                    }
                </tbody>
            </table>
        </div>
    )
}