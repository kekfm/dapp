import "../../globals.css"
import Chart from "./Chart"
import { useEffect, useState } from "react"
import TradeTable from "./TradeTable"

export default function ChartSection ({data, buys, sells}) {





    return(
        <div className="flex flex-col gap-4"> 
            <div className="flex max-[760px]:hidden">
                <Chart data={data}/> 
            </div>
            <div className="">
                <TradeTable buys={buys} sells={sells}/>
            </div>
        </div>
    )
}