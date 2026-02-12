import { useEffect, useState } from "react";
import { LogInInput } from "./circleUtils.jsx";
import { CorbenBold } from "./typography.jsx";

export default function StartScreen({ game }) {
  const [guestExpanded, setGuestExpanded] = useState(false);
  const [player1Name, setPlayer1Name] = useState("");
  const [player2Name, setPlayer2Name] = useState("");
  const [vsAI, setVsAI] = useState(true);
  const [difficulty, setDifficulty] = useState("easy");
  const [gameState, setGameState] = useState(game?.state ?? "menu");

  useEffect(() => {
    if (!game) {
      setGameState("menu");
      return;
    }
    setGameState(game.state);
    let lastState = game.state;
    const interval = setInterval(() => {
      if (game && game.state !== lastState) {
        lastState = game.state;
        setGameState(game.state);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [game]);

  const currentState = game ? game.state ?? gameState : "menu";
  const hideMenu = game && currentState !== "menu";

  if (hideMenu) return null;

  const _p1 = Boolean(player1Name.trim());
  const _p2 = vsAI || Boolean(player2Name.trim());
  const canPlay = guestExpanded && _p1 && _p2;

  const handlePlay = () => {
    if (!game || !canPlay) return;
    const p1 = player1Name.trim();
    const p2 = vsAI ? "AI" : player2Name.trim();
    game.setAIMode(vsAI, difficulty);
    game.startGame(p1, p2);
    setGameState("playing");
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" aria-hidden />

      <div className="relative z-10 w-full max-w-sm md:max-w-md flex flex-col gap-4 bg-greyish/90 border border-black/30 rounded-3xl px-6 py-5">
        <CorbenBold className="text-center text-base md:text-lg text-red-900">
          Game configuration
        </CorbenBold>

        <div className="flex items-center justify-between">
          <span className="text-[10px] md:text-xs text-shell font-corben">
            Play as guest
          </span>
          <button
            type="button"
            onClick={() => setGuestExpanded((e) => !e)}
            className={`px-3 py-1 rounded-2xl text-[10px] md:text-xs font-corben transition-colors
              ${
                guestExpanded
                  ? "bg-red-600 text-shell"
                  : "bg-greyish text-red-900 border border-red-600/40"
              }
            `}
          >
            {guestExpanded ? "Hide" : "Show"}
          </button>
        </div>

        {guestExpanded && (
          <div className="flex flex-col gap-4 mt-1">
            <CorbenBold className="text-center text-sm md:text-base text-red-900">
              Guest settings
            </CorbenBold>

            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="start-p1"
                  className="text-[10px] md:text-xs text-shell font-corben"
                >
                  Player 1
                </label>
                <LogInInput
                  placeholder="Name"
                  value={player1Name}
                  onChange={(e) => setPlayer1Name(e.target.value)}
                  className="static relative w-full h-7 md:h-9 xl:h-10"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] md:text-xs text-shell font-corben">
                  Mode
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setVsAI(false);
                      if (game) game.setAIMode(false);
                    }}
                    className={`px-3 py-1 rounded-2xl text-[10px] md:text-xs font-corben transition-colors
                      ${
                        !vsAI
                          ? "bg-red-600 text-shell"
                          : "bg-greyish text-red-900 border border-red-600/40"
                      }
                    `}
                  >
                    VS Human
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setVsAI(true);
                      if (game) game.setAIMode(true, difficulty);
                    }}
                    className={`px-3 py-1 rounded-2xl text-[10px] md:text-xs font-corben transition-colors
                      ${
                        vsAI
                          ? "bg-red-600 text-shell"
                          : "bg-greyish text-red-900 border border-red-600/40"
                      }
                    `}
                  >
                    VS AI
                  </button>
                </div>
              </div>

              {vsAI ? (
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="start-difficulty"
                    className="text-[10px] md:text-xs text-shell font-corben"
                  >
                    Difficulty
                  </label>
                  <select
                    id="start-difficulty"
                    value={difficulty}
                    onChange={(e) => {
                      const d = e.target.value;
                      setDifficulty(d);
                      if (game) game.setAIMode(true, d);
                    }}
                    className="flex-1 rounded-2xl bg-greyish text-red-900 text-[10px] md:text-xs px-2 py-1 border border-red-600/40 focus:outline-none focus:ring-2 focus:ring-red-600/60"
                  >
                    <option value="easy">Easy</option>
                    <option value="normal">Normal</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="start-p2"
                    className="text-[10px] md:text-xs text-shell font-corben"
                  >
                    Player 2
                  </label>
                  <LogInInput
                    placeholder="Name"
                    value={player2Name}
                    onChange={(e) => setPlayer2Name(e.target.value)}
                    className="static relative w-full h-7 md:h-9 xl:h-10"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={handlePlay}
          disabled={!canPlay || !game}
          className="mt-2 w-full flex items-center justify-center rounded-2xl bg-red-600 text-shell font-sixtyfour text-xl md:text-2xl py-2 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          PLAY
        </button>
      </div>
    </div>
  );
}
