import { useEffect, useRef } from 'react';
import { initGame } from '../main_game.js';
import '../style.css';

/**
 * Componente que integra el juego JavaScript vanilla dentro de React.
 * Maneja el ciclo de vida completo: montaje, inicialización y limpieza.
 */
export default function GameContainer() {
  const containerRef = useRef(null);
  const cleanupRef = useRef(null);

  useEffect(() => {
    // Verificar que el contenedor existe
    if (!containerRef.current) {
      return;
    }

    const container = containerRef.current;

    // Limpiar cualquier instancia previa (útil para HMR)
    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }

    // Limpiar cualquier contenedor de juego previo
    const existingGameContainer = container.querySelector('#game-container');
    if (existingGameContainer) {
      container.removeChild(existingGameContainer);
    }

    // Crear estructura HTML necesaria para el juego
    // El juego busca estos elementos por ID
    const gameContainer = document.createElement('div');
    gameContainer.id = 'game-container';
    gameContainer.style.position = 'relative';
    gameContainer.style.width = '100%';
    gameContainer.style.height = '100%';

    // Crear elementos UI que el juego necesita
    const startScreen = document.createElement('div');
    startScreen.id = 'start-screen';
    startScreen.innerHTML = `
      <h1>Blossom Clash</h1>
      <div id="mode-selector">
        <button id="vs-human-btn" class="mode-btn active">VS Human</button>
        <button id="vs-ai-btn" class="mode-btn">VS AI</button>
      </div>
      <div id="ai-difficulty" class="hidden">
        <label>AI Difficulty:</label>
        <select id="ai-difficulty-select">
          <option value="easy">Easy</option>
          <option value="normal">Normal</option>
          <option value="hard">Hard</option>
        </select>
      </div>
      <p id="start-text">Press SPACE to start</p>
      <div class="controls-info">
        <div>Player 1: A/D (Move Left/Right), LEFT SHIFT (Push), SPACEBAR (Dash)</div>
        <div id="p2-controls">Player 2: Arrow Keys (Move Left/Right), RIGHT CTRL (Push), RIGHT SHIFT (Dash)</div>
        <div style="margin-top: 10px; font-size: 14px;">1/2/3 = Abilities (P1) | Numpad 1/2/3 = Abilities (P2)</div>
      </div>
    `;

    const resetButton = document.createElement('button');
    resetButton.id = 'reset-button';
    resetButton.className = 'hidden reset-btn';
    resetButton.textContent = 'Reset Game';

    // Agregar elementos al contenedor del juego
    gameContainer.appendChild(startScreen);
    gameContainer.appendChild(resetButton);

    // Agregar el contenedor del juego al contenedor React
    container.appendChild(gameContainer);

    // Inicializar el juego - esto creará el canvas dentro de gameContainer
    const cleanup = initGame(gameContainer);

    // Guardar función de limpieza
    cleanupRef.current = cleanup;

    // Función de limpieza al desmontar
    return () => {
      // Ejecutar limpieza del juego (cancela animation frames, remueve listeners)
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }

      // Remover el contenedor del juego del DOM
      if (gameContainer && gameContainer.parentNode === container) {
        container.removeChild(gameContainer);
      }
    };
  }, []); // Array vacío: solo se ejecuta al montar/desmontar

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full"
      style={{ position: 'relative' }}
    />
  );
}

