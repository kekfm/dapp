import { ethers } from "ethers"
import { useEffect, useState, useCallback } from "react"
import { useAppKitProvider, useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react"
import { contracts } from "../helpers/contracts"

export default function useGetTokensOut(tokenAddress) {
    const { isConnected, address } = useAppKitAccount()
    const { chainId } = useAppKitNetwork()
    const { walletProvider } = useAppKitProvider("eip155")
    const [tokensOut, setTokensOut] = useState(null)
    const [error, setError] = useState(null)
    const [contract, setContract] = useState(null)

    useEffect(() => {
        // Initialize contract when dependencies change
        if (tokenAddress && chainId) {
            if (isConnected && walletProvider) {
                console.log("Wallet connected, using wallet provider...")
                setTimeout(() => initializeContract(), 100)
            } else {
                console.log("No wallet, trying read-only provider...")
                setTimeout(() => initializeReadOnlyContract(), 100)
            }
        }
    }, [tokenAddress, isConnected, address, walletProvider, chainId])
    
    const initializeContract = async () => {
        console.log("Initializing contract with wallet provider:", {
            walletProvider: !!walletProvider,
            chainId,
            tokenAddress
        })
        
        if (!walletProvider || !chainId || !tokenAddress) {
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
            setError('Failed to initialize contract: ' + err.message);
        }
    }

    const getTokenAmount = useCallback(async (ethAmount) => {
        if (!contract) {
            console.error('Contract not initialized');
            return null;
        }

        try {
            console.log("Getting token amount for:", ethAmount.toString());
            const tokensOut = await contract.calcTokenAmount(ethAmount);
            console.log("Tokens out:", tokensOut.toString());
            
            // Format to readable number
            const formattedTokensOut = ethers.formatEther(tokensOut);
            return formattedTokensOut;
        } catch (err) {
            console.error('Error calculating token amount:', err);
            setError('Failed to calculate token amount: ' + err.message);
            return null;
        }
    }, [contract]);

    return { tokensOut, error, getTokenAmount }
}
