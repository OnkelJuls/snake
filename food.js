import { onSnake, expandSnake } from "./snake.js";
import { randomGridPosition } from "./grid.js";

let food = getRandomFoodPosition();
const EXPANSION_RATE = 1;
const FOOD_LIFETIME = 5000; // 5 seconds
let foodGenerationTime;

function getRandomFoodPosition() {
    let newFoodPosition;
    while (newFoodPosition == null || onSnake(newFoodPosition)) {
        newFoodPosition = randomGridPosition();
    }
    return newFoodPosition;
}

function generateFood() {
    food = getRandomFoodPosition();
    foodGenerationTime = Date.now();
}

generateFood();

export function update() {
    if (onSnake(food)) {
        expandSnake(EXPANSION_RATE);
        generateFood();
        return true; // Food was eaten
    } else if (Date.now() - foodGenerationTime > FOOD_LIFETIME) {
        generateFood(); 
    }
    return false; // Food was not eaten
}

export function draw(gameBoard) {
    const foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    gameBoard.appendChild(foodElement);
}