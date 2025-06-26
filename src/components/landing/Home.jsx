import { useState, useEffect } from 'react'
import Hero from './Hero.jsx'
import LaunchTable from './LaunchTable.jsx'
import Marquee from "../nav/Marquee.jsx"
import { io } from "socket.io-client"
import dollar from "../../assets/dollar.png"

// Falling Dollar Component for full screen
const FallingDollar = ({ delay, duration }) => {
    return (
        <img 
            src={dollar} 
            className="fixed w-8 h-8 opacity-90 pointer-events-none"
            style={{
                left: `${Math.random() * 100}%`,
                top: '-50px',
                animationDelay: `${delay}ms`,
                animationDuration: `${duration}ms`,
                transform: `rotate(${Math.random() * 45}deg)`,
                zIndex: 50,
                animation: `fallMoney ${duration}ms linear forwards`
            }}
            alt="dollar"
        />
    );
};

// CSS-in-JS animation styles
const moneyAnimationStyles = `
  @keyframes fallMoney {
    0% {
      transform: translateY(-50px) translateX(0px) rotate(0deg);
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    25% {
      transform: translateY(25vh) translateX(20px) rotate(90deg);
    }
    50% {
      transform: translateY(50vh) translateX(-10px) rotate(180deg);
    }
    75% {
      transform: translateY(75vh) translateX(15px) rotate(270deg);
    }
    90% {
      opacity: 1;
    }
    100% {
      transform: translateY(100vh) translateX(0px) rotate(360deg);
      opacity: 0;
    }
  }
`;

function Home() {
  const [showMoneyFall, setShowMoneyFall] = useState(false);
  const [moneyFallCount, setMoneyFallCount] = useState(0);

  useEffect(() => {
    // Inject CSS animation styles
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = moneyAnimationStyles;
    document.head.appendChild(styleSheet);

    // Setup WebSocket connection for buy events
    const socket = io(`${import.meta.env.VITE_SOCKET_IO}`, {
      path: '/socket.io/',
      transports: ['websocket', 'polling'],
      withCredentials: true,
    });

    socket.on("newBuyEvent", (data) => {
      console.log("🚀 NEW BUY EVENT - MONEY RAIN!", data);
      
      // Trigger money fall effect
      setShowMoneyFall(true);
      setMoneyFallCount(prev => prev + 1); // Force re-render with new key
      
      // Hide the effect after animation completes
      setTimeout(() => {
        setShowMoneyFall(false);
      }, 3000); // 3 seconds total animation time
    });

    return () => {
      socket.disconnect();
      document.head.removeChild(styleSheet);
    };
  }, []);

  return(
    <div className="w-full relative">
      {/* Full Screen Money Fall Effect */}
      {showMoneyFall && (
        <div className="fixed inset-0 pointer-events-none z-40">
          {/* Generate multiple falling dollar bills across entire screen */}
          {[...Array(15)].map((_, index) => (
            <FallingDollar 
              key={`${moneyFallCount}-${index}`} // Unique key for each animation
              delay={index * 150} // Stagger the falling
              duration={2000 + Math.random() * 1000} // Random duration between 2-3s
            />
          ))}
        </div>
      )}

      <div className="w-full pt-4">
        <Marquee />
      </div>
      <div className="pt-4">
        <Hero />
      </div>
      <div className="pt-20">
        <LaunchTable />
      </div>
    </div>
  )
}

export default Home
