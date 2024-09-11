import "../../../globals.css"
import { ethers } from "ethers"




export default function Holders ({data}) {
    return(
        <div className="flex flex-col md:items-start ">
            <div className="flex flex-col">
                <div className="font-basic font-bold text-xl">
                    holders
                </div>
                <div className="flex connectbox bg-white font-basic border-4 border-black max-w-[400px] p-2 ">
                    <table className=" w-full md:text-xl overflow-x-auto">
                        <thead>
                            <tr className="">
                                <th className="text-left text-sm px-4 py-2">address</th>
                                <th className="text-right text-sm px-4 py-2">amount</th>
                                <th className="text-right text-sm px-4 py-2">%</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data && data.map((item, index) => (
                                <tr key={index} className="text-xs">
                                    {item.maker &&
                                        <td className="text-left px-4 py-2">
                                            {item.maker.slice(0,4)}...{item.maker.slice(item.maker.length -8, item.maker.length)}
                                        </td>
                                    }
                                {item.userTokenBalance &&
                                        <td className="text-right px-4 py-2">
                                            {ethers.utils.formatEther(item.userTokenBalance)}
                                        </td>
                                }
                                    {item.userTokenBalance &&
                                        <td className="text-right px-4 py-2">
                                            {(Number(ethers.utils.formatEther(item.userTokenBalance)) / 75000 * 100).toFixed(1)} 
                                        </td>
                                    }
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
        </div>
    )
}