import { useEthers, useCall, useContractFunction } from "@usedapp/core";
import { Contract, ethers } from "ethers";
import {contracts} from "./contracts"
import { supportedChainIds } from "./chains";


export function useFeeInfo(chainId) {
    const { value, error } =
      useCall(
        chainId && supportedChainIds.includes(chainId) && contracts.factory.addresses[chainId] &&
          {
            contract: new Contract(contracts.factory.addresses[chainId], contracts.factory.interface[chainId]),
            method: "fee", // Method to be called
            args: [], // Method arguments - address to be checked for balance etc
          }
      ) ?? {};
    if(error) {
      console.error(error.message)
      return undefined
    }
    return value?.[0]
  }



  export function useCreateToken(methodName, chainId, transactionName) {
    if(chainId && supportedChainIds.includes(chainId) && contracts.factory.addresses[chainId]){
        const contract = new Contract(contracts.factory.addresses[chainId], contracts.factory.interface[chainId])
        const {state, send, events, resetState} = useContractFunction(contract, methodName, {transactionName: transactionName})
        return {state, send, events, resetState}
    }else{
        const contract = new Contract(contracts.factory.addresses[97], contracts.factory.interface[97])
        const {state, send, events, resetState} = useContractFunction(contract, methodName, {transactionName: transactionName})
        return {state, send, events, resetState}
    }
    
}