
import '../../../globals.css';
import { useEthers } from "@usedapp/core";
import baseconnect from "../../assets/baseconnect.svg"
import bnbconnect from "../../assets/bnbconnect.svg"
import modulusconnect from "../../assets/modulusconnect.svg"
import { useAppKit } from '@reown/appkit/react';
import { createAppKit } from '@reown/appkit/react'
import { Ethers5Adapter } from '@reown/appkit-adapter-ethers5'
import { mainnet, base } from '@reown/appkit/networks'





export const Connect = ({handleOpen, isOpen}) => {

   
    
    const projectId = "e55976fffe11b95244b98b0b155c5ca9"
    
    const metadata = {
      name: 'kek',
      description: 'degen everything',
      url: 'https://kek.fm', // origin must match your domain & subdomain
    }
    createAppKit({
      adapters: [new Ethers5Adapter()],
      metadata: metadata,
      networks: [mainnet, base],
      projectId,
      features: {
        analytics: true // Optional - defaults to your Cloud configuration
      }
    })

    const {account, activateBrowserWallet, deactivate, chainId, switchNetwork} = useEthers()

    const {open} = useAppKit()

    const handleBox = () =>{
        activateBrowserWallet({ type: 'walletConnectV2' })
        
    }

    const handleBoxDeact = () =>{
        deactivate()
    
    }



    return(
        <div className="max-w-44">

            {/*!account &&
                <div onClick= {()=>open({view:"Connect"})} className={`connectbox border-4 border-black px-8 py-2 bg-base-2 hover:scale-110 ease-in-out hover:cursor-pointer `}>
                    connect
                </div>
    */}   
            {!account &&
                <div onClick= {handleBox} className={`connectbox border-4 border-black px-8 py-2 bg-base-2 hover:scale-110 ease-in-out hover:cursor-pointer `}>
                    connect
                </div>
            }

            {account && chainId == 97 &&
                <div onClick= {handleBoxDeact} className={`flex flex-row connectbox border-4 border-black px-4 py-2 bg-base-7 gap-2 hover:scale-110 ease-in-out hover:cursor-pointer`}>
                    <img className="w-[23px]" src={bnbconnect} alt="connect"></img>
                    <div>{`${account.slice(0,4)}...${account.slice(account.length -6, account.length)}`}</div>
                </div>
            }
            {account && chainId == 8453 &&
                <div onClick= {handleBoxDeact} className={`flex flex-row connectbox border-4 border-black px-4 py-2 bg-base-7 gap-2 hover:scale-110 ease-in-out hover:cursor-pointer`}>
                    <img className="w-[23px]" src={baseconnect} alt="connect"></img>
                    <div>{`${account.slice(0,4)}...${account.slice(account.length -6, account.length)}`}</div>
                </div>
            }
            {account && chainId == 6666 &&
                <div onClick= {handleBoxDeact} className={`flex flex-row connectbox border-4 border-black px-4 py-2 bg-base-7 gap-2 hover:scale-110 ease-in-out hover:cursor-pointer`}>
                    <img className="w-[23px]" src={modulusconnect} alt="connect"></img>
                    <div>{`${account.slice(0,4)}...${account.slice(account.length -6, account.length)}`}</div>
                </div>
            }
            {account && (chainId != 97 && chainId != 8453 && chainId != 6666) &&
                <div onClick= {handleBoxDeact} className={`connectbox border-4 border-black px-8 py-2 bg-base-8 hover:scale-110 ease-in-out hover:cursor-pointer`}>
                    Wrong Chain
                </div>
            }
        </div>
        
    )
}

