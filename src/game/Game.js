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
		this.arenaLeft = 0;
		this.arenaRight = 0;
		this.pauseButtonBounds = null;
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
		const tableWidth = Math.round(this.canvas.width * 0.95);
		const tableInset = Math.max(4, Math.round(tableWidth * 0.03));
		const tableX = ((this.canvas.width - tableWidth) / 2);
		this.arenaLeft = tableX + tableInset + 36;
		this.arenaRight = tableX + tableWidth - tableInset - 36;
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
			if (this.pauseButtonBounds && (this.state === 'playing' || this.state === 'paused')) {
				const rect = this.canvas.getBoundingClientRect();
				const scaleX = this.canvas.width / rect.width;
				const scaleY = this.canvas.height / rect.height;
				const x = (e.clientX - rect.left) * scaleX;
				const y = (e.clientY - rect.top) * scaleY;

				// Check if click is within pause button bounds
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
	 * Limpia los event listeners del juego.
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
		}
		if (this.players[1]) {
			this.players[1].name = player2Name.trim();
		}

		// Switch state - React will handle UI visibility based on state
		this.state = 'playing';
		console.log('🎮 Game state changed to:', this.state);

		// Begin the first round
		this.roundSystem.startRound();
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

		// Only run gameplay logic when state is 'playing'
		if (this.state === 'playing') {
			// 1. Update lógico de jugadores (sin clamp)
			this.players.forEach((player, index) => {
				const otherPlayer = this.players[1 - index];
				player.update(dt, this.inputManager, this.laneSystem, otherPlayer);
				//player.perfectMeter.update(dt);
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

		// Animate and fade perfect catch feedback sprites (always runs for visual continuity)
		this.perfectCatchEffects.forEach(e => {
			e.timer -= dt;
			e.alpha = e.timer / 0.6;
			e.scale = 1 + (1 - e.alpha) * 0.3;
		});

		this.perfectCatchEffects =
			this.perfectCatchEffects.filter(e => e.timer > 0);

		// Animate and fade miss (water stain) effects (always runs for visual continuity)
		this.missEffects.forEach(e => {
			e.timer -= dt;
			e.alpha = Math.max(0, e.timer / 2.0);
		});

		this.missEffects = this.missEffects.filter(e => e.timer > 0);

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
	
		const minDistance = left.radius + right.radius;
		const targetDistance = minDistance * 0.99;
	
		const distance = right.x - left.x;
		if (distance >= targetDistance) {
			left.blockedRight = right.blockedLeft = false;
			return;
		}
	
		const overlap = targetDistance - distance;
	
		const minLeftX = this.arenaLeft;
		const maxRightX = this.arenaRight;
		
		const leftAtWall = left.x <= minLeftX + 0.5;
		const rightAtWall = right.x >= maxRightX - 0.5;


		
		if (leftAtWall && !rightAtWall) {
			// todo el ajuste va al de la derecha
			left.x = minLeftX;
			right.x = left.x + targetDistance;
		} else if (rightAtWall && !leftAtWall) {
			// todo el ajuste va al de la izquierda
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
		const points = blossom.golden ? 1 + (lanePoints ? lanePoints : 1) : (lanePoints ? lanePoints : 1);
		player.addScore(points);

		// Charge perfect meter and spawn visual feedback when applicable
		if (isPerfect) {
			if (blossom.golden) player.perfectMeter.add(2);
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
		//this.players.forEach(p => {
		//	p.perfectMeter.reset();
		//});
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
			ctx.fillStyle = '#1a0f2e';
			ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
			// Draw a simple loading indicator
			ctx.fillStyle = '#ffffff';
			ctx.font = '24px Arial';
			ctx.textAlign = 'center';
			ctx.fillText('Loading...', this.canvas.width / 2, this.canvas.height / 2);
			return;
		}

		// Always draw the background first regardless of game state
		// This ensures the canvas is visible even when menu is showing
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

			// Render lane bar, perfect meters and visual effects
			this.renderer.renderLaneBar();
			const centerX = this.canvas.width / 2;
			const barY = this.canvas.height * 0.15;
			
			
			// this.renderer.renderPerfectMeterBackplate(this.ctx, centerX, barY);
			// Pause button (red circle) - store position for click detection
			const pauseButtonX = centerX - 40;
			const pauseButtonY = barY - 40;
			const pauseButtonSize = 80;
			this.pauseButtonBounds = {
				x: pauseButtonX,
				y: pauseButtonY,
				width: pauseButtonSize,
				height: pauseButtonSize
			};
			
			// Draw pause button first (red circle)
			const red = '#FF0000';
			this.renderer.drawCapsule(ctx, pauseButtonX, pauseButtonY, pauseButtonSize, pauseButtonSize, 100, red);
			
			// Render timer INSIDE the pause button (centered, always visible during gameplay)
			if (this.roundSystem && this.roundSystem.roundActive) {
				const timeRemaining = this.roundSystem.getTimeRemaining();
				ctx.save();
				// Draw text with outline for better visibility on red background
				ctx.font = 'bold 30px corben';
				ctx.textAlign = 'center';
				ctx.textBaseline = 'middle';
				
				// Draw black outline first
				// ctx.strokeStyle = '#000000';
				// ctx.lineWidth = 2;
				// ctx.strokeText(`${timeRemaining}s`, centerX, pauseButtonY + 40);
				
				// Draw white text on top
				ctx.fillStyle = '#000000';
				ctx.fillText(`${timeRemaining}s`, centerX, pauseButtonY + 45);
				ctx.restore();
			}
			this.renderer.renderPerfectMeter(ctx, this.players[0], centerX, barY);
			this.renderer.renderPerfectMeter(ctx, this.players[1], centerX, barY);

			this.renderer.renderPerfectMeterLabels(ctx, this.players[0], centerX, barY);
			this.renderer.renderPerfectMeterLabels(ctx, this.players[1], centerX, barY);
			
			// Render ability indicator dots
			this.renderer.renderAbilityIndicators(ctx, this.players[0], centerX, barY);
			this.renderer.renderAbilityIndicators(ctx, this.players[1], centerX, barY);

			this.renderer.renderWindEffect(this.windSystem);
			this.renderer.renderMissEffects(this.missEffects);

			// Overlay catch FX sprites and meter highlights
			this.renderer.renderPerfectCatchEffects(this.perfectCatchEffects);
			//this.renderer.renderPerfectMeters(this.players);

			// Show pause indicator when paused
			if (this.state === 'paused') {
				ctx.save();
				ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
				ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
				
				// Display "PAUSED" text
				ctx.fillStyle = '#FFFFFF';
				ctx.font = 'bold 64px Arial';
				ctx.textAlign = 'center';
				ctx.textBaseline = 'middle';
				ctx.fillText('PAUSED', this.canvas.width / 2, this.canvas.height / 2 - 60);
				
				// Display remaining time
				if (this.roundSystem && this.roundSystem.roundActive) {
					const timeRemaining = this.roundSystem.getTimeRemaining();
					ctx.fillStyle = '#FFD700';
					ctx.font = 'bold 48px Arial';
					ctx.fillText(`Time Remaining: ${timeRemaining}s`, this.canvas.width / 2, this.canvas.height / 2 + 40);
				}
				
				ctx.restore();
			}

		} else if (this.state === 'menu') {
			// When in menu, background is sufficient; rest is HTML-driven
		}
	}
}
