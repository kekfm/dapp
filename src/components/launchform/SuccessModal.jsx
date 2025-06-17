import '../../../globals.css'
import { useEffect, useState} from 'react'
import { ethers } from "ethers"
import { Link } from 'react-router-dom'
import eventHandlerAbi from '../../abis/eventhandlerABI.json'

export default function SuccessModal ({tx, isOpen, closeModal}) {
    const [tokenAddress, setTokenAddress] = useState(undefined)

    useEffect(() => {
        if(tx && tx.logs) {
            // The event we're looking for should be the last log from the EventHandler
            const eventHandlerLog = tx.logs[2]; // The third log contains our event
            if (eventHandlerLog) {
                try {
                    // Create interface for decoding - ethers v5 syntax
                    const iface = new ethers.utils.Interface(eventHandlerAbi);
                    
                    // Decode the log data
                    const decodedLog = iface.parseLog(eventHandlerLog);

                    // The token address should be in the decoded parameters
                    const tokenAddr = decodedLog.args[1]; // The token address should be the second parameter
                    console.log("Decoded token address:", tokenAddr);
                    setTokenAddress(tokenAddr);
                } catch (error) {
                    console.error("Error decoding log:", error);
                }
            }
        }
    }, [tx]);
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Overlay background */}
            <div className="fixed inset-0 bg-black opacity-70" onClick={closeModal}></div>

            {/* Modal content */}
            <div className="relative bg-base-5 connectbox border-4 border-black py-6 px-10 z-50 max-w-md w-full mx-4 shadow-lg">
                <div className={`text-3xl pb-2 pt-2 text-center`}>
                    Success!
                </div>
                <div className={`text-xl pb-4 pt-2 text-center`}>
                    Welcome to the fam, dev!
                </div>
                <div className={`text-xl pb-4 text-center`}>
                    Check your launch here
                </div>
                {tokenAddress && (
                    <Link to={`/launch?token=${tokenAddress}`}>
                        <button className={`bg-base-2 border-4 border-black py-2 px-8 mt-2 mb-2 w-full text-center hover:-translate-y-2 transition-all duration-300 ease-in-out`}>
                            Check
                        </button>
                    </Link>
                )}
            </div>
        </div>
    );
}