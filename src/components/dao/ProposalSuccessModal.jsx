import '../../../globals.css'
import { useEffect, useState} from 'react'
import {formatter} from "../../helpers/formatter"
import { Link } from 'react-router-dom';




export default function ProposalSuccessModal ({isOpen, receipt, closeModal}) {

    const [proposalId, setProposalId] = useState(undefined)

    useEffect(() => {
        if(status == 2){
            setProposalId(receipt[id])
        }
    },[status])
    
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Overlay background */}
          <div className="fixed inset-0 bg-black opacity-70" onClick={closeModal}></div>

          {/* Modal content */}
          <div className="relative bg-base-5 connectbox border-4 border-black py-6 px-10 z-50 max-w-md w-full mx-4 shadow-lg">
            <div className={`font-basic text-3xl pb-2 pt-2 text-center`}>
              Success!
            </div>
            <div className={`font-basic text-xl pb-4 text-center`}>
              Check your Proposal here
            </div>
              <Link to={`/vote=${proposalId}`}>
                <button className={`font-basic bg-base-2 connectbox border-4 border-black py-2 px-8 mt-2 mb-2 w-full text-center hover:-translate-y-2 transition-all duration-300 ease-in-out`}>
                  Check
                </button>
              </Link>
          </div>
        </div>
      );

 

}