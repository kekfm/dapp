import { ethers } from "ethers";


export const providers = {
    97: new ethers.JsonRpcProvider("https://bsc-testnet-rpc.publicnode.com"),
    8453: new ethers.JsonRpcProvider("https://base-mainnet.g.alchemy.com/v2/demo"),
    6666: new ethers.JsonRpcProvider("https://rpc.moduluszk.io"),
}