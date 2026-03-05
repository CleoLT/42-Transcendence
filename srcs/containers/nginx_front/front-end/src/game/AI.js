import { PLAYER_SPEED, BLOSSOM_FALL_SPEED, BLOSSOM_WIND_DRIFT, ABILITY_COSTS } from './Constants.js';

class AIStrategy {
	/**
	 * @param {Player} player - The player instance that this AI will control
	 * @param {number} canvasWidth - Width of the game canvas
	 * @param {number} canvasHeight - Height of the game canvas
	 */
	constructor(player, canvasWidth, canvasHeight, isTouchDevice) {
		this.player = player;
		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;
		this.isTouchDevice = isTouchDevice;
	}

	/**
	 * Calculate the target X position based on the current game state.
	 * 
	 * @param {Array<Object>} blossoms - List of active blossoms in the game, each with properties like {x, y, golden, active}
	 * @param {Player} otherPlayer - The opposing player
	 * @param {LaneSystem} laneSystem - The lane system (optional)
	 * @param {WindSystem} windSystem - The wind system (optional)
	 * @returns {number|null} Target X position, or null if no target is available
	 */
	calculateTargetX(blossoms, otherPlayer, laneSystem, windSystem) {
		throw new Error('calculateTargetX must be implemented by subclass');
	}

	/**
	 * Calculates whether the push should be activated based on the current game state.
	 * 
	 * @param {Player} otherPlayer - The opposing player
	 * @param {Array<Object>} blossoms - List of active blossoms in the game, each with properties like {x, y, golden, active}
	 * @returns {boolean} True if push should be activated
	 */
	shouldPush(otherPlayer, blossoms) {
		return false;
	}

	/**
	 * Calculates whether dash should be used based on the target position and current blossoms.
	 * 
	 * @param {number} targetX - Target X position
	 * @param {Array<Object>} blossoms - List of active blossoms in the game, each with properties like {x, y, golden, active}
	 * @returns {boolean} True if dash should be used
	 */
	shouldDash(targetX, blossoms) {
		return false;
	}

	/**
	 * Calculates which ability should be used, if any.
	 * 
	 * @param {Player} otherPlayer - The opposing player
	 * @param {Array<Object>} blossoms - List of active blossoms in the game, each with properties like {x, y, golden, active}
	 * @param {LaneSystem} laneSystem - The lane system (optional)
	 * @returns {string|null} Name of the ability to use ('reversePush', 'inkFreeze', 'momentumSurge') or null
	 */
	shouldUseAbility(otherPlayer, blossoms, laneSystem) {
		return null;
	}

	/**
	 * Predicts the future X position of a blossom considering its current velocity and wind effects.
	 * 
	 * @param {Object} blossom - Blossom to predict
	 * @param {number} timeToReach - Estimated time to reach the player's height
	 * @param {WindSystem} windSystem - Wind system
	 * @returns {number} Predicted X position
	 */
	predictBlossomPosition(blossom, timeToReach, windSystem) {
		let predictedX = blossom.x;
		
		// Applies horizontal velocity if available, otherwise assumes no horizontal movement
		if (blossom.vx) {
			predictedX += blossom.vx * timeToReach;
		}
		
		// Apply wind drift if active
		if (windSystem && windSystem.isActive()) {
			const windDirection = windSystem.getDirection();
			predictedX += windDirection * BLOSSOM_WIND_DRIFT * timeToReach;
		}
		
		return predictedX;
	}

	/**
	 * Calculate the estimated time for a blossom to reach the player's height. Returns Infinity if it's not reachable.
	 * 
	 * @param {Object} blossom - Blossom to evaluate
	 * @returns {number} Time in seconds, or Infinity if not reachable
	 */
	calculateTimeToReach(blossom) {
		if (blossom.y >= this.player.y) {
			// The blossom is already at the player's height or below
			return 0;
		}
		
		const verticalDistance = this.player.y - blossom.y;
		const fallSpeed = blossom.vy || BLOSSOM_FALL_SPEED;
		
		if (fallSpeed <= 0) {
			return Infinity;
		}
		
		return verticalDistance / fallSpeed;
	}
}

/**
 * Easy estrategy: basic AI with artificial limitations.
 * - Artificial delay in reactions
 * - Small errors in tracking
 * - No movement prediction
 * - Limited speed
 */
