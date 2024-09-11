
import '../../../globals.css';
import { useEthers } from "@usedapp/core";



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

            {account && chainId === 97 &&
                <div onClick= {handleBoxDeact} className={`connectbox border-4 border-black px-8 py-2 bg-base-7 hover:scale-110 ease-in-out hover:cursor-pointer`}>
                    {`${account.slice(0,4)}...${account.slice(account.length -6, account.length)}`}
                </div>
            }
            {account && chainId !== 97 &&
                <div onClick= {handleBoxDeact} className={`connectbox border-4 border-black px-8 py-2 bg-base-8 hover:scale-110 ease-in-out hover:cursor-pointer`}>
                    Wrong Chain
                </div>
            }
        </div>
        
    )
}

