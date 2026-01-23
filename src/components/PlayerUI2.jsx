export default function PlayerUI({ player, playerNum, game }) {
  const status = player.getAbilityStatus();

  return (
    <div className={`player-ui ${playerNum === 1 ? "left" : "right"}`}>
      <div>Score: {player.score}</div>
      <div>Perfect: {player.perfectMeter.value}/9</div>

      <button
        disabled={!status.reversePush.canUse}
        onClick={() => player.useAbility("reversePush")}
      >
        Reverse Push
      </button>

      <button
        disabled={!status.inkFreeze.canUse}
        onClick={() => {
          const r = player.useAbility("inkFreeze");
          if (r === "freeze") {
            game.handleAbility(player, "freeze", playerNum - 1);
          }
        }}
      >
        Ink Freeze
      </button>

      <button
        disabled={!status.momentumSurge.canUse}
        onClick={() => player.useAbility("momentumSurge")}
      >
        Momentum Surge
      </button>
    </div>
  );
}
