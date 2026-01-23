import { Player } from './Player.js';
import { LaneSystem } from './LaneSystem.js';
import { BlossomSystem } from './BlossomSystem.js';
import { WindSystem } from './WindSystem.js';
import { RoundSystem } from './RoundSystem.js';
// import { UIManager } from './UIManager.js';
import { Renderer } from './Renderer.js';
import { AI } from './AI.js';
import { SpriteLibrary } from './SpriteLibrary.js';
import { LaneTint } from './LaneTint.js';
import { PerfectMeter } from './PerfectMeter.js';
import { InputManager } from './InputManager.js';

export class Game {
	/**
	 * Sets up core references and high-level game state containers.
	 *
	 * @param {HTMLCanvasElement} canvas - Canvas used for rendering.
	 * @param {CanvasRenderingContext2D} ctx - 2D drawing context.
	 */
	constructor(canvas, ctx) {
		// Store drawing surfaces
		this.canvas = canvas;
		this.ctx = ctx;

		// Track global game state and shared systems
		this.state = 'menu';
		this.players = [];
		this.laneSystem = null;
		this.blossomSystem = null;
		this.windSystem = null;
		this.roundSystem = null;
		// this.uiManager = null;
		this.renderer = null;
		this.perfectCatchEffects = [];
		this.missEffects = []; // Water stain effects for misses
		this.ai = null;
		this.aiDifficulty = 'easy';
		this.aiMode = false;
		this.spriteLibrary = null;
		this.laneTint = null;
	}

	/**
	 * Asynchronously loads sprites and instantiates all game subsystems.
	 */
	async init() {
		// Create two players anchored to canvas dimensions
		this.players = [
			new Player(1, 'left', this.canvas.width, this.canvas.height),
			new Player(2, 'right', this.canvas.width, this.canvas.height)
		];
		this.players.forEach(p => {
			p.perfectMeter = new PerfectMeter(9);
		});

		// Build and populate sprite library used by the renderer
		this.spriteLibrary = new SpriteLibrary();
		await this.spriteLibrary.loadSprites();

		// Construct world systems for lanes, blossoms, wind, rounds and UI
		this.laneSystem = new LaneSystem(this.canvas.width, this.canvas.height);
		this.laneTint = new LaneTint(this.laneSystem, this.canvas.width, this.canvas.height);
		this.blossomSystem = new BlossomSystem(this.laneSystem, this.canvas.width, this.canvas.height);
		this.windSystem = new WindSystem();
		this.roundSystem = new RoundSystem(this.players);
		// this.uiManager = new UIManager(this);
		// this.uiManager.init(this.canvas.width, this.canvas.height);
		this.renderer = new Renderer(this.ctx, this.canvas.width, this.canvas.height, this.spriteLibrary, this.laneTint);

		// Seed starting lane ownership so the UI has clear sides
		this.laneSystem.lanes[0].owner = 1;
		this.laneSystem.lanes[2].owner = 2;

		// Wire up input needed at the game level (e.g. start-from-menu)
		this.setupEventListeners();
	}

	/**
	 * Enables or disables AI control for player 2 at a given difficulty.
	 *
	 * @param {boolean} enabled - Whether AI should be active.
	 * @param {'easy' | 'normal' | 'hard'} [difficulty='easy'] - Difficulty preset.
	 */
	setAIMode(enabled, difficulty = 'easy') {
		// Record mode and difficulty settings
		this.aiMode = enabled;
		this.aiDifficulty = difficulty;

		// Create or clear AI controller based on current toggle
		if (enabled) {
			this.ai = new AI(this.players[1], difficulty, this.canvas.width, this.canvas.height);
		} else {
			this.ai = null;
		}
	}

	/**
	 * Registers high-level DOM event listeners that affect game state.
	 */
	setupEventListeners() {
		// Guardar referencia al handler para poder limpiarlo
		this.spaceKeyHandler = (e) => {
			if (e.code === 'Space' && this.state === 'menu') {
				this.startGame();
			}
		};
		
		// Start the game from the menu when space is pressed
		document.addEventListener('keydown', this.spaceKeyHandler);
	}

