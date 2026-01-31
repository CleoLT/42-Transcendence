export class WindSystem {
	/**
	 * Controls intermittent wind gusts which influence blossom trajectories.
	 */
	constructor() {
		// Core wind state flags and direction
		this.active = false;
		this.direction = 0;

		// Timers for current gust and time between gusts
		this.timer = 0;
		this.duration = 0;
		this.cooldown = 0;
		this.minCooldown = 10;
		this.maxCooldown = 20;
		this.gustDuration = 3;
	}

	/**
	 * Advances gust timers and starts or ends gusts as needed.
	 *
	 * @param {number} deltaTime - Time step since last update.
	 */
	update(deltaTime) {
		if (this.active) {
			this.timer -= deltaTime;
			if (this.timer <= 0) {
				this.active = false;
				this.cooldown = this.minCooldown + Math.random() * (this.maxCooldown - this.minCooldown);
			}
		} else {
			this.cooldown -= deltaTime;
			if (this.cooldown <= 0) {
				this.triggerGust();
			}
		}
	}

	/**
	 * Starts a new gust with a randomly chosen left/right direction.
	 */
	triggerGust() {
		this.active = true;
		this.direction = Math.random() < 0.5 ? -1 : 1;
		this.timer = this.gustDuration;
	}

	/**
	 * Indicates whether a gust is currently active.
	 */
	isActive() {
		return this.active;
	}

	/**
	 * Returns the current wind direction (-1, 0 or 1).
	 */
	getDirection() {
		return this.direction;
	}

	/**
	 * Clears active gust state and schedules the next gust randomly.
	 */
	reset() {
		this.active = false;
		this.cooldown = this.minCooldown + Math.random() * (this.maxCooldown - this.minCooldown);
	}
}

