import "/globals.css";
import { useEffect, useState, useRef } from "react";
import { ethers } from "ethers";
import { createChart } from "lightweight-charts";

export default function Chart({ data }) {
    const [seconds, setSeconds] = useState(300);
    const chartContainerRef = useRef();
    const candlestickSeriesRef = useRef();
    const chartRef = useRef();

    const formatEtherValue = (value) => {
        return parseFloat(ethers.formatEther(value)).toFixed(18);
    };

    const toFixedWithoutScientific = (num, precision) => {
        return parseFloat(num.toFixed(precision));
    };

    const generate5MinIntervals = (startTime, endTime) => {
        const intervals = [];
        let currentTime = Math.floor(startTime / seconds) * seconds;

        while (currentTime <= endTime) {
            intervals.push(currentTime);
            currentTime += seconds;  // Add 5 minutes
        }

        return intervals;
    };

    // Resize handler
    const handleResize = () => {
        if (chartRef.current && chartContainerRef.current) {
            const containerWidth = chartContainerRef.current.clientWidth;
            const containerHeight = chartContainerRef.current.clientHeight;
            chartRef.current.applyOptions({ 
                width: containerWidth,
                height: containerHeight 
            });
        }
    };

    useEffect(() => {
        if (!chartContainerRef.current) return;

        const containerWidth = chartContainerRef.current.clientWidth;
        const containerHeight = chartContainerRef.current.clientHeight;

        const chartOptions = {
            layout: {
                textColor: 'white',
                background: { type: 'solid', color: '#000000' },
            },
            timeScale: {
                timeVisible: true,
                secondsVisible: true,
                rightOffset: 12,
                barSpacing: Math.max(6, Math.floor(containerWidth / 100)), // Dynamic bar spacing
                fixLeftEdge: false,
                fixRightEdge: false,
            },
            priceScale: {
                scaleMargins: {
                    top: 0.1,
                    bottom: 0.1,
                },
                borderVisible: true,
                mode: 2, // Logarithmic scale
            },
            crosshair: {
                mode: 1, // Normal crosshair
            },
            grid: {
                vertLines: {
                    color: '#333333',
                },
                horzLines: {
                    color: '#333333',
                },
            },
        };

        const chart = createChart(chartContainerRef.current, {
            width: containerWidth,
            height: containerHeight,
            ...chartOptions
        });
            
        const candlestickSeries = chart.addCandlestickSeries({
            upColor: '#2FFF2F',    // Green for up candles
            downColor: '#ff0000',  // Red for down candles
            borderUpColor: '#2FFF2F',
            borderDownColor: '#ff0000',
            wickUpColor: '#2FFF2F',
            wickDownColor: '#ff0000',
            priceFormat: {
                type: 'price',
                precision: 8,  // Set precision to 8 decimals
                minMove: 0.00000001,  // Minimum move should match the smallest precision
            }
        });

        candlestickSeriesRef.current = candlestickSeries;
        chartRef.current = chart;
        
        // Add resize listener
        window.addEventListener('resize', handleResize);
        
        chart.timeScale().fitContent();

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, []);

    useEffect(() => {
        if (!candlestickSeriesRef.current) return;
    
        let grouped = {};
        data.forEach((tx) => {
            const period = Math.floor(tx.timestamp / seconds) * seconds;
    
            if (!grouped[period]) {
                grouped[period] = [];
            }
    
            grouped[period].push(tx);
            grouped[period].sort((a, b) => a.timestamp - b.timestamp);
        });
    
        let candlestickData = [];
        let previousClose = null; // Keep track of the previous closing price
    
        for (const per in grouped) {
            const transactions = grouped[per];
            const firstTx = transactions[0];
            const lastTx = transactions[transactions.length - 1];
    
            // Calculate open, high, low, close for this period
            const open = previousClose !== null ? previousClose : formatEtherValue(firstTx.lastTokenPrice); // Use previous close as open if available
            const close = formatEtherValue(lastTx.lastTokenPrice);
            const high = formatEtherValue(Math.max(...transactions.map(tx => tx.lastTokenPrice)));
            const low = formatEtherValue(Math.min(...transactions.map(tx => tx.lastTokenPrice)));
    
            candlestickData.push({
                time: parseInt(per, 10),
                open: toFixedWithoutScientific(parseFloat(open), 18),
                high: toFixedWithoutScientific(parseFloat(high), 18),
                low: toFixedWithoutScientific(parseFloat(low), 18),
                close: toFixedWithoutScientific(parseFloat(close), 18),
            });
    
            // Update previous close for the next period
            previousClose = close;
        }
    
        candlestickSeriesRef.current.setData(candlestickData);
        
        // Auto-fit content after data update
        if (chartRef.current) {
            chartRef.current.timeScale().fitContent();
        }
    
    }, [data, seconds]);
    

    return (
        <div className="flex flex-col w-full">
            <div className="connectbox border-4 border-black bg-black w-full h-64 sm:h-80 lg:h-96 xl:h-[500px]">
                <div ref={chartContainerRef} className="w-full h-full p-2">
                </div>
            </div>
        </div>
    );
}
