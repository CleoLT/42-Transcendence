import { Game } from './game/Game.js';
import { InputManager } from './game/InputManager.js';

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = 1200;
canvas.height = 800;

const game = new Game(canvas, ctx);
const inputManager = new InputManager();

// Initialize game (async for sprite loading) and start game loop when ready
let gameInitialized = false;
game.init().then(() => {
  gameInitialized = true;
  console.log('Game initialized successfully');
}).catch(err => {
  console.error('Failed to initialize game:', err);
  gameInitialized = true; // Still allow game to run with fallbacks
});

// Setup mode selector
document.getElementById('vs-human-btn').addEventListener('click', () => {
  game.setAIMode(false);
});

document.getElementById('vs-ai-btn').addEventListener('click', () => {
  const difficulty = document.getElementById('ai-difficulty-select').value;
  game.setAIMode(true, difficulty);
});

// Reset button
document.getElementById('reset-button').addEventListener('click', () => {
  game.resetGame();
});

// Game loop
let lastTime = 0;
function gameLoop(currentTime) {
  const deltaTime = (currentTime - lastTime) / 1000;
  lastTime = currentTime;

  // Only update/render if game is initialized
  if (gameInitialized) {
    game.update(deltaTime, inputManager);
    game.render(ctx);
  }

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
