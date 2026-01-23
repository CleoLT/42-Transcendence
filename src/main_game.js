import { Game } from './game/Game.js';
import { InputManager } from './game/InputManager.js';

/**
 * Inicializa el juego dentro de un contenedor y retorna una función de limpieza.
 * 
 * @param {HTMLElement} container - Contenedor donde se montará el juego
 * @returns {Function} Función de limpieza que debe llamarse al desmontar
 */
export function initGame(container) {
  // Crear canvas dentro del contenedor
  const canvas = document.createElement('canvas');
  canvas.id = 'game-canvas';
  container.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');

  // Tamaño base del juego (aspect ratio 3:2)
  const baseWidth = 1800;
  const baseHeight = 800;
  const aspectRatio = baseWidth / baseHeight;

  // Función para ajustar el tamaño del canvas al contenedor
  function resizeCanvas() {
    const containerRect = container.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;

    // Calcular el tamaño manteniendo el aspect ratio
    let canvasWidth = containerWidth;
    let canvasHeight = containerWidth / aspectRatio;

    // Si el alto calculado es mayor que el disponible, ajustar por altura
    if (canvasHeight > containerHeight) {
      canvasHeight = containerHeight;
      canvasWidth = containerHeight * aspectRatio;
    }

    // Establecer el tamaño de visualización del canvas
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;
    canvas.style.maxWidth = '100%';
    canvas.style.maxHeight = '100%';
    canvas.style.objectFit = 'contain';

    // El tamaño interno del canvas siempre es el tamaño base para el renderizado
    canvas.width = baseWidth;
    canvas.height = baseHeight;
  }

  // Ajustar tamaño inicial
  resizeCanvas();

  // Observar cambios de tamaño del contenedor
  const resizeObserver = new ResizeObserver(() => {
    resizeCanvas();
  });
  resizeObserver.observe(container);

  const game = new Game(canvas, ctx);
  const inputManager = new InputManager();

  // Initialize game (async for sprite loading) and start game loop when ready
  let gameInitialized = false;
  const initPromise = game.init().then(() => {
    gameInitialized = true;
    console.log('Game initialized successfully');
  }).catch(err => {
    console.error('Failed to initialize game:', err);
    gameInitialized = true; // Still allow game to run with fallbacks
  });

  // Setup mode selector - buscar elementos dentro del contenedor o en el documento
  const vsHumanBtn = container.querySelector('#vs-human-btn') || document.getElementById('vs-human-btn');
  const vsAiBtn = container.querySelector('#vs-ai-btn') || document.getElementById('vs-ai-btn');
  const aiDifficultySelect = container.querySelector('#ai-difficulty-select') || document.getElementById('ai-difficulty-select');
  const resetButton = container.querySelector('#reset-button') || document.getElementById('reset-button');

  const eventHandlers = [];

  if (vsHumanBtn) {
    const handler = () => {
      game.setAIMode(false);
    };
    vsHumanBtn.addEventListener('click', handler);
    eventHandlers.push({ element: vsHumanBtn, event: 'click', handler });
  }

  if (vsAiBtn) {
    const handler = () => {
      const difficulty = aiDifficultySelect?.value || 'easy';
      game.setAIMode(true, difficulty);
    };
    vsAiBtn.addEventListener('click', handler);
    eventHandlers.push({ element: vsAiBtn, event: 'click', handler });
  }

  if (resetButton) {
    const handler = () => {
      game.resetGame();
    };
    resetButton.addEventListener('click', handler);
    eventHandlers.push({ element: resetButton, event: 'click', handler });
  }

  // Game loop
  let lastTime = 0;
  let animationFrameId = null;
  
  function gameLoop(currentTime) {
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    // Only update/render if game is initialized
    if (gameInitialized) {
      game.update(deltaTime, inputManager);
      game.render(ctx);
    }

    animationFrameId = requestAnimationFrame(gameLoop);
  }

  animationFrameId = requestAnimationFrame(gameLoop);

  // Función de limpieza
  return function cleanup() {
    // Cancelar animation frame
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }

    // Desconectar ResizeObserver
    if (resizeObserver) {
      resizeObserver.disconnect();
    }

    // Remover event listeners de botones
    eventHandlers.forEach(({ element, event, handler }) => {
      if (element) {
        element.removeEventListener(event, handler);
      }
    });

    // Limpiar InputManager (remueve listeners de window)
    if (inputManager && inputManager.cleanup) {
      inputManager.cleanup();
    }

    // Limpiar Game (remueve listeners de document)
    if (game && game.cleanup) {
      game.cleanup();
    }

    // Limpiar el canvas del contenedor
    if (canvas && canvas.parentNode === container) {
      container.removeChild(canvas);
    }
  };
}
