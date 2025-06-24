import { ethers } from "ethers"
import { useEffect, useState, useCallback } from "react"
import { useAppKitProvider, useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react"
import { contracts } from "../helpers/contracts"

export default function useGetCultOut(tokenAddress) {
    const { isConnected, address } = useAppKitAccount()
    const { chainId } = useAppKitNetwork()
    const { walletProvider } = useAppKitProvider("eip155")
    const [cultOut, setCultOut] = useState(null)
    const [error, setError] = useState(null)
    const [contract, setContract] = useState(null)

    useEffect(() => {
        // Try to initialize contract in multiple ways for Telegram mini app compatibility
        if (tokenAddress &&isConnected && walletProvider && chainId) {
            console.log("Wallet connected, using wallet provider...")
            setTimeout(() => initializeContract(), 100)
        } else if (tokenAddress && chainId && isConnected) {
            console.log("No wallet, trying read-only provider for fee info...")
            setTimeout(() => initializeReadOnlyContract(), 100)
        } 
    }, [tokenAddress, isConnected, address, walletProvider, chainId])
    
    const initializeContract = async () => {
        console.log("Initializing contract with wallet provider:", {
            walletProvider: !!walletProvider,
            chainId,
            hasContracts: !!tokenAddress
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
                tokenAddress, 
                contracts.token.interface[chainId], 
                signer
            );
            
            console.log("Wallet contract created successfully")
            setContract(contractInstance)
            
            
        } catch (err) {
            console.error('Error with wallet provider, trying read-only:', err);
            initializeReadOnlyContract();
        } 
    }

    const initializeReadOnlyContract = async () => {
        if (!chainId || !tokenAddress) {
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
                default:
                    console.error('Unsupported chainId for read-only:', chainId);
                    return;
            }

            const provider = new ethers.JsonRpcProvider(rpcUrl);
            const contractInstance = new ethers.Contract(
                tokenAddress, 
                contracts.token.interface[chainId], 
                provider
            );
            
            console.log("Read-only contract created successfully")
            setContract(contractInstance)
            
            
        } catch (err) {
            console.error('Error with read-only provider:', err);
            setError('Failed to get balance: ' + err.message);
        }
    }

    const getCultOut = useCallback(async (amount) => {
        if (!contract) {
            console.error('Contract not initialized');
            return null;
        }

        try {
            console.log("Getting CULT out for amount:", amount.toString());
            const cultOut = await contract.calcETHAmount(ethers.parseEther(amount));
            console.log("CULT out:", cultOut.toString());
            
            // Format to readable number
            const formattedCultOut = ethers.formatEther(cultOut);
            return formattedCultOut;
        } catch (err) {
            console.error('Error calculating CULT amount:', err);
            setError('Failed to calculate CULT amount: ' + err.message);
            return null;
        }
    }, [contract]);

    return { cultOut, error, getCultOut }
}
