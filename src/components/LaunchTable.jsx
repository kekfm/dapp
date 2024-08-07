import '../../globals.css';
import LaunchCard from './LaunchCard';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom'
import launches from "../assets/launches.svg"


export default function LaunchTable() {
    const [files, setFiles] = useState([]);
    const [error, setError] = useState(null);

   

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://103.26.10.88/api/getCreated', {
                    withCredentials: true,
                    timeout: 5000 // Adjust the timeout value as needed
                });

                const data = response.data;

                const uniqueData = data.filter((item, index, self) => index === self.findIndex((t) => (
                    t.tokenAddress === item.tokenAddress
                )))

               


                if (Array.isArray(uniqueData)) {
                    setFiles(uniqueData);
                } else {
                    console.error('Expected data to be an array, but received:', uniqueData);
                    setError('Invalid data format received.');
                }



            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Error fetching data.');
            }
        };

        fetchData();
    }, []); // Empty dependency array ensures this effect runs once on mount

    if (error) return <p>{error}</p>;

    return (
        <div className="flex flex-col justify-center w-full">
             <div className="flex justify-center">
                <img src={launches} className="flex pb-4 w-[250px]"></img>
            </div>
            <div className="flex flex-col items-center min-h-screen ">
                <div className="flex flex-row flex-wrap gap-10 sm:bg-base- sm:p-10 justify-center sm:w-11/12 sm:max-w-[1400px] sm:overflow-x-auto">
                    {files.map((item, index) => (
                        <LaunchCard key={index} tag={index} data={item} />
                    ))}
                </div>
            </div>
        </div>
    );
}


