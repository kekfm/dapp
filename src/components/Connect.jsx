
import '../../globals.css';
import { useEthers } from "@usedapp/core";



export const Connect = () => {



const {account, activateBrowserWallet, deactivate, chainId, switchNetwork} = useEthers()


    return(
        <div>
            {!account &&
                <div onClick= {activateBrowserWallet} className={` connectbox border-4 border-black mr-6 px-8 py-2 bg-base-2 hover:scale-110 ease-in-out hover:cursor-pointer`}>
                    connect
                </div>
            }

            {account && chainId === 97 &&
                <div onClick= {deactivate} className={` connectbox border-4 border-black mr-6 px-8 py-2 bg-base-7 hover:scale-110 ease-in-out hover:cursor-pointer`}>
                    {`${account.slice(0,4)}...${account.slice(account.length -6, account.length)}`}
                </div>
            }
            {account && chainId !== 97 &&
                <div onClick= {deactivate} className={` connectbox border-4 border-black mr-6 px-8 py-2 bg-base-8 hover:scale-110 ease-in-out hover:cursor-pointer`}>
                    Wrong Chain
                </div>
            }

        </div>
        
    )
}

