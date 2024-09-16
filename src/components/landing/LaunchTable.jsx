import '../../../globals.css';
import LaunchCard from './LaunchCard';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom'
import launches from "../../assets/launches.svg"
import { io } from "socket.io-client"
import left from "../../assets/left.svg"
import right from "../../assets/right.svg"
import { useEthers} from "@usedapp/core";




export default function LaunchTable() {
    const [files, setFiles] = useState([]);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1)
    const [max, setMax] = useState()

    const {chainId} = useEthers()

    const handleUp = () =>{
        if(page != max){
            setPage(page +1)
            console.log("page", page)
        }
        
    }

    const handleDown = ()  =>{
        if(page > 1){
            setPage(page -1)
            console.log("page", page)
        }
    }
   
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                let chain
                if(!chainId){
                    chain = 97
                }
                if(chainId){
                    chain = chainId
                }

                //const response = await axios.get(`https://kek.fm/api/getCreated/${page}?chainId=${chain}`, { // old implementation using vps
                const response = await axios.get(`https://indexer-rx9n.onrender.com/api/getCreated/${page}?chainId=${chain}`, { // new implementation using render

                    withCredentials: true,
                });

                const data = response.data.data;
                const maxPages = response.data.totalPages
                setMax(maxPages)
                setFiles(data);
                console.log("data launchtable", data)


               /*const uniqueData = data.filter((item, index, self) => index === self.findIndex((t) => (
                    t.tokenAddress === item.tokenAddress
                )))*/

                //uniqueData.sort((a,b) => b.timestamp-a.timestamp)

                /*if (Array.isArray(data)) {
                    // If des field needs parsing, do it here
                    const parsedData = data.map(item => ({
                        ...item,
                        d: item.description // Assuming des is a JSON string
                    }));
                    setFiles(parsedData);
                    console.log("parsed data", parsedData)
                } else {
                    console.error('Expected data to be an array, but received:', data);
                    setError('Invalid data format received.');
                }*/

            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Error fetching data.');
            }
        };

        fetchData();
    }, [page, chainId]); // Empty dependency array ensures this effect runs once on mount

    useEffect(() => {
       // const socket = io('https://kek.fm', { // old implementation with vps
          const socket = io('https://indexer-rx9n.onrender.com', { // old implementation with vps

            path: '/socket.io/',
            transports: ['websocket', 'polling'], // Allow both transports
            withCredentials: true,
        });
        
        socket.on("newBuyEvent", (data) => {
            console.log("new buy event", data);
    
            setFiles((prevFiles) => {
                const updatedFiles = [...prevFiles];
                const index = updatedFiles.findIndex(item => item.tokenAddress === data.tokenAddress);
    
                if (index !== -1) {
                    const [boughtItem] = updatedFiles.splice(index, 1); // Remove the bought item from its current position
                    updatedFiles.unshift(boughtItem); // Add it to the front of the array
                    boughtItem.wiggle = true; // Mark it for wiggling
                }
    
                return updatedFiles;
            });
        });

        setTimeout(() => {
            setFiles((prevFiles) =>
                prevFiles.map(item => ({
                    ...item,
                    wiggle: false // Reset wiggle and background color after animation
                }))
            );
        }, 1000);
    
        return () => {
            socket.disconnect();
        };
    }, []);
    

    if (error) return <p>{error}</p>;

    return (
        <div className="flex flex-col justify-center w-full">
             <div className="flex justify-center">
                <img src={launches} className="flex pb-4 w-[250px]"></img>
            </div>
            <div className="flex flex-col items-center min-h-[500px] ">
                <div className="flex flex-row flex-wrap gap-10 sm:bg-base- sm:p-10 justify-center sm:w-11/12 sm:max-w-[1400px] sm:overflow-x-auto">
                    {files.map((item, index) => (
                        <LaunchCard key={index} tag={index} data={item} />
                    ))}
                </div>
            </div>
            <div className="flex flex-row justify-center gap-2">
                {page == 1 ? "" :<img onClick={handleDown} src={left} className="hover:cursor-pointer"></img>}
                <div className="font-basic font-bold content-center">{page}/{max}</div>
                {page == max ? "" :<img onClick={handleUp} src={right} className="hover:cursor-pointer"></img>}


            </div>
        </div>
    );
}


