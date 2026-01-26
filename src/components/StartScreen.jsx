import { useEffect, useState } from "react";

export default function StartScreen({ game }) {
  const [vsAI, setVsAI] = useState(false);
  const [difficulty, setDifficulty] = useState("easy");
  const [player1Name, setPlayer1Name] = useState("");
  const [player2Name, setPlayer2Name] = useState("");
  const [gameState, setGameState] = useState(game?.state || 'menu');

  // Subscribe to game state changes
  useEffect(() => {
    if (!game) {
      setGameState('menu');
      return;
    }

    // Initial state
    setGameState(game.state);

    // Poll for state changes (since game.state is not reactive)
    // Use a ref to track the last known state to avoid stale closures
    let lastState = game.state;
    const interval = setInterval(() => {
      if (game && game.state !== lastState) {
        console.log('🔄 Game state changed detected:', lastState, '->', game.state);
        lastState = game.state;
        setGameState(game.state);
      }
    }, 50); // Check every 50ms for faster response

    return () => clearInterval(interval);
  }, [game]);

  useEffect(() => {
    function onKey(e) {
      if (e.code === "Space" && game) {
        // Validate names before starting
        const p1Name = player1Name.trim();
        const p2Name = vsAI ? "AI" : player2Name.trim();
        
        if (p1Name && (!vsAI ? p2Name : true)) {
          console.log('🚀 Starting game with names:', p1Name, p2Name);
          game.startGame(p1Name, p2Name);
          // Force immediate state update - game.state should now be 'playing'
          // Also set local state immediately for instant UI update
          setGameState('playing');
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [game, player1Name, player2Name, vsAI]);

  // Use tracked gameState instead of game.state directly
  const currentState = game ? (game.state || gameState) : 'menu';
  
  // Debug logging
  console.log('🎨 StartScreen render', {
    game: game ? 'exists' : 'null',
    gameState: currentState,
    trackedState: gameState,
    shouldShow: !game || currentState === "menu"
  });

  // Show menu if game is null (loading) or if game state is menu
  // Hide menu only if game exists and state is not menu
  if (game && currentState !== "menu") {
    console.log('🚫 StartScreen: Hiding menu (game state is not menu)');
    return null;
  }
  
  // If game is null, show loading state
  if (!game) {
    console.log('⏳ StartScreen: Showing loading state');
    return (
      <div id="start-screen-overlay">
        <div id="start-screen">
          <h1>Blossom Clash</h1>
          <p>Loading game...</p>
        </div>
      </div>
    );
  }

  console.log('✅ StartScreen: Showing menu (game exists and state is menu)');

  const canStart = player1Name.trim() && (vsAI || player2Name.trim());

  return (
    <div id="start-screen-overlay">
      <div id="start-screen">
      <h1>Blossom Clash</h1>

      <div id="player-names">
        <div className="name-input-group">
          <label htmlFor="player1-name">Player 1 Name:</label>
          <input
            id="player1-name"
            type="text"
            value={player1Name}
            onChange={(e) => setPlayer1Name(e.target.value)}
            placeholder="Enter name"
            maxLength={20}
          />
        </div>
        {!vsAI && (
          <div className="name-input-group">
            <label htmlFor="player2-name">Player 2 Name:</label>
            <input
              id="player2-name"
              type="text"
              value={player2Name}
              onChange={(e) => setPlayer2Name(e.target.value)}
              placeholder="Enter name"
              maxLength={20}
            />
          </div>
        )}
      </div>

      <div id="mode-selector">
        <button
          className={!vsAI ? "active" : ""}
          onClick={() => {
            setVsAI(false);
            game.setAIMode(false);
          }}
        >
          VS Human
        </button>

        <button
          className={vsAI ? "active" : ""}
          onClick={() => {
            setVsAI(true);
            game.setAIMode(true, difficulty);
          }}
        >
          VS AI
        </button>
      </div>

      {vsAI && (
        <div id="ai-difficulty">
          <label>AI Difficulty:</label>
          <select
            value={difficulty}
            onChange={(e) => {
              setDifficulty(e.target.value);
              game.setAIMode(true, e.target.value);
            }}
          >
            <option value="easy">Easy</option>
            <option value="normal">Normal</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      )}

      <p style={{ color: canStart ? "inherit" : "#ff6b6b" }}>
        {canStart ? "Press SPACE to start" : "Enter player name(s) to start"}
      </p>

      <div className="controls-info">
        <div>P1: A/D, Shift, Space</div>
        <div>P2: Arrows, Ctrl, Shift</div>
      </div>
      </div>
    </div>
  );
}
