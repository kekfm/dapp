import "../../../globals.css"
import { useEthers } from "@usedapp/core"
import { useNavigate, useSearchParams } from "react-router-dom"

export  function NavAccount ({handleOpen, isOpen}) {

    const {chainId, account} = useEthers()
    const navigate = useNavigate()

    const handleClick = () => {
        if(isOpen){
            handleOpen()
        }
        if(account){
            navigate(`/me?account=${account}`)
        }
    }

    return (

        <div onClick={handleClick} className="flex connectbox bg-base-6 border-4 border-black p-2 mb-4 hover:scale-110 ease-in-out hover:cursor-pointer w-12">
            me
        </div>
    )
}