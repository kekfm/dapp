import '../../../globals.css';
import LaunchCard from './LaunchCard';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom'
import launches from "../../assets/launches.svg"
import { io } from "socket.io-client"
import left from "../../assets/left.svg"
import right from "../../assets/right.svg"
import connect from "../../assets/please_connect.svg"
import supported from "../../assets/supported.svg"
import empty from "../../assets/emptiness.svg"
import bnb from "../../assets/bnb_.png"
import modulus from "../../assets/modulus_.png"
import base from "../../assets/base_.png"
import sonic from "../../assets/sonic_.png"
import { supportedChainIds } from '../../helpers/chains';

import { useAppKit, useAppKitAccount } from '@reown/appkit/react';
import { useAppKitNetworkCore } from '@reown/appkit/react';


export default function LaunchTable() {
    const [files, setFiles] = useState([]);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1)
    const [max, setMax] = useState()
    const [selectedChainFilter, setSelectedChainFilter] = useState('all'); // New state for chain filter
    const [searchTerm, setSearchTerm] = useState(''); // New state for search

    const { chainId } = useAppKitNetworkCore();
    const { address, isConnected } = useAppKitAccount();

    // Chain filter options
    const chainOptions = [
        { id: 'all', name: 'All Chains', icon: null },
        { id: 97, name: 'BSC', icon: bnb },
        { id: 6666, name: 'Modulus', icon: modulus },
        { id: 8453, name: 'Base', icon: base },
        { id: 57054, name: 'Sonic', icon: sonic }
    ];

    // Filter files based on selected chain and search term
    const filteredFiles = files.filter(item => {
        // Debug: log the first item to see the actual structure
        if (files.length > 0 && files.indexOf(item) === 0) {
            console.log("First item structure:", item);
            console.log("Available keys:", Object.keys(item));
        }
        
        // Try different possible chainId field names
        const itemChainId = item.chainId || item.chain_id || item.chainID || item.chain;
        const matchesChain = selectedChainFilter === 'all' || 
            itemChainId === selectedChainFilter || 
            parseInt(itemChainId) === selectedChainFilter ||
            itemChainId?.toString() === selectedChainFilter?.toString();
            
        const matchesSearch = searchTerm === '' || 
            item.name?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.symbol?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.description && typeof item.description === 'string' ? item.description.toLowerCase().includes(searchTerm.toLowerCase()) : false);
        return matchesChain && matchesSearch;
    });

    //console.log("chainId", chainId)

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

    const handleChange = (chain) =>{
        switchNetwork(chain)
    }

    const handleChainFilter = (chainId) => {
        setSelectedChainFilter(chainId);
        setPage(1); // Reset to first page when filtering
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setPage(1); // Reset to first page when searching
    };

    // Extract fetchData function for reuse
    const fetchData = async () => {
        try {
            let chain
            if(!chainId){
                chain = 6666
            }
            if(chainId){
                chain = chainId
            }

            //const response = await axios.get(`https://kek.fm/api/getCreated/${page}?chainId=${chain}`, { // old implementation using vps
            const response = await axios.get(`${import.meta.env.VITE_GET_CREATED}${page}?chainId=${chain}`, { // new implementation using render

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
   
    // Initial data fetch
    useEffect(() => {
        fetchData();
    }, [page, chainId]);

    // Socket effect for buy events
    useEffect(() => {
       // const socket = io('https://kek.fm', { // old implementation with vps
          const socket = io(`${import.meta.env.VITE_SOCKET_IO}`, { // old implementation with vps

            path: '/socket.io/',
            transports: ['websocket', 'polling'], // Allow both transports
            withCredentials: true,
        });
        
        socket.on("newBuyEvent", (data) => {
            console.log("new buy event", data);
    
            setFiles((prevFiles) => {
                return prevFiles.map(item => {
                    if (item.tokenAddress === data.tokenAddress) {
                        return {
                            ...item,
                            wiggle: true,
                            flashGreen: true // Add green flash effect
                        };
                    }
                    return item;
                });
            });
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    // Effect to reset wiggle and green flash after 1 second
    useEffect(() => {
        const timer = setTimeout(() => {
            setFiles((prevFiles) =>
                prevFiles.map(item => ({
                    ...item,
                    wiggle: false,
                    flashGreen: false
                }))
            );
        }, 1000);

        return () => clearTimeout(timer);
    }, [files.some(item => item.wiggle || item.flashGreen)]);

    // Auto-refetch data every 20 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            console.log("Auto-refetching data...");
            fetchData();
        }, 20000); // 20 seconds

        return () => clearInterval(interval);
    }, [page, chainId]); // Dependencies to refetch when page or chain changes
    

    if (error) return <p>{error}</p>;

    if(!address && !chainId) {
        return(
            <div className="flex justify-center">
                <img src={connect} alt="image"></img>
            </div>
        )
    }

    //if (account && (chainId != 97 && chainId != 8453 && chainId != 6666)) {
    if (!supportedChainIds.includes(chainId)) {
        return(
            <div className="flex flex-col justify-center">
                <div className="flex justify-center">
                    <img src={supported} alt="image"></img>
                </div>
                <div className="flex flex-row justify-center gap-4 p-4 ">
                    <img onClick={() => handleChange(97)} className="w-[50px] hover:scale-110 hover:cursor-pointer" src={bnb} alt="image"></img>
                    <img onClick={() => handleChange(6666)} className="w-[50px] hover:scale-110 hover:cursor-pointer" src={modulus} alt="image"></img>
                    <img onClick={() => handleChange(8453)} className="w-[50px] hover:scale-110 hover:cursor-pointer" src={base} alt="image"></img>
                </div>
            </div>
            
        )
    }

    if(supportedChainIds.includes(chainId) && filteredFiles.length == 0 && files.length > 0){
        return(
            <div className="flex flex-col justify-center w-full">
                <div className="flex justify-center">
                    <img src={launches} className="flex pb-4 w-[250px]"></img>
                </div>
                
                {/* Filter Controls */}
                <div className="flex flex-col items-center sm:items-start gap-2 sm:gap-4 mb-4 sm:mb-6 sm:ml-10">
                    {/* Search Input */}
                    <div className="flex justify-center sm:justify-start">
                                                <input
                                type="text"
                                placeholder="Search tokens..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="px-2 py-1 sm:px-3 sm:py-1.5 border border-black connectbox focus:outline-none w-48 sm:w-56 text-sm"
                            />
                    </div>
                    
                    {/* Chain Filter Buttons */}
                    <div className="flex flex-row gap-1 sm:gap-2 flex-wrap justify-center sm:justify-start">
                        {chainOptions.map((option) => (
                            <button
                                key={option.id}
                                onClick={() => handleChainFilter(option.id)}
                                className={`flex items-center gap-0.5 sm:gap-1 px-1.5 py-0.5 sm:px-2 sm:py-1 connectbox font-basic font-bold transition-all duration-200 text-xs sm:text-sm ${
                                    selectedChainFilter === option.id
                                        ? 'bg-base-12 text-white scale-105'
                                        : 'bg-base-12 text-gray-700 hover:bg-base-12 hover:scale-105'
                                }`}
                            >
                                {option.icon && (
                                    <img src={option.icon} alt={option.name} className="w-3 h-3 sm:w-4 sm:h-4" />
                                )}
                                {option.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-row justify-center">
                    <img src={empty} alt="empty"></img>
                </div>
            </div>
        )
    }

    if(supportedChainIds.includes(chainId) && files.length == 0){
        return(
            <div className="flex flex-row justify-center">
                <img src={empty} alt="empty"></img>
            </div>
        )
    }

    return (
        <div className="flex flex-col justify-center w-full">
                {/* Filter Controls */}
                <div className="flex flex-col items-center sm:items-start gap-2 sm:gap-4 mb-4 sm:mb-6 sm:ml-10">
                    {/* Search Input */}
                    <div className="flex justify-center sm:justify-start">
                        <input
                            type="text"
                            placeholder="Search tokens..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="px-2 py-1 sm:px-3 sm:py-1.5 border-2 border-black connectbox focus:outline-none w-48 sm:w-56 text-sm"
                        />
                    </div>
                    
                    {/* Chain Filter Buttons */}
                    <div className="flex flex-row gap-1 sm:gap-2 flex-wrap justify-center sm:justify-start">
                        {chainOptions.map((option) => (
                            <button
                                key={option.id}
                                onClick={() => handleChainFilter(option.id)}
                                className={`flex items-center gap-0.5 sm:gap-1 px-1.5 py-0.5 sm:px-2 sm:py-1 border-2 border-black connectbox font-basic font-bold transition-all duration-200 text-xs sm:text-sm ${
                                selectedChainFilter === option.id
                                    ? 'bg-base-16 text-white scale-105'
                                    : 'bg-base-11 text-gray-700 hover:bg-base-12 hover:scale-105'
                            }`}
                        >
                            {option.icon && (
                                <img src={option.icon} alt={option.name} className="w-3 h-3 sm:w-4 sm:h-4" />
                            )}
                                {option.name}
                            </button>
                        ))}
                    </div>
                </div>

            <div className="flex flex-col items-center min-h-[500px]">
                <div className="flex flex-row flex-wrap gap-10 sm:bg-base- sm:p-10 justify-center sm:w-11/12 sm:max-w-[1400px] sm:overflow-x-auto">
                    {filteredFiles.map((item, index) => (
                        <LaunchCard key={index} tag={index} data={item} />
                    ))}
                </div>
            </div>
            <div className="flex flex-row justify-center gap-2 mt-6">
                {page == 1 ? "" :<img onClick={handleDown} src={left} className="hover:cursor-pointer"></img>}
                <div className="font-basic font-bold content-center">{page}/{max}</div>
                {page == max ? "" : <img onClick={handleUp} src={right} className="hover:cursor-pointer"></img>}
            </div>
        </div>
    )
}


