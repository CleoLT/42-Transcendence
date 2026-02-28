import { Player } from './Player.js';
import { LaneSystem } from './LaneSystem.js';
import { BlossomSystem } from './BlossomSystem.js';
import { WindSystem } from './WindSystem.js';
import { RoundSystem } from './RoundSystem.js';
import { Renderer } from './Renderer.js';
import { AI } from './AI.js';
import { SpriteLibrary } from './SpriteLibrary.js';
import { LaneTint } from './LaneTint.js';
import { PerfectMeter } from './PerfectMeter.js';
import { InputManager } from './InputManager.js';
import {
	RED,
	PLAYER_RADIUS,
	PERFECT_METER_MAX,
	PERFECT_CATCH_FACTOR,
	PERFECT_CATCH_EFFECT_DURATION,
	MISS_EFFECT_DURATION,
	ROUND_INDICATOR_DURATION,
	TABLE_WIDTH_FACTOR,
	TABLE_HEIGHT_FACTOR,
	TABLE_INSET_FACTOR,
	TABLE_BOTTOM_OFFSET,
	TABLE_MIN_INSET,
	PAUSE_BUTTON_FONT,
	LOADING_BACKGROUND_COLOR,
	LOADING_TEXT_COLOR,
	LOADING_TEXT_FONT,
	ROUND_INDICATOR_TEXT_COLOR,
	ROUND_INDICATOR_TITLE_FONT,
	ROUND_INDICATOR_SUBTITLE_FONT,
	ROUND_INDICATOR_CONTROLS_FONT,
	ROUND_INDICATOR_CONTROLS_SMALL_FONT,
	ROUND_INDICATOR_SCORE_FONT,
	ROUND_INDICATOR_TIMER_FONT,
	ROUND_INDICATOR_COLUMN_OFFSET,
	PAUSE_TEXT_FONT,
	PAUSE_TIMER_FONT,
	BLOSSOM_DESPAWN_Y_OFFSET,
} from './Constants.js';

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
		this.renderer = null;
		this.perfectCatchEffects = [];
		this.missEffects = []; // Water stain effects for misses
		this.ai = null;
		this.aiDifficulty = 'easy';
		this.aiMode = false;
		this.spriteLibrary = null;
		this.laneTint = null;
		this.arenaLeft = 0;
		this.arenaRight = 0;
		this.pauseButtonBounds = null;
		this.roundIndicatorTimer = 0;
		this.showRoundIndicator = false;
		this.roundBlurOverlay = null;
		this.roundIndicatorCanvas = null;
		this.roundIndicatorCtx = null;
		this.resetButtonBounds = null;
		this.onBackToMenu = null;
		this.onGameEnd = null;

		this.roundTimeOverride = null;
		this.totalRoundsOverride = null;
		this.abilitiesEnabled = true;
		this.playerColors = {
			1: '#FF0000',
			2: '#0000FF'
		};
		this.theme = 'classic';
	}

	/**
	 * Sets the DOM layer used for blur overlay and round indicator canvas (optional).
	 * When set, the round indicator is drawn on the indicator canvas over a blurred background.
	 *
	 * @param {HTMLElement} overlay - Element with backdrop-filter: blur (shown when indicator is on).
	 * @param {HTMLCanvasElement} indicatorCanvas - Canvas for drawing the round indicator (same resolution as game canvas).
	 */
	setRoundIndicatorLayer(overlay, indicatorCanvas) {
		this.roundBlurOverlay = overlay;
		this.roundIndicatorCanvas = indicatorCanvas;
		this.roundIndicatorCtx = indicatorCanvas ? indicatorCanvas.getContext('2d') : null;
	}

	/**
	 * Sets callback to run when user chooses "Reset" at game end (return to play button screen).
	 * @param {Function} callback - Called after resetGame() when Reset is clicked.
	 */
	setOnBackToMenu(callback) {
		this.onBackToMenu = callback;
	}

	/**
	 * Sets callback to run when the game reaches its end state.
	 * React can use this to switch to a dedicated reset screen.
	 * @param {Function} callback
	 */
	setOnGameEnd(callback) {
		this.onGameEnd = callback;
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
			p.perfectMeter = new PerfectMeter(PERFECT_METER_MAX);
		});

		// Build and populate sprite library used by the renderer (loads classic by default)
		this.spriteLibrary = new SpriteLibrary();
		await this.spriteLibrary.loadSprites();

		// Construct world systems for lanes, blossoms, wind, rounds and UI
		this.laneSystem = new LaneSystem(this.canvas.width, this.canvas.height);
		this.laneTint = new LaneTint(this.laneSystem, this.canvas.width, this.canvas.height);
		this.blossomSystem = new BlossomSystem(this.laneSystem, this.canvas.width, this.canvas.height, this.spriteLibrary);
		this.windSystem = new WindSystem();
		this.roundSystem = new RoundSystem(this.players);
		if (this.roundTimeOverride != null) {
			this.roundSystem.setRoundTime(this.roundTimeOverride);
		}
		if (this.totalRoundsOverride != null) {
			this.roundSystem.setMaxRounds(this.totalRoundsOverride);
		}
		console.log("theme game constructor", this.theme);
		this.renderer = new Renderer(this.ctx, this.canvas.width, this.canvas.height, this.spriteLibrary, this.laneTint, this.theme);

	  
		// Seed starting lane ownership so the UI has clear sides
		this.laneSystem.lanes[0].owner = 1;
		this.laneSystem.lanes[2].owner = 2;

		// Wire up input needed at the game level (e.g. start-from-menu)
		this.setupEventListeners();
		const tableWidth = Math.round(this.canvas.width * TABLE_WIDTH_FACTOR);
		const tableInset = Math.max(TABLE_MIN_INSET, Math.round(tableWidth * TABLE_INSET_FACTOR));
		const tableX = ((this.canvas.width - tableWidth) / 2);
		this.arenaLeft = tableX + tableInset + PLAYER_RADIUS;
		this.arenaRight = tableX + tableWidth - tableInset - PLAYER_RADIUS;
		
		// Calculate table center Y position and set it for all players
		const tableHeight = Math.round(PLAYER_RADIUS * TABLE_HEIGHT_FACTOR);
		const tableTop = this.canvas.height - tableHeight - TABLE_BOTTOM_OFFSET;
		const tableCenterY = tableTop + tableHeight / 2;
		this.players.forEach(player => {
			player.y = tableCenterY;
			player.abilitiesEnabled = this.abilitiesEnabled;
		});
	}

	setRoundTime(seconds) {
		if (typeof seconds !== 'number' || !Number.isFinite(seconds) || seconds <= 0) {
			return;
		}
		this.roundTimeOverride = seconds;
		if (this.roundSystem) {
			this.roundSystem.setRoundTime(seconds);
		}
	}

	setTotalRounds(rounds) {
		if (!Number.isInteger(rounds) || rounds <= 0) {
			return;
		}
		this.totalRoundsOverride = rounds;
		if (this.roundSystem) {
			this.roundSystem.setMaxRounds(rounds);
		}
	}

	setAbilitiesEnabled(enabled) {
		this.abilitiesEnabled = !!enabled;
		if (this.players) {
			this.players.forEach(player => {
				player.abilitiesEnabled = this.abilitiesEnabled;
			});
		}
	}

	setPlayerColors(color1, color2) {
		if (typeof color1 === 'string') {
			this.playerColors[1] = color1;
		}
		if (typeof color2 === 'string') {
			this.playerColors[2] = color2;
		}

		if (this.laneTint && this.laneTint.playerColors) {
			const parseHex = (hex) => {
				if (!hex || typeof hex !== 'string') return null;
				const value = hex.replace('#', '');
				if (value.length !== 6) return null;
				const r = parseInt(value.slice(0, 2), 16);
				const g = parseInt(value.slice(2, 4), 16);
				const b = parseInt(value.slice(4, 6), 16);
				if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return null;
				return { r, g, b };
			};

			const p1 = parseHex(this.playerColors[1]);
			const p2 = parseHex(this.playerColors[2]);

			if (p1) {
				this.laneTint.playerColors[1] = p1;
			}
			if (p2) {
				this.laneTint.playerColors[2] = p2;
			}

			this.setupInitialLaneTints();
		}
	}

	/**
	 * Sets the game theme and reloads sprites for that theme.
	 * Call before startGame() so the correct assets are loaded.
	 *
	 * @param {string} theme - One of: 'classic', 'sakura', 'dark', 'neon'
	 * @returns {Promise<void>}
	 */
	async setTheme(theme) {
		if (!theme || typeof theme !== 'string') {
			return;
		}
		this.theme = theme;
		if (this.spriteLibrary && typeof this.spriteLibrary.setTheme === 'function') {
			await this.spriteLibrary.setTheme(theme);
		}
		if (this.renderer?.setTheme) {
			this.renderer.setTheme(theme);
		}
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
		// Note: Space key handling for starting the game is now handled by StartScreen component
		// which validates player names before calling startGame()
		this.spaceKeyHandler = null;

		// Handle pause button clicks
		this.canvasClickHandler = (e) => {
			const rect = this.canvas.getBoundingClientRect();
			const scaleX = this.canvas.width / rect.width;
			const scaleY = this.canvas.height / rect.height;
			const x = (e.clientX - rect.left) * scaleX;
			const y = (e.clientY - rect.top) * scaleY;

			if (this.pauseButtonBounds && (this.state === 'playing' || this.state === 'paused')) {
				if (x >= this.pauseButtonBounds.x &&
					x <= this.pauseButtonBounds.x + this.pauseButtonBounds.width &&
					y >= this.pauseButtonBounds.y &&
					y <= this.pauseButtonBounds.y + this.pauseButtonBounds.height) {
					this.togglePause();
				}
			}
		};

		this.canvas.addEventListener('click', this.canvasClickHandler);
	}

	/**
	 * Cleans up event listeners for the game.
	 */
	cleanup() {
		if (this.spaceKeyHandler) {
			document.removeEventListener('keydown', this.spaceKeyHandler);
			this.spaceKeyHandler = null;
		}
		if (this.canvasClickHandler) {
			this.canvas.removeEventListener('click', this.canvasClickHandler);
			this.canvasClickHandler = null;
		}
	}


	truncateToWidth(ctx, text, maxWidth) {
		if (ctx.measureText(text).width <= maxWidth) {
		  return text;
		}
	  
		while (text.length > 0 && ctx.measureText(text + '…').width > maxWidth) {
		  text = text.slice(0, -1);
		}
	  
		return text + '…';
	  }
	/**
	 * Moves the game from the menu state into active play.
	 * @param {string} player1Name - Name for player 1.
	 * @param {string} player2Name - Name for player 2 (or "AI" if AI mode).
	 */
	startGame(player1Name, player2Name) {
		// Validate names
		if (!player1Name || !player1Name.trim()) {
			console.warn('Player 1 name is required');
			return;
		}
		if (!player2Name || !player2Name.trim()) {
			console.warn('Player 2 name is required');
			return;
		}

		// Set player names
		if (this.players[0]) {
			this.players[0].name = player1Name.trim();
			this.players[0].name = this.truncateToWidth(this.ctx, this.players[0].name, 150);
		}
		if (this.players[1]) {
			this.players[1].name = player2Name.trim();
			this.players[1].name = this.truncateToWidth(this.ctx, this.players[1].name, 150);
		}

		// Switch state - React will handle UI visibility based on state
		this.state = 'playing';
		console.log('🎮 Game state changed to:', this.state);

		// Begin the first round
		this.roundSystem.startRound();
		// Show round indicator
		this.showRoundIndicator = true;
		this.roundIndicatorTimer = this.roundSystem.getCurrentRound() == 1 ? ROUND_INDICATOR_DURATION * 1.75 : ROUND_INDICATOR_DURATION;
	}

	/**
	 * Toggles pause state between 'playing' and 'paused'.
	 */
	togglePause() {
		if (this.state === 'playing') {
			this.state = 'paused';
		} else if (this.state === 'paused') {
			this.state = 'playing';
		}
	}

	/**
	 * Sets the game state to a specific value.
	 * @param {'menu' | 'playing' | 'paused' | 'gameEnd'} newState - Target game state.
	 */
	setGameState(newState) {
		this.state = newState;
	}

	clampPlayersToArena() {
		this.players.forEach(p => {
		  p.x = Math.max(this.arenaLeft, Math.min(this.arenaRight, p.x));
		});
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

		// Only run gameplay logic when state is 'playing' and round indicator is not showing
		if (this.state === 'playing' && !this.showRoundIndicator) {
			// Update player logic and apply ability effects that target other players
			this.players.forEach((player, index) => {
				const otherPlayer = this.players[1 - index];
				const abilityUsed = player.update(dt, this.inputManager, this.laneSystem, otherPlayer);

				if (!otherPlayer) return;

				// Ability 1: invert horizontal controls of the *other* player
				if (abilityUsed === 'invertControls') {
					otherPlayer.invertControlsActive = true;
					otherPlayer.invertControlsTimer = otherPlayer.invertControlsDuration;
				}

				// Ability 2: freeze the *other* player so they cannot move or
				// use abilities for a short duration.
				if (abilityUsed === 'freeze') {
					otherPlayer.frozen = true;
					otherPlayer.freezeTimer = otherPlayer.freezeDuration;
				}
			});
			
			this.resolvePlayerCollision();
			this.clampPlayersToArena();
	  

			// Tick wind and blossom simulation before collision checks
			if (this.windSystem) {
				this.windSystem.update(dt);
			}
			const windActive = this.windSystem.isActive();
			const windDirection = this.windSystem.getDirection();
			this.blossomSystem.update(dt, windActive, windDirection);

			// Progress round timer and detect end-of-round transitions
			if (this.roundSystem) {
				const status = this.roundSystem.update(dt);
				if (status === 'roundEnd') {
					this.handleRoundEnd();
				}
			}

			// Resolve blossom–player collisions and misses
			this.checkCollisions();

			// Apply push interactions when players are overlapping
			if (this.inputManager) {
				this.checkPushes(this.inputManager);
			}

			// Drive AI decisions and input when enabled
			if (this.aiMode && this.ai) {
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
		}

		// Fade lane tints smoothly towards their target appearance (always runs for visual continuity)
		if (this.laneTint) {
			this.laneTint.update(dt);
		}
		const perfect_catch_effect_scale = 0.3;
		// Animate and fade perfect catch feedback sprites (always runs for visual continuity)
		this.perfectCatchEffects.forEach(e => {
			e.timer -= dt;
			e.alpha = e.timer / PERFECT_CATCH_EFFECT_DURATION;
			e.scale = 1 + (1 - e.alpha) * perfect_catch_effect_scale;
		});

		this.perfectCatchEffects =
			this.perfectCatchEffects.filter(e => e.timer > 0);

		// Animate and fade miss (water stain) effects (always runs for visual continuity)
		this.missEffects.forEach(e => {
			e.timer -= dt;
			e.alpha = Math.max(0, e.timer / MISS_EFFECT_DURATION);
		});

		this.missEffects = this.missEffects.filter(e => e.timer > 0);

		// Update round indicator timer
		if (this.showRoundIndicator) {
			this.roundIndicatorTimer -= dt;
			if (this.roundIndicatorTimer <= 0) {
				this.showRoundIndicator = false;
				this.roundIndicatorTimer = 0;
			}
		}

	}

	/**
	 * Resolves horizontal penetration between the two players in a symmetric,
	 * edge-safe way so that their visual overlap is always bounded by the same
	 * small amount, regardless of where they are in the arena.
	 */
	resolvePlayerCollision() {
		const [p1, p2] = this.players;
		if (p1.pushInvulnerable || p2.pushInvulnerable) return;
	
		const left = p1.x <= p2.x ? p1 : p2;
		const right = left === p1 ? p2 : p1;
	
		const minDistance = left.radius + right.radius - 10;
		const collisionTargetDistance = 0.99;
		const targetDistance = minDistance * collisionTargetDistance;

		const distance = right.x - left.x;
		if (distance >= targetDistance) {
			left.blockedRight = right.blockedLeft = false;
			return;
		}
	
		const overlap = targetDistance - distance;
	
		const minLeftX = this.arenaLeft;
		const maxRightX = this.arenaRight;
		
		const wallThreshold = 0.5;
		const leftAtWall = left.x <= minLeftX + wallThreshold;
		const rightAtWall = right.x >= maxRightX - wallThreshold;


		
		if (leftAtWall && !rightAtWall) {
			// All adjustment goes to the right player
			left.x = minLeftX;
			right.x = left.x + targetDistance;
		} else if (rightAtWall && !leftAtWall) {
			// All adjustment goes to the left player
			right.x = maxRightX;
			left.x = right.x - targetDistance;
		} else {
			// centro: separación perfectamente simétrica
			left.x -= overlap / 2;
			right.x += overlap / 2;
		}
	
		left.blockedRight = true;
		right.blockedLeft = true;
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
			if (blossom.y > this.canvas.height + BLOSSOM_DESPAWN_Y_OFFSET) {
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
		const radius = player.getRadius();
		const perfectHalfWidth = radius * PERFECT_CATCH_FACTOR;

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
		const points = blossom.golden ? 1 + (lanePoints ? lanePoints : 1) : (lanePoints ? lanePoints : 1);
		player.addScore(points);

		// Charge perfect meter and spawn visual feedback when applicable
		if (isPerfect) {
			const perfect_meter_golden_bonus = 2;
			if (blossom.golden) player.perfectMeter.add(perfect_meter_golden_bonus);
			else player.perfectMeter.add(1);
			this.perfectCatchEffects.push({
				x: player.getX(),
				y: player.getY() - 40,
				timer: PERFECT_CATCH_EFFECT_DURATION,
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
		const missEffectYOffset = 50;
		const missEffectSizeMax = 50;
		const missEffectSizeMin = 30;
		const missEffectAlpha = 0.6;
		this.missEffects.push({
			x: blossom.x,
			y: this.canvas.height - missEffectYOffset,
			timer: MISS_EFFECT_DURATION,
			alpha: missEffectAlpha,
			size: missEffectSizeMin + Math.random() * (missEffectSizeMax - missEffectSizeMin)
		});
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

		const p1 = this.players[0];
		const p2 = this.players[1];
		const p1Pushing = p1.pushActive;
		const p2Pushing = p2.pushActive;

		// Ignore checks when neither player is actively pushing
		if (!p1Pushing && !p2Pushing) {
			return;
		}

		// Determine which lane region both players are standing in
		const p1Lane = p1.getLaneRegion(this.laneSystem);
		const p2Lane = p2.getLaneRegion(this.laneSystem);
		const sameLane = p1Lane >= 0 && p1Lane === p2Lane;

		// Handle same-lane pushes with ownership priority
		if (sameLane) {
			const lane = this.laneSystem.getLane(p1Lane);
			
			// Lane owner gets priority in simultaneous pushes
			if (p1Pushing && p2Pushing) {
				if (lane.owner === 1) {
					p1.push(p2, this.laneSystem);
				} else if (lane.owner === 2) {
					p2.push(p1, this.laneSystem);
				}
				// No owner = no push (stalemate)
				return;
			}
			
			// Single push in owned lane: owner wins
			if (p1Pushing && lane.owner === 1) {
				p1.push(p2, this.laneSystem);
				return;
			}
			if (p2Pushing && lane.owner === 2) {
				p2.push(p1, this.laneSystem);
				return;
			}
		}

		// Default: whoever is pushing wins (different lanes or no ownership)
		if (p1Pushing && !p2Pushing) {
			p1.push(p2, this.laneSystem);
		} else if (p2Pushing && !p1Pushing) {
			p2.push(p1, this.laneSystem);
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
			const roundResetDelay = 2000;
			setTimeout(() => {
				this.roundSystem.startRound();
				// Show round indicator
				this.showRoundIndicator = true;
				this.roundIndicatorTimer = ROUND_INDICATOR_DURATION;
			}, roundResetDelay);
		}
	}

	/**
	 * Switches to the game-end state and reveals final UI.
	 */
	handleGameEnd() {
		this.state = 'gameEnd';
		if (this.onGameEnd) {
			try {
				this.onGameEnd();
			} catch (error) {
				console.error('onGameEnd callback error:', error);
			}
		}
	}

	/**
	 * Performs a full game restart, returning to the main menu.
	 */
	resetGame() {
		this.resetButtonBounds = null;
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
		if (this.roundTimeOverride != null) {
			this.roundSystem.setRoundTime(this.roundTimeOverride);
		}
		if (this.totalRoundsOverride != null) {
			this.roundSystem.setMaxRounds(this.totalRoundsOverride);
		}
		this.showRoundIndicator = false;
		this.roundIndicatorTimer = 0;
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
		// Restore initial lane ownership and tint for the first round
		this.laneSystem.lanes[0].owner = 1;
		this.laneSystem.lanes[2].owner = 2;
		this.setupInitialLaneTints();
	}

	/**
	 * Clears transient state between rounds while keeping scores.
	 */
	resetRound() {
		// Reset systems that depend on time and random generation
		this.blossomSystem.reset();
		this.windSystem.reset();
		// Decide if we are about to enter the special second round layout
		const isRound1 = this.roundSystem.getCurrentRound() === 0;

		if (isRound1) {
			this.laneSystem.reset();
			if (this.laneTint) {
				this.laneTint.reset();
			}
		} else {
			// Rebuild lane ownership from scratch for round one
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
				this.setupInitialLaneTints();
			} 
		}

		this.perfectCatchEffects = [];
		this.missEffects = [];
		
		// Calculate table center Y and update player positions
		const tableHeight = Math.round(PLAYER_RADIUS * TABLE_HEIGHT_FACTOR);
		const tableTop = this.canvas.height - tableHeight - TABLE_BOTTOM_OFFSET;
		const tableCenterY = tableTop + tableHeight / 2;
		
		this.players.forEach(player => {
			player.resetPosition();
			// Set Y position to table center for proper collision detection
			player.y = tableCenterY;

			// Clear ability state
			Object.values(player.abilities).forEach(ability => {
				ability.active = false;
				ability.cooldown = 0;
			});
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
			// Draw a simple background while waiting for renderer to initialize
			ctx.fillStyle = LOADING_BACKGROUND_COLOR;
			ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
			// Draw a simple loading indicator
			ctx.fillStyle = LOADING_TEXT_COLOR;
			ctx.font = LOADING_TEXT_FONT;
			ctx.textAlign = 'center';
			ctx.fillText('Loading...', this.canvas.width / 2, this.canvas.height / 2);
			return;
		}

		// Clear to transparent so semi-transparent background reveals what's behind the canvas
		ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		// Always draw the background first regardless of game state
		this.renderer.renderBackground(ctx, this.canvas.width, this.canvas.height);

		if (this.state === 'playing' || this.state === 'paused') {

			// Overlay lane tint above bowls and blossoms
			if (this.laneTint) {
				this.laneTint.render(ctx);
			}

			// Draw lane separators and player bowls
			this.renderer.renderLanes(this.laneSystem);
			this.renderer.renderPlayers(this.players);
			this.renderer.renderBlossoms(this.blossomSystem);

			// Render perfect meters and visual effects
			const centerX = this.canvas.width / 2;
			const barY = this.canvas.height * 0.1;
			
			// Pause button (red circle) - store position for click detection
			const pauseButtonOffset = 40
			const pauseButtonX = centerX - pauseButtonOffset;
			const pauseButtonY = barY - pauseButtonOffset;
			const pauseButtonSize = 80;
			this.pauseButtonBounds = {
				x: pauseButtonX,
				y: pauseButtonY,
				width: pauseButtonSize,
				height: pauseButtonSize
			};
			
			// Draw pause button first (red circle)
			const pauseButtonColor = RED;
			this.renderer.drawCapsule(ctx, pauseButtonX, pauseButtonY, pauseButtonSize, pauseButtonSize, 100, pauseButtonColor);
			
			// Render timer INSIDE the pause button (centered, always visible during gameplay)
			if (this.roundSystem && this.roundSystem.roundActive) {
				const timeRemaining = this.roundSystem.getTimeRemaining();
				ctx.save();
				// Draw text with outline for better visibility on red background
				ctx.font = PAUSE_BUTTON_FONT;
				ctx.textAlign = 'center';
				ctx.textBaseline = 'middle';
				
				// Draw black text on top
				const pauseButtonTextColor = '#000000';
				ctx.fillStyle = pauseButtonTextColor;
				ctx.fillText(`${timeRemaining}s`, centerX, pauseButtonY + 45);
				ctx.restore();
			}

			if (this.abilitiesEnabled) {
				this.renderer.renderPerfectMeter(ctx, this.players[0], centerX, barY);
				this.renderer.renderPerfectMeter(ctx, this.players[1], centerX, barY);
			}

			this.renderer.renderPerfectMeterLabels(ctx, this.players[0], centerX, barY);
			this.renderer.renderPerfectMeterLabels(ctx, this.players[1], centerX, barY);
			
			// Render ability indicator dots
			if (this.abilitiesEnabled) {
				this.renderer.renderAbilityIndicators(ctx, this.players[0], centerX, barY);
				this.renderer.renderAbilityIndicators(ctx, this.players[1], centerX, barY);
			}

			this.renderer.renderWindEffect(this.windSystem);
			this.renderer.renderMissEffects(this.missEffects);

			// Overlay catch FX sprites and meter highlights
			this.renderer.renderPerfectCatchEffects(this.perfectCatchEffects);

			// Show round indicator when starting a new round (blur overlay + indicator canvas or main ctx)
			if (this.showRoundIndicator && this.roundSystem) {
				if (this.roundBlurOverlay && this.roundIndicatorCanvas && this.roundIndicatorCtx) {
					this.roundBlurOverlay.style.display = 'block';
					this.roundIndicatorCanvas.style.display = 'block';
					this.roundIndicatorCtx.clearRect(0, 0, this.roundIndicatorCanvas.width, this.roundIndicatorCanvas.height);
					this.renderRoundIndicator(this.roundIndicatorCtx, true);
				} else {
					this.renderRoundIndicator(ctx, false);
				}
			} else if (this.roundBlurOverlay && this.roundIndicatorCanvas) {
				this.roundBlurOverlay.style.display = 'none';
				this.roundIndicatorCanvas.style.display = 'none';
			}

			// Show pause indicator when paused
			if (this.state === 'paused') {
				this.renderPauseOverlay(ctx);
			}

		} else if (this.state === 'menu') {
			// When in menu, background is sufficient; rest is HTML-driven
		}
	}

	/**
	 * Renders the round indicator overlay with round number and controls/scores.
	 *
	 * @param {CanvasRenderingContext2D} ctx - Drawing context (main canvas or indicator canvas).
	 * @param {boolean} [useBlurLayer=false] - If true, background is blurred via DOM (no opaque fill).
	 */
	renderRoundIndicator(ctx, useBlurLayer = false) {
		ctx.save();
		const w = this.canvas.width;
		const h = this.canvas.height;
		const centerX = w / 2;
		const centerY = h / 2;
		const radius = 287;

		if (!useBlurLayer) {
			ctx.fillStyle = `rgba(0, 0, 0, 0.2)`;
			ctx.fillRect(0, 0, w, h);
		}

		// Red circle (indicator style)
		ctx.beginPath();
		ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
		ctx.fillStyle = RED;
		ctx.fill();

		// All content inside the circle, centered
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		const currentRound = this.roundSystem.getCurrentRound();
		const timeRemaining = Math.ceil(this.roundIndicatorTimer);
		const Yoffset = -150;
		// Title: "Round 1" / "Round 2"
		ctx.fillStyle = ROUND_INDICATOR_TEXT_COLOR;
		ctx.font = ROUND_INDICATOR_TITLE_FONT;
		ctx.fillText(`ROUND ${currentRound}`, centerX, centerY + Yoffset);
		// Subtitle: "1 / 2"
		ctx.font = ROUND_INDICATOR_SUBTITLE_FONT;
		ctx.fillText(`${currentRound} / ${this.totalRoundsOverride}`, centerX, centerY + Yoffset + 42);

		// Countdown (large, subtle)
		ctx.fillStyle = `rgba(255, 255, 255, 0.35)`;
		ctx.font = ROUND_INDICATOR_TIMER_FONT;
		ctx.fillText(String(timeRemaining), centerX, centerY + 200);

		// Round-specific content inside circle
		ctx.fillStyle = ROUND_INDICATOR_TEXT_COLOR;
		if (currentRound === 1) {
			this.renderRound1Controls(ctx, centerX, centerY);
		} else if (currentRound === 2 || currentRound === 3) {
			this.renderRound2Scores(ctx, centerX, centerY);
		}

		ctx.restore();
	}

	/**
	 * Renders control instructions for round 1.
	 *
	 * @param {CanvasRenderingContext2D} ctx - Drawing context.
	 * @param {number} centerX - Center X coordinate.
	 * @param {number} centerY - Center Y coordinate.
	 */
	renderRound1Controls(ctx, centerX, centerY) {
		const startY = centerY - 30;
		const lineH = 30;
		const leftX = centerX - ROUND_INDICATOR_COLUMN_OFFSET;
		const rightX = centerX + ROUND_INDICATOR_COLUMN_OFFSET;

		// Column headers
		ctx.font = ROUND_INDICATOR_CONTROLS_FONT;
		ctx.textAlign = 'center';
		ctx.fillText(`${this.players[0].name}`, leftX, startY);
		ctx.fillText(`${this.players[1].name}`, rightX, startY);

		// Separator "|" in the center
		// ctx.fillText('|', centerX, startY);

		// Controls: left column
		ctx.font = ROUND_INDICATOR_CONTROLS_SMALL_FONT;
		ctx.fillText('Move: A/D', leftX, startY + lineH);
		ctx.fillText('Push: Left Shift', leftX, startY + lineH * 2);
		ctx.fillText('Dash: Space', leftX, startY + lineH * 3);
		if (this.abilitiesEnabled) {
			ctx.fillText('Abilities: 1 / 2 / 3', leftX, startY + lineH * 4);
		}

		// Controls: right column
		ctx.fillText('Move: ←/→', rightX, startY + lineH);
		ctx.fillText('Push: Right Ctrl', rightX, startY + lineH * 2);
		ctx.fillText('Dash: Right Shift', rightX, startY + lineH * 3);
		if (this.abilitiesEnabled) {
			ctx.fillText('Abilities: Numpad 1 / 2 / 3', rightX, startY + lineH * 4);
		}
	}

	/**
	 * Renders current scores for round 2.
	 *
	 * @param {CanvasRenderingContext2D} ctx - Drawing context.
	 * @param {number} centerX - Center X coordinate.
	 * @param {number} centerY - Center Y coordinate.
	 */
	renderRound2Scores(ctx, centerX, centerY) {
		const startY = centerY;
		const leftX = centerX - ROUND_INDICATOR_COLUMN_OFFSET;
		const rightX = centerX + ROUND_INDICATOR_COLUMN_OFFSET;
		const lineH = 30;

		// Column headers
		ctx.font = ROUND_INDICATOR_SCORE_FONT;
		ctx.textAlign = 'center';
		ctx.fillText(`${this.players[0].name}`, leftX, startY);
		ctx.fillText(`${this.players[1].name}`, rightX, startY);
		// ctx.fillText('|', centerX, startY);

		// Points: left and right column
		ctx.font = ROUND_INDICATOR_CONTROLS_SMALL_FONT;
		ctx.fillText(`${this.players[0].score}`, leftX, startY + lineH);
		ctx.fillText(`${this.players[1].score}`, rightX, startY + lineH);
	}

	

	/**
	 * Renders the pause overlay with "PAUSED" text and remaining time.
	 *
	 * @param {CanvasRenderingContext2D} ctx - Drawing context.
	 */
	renderPauseOverlay(ctx) {
		const YOffset = -60;
		const timerYOffset = 40;
		ctx.save();
		ctx.fillStyle = `rgba(0, 0, 0, 0.7)`;
		ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		
		// Display "PAUSED" text
		ctx.fillStyle = ROUND_INDICATOR_TEXT_COLOR;
		ctx.fillStyle = RED;
		ctx.font = PAUSE_TEXT_FONT;
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText('PAUSED', this.canvas.width / 2, this.canvas.height / 2 + YOffset);
		
		// Display remaining time
		if (this.roundSystem && this.roundSystem.roundActive) {
			const timeRemaining = this.roundSystem.getTimeRemaining();
			ctx.fillStyle = ROUND_INDICATOR_TEXT_COLOR;
			ctx.font = PAUSE_TIMER_FONT;
			ctx.fillText(`Time Remaining: ${timeRemaining}s`, this.canvas.width / 2, this.canvas.height / 2 + timerYOffset);
		}
		
		ctx.restore();
	}

	/**
	 * Sets up initial lane tints for players (left lane = player 1, right lane = player 2).
	 */
	setupInitialLaneTints() {
		if (!this.laneTint) return;

		const setupLaneTint = (laneIndex, playerId) => {
			this.laneTint.tints[laneIndex].owner = playerId;
			this.laneTint.tints[laneIndex].targetAlpha = 0.5;
			this.laneTint.tints[laneIndex].alpha = 0.5;
			this.laneTint.tints[laneIndex].color = this.laneTint.playerColors[playerId];
		};

		setupLaneTint(0, 1); // Left lane = Player 1
		setupLaneTint(2, 2); // Right lane = Player 2
	}
}
