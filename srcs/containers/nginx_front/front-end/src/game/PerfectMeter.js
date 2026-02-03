import { PERFECT_METER_MAX } from './Constants.js';

export class PerfectMeter {
	constructor(max = PERFECT_METER_MAX) {
		this.max = max;
		this.value = 0;
	}

	add(amount = 1) {
		this.value = Math.min(this.max, this.value + amount);
	}

	consume(amount = 1) {
		if (this.value < amount) return false;
		this.value -= amount;
		return true;
	}

	reset() {
		this.value = 0;
	}
}
