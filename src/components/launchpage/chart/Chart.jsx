import "/globals.css"
import { useEffect, useState, useRef } from "react";
import { ethers } from "ethers";
import { createChart } from "lightweight-charts";

export default function Chart({ data }) {
    const [seconds, setSeconds] = useState(60);
    const chartContainerRef = useRef();
    const lineSeriesRef = useRef();

    const formatEtherValue = (value) => {
        return parseFloat(ethers.utils.formatEther(value)).toFixed(18);
    };

    const toFixedWithoutScientific = (num, precision) => {
        return parseFloat(num.toFixed(precision));
    };

    useEffect(() => {
        if (!chartContainerRef.current) return;

        const chartOptions = {
            layout: {
                textColor: 'white',
                background: { type: 'solid', color: '#ff69b4' },
            },
            timeScale: {
                timeVisible: true,
                secondsVisible: false,
            },
            priceScale: {
                scaleMargins: {
                    top: 0.1,
                    bottom: 0.1,
                },
                borderVisible: true,
                mode: 2, // Logarithmic scale

            },
        
        };

        const chart = createChart(chartContainerRef.current, chartOptions);
        const lineSeries = chart.addLineSeries({
            color: '#fffb47',
            lineWidth: 6,
        });
        
        lineSeries.applyOptions({
            priceFormat: {
                type: 'price',
                precision: 12,
                minMove: 0.00000001,
            },
        });

        lineSeriesRef.current = lineSeries;
        chart.timeScale().fitContent();

        return () => chart.remove();  // Cleanup on unmount
    }, []);

    useEffect(() => {
        if (!lineSeriesRef.current) return;

        let grouped = {};
        data.forEach((tx) => {
            const period = Math.floor(tx.timestamp / seconds) * seconds;

            if (!grouped[period]) {
                grouped[period] = [];
            }

            grouped[period].push(tx);
            grouped[period].sort((a, b) => a.timestamp - b.timestamp);
        });

        let lineData = [];

        for (const per in grouped) {
            const transactions = grouped[per];

            const close = formatEtherValue(transactions[transactions.length - 1].lastTokenPrice);
            const formClose = close / 1e18

            lineData.push({
                time: parseInt(per, 10),
                value: toFixedWithoutScientific(parseFloat(formClose), 18),
            });
        }

        lineSeriesRef.current.setData(lineData);
        //console.log("lineData", lineData);

    }, [data, seconds]);


    return (
        <div className="flex flex-col justify-start">
            <div className="font-basic text-xl font-bold">
                chart
            </div>
            <div className="flex connectbox border-4 border-black bg-white p-4">
                <div ref={chartContainerRef} style={{ width: '700px', height: '300px' }}></div>
            </div>
        </div>
    );
}
