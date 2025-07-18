import '../../../globals.css'


export default function Progressbar ({percentage}) {

    // Calculate precise width as percentage, ensuring minimum visible width for small values
    const getProgressWidth = () => {
        if (percentage <= 0) return '0%';
        if (percentage >= 100) return '100%';
        
        // For very small percentages, ensure at least 2% visibility
        const minVisibleWidth = 2;
        const adjustedPercentage = percentage < minVisibleWidth ? minVisibleWidth : percentage;
        
        return `${Math.min(adjustedPercentage, 100)}%`;
    };

    return (
        <div className="progress-container border-2 mt-1 border-black bg-base-4 h-3 w-2/4 max-w-[200px]">
            <div 
                className="progress-bar bg-base-12 border-1 border-black h-full transition-all duration-300 ease-out"
                style={{ width: getProgressWidth() }}
            ></div>
        </div>
    )
}