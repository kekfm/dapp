import { DAppProvider, Mainnet, BSCTestnet, Base, Sepolia} from "@usedapp/core";
import React from "react";
import {supportedChainIds} from "./chains"
import { Modulus } from "./modulus";


export default function Provider({children}){

    const config = {
        supportedChainIds: supportedChainIds,
        readOnlyChainIds: [Mainnet.chainId, BSCTestnet.chainId, Base.chainId, Modulus.chainId, Sepolia.chainId],
        readOnlyUrls:{
            [Mainnet.chainId]: "https://eth.llamarpc.com",
            [BSCTestnet.chainId]: 'https://bsc-testnet-rpc.publicnode.com',
            [Base.chainId]: "https://base-mainnet.infura.io/v3/2122ff7e81604a82bcad9e69b1042632",
            [Modulus.chainId]: 'https://rpc.moduluszk.io',
            [Sepolia.chainId]: "https://rpc2.sepolia.org"
        },
        networks:[Mainnet, BSCTestnet, Base, Modulus, Sepolia]
    }
    return(
        <DAppProvider config={config}>
            {children}
        </DAppProvider>
    )


}
