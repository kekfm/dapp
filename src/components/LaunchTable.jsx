import '../../globals.css';
import LaunchCard from './LaunchCard';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom'


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
        <div className="flex flex-row grid md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 flex-wrap gap-10 connectbox border-4 border-black bg-base-4 mt-40 p-10">
            {files.map((item, index) => (
                    <LaunchCard  key={index} data={item} />
            ))}
        </div>
    );
}
