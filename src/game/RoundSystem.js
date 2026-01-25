export class RoundSystem {
	/**
	 * Handles timed rounds and determines winners across multiple rounds.
	 *
	 * @param {Array<Player>} players - Players whose scores drive the outcome.
	 */
	constructor(players) {
		// Store participants and configure round rules
		this.players = players;
		this.currentRound = 0;
		this.maxRounds = 2;
		this.roundTime = 20;
		this.timeRemaining = 0;
		this.roundActive = false;

		// Historical per-round score snapshots (for UI / debug)
		this.roundScores = [];
	}

	/**
	 * Starts a new round and resets the internal timer.
	 */
	startRound() {
		// Advance the round count and enable timers
		this.currentRound++;
		this.timeRemaining = this.roundTime;
		this.roundActive = true;
	}

	/**
	 * Advances the round timer and signals when the round ends.
	 *
	 * @param {number} deltaTime - Time step for this update.
	 * @returns {'idle'|'playing'|'roundEnd'} Current round state hint.
	 */
	update(deltaTime) {
		if (!this.roundActive) return 'idle';

		this.timeRemaining -= deltaTime;

		if (this.timeRemaining <= 0) {
			this.endRound();
			return 'roundEnd';
		}

		return 'playing';
	}

	/**
	 * Finalises the current round and records a score snapshot.
	 */
	endRound() {
		this.roundActive = false;

		// Snapshot cumulative scores at the end of the round
		this.roundScores.push({
			round: this.currentRound,
			player1: this.players[0].score,
			player2: this.players[1].score
		});
	}

	/**
	 * Returns true once the configured number of rounds has been played.
	 */
	isGameComplete() {
		return this.currentRound >= this.maxRounds;
	}

	/**
	 * Computes the overall winner across all rounds based on score.
	 *
	 * @returns {number} 1 or 2 for winner, or 0 for a tie.
	 */
	getWinner() {
		// Use the current cumulative scores for both players
		const total1 = this.players[0].score;
		const total2 = this.players[1].score;

		if (total1 > total2) return 1;
		if (total2 > total1) return 2;
		return 0; // Tie
	}

	/**
	 * Returns the index of the current round (1-based).
	 */
	getCurrentRound() {
		return this.currentRound;
	}

	/**
	 * Returns the whole seconds remaining in the current round (never < 0).
	 */
	getTimeRemaining() {
		return Math.max(0, Math.ceil(this.timeRemaining));
	}
}

