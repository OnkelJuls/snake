import { update as updateSnake, draw as drawSnake, SNAKE_SPEED, getSnakeHead, snakeIntersection } from './snake.js';
import { update as updateFood, draw as drawFood } from './food.js';
import { outsideGrid } from './grid.js';

let lastRenderTime = 0;
let gameOver = false;
const gameBoard = document.getElementById('game-board');
let currentScore = 0;
let highScore = 0;

const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('high-score');
const deleteHighscoreButton = document.getElementById('delete-highscore-btn');

function updateScore() {
    currentScore += 10;
    scoreElement.textContent = currentScore;
}

function main(currentTime) {
    if (gameOver) {
        if (currentScore > highScore) {
            updateHighScoreOnServer(currentScore);
        }
        if (confirm(`You lost. Score: ${currentScore}. Restart?`)) {
            window.location = '/';
        }
        return;
    }

    window.requestAnimationFrame(main);
    const secondsSinceLastRenderTime = (currentTime - lastRenderTime) / 1000;
    if (secondsSinceLastRenderTime < 1 / SNAKE_SPEED) return;
    lastRenderTime = currentTime;
    update();
    draw();
}

window.requestAnimationFrame(main);

function update() {
    updateSnake();
    if (updateFood()) {
        updateScore();
    }
    checkDeath();
}

function draw() {
    gameBoard.innerHTML = '';
    drawSnake(gameBoard);
    drawFood(gameBoard);
}

function checkDeath() {
    gameOver = outsideGrid(getSnakeHead()) || snakeIntersection();
}

deleteHighscoreButton.addEventListener('click', async () => {
    try {
        const response = await fetch('/highscore', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ highScore: 0 }) 
        });
        const data = await response.json();
        console.log(data.message);
        highScore = 0;
        highScoreElement.textContent = highScore;
    } catch (error) {
        console.error("Error resetting high score:", error);
    }
});

async function getHighScore() {
    try {
        const response = await fetch('/highscore');
        const data = await response.json();
        highScore = data.highScore;
        highScoreElement.textContent = highScore;
        return data.highScore;
    } catch (error) {
        console.error("Error fetching high score:", error);
        return 0;
    }
}

async function updateHighScoreOnServer(score) {
    try {
        const response = await fetch('/highscore', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ highScore: score })
        });
        const data = await response.json();
        console.log(data.message);
        await getHighScore(); 
    } catch (error) {
        console.error("Error updating high score:", error);
    }
}

getHighScore();