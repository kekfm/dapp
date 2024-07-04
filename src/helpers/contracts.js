import {supportedChainIds} from './chains'
import {ethers} from 'ethers'
import factoryABI from '../abis/factoryABI.json'


export const contracts = {
    factory: 
        {
            addresses: {
                97:'0xA9B3b651bc5FfE3a9783541ED16E70430958B470'
            },

            interface: {
                97: new ethers.utils.Interface(factoryABI)
            }

        },
    eventhandler:
        {
            addresses:{
                97:"0xAF3B1FF5C33C9D144300f7Eb9EFD9a044fF5Acb2"
            }

        },
    sushiV2Factory:
        {   
            addresses:{
                97:"0xc35DADB65012eC5796536bD9864eD8773aBc74C4"
            },
        

        },
    sushiV2Router:
        {   
            addresses:{
                97:"0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506"
            },
            

        },
    WETH:
        {
            addresses:{
                97:"0xa8B8cb1C5c9e13C3af86cc8aa5f0297Db69b099C"
            }
            
        },
    feeAddress:
        {
            97:"0x9695b8652a3046a5390BCF5e2Ca9C4b8C8437aa5"
        }
    
}