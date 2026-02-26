// BlossomSystem - Free-falling blossoms with natural physics
import {
	BLOSSOM_SPAWN_INTERVAL,
	BLOSSOM_FALL_SPEED,
	BLOSSOM_GOLDEN_CHANCE,
	BLOSSOM_SIZE_NORMAL,
	BLOSSOM_SIZE_GOLDEN,
	BLOSSOM_WIND_DRIFT,
	BLOSSOM_SWAY_AMOUNT,
	BLOSSOM_SPAWN_Y,
	BLOSSOM_DESPAWN_Y_OFFSET,
	BLOSSOM_DESPAWN_X_OFFSET
} from './Constants.js';
import { SpriteLibrary } from './SpriteLibrary.js';

export class BlossomSystem {
	/**
	 * Creates a system that manages spawning and simulating falling blossoms.
	 *
	 * @param {LaneSystem} laneSystem - Reference used to choose spawn lanes.
	 * @param {number} canvasWidth - Width of the game canvas.
	 * @param {number} canvasHeight - Height of the game canvas.
	 * @param {SpriteLibrary} spriteLibrary - The theme of the game.
	 */
	constructor(laneSystem, canvasWidth, canvasHeight, spriteLibrary) {
		// Store references to layout and canvas bounds
		this.laneSystem = laneSystem;
		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;

		// Initialise blossom collection and spawn tuning
		this.blossoms = [];
		this.spawnTimer = 0;
		this.spawnInterval = BLOSSOM_SPAWN_INTERVAL;
		this.fallSpeed = BLOSSOM_FALL_SPEED;
		this.goldenChance = BLOSSOM_GOLDEN_CHANCE;

		// Track horizontal wind influence for all active blossoms
		this.windDrift = 0;
		this.spriteLibrary = spriteLibrary;
	}

	/**
	 * Advances all blossom timers and physics for the current frame.
	 *
	 * @param {number} deltaTime - Time elapsed since last update.
	 * @param {boolean} windActive - Whether wind is currently affecting blossoms.
	 * @param {number} windDirection - Direction of wind (-1 left, 1 right).
	 */
	update(deltaTime, windActive, windDirection) {
		// Progress spawn timer and create a new blossom when threshold is reached
		this.spawnTimer += deltaTime;
		if (this.spawnTimer >= this.spawnInterval) {
			this.spawnBlossom();
			this.spawnTimer = 0;
		}

		// Refresh wind drift based on current wind state
		if (windActive) {
			this.windDrift = windDirection * BLOSSOM_WIND_DRIFT;
		} else {
			this.windDrift *= 0.95;
		}

		// Step physics for each active blossom
		this.blossoms.forEach(blossom => {
			if (!blossom.active) return;

			// Apply vertical fall speed and horizontal wind drift
			blossom.y += this.fallSpeed * deltaTime;
			blossom.x += this.windDrift * deltaTime;

			// Add small random sway for a natural falling path
			blossom.x += (Math.random() - 0.5) * BLOSSOM_SWAY_AMOUNT * deltaTime;

			// Rotate blossom sprite smoothly over time
			const damping = 6; // higher = faster return

			if (this.spriteLibrary.theme === 'fishbowl') {

				if (windActive) {
					blossom.rotation += 2 * deltaTime * -windDirection;
				} else {
					blossom.rotation += (0 - blossom.rotation) * damping * deltaTime;
				}

			} else {
				blossom.rotation += blossom.rotationSpeed * deltaTime;
			}

			// Deactivate blossoms that have moved outside the play area
			if (blossom.y > this.canvasHeight + BLOSSOM_DESPAWN_Y_OFFSET) {
				blossom.active = false;
			}
			if (blossom.x < -BLOSSOM_DESPAWN_X_OFFSET || blossom.x > this.canvasWidth + BLOSSOM_DESPAWN_X_OFFSET) {
				blossom.active = false;
			}
		});

		// Remove inactive blossoms to keep the list compact
		this.blossoms = this.blossoms.filter(b => b.active);
	}

	/**
	 * Creates and stores a single new blossom at a random lane spawn position.
	 */
	spawnBlossom() {
		// Choose a random visual lane and map it to a spawn position
		const laneIndex = Math.floor(Math.random() * 3);
		const spawnPos = this.laneSystem.getRandomSpawnPosition(laneIndex);
		const isGolden = Math.random() < this.goldenChance;

		// Push a fully-configured blossom object into the active list
		this.blossoms.push({
			x: spawnPos.x,
			y: BLOSSOM_SPAWN_Y,
			spawnLane: laneIndex,
			active: true,
			golden: isGolden,
			size: isGolden ? BLOSSOM_SIZE_GOLDEN : BLOSSOM_SIZE_NORMAL,
			rotation: this.spriteLibrary.theme === 'fishbowl' ? 0 : Math.random() * Math.PI * 2,
			rotationSpeed: (Math.random() - 0.5) * 2,
			vx: (Math.random() - 0.5) * 20,
			vy: this.fallSpeed
		});
	}

	/**
	 * Returns the list of currently-tracked blossoms.
	 *
	 * @returns {Array<Object>} Active and inactive blossom entries.
	 */
	getBlossoms() {
		// Expose raw reference so callers can read and iterate blossoms
		return this.blossoms;
	}

	/**
	 * Clears all blossoms and resets transient simulation state.
	 */
	reset() {
		// Drop any existing blossoms from play
		this.blossoms = [];

		// Reset timers and wind influence so next round starts clean
		this.spawnTimer = 0;
		this.windDrift = 0;
	}
}
