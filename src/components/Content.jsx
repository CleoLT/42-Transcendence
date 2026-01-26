import { useState, useEffect } from "react";
import { IconsList } from "./icon.jsx";
import GameContainer from "./GameContainer";
import StartScreen from "./StartScreen";

export default function Content() {
  const [game, setGame] = useState(null);

  // Debug: log when game state changes
  useEffect(() => {
    console.log('📦 Content: game state changed', {
      game: game ? 'exists' : 'null',
      gameState: game?.state
    });
  }, [game]);

  return (
    <div className="flex flex-row h-[85vh] w-[95vw] border-2 border-black">
      <IconsList />

      <div 
        className="flex-1 relative overflow-hidden" 
        style={{ 
          minHeight: '400px', 
          minWidth: '600px',
          backgroundColor: 'transparent',
          position: 'relative'
        }}
      >
        <GameContainer onGameReady={setGame} />
        <StartScreen game={game} />
      </div>
    </div>
  );
}
