import { DAppProvider, Mainnet, BSCTestnet, Base, TestBNB} from "@usedapp/core";
import React from "react";
import {supportedChainIds} from "./chains"
import { Modulus } from "./modulus";


export default function Provider({children}){

    const config = {
        supportedChainIds: supportedChainIds,
        readOnlyChainIds: [BSCTestnet.chainId, Base.chainId, Modulus.chainId],
        readOnlyUrls:{
            [BSCTestnet.chainId]: 'https://bsc-testnet-rpc.publicnode.com',
            [Base.chainId]: "https://base-mainnet.infura.io/v3/2122ff7e81604a82bcad9e69b1042632",
            [Modulus.chainId]: 'https://rpc.moduluszk.io'
        },
        networks:[BSCTestnet, Base, Modulus]
    }
    return(
        <DAppProvider config={config}>
            {children}
        </DAppProvider>
    )


}
