import { ethers } from "ethers"
import { useEffect, useState } from "react"
import { useAppKitProvider, useAppKitAccount, useAppKitNetworkCore } from "@reown/appkit/react"
import { contracts } from "../helpers/contracts"
import { supportedChainIds } from "../helpers/chains"

export default function useFeeInfo() {
    const { isConnected, address } = useAppKitAccount()
    const { chainId } = useAppKitNetworkCore()
    const { walletProvider } = useAppKitProvider("eip155")
    const [feeInfo, setFeeInfo] = useState(null)
    const [error, setError] = useState(null)
    const [contract, setContract] = useState(null)

    useEffect(() => {
        // Try to initialize contract in multiple ways for Telegram mini app compatibility
        if (isConnected && walletProvider && chainId && supportedChainIds.includes(chainId)) {
            console.log("Wallet connected, using wallet provider...")
            setTimeout(() => initializeContract(), 100)
        } else if (chainId) {
            console.log("No wallet, trying read-only provider for fee info...")
            setTimeout(() => initializeReadOnlyContract(), 100)
        } else {
            console.log("Waiting for chainId...")
        }
    }, [isConnected, address, walletProvider, chainId])
    
    const initializeContract = async () => {
        console.log("Initializing contract with wallet provider:", {
            walletProvider: !!walletProvider,
            chainId,
            hasContracts: !!contracts.factory.addresses[chainId]
        })
        
        if (!walletProvider || !chainId) {
            console.log('Missing wallet requirements, falling back to read-only');
            initializeReadOnlyContract();
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
            
            console.log("Wallet contract created successfully")
            setContract(contractInstance)
            
            const feeInfo = await contractInstance.fee();
            console.log("Fee info retrieved via wallet:", feeInfo)
            setFeeInfo(feeInfo);
        } catch (err) {
            console.error('Error with wallet provider, trying read-only:', err);
            initializeReadOnlyContract();
        } 
    }

    const initializeReadOnlyContract = async () => {
        if (!chainId || !contracts.factory.addresses[chainId]) {
            console.log('Missing chainId or contract address');
            return;
        }

        try {
            console.log("Creating read-only provider for chainId:", chainId);
            
            // Use different RPC endpoints based on chain
            let rpcUrl;
            switch(chainId) {
                case 6666: // Modulus
                    rpcUrl = 'https://rpc.moduluszk.io';
                    break;
                case 8453: // Base
                    rpcUrl = 'https://mainnet.base.org';
                    break;
                case 97: // BSC Testnet
                    rpcUrl = 'https://data-seed-prebsc-1-s1.binance.org:8545';
                    break;
                case 57054: // Sonic Testnet
                    rpcUrl = 'https://rpc.blaze.soniclabs.com';
                    break;
                default:
                    console.error('Unsupported chainId for read-only:', chainId);
                    return;
            }

            const provider = new ethers.JsonRpcProvider(rpcUrl);
            const contractInstance = new ethers.Contract(
                contracts.factory.addresses[chainId], 
                contracts.factory.interface[chainId], 
                provider
            );
            
            console.log("Read-only contract created successfully")
            setContract(contractInstance)
            
            const feeInfo = await contractInstance.fee();
            console.log("Fee info retrieved via read-only:", feeInfo)
            setFeeInfo(feeInfo);
        } catch (err) {
            console.error('Error with read-only provider:', err);
            setError('Failed to get fee info: ' + err.message);
        }
    }

    return { feeInfo, error }
}
