import "../../../globals.css"
import tear1 from "../../assets/tear1.png"
import tear2 from "../../assets/tear2.png"
import tear3 from "../../assets/tear3.png"
import { useState, useEffect } from 'react'

// Dripping Tear Component
const DrippingTear = ({ tearSrc, delay, duration }) => {
    return (
        <img 
            src={tearSrc} 
            className="fixed w-4 h-6  pointer-events-none"
            style={{
                left: `${Math.random() * 80 + 10}px`, // Drip from left side area (10-90px from left)
                top: '150px', // Start right below the marquee bar (4px top border + 40px height + 4px bottom border = 48px)
                animationDelay: `${delay}ms`,
                animationDuration: `${duration}ms`,
                zIndex: 10,
                animation: `drip ${duration}ms ease-in forwards`
            }}
            alt="tear"
        />
    );
};

// CSS-in-JS animation styles for dripping
const tearAnimationStyles = `
  @keyframes drip {
    0% {
      transform: translateY(0px);
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    90% {
      opacity: 1;
    }
    100% {
      transform: translateY(120px);
      opacity: 0;
    }
  }
`;

export default function MarqueeBanner() {
    const [showTears, setShowTears] = useState(false);
    const [tearCount, setTearCount] = useState(0);
    
    const tearImages = [tear1, tear2, tear3];

    useEffect(() => {
        // Inject CSS animation styles
        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = tearAnimationStyles;
        document.head.appendChild(styleSheet);

        // Tears dripping every 10 seconds
        const tearInterval = setInterval(() => {
            setShowTears(true);
            setTearCount(prev => prev + 1);
            
            // Hide after animation completes (3 seconds)
            setTimeout(() => {
                setShowTears(false);
            }, 3000);
        }, 10000); // Every 10 seconds

        return () => {
            clearInterval(tearInterval);
            document.head.removeChild(styleSheet);
        };
    }, []);
    return (
      <div className="border-t-4 border-b-4 border-black h-10 flex items-center bg-base-5 relative">
        {/* Dripping Tears Effect */}
        {/*showTears && (
            <>
                {[...Array(3)].map((_, index) => (
                    <DrippingTear 
                        key={`${tearCount}-${index}`} // Unique key for each animation
                        tearSrc={tearImages[index]} // Use tear1, tear2, tear3 in order
                        delay={index * 500} // Stagger the dripping (500ms apart)
                        duration={2000 + Math.random() * 500} // Random duration between 2-2.5s
                    />
                ))}
            </>
        )*/}

        <div className=" marquee border-t-4 border-b-4 border-base-4">
          <div className="marquee-content font-basic text-sm text-black">
            <span><span className="font-bold">+++ BREAKANG NEWS +++</span>  kek is now live on Modulus-Testnet <span className="font-bold">+++ partnership: </span> kek & wenpad join under the hat of $WOT <span className="font-bold">+++ launch: </span> kek and wenpad to launch $WOT protocol token soon! </span> <span className="font-bold">+++ kek-CEO:</span> <span>it´s time to kick ass and chew bubble gum, and I am all out of gum...</span>
            <span><span className="font-bold">+++ BREAKANG NEWS +++</span>  kek is now live on Modulus-Testnet <span className="font-bold">+++ partnership: </span> kek & wenpad join under the hat of $WOT <span className="font-bold">+++ launch: </span> kek and wenpad to launch $WOT protocol token soon! </span> <span className="font-bold">+++ kek-CEO:</span> <span>it´s time to kick ass and chew bubble gum, and I am all out of gum...</span>
          </div> 
          <div className="marquee-content font-basic text-sm text-black">
          <span><span className="font-bold">+++ BREAKANG NEWS +++</span>  kek is now live on Modulus-Testnet <span className="font-bold">+++ partnership: </span> kek & wenpad join under the hat of $WOT <span className="font-bold">+++ launch: </span> kek and wenpad to launch $WOT protocol token soon! </span> <span className="font-bold">+++ kek-CEO:</span> <span>it´s time to kick ass and chew bubble gum, and I am all out of gum...</span>
          <span><span className="font-bold">+++ BREAKANG NEWS +++</span>  kek is now live on Modulus-Testnet <span className="font-bold">+++ partnership: </span> kek & wenpad join under the hat of $WOT <span className="font-bold">+++ launch: </span> kek and wenpad to launch $WOT protocol token soon! </span> <span className="font-bold">+++ kek-CEO:</span> <span>it´s time to kick ass and chew bubble gum, and I am all out of gum...</span>
          </div>
        </div>
      </div>
    );
}