class EasyStrategy extends AIStrategy {
	constructor(player, canvasWidth, canvasHeight) {
		super(player, canvasWidth, canvasHeight);

		// Internal state for artificial delay
		this.reactionDelay = 0.5; // delay seconds (increased to make it easier)
		this.reactionTimer = 0;
		this.lastTargetX = null;
		
		// Parameters for artificial error (increased to make it easier)
		this.trackingError = 40; // maximum pixels of offset (increased)
		this.errorChance = 0.5; // probability of making an error (increased)
	}

	calculateTargetX(blossoms, otherPlayer, laneSystem, windSystem) {
		// Filter active and reachable blossoms
		const activeBlossoms = blossoms.filter(b => b.active && b.y < this.player.y);
		
		if (activeBlossoms.length === 0) {
			return null;
		}

		// Apply artificial delay: only update target every certain time
		// Note: the timer is updated in AI.update() with real deltaTime
		if (this.reactionTimer < this.reactionDelay) {
			return this.lastTargetX;
		}
		this.reactionTimer = 0;

		// Select the blossom most closest vertically
		let bestBlossom = null;
		let minVerticalDistance = Infinity;

		for (const blossom of activeBlossoms) {
			const verticalDistance = this.player.y - blossom.y;
			if (verticalDistance < minVerticalDistance && verticalDistance > 0) {
				minVerticalDistance = verticalDistance;
				bestBlossom = blossom;
			}
		}

		if (!bestBlossom) {
			return null;
		}

		// without prediction, use the current position of the blossom as the target
		let targetX = bestBlossom.x;

		// Apply artificial error occasionally
		if (Math.random() < this.errorChance) {
			const errorOffset = (Math.random() - 0.5) * 2 * this.trackingError;
			targetX += errorOffset;
		}

		this.lastTargetX = targetX;
		return targetX;
	}

	shouldPush(otherPlayer, blossoms) {
		// Easy doesn't push strategically, just randomly when overlapping
		return false;
	}

	shouldUseAbility(otherPlayer, blossoms, laneSystem) {
		// Easy no usa habilidades o las usa muy mal (muy raramente)
		if (!this.player.abilitiesEnabled) {
			return null;
		}

		// Abilities are barely used and not based on the game state, just random chance if resources are available
		if (Math.random() < 0.01) { // 1% chance per frame (reduced)
			// Use the cheapest ability available (reversePush) if resources allow
			const cost = ABILITY_COSTS.reversePush;
			if (this.player.perfectMeter.value >= cost && 
			    this.player.abilities.reversePush.cooldown <= 0) {
				return 'reversePush';
			}
		}

		return null;
	}
}

/**
 * Medium IA strategy: Intermediate AI without extreme limitations.
 * - No artificial delay
 * - Properly tracks the target
 * - Basic prediction (no wind)
 * - Normal speed
 * - Uses abilities basically (without much strategy)
 */
class MediumStrategy extends AIStrategy {
	constructor(player, canvasWidth, canvasHeight, isTouchDevice) {
		super(player, canvasWidth, canvasHeight);
		this.isTouchDevice = isTouchDevice;
		this.lastAbilityUse = 0;
		this.abilityCooldown = 3.0; // Seconds between ability uses
	}

	calculateTargetX(blossoms, otherPlayer, laneSystem, windSystem) {
		// Filter active and reachable blossoms (those that are above the player)
		const activeBlossoms = blossoms.filter(b => b.active && b.y < this.player.y);
		
		if (activeBlossoms.length === 0) {
			return null;
		}

		// Priority to golden blossoms, but still consider regular ones if no golden are available
		const goldenBlossoms = activeBlossoms.filter(b => b.golden);
		const candidates = goldenBlossoms.length > 0 ? goldenBlossoms : activeBlossoms;

		// Select the best blossom based on distance and value
		let bestBlossom = null;
		let bestScore = Infinity;

		for (const blossom of candidates) {
			const timeToReach = this.calculateTimeToReach(blossom);
			
			if (timeToReach === Infinity || timeToReach < 0) {
				continue;
			}

			// Without wind prediction, but still considers horizontal velocity if available
			const predictedX = this.predictBlossomPosition(blossom, timeToReach, null);
			
			// Calculate horizontal distance to the predicted position of the blossom
			const horizontalDistance = Math.abs(predictedX - this.player.x);
			
			// Score: vertical distance + horizontal distance (normalized)
			const score = (this.player.y - blossom.y) + horizontalDistance * 0.5;
			
			// Penalize if the opponent is closer (more permissive threshold for Medium)
			const opponentDistance = Math.abs(predictedX - otherPlayer.x);
			if (opponentDistance < horizontalDistance * 0.5) {
				continue; // Skip if opponent is significantly closer to the target
			}

			if (score < bestScore) {
				bestScore = score;
				bestBlossom = blossom;
			}
		}

		if (!bestBlossom) {
			return null;
		}

		const timeToReach = this.calculateTimeToReach(bestBlossom);
		return this.predictBlossomPosition(bestBlossom, timeToReach, null);
	}

