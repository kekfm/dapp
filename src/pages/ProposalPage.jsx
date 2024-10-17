import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment/moment';
import "../../globals.css"
import { useEthers } from '@usedapp/core';


const ProposalDetail = () => {
  const { proposalId } = useParams(); // Get the proposalId from the route parameters
  const [proposal, setProposal] = useState(null);
  const [upvotes, setUpvotes] = useState(null)
  const [downvotes, setDownvotes] = useState(null)
  const [votes, setVotes] = useState(null)
  const [hasVoted, setHasVoted] = useState(false)
  const [status, setStatus] = useState(0)
  const [accepted, setAccepted] = useState(false)
  const [hasEnded, setHasEnded] = useState(false)


  const {library, account} = useEthers()
  const web3 = library

  const hub = "https://testnet.hub.snapshot.org"
  const client = new snapshot.Client712(hub)

  const castUpvote = async () => {
    setStatus(1) //pending
    try{
        const receipt = await client.vote(web3, account, {
            space: 'kektest.eth',
            proposal: proposalId,
            type: 'single-choice',
            choice: 1,
        });
        setStatus(2)//success
        console.log("upvote", receipt)
    }catch(e){
        setStatus(3)//fail
        console.log("error", e)
    }
    
  }

  const castDownvote = async () => {
    setStatus(1) //pending
    try{
        const receipt = await client.vote(web3, account, {
            space: 'kektest.eth',
            proposal: proposalId,
            type: 'single-choice',
            choice: 2,
        });
        setStatus(2)//success
        console.log("downvote", receipt)
    }catch(e){
        setStatus(3)//fail
        console.log("error", e)
    }
  }

  

  useEffect(() => {


    const fetchProposal = async () => {
      const query = `https://testnet.hub.snapshot.org/graphql?operationName=Proposal&query=query%20Proposal%20%7B%0A%20%20proposal(id%3A%22${proposalId}%22)%20%7B%0A%20%20%20%20id%0A%20%20%20%20title%0A%20%20%20%20body%0A%20%20%20%20choices%0A%20%20%20%20start%0A%20%20%20%20end%0A%20%20%20%20snapshot%0A%20%20%20%20state%0A%20%20%20%20author%0A%20%20%20%20space%20%7B%0A%20%20%20%20%20%20id%0A%20%20%20%20%20%20name%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D`;
      const response = await axios.get(query);
      setProposal(response.data.data.proposal);
      console.log("proposalPage data", response.data.data.proposal)

      const now = Math.floor(Date.now() / 1000)
      const end = response.data.data.proposal.end
      if(now - end >= 0){
        setHasEnded(true)
      }

    };

    const fetchVotes = async () => {
        const voteQuery = `https://testnet.hub.snapshot.org/graphql?operationName=Votes&query=query%20Votes%20%7B%0A%20%20votes%20(%0A%20%20%20%20first%3A%201000%0A%20%20%20%20skip%3A%200%0A%20%20%20%20where%3A%20%7B%0A%20%20%20%20%20%20proposal%3A%20%22${proposalId}%22%0A%20%20%20%20%7D%0A%20%20%20%20orderBy%3A%20%22created%22%2C%0A%20%20%20%20orderDirection%3A%20desc%0A%20%20)%20%7B%0A%20%20%20%20id%0A%20%20%20%20voter%0A%20%20%20%20created%0A%20%20%20%20proposal%20%7B%0A%20%20%20%20%20%20id%0A%20%20%20%20%7D%0A%20%20%20%20choice%0A%20%20%20%20space%20%7B%0A%20%20%20%20%20%20id%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D%0A`
        const voteResponse = await axios.get(voteQuery);
        setVotes(voteResponse.data.data.votes);
        console.log("vote data", voteResponse.data.data.votes)

        const vote = voteResponse.data.data.votes
        const upvotes = vote.filter((item) => (item.choice == 1))
        setUpvotes(upvotes)
        console.log("upvotes", upvotes)
        const downvotes = vote.filter((item) => (item.choice == 2))
        setDownvotes(downvotes)
        console.log("downvotes", downvotes)

        if(upvotes - downvotes > 0) {
            setAccepted(true)
        }
    }

    fetchProposal();
    fetchVotes()
  }, [proposalId]);

  useEffect(() => {
    if(votes && votes.length > 0){
        const countedVotes = votes.filter((item) => (item.voter == account))
        if(countedVotes.length > 0){
            setHasVoted(true)
        }
    }
  },[votes])



  if (!account) {
    return (<div className="flex font-basic font-bold text-3xl text-base-2 text-center justify-center pt-20">connect your wallet, bro!</div>)
  }

  if (!proposal) {
    return <div className="flex font-basic text-xl text-base-2 justify-center pt-20">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center w-full">
        <div className="pt-20 pb-10 font-basic font-bold text-4xl text-base-2">Proposal Page</div>
        <div className="flex flex-col justify-center px-10 py-10 connectbox border-2 border-black bg-base-5 max-w-[800px] font-basic">
            <div className=" font-bold text-4xl">{proposal.title}</div>
            <div className="py-2 px-4 bg-base-4 connectbox border-2 border-black mt-4 text-sm">{proposal.body}</div>
            <div className="pt-4 text-xs font-semibold">author: {proposal.author.slice(0,4)}...{proposal.author.slice(proposal.author.length-4, proposal.author.length)}</div>
            <div className="pt-2 text-xs font-semibold pb-10">
                ends: {moment.unix(proposal.end).format('YYYY-MM-DD HH:mm')}
            </div>
            <div className="flex flex-col connectbox border-2 border-black w-36 justify-center text-center bg-base-1">
                <div className="font-bold text-base-2 pb-2">
                    votes
                </div>
                <div className="flex flex-row px-2 gap-4 justify-center border border-black mx-2 mb-2 bg-base-4">
                    <div className="flex flex-col">
                        <span className="font-semibold text-sm">cool</span> <span>{upvotes.length > 0 ? upvotes.length : "0"}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-sm">booring</span> <span>{downvotes.length > 0 ? downvotes.length : "0"}</span>
                    </div>
                </div>

            </div>
            <div className="flex flex-row pt-10 pb-4 gap-4">
                <div onClick={castUpvote} className="connectbox border-4 border-black bg-base-2 px-2 font-semibold hover:scale-105 hover:cursor-pointer hover:bg-base-7">
                    cool
                </div>
                <div onClick={castDownvote} className="connectbox border-4 border-black bg-base-8 px-2 font-semibold hover:scale-105 hover:cursor-pointer hover:bg-base-11">
                    booooring
                </div>
                {
                    status == 1 && 
                        <div className="px-4 connectbox border-4 border-black bg-base-7 animate-pulse font-semibold">
                            votang...
                        </div>
                    
                }
                {
                    status == 2 && 
                        <div className="px-4 connectbox border-4 border-black bg-base-12 font-semibold">
                            success
                        </div>
                    
                }
                {
                    status == 3 && 
                        <div className="px-4 connectbox border-4 border-black bg-base-16 font-semibold">
                            fail
                        </div>
                    
                }
            </div>

            {hasVoted &&
                <div className="font-basic text-xs font-semibold connectbox border-2 border-black bg-base-7 px-2 w-40">
                    your vote has been cast!
                </div>
            }

            {  hasEnded && 
                accepted ? <div className="connectbox border-2 border-black font-basic font-semibold text-sm w-20 px-2 bg-base-12"> accepted </div> : <div className="connectbox border-2 border-black font-basic font-semibold text-sm w-20 px-2 bg-base-10"> rejected </div>
            }
        </div>
    </div>
    
  );
};

export default ProposalDetail;
