
import '../../../globals.css';
import { useEthers } from "@usedapp/core";
import baseconnect from "../../assets/baseconnect.svg"
import bnbconnect from "../../assets/bnbconnect.svg"
import modulusconnect from "../../assets/modulusconnect.svg"





export const Connect = ({handleOpen, isOpen}) => {



const {account, activateBrowserWallet, deactivate, chainId, switchNetwork} = useEthers()

const handleBox = () =>{
    activateBrowserWallet()
    
}

const handleBoxDeact = () =>{
    deactivate()
   
}



    return(
        <div className="max-w-44">
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

