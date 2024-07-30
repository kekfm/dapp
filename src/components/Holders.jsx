import "../../globals.css"
import { ethers } from "ethers"




export default function Holders ({data}) {
    return(
        <div className="sm:flex sm:flex-col  items-center w-full">
            <div className="flex flex-col w-full">
                <div className="font-semibold text-xl">
                    holders
                </div>
                <div className="flex connectbox bg-white font-basic border-4 border-black w-full p-2 overflow-x-auto">
                    <table className="w-full md:text-xl">
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