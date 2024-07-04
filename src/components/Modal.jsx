import '../../globals.css'

import { useEffect, useState} from 'react'
import { useEthers} from "@usedapp/core";
import { Contract, ethers } from "ethers";
import {contracts} from "../helpers/contracts"
import {useFeeInfo, useCreateToken} from "../helpers/factoryHooks.jsx"
import {formatter} from "../helpers/formatter"




export default function Modal ({tx, isOpen, closeModal}) {

    const [tokenAddress, setTokenAddress] = useState(undefined)

    useEffect(() => {
        if(tx.receipt){
            setTokenAddress(formatter.formatTxReceipt(tx.receipt))
        }
    },[tx])
    
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Overlay background */}
          <div className="fixed inset-0 bg-black opacity-70" onClick={closeModal}></div>

          {/* Modal content */}
          <div className="relative bg-base-5 connectbox border-4 border-black py-6 px-10 z-50 max-w-md w-full mx-4 shadow-lg">
            <div className={` text-3xl pb-2 pt-2 text-center`}>
              Success!
            </div>
            <div className={` text-xl pb-4 pt-2 text-center`}>
              Welcome to the fam, dev!
            </div>
            <div className={` text-xl pb-4 text-center`}>
              Check your launch here
            </div>
            <button className={` bg-base-2 border-4 border-black py-2 px-8 mt-2 mb-2 w-full text-center hover:-translate-y-2 transition-all duration-300 ease-in-out`}>
              <Link href={`/launch/${tokenAddress}`}>
                Check
              </Link>
            </button>
          </div>
        </div>
      );

 

}