	shouldPush(otherPlayer, blossoms) {
		if(!this.isTouchDevice) return false; // No push on touch devices, as it can be disruptive to the player experience
		// Medium uses push occasionally when overlapping (less aggressive than Hard)
		if (!this.player.overlaps(otherPlayer)) {
			return false;
		}

		// Verify if there are active blossoms nearby (in the same vertical area) to justify pushing
		const nearbyBlossoms = blossoms.filter(b => 
			b.active && 
			Math.abs(b.y - this.player.y) < 100
		);

		return nearbyBlossoms.length > 0 && Math.random() < 0.25; // Reduced from 0.4 to 0.25
	}

	shouldDash(targetX, blossoms) {
		if (!targetX || this.player.dashCooldown > 0 || this.player.dashing) {
			return false;
		}

		const distance = Math.abs(targetX - this.player.x);
		// Dash if the target is far and there is a golden blossom nearby (increased distance threshold)
		const hasGoldenNearby = blossoms.some(b => 
			b.active && 
			b.golden && 
			Math.abs(b.x - this.player.x) < 200
		);

		return distance > 150 && hasGoldenNearby;
	}

	shouldUseAbility(otherPlayer, blossoms, laneSystem) {
		if (!this.player.abilitiesEnabled) {
			return null;
		}

		//Medium uses abilities basically when it has enough resources
		//Without much strategy, more reactive than proactive
		//Evaluate all abilities and choose the best one based on the situation
		const abilityScores = [];

		// Evaluate inkfreeze (the most powerful) - high priority
		const inkFreezeCost = ABILITY_COSTS.inkFreeze;
		if (this.player.perfectMeter.value >= inkFreezeCost && 
		    this.player.abilities.inkFreeze.cooldown <= 0 &&
		    !otherPlayer.frozen) {
			let score = 0;
			const goldenBlossoms = blossoms.filter(b => b.active && b.golden);
			if (goldenBlossoms.length > 0) {
				const targetBlossom = goldenBlossoms[0];
				const opponentDistance = Math.abs(targetBlossom.x - otherPlayer.x);
				const myDistance = Math.abs(targetBlossom.x - this.player.x);
				
				// High score if the opponent is closer to a golden target and it's within a reasonable distance (increased threshold)
				if (opponentDistance < myDistance && opponentDistance < 120) {
					score = 80 + (120 - opponentDistance); // Más cerca = más score
				}
			}
			
			// Also score if the opponent is blocking the path to a target blossom (increased threshold)
			if (this.player.overlaps(otherPlayer)) {
				const nearbyBlossoms = blossoms.filter(b => 
					b.active && 
					Math.abs(b.y - this.player.y) < 100
				);
				if (nearbyBlossoms.length > 0) {
					score = Math.max(score, 50);
				}
			}
			
			if (score > 0 && Math.random() < 0.4) { // 40% of probability to use when the situation is favorable (increased from 30%)
				abilityScores.push({ ability: 'inkFreeze', score });
			}
		}

		// Evaluate reversePush
		const reversePushCost = ABILITY_COSTS.reversePush;
		if (this.player.perfectMeter.value >= reversePushCost && 
		    this.player.abilities.reversePush.cooldown <= 0 &&
		    !otherPlayer.invertControlsActive) {
			let score = 0;
			const distanceToOpponent = Math.abs(this.player.x - otherPlayer.x);
			const hasImportantBlossoms = blossoms.some(b => 
				b.active && 
				(b.golden || Math.abs(b.y - this.player.y) < 100)
			);
			
			if (distanceToOpponent < 180 && hasImportantBlossoms) {
				score = 30 + (180 - distanceToOpponent) * 0.2;
			}
			
			if (score > 0 && Math.random() < 0.3) { // 30% of probability
				abilityScores.push({ ability: 'reversePush', score });
			}
		}

		// Evaluate momentumSurge
		const momentumSurgeCost = ABILITY_COSTS.momentumSurge;
		if (this.player.perfectMeter.value >= momentumSurgeCost && 
		    this.player.abilities.momentumSurge.cooldown <= 0) {
			let score = 0;
			
			// Higher score if the player is in a lane with active blossoms and the opponent is in the same lane (if laneSystem exists)
			if (this.player.overlaps(otherPlayer)) {
				const nearbyBlossoms = blossoms.filter(b => 
					b.active && 
					Math.abs(b.y - this.player.y) < 120
				);
				if (nearbyBlossoms.length > 0) {
					score = 40;
				}
			}
			
			if (score > 0 && Math.random() < 0.25) { // 25% of probability
				abilityScores.push({ ability: 'momentumSurge', score });
			}
		}

		// Choose the ability with the highest score if there are any viable options
		if (abilityScores.length > 0) {
			abilityScores.sort((a, b) => b.score - a.score);
			return abilityScores[0].ability;
		}

		return null;
	}
}
/**
 * Hard Strategy: Advanced AI with full prediction.
 * - No delay
 * - Predicts future target position with wind
 * - Immediate reaction
 * - Uses maximum speed
 * - No artificial mistakes
 * - Uses abilities strategically and intelligently
 */
