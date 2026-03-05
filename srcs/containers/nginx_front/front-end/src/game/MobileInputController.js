export class MobileInputController {
  /**
   * Handles all touch-based input and optional on-screen buttons
   * for mobile devices. Communicates only through simulateKeyPress / simulateKeyRelease.
   *
   * @param {{
   *   targetElement: HTMLElement,
   *   isSinglePlayer?: boolean,
   *   simulateKeyPress: (code: string) => void,
   *   simulateKeyRelease: (code: string) => void
   * }} options
   */
  constructor({ targetElement, isSinglePlayer = false, simulateKeyPress, simulateKeyRelease }) {
    this.target = targetElement;
    this.isSinglePlayer = !!isSinglePlayer;
    this.simulateKeyPress = simulateKeyPress;
    this.simulateKeyRelease = simulateKeyRelease;

    this.touchStartPositions = new Map();
    this.activeTouchKeys = new Map();
    this.pressedKeys = new Set();           // source of truth
    this.keyToOverlayElement = new Map();   // key → overlay element mapping

    this.swipeThreshold = 40;
    this.swipeTimeLimit = 300;
    this.dashDuration = 120; // ms direction is held

    // Bind handlers
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    this.handleTouchCancel = this.handleTouchCancel.bind(this);

    // Attach touch listeners
    if (this.target) {
      this.target.addEventListener("touchstart", this.handleTouchStart, { passive: false });
      this.target.addEventListener("touchmove", this.handleTouchMove, { passive: false });
      this.target.addEventListener("touchend", this.handleTouchEnd);
      this.target.addEventListener("touchcancel", this.handleTouchCancel);
    }

    // Overlay buttons if touch supported
    const supportsTouch =
      typeof window !== "undefined" &&
      ("ontouchstart" in window || navigator.maxTouchPoints > 0);

    if (supportsTouch) {
      this.createOverlayButtons();
    }

    this.handleBlur = () => this.releaseAllKeys();
    window.addEventListener("blur", this.handleBlur);
    document.addEventListener("visibilitychange", this.handleBlur);
  }

  // --- Unified key press/release ---
  pressKey(code) {
    if (this.pressedKeys.has(code)) return;
    this.pressedKeys.add(code);
    this.simulateKeyPress(code);
    this.setKeyVisualState(code, true);
  }

  releaseKey(code) {
    if (!this.pressedKeys.has(code)) return;
    this.pressedKeys.delete(code);
    this.simulateKeyRelease(code);
    this.setKeyVisualState(code, false);
  }

  setKeyVisualState(code, isPressed) {
    const el = this.keyToOverlayElement.get(code);
    if (!el) return;
    if (isPressed) {
      el.style.background = "rgba(255,255,255,0.25)";
      el.style.transform = "scale(0.92)";
      el.style.borderColor = "rgba(255,255,255,0.5)";
    } else {
      el.style.background = "rgba(255,255,255,0.08)";
      el.style.transform = "";
      el.style.borderColor = "rgba(255,255,255,0.25)";
    }
  }

  releaseAllKeys() {
    for (const key of [...this.pressedKeys]) {
      this.releaseKey(key);
    }
    this.activeTouchKeys.clear();
    this.touchStartPositions.clear();
  }

  // --- Single/multi-player mode ---
  setSinglePlayerMode(isSinglePlayer) {
    const changed = this.isSinglePlayer !== !!isSinglePlayer;
    this.isSinglePlayer = !!isSinglePlayer;
    if (changed && this.controlsContainer) {
      this.destroyOverlay();
      this.createOverlayButtons();
    }
  }

  // --- Touch helpers ---
  handleTouchCancel(e) {
    for (let touch of e.changedTouches) {
      const activeKey = this.activeTouchKeys.get(touch.identifier);
      if (activeKey) this.releaseKey(activeKey);
      this.touchStartPositions.delete(touch.identifier);
      this.activeTouchKeys.delete(touch.identifier);
    }
  }

  getZoneInfo(x) {
    const width = (typeof window !== "undefined" && window.innerWidth) ||
                  (this.target && this.target.clientWidth) || 1;

    if (this.isSinglePlayer) {
      const half = width / 2;
      if (x < half) return { player: "p1", movementKey: "KeyA", dashKey: "Space", leftKey: "KeyA", rightKey: "KeyD" };
      return { player: "p1", movementKey: "KeyD", dashKey: "Space", leftKey: "KeyA", rightKey: "KeyD" };
    }

    const quarter = width / 4;
    if (x < quarter) return { player: "p1", movementKey: "KeyA", dashKey: "Space", leftKey: "KeyA", rightKey: "KeyD" };
    if (x < 2*quarter) return { player: "p1", movementKey: "KeyD", dashKey: "Space", leftKey: "KeyA", rightKey: "KeyD" };
    if (x < 3*quarter) return { player: "p2", movementKey: "ArrowLeft", dashKey: "ShiftRight", leftKey: "ArrowLeft", rightKey: "ArrowRight" };
    return { player: "p2", movementKey: "ArrowRight", dashKey: "ShiftRight", leftKey: "ArrowLeft", rightKey: "ArrowRight" };
  }

  handleTouchStart(e) {
    const now = performance.now();
    for (let touch of e.changedTouches) {
      const info = this.getZoneInfo(touch.clientX);
      if (!info) continue;
      if (this.isSinglePlayer && info.player === "p2") continue;

      this.touchStartPositions.set(touch.identifier, { x: touch.clientX, time: now, info });
      this.pressKey(info.movementKey);
      this.activeTouchKeys.set(touch.identifier, info.movementKey);
    }
  }

  handleTouchMove(e) {
    if (e.cancelable) e.preventDefault();
    for (let touch of e.changedTouches) {
      const start = this.touchStartPositions.get(touch.identifier);
      const oldKey = this.activeTouchKeys.get(touch.identifier);
      const info = this.getZoneInfo(touch.clientX);
      if (!info) continue;
      if (this.isSinglePlayer && info.player === "p2") continue;

      const newKey = info.movementKey;
      if (oldKey !== newKey) {
        if (oldKey) this.releaseKey(oldKey);
        if (newKey) this.pressKey(newKey);
        this.activeTouchKeys.set(touch.identifier, newKey);
      }
    }
  }

  handleTouchEnd(e) {
    const now = performance.now();
    for (let touch of e.changedTouches) {
      const start = this.touchStartPositions.get(touch.identifier);
      const activeKey = this.activeTouchKeys.get(touch.identifier);

      if (start) {
        const { info } = start;
        const dx = touch.clientX - start.x;
        const dt = now - start.time;
        const absDx = Math.abs(dx);

        // Swipe dash
        if (absDx > this.swipeThreshold && dt < this.swipeTimeLimit) {
          const directionKey = dx < 0 ? info.leftKey : info.rightKey;
          const dashKey = info.dashKey;

          this.pressKey(directionKey);
          this.pressKey(dashKey);
          this.releaseKey(dashKey);
          setTimeout(() => this.releaseKey(directionKey), this.dashDuration);
        }
      }

      if (activeKey) this.releaseKey(activeKey);

      this.touchStartPositions.delete(touch.identifier);
      this.activeTouchKeys.delete(touch.identifier);
    }
  }

  // --- Overlay buttons ---
  createOverlayIndicator(keys, positionStyle, label = "") {
    const el = document.createElement("div");
    el.textContent = label; // Arrow label
    const defaultBg = "rgba(255,255,255,0.08)";
    const defaultBorder = "rgba(255,255,255,0.25)";

    Object.assign(el.style, {
      position: "absolute",
      width: "72px",
      height: "72px",
      borderRadius: "50%",
      background: defaultBg,
      border: `1px solid ${defaultBorder}`,
      pointerEvents: "auto",
      touchAction: "none",
      userSelect: "none",
      WebkitUserSelect: "none",
      transition: "transform 0.1s ease, background 0.1s ease, border-color 0.1s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "36px",
      color: "#fff",
      fontWeight: "bold",
      ...positionStyle
    });

    const setPressed = (pressed) => {
      if (pressed) {
        el.style.background = "rgba(255,255,255,0.25)";
        el.style.transform = "scale(0.92)";
        el.style.borderColor = "rgba(255,255,255,0.5)";
      } else {
        el.style.background = defaultBg;
        el.style.transform = "";
        el.style.borderColor = defaultBorder;
      }
    };

    const onStart = (ev) => { ev.preventDefault(); setPressed(true); this.pressKey(keys.keyPress); };
    const onEnd = (ev) => { ev.preventDefault(); setPressed(false); this.releaseKey(keys.keyRelease); };
    const onCancel = (ev) => { ev.preventDefault(); setPressed(false); this.releaseKey(keys.keyRelease); };

    return { el, onStart, onEnd, onCancel };
  }

  createOverlayButtons() {
    this.destroyOverlay();

    const container = document.createElement("div");
    container.className = "mobile-controls-overlay";
    Object.assign(container.style, { position: "fixed", inset: "0", pointerEvents: "none", zIndex: "20" });
    this.controlsContainer = container;
    this.overlayButtons = [];

    const addButton = (keys, positionStyle, label) => {
      const { el, onStart, onEnd, onCancel } = this.createOverlayIndicator(keys, positionStyle, label);
      container.appendChild(el);
      el.addEventListener("touchstart", onStart, { passive: false });
      el.addEventListener("touchend", onEnd, { passive: false });
      el.addEventListener("touchcancel", onCancel, { passive: false });
      this.overlayButtons.push({ el, onStart, onEnd, onCancel });
      this.keyToOverlayElement.set(keys.keyPress, el);
      return el;
    };

    const P1_LEFT = { keyPress: "KeyA", keyRelease: "KeyA" };
    const P1_RIGHT = { keyPress: "KeyD", keyRelease: "KeyD" };
    const P2_LEFT = { keyPress: "ArrowLeft", keyRelease: "ArrowLeft" };
    const P2_RIGHT = { keyPress: "ArrowRight", keyRelease: "ArrowRight" };

    if (!this.isSinglePlayer) {
      this.leftButton = addButton(P1_LEFT, { bottom: "30%", left: "20%" }, "<");
      this.rightButton = addButton(P1_RIGHT, { bottom: "30%", left: "40%" }, ">");
      addButton(P2_LEFT, { bottom: "30%", right: "35%" }, "<");
      addButton(P2_RIGHT, { bottom: "30%", right: "15%" }, ">");
    } else {
      this.leftButton = addButton(P1_LEFT, { bottom: "30%", left: "20%" }, "<");
      this.rightButton = addButton(P1_RIGHT, { bottom: "30%", right: "20%" }, ">");
    }

    document.body.appendChild(container);
  }

  destroyOverlay() {
    if (!this.overlayButtons) return;
    for (const entry of this.overlayButtons) {
      entry.el.removeEventListener("touchstart", entry.onStart);
      entry.el.removeEventListener("touchend", entry.onEnd);
      entry.el.removeEventListener("touchcancel", entry.onCancel);
      entry.el.style.transform = "";
      entry.el.style.background = "";
      entry.el.style.borderColor = "";
    }
    this.overlayButtons = [];
    this.keyToOverlayElement.clear();

    if (this.controlsContainer && this.controlsContainer.parentNode) {
      this.controlsContainer.parentNode.removeChild(this.controlsContainer);
    }
    this.controlsContainer = null;
    this.leftButton = null;
    this.rightButton = null;
    this.dashButton = null;
  }

  destroy() {
    if (this.target) {
      this.target.removeEventListener("touchstart", this.handleTouchStart);
      this.target.removeEventListener("touchmove", this.handleTouchMove);
      this.target.removeEventListener("touchend", this.handleTouchEnd);
      this.target.removeEventListener("touchcancel", this.handleTouchCancel);
    }

    this.destroyOverlay();

    window.removeEventListener("blur", this.handleBlur);
    document.removeEventListener("visibilitychange", this.handleBlur);

    this.releaseAllKeys();
  }
}