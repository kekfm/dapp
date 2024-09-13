import "/globals.css";
import { useEffect, useState, useRef } from "react";
import { ethers } from "ethers";
import { createChart } from "lightweight-charts";

export default function Chart({ data }) {
    const [seconds, setSeconds] = useState(300);
    const chartContainerRef = useRef();
    const candlestickSeriesRef = useRef();

    const formatEtherValue = (value) => {
        return parseFloat(ethers.utils.formatEther(value)).toFixed(18);
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

    useEffect(() => {
        if (!chartContainerRef.current) return;

        const chartOptions = {
            layout: {
                textColor: 'white',
                background: { type: 'solid', color: '#00000' },
            },
            timeScale: {
                timeVisible: true,
                secondsVisible: true,
                rightOffset: 12, // Adds space on the right to zoom out a bit
                barSpacing: 6,
            },
            priceScale: {
                scaleMargins: {
                    top: 0.000001,
                    bottom: 0.000001,
                },
                borderVisible: true,
                mode: 2, // Logarithmic scale
            },
        };

        const chart = createChart(chartContainerRef.current, {
            width: chartContainerRef.current.clientWidth,
            height: 300,
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
        chart.timeScale().fitContent();

        return () => chart.remove();  // Cleanup on unmount
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
        //console.log("candlestickData", candlestickData);
    
    }, [data, seconds]);
    

    return (
        <div className="flex flex-col justify-start">
            <div className="font-basic text-xl font-bold">chart</div>
            <div className="flex connectbox border-4 border-black bg-white p-4">
                <div ref={chartContainerRef} style={{ width: '700px', height: '300px' }}></div>
            </div>
        </div>
    );
}
