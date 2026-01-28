import { useEffect, useState } from "react";
import LoginForm from "./loginForm";

const GOLD = "#e8ddaa";
const OVAL_BG = "#ff0000";

export default function StartScreen({ game }) {
  const [showLogin, setShowLogin] = useState(false);
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

  const overlayClasses =
    "absolute inset-0 z-[1000] flex items-center justify-center";

  return (
    <div id="start-screen-overlay" className={overlayClasses}>
      <div className="absolute inset-0 start-screen-paper-bg" aria-hidden />
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
      />

      {showLogin ? (
        <div className="relative z-10 flex flex-col items-center gap-4 max-w-sm w-[90%]">
          <div
            className="w-full rounded-2xl px-6 py-6 shadow-lg border border-black/10"
            style={{ backgroundColor: "#f5f0e6" }}
          >
            <h2
              className="font-baskerville font-bold text-center mb-4 text-lg"
              style={{ color: "#5c5346" }}
            >
              Sign in
            </h2>
            <div className="flex flex-col items-center">
              <LoginForm center />
            </div>
            <button
              type="button"
              onClick={() => setShowLogin(false)}
              className="mt-4 w-full py-2 rounded-lg border border-black/20 text-sm font-baskerville font-bold hover:bg-black/5 transition-colors"
              style={{ color: "#5c5346" }}
            >
              Back
            </button>
          </div>
        </div>
      ) : (
        <div
          id="start-screen"
          className="start-screen-oval relative z-10 flex flex-col items-center justify-center px-8 py-8 min-w-[320px] w-[min(90vw,520px)] shadow-xl overflow-y-auto"
          style={{ backgroundColor: OVAL_BG }}
        >
          {!game ? (
            <p
              className="font-baskerville font-bold text-lg"
              style={{ color: GOLD }}
            >
              Loading game…
            </p>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setGuestExpanded((e) => !e)}
                className={`font-baskerville font-bold text-[1rem] tracking-wide transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/40 rounded px-2 py-1 ${
                  guestExpanded ? "opacity-100 ring-2 ring-offset-2 ring-offset-[#1a0f2e] ring-white/50" : "hover:opacity-90"
                }`}
                style={{ color: GOLD }}
              >
                Guest
              </button>

              {guestExpanded && (
                <div className="w-full max-w-xs flex flex-col gap-3 mt-3 mb-2">
                  <div>
                    <label
                      htmlFor="start-p1"
                      className="block font-baskerville text-xs font-bold mb-0.5"
                      style={{ color: GOLD }}
                    >
                      Player 1
                    </label>
                    <input
                      id="start-p1"
                      type="text"
                      value={player1Name}
                      onChange={(e) => setPlayer1Name(e.target.value)}
                      placeholder="Name"
                      maxLength={20}
                      className="w-full px-3 py-1.5 rounded border bg-white/10 text-white placeholder-white/50 border-white/30 text-sm focus:outline-none focus:ring-1 focus:ring-white/50"
                    />
                  </div>
                  <div className="flex gap-2 items-center">
                    <span
                      className="font-baskerville text-xs font-bold shrink-0"
                      style={{ color: GOLD }}
                    >
                      Mode
                    </span>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setVsAI(false);
                          if (game) game.setAIMode(false);
                        }}
                        className={`px-2 py-1 rounded text-xs font-baskerville font-bold transition-colors ${
                          !vsAI
                            ? "bg-white/25 text-white"
                            : "bg-white/5 text-white/70 hover:bg-white/10"
                        }`}
                      >
                        VS Human
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setVsAI(true);
                          if (game) game.setAIMode(true, difficulty);
                        }}
                        className={`px-2 py-1 rounded text-xs font-baskerville font-bold transition-colors ${
                          vsAI
                            ? "bg-white/25 text-white"
                            : "bg-white/5 text-white/70 hover:bg-white/10"
                        }`}
                      >
                        VS AI
                      </button>
                    </div>
                  </div>
                  {vsAI ? (
                    <div className="flex gap-2 items-center">
                      <label
                        htmlFor="start-difficulty"
                        className="font-baskerville text-xs font-bold shrink-0"
                        style={{ color: GOLD }}
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
                        className="flex-1 px-2 py-1 rounded border bg-white/10 text-white border-white/30 text-sm focus:outline-none focus:ring-1 focus:ring-white/50"
                      >
                        <option value="easy">Easy</option>
                        <option value="normal">Normal</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>
                  ) : (
                    <div>
                      <label
                        htmlFor="start-p2"
                        className="block font-baskerville text-xs font-bold mb-0.5"
                        style={{ color: GOLD }}
                      >
                        Player 2
                      </label>
                      <input
                        id="start-p2"
                        type="text"
                        value={player2Name}
                        onChange={(e) => setPlayer2Name(e.target.value)}
                        placeholder="Name"
                        maxLength={20}
                        className="w-full px-3 py-1.5 rounded border bg-white/10 text-white placeholder-white/50 border-white/30 text-sm focus:outline-none focus:ring-1 focus:ring-white/50"
                      />
                    </div>
                  )}
                </div>
              )}

              <button
                type="button"
                onClick={handlePlay}
                disabled={!canPlay}
                className="font-sixtyfour text-2xl sm:text-3xl md:text-4xl tracking-tighter rounded px-2 py-1 mt-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1a0f2e] focus:ring-white/40 disabled:opacity-40 disabled:cursor-not-allowed enabled:hover:opacity-90 transition-opacity"
                style={{
                  color: GOLD,
                  fontFamily: "'Sixtyfour', sans-serif",
                  textShadow: "0 0 12px rgba(232, 221, 170, 0.5), 0 0 24px rgba(232, 221, 170, 0.25)",
                }}
              >
                PLAY
              </button>
              <button
                type="button"
                onClick={() => setShowLogin(true)}
                className="font-baskerville font-bold text-sm mt-1 tracking-wide hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1a0f2e] focus:ring-white/40 rounded px-2 py-1"
                style={{ color: GOLD }}
              >
                Sign in
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
