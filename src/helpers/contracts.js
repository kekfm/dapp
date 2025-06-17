import {supportedChainIds} from './chains'
import {ethers} from 'ethers'
import factoryABI from '../abis/factoryABI.json'
import tokenABI from '../abis/tokenABI.json'



export const contracts = {
    factory: 
        {
            addresses: {
                //97:'0xA9B3b651bc5FfE3a9783541ED16E70430958B470' //old
                97: "0x42d350729a67791Cf18e3C55F1df153C18e09183", // new after audit
                6666:"0xdc69fae4b300f42686f962916944AE8f58554A24"//mdex
            },

            interface: {
                97: new ethers.utils.Interface(factoryABI),
                8453: new ethers.utils.Interface(factoryABI),
                6666: new ethers.utils.Interface(factoryABI)
            }
        },
    eventhandler:
        {
            addresses:{
                //97:"0xAF3B1FF5C33C9D144300f7Eb9EFD9a044fF5Acb2" //old
                97:"0xAAC562D8B30630fc48247767858f20D34bc1082e", //new after audit
                6666:"0x5B63b5C0B676263F7D52F368e4c46f1416Ffd2e7"//mdex
            }

        },
    sushiV2Factory:
        {   
            addresses:{
                97:"0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
                8453:"0x8937837a0Ee98984EB8199B3384da7a136168154", //baseswap
                6666:"0x5DBBfB616629A747b5741D7e2e66d72bF5ffA2E8" //mdex
            },
    
        },
    sushiV2Router:
        {   
            addresses:{
                97:"0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
                8453:"0xBa88b20dD982cF50701cf29755bBC3dfa353821f", //baseswap
                6666:"0x0C46021E70D34DBb41D7ff3fC83669dF45ffED32"//mdex
            },
        },
    WETH:
        {
            addresses:{
                97:"0xa8B8cb1C5c9e13C3af86cc8aa5f0297Db69b099C",
                8453:"0x4200000000000000000000000000000000000006",
                6666:"0x49c1569bd5263594AE919EC267A1D901f402cb67"//mdex

            }
            
        },
    feeAddress:
        {
            97:"0x3ce40bea49C6587185d19Fa4684ce6E338480aEC",
            8453:"0x3ce40bea49C6587185d19Fa4684ce6E338480aEC",
            6666:"0xdE50752e0b620fA3e45C7e3514427E2870E9e824"

        },
    token:{
            interface:{
                97: new ethers.utils.Interface(tokenABI),
                8453: new ethers.utils.Interface(tokenABI),
                6666: new ethers.utils.Interface(tokenABI)

            }
    }
    
}