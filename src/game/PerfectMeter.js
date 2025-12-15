export class PerfectMeter {
	/**
	 * Tracks a numeric "perfect" meter and exposes a smoothed display value.
	 *
	 * @param {number} [max=9] - Maximum meter capacity.
	 */
	constructor(max = 9) {
		// Logical meter range and instantaneous value
		this.max = max;
		this.value = 0;

		// Smoothed value used for visual interpolation
		this.visualValue = 0;
		this.speed = 8;

		this.animated = 0;
	}

	/**
	 * Increases the meter by a given amount, clamping to max.
	 *
	 * @param {number} [amount=1] - Amount of meter to add.
	 */
	add(amount = 1) {
		this.value = Math.min(this.max, this.value + amount);
	}

	/**
	 * Attempts to spend meter; returns false if insufficient.
	 *
	 * @param {number} amount - Amount to consume.
	 * @returns {boolean} True when the meter had enough to spend.
	 */
	consume(amount) {
		if (this.value < amount) return false;
		this.value -= amount;
		return true;
	}

	/**
	 * Resets meter values to an empty state.
	 */
	reset() {
		this.value = 0;
		this.animated = 0;
	}

	/**
	 * Smoothly animates `visualValue` toward the current logical value.
	 *
	 * @param {number} dt - Time elapsed since last update.
	 */
	update(dt) {
		if (this.visualValue < this.value) {
			this.visualValue = Math.min(
				this.value,
				this.visualValue + this.speed * dt
			);
		} else if (this.visualValue > this.value) {
			this.visualValue = Math.max(
				this.value,
				this.visualValue - this.speed * dt * 3
			);
		}
	}
}
