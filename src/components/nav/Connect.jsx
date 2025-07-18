
import '../../../globals.css';
import baseconnect from "../../assets/baseconnect.svg"
import bnbconnect from "../../assets/bnbconnect.svg"
import modulusconnect from "../../assets/modulusconnect.svg"
import sonicconnect from "../../assets/sonicconnect.png"
import { useAppKit, useAppKitAccount, useDisconnect } from '@reown/appkit/react';
import { useAppKitNetworkCore } from '@reown/appkit/react';





export const Connect = ({handleOpen, isOpen}) => {

    const { address, isConnected } = useAppKitAccount();
  const { disconnect } = useDisconnect();
  const { open } = useAppKit();
  const { chainId } = useAppKitNetworkCore();
    

    const handleBox = () =>{
        if (isConnected) {
            disconnect();
          } else {
            open({ view: "Connect", namespace: "eip155"});
          }
    }

    const handleBoxDeact = () =>{
        disconnect()
    
    }



    return(
        <div className="max-w-44">

            {/*!account &&
                <div onClick= {()=>open({view:"Connect"})} className={`connectbox border-4 border-black px-8 py-2 bg-base-2 hover:scale-110 ease-in-out hover:cursor-pointer `}>
                    connect
                </div>
    */}   
            {!address &&
                <div onClick= {handleBox} className={`connectbox border-4 border-black px-8 py-2 bg-base-2 hover:scale-110 ease-in-out hover:cursor-pointer `}>
                    connect
                </div>
            }

            {address && chainId == 97 &&
                <div onClick= {handleBoxDeact} className={`flex flex-row connectbox border-4 border-black px-4 py-2 bg-base-7 gap-2 hover:scale-110 ease-in-out hover:cursor-pointer`}>
                    <img className="w-[23px]" src={bnbconnect} alt="connect"></img>
                    <div>{`${address.slice(0,4)}...${address.slice(address.length -6, address.length)}`}</div>
                </div>
            }
            {address && chainId == 8453 &&
                <div onClick= {handleBoxDeact} className={`flex flex-row connectbox border-4 border-black px-4 py-2 bg-base-7 gap-2 hover:scale-110 ease-in-out hover:cursor-pointer`}>
                    <img className="w-[23px]" src={baseconnect} alt="connect"></img>
                    <div>{`${address.slice(0,4)}...${address.slice(address.length -6, address.length)}`}</div>
                </div>
            }
            {address && chainId == 6666 &&
                <div onClick= {handleBoxDeact} className={`flex flex-row connectbox border-4 border-black px-4 py-2 bg-base-7 gap-2 hover:scale-110 ease-in-out hover:cursor-pointer`}>
                    <img className="w-[23px]" src={modulusconnect} alt="connect"></img>
                    <div>{`${address.slice(0,4)}...${address.slice(address.length -6, address.length)}`}</div>
                </div>
            }
            {address && chainId == 57054 &&
                <div onClick= {handleBoxDeact} className={`flex flex-row connectbox border-4 border-black px-4 py-2 bg-base-7 gap-2 hover:scale-110 ease-in-out hover:cursor-pointer`}>
                    <img className="w-[23px]" src={sonicconnect} alt="connect"></img>
                    <div>{`${address.slice(0,4)}...${address.slice(address.length -6, address.length)}`}</div>
                </div>
            }
            {address && (chainId != 97 && chainId != 8453 && chainId != 6666 && chainId != 57054) &&
                <div onClick= {handleBoxDeact} className={`connectbox border-4 border-black px-8 py-2 bg-base-8 hover:scale-110 ease-in-out hover:cursor-pointer`}>
                    Wrong Chain
                </div>
            }
        </div>
        
    )
}

