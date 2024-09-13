import "/globals.css"
import { useEffect, useState } from "react"
import moment from "moment/moment"
import { ethers } from "ethers"

export default function TradeTable({ buys, sells }) {
    const [transactions, setTransactions] = useState([])

    useEffect(() => {
        const t = [...buys, ...sells]
        t.sort((a, b) => b.timestamp - a.timestamp)
        setTransactions(t)
        console.log("t", t)
    }, [buys, sells])

    return (
        <div className="w-full">
            <div className="font-bold font-basic text-xl">
                traders
            </div>
            <div className="max-w-[340px] sm:max-w-[600px] connectbox border-4 border-black bg-black font-basic overflow-x-auto">
                <div className="w-[420px] sm:w-full overflow-x-auto"> {/* Ensure the inner div is wide enough to force scrolling */}
                    <table className="w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="px-2 text-left text-white">time</th>
                                <th className="px-2 text-left text-white">maker</th>
                                <th className="px-2 text-left text-white">amount</th>
                                <th className="px-2 text-left text-white">ETH</th>
                                <th className="px-2 text-left text-white">price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions && transactions.map((t, index) => (
                                <tr key={index} className="p-2 text-xs text-left border-b">
                                    {t.type === "buy" ? <td className="px-2 text-left text-base-12">{moment.unix(t.timestamp).format('MM-DD HH:mm')}</td> : <td className="px-2 text-left text-base-21">{moment.unix(t.timestamp).format('MM-DD HH:mm')}</td>}
                                    {t.type === "buy" ? <td className="px-2 text-left text-base-12">{t.maker.slice(0, 4)}...{t.maker.slice(t.maker.length - 6, t.maker.length)}</td> : <td className="px-2 text-left text-base-21">{t.maker.slice(0, 4)}...{t.maker.slice(t.maker.length - 6, t.maker.length)} </td>}
                                    {t.type === "buy" ? <td className="px-2 text-left text-base-12 font-semibold">{ethers.utils.formatEther(t.amountToken)}</td> : <td className="px-2 text-left font-semibold text-base-21">{ethers.utils.formatEther(t.amountToken)}</td>}
                                    {t.type === "buy" ? <td className="px-2 text-left text-base-12 font-semibold">{parseFloat(ethers.utils.formatEther(t.amountETH)).toFixed(5)}</td> : <td className="px-2 text-left font-semibold text-base-21">{parseFloat(ethers.utils.formatEther(t.amountETH)).toFixed(5)}</td>}
                                    {t.type === "buy" ? <td className="px-2 text-left text-base-12 font-semibold">{parseFloat(ethers.utils.formatEther(t.lastTokenPrice)).toFixed(9)}</td> : <td className="px-2 text-left font-semibold text-base-21">{parseFloat(ethers.utils.formatEther(t.lastTokenPrice)).toFixed(9)}</td>}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
