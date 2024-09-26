import { useEffect, useRef, useState } from "react"
import "../../globals.css"
import binance from "../assets/WENBINANCE.png"
import bug from "../assets/bug.png"
import cramer from "../assets/cramer.png"
import dumpit from "../assets/dumpit.png"
import FUD from "../assets/FUD.png"
import gensler from "../assets/gensler.png"
import MrO from "../assets/MrO.png"
import rate_hike from "../assets/rate_hike.png"
import skywalker from "../assets/skywalker.png"
import GameModal from "../components/GameModal"



export default function Game(){

const [isOpen, setIsOpen] = useState(false)

const handleKill = () =>{
    setIsOpen(true)
}

const closeModal = () => {
    setIsOpen(false)
}
//GAME

//board
let board
let boardWidth = 750
let boardHeight = 250
let context

//background
let backgroundImage;
let backgroundX = 0; // Starting X position of the background
let backgroundSpeed = 2; 

//buterik
let buterikWidth = 32 // maybe set to imagesize
let buterikHeight = 64 // maybe set to imagesize
let buterikX = 50
let buterikY = boardHeight - buterikHeight
let buterikImg

let buterik = {
    x : buterikX,
    y : buterikY,
    width : buterikWidth,
    height : buterikHeight
}

let frameX = 0;  // Current frame's X coordinate on the spritesheet
let frameY = 0;  // Current frame's Y coordinate on the spritesheet
let maxFrame = 2; // Number of frames (0 to 3 means 4 frames total)
let frameCount = 0; // Frame rate control
let frameDelay = 10; // Delay between frames

//enemies
let enemiesArray = []

let dumpitWidth = 30
let skywalkerWidth = 40
let fudWidth = 80
let bugWidth = 150
let rateHikeWidth = 150
let genslerWidth = 40

let characHeight = 60
let flyHeight = 40
let flyHeight2 = 42.5

let enemyX = 700
let characY = boardHeight - characHeight
let flyY = boardHeight - 100 - flyHeight

let dumpitImg
let skywalkerImg
let fudImg
let bugImg
let ratehikeImg
let genslerImg
let cramerImg
/*
width x height

buterik: 100 x 100
dump_it: 40 x 60
skywalker: 40 x 60
fud: 60 x 50
bug: 200 x 50
rate_hike: 200 x 50
gensler: 50 x 80
*/

//physics
let velocityX = -2 //enemy moving left speed
let velocityY = 0
let gravity = 0.28

let gameOver = false
let score = 0
let enemyIntervalId = useRef(null); // Use useRef to persist across renders


const handleRestart = () => {
    window.location.reload()
}


/*useEffect(() => {
    clearInterval(enemyIntervalId.current); // Clear previous interval
    gameOver = false;
    score = 0;
    enemiesArray = [];
    startGame();

    return () => {
        // Clean up interval and event listeners when unmounting
        clearInterval(enemyIntervalId.current);
        document.removeEventListener("keydown", moveButerik);
      }
},[gameOver])*/

//const startGame = () => {
    window.onload = function(){
        board = document.getElementById("board")
        board.height = boardHeight
        board.width = boardWidth
    
    
        context = board.getContext("2d")
    
        //draw initial buterik
        //context.fillStyle="green"
        //context.fillRect(buterik.x, buterik.y, buterik.width, buterik.height)
        backgroundImage = new Image();
        backgroundImage.src = binance;
    
        backgroundImage.onload = function() {
            requestAnimationFrame(update); // Start the game loop
        };
    
        buterikImg = new Image()
        buterikImg.src = MrO
    
        buterikImg.onload = function(){
            context.drawImage(buterikImg, buterik.x, buterik.y, buterik.width, buterik.height)
    
        }
    
        dumpitImg = new Image()
        dumpitImg.src = dumpit
    
        cramerImg = new Image()
        cramerImg.src = cramer
    
        skywalkerImg = new Image()
        skywalkerImg.src = skywalker
    
        fudImg = new Image()
        fudImg.src = FUD
    
        bugImg = new Image()
        bugImg.src = bug
    
        ratehikeImg = new Image()
        ratehikeImg.src = rate_hike
    
        genslerImg = new Image()
        genslerImg.src = gensler
    
        requestAnimationFrame(update)
        setInterval(placeEnemy, 1000)
    
        document.addEventListener("keydown", moveButerik)
    }
//}



function update () {
    requestAnimationFrame(update)
    if(gameOver){
        return
    }

    context.clearRect(0, 0, board.width, board.height)

    backgroundX -= backgroundSpeed;

    // If the background has moved entirely off-screen, reset it
    if (backgroundX <= -backgroundImage.width) {
        backgroundX = 0;
    }

    // Draw the background image twice to create a continuous loop
    context.drawImage(backgroundImage, backgroundX, 0, backgroundImage.width, boardHeight);
    context.drawImage(backgroundImage, backgroundX + backgroundImage.width, 0, backgroundImage.width, boardHeight);


    //buterik
    velocityY += gravity
    buterik.y = Math.min(buterik.y + velocityY, buterikY) //apply gravity

    frameCount++;
    if (frameCount >= frameDelay) {
        frameX = (frameX + 1) % maxFrame;  // Loop through frames
        frameCount = 0;
    }

    context.drawImage(
        buterikImg,                    // Image source (spritesheet)
        frameX * buterik.width,         // X position of the frame in the spritesheet
        0,                              // Y position (top of the spritesheet)
        buterik.width,                  // Width of each frame
        buterik.height,                 // Height of each frame
        buterik.x,                      // X position on the canvas
        buterik.y,                      // Y position on the canvas
        buterik.width,                  // Draw width on canvas
        buterik.height                  // Draw height on canvas
    );

    //enemy
    for (let i = 0; i < enemiesArray.length; i++){
        let enemy = enemiesArray[i]
        enemy.x += velocityX
        context.drawImage(enemy.img, enemy.x, enemy.y, enemy.width, enemy.height)

        if (detectCollision(buterik, enemy)){
            gameOver = true

        }
    }

     //score
     context.fillStyle="black";
     context.font="20px courier";
     score++;
     context.fillText(score, 5, 20)

}

function moveButerik(e){
    if(gameOver){
        return
    }

    if((e.code == "Space" || e.code == "ArrowUp") && buterik.y == buterikY){
        //jump
        velocityY = -10
    }

}

function placeEnemy(){
    // place enemy

    let enemy = {
        img : null,
        x : enemyX,
        y : null,
        width : null,
        height: null
    }

    let placeEnemyChance = Math.random() // 0 - 0.9999

    
    if(placeEnemyChance > .90) {
        enemy.img = ratehikeImg
        enemy.y = flyY
        enemy.width = rateHikeWidth
        enemy.height = flyHeight2
        enemiesArray.push(enemy)
    }
    else if(placeEnemyChance > .80) {
        enemy.img = genslerImg
        enemy.y = characY
        enemy.width = genslerWidth
        enemy.height = characHeight
        enemiesArray.push(enemy)
    }
    else if(placeEnemyChance > .70) {
        enemy.img = cramerImg
        enemy.y = flyY
        enemy.width = rateHikeWidth
        enemy.height = flyHeight2
        enemiesArray.push(enemy)
    }
    else if(placeEnemyChance > .60) {
        enemy.img = fudImg
        enemy.y = flyY
        enemy.width = fudWidth
        enemy.height = flyHeight
        enemiesArray.push(enemy)
    }
    else if(placeEnemyChance > .50) {
        enemy.img = dumpitImg
        enemy.y = characY
        enemy.width = dumpitWidth
        enemy.height = characHeight
        enemiesArray.push(enemy)
    }
    else if(placeEnemyChance > .30) {
        enemy.img = skywalkerImg
        enemy.y = characY
        enemy.width = skywalkerWidth
        enemy.height = characHeight
        enemiesArray.push(enemy)
    }

    if (enemiesArray > 5){
        enemiesArray.shift() // remove elements so array does not fill
    }
}

function detectCollision(a, b){
    return a.x < b.x + b.width && // a´s top left corner doesnt reach b´s top right corner
           a.x + a.width > b.x && //a´s top right corner passes b´s top left corner
           a.y < b.y + b.height && //a´s top left corner doesnt reach b´s bottom left corner
           a.y + a.height > b.y // a´s bottom left corner passes b´s top left corner
}




    return(
        <div className="flex justify-center">
            <GameModal isOpen={isOpen} closeModal={closeModal} />
            <div className="flex flex-col justify-center text-center mt-20 max-w-[1200px]">
                <div className="font-basic font-bold text-3xl"> Life of Mr. O</div>
                <canvas className="connectbox border-4 border-black mb-2" id="board"></canvas>
                <div className=" flex flex-row gap-4">
                    <button onClick={() => handleRestart()} className="font-basic font-semibold w-24 connectbox border-4 border-black bg-base-2 hover:scale-110" >start</button>
                    <button onClick={() => handleKill()} className="font-basic font-semibold w-24 connectbox border-4 border-black bg-base-8 hover:scale-110" >kill me</button>
                </div>
            </div>
        </div>
        
    )
}