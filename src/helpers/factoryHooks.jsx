import { useEthers, useCall, useContractFunction } from "@usedapp/core";
import { Contract, ethers } from "ethers";
import {contracts} from "./contracts"
import { supportedChainIds } from "./chains";
import { useReadContract } from 'wagmi'

export function useFeeInfo(chainId) {
    const { data: fee } = useReadContract({
        address: chainId && supportedChainIds.includes(chainId) ? contracts.factory.addresses[chainId] : undefined,
        abi: chainId && supportedChainIds.includes(chainId) ? contracts.factory.interface[chainId] : undefined,
        functionName: 'fee',
        //enabled: Boolean(chainId && supportedChainIds.includes(chainId))
    });

    console.log("Fee from hook:", fee);
    return fee;
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