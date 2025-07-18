import "../../../globals.css"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react'

export  function NavAccount ({handleOpen, isOpen}) {
    const { address } = useAppKitAccount()

    const navigate = useNavigate()

    const handleClick = () => {
        if(isOpen){
            handleOpen()
        }
        if(address){
            navigate(`/me?account=${address}`)
        }
    }

    return (

        <div onClick={handleClick} className="flex connectbox bg-base-6 border-4 border-black p-2 hover:scale-110 ease-in-out hover:cursor-pointer w-12 h-12">
            me
        </div>
    )
}