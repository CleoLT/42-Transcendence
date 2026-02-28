export default function GameCanvas({ onGameRef }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    const game = new Game(canvas, ctx);
    if (onGameRef) onGameRef(game); // ← importante

    const input = new InputManager();
    let last = performance.now();
    let running = true;

    game.init().finally(() => {
      function loop(t) {
        if (!running) return;
        const dt = (t - last) / 1000;
        last = t;
        game.update(dt, input);
        game.render(ctx);
        requestAnimationFrame(loop);
      }
      requestAnimationFrame(loop);
    });

    return () => { running = false };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full block" />
}
