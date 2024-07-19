import "../../globals.css"
import { useState, useEffect } from "react"
import moment from "moment"

export default function Comments ({item}) {

    const [nDate, setNDate] = useState("")

    useEffect (() => {

        const date = moment.unix(item.timestamp / 1000).format('YYYY-MM-DD HH:mm:ss')
        setNDate(date)
    },[])

    return(
        <div className="flex flex-col connectbox border-2 border-black text-xs font-basic font-medium">
            <div className="flex flex-row justify-between bg-base-1 px-2 gap-2 border-b-2 border-black">
                    <div >
                        {nDate}
                    </div>
                    <div>
                    {item.account.slice(0,4)}...{item.account.slice(item.account.length -5, item.account.length)}
                    </div>
            </div>
            <div className="px-2">
                {item.comment}
            </div>

        </div>
    )
}