import '../../../globals.css'

import { useEffect, useState} from 'react'
import { Contract, ethers } from "ethers";
import {contracts} from "../../helpers/contracts"
import {formatter} from "../../helpers/formatter"
import { Link } from 'react-router-dom';




export default function FailModal ({error, isOpen, closeModal}) {

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Overlay background */}
          <div className="fixed inset-0 bg-black opacity-70" onClick={closeModal}></div>

          {/* Modal content */}
          <div className="relative bg-base-8 connectbox border-4 border-black py-6 px-10 z-50 max-w-md w-full mx-4 shadow-lg">
            <div className={` text-3xl pb-2 pt-2 text-center`}>
              Failed!
            </div>
            <div className={` text-xl pb-4 pt-2 text-center`}>
              Something went wrong...
            </div>
            {error && (
              <div className="text-sm text-center pb-4 text-red-700 bg-red-100 p-2 rounded border">
                {error}
              </div>
            )}
            <button 
              onClick={closeModal}
              className={`bg-base-1 border-4 border-black py-2 px-8 w-full text-center hover:-translate-y-2 transition-all duration-300 ease-in-out`}
            >
              Close
            </button>
          </div>
        </div>
      );

 

}