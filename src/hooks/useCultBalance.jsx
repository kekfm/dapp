
import { ethers } from "ethers"
import { useEffect, useState } from "react"
import { useAppKitProvider, useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react"

export default function useCultBalance() {
    const { isConnected, address } = useAppKitAccount()
    const { chainId } = useAppKitNetwork()
    const { walletProvider } = useAppKitProvider("eip155")
    
    const [balance, setBalance] = useState(null)
    const [formattedBalance, setFormattedBalance] = useState(null)
    const [symbol, setSymbol] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    // Get native token symbol based on chain
    const getNativeSymbol = (chainId) => {
        switch(chainId) {
            case 6666: return 'CULT'  // Modulus
            case 8453: return 'ETH'   // Base
            case 97: return 'BNB'     // BSC Testnet  
            case 1: return 'ETH'      // Ethereum Mainnet
            default: return 'ETH'
        }
    }

    // Get RPC URL for read-only operations
    const getRpcUrl = (chainId) => {
        switch(chainId) {
            case 6666: return 'https://rpc.moduluszk.io'
            case 8453: return 'https://mainnet.base.org'
            case 97: return 'https://data-seed-prebsc-1-s1.binance.org:8545'
            case 1: return 'https://cloudflare-eth.com'
            default: return null
        }
    }

    const fetchBalance = async () => {
        if (!address || !chainId) {
            console.log('Missing address or chainId for balance fetch')
            return
        }

        try {
            setLoading(true)
            setError(null)
            
            let provider
            
            // Try wallet provider first, fallback to read-only
            if (isConnected && walletProvider) {
                provider = new ethers.BrowserProvider(walletProvider)
            } else {
                const rpcUrl = getRpcUrl(chainId)
                if (!rpcUrl) {
                    throw new Error(`Unsupported chainId: ${chainId}`)
                }
                provider = new ethers.JsonRpcProvider(rpcUrl)
            }

            console.log(`Fetching balance for ${address} on chain ${chainId}`)
            
            // Get native token balance
            const balanceWei = await provider.getBalance(address)
            const balanceFormatted = ethers.formatEther(balanceWei)
            const nativeSymbol = getNativeSymbol(chainId)
            
            console.log(`Balance: ${balanceFormatted} ${nativeSymbol}`)
            
            setBalance(balanceWei)
            setFormattedBalance(balanceFormatted)
            setSymbol(nativeSymbol)
            
        } catch (err) {
            console.error('Error fetching balance:', err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    // Fetch balance when dependencies change
    useEffect(() => {
        if (address && chainId) {
            fetchBalance()
        } else {
            setBalance(null)
            setFormattedBalance(null)
            setSymbol('')
        }
    }, [address, chainId, isConnected])

    // Refresh balance every 30 seconds if connected
    useEffect(() => {
        if (!isConnected || !address) return

        const interval = setInterval(() => {
            fetchBalance()
        }, 30000) // 30 seconds

        return () => clearInterval(interval)
    }, [isConnected, address, chainId])

    return { 
        balance,           // Raw balance in wei (BigInt)
        formattedBalance,  // Formatted balance as string (e.g., "1.234")
        symbol,            // Native token symbol (e.g., "CULT", "ETH", "BNB")
        loading,           // Loading state
        error,             // Error message if any
        refetch: fetchBalance  // Manual refresh function
    }
}
