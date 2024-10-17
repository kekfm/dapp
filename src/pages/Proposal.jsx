import { useState, useEffect } from 'react';
import { useEthers,useBlockNumber } from '@usedapp/core';
import "../../globals.css"
import ProposalSuccessModal from '../components/dao/ProposalSuccessModal';




export default function Proposal () {


    const [title, setTitle] = useState("")
    const [proposal, setProposal] = useState("")
    const [errors, setErrors] = useState({})
    const [status, setStatus] = useState(0)//#endregion
    const [isOpen, setIsOpen] = useState(false)
    const [tx, setTx] = useState({})


    const hub = 'https://testnet.hub.snapshot.org'; // or https://testnet.hub.snapshot.org for testnet
    const client = new snapshot.Client712(hub);
    
    const {chainId, account, library} = useEthers()
    const blockNumber = useBlockNumber()
    const web3 = library;

    //console.log("chainid", chainId)
    //console.log("account", account)
    //console.log("web3", web3)





    const closeModal = () =>{
        setIsOpen(false)
    }
    const handleTitleChange = (e) => {
        setTitle(e.target.value)
    }

    const handleProposalChange = (e) => {
        setProposal(e.target.value)
    }

    const submitProposal = (e) => {
        e.preventDefault()

        if (!library) {
            console.log("Library is not available, web3 might not be initialized");
            return;
        }

        if (validateForm()){
            try{
                const twoDaysInSeconds = 2 * 24 * 60 * 60;
                let values = {}
    
                values.startTime = Math.floor(Date.now() / 1000);
                values.endTime = values.startTime + twoDaysInSeconds
                values.title = title
                values.proposal = proposal
                values.block = blockNumber
                values.choices = ["cool", "boring"]

                console.log("values", values)

                createProposal(values)

            }catch(e){console.log("error",e)}
            
            
        }
    }

    const validateForm = () => {
        let newErrors = {}

        if(title.length < 3) {newErrors.title = "title cannot be empty"}
        if(proposal.length < 100) {newErrors.proposal = "proposal text has to be at least 100 characs"}

        setErrors(newErrors)

        return Object.keys(newErrors).length === 0

    }
    
    const createProposal = async (values) => {
        setStatus(1)
        try{
            const receipt = await client.proposal(web3, account, {
                space: 'kektest.eth',
                type: 'single-choice', // define the voting system
                title: values.title,
                body: values.proposal,
                choices: values.choices,
                start: values.startTime,
                end: values.endTime,
                snapshot: values.blockNumber,
                plugins: JSON.stringify({}),
                app: 'kek_test' // provide the name of your project which is using this snapshot.js integration
            });
            console.log("receipt", receipt)
            setStatus(2)
            setTx(receipt)
            setTitle("")
            setProposal("")
            setIsOpen(true)

        }catch(e){
            setStatus(3)
            console.log("error", e)

        }

    }




   /* if(chainId != 1){
        return(
            <div className="flex justify-center pt-20 font-basic font-bold">
                please connect to ETH Mainnet
            </div>
        )
        
    }*/
    
    if(chainId == 1 || chainId == 11155111){
        return(
            <div className="flex justify-center pt-20">
                <ProposalSuccessModal isOpen={isOpen} receipt={tx} closeModal={closeModal}/>
                <form className={`connectbox border-4 border-black bg-base-4 py-2 pl-4 sm:pl-10 pr-4 sm:pr-20 h-auto content-center w-5/6 max-w-[700px] z-0`}
                    name="propose"
                    onSubmit={submitProposal}
                >
                    <div className={`font-bold pb-8 pt-2 text-xl`}>
                        describe your proposal
                    </div>
                    <div className={`flex flex-col justify-between py-3`}>
                    <label className={`font-basic font-semibold`} htmlFor="title">title</label>
                        <input className="border-2 border-black px-1 text-sm"
                            placeholder="title"
                            type="text"
                            id="title"
                            name="title"
                            onChange={handleTitleChange}
                            value={title}
                        >
                        </input>
                    {errors && errors.title && <span className={`font-basic text-base-8 text-xs`}>{errors.title}</span>}
                    </div>
                    <div className={`flex flex-col justify-between py-3`}>
                        <label className={`font-basic font-semibold`} htmlFor="description">proposal text</label>
                        <textarea className="flex border-2 border-black px-1 text-sm min-h-32 h-auto w-auto"
                            placeholder="proposal text"
                            type="text"
                            id="description"
                            name="description"
                            onChange={handleProposalChange}
                            value={proposal}
                        >
                        </textarea>
                        {errors && errors.proposal && <span className={`font-basic text-base-8 text-xs`}>{errors.proposal}</span>}
                    </div>
                    {(status == 0) &&
                        <div className="flex flex-row justify-end gap-8 py-4">
                            <button type="submit" className={`font-basic font-semibold connectbox border-4 border-black bg-base-7 py-2 px-8 hover:-translate-y-2 delay-50 hover:scale-110 ease-in-out hover:cursor-pointer`}> propose </button>
                        </div>
                    }
                    {(status == 1) && 
                        <div className="flex flex-row justify-end gap-8 py-4">
                            <button className={`font-basic font-semibold connectbox border-4 border-black bg-base-2 py-2 px-8  delay-50  animate-pulse`} disabled> pending... </button>
                        </div>
                    }
                    {(status == 2) && 
                        <div className="flex flex-row justify-end gap-8 py-4">
                            <button className={`font-basic font-semibold connectbox border-4 border-black bg-base-12 py-2 px-8  delay-50  `} disabled> success </button>
                        </div>
                    }
                     {(status == 3) && 
                        <div className="flex flex-row justify-end gap-8 py-4">
                            <button className={`font-basic font-semibold connectbox border-4 border-black bg-base-8 py-2 px-8   ease-in-out `} disabled> error </button>
                        </div>
                    }
                </form>
            </div>
        )
    }
    
}