class HardStrategy extends AIStrategy {
	constructor(player, canvasWidth, canvasHeight, isTouchDevice) {
		super(player, canvasWidth, canvasHeight, isTouchDevice);
	}

	calculateTargetX(blossoms, otherPlayer, laneSystem, windSystem) {
		// Filter active and reachable blossoms
		const activeBlossoms = blossoms.filter(b => b.active && b.y < this.player.y);
		
		if (activeBlossoms.length === 0) {
			return null;
		}

		// Prioritize golden blossoms
		const goldenBlossoms = activeBlossoms.filter(b => b.golden);
		const candidates = goldenBlossoms.length > 0 ? goldenBlossoms : activeBlossoms;

		// Evaluate each candidate with full prediction
		let bestBlossom = null;
		let bestScore = -Infinity;

		for (const blossom of candidates) {
			const timeToReach = this.calculateTimeToReach(blossom);
			
			if (timeToReach === Infinity || timeToReach < 0) {
				continue;
			}

			// Full prediction including wind
			const predictedX = this.predictBlossomPosition(blossom, timeToReach, windSystem);
			
			// Calculate if the player can reach that position
			const horizontalDistance = Math.abs(predictedX - this.player.x);
			const timeToMove = horizontalDistance / PLAYER_SPEED;
			
			// Check if reachable
			if (timeToMove > timeToReach * 1.1) {
				continue; // Not reachable
			}

			// Calculate score based on value and accessibility
			let score = 0;
			
			// Bonus for golden blossom
			if (blossom.golden) {
				score += 200;
			}
			
			// Bonus for potential perfect catch (if laneSystem exists)
			if (laneSystem) {
				const laneRegion = laneSystem.getLaneRegionForPoint(predictedX);
				if (laneRegion >= 0 && laneSystem.isInLaneCenter(predictedX, laneRegion)) {
					score += 100;
				}
			}
			
			// Penalize distance
			score -= horizontalDistance * 0.3;
			
			// Penalize if the opponent is closer
			const opponentDistance = Math.abs(predictedX - otherPlayer.x);
			if (opponentDistance < horizontalDistance * 0.8) {
				score -= 50;
			}

			// Penalize if the opponent is blocking the path
			const isBlocked = (this.player.x < predictedX && otherPlayer.x > this.player.x && otherPlayer.x < predictedX) ||
			                  (this.player.x > predictedX && otherPlayer.x < this.player.x && otherPlayer.x > predictedX);
			if (isBlocked && Math.abs(otherPlayer.x - predictedX) < 80) {
				score -= 80;
			}

			if (score > bestScore) {
				bestScore = score;
				bestBlossom = blossom;
			}
		}

		if (!bestBlossom) {
			return null;
		}

		const timeToReach = this.calculateTimeToReach(bestBlossom);
		return this.predictBlossomPosition(bestBlossom, timeToReach, windSystem);
	}

