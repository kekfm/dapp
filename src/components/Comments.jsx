import "../../globals.css"
import { useState, useEffect } from "react"
import moment from "moment"

export default function Comments ({item, latest}) {

    const [nDate, setNDate] = useState("")
    const [holder, setHolder] = useState(false)

    useEffect (() => {

        const date = moment.unix(item.timestamp / 1000).format('YYYY-MM-DD HH:mm')
        setNDate(date)
        if(latest){
            for (const object of latest){
                if(object.maker == item.account){
                    setHolder(true)
                }
            }
        }

    },[])

    return(
        <div className="flex flex-col connectbox truncate text-wrap border-4 border-black text-xs font-basic mb-4 mr-4">
            <div className="flex flex-row justify-between bg-base-7 px-2 gap-2 border-b-2 border-black">
                    <div >
                        {nDate}
                    </div>
                    {holder &&
                        <div className="font-basic text-xs font-bold text-base-2">
                            ✅ holder
                        </div>
                    }
                    <div>
                        {item && item.account && item.account.slice(0,4)}...{item && item.account && item.account.slice(item.account.length -5, item.account.length)}
                    </div>
            </div>
            <div className="px-2 truncate text-wrap bg-white">
                {item.comment}
            </div>

        </div>
    )
}