	/**
	 * Limpia los event listeners del juego.
	 */
	cleanup() {
		if (this.spaceKeyHandler) {
			document.removeEventListener('keydown', this.spaceKeyHandler);
			this.spaceKeyHandler = null;
		}
	}

	/**
	 * Moves the game from the menu state into active play.
	 */
	startGame() {
		// Switch state and hide menu overlay
		this.state = 'playing';
		document.getElementById('start-screen').classList.add('hidden');

		// Begin the first round
		this.roundSystem.startRound();
	}

	/**
	 * Main per-frame update that advances all game systems.
	 *
	 * @param {number} dt - Delta time for this frame.
	 * @param {InputManager} inputManager - Shared input manager instance.
	 */
	update(dt, inputManager) {
		// Cache the input manager for use by players and AI
		if (!this.inputManager) {
			this.inputManager = inputManager;
		}

		// Advance player movement, abilities, and meters
		this.players.forEach((player, index) => {
			const otherPlayer = this.players[1 - index];
			player.update(dt, this.inputManager, this.laneSystem, otherPlayer);
			player.perfectMeter.update(dt);
		});

		// Tick wind and blossom simulation before collision checks
		if (this.windSystem) {
			this.windSystem.update(dt);
		}
		const windActive = this.windSystem.isActive();
		const windDirection = this.windSystem.getDirection();
		this.blossomSystem.update(dt, windActive, windDirection);

		// Progress round timer and detect end-of-round transitions
		if (this.roundSystem && this.state === 'playing') {
			const status = this.roundSystem.update(dt);
			if (status === 'roundEnd') {
				this.handleRoundEnd();
			}
		}

		// Fade lane tints smoothly towards their target appearance
		if (this.laneTint) {
			this.laneTint.update(dt);
		}

		// Resolve blossom–player collisions and misses
		this.checkCollisions();

		// Apply push interactions when players are overlapping
		if (this.inputManager) {
			this.checkPushes(this.inputManager);
		}

		// Drive AI decisions and input when enabled
		if (this.aiMode && this.ai && this.state === 'playing') {
			this.ai.update(
				dt,
				this.blossomSystem.getBlossoms(),
				this.players[0],
				this.laneSystem,
				this.windSystem,
				this.inputManager
			);
			this.ai.getMovementInput(this.inputManager);
		}

		// Animate and fade perfect catch feedback sprites
		this.perfectCatchEffects.forEach(e => {
			e.timer -= dt;
			e.alpha = e.timer / 0.6;
			e.scale = 1 + (1 - e.alpha) * 0.3;
		});

		this.perfectCatchEffects =
			this.perfectCatchEffects.filter(e => e.timer > 0);

		// Animate and fade miss (water stain) effects
		this.missEffects.forEach(e => {
			e.timer -= dt;
			e.alpha = Math.max(0, e.timer / 2.0);
		});

		this.missEffects = this.missEffects.filter(e => e.timer > 0);

		// Refresh UI overlays tied to players, rounds and wind
		// if (this.uiManager && this.state === 'playing') {
		// 	this.uiManager.update(this.players, this.roundSystem, this.windSystem, dt);
		// }
	}

	/**
	 * Detects interactions between players and blossoms and routes them
	 * into catch or miss handling.
	 */
	checkCollisions() {
		// Grab the current blossom list once for this frame
		const blossoms = this.blossomSystem.getBlossoms();

		// Test each blossom against all players
		blossoms.forEach(blossom => {
			if (!blossom.active) return;

			this.players.forEach(player => {
				// Skip players that are temporarily unable to catch
				if (!player.canCatch()) return;

				// Use bowl hitbox to check if blossom is inside catch radius
				if (player.containsPoint(blossom.x, blossom.y)) {
					// Determine which visual lane this blossom fell into
					const laneRegion = this.laneSystem.getLaneRegionForPoint(blossom.x);

					// Evaluate whether this counts as a perfect catch based on
					// the blossom's position relative to the bowl centre.
					const isPerfect = this.isPerfectCatch(player, blossom.x);

					// Resolve scoring and lane ownership and consume the blossom
					this.handleCatch(player, blossom, isPerfect, laneRegion);
					blossom.active = false;
				}
			});

			// Handle blossoms that fall beyond the canvas as misses
			if (blossom.y > this.canvas.height + 20) {
				this.handleMiss(blossom);
				blossom.active = false;
			}
		});
	}

