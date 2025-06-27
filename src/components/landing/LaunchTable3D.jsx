import '../../../globals.css';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from "socket.io-client";
import axios from 'axios';
import launches from "../../assets/launches.svg"
import { useAppKitAccount, useAppKitNetworkCore } from '@reown/appkit/react';
import { ethers } from 'ethers';
import * as THREE from 'three';

// 3D Launch Card Component
function LaunchCard3D({ position, data, onClick, wiggle, index }) {
    const meshRef = useRef();
    const [hovered, setHovered] = useState(false);
    
    useEffect(() => {
        if (wiggle && meshRef.current) {
            // Wiggle animation for 3D box
            const startTime = Date.now();
            const duration = 1000;
            
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = elapsed / duration;
                
                if (progress < 1 && meshRef.current) {
                    const wiggleAmount = Math.sin(progress * Math.PI * 10) * 0.1 * (1 - progress);
                    meshRef.current.rotation.z = wiggleAmount;
                    requestAnimationFrame(animate);
                } else if (meshRef.current) {
                    meshRef.current.rotation.z = 0;
                }
            };
            animate();
        }
    }, [wiggle]);

    // Calculate progress percentage
    const calculateProgress = () => {
        const {buys, sells} = data;
        const transactions = [...buys, ...sells];
        const filtered = transactions.filter((item, index, self) => 
            index === self.findIndex((t) => (t.maker === item.maker && t.timestamp === item.timestamp))
        );
        filtered.sort((a,b) => (b.timestamp - a.timestamp));
        const latest = filtered[0];
        
        if(latest){
            const soldTokens = (100000 - Number(ethers.formatEther(latest.contractTokenBalance)));
            return soldTokens / 75000 * 100;
        }
        return 0;
    };

    const progress = calculateProgress();
    
    // Use the same color logic as the original LaunchCard
    const getBoxColor = (index) => {
        if ((index / 3) % 1 === 0) {
            return '#bafca2'; // Light green
        } else if ((index / 2) % 1 === 0 && (index / 3) % 1 !== 0) {
            return '#7df9ff'; // Light blue
        } else {
            return '#ffb2ef'; // Light pink
        }
    };

    return (
        <group position={position}>
            {/* Main 3D Box */}
            <mesh
                ref={meshRef}
                onClick={() => onClick(data.tokenAddress)}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                scale={hovered ? 1.1 : 1}
            >
                <boxGeometry args={[2.8, 2, 0.3]} />
                <meshStandardMaterial 
                    color={wiggle ? '#bafca2' : getBoxColor(index)}
                    metalness={0.3}
                    roughness={0.4}
                />
                
                {/* Black border effect */}
                <mesh position={[0, 0, 0.16]}>
                    <boxGeometry args={[2.85, 2.05, 0.02]} />
                    <meshBasicMaterial color="#000000" />
                </mesh>
            </mesh>

            {/* HTML Content Overlay */}
            <Html
                transform
                position={[0, 0, 0.2]}
                distanceFactor={8}
                style={{ pointerEvents: 'none' }}
            >
                <div className="w-56 h-40 p-4 text-black font-basic text-xs bg-transparent">
                    {/* Token Logo */}
                    <div className="flex justify-center mb-2">
                        <div className="w-12 h-12 rounded-full border-2 border-black bg-white overflow-hidden">
                            {data.description?.logo ? (
                                <img 
                                    src={data.description.logo} 
                                    className="w-full h-full object-cover" 
                                    alt="logo"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                    <span className="text-xs">?</span>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Token Name */}
                    <div className="font-bold text-center mb-2 truncate">
                        {data.name}
                    </div>
                    
                    {/* Progress */}
                    <div className="text-center mb-2">
                        <div className="text-xs font-bold">
                            Progress: {progress.toFixed(1)}%
                        </div>
                        <div className="w-full bg-black h-1 mt-1">
                            <div 
                                className="bg-current h-1 transition-all duration-500"
                                style={{ width: `${Math.min(progress, 100)}%` }}
                            />
                        </div>
                    </div>
                    
                    {/* Description */}
                    <div className="text-xs text-center truncate">
                        {data.description?.des?.slice(0, 50)}...
                    </div>
                    
                    {/* Creator */}
                    <div className="text-xs text-center mt-1 text-gray-600">
                        by {data.owner?.slice(0,4)}...{data.owner?.slice(-4)}
                    </div>
                </div>
            </Html>
        </group>
    );
}

