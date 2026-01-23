import { useEffect, useState } from "react";

export default function HUD({ game }) {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      forceUpdate(n => n + 1);
    }, 100);

    return () => clearInterval(id);
  }, []);

  const p1 = game.players[0];
  const p2 = game.players[1];

  return (
    <div id="ui-overlay">
      <PlayerUI player={p1} playerNum={1} game={game} />
      <CenterUI game={game} />
      <PlayerUI player={p2} playerNum={2} game={game} />
    </div>
  );
}
