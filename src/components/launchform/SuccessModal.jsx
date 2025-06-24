import '../../../globals.css'
import { useEffect, useState} from 'react'
import { ethers } from "ethers"
import { Link } from 'react-router-dom'
import eventHandlerAbi from '../../abis/eventhandlerABI.json'

export default function SuccessModal ({tx, isOpen, closeModal}) {
    const [tokenAddress, setTokenAddress] = useState(undefined)

    useEffect(() => {
        if(tx && tx.logs) {
            try {
                console.log("Transaction logs:", tx.logs);
                
                // Create interface for decoding - ethers v6 syntax
                const iface = new ethers.Interface(eventHandlerAbi);
                
                // Look for our token creation event in all logs
                for (let i = 0; i < tx.logs.length; i++) {
                    try {
                        const log = tx.logs[i];
                        const decodedLog = iface.parseLog({
                            topics: log.topics,
                            data: log.data
                        });
                        
                        console.log(`Log ${i} decoded:`, decodedLog);
                        
                        // Check if this is the token creation event
                        // Adjust the index based on your actual event structure
                        if (decodedLog && decodedLog.args && decodedLog.args.length > 1) {
                            const tokenAddr = decodedLog.args[1]; // Adjust index as needed
                            console.log("Found token address:", tokenAddr);
                            setTokenAddress(tokenAddr);
                            break;
                        }
                    } catch (logError) {
                        // This log might not be from our contract, skip it
                        console.log(`Log ${i} not from our contract:`, logError.message);
                    }
                }
            } catch (error) {
                console.error("Error decoding transaction logs:", error);
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
                {tokenAddress ? (
                    <Link to={`/launch?token=${tokenAddress}`}>
                        <button className={`bg-base-2 border-4 border-black py-2 px-8 mt-2 mb-2 w-full text-center hover:-translate-y-2 transition-all duration-300 ease-in-out`}>
                            Check Launch
                        </button>
                    </Link>
                ) : (
                    <div className="text-center text-sm text-gray-600 mb-4">
                        Decoding token address...
                    </div>
                )}
                
                {/* Close button as fallback */}
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