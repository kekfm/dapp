import "../../globals.css"
import Chart from "./Chart"
import { useEffect, useState } from "react"
import TradeTable from "./TradeTable"

export default function ChartSection ({data, buys, sells}) {





    return(
        <div className="flex flex-col xl:flex-row md:grid-cols-2 pt-4 md:pt-0 gap-2"> 
            <div className="flex justify-center max-sm:hidden xl:w-1/2">
                <Chart data={data}/> 
            </div>
            <div className="xl:w-1/2">
                <TradeTable buys={buys} sells={sells}/>
            </div>
        </div>
    )
}