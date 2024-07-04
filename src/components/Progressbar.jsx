import '../../globals.css'
import { useState, useEffect } from 'react';


export default function Progressbar ({percentage}) {

    const [progressWidth, setProgressWidth] = useState('');


    const progressBarWidths = [
        'w-0', 'w-1/12', 'w-2/12', 'w-3/12', 'w-4/12', 'w-5/12', 'w-6/12',
        'w-7/12', 'w-8/12', 'w-9/12', 'w-10/12', 'w-11/12', 'w-full'
    ];
  useEffect(() => {
        const index = Math.floor((percentage / 100) * (progressBarWidths.length - 1));
        setProgressWidth(progressBarWidths[index]);
    }, [percentage]);

    return (
        <div className="progress-container border-2 mt-1 border-black bg-base-4 h-3 w-full">
            <div className={`progress-bar bg-base-12 border-1 border-black h-full ${progressWidth}`}></div>
        </div>
    )
}