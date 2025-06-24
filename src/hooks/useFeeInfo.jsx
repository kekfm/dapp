import { ethers } from "ethers"
import { useEffect, useState } from "react"
import { useAppKitProvider, useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react"
import { contracts } from "../helpers/contracts"

export default function useFeeInfo() {
    const { isConnected, address } = useAppKitAccount()
    const { chainId } = useAppKitNetwork()
    const { walletProvider } = useAppKitProvider("eip155")
    const [feeInfo, setFeeInfo] = useState(null)
    const [error, setError] = useState(null)
    const [contract, setContract] = useState(null)

    useEffect(() => {
        
        // Add delay to ensure provider is ready
        if (isConnected && walletProvider && chainId) {
            console.log("All conditions met, initializing contract...")
            setTimeout(() => initializeContract(), 100)
        } else {
            console.log("Waiting for:", {
                needsConnection: !isConnected,
                needsProvider: !walletProvider,
                needsChainId: !chainId
            })
        }
    }, [isConnected, address, walletProvider, chainId])
    
    const initializeContract = async () => {
        console.log("Initializing contract with:", {
            walletProvider: !!walletProvider,
            chainId,
            hasContracts: !!contracts.factory.addresses[chainId]
        })
        
        if (!walletProvider || !chainId) {
            console.log('Missing requirements:', { 
                hasWalletProvider: !!walletProvider, 
                chainId: chainId,
                contracts: contracts.factory.addresses[chainId] 
            });
            return;
        }

        try {
            const provider = new ethers.BrowserProvider(walletProvider);
            const signer = await provider.getSigner();
            const contractInstance = new ethers.Contract(
                contracts.factory.addresses[chainId], 
                contracts.factory.interface[chainId], 
                signer
            );
            
            console.log("Contract created successfully")
            setContract(contractInstance)
            
            const feeInfo = await contractInstance.fee();
            console.log("Fee info retrieved:", feeInfo)
            setFeeInfo(feeInfo);
        } catch (err) {
            console.error('Error getting fee info:', err);
            setError('Failed to get fee info: ' + err.message);
        } 
    }

    return { feeInfo, error }
}