	/**
	 * Returns true when the blossom's X position is within the "perfect"
	 * horizontal band above the centre of the player's bowl, independent of
	 * lane layout. Visually this corresponds to the inner `[--xx--]` portion
	 * of the bowl width.
	 *
	 * @param {Player} player - Player attempting the catch.
	 * @param {number} blossomX - Blossom X coordinate at catch time.
	 */
	isPerfectCatch(player, blossomX) {
		// Measure horizontal distance from bowl centre
		const dx = Math.abs(blossomX - player.getX());

		// Treat only the inner portion of the bowl as a perfect window.
		// Example: with factor 0.4, the perfect width is 80% of the bowl
		// diameter centred on the bowl.
		const radius = player.getRadius();
		const perfectFactor = 0.2;
		const perfectHalfWidth = radius * perfectFactor;

		return dx <= perfectHalfWidth;
	}

	/**
	 * Rewards a successful catch and updates lane state and FX.
	 *
	 * @param {Player} player - Player that performed the catch.
	 * @param {Object} blossom - The blossom that was caught.
	 * @param {boolean} isPerfect - Whether the catch was in the lane center.
	 * @param {number} laneRegion - Index of lane region for this blossom.
	 */
	handleCatch(player, blossom, isPerfect, laneRegion) {
		// Work out lane-based bonus multiplier for this player
		const lanePoints = this.laneSystem.lanes.filter(lane => lane.owner === player.id).length;
		console.log('Lane points for player ', player.id, ':', lanePoints);
		const points = blossom.golden ? 2 + (lanePoints ? lanePoints : 1) : (lanePoints ? lanePoints : 1);
		player.addScore(points);

		// Charge perfect meter and spawn visual feedback when applicable
		if (isPerfect) {
			if (blossom.golden) player.perfectMeter.add(3);
			else player.perfectMeter.add();
			this.perfectCatchEffects.push({
				x: player.getX(),
				y: player.getY() - 40,
				timer: 0.6,
				alpha: 1,
				scale: 1,
				golden: blossom.golden
			});
		}

		// Let the lane system record catch streaks for ownership changes
		if (laneRegion >= 0) {
			this.laneSystem.recordCatch(laneRegion, player.id);
		}
	}

	/**
	 * Creates a short-lived stain effect where a blossom is missed.
	 *
	 * @param {Object} blossom - Blossom that fell beyond the play area.
	 */
	handleMiss(blossom) {
		// Add a new miss effect instance near the bottom of the canvas
		this.missEffects.push({
			x: blossom.x,
			y: this.canvas.height - 50,
			timer: 2.0,
			alpha: 0.6,
			size: 30 + Math.random() * 20
		});
	}

	/**
	 * Applies the result of a player ability to its intended target.
	 *
	 * @param {Player} player - Player that used the ability.
	 * @param {string|null} abilityResult - Logical effect tag from Player.useAbility.
	 * @param {number} playerIndex - Index of the casting player in players array.
	 */
	handleAbility(player, abilityResult, playerIndex) {
		// Look up the opposing player for ability targeting
		const otherPlayer = this.players[1 - playerIndex];

		if (abilityResult === 'freeze') {
			// Apply Ink Freeze stun to the opponent for a brief duration
			otherPlayer.freeze(0.4);
		}
	}

