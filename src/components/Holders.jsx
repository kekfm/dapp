import "../../globals.css"
import { ethers } from "ethers"




export default function Holders ({data}) {
    return(
        <div className="mx-4">
            <div className="font-semibold text-xl">
                holders
            </div>
            <div className="connectbox bg-white font-basic border-4 border-black flex-col">
                <table>
                    <thead>
                        <tr>
                            <th className="text-left px-4 py-2">address</th>
                            <th className="text-right px-4 py-2">amount</th>
                            <th className="text-right px-4 py-2">%</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data && data.map((item, index) => (
                            <tr key={index} className="">
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
                                        {(Number(ethers.utils.formatEther(item.userTokenBalance)) / 75000 *100).toFixed(1)} 
                                    </td>
                                }
                                
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}