// 3D Scene Component
function Scene3D({ files, onCardClick }) {
    return (
        <>
            {/* Lighting */}
            <ambientLight intensity={0.6} />
            <directionalLight position={[10, 10, 5]} intensity={0.8} />
            <pointLight position={[-10, -10, -5]} intensity={0.3} />
            
            {/* 3D Launch Cards in Grid */}
            {files.map((item, index) => {
                const row = Math.floor(index / 4);
                const col = index % 4;
                const x = (col - 1.5) * 3.5;
                const y = -(row * 2.5);
                const z = 0;
                
                return (
                    <LaunchCard3D
                        key={item.tokenAddress}
                        position={[x, y, z]}
                        data={item}
                        onClick={onCardClick}
                        wiggle={item.wiggle}
                        index={index}
                    />
                );
            })}
            
            {/* Interactive Controls */}
            <OrbitControls 
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                maxPolarAngle={Math.PI / 2}
                minDistance={5}
                maxDistance={20}
            />
        </>
    );
}

export default function LaunchTable3D() {
    const [files, setFiles] = useState([]);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [max, setMax] = useState();
    const navigate = useNavigate();
    
    const { chainId } = useAppKitNetworkCore();
    const { address, isConnected } = useAppKitAccount();

    const handleCardClick = (tokenAddress) => {
        navigate(`/launch?token=${tokenAddress}`);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                let chain = chainId || 6666;
                const response = await axios.get(`${import.meta.env.VITE_GET_CREATED}${page}?chainId=${chain}`, {
                    withCredentials: true,
                });

                const data = response.data.data;
                const maxPages = response.data.totalPages;
                setMax(maxPages);
                setFiles(data);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Error fetching data.');
            }
        };

        fetchData();
    }, [page, chainId]);

    useEffect(() => {
        const socket = io(`${import.meta.env.VITE_SOCKET_IO}`, {
            path: '/socket.io/',
            transports: ['websocket', 'polling'],
            withCredentials: true,
        });
        
        socket.on("newBuyEvent", (data) => {
            setFiles((prevFiles) => {
                const updatedFiles = [...prevFiles];
                const index = updatedFiles.findIndex(item => item.tokenAddress === data.tokenAddress);
    
                if (index !== -1) {
                    const [boughtItem] = updatedFiles.splice(index, 1);
                    updatedFiles.unshift(boughtItem);
                    boughtItem.wiggle = true;
                }
    
                return updatedFiles;
            });
            
            // Reset wiggle after animation
            setTimeout(() => {
                setFiles((prevFiles) =>
                    prevFiles.map(item => ({
                        ...item,
                        wiggle: false
                    }))
                );
            }, 1000);
        });
    
        return () => {
            socket.disconnect();
        };
    }, []);

    if (error) return <p>{error}</p>;

    return (
        <div className="flex flex-col justify-center w-full">
            {/* Header */}
            <div className="flex justify-center mb-8">
                <img src={launches} className="w-[250px]" alt="launches" />
            </div>
            
            {/* 3D Canvas */}
            <div className="w-full h-[600px] bg-gradient-to-b from-blue-900 to-purple-900 rounded-lg border-4 border-black connectbox">
                <Canvas
                    camera={{ position: [0, 0, 12], fov: 60 }}
                    style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #7c3aed 100%)' }}
                >
                    <Scene3D files={files.slice(0, 12)} onCardClick={handleCardClick} />
                </Canvas>
            </div>
            
            {/* Pagination */}
            <div className="flex flex-row justify-center gap-2 mt-6">
                <div className="font-basic font-bold">{page}/{max || 1}</div>
            </div>
            
            {/* Instructions */}
            <div className="text-center mt-4 text-sm text-gray-600">
                🖱️ Click and drag to rotate • Scroll to zoom • Click cards to view
            </div>
        </div>
    );
} 