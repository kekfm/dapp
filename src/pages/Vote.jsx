import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEthers, useBlockNumber } from '@usedapp/core';
import "../../globals.css";
import axios from 'axios';
import moment from 'moment/moment';

export default function Vote() {

    const navigate = useNavigate()
    const [data, setData] = useState([]);

    const query = "https://testnet.hub.snapshot.org/graphql?operationName=Proposals&query=query%20Proposals%20%7B%0A%20%20proposals%20(%0A%20%20%20%20first%3A%201000%2C%0A%20%20%20%20skip%3A%200%2C%0A%20%20%20%20where%3A%20%7B%0A%20%20%20%20%20%20space_in%3A%20%5B%22kektest.eth%22%5D%2C%0A%20%20%20%20%7D%2C%0A%20%20%20%20orderBy%3A%20%22created%22%2C%0A%20%20%20%20orderDirection%3A%20desc%0A%20%20)%20%7B%0A%20%20%20%20id%0A%20%20%20%20title%0A%20%20%20%20body%0A%20%20%20%20choices%0A%20%20%20%20start%0A%20%20%20%20end%0A%20%20%20%20snapshot%0A%20%20%20%20state%0A%20%20%20%20author%0A%20%20%20%20space%20%7B%0A%20%20%20%20%20%20id%0A%20%20%20%20%20%20name%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D";

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        const response = await axios.get(query);
        setData(response.data.data.proposals);
        console.log("data", response.data.data.proposals);
    };

    const handleClick = (item) => {
        navigate(`/dao/vote/${item.id}`)
        console.log("id", item.id)
    }
 
    return (
        <div className="justify-center text-center pt-20">
            <div className="font-basic font-bold text-4xl">
                kek proposals
            </div>
            <div className="flex flex-wrap gap-4 justify-center pt-10">
                {data.map((item, index) => {
                    const now = Math.floor(Date.now() / 1000); // Current Unix timestamp in seconds
                    const timeLeftInSeconds = item.end - now; // Difference in seconds
                    const timeLeftInHours = Math.floor(timeLeftInSeconds / 3600); // Convert seconds to hours
                    return (
                        <div onClick={() => handleClick(item)} className="flex flex-col connectbox border-4 border-black bg-base-2 font-basic max-w-52 px-4 py-2 hover:cursor-pointer hover:scale-110 hover:bg-base-5" key={index}>
                            <div className="flex flex-col text-start"> 
                                <span className="font-semibold">{item.title.slice(0, 15)}</span>
                                <div className="text-sm connectbox border-2 border-black bg-white">
                                    {item.body.slice(0, 100)}
                                </div>
                                <div className="flex flex-row justify-between">
                                    <div className="flex flex-col text-xs pt-2 font-semibold">
                                       <span>by</span>  <span className="text-base-6">{item.author.slice(0, 4)}...{item.author.slice(item.author.length - 4, item.author.length)}</span>
                                    </div>
                                    <div className="flex flex-col text-xs pt-2 font-semibold">
                                        <span>ends in</span> <span className="text-base-6">{timeLeftInHours > 0 ? `${timeLeftInHours} hours` : 'ended'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
