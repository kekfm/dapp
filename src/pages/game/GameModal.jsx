import '../../../globals.css'
import { useEffect, useState} from 'react'
import {formatter} from "../../helpers/formatter"
import { Link } from 'react-router-dom';
import BANG from "./BANG.png"




export default function GameModal ({isOpen, closeModal}) {

    const [tokenAddress, setTokenAddress] = useState(undefined)

    
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Overlay background */}
          <div className="fixed inset-0 bg-black opacity-70" onClick={closeModal}></div>

          {/* Modal content */}
          <div className="flex flex-col items-center justify-center relative z-50 w-full">
            <img className="max-w-[300px]" src={BANG} alt="bang" ></img>
          </div>
        </div>
      );

 

}