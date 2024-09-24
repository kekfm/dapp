import {supportedChainIds} from './chains'
import {ethers} from 'ethers'
import factoryABI from '../abis/factoryABI.json'
import tokenABI from '../abis/tokenABI.json'



export const contracts = {
    factory: 
        {
            addresses: {
                //97:'0xA9B3b651bc5FfE3a9783541ED16E70430958B470' //old
                97: "0x42d350729a67791Cf18e3C55F1df153C18e09183" // new after audit
            },

            interface: {
                97: new ethers.utils.Interface(factoryABI),
                8453: new ethers.utils.Interface(factoryABI)
            }
        },
    eventhandler:
        {
            addresses:{
                //97:"0xAF3B1FF5C33C9D144300f7Eb9EFD9a044fF5Acb2" //old
                97:"0xAAC562D8B30630fc48247767858f20D34bc1082e" //new after audit
            }

        },
    sushiV2Factory:
        {   
            addresses:{
                97:"0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
                8453:"0x8937837a0Ee98984EB8199B3384da7a136168154" //baseswap
            },
    
        },
    sushiV2Router:
        {   
            addresses:{
                97:"0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
                8453:"0xBa88b20dD982cF50701cf29755bBC3dfa353821f" //baseswap
            },
        },
    WETH:
        {
            addresses:{
                97:"0xa8B8cb1C5c9e13C3af86cc8aa5f0297Db69b099C",
                8453:"0x4200000000000000000000000000000000000006"
            }
            
        },
    feeAddress:
        {
            97:"0x3ce40bea49C6587185d19Fa4684ce6E338480aEC",
            8453:"0x3ce40bea49C6587185d19Fa4684ce6E338480aEC"

        },
    token:{
            interface:{
                97: new ethers.utils.Interface(tokenABI),
                8453: new ethers.utils.Interface(tokenABI)

            }
    }
    
}