	/**
	 * Determines which player successfully performs a push when they overlap.
	 *
	 * @param {InputManager} inputManager - Input manager used for reading push state.
	 */
	checkPushes(inputManager) {
		// Exit early when players are not touching each other
		if (!this.players[0].overlaps(this.players[1])) {
			return;
		}

		const p1Pushing = this.players[0].pushActive;
		const p2Pushing = this.players[1].pushActive;

		// Ignore checks when neither player is actively pushing
		if (!p1Pushing && !p2Pushing) {
			return;
		}

		// Determine which lane region both players are standing in
		const p1Lane = this.players[0].getLaneRegion(this.laneSystem);
		const p2Lane = this.players[1].getLaneRegion(this.laneSystem);

		// If both are in the same lane, lane ownership can break ties
		if (p1Lane >= 0 && p1Lane === p2Lane) {
			const lane = this.laneSystem.getLane(p1Lane);

			// Give priority to the lane owner when pushes happen together
			if (lane.owner === 1 && p1Pushing) {
				this.players[0].push(this.players[1], this.laneSystem);
			} else if (lane.owner === 2 && p2Pushing) {
				this.players[1].push(this.players[0], this.laneSystem);
			} else if (p1Pushing && p2Pushing) {
				// Simultaneous push with no owner results in no movement
				return;
			} else if (p1Pushing) {
				this.players[0].push(this.players[1], this.laneSystem);
			} else if (p2Pushing) {
				this.players[1].push(this.players[0], this.laneSystem);
			}
		} else {
			// When in different lanes, treat pushes independently
			if (p1Pushing && !p2Pushing) {
				this.players[0].push(this.players[1], this.laneSystem);
			} else if (p2Pushing && !p1Pushing) {
				this.players[1].push(this.players[0], this.laneSystem);
			}
		}
	}

	/**
	 * Finalises the current round and decides if the game should end.
	 */
	handleRoundEnd() {
		// Mark the current round as complete
		this.roundSystem.endRound();

		// Decide whether to finish the game or prepare another round
		if (this.roundSystem.isGameComplete()) {
			this.handleGameEnd();
		} else {
			// Reset state and schedule the following round after a short pause
			this.resetRound();
			setTimeout(() => {
				this.roundSystem.startRound();
			}, 2000);
		}
	}

	/**
	 * Switches to the game-end state and reveals final UI.
	 */
	handleGameEnd() {
		// Record game-end state and figure out the winner
		this.state = 'gameEnd';
		const winner = this.roundSystem.getWinner();
		// this.uiManager.showGameEnd(winner);

		// Reveal reset button so players can start over
		const resetBtn = document.getElementById('reset-button');
		if (resetBtn) {
			resetBtn.classList.remove('hidden');
		}
	}

	/**
	 * Performs a full game restart, returning to the main menu.
	 */
	resetGame() {
		// Restore baseline game state values
		this.state = 'menu';
		this.blossomSystem.reset();
		this.windSystem.reset();
		this.laneSystem.reset();
		if (this.laneTint) {
			this.laneTint.reset();
		}
		this.perfectCatchEffects = [];
		this.missEffects = [];
		this.roundSystem = new RoundSystem(this.players);
		this.players.forEach(player => {
			player.reset();
		});

		// Ensure perfect meters are wiped before a new game
		this.players.forEach(p => {
			p.perfectMeter.reset();
		});

		if (this.aiMode && this.ai) {
			this.ai = new AI(this.players[1], this.aiDifficulty, this.canvas.width, this.canvas.height);
		}
		const startScreen = document.getElementById('start-screen');
		const resetBtn = document.getElementById('reset-button');
		if (startScreen) startScreen.classList.remove('hidden');
		if (resetBtn) resetBtn.classList.add('hidden');

		// Restore initial lane ownership and tint for the first round
		this.laneSystem.lanes[0].owner = 1;
		this.laneSystem.lanes[2].owner = 2;

		// Seed tint visuals to match initial ownership state
		if (this.laneTint) {
			this.laneTint.tints[0].owner = 1;
			this.laneTint.tints[0].targetAlpha = 0.5;
			this.laneTint.tints[0].alpha = 0.5;
			this.laneTint.tints[0].color = this.laneTint.playerColors[1];

			this.laneTint.tints[2].owner = 2;
			this.laneTint.tints[2].targetAlpha = 0.5;
			this.laneTint.tints[2].alpha = 0.5;
			this.laneTint.tints[2].color = this.laneTint.playerColors[2];
		}
	}

