import { useEthers, useCall, useContractFunction } from "@usedapp/core";
import { Contract, ethers } from "ethers";
import {contracts} from "./contracts"
import { supportedChainIds } from "./chains";


export function useGetTokenAmount(chainId, tokenAddress, ethAmount) {
    const { value, error } =
      useCall(
        chainId && ethAmount != "" &&
          {
            contract: new Contract(tokenAddress, contracts.token.interface[97]),
            method: "calcTokenAmount", // Method to be called
            args: [ethAmount], // Method arguments - address to be checked for balance etc
          }
      ) ?? {};
    if(error) {
      console.error(error.message)
      return undefined
    }
    return value?.[0]
}

export function useGetETHAmount(chainId, tokenAddress, tokenAmount) {
    const { value, error } =
      useCall(
        chainId &&
          {
            contract: new Contract(tokenAddress, contracts.token.interface[97]),
            method: "calcETHAmount", // Method to be called
            args: [tokenAmount], // Method arguments - address to be checked for balance etc
          }
      ) ?? {};
    if(error) {
      console.error(error.message)
      return undefined
    }
    return value?.[0]
}

export function useBuyToken(methodName, chainId, transactionName, tokenAddress) {
  if(chainId && supportedChainIds.includes(chainId)){
      const contract = new Contract(tokenAddress, contracts.token.interface[chainId])
      const {state, send, events, resetState} = useContractFunction(contract, methodName, {transactionName: transactionName})
      return {state, send, events, resetState}
  }else{
      const contract = new Contract(tokenAddress, contracts.factory.interface[97])
      const {state, send, events, resetState} = useContractFunction(contract, methodName, {transactionName: transactionName})
      return {state, send, events, resetState}
  }
  
}

export function useSellToken(methodName, chainId, transactionName, tokenAddress) {
  if(chainId && supportedChainIds.includes(chainId)){
      const contract = new Contract(tokenAddress, contracts.token.interface[chainId])
      const {state, send, events, resetState} = useContractFunction(contract, methodName, {transactionName: transactionName})
      return {state, send, events, resetState}
  }else{
      const contract = new Contract(tokenAddress, contracts.factory.interface[97])
      const {state, send, events, resetState} = useContractFunction(contract, methodName, {transactionName: transactionName})
      return {state, send, events, resetState}
  }
  
}

