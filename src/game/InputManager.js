export class InputManager {
	/**
	 * Tracks keyboard state and exposes helpers for both human and AI input.
	 * Keys currently held are recorded in `keys`, while `keysPressed` stores
	 * keys that were pressed since the last frame so you can detect edges.
	 */
	constructor() {
		// Sets of key codes for "held" and "just pressed" states
		this.keys = new Set();
		this.keysPressed = new Set();

		// Listen for DOM keydown events and update sets accordingly
		window.addEventListener('keydown', (e) => {
			this.keys.add(e.code);
			this.keysPressed.add(e.code);
		});

		// On keyup, remove the key from the held set
		window.addEventListener('keyup', (e) => {
			this.keys.delete(e.code);
		});
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
}

