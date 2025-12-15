export class UIManager {
	/**
	 * Coordinates HTML UI elements with in-game state and events.
	 *
	 * @param {Game} game - Game instance used for callbacks and state reads.
	 */
	constructor(game) {
		// Store reference to the main game controller
		this.game = game;

		// Immediately register all button and mode listeners
		this.setupAbilityButtons();
	}

	/**
	 * Initialises any UI elements that depend on canvas size (currently noop).
	 */
	init(canvasWidth, canvasHeight) {
		// Intentionally left blank; canvas-relative UI moved to Game.js
	}

	/**
	 * Wires up DOM event handlers for ability buttons and mode toggles.
	 */
	setupAbilityButtons() {
		// Player 1 ability buttons
		document.getElementById('p1-ability-1').addEventListener('click', () => {
			if (this.game && this.game.state === 'playing') {
				this.game.players[0].useAbility('reversePush');
			}
		});
		document.getElementById('p1-ability-2').addEventListener('click', () => {
			if (this.game && this.game.state === 'playing') {
				const result = this.game.players[0].useAbility('inkFreeze');
				if (result === 'freeze') {
					this.game.handleAbility(this.game.players[0], 'freeze', 0);
				}
			}
		});
		document.getElementById('p1-ability-3').addEventListener('click', () => {
			if (this.game && this.game.state === 'playing') {
				this.game.players[0].useAbility('momentumSurge');
			}
		});

		// Player 2 ability buttons (disabled in AI mode)
		document.getElementById('p2-ability-1').addEventListener('click', () => {
			if (this.game && this.game.state === 'playing' && !this.game.aiMode) {
				this.game.players[1].useAbility('reversePush');
			}
		});
		document.getElementById('p2-ability-2').addEventListener('click', () => {
			if (this.game && this.game.state === 'playing' && !this.game.aiMode) {
				const result = this.game.players[1].useAbility('inkFreeze');
				if (result === 'freeze') {
					this.game.handleAbility(this.game.players[1], 'freeze', 1);
				}
			}
		});
		document.getElementById('p2-ability-3').addEventListener('click', () => {
			if (this.game && this.game.state === 'playing' && !this.game.aiMode) {
				this.game.players[1].useAbility('momentumSurge');
			}
		});

		// Mode selector buttons for VS Human / VS AI
		document.getElementById('vs-human-btn').addEventListener('click', () => {
			document.getElementById('vs-human-btn').classList.add('active');
			document.getElementById('vs-ai-btn').classList.remove('active');
			document.getElementById('ai-difficulty').classList.add('hidden');
			if (this.game) {
				this.game.setAIMode(false);
			}
		});

		document.getElementById('vs-ai-btn').addEventListener('click', () => {
			document.getElementById('vs-ai-btn').classList.add('active');
			document.getElementById('vs-human-btn').classList.remove('active');
			document.getElementById('ai-difficulty').classList.remove('hidden');
			const difficulty = document.getElementById('ai-difficulty-select').value;
			if (this.game) {
				this.game.setAIMode(true, difficulty);
			}
		});

		document.getElementById('ai-difficulty-select').addEventListener('change', (e) => {
			if (this.game && this.game.aiMode) {
				this.game.setAIMode(true, e.target.value);
			}
		});
	}

	/**
	 * Updates score, meters, round info, ability buttons and wind UI.
	 *
	 * @param {Array<Player>} players - Player list.
	 * @param {RoundSystem} roundSystem - Round system for round/time state.
	 * @param {WindSystem} windSystem - Wind system for gust status.
	 * @param {number} deltaTime - Frame delta (unused but available).
	 */
	update(players, roundSystem, windSystem, deltaTime) {
		// Refresh both player score readouts
		document.getElementById('p1-score').textContent = players[0].score;
		document.getElementById('p2-score').textContent = players[1].score;

		// Keep the numeric perfect meter values in sync
		document.getElementById('p1-meter-value').textContent =
			`${players[0].perfectMeter.value}`;

		document.getElementById('p2-meter-value').textContent =
			`${players[1].perfectMeter.value}`;

		// Display current round index
		document.getElementById('round-number').textContent = roundSystem.getCurrentRound();

		// Show time remaining in the current round
		document.getElementById('timer').textContent = roundSystem.getTimeRemaining();

		// Refresh ability button enabled/ready states
		this.updateAbilityButtons(players[0], 1);
		this.updateAbilityButtons(players[1], 2);

		// Show or hide the wind gust indicator text
		this.updateWindIndicator(windSystem);
	}

	/**
	 * Enables/disables and highlights ability buttons based on player state.
	 *
	 * @param {Player} player - Player whose abilities are represented.
	 * @param {number} playerNum - UI player index (1 or 2).
	 */
	updateAbilityButtons(player, playerNum) {
		const status = player.getAbilityStatus();

		const btn1 = document.getElementById(`p${playerNum}-ability-1`);
		const btn2 = document.getElementById(`p${playerNum}-ability-2`);
		const btn3 = document.getElementById(`p${playerNum}-ability-3`);

		// Reverse Push (3 PM)
		if (status.reversePush.canUse) {
			btn1.disabled = false;
			btn1.classList.add('ready');
		} else {
			btn1.disabled = true;
			btn1.classList.remove('ready');
		}

		// Ink Freeze (6 PM)
		if (status.inkFreeze.canUse) {
			btn2.disabled = false;
			btn2.classList.add('ready');
		} else {
			btn2.disabled = true;
			btn2.classList.remove('ready');
		}

		// Momentum Surge (9 PM)
		if (status.momentumSurge.canUse) {
			btn3.disabled = false;
			btn3.classList.add('ready');
		} else {
			btn3.disabled = true;
			btn3.classList.remove('ready');
		}
	}

	/**
	 * Updates the textual wind indicator element based on gust status.
	 *
	 * @param {WindSystem} windSystem - Wind system to sample from.
	 */
	updateWindIndicator(windSystem) {
		const statusEl = document.getElementById('game-status');

		if (windSystem.isActive()) {
			const direction = windSystem.getDirection() === -1 ? '←' : '→';
			statusEl.textContent = `Wind Gust ${direction}`;
			statusEl.style.color = '#4a90e2';
		} else {
			statusEl.textContent = '';
		}
	}

	/**
	 * Displays the final end-of-game message once a winner is decided.
	 *
	 * @param {number} winner - 1 or 2 for winning player, or 0 for a tie.
	 */
	showGameEnd(winner) {
		const statusEl = document.getElementById('game-status');
		if (winner === 0) {
			statusEl.textContent = 'Tie Game!';
		} else {
			statusEl.textContent = `Player ${winner} Wins!`;
		}
		statusEl.style.color = '#d4af37';
		statusEl.style.fontSize = '32px';
	}

	/**
	 * Perfect meters are now rendered directly in `Game.render` and not here.
	 */
}
