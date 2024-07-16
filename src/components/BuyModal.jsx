import '../../globals.css'

import { useEffect, useState} from 'react'
import { useEthers} from "@usedapp/core";
import { Contract, ethers } from "ethers";
import {contracts} from "../helpers/contracts"
import {useFeeInfo, useCreateToken} from "../helpers/factoryHooks.jsx"
import {formatter} from "../helpers/formatter"




export default function BuyModal ({isOpen, closeModal}) {

    
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Overlay background */}
          <div className="fixed inset-0 bg-black opacity-70" onClick={closeModal}></div>

          {/* Modal content */}
          <div className="relative bg-base-5 connectbox border-4 border-black py-6 px-10 z-50 max-w-md w-full mx-4 shadow-lg">
            <div className={`font-basic font-bold text-3xl pb-2 pt-2 text-center`}>
              success!
            </div>
            <div className={`font-basic text-xl pb-4 pt-2 text-center`}>
              good job, my chad!
            </div>
            <div className={`font-basic text-xl pb-4 text-center`}>
              your buy was successful!
            </div>
          </div>
        </div>
      );

 

}