	/**
	 * Clears transient state between rounds while keeping scores.
	 */
	resetRound() {
		// Reset systems that depend on time and random generation
		this.blossomSystem.reset();
		this.windSystem.reset();

		// Decide if we are about to enter the special second round layout
		const isRound2 = this.roundSystem.getCurrentRound() === 1;

		if (isRound2) {
			// Rebuild lane ownership from scratch for round two
			this.laneSystem.reset();

			// Assign left/right lanes to players and keep middle neutral
			this.laneSystem.lanes[0].owner = 1;
			this.laneSystem.lanes[1].owner = null;
			this.laneSystem.lanes[2].owner = 2;

			// Clear catch streaks so ownership can be rebuilt
			this.laneSystem.lanes.forEach(lane => {
				lane.catchStreak = { player1: 0, player2: 0 };
			});

			// Apply a fresh visual tint to match new lane owners
			if (this.laneTint) {
				this.laneTint.reset();

				this.laneTint.tints[0].owner = 1;
				this.laneTint.tints[0].targetAlpha = 0.5;
				this.laneTint.tints[0].alpha = 0.5;
				this.laneTint.tints[0].color = this.laneTint.playerColors[1];

				this.laneTint.tints[2].owner = 2;
				this.laneTint.tints[2].targetAlpha = 0.5;
				this.laneTint.tints[2].alpha = 0.5;
				this.laneTint.tints[2].color = this.laneTint.playerColors[2];
			}
		} else {
			// For other rounds, simply reset lanes and tint helpers
			this.laneSystem.reset();
			if (this.laneTint) {
				this.laneTint.reset();
			}
		}

		this.perfectCatchEffects = [];
		this.missEffects = [];
		this.players.forEach(player => {
			player.resetPosition();

			// Clear temporary status effects and ability state
			player.frozen = false;
			player.freezeTimer = 0;
			player.momentumActive = false;
			player.momentumTimer = 0;
			player.momentumPushCount = 0;
			Object.values(player.abilities).forEach(ability => {
				ability.active = false;
				ability.cooldown = 0;
			});
		});

		// Ensure meters are back to zero at the start of the round
		this.players.forEach(p => {
			p.perfectMeter.reset();
		});
	}

	/**
	 * Renders the entire scene graph for the current game state.
	 *
	 * @param {CanvasRenderingContext2D} ctx - Drawing context for this frame.
	 */
	render(ctx) {
		// Skip rendering until the renderer has been initialised
		if (!this.renderer) {
			return;
		}

		// Always draw the background first regardless of game state
		this.renderer.renderBackground(ctx, this.canvas.width, this.canvas.height);

		if (this.state === 'playing') {

			// Overlay lane tint above bowls and blossoms
			if (this.laneTint) {
				this.laneTint.render(ctx);
			}

			// Draw lane separators and player bowls
			this.renderer.renderLanes(this.laneSystem);
			this.renderer.renderPlayers(this.players);
			this.renderer.renderBlossoms(this.blossomSystem);

			// Render lane bar, perfect meters and visual effects
			this.renderer.renderLaneBar();
			const centerX = this.canvas.width / 2;
			const barY = this.canvas.height * 0.15;
			this.renderer.renderPerfectMeterBackplate(
				this.ctx,
				centerX,
				barY
			);

			this.players.forEach(player => {
				this.renderer.renderPerfectMeter(this.ctx, player, centerX, barY);
			});

			this.renderer.renderWindEffect(this.windSystem);
			this.renderer.renderMissEffects(this.missEffects);

			// Overlay catch FX sprites and meter highlights
			this.renderer.renderPerfectCatchEffects(this.perfectCatchEffects);
			this.renderer.renderPerfectMeters(this.players);

		} else if (this.state === 'menu') {
			// When in menu, background is sufficient; rest is HTML-driven
		}
	}
}