	shouldPush(otherPlayer, blossoms) {
		if(!this.isTouchDevice) return false; // No push on touch devices, as it can be disruptive to the player experience
		if (!this.player.overlaps(otherPlayer)) {
			return false;
		}

		// Hard AI pushes strategically when there are nearby blossoms
		const nearbyBlossoms = blossoms.filter(b => 
			b.active && 
			Math.abs(b.y - this.player.y) < 120
		);

		if (nearbyBlossoms.length === 0) {
			return false;
		}

		// Push if there is a target blossom close to the opponent
		const targetBlossom = nearbyBlossoms[0];
		const distanceToBlossom = Math.abs(targetBlossom.x - this.player.x);
		const opponentDistanceToBlossom = Math.abs(targetBlossom.x - otherPlayer.x);

		return opponentDistanceToBlossom < distanceToBlossom * 0.9;
	}

	shouldDash(targetX, blossoms) {
		if (!targetX || this.player.dashCooldown > 0 || this.player.dashing) {
			return false;
		}

		const distance = Math.abs(targetX - this.player.x);
		
		// Dash if the target is far and reachable with dash
		if (distance > 120) {
			// Check if there is a golden blossom as target
			const hasGoldenTarget = blossoms.some(b => 
				b.active && 
				b.golden && 
				Math.abs(b.x - targetX) < 30
			);

			return hasGoldenTarget || distance > 200;
		}

		return false;
	}

