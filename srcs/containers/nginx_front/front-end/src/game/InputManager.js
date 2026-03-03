export class InputManager {
	/**
	 * Tracks keyboard state and exposes helpers for both human and AI input.
	 * Keys currently held are recorded in `keys`, while `keysPressed` stores
	 * keys that were pressed since the last frame so you can detect edges.
	 */
	constructor(targetElement = window) {
		// Sets of key codes for "held" and "just pressed" states
		this.keys = new Set();
		this.keysPressed = new Set();
		this.activeTouchZones = new Map(); // Map touch identifiers to active keys

		this.target = targetElement;
		// Guardar referencias a los handlers para poder limpiarlos
		this.keydownHandler = (e) => {
			this.keys.add(e.code);
			this.keysPressed.add(e.code);
		};

		this.keyupHandler = (e) => {
			this.keys.delete(e.code);
		};

		// Listen for DOM keydown events and update sets accordingly
		window.addEventListener('keydown', this.keydownHandler);

		// On keyup, remove the key from the held set
		window.addEventListener('keyup', this.keyupHandler);

		this.touchStartPositions = new Map();
		this.activeTouchZones = new Map();

		this.swipeThreshold = 40;
		this.swipeTimeLimit = 300;
		this.dashDuration = 120; // ms direction is held
		// Touch listeners
		 this.touchStartHandler = this.handleTouchStart.bind(this);
		this.touchMoveHandler = this.handleTouchMove.bind(this);
		this.touchEndHandler = this.handleTouchEnd.bind(this);

		// Touch listeners
		this.target.addEventListener('touchstart', this.touchStartHandler, { passive: false });
		this.target.addEventListener('touchmove', this.touchMoveHandler, { passive: false });
		this.target.addEventListener('touchend', this.touchEndHandler);
	}

	/**
	 * Returns true while a key is being held down.
	 *
	 * @param {string} code - KeyboardEvent.code for the key.
	 */
	isKeyPressed(code) {
		return this.keys.has(code);
	}

	/**
	 * Clears the "just pressed" state for a key after the game has handled it.
	 *
	 * @param {string} code - KeyboardEvent.code to consume.
	 */
	consumeKey(code) {
		this.keysPressed.delete(code);
	}

	/**
	 * Indicates whether a key was pressed since the last frame.
	 *
	 * @param {string} code - KeyboardEvent.code to query.
	 */
	wasKeyJustPressed(code) {
		return this.keysPressed.has(code);
	}

	/**
	 * Simulates a key press so AI can use the same input pathways as players.
	 *
	 * @param {string} code - KeyboardEvent.code to simulate.
	 */
	simulateKeyPress(code) {
		this.keys.add(code);
		this.keysPressed.add(code);
	}

	/**
	 * Simulates a key release, clearing any held state for that key.
	 *
	 * @param {string} code - KeyboardEvent.code to release.
	 */
	simulateKeyRelease(code) {
		this.keys.delete(code);
	}

	getTouchZone(x) {
		const width = window.innerWidth;
		const zone = Math.floor((x / width) * 4);
		return Math.min(zone, 3);
	}

	zoneToKey(zone) {
		switch (zone) {
			case 0: return 'KeyA';          // P1 left
			case 1: return 'KeyD';          // P1 right
			case 2: return 'ArrowLeft';     // P2 left
			case 3: return 'ArrowRight';    // P2 right
			default: return null;
		}
	}

	handleTouchStart(e) {
		const now = performance.now();

		for (let touch of e.changedTouches) {

			const zone = this.getTouchZone(touch.clientX);
			const key = this.zoneToKey(zone);
			if (!key) continue;

			// Store touch start info
			this.touchStartPositions.set(touch.identifier, {
				x: touch.clientX,
				time: now,
				zone: zone
			});

			this.simulateKeyPress(key);
			this.activeTouchZones.set(touch.identifier, key);
		}
	}

	handleTouchMove(e) {
		if (e.cancelable) {
			e.preventDefault();
		}

		for (let touch of e.changedTouches) {
			const oldKey = this.activeTouchZones.get(touch.identifier);
			const newZone = this.getTouchZone(touch.clientX);
			const newKey = this.zoneToKey(newZone);

			if (oldKey !== newKey) {
				if (oldKey) this.simulateKeyRelease(oldKey);
				if (newKey) this.simulateKeyPress(newKey);
				this.activeTouchZones.set(touch.identifier, newKey);
			}
		}
	}

	handleTouchEnd(e) {
    const now = performance.now();

    for (let touch of e.changedTouches) {
		const start = this.touchStartPositions.get(touch.identifier);
        if (!start) continue;

        const dx = touch.clientX - start.x;
        const dt = now - start.time;
        const absDx = Math.abs(dx);

        const player = start.zone < 2 ? 'p1' : 'p2';
        const movementKey = this.zoneToKey(start.zone);

        // ---- SWIPE (DASH) ----
        if (absDx > this.swipeThreshold && dt < this.swipeTimeLimit) {
            const directionKey =
                dx < 0
                    ? (player === 'p1' ? 'KeyA' : 'ArrowLeft')
                    : (player === 'p1' ? 'KeyD' : 'ArrowRight');

            const dashKey = player === 'p1' ? 'Space' : 'ShiftRight';

            // Trigger dash: press dash key briefly
            this.simulateKeyPress(dashKey);
            this.simulateKeyRelease(dashKey);

            // Hold movement direction briefly for dash
            this.simulateKeyPress(directionKey);
            setTimeout(() => this.simulateKeyRelease(directionKey), this.dashDuration);
        }
        // If the finger lifted, release movement key
        this.simulateKeyRelease(movementKey);

        // Cleanup
        this.touchStartPositions.delete(touch.identifier);
        this.activeTouchZones.delete(touch.identifier);
    }
}

	/**
	 * Limpia los event listeners para evitar memory leaks.
	 */
	cleanup() {
		if (this.keydownHandler) {
			window.removeEventListener('keydown', this.keydownHandler);
		}
		if (this.keyupHandler) {
			window.removeEventListener('keyup', this.keyupHandler);
		}
		this.keys.clear();
		this.keysPressed.clear();
	}
}

