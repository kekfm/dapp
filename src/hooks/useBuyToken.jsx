import { ethers } from "ethers"
import { useEffect, useState, useCallback } from "react"
import { useAppKitProvider, useAppKitAccount, useAppKitNetworkCore } from "@reown/appkit/react"
import { contracts } from "../helpers/contracts"


export default function useBuyToken(tokenAddress) {

    const { isConnected, address } = useAppKitAccount()
    const { chainId } = useAppKitNetworkCore()
    const { walletProvider } = useAppKitProvider("eip155")
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [txHash, setTxHash] = useState(null);
    const [txReceipt, setTxReceipt] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [contract, setContract] = useState(null);

   
    useEffect(() => {
        // Add delay to ensure provider is ready
        if (tokenAddress && isConnected && walletProvider && chainId) {
            console.log("All conditions met, initializing contract...")
            setTimeout(() => initializeContract(), 100)
        } else {
            console.log("Waiting for:", {
                needsConnection: !isConnected,
                needsProvider: !walletProvider,
                needsChainId: !chainId
            })
        }
    }, [tokenAddress, isConnected, address, walletProvider, chainId])

    const initializeContract = async () => {
        
        if (!walletProvider || !chainId) {
            console.log('Missing wallet requirements, falling back to read-only');
            return;
        }

        try {
            console.log('Getting signer...');
            const provider = new ethers.BrowserProvider(walletProvider, chainId);
            console.log("correctly initializedprovider", provider)
            const signer = await provider.getSigner();
            console.log('Signer obtained:', signer);
            
            const contractAddress = tokenAddress;
            console.log('Creating contract with:', {
                address: contractAddress,
                interface: contracts.token.interface[chainId]
            });
            
            const newContract = new ethers.Contract(
                contractAddress,
                contracts.token.interface[chainId],
                signer
            );
            setContract(newContract);
            console.log('Wallet contract created successfully');
        } catch (err) {
            console.error('Error initializing contract:', err);
            setError('Failed to initialize contract: ' + err.message);
        }
    }

    const buyToken = useCallback(async (minTokens, amountETH, txValue) => {

        if (!contract) {
            console.error('❌ Contract not initialized');
            setError('Contract not initialized');
            return;
        }

        if (!isConnected) {
            console.error('❌ Wallet not connected');
            setError('Wallet not connected');
            return;
        }

        try {
            console.log("🔄 Starting transaction...");
            setIsLoading(true);
            setError(null);
            setTxHash(null);
            setTxReceipt(null);
            setIsSuccess(false);

            console.log("📝 Preparing transaction parameters...");
            

            console.log("🔐 Calling contract.deployNewToken...");

            const provider = new ethers.BrowserProvider(walletProvider, chainId);
            console.log("correctly initializedprovider", provider)
            const signer = await provider.getSigner();
            console.log('Signer obtained:', signer);
            
            const contractAddress = tokenAddress;
           
            
            const newContract = new ethers.Contract(
                contractAddress,
                contracts.token.interface[chainId],
                signer
            );
            
            // Call the contract method
            const tx = await newContract.buy(
                minTokens,
                amountETH,
                { 
                    value: String(txValue),
                }
            );
            
            console.log("✅ Transaction sent! Hash:", tx.hash);
            setTxHash(tx.hash);

            console.log("⏳ Waiting for transaction confirmation...");
            const receipt = await tx.wait();
            console.log('✅ Transaction confirmed! Receipt:', receipt);
            setTxReceipt(receipt);

            if (receipt.status === 1) {
                console.log("🎉 Transaction successful!");
                setIsSuccess(true);
            } else {
                throw new Error('Transaction failed - status 0');
            }

        } catch (err) {
            console.error('💥 Error during token creation:', {
                error: err,
                message: err.message,
                code: err.code,
                reason: err.reason,
                transaction: err.transaction
            });
            
            let errorMessage = 'Failed to create token: ' + err.message;
            
            // Handle specific error types
            if (err.code === 'INSUFFICIENT_FUNDS') {
                errorMessage = 'Insufficient funds to complete transaction';
            } else if (err.code === 'USER_REJECTED') {
                errorMessage = 'Transaction rejected by user';
            } else if (err.message.includes('insufficient funds')) {
                errorMessage = 'Insufficient funds for transaction + gas fees';
            }
            
            setError(errorMessage);
        } finally {
            console.log("🏁 Transaction process completed, setting loading to false");
            setIsLoading(false);
        }
    }, [contract, isConnected, chainId]);

    return { contract, isLoading, error, txHash, txReceipt, isSuccess, buyToken }

}