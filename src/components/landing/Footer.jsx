import { useNavigate} from "react-router-dom"
import "../../../globals.css"

export default function Footer () {


  const navigate = useNavigate()
  const handleClick = () =>{
    navigate("/terms")
  }

    return(
        <div className="flex flex-col py-20 items-center">
        <div className="font-basic font-semibold max-sm:text-xs sm:font-bold">
          - this protocol is sufficiently degentralized -
        </div>
        <div className="font-basic pt-4">
          kek © 2024
        </div>
        <div className="font-basic pt-4 hover:cursor-pointer" onClick={handleClick}>
          {"[terms]"}
        </div>
      </div>
    )
}