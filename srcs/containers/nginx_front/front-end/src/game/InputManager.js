import { MobileInputController } from "./MobileInputController.js";

export class InputManager {
	/**
	 * Tracks keyboard state and exposes helpers for both human and AI input.
	 * Keys currently held are recorded in `keys`, while `keysPressed` stores
	 * keys that were pressed since the last frame so you can detect edges.
	 *
	 * Touch input is delegated to `MobileInputController`, which is completely
	 * decoupled from game logic and only talks to this manager via
	 * `simulateKeyPress` / `simulateKeyRelease`.
	 *
	 * @param {HTMLElement|Window} targetElement - Element to listen for input on.
	 * @param {{ isSinglePlayer?: boolean }} options
	 */
	constructor(targetElement = window, options = {}) {
		// Sets of key codes for "held" and "just pressed" states
		this.keys = new Set();
		this.keysPressed = new Set();

		this.target = targetElement;
		this.isSinglePlayer = Boolean(options.isSinglePlayer);

		// Keyboard handlers
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

		// Touch / mobile controls (only when device actually supports touch)
		const supportsTouch =
			typeof window !== "undefined" &&
			("ontouchstart" in window || navigator.maxTouchPoints > 0);

		if (supportsTouch && this.target) {
			this.mobileInput = new MobileInputController({
				targetElement: this.target,
				isSinglePlayer: this.isSinglePlayer,
				simulateKeyPress: (code) => this.simulateKeyPress(code),
				simulateKeyRelease: (code) => this.simulateKeyRelease(code),
			});
		} else {
			this.mobileInput = null;
		}
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
	 * Simulates a key press so AI and touch can use the same
	 * input pathways as players.
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

	/**
	 * Updates single-player / multi-player touch behaviour.
	 * When in single-player (vs AI), the full screen controls Player 1 and
	 * Player 2 never receives touch input.
	 *
	 * @param {boolean} isSinglePlayer
	 */
	setSinglePlayerMode(isSinglePlayer) {
		this.isSinglePlayer = Boolean(isSinglePlayer);
		if (this.mobileInput?.setSinglePlayerMode) {
			this.mobileInput.setSinglePlayerMode(this.isSinglePlayer);
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

		if (this.mobileInput && typeof this.mobileInput.destroy === "function") {
			this.mobileInput.destroy();
			this.mobileInput = null;
		}

		this.keys.clear();
		this.keysPressed.clear();
	}
}

