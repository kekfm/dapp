import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { ethers } from "ethers"
import { contracts } from "./contracts"
import { supportedChainIds } from "./chains"
import tokenAbi from '../abis/tokenABI.json'

export function useGetTokenAmount(chainId, tokenAddress, ethAmount) {
    const { data: tokenAmount, error } = useReadContract({
        address: chainId && ethAmount ? tokenAddress : undefined,
        abi: tokenAbi,
        functionName: 'calcTokenAmount',
        args: ethAmount ? [ethAmount] : undefined,
        enabled: Boolean(chainId && ethAmount && tokenAddress)
    })

    if (error) {
        console.error("Error getting token amount:", error)
        return undefined
    }
    return tokenAmount
}

export function useGetETHAmount(chainId, tokenAddress, tokenAmount) {
    const { data: ethAmount, error } = useReadContract({
        address: chainId ? tokenAddress : undefined,
        abi: tokenAbi,
        functionName: 'calcETHAmount',
        args: tokenAmount ? [tokenAmount] : undefined,
        enabled: Boolean(chainId && tokenAmount && tokenAddress)
    })

    if (error) {
        console.error("Error getting ETH amount:", error)
        return undefined
    }
    return ethAmount
}

export function useBuyToken(chainId, tokenAddress) {
    const { writeContract, isPending: isWritePending, isError: isWriteError, data: hash } = useWriteContract()
    const { data: receipt, isPending: isReceiptPending, isSuccess, isError: isReceiptError } = useWaitForTransactionReceipt({
        hash,
        enabled: Boolean(hash)
    })

    const buy = async (minimumTokens, amountETH, value) => {
        if (!chainId || !tokenAddress) return

        try {
            writeContract({
                address: tokenAddress,
                abi: tokenAbi,
                functionName: 'buy',
                args: [minimumTokens, amountETH],
                value
            })
        } catch (error) {
            console.error("Error buying token:", error)
            throw error
        }
    }

    return {
        buy,
        isPending: isWritePending || (hash && isReceiptPending),
        isError: isWriteError || isReceiptError,
        isSuccess,
        receipt,
        hash
    }
}

export function useSellToken(chainId, tokenAddress) {
    const { writeContract, isPending: isWritePending, isError: isWriteError, data: hash } = useWriteContract()
    const { data: receipt, isPending: isReceiptPending, isSuccess, isError: isReceiptError } = useWaitForTransactionReceipt({
        hash,
        enabled: Boolean(hash)
    })

    const sell = async (tokenAmount, minETHAmount) => {
        if (!chainId || !tokenAddress) return

        try {
            writeContract({
                address: tokenAddress,
                abi: tokenAbi,
                functionName: 'sell',
                args: [tokenAmount, minETHAmount]
            })
        } catch (error) {
            console.error("Error selling token:", error)
            throw error
        }
    }

    return {
        sell,
        isPending: isWritePending || (hash && isReceiptPending),
        isError: isWriteError || isReceiptError,
        isSuccess,
        receipt,
        hash
    }
}

