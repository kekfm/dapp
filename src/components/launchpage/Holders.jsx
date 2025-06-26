import "../../../globals.css"
import { ethers } from "ethers"




export default function Holders ({data}) {

    console.log("holders", data)
    return(
        <div className="flex flex-col w-full">
            <div className="connectbox bg-white font-basic border-4 border-black w-full overflow-hidden">
                <div className="p-4">
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="border-b-2 border-black">
                                    <th className="text-left py-2 px-1 font-bold">Address</th>
                                    <th className="text-right py-2 px-1 font-bold">Amount</th>
                                    <th className="text-right py-2 px-1 font-bold">%</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data && data.slice(0, 8).map((item, index) => (
                                    <tr key={index} className="border-b border-gray-200">
                                        {item.maker && (
                                            <td className="text-left py-2 px-1 font-mono">
                                                {item.maker.slice(0,4)}...{item.maker.slice(-4)}
                                            </td>
                                        )}
                                        {item.userTokenBalance && (
                                            <td className="text-right py-2 px-1 font-bold">
                                                {Number(ethers.formatEther(item.userTokenBalance)).toFixed(0)}
                                            </td>
                                        )}
                                        {item.userTokenBalance && (
                                            <td className="text-right py-2 px-1 font-bold text-base-12">
                                                {(Number(ethers.formatEther(item.userTokenBalance)) / 75000 * 100).toFixed(1)}%
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}