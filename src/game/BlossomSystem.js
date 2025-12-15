// BlossomSystem - Free-falling blossoms with natural physics
export class BlossomSystem {
	/**
	 * Creates a system that manages spawning and simulating falling blossoms.
	 *
	 * @param {LaneSystem} laneSystem - Reference used to choose spawn lanes.
	 * @param {number} canvasWidth - Width of the game canvas.
	 * @param {number} canvasHeight - Height of the game canvas.
	 */
	constructor(laneSystem, canvasWidth, canvasHeight) {
		// Store references to layout and canvas bounds
		this.laneSystem = laneSystem;
		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;

		// Initialise blossom collection and spawn tuning
		this.blossoms = [];
		this.spawnTimer = 0;
		this.spawnInterval = 1.0;
		this.fallSpeed = 150;
		this.goldenChance = 0.1;

		// Track horizontal wind influence for all active blossoms
		this.windDrift = 0;
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
			this.windDrift = windDirection * 80;
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
			blossom.x += (Math.random() - 0.5) * 10 * deltaTime;

			// Rotate blossom sprite smoothly over time
			blossom.rotation += blossom.rotationSpeed * deltaTime;

			// Deactivate blossoms that have moved outside the play area
			if (blossom.y > this.canvasHeight + 50) {
				blossom.active = false;
			}
			if (blossom.x < -50 || blossom.x > this.canvasWidth + 50) {
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
			y: -30,
			spawnLane: laneIndex,
			active: true,
			golden: isGolden,
			size: isGolden ? 25 : 20,
			rotation: Math.random() * Math.PI * 2,
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
