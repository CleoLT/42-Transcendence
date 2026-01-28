import { Game } from './game/Game.js';
import { InputManager } from './game/InputManager.js';

const baseWidth = 1800;
const baseHeight = 800;
const aspectRatio = baseWidth / baseHeight;
/**
 * Initializes the vanilla game inside a container.
 * React owns all UI (menus, pause, HUD).
 *
 * @param {HTMLElement} container
 * @param {Function} onGameReady - Callback to pass game instance to React
 * @returns {{ game: Game, cleanup: Function }}
 */

export function initGame(container, onGameReady) {

  const canvas = document.createElement('canvas');
  canvas.id = 'game-canvas';
  canvas.style.display = 'block';
  canvas.style.margin = '0 auto';
  canvas.style.backgroundColor = '#1a0f2e'; // Fallback background color
  canvas.style.position = 'relative';
  canvas.style.zIndex = '0'; // Behind menu overlay
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  
  // Set initial canvas size to ensure it's visible
  canvas.width = baseWidth;
  canvas.height = baseHeight;
  
  console.log('✅ Canvas created and added to container', {
    containerWidth: container.offsetWidth,
    containerHeight: container.offsetHeight,
    canvasWidth: canvas.width,
    canvasHeight: canvas.height,
    canvasStyleWidth: canvas.style.width,
    canvasStyleHeight: canvas.style.height,
    canvasElement: canvas,
    containerHasChildren: container.children.length
  });
  
  // Immediate test render to verify canvas works
  setTimeout(() => {
    if (ctx && canvas.width > 0 && canvas.height > 0) {
      ctx.fillStyle = '#00ff00'; // Bright green test
      ctx.fillRect(10, 10, 100, 100);
      console.log('✅ Test rectangle drawn to canvas');
    }
  }, 100);




  function resizeCanvas() {
    const { width, height } = container.getBoundingClientRect();

    if (width === 0 || height === 0) {
      // Retry after a short delay if container has no dimensions yet
      setTimeout(resizeCanvas, 50);
      return;
    }

    let canvasWidth = width;
    let canvasHeight = width / aspectRatio;

    if (canvasHeight > height) {
      canvasHeight = height;
      canvasWidth = height * aspectRatio;
    }

    // Ensure canvas doesn't overflow container
    canvasWidth = Math.min(canvasWidth, width);
    canvasHeight = Math.min(canvasHeight, height);

    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;
    canvas.style.maxWidth = '100%';
    canvas.style.maxHeight = '100%';

    // Internal resolution stays constant
    canvas.width = baseWidth;
    canvas.height = baseHeight;
  }

  // Initial resize - use requestAnimationFrame to ensure container is laid out
  requestAnimationFrame(() => {
    resizeCanvas();
    console.log('✅ Canvas resized', {
      canvasWidth: canvas.style.width,
      canvasHeight: canvas.style.height,
      internalWidth: canvas.width,
      internalHeight: canvas.height
    });
  });

  const resizeObserver = new ResizeObserver(() => {
    resizeCanvas();
  });
  resizeObserver.observe(container);


  const game = new Game(canvas, ctx);
  const inputManager = new InputManager();

  let initialized = false;

  // Call onGameReady immediately so React can render the menu
  // The game state is already 'menu' by default
  if (onGameReady) {
    console.log('📞 Calling onGameReady with game', { gameState: game.state });
    onGameReady(game);
  } else {
    console.warn('⚠️  onGameReady callback not provided');
  }

  game.init()
    .then(() => {
      initialized = true;
      console.log('✅ Game initialized successfully');
    })
    .catch(err => {
      console.error('❌ Game init failed:', err);
      initialized = true; // allow fallback rendering
    });


  let lastTime = 0;
  let frameId = null;

  let loopRunning = true;

  function loop(time) {
    if (!loopRunning) {
      return;
    }
    
    // Handle first frame (deltaTime calculation)
    if (lastTime === 0) {
      lastTime = time;
    }
    
    const deltaTime = Math.min((time - lastTime) / 1000, 0.1); // Cap deltaTime to prevent large jumps
    lastTime = time;

    // Always render, even if not initialized (shows background)
    try {
      if (game && ctx && canvas && canvas.width > 0 && canvas.height > 0) {
        game.render(ctx);
        
        if (initialized) {
          game.update(deltaTime, inputManager);
        }
      } else if (ctx && canvas && canvas.width > 0 && canvas.height > 0) {
        // Fallback: draw directly to canvas if game isn't ready
        // Draw a very visible test pattern
        ctx.fillStyle = '#ff0000'; // Bright red - impossible to miss
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('CANVAS TEST - If you see this, canvas is working!', canvas.width / 2, canvas.height / 2);
        ctx.fillText(`Canvas: ${canvas.width}x${canvas.height}`, canvas.width / 2, canvas.height / 2 + 40);
      }
    } catch (error) {
      console.error('Error in game loop:', error);
    }

    if (loopRunning) {
      frameId = requestAnimationFrame(loop);
    }
  }

  frameId = requestAnimationFrame(loop);


  function cleanup() {
    console.log('🧹 Game cleanup called');
    loopRunning = false;
    
    if (frameId !== null) {
      cancelAnimationFrame(frameId);
      frameId = null;
    }

    resizeObserver.disconnect();

    inputManager.cleanup?.();
    game.cleanup?.();

    if (canvas && canvas.parentNode === container) {
      container.removeChild(canvas);
    }
  }

  return { game, cleanup };
}
