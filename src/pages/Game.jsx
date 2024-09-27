import { useEffect, useRef, useState } from "react";
import "../../globals.css";
import binance from "../assets/WENBINANCE.png";
import bug from "../assets/bug.png";
import cramer from "../assets/cramer.png";
import dumpit from "../assets/dumpit.png";
import FUD from "../assets/FUD.png";
import gensler from "../assets/gensler.png";
import MrO from "../assets/MrO.png";
import rate_hike from "../assets/rate_hike.png";
import skywalker from "../assets/skywalker.png";
import GameModal from "../components/GameModal";

export default function Game() {
  const [isOpen, setIsOpen] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const handleKill = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  // Game constants
  const boardWidth = 750;
  const boardHeight = 250;

  // Refs for canvas and context
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  // Background
  const backgroundImageRef = useRef(null);
  const backgroundXRef = useRef(0);
  const backgroundSpeed = 2.5;

  // Buterik (player)
  const buterikRef = useRef({
    x: 50,
    y: boardHeight - 64,
    width: 32,
    height: 64,
    velocityY: 0,
  });
  const buterikImgRef = useRef(null);
  const frameXRef = useRef(0);
  const frameCountRef = useRef(0);

  // Enemies
  const enemiesArrayRef = useRef([]);

  // Physics constants
  const gravity = 0.35;
  const velocityX = -2.5;

  // Game state
  const gameOverRef = useRef(false);
  const scoreRef = useRef(0);

  // Images
  const dumpitImgRef = useRef(null);
  const skywalkerImgRef = useRef(null);
  const fudImgRef = useRef(null);
  const bugImgRef = useRef(null);
  const ratehikeImgRef = useRef(null);
  const genslerImgRef = useRef(null);
  const cramerImgRef = useRef(null);

  // Game loop timing
  const lastTimeRef = useRef(0);

  // Animation frame ID
  const animationFrameIdRef = useRef(null);

  // Enemy spawn timeout ID
  const enemyTimeoutIdRef = useRef(null);

  

  useEffect(() => {
    const canvas = document.getElementById("board");
    canvas.width = boardWidth;
    canvas.height = boardHeight;
    const context = canvas.getContext("2d");

    const handleFirstTouch = () => {
        requestFullScreen();
        startGame();
        canvas.removeEventListener("touchstart", handleFirstTouch);
      };

      const requestFullScreen = () => {
        if (canvas.requestFullscreen) {
          canvas.requestFullscreen();
        } else if (canvas.webkitRequestFullscreen) {
          canvas.webkitRequestFullscreen();
        } else if (canvas.mozRequestFullScreen) {
          canvas.mozRequestFullScreen();
        } else if (canvas.msRequestFullscreen) {
          canvas.msRequestFullscreen();
        }
      };

    canvasRef.current = canvas;
    contextRef.current = context;

    // Load images
    const backgroundImage = new Image();
    backgroundImage.src = binance;

    const buterikImg = new Image();
    buterikImg.src = MrO;

    // Enemy images
    const dumpitImg = new Image();
    dumpitImg.src = dumpit;

    const cramerImg = new Image();
    cramerImg.src = cramer;

    const skywalkerImg = new Image();
    skywalkerImg.src = skywalker;

    const fudImg = new Image();
    fudImg.src = FUD;

    const bugImg = new Image();
    bugImg.src = bug;

    const ratehikeImg = new Image();
    ratehikeImg.src = rate_hike;

    const genslerImg = new Image();
    genslerImg.src = gensler;

    // Wait for all images to load
    let imagesLoaded = 0;
    const totalImages = 9;

    const imageLoaded = () => {
      imagesLoaded++;
      if (imagesLoaded === totalImages) {
        // All images are loaded, start the game
        backgroundImageRef.current = backgroundImage;
        buterikImgRef.current = buterikImg;
        dumpitImgRef.current = dumpitImg;
        cramerImgRef.current = cramerImg;
        skywalkerImgRef.current = skywalkerImg;
        fudImgRef.current = fudImg;
        bugImgRef.current = bugImg;
        ratehikeImgRef.current = ratehikeImg;
        genslerImgRef.current = genslerImg;

        if (isMobile) {
          // Request full-screen mode on first touch
          

          // Start the game on first touch
        

          canvas.addEventListener("touchstart", handleFirstTouch);
        }
      }
    };

    // Attach onload handlers
    backgroundImage.onload = imageLoaded;
    buterikImg.onload = imageLoaded;
    dumpitImg.onload = imageLoaded;
    cramerImg.onload = imageLoaded;
    skywalkerImg.onload = imageLoaded;
    fudImg.onload = imageLoaded;
    bugImg.onload = imageLoaded;
    ratehikeImg.onload = imageLoaded;
    genslerImg.onload = imageLoaded;

    // Event listeners for jumping
    const handleJump = (e) => moveButerik(e);

    if (isMobile) {
      document.addEventListener("touchstart", handleJump);
    } else {
      document.addEventListener("keydown", moveButerik);
    }

    // Clean up function
    return () => {
      // Clear intervals and animation frames
      if (enemyTimeoutIdRef.current) {
        clearTimeout(enemyTimeoutIdRef.current);
      }
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      if (isMobile) {
        document.removeEventListener("touchstart", handleJump);
        canvas.removeEventListener("touchstart", handleFirstTouch);
      } else {
        document.removeEventListener("keydown", moveButerik);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function startGame() {
    // Start the game loop
    animationFrameIdRef.current = requestAnimationFrame(update);

    // Start spawning enemies with random delay
    spawnEnemyWithRandomDelay();
  }

  function spawnEnemyWithRandomDelay() {
    if (gameOverRef.current) {
      return;
    }

    // Generate a random delay between 1 and 3 seconds (1000ms to 3000ms)
    const randomDelay = Math.random() * 5000 + 2000;

    enemyTimeoutIdRef.current = setTimeout(() => {
      placeEnemy();
      spawnEnemyWithRandomDelay(); // Schedule the next enemy
    }, randomDelay);
  }

  function update(time) {
    if (gameOverRef.current) {
      return;
    }

    try {
      const context = contextRef.current;

      context.clearRect(0, 0, boardWidth, boardHeight);

      // Update background position
      backgroundXRef.current -= backgroundSpeed;

      if (backgroundXRef.current <= -backgroundImageRef.current.width) {
        backgroundXRef.current = 0;
      }

      // Draw background
      context.drawImage(
        backgroundImageRef.current,
        backgroundXRef.current,
        0,
        backgroundImageRef.current.width,
        boardHeight
      );
      context.drawImage(
        backgroundImageRef.current,
        backgroundXRef.current + backgroundImageRef.current.width,
        0,
        backgroundImageRef.current.width,
        boardHeight
      );

      // Update buterik
      const buterik = buterikRef.current;
      buterik.velocityY += gravity;
      buterik.y = Math.min(
        buterik.y + buterik.velocityY,
        boardHeight - buterik.height
      );

      // Prevent buterik from sinking below the ground
      if (buterik.y >= boardHeight - buterik.height) {
        buterik.y = boardHeight - buterik.height;
        buterik.velocityY = 0;
      }

      // Update frame for animation
      frameCountRef.current++;
      if (frameCountRef.current >= 10) {
        frameXRef.current = (frameXRef.current + 1) % 2;
        frameCountRef.current = 0;
      }

      context.drawImage(
        buterikImgRef.current,
        frameXRef.current * buterik.width,
        0,
        buterik.width,
        buterik.height,
        buterik.x,
        buterik.y,
        buterik.width,
        buterik.height
      );

      // Update enemies
      const enemiesArray = enemiesArrayRef.current;
      for (let i = enemiesArray.length - 1; i >= 0; i--) {
        let enemy = enemiesArray[i];
        enemy.x += velocityX;

        context.drawImage(
          enemy.img,
          enemy.x,
          enemy.y,
          enemy.width,
          enemy.height
        );

        // Check collision
        if (detectCollision(buterik, enemy)) {
          console.log("Collision detected!");
          gameOverRef.current = true;
          setIsGameOver(true);
          // Clear intervals and animation frames
          if (enemyTimeoutIdRef.current) {
            clearTimeout(enemyTimeoutIdRef.current);
          }
          if (animationFrameIdRef.current) {
            cancelAnimationFrame(animationFrameIdRef.current);
          }
          break;
        }

        // Remove off-screen enemies
        if (enemy.x + enemy.width < 0) {
          enemiesArray.splice(i, 1);
        }
      }

      // Update score
      scoreRef.current++;

      context.fillStyle = "black";
      context.font = "20px courier";
      context.fillText(scoreRef.current, 5, 20);

      // Continue the game loop
      animationFrameIdRef.current = requestAnimationFrame(update);
    } catch (error) {
      console.error("Error in update function:", error);
      gameOverRef.current = true;
      // Clear intervals and animation frames
      if (enemyTimeoutIdRef.current) {
        clearTimeout(enemyTimeoutIdRef.current);
      }
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    }
  }

  function moveButerik(e) {
    if (gameOverRef.current) {
      return;
    }

    // Prevent default action if available
    if (e.preventDefault) {
      e.preventDefault();
    }

    // Handle touch events
    if (e.type === "touchstart" || e.type === "click") {
      const buterik = buterikRef.current;
      if (buterik.y >= boardHeight - buterik.height) {
        buterik.velocityY = -10;
      }
      return;
    }

    // Handle keyboard events
    if (e.repeat) return;

    const buterik = buterikRef.current;

    if (
      (e.code === "Space" || e.code === "ArrowUp") &&
      buterik.y >= boardHeight - buterik.height
    ) {
      // Jump
      buterik.velocityY = -10;
    }
  }

  function placeEnemy() {
    if (gameOverRef.current) {
      return;
    }

    const enemiesArray = enemiesArrayRef.current;

    let enemy = {
      img: null,
      x: boardWidth,
      y: null,
      width: null,
      height: null,
    };

    let placeEnemyChance = Math.random();

    if (placeEnemyChance > 0.80) {
      enemy.img = genslerImgRef.current;
      enemy.y = boardHeight - 60;
      enemy.width = 40;
      enemy.height = 60;
    } else if (placeEnemyChance > 0.50) {
      enemy.img = dumpitImgRef.current;
      enemy.y = boardHeight - 60;
      enemy.width = 30;
      enemy.height = 60;
    } else if (placeEnemyChance > 0.30) {
      enemy.img = skywalkerImgRef.current;
      enemy.y = boardHeight - 60;
      enemy.width = 40;
      enemy.height = 60;
    } else {
      // Default enemy
      enemy.img = dumpitImgRef.current;
      enemy.y = boardHeight - 60;
      enemy.width = 30;
      enemy.height = 60;
    }

    enemiesArray.push(enemy);
  }

  function detectCollision(a, b) {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  const handleRestart = () => {
    // Reset game state
    gameOverRef.current = false;
    setIsGameOver(false);
    scoreRef.current = 0;
    enemiesArrayRef.current = [];
    buterikRef.current = {
      x: 50,
      y: boardHeight - 64,
      width: 32,
      height: 64,
      velocityY: 0,
    };
    frameXRef.current = 0;
    frameCountRef.current = 0;
    backgroundXRef.current = 0;
    lastTimeRef.current = 0;

    // Clear existing intervals and timeouts
    if (enemyTimeoutIdRef.current) {
      clearTimeout(enemyTimeoutIdRef.current);
    }
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
    }

    // Restart enemy spawning and game loop
    startGame();
  };

  return (
    <div>
    {isMobile && (
     <div id="game-container relative ">
        <GameModal isOpen={isOpen} closeModal={closeModal} />
        <div className="font-basic font-bold"> Life of Mr. O</div>

        <canvas
          className="connectbox border-4 border-black mb-2"
          id="board"
          tabIndex={-1}
          style={{ width: '100%', height: '100vh', display: 'block' }}

        ></canvas>
  
        {isGameOver && (
          <div className="game-over-overlay font-basic font-bold font-base-2">
            <h1>Game Over</h1>
            <button onClick={handleRestart}>Restart</button>
          </div>
        )}
      </div>)
    }
    {!isMobile &&
        <div className="flex flex-col pt-20 justify-center">
            <GameModal isOpen={isOpen} closeModal={closeModal} />
            <div className="font-basic font-bold"> Life of Mr. O</div>
            <canvas
                className="connectbox border-4 border-black mb-2"
                id="board"
                tabIndex={-1}
            ></canvas>
            <div className="flex flex-row gap-4">
                <button
                    type="button"
                    tabIndex={-1}
                    onClick={handleRestart}
                    className="font-basic font-semibold w-24 connectbox border-4 border-black bg-base-2 hover:scale-110 m-2"
                >
                    Start
                </button>
                <button
                    type="button"
                    tabIndex={-1}
                    onClick={handleKill}
                    className="font-basic font-semibold w-24 connectbox border-4 border-black bg-base-8 hover:scale-110 m-2"
                >
                    Kill Me
                </button>
            </div>
        </div>

    }
    </div>
    
  );
}