	shouldUseAbility(otherPlayer, blossoms, laneSystem) {
		if (!this.player.abilitiesEnabled) {
			return null;
		}

		// Hard AI uses abilities strategically and intelligently
		// Evaluate all abilities and choose the best one depending on the situation
		// Prioritize inkFreeze when it is most useful (it is the strongest)

		const abilityScores = [];

		// 1. Evaluate inkFreeze (strongest) - highest priority
		const inkFreezeCost = ABILITY_COSTS.inkFreeze;
		if (this.player.perfectMeter.value >= inkFreezeCost && 
		    this.player.abilities.inkFreeze.cooldown <= 0 &&
		    !otherPlayer.frozen) {
			let score = 0;
			
			const goldenBlossoms = blossoms.filter(b => b.active && b.golden);
			if (goldenBlossoms.length > 0) {
				const targetBlossom = goldenBlossoms[0];
				const timeToReach = this.calculateTimeToReach(targetBlossom);
				const predictedX = this.predictBlossomPosition(targetBlossom, timeToReach, null);
				
				const opponentDistance = Math.abs(predictedX - otherPlayer.x);
				const myDistance = Math.abs(predictedX - this.player.x);
				
				// Very high score if the opponent is closer and about to reach it
				if (opponentDistance < myDistance && 
				    opponentDistance < 70 && 
				    timeToReach < 1.0) {
					score = 150 + (70 - opponentDistance) * 2; // Very high score
				}
			}
			
			// Also high score if the opponent is blocking the path
			const tempTargetX = this.calculateTargetX(blossoms, otherPlayer, laneSystem, null);
			if (tempTargetX !== null) {
				const isBlocked = (this.player.x < tempTargetX && otherPlayer.x > this.player.x && otherPlayer.x < tempTargetX) ||
				                  (this.player.x > tempTargetX && otherPlayer.x < this.player.x && otherPlayer.x > tempTargetX);
				if (isBlocked && Math.abs(otherPlayer.x - tempTargetX) < 120) {
					score = Math.max(score, 120);
				}
			}
			
			if (score > 0) {
				abilityScores.push({ ability: 'inkFreeze', score });
			}
		}

		// 2. Evaluate reversePush
		const reversePushCost = ABILITY_COSTS.reversePush;
		if (this.player.perfectMeter.value >= reversePushCost && 
		    this.player.abilities.reversePush.cooldown <= 0 &&
		    !otherPlayer.invertControlsActive) {
			let score = 0;
			
			const goldenBlossoms = blossoms.filter(b => b.active && b.golden);
			if (goldenBlossoms.length > 0) {
				const targetBlossom = goldenBlossoms[0];
				const timeToReach = this.calculateTimeToReach(targetBlossom);
				const predictedX = this.predictBlossomPosition(targetBlossom, timeToReach, null);
				
				const opponentDistance = Math.abs(predictedX - otherPlayer.x);
				const myDistance = Math.abs(predictedX - this.player.x);
				
				// Score if the opponent is closer and about to reach it
				if (opponentDistance < myDistance && 
				    opponentDistance < 90 && 
				    timeToReach < 1.2) {
					score = 60 + (90 - opponentDistance);
				}
			}
			
			// Also score when the opponent is actively moving
			if (this.player.overlaps(otherPlayer)) {
				const nearbyBlossoms = blossoms.filter(b => 
					b.active && 
					Math.abs(b.y - this.player.y) < 120
				);
				if (nearbyBlossoms.length > 0) {
					score = Math.max(score, 50);
				}
			}
			
			if (score > 0) {
				abilityScores.push({ ability: 'reversePush', score });
			}
		}

		// 3. Evaluate momentumSurge
		const momentumSurgeCost = ABILITY_COSTS.momentumSurge;
		if (this.player.perfectMeter.value >= momentumSurgeCost && 
		    this.player.abilities.momentumSurge.cooldown <= 0) {
			let score = 0;
			
			// High score in lane control situations
			if (laneSystem) {
				const myLane = this.player.getLaneRegion(laneSystem);
				const opponentLane = otherPlayer.getLaneRegion(laneSystem);
				
				if (myLane >= 0 && myLane === opponentLane) {
					const laneBlossoms = blossoms.filter(b => {
						if (!b.active) return false;
						const timeToReach = this.calculateTimeToReach(b);
						const predictedX = this.predictBlossomPosition(b, timeToReach, null);
						const laneRegion = laneSystem.getLaneRegionForPoint(predictedX);
						return laneRegion === myLane;
					});
					
					if (laneBlossoms.length > 0 && this.player.overlaps(otherPlayer)) {
						score = 80;
					}
				}
			}
			
			// Also score when there are multiple golden blossoms
			const goldenBlossoms = blossoms.filter(b => b.active && b.golden);
			if (goldenBlossoms.length >= 2 && this.player.overlaps(otherPlayer)) {
				score = Math.max(score, 70);
			}
			
			if (score > 0) {
				abilityScores.push({ ability: 'momentumSurge', score });
			}
		}

		// Choose the ability with the highest score
		if (abilityScores.length > 0) {
			abilityScores.sort((a, b) => b.score - a.score);
			return abilityScores[0].ability;
		}

		return null;
	}
}

/**
 * Main AI class that coordinates difficulty strategies.
 * Completely decoupled from rendering and based on deterministic logic.
 */
export class AI {
	/**
	 * Creates an AI controller that manages a player using difficulty strategies.
	 * 
	 * @param {Player} player - Instance of the player controlled by this AI
	 * @param {'easy' | 'medium' | 'hard'} difficulty - Difficulty level
	 * @param {number} canvasWidth - Canvas width
	 * @param {number} canvasHeight - Canvas height
	 * @param {boolean} isTouchDevice - Whether the device is a touch device
	 */
	constructor(player, difficulty = 'easy', canvasWidth, canvasHeight, isTouchDevice) {
		this.player = player;
		this.difficulty = difficulty;
		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;
		this.isTouchDevice = isTouchDevice;

		// Create strategy based on difficulty
		this.strategy = this.createStrategy(difficulty, player, canvasWidth, canvasHeight);
		
		// Internal state
		this.targetX = null;
		this.pushActive = false;
		this.abilityToUse = null;
		this.currentBlossoms = [];
		this.currentOtherPlayer = null;
		this.currentLaneSystem = null;
	}

