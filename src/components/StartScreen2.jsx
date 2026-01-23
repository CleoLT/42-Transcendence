import { useEffect, useState } from "react";

export default function StartScreen({ game }) {
  const [vsAI, setVsAI] = useState(false);
  const [difficulty, setDifficulty] = useState("easy");

  useEffect(() => {
    function onKey(e) {
      if (e.code === "Space" && game) {
        game.startGame();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [game]);

  if (!game || game.state !== "menu") return null;

  return (
    <div id="start-screen">
      <h1>Blossom Clash</h1>

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

      <p>Press SPACE to start</p>

      <div className="controls-info">
        <div>P1: A/D, Shift, Space</div>
        <div>P2: Arrows, Ctrl, Shift</div>
      </div>
    </div>
  );
}
