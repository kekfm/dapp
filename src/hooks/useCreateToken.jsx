import { ethers } from "ethers"
import { useEffect, useState } from "react"
import { useAppKitProvider, useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react"
import { contracts } from "../helpers/contracts"


export default function useCreateToken() {

    const { isConnected, address } = useAppKitAccount()
    const { chainId } = useAppKitNetwork()
    const { walletProvider } = useAppKitProvider("eip155")

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [txHash, setTxHash] = useState(null);
    const [txReceipt, setTxReceipt] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [contract, setContract] = useState(null);

    console.log("useAppkitProvider", useAppKitProvider)
    console.log("walletProvider", walletProvider)


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
            console.log('Getting signer...');
            const provider = new ethers.BrowserProvider(walletProvider);
            const signer = await provider.getSigner();
            console.log('Signer obtained:', signer);
            
            const contractAddress = contracts.factory.addresses[chainId];
            console.log('Creating contract with:', {
                address: contractAddress,
                interface: contracts.factory.interface[chainId]
            });
            
            const newContract = new ethers.Contract(
                contractAddress,
                contracts.factory.interface[chainId],
                signer
            );
            setContract(newContract);
            console.log('Contract initialized successfully');
        } catch (err) {
            console.error('Error initializing contract:', err);
            setError('Failed to initialize contract: ' + err.message);
        }
    }

    const createToken = async (contractAddresses, tokenName, tokenSymbol, tokenInfo, feeAddress, parsedBuyAmount, txValue) => {
        if (!contract) {
            console.error('Contract not initialized');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            setTxHash(null);
            setTxReceipt(null);
            setIsSuccess(false);

            console.log("Creating token with:", {
                contractAddresses,
                tokenName,
                tokenSymbol,
                tokenInfo,
                feeAddress,
                parsedBuyAmount,
                txValue
            })

            const tx = await contract.deployNewToken(contractAddresses, tokenName, tokenSymbol, tokenInfo, feeAddress, parsedBuyAmount, { value: String(txValue)});
            setTxHash(tx.hash);

            const receipt = await tx.wait();
            console.log('Transaction receipt:', receipt);
            setTxReceipt(receipt);

            if (receipt.status === 1) {
                setIsSuccess(true);
            } else {
                throw new Error('Transaction failed');
            }

        } catch (err) {
            console.error('Error creating token:', err);
            setError('Failed to create token: ' + err.message);
        } finally {
            setIsLoading(false);
        }
    }

    return { contract, isLoading, error, txHash, txReceipt, isSuccess, createToken }

}