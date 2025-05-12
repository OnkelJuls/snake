import { update as updateSnake, draw as drawSnake, SNAKE_SPEED, getSnakeHead, snakeIntersection } from './snake.js';
import { update as updateFood, draw as drawFood } from './food.js';
import { outsideGrid } from './grid.js';

let lastRenderTime = 0;
let gameOver = false;
const gameBoard = document.getElementById('game-board');
let currentScore = 0;
let highScore = parseInt(localStorage.getItem('highScore') || 0);

const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('high-score');
const deleteHighscoreButton = document.getElementById('delete-highscore-btn');

function updateScore() {
    currentScore += 10;
    scoreElement.textContent = currentScore;
}

function updateHighScore() {
    if (currentScore > highScore) {
        highScore = currentScore;
        localStorage.setItem('highScore', highScore); 
        highScoreElement.textContent = highScore;
    }
}

function main(currentTime) {
    if (gameOver) {
        updateHighScore();
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

highScoreElement.textContent = highScore;

deleteHighscoreButton.addEventListener('click', () => {
    localStorage.removeItem('highscore');
    highScore = 0;
    highScoreElement.textContent = highScore;
})