	/**
	 * Factory method to create the appropriate strategy based on difficulty.
	 */
	createStrategy(difficulty, player, canvasWidth, canvasHeight) {
		switch (difficulty.toLowerCase()) {
			case 'normal':
				return new EasyStrategy(player, canvasWidth, canvasHeight);
			case 'hard':
			case 'normal': // Compatibility with previous difficulty
				return new MediumStrategy(player, canvasWidth, canvasHeight, this.isTouchDevice);
			case 'impossible':
				return new HardStrategy(player, canvasWidth, canvasHeight, this.isTouchDevice);
			default:
				return new EasyStrategy(player, canvasWidth, canvasHeight);
		}
	}

	/**
	 * Updates the AI logic every game frame.
	 * Completely deterministic and decoupled from rendering.
	 */
	update(deltaTime, blossoms, otherPlayer, laneSystem, windSystem, inputManager) {
		// Update delay timer for Easy (if needed)
		if (this.strategy instanceof EasyStrategy) {
			this.strategy.reactionTimer += deltaTime;
		}

		// Calculate target position using the strategy
		this.targetX = this.strategy.calculateTargetX(
			blossoms,
			otherPlayer,
			laneSystem,
			windSystem
		);

		// Calculate if it should push
		this.pushActive = !this.isTouchDevice && this.strategy.shouldPush(otherPlayer, blossoms);
		
		// Calculate which ability to use (if any)
		this.abilityToUse = this.strategy.shouldUseAbility(otherPlayer, blossoms, laneSystem);
		
		// Store blossoms for use in getMovementInput
		this.currentBlossoms = blossoms;
		this.currentOtherPlayer = otherPlayer;
		this.currentLaneSystem = laneSystem;
	}

	/**
	 * Converts AI decisions into simulated keyboard inputs.
	 * This method applies the movement calculated by the strategy.
	 */
	getMovementInput(inputManager) {
		// Get key mapping depending on player ID
		const keys = this.player.id === 1
			? { left: 'KeyA', right: 'KeyD', dash: 'Space', push: 'ControlRight' }
			: { left: 'ArrowLeft', right: 'ArrowRight', dash: 'ShiftRight', push: 'ControlRight' };

		// Clear all movement inputs first
		inputManager.simulateKeyRelease(keys.left);
		inputManager.simulateKeyRelease(keys.right);

		// If there is no target, do nothing
		if (this.targetX === null) {
			return;
		}

		// Calculate distance and direction to the target
		const dx = this.targetX - this.player.x;
		const distance = Math.abs(dx);

		// If we are close enough, do not move
		const stopThreshold = 8; // pixels
		if (distance < stopThreshold) {
			return;
		}

		// Determine movement direction
		const moveThreshold = 3; // minimum pixels to start movement
		if (Math.abs(dx) > moveThreshold) {
			if (dx < 0) {
				inputManager.simulateKeyPress(keys.left);
			} else {
				inputManager.simulateKeyPress(keys.right);
			}
		}

		// Evaluate dash according to the strategy
		const blossoms = this.currentBlossoms || [];
		if (this.strategy.shouldDash(this.targetX, blossoms)) {
			if (this.player.dashCooldown <= 0 && !this.player.dashing) {
				inputManager.simulateKeyPress(keys.dash);
			}
		}

		// Apply push if active
		if (this.pushActive && this.player.pushCooldown <= 0) {
			inputManager.simulateKeyPress(keys.push);
		}

		// Use ability if available and recommended by the strategy
		if (this.abilityToUse && this.player.abilitiesEnabled) {
			// Ability key mapping (player 2 uses numpad)
			const abilityKeys = {
				reversePush: 'Numpad1',
				inkFreeze: 'Numpad2',
				momentumSurge: 'Numpad3'
			};

			const abilityKey = abilityKeys[this.abilityToUse];
			if (abilityKey) {
				// Verify ability availability with double check
				const ability = this.player.abilities[this.abilityToUse];
				const requiredCost = ABILITY_COSTS[this.abilityToUse];
				
				// Verify cooldown, resources, and that the ability exists
				if (ability && 
				    ability.cooldown <= 0 && 
				    this.player.perfectMeter.value >= requiredCost &&
				    !this.player.frozen) {

					// Simulate key press (edge-triggered)
					if (!inputManager.wasKeyJustPressed(abilityKey)) {
						inputManager.simulateKeyPress(abilityKey);
					}
				}
			}
		}
	}
}