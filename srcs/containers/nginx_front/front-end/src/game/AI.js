import {
	AI_CAPABILITIES,
	AI_CONFIG,
	AI_REACTION_TIME,
	AI_PERFECT_ZONE,
	AI_PREDICTION_TIME,
	AI_AIM_ERROR_MULTIPLIER,
	AI_AIM_JITTER_THRESHOLD,
	AI_IMMINENT_BLOSSOM_THRESHOLD,
	AI_PUSH_CHANCE_EASY,
	AI_PUSH_CHANCE_NORMAL,
	AI_GOLDEN_BLOSSOM_SCORE,
	AI_PERFECT_CATCH_SCORE,
	AI_DISTANCE_PENALTY,
	AI_OPPONENT_CLOSER_PENALTY,
	AI_OPPONENT_BLOCKING_PENALTY,
	AI_OPPONENT_CLOSER_THRESHOLD,
	AI_BLOCKING_DISTANCE,
	AI_STOP_DISTANCE,
	AI_STEER_THRESHOLD,
	AI_DASH_DISTANCE_THRESHOLD,
	AI_GOLDEN_NEARBY_DISTANCE,
	AI_LANE_STREAK_THRESHOLD,
	AI_WIND_PREDICTION_TIME,
	BLOSSOM_FALL_SPEED,
	BLOSSOM_WIND_DRIFT,
	ABILITY_COSTS
} from './Constants.js';

export class AI {
	/**
	 * Creates an AI controller that drives a `Player` using heuristics based on
	 * difficulty, wind, lane ownership and opponent positioning.
	 *
	 * @param {Player} player - The player instance controlled by this AI.
	 * @param {'easy' | 'normal' | 'hard'} [difficulty='easy'] - Difficulty preset.
	 * @param {number} canvasWidth - Canvas width for fallback targeting.
	 * @param {number} canvasHeight - Canvas height (reserved for future use).
	 */
	constructor(player, difficulty = 'easy', canvasWidth, canvasHeight) {
		// Core references and tuning parameters
		this.player = player;
		this.difficulty = difficulty;
		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;

		// Targeting and reaction state
		this.targetBlossom = null;
		this.targetX = 0;
		this.reactionTime = AI_REACTION_TIME;
		this.reactionTimer = 0;
		this.lastDecision = 0;

		// Additional timers used by the hard AI behaviours
		this.defensiveTimer = 0;
	}

	/**
	 * Executes a single AI decision step appropriate to the difficulty.
	 *
	 * @param {number} deltaTime - Time step for this frame.
	 * @param {Array<Object>} blossoms - Current blossom list.
	 * @param {Player} otherPlayer - Opposing player.
	 * @param {LaneSystem} laneSystem - Lanes used for perfect detection.
	 * @param {WindSystem} windSystem - Wind used for trajectory prediction.
	 * @param {InputManager} inputManager - Input manager for dash simulation.
	 */
	update(deltaTime, blossoms, otherPlayer, laneSystem, windSystem, inputManager) {
		// Accumulate elapsed time and only act when reaction threshold is met
		this.reactionTimer += deltaTime;

		// Route to simple or advanced logic based on difficulty selection
		if (this.difficulty === 'easy' || this.difficulty === 'normal') {
			const config = AI_CONFIG[this.difficulty] || AI_CONFIG.normal;
			this.updateEasy(blossoms, this.player, otherPlayer, config);
		} else {
			this.updateHard(deltaTime, blossoms, otherPlayer, laneSystem, windSystem, inputManager);
		}
	}

	/**
	 * Simpler heuristic for easy/normal AI: prioritises reachable blossoms and
	 * occasionally pushes when overlapping the opponent.
	 *
	 * @param {Array<Object>} blossoms - Current blossoms in play.
	 * @param {Player} player - Controlled player reference.
	 * @param {Player} otherPlayer - Opponent reference.
	 * @param {Object} config - Difficulty tuning (hesitation, aim error, etc.).
	 */
	updateEasy(blossoms, player, otherPlayer, config) {
		// Exit when there are no blossom targets to consider
		if (!blossoms || blossoms.length === 0) return;

		// Step 1: Choose the best reachable blossom based on vertical and horizontal cost
		let target = null;
		let bestScore = Infinity;

		for (const b of blossoms) {
			const dy = b.y - player.y;
			if (dy < 0) continue;

			// Combine vertical distance and horizontal offset into a simple score
			const score = dy + Math.abs(b.x - player.x) * 0.3;

			if (score < bestScore) {
				bestScore = score;
				target = b;
			}
		}

		// Give up when no viable blossom candidate is found
		if (!target) return;

		// Step 2: Predict landing X coordinate with a small bias towards safety
		let predictedX = target.x + (target.vx || 0) * AI_PREDICTION_TIME;

		// Step 3: Add occasional hesitation without discarding the current target
		if (Math.random() < config.hesitationChance && this.targetX !== null) {
			return;
		}

		// Step 4: Decide whether this is near-perfect and adjust aim
		const distanceFromCenter = Math.abs(predictedX - player.x);
		const nearPerfect = distanceFromCenter < AI_PERFECT_ZONE;

		// Step 5: Sometimes deliberately offset away from a perfect catch
		if (nearPerfect && Math.random() > config.perfectChance) {
			predictedX += (Math.random() - 0.5) * config.aimError * AI_AIM_ERROR_MULTIPLIER;
		}

		// Step 6: Add aim jitter only when already close to the target
		if (distanceFromCenter < AI_AIM_JITTER_THRESHOLD) {
			predictedX += (Math.random() * 2 - 1) * config.aimError;
		}

		// Cache the new X destination for movement steering
		this.targetX = predictedX;

		// Step 7: Decide whether to push the opponent when overlapping and a blossom is imminent
		this.pushActive = false;

		if (this.player.overlaps(otherPlayer)) {
			const imminentBlossom = blossoms.some(b =>
				Math.abs(b.y - player.y) < AI_IMMINENT_BLOSSOM_THRESHOLD
			);

			if (imminentBlossom) {
				const pushChance = this.difficulty === 'easy' ? AI_PUSH_CHANCE_EASY : AI_PUSH_CHANCE_NORMAL;
				this.pushActive = Math.random() < pushChance;
			}
		}
	}

	/**
	 * Advanced AI logic for hard difficulty, including lane and wind-aware
	 * targeting plus ability usage.
	 *
	 * @param {number} deltaTime - Time step for this frame.
	 * @param {Array<Object>} blossoms - Full blossom list.
	 * @param {Player} otherPlayer - Opponent reference.
	 * @param {LaneSystem} laneSystem - Lane system for perfect and control.
	 * @param {WindSystem} windSystem - Wind state for drift prediction.
	 * @param {InputManager} inputManager - Input manager for dash simulation.
	 */
	updateHard(deltaTime, blossoms, otherPlayer, laneSystem, windSystem, inputManager) {
		// Respect a shorter reaction time so this AI feels more responsive
		if (this.reactionTimer < this.reactionTime) {
			return;
		}
		this.reactionTimer = 0;

		// Tick down internal behaviour timers
		this.defensiveTimer -= deltaTime;

		// Filter down to active blossoms that can still be interacted with
		const activeBlossoms = blossoms.filter(b => b.active);

		// Default to center position when no blossoms are available
		if (activeBlossoms.length === 0) {
			this.targetX = this.canvasWidth * 0.5;
			return;
		}

		// Prefer golden blossoms first, then any remaining active blossoms
		const goldenBlossoms = activeBlossoms.filter(b => b.golden);
		const targetBlossoms = goldenBlossoms.length > 0 ? goldenBlossoms : activeBlossoms;

		// Score each candidate blossom based on value, distance and blocking
		let bestBlossom = null;
		let bestScore = -Infinity;

		targetBlossoms.forEach(blossom => {
			// Predict where the blossom will land vertically aligned with the player
			const timeToLand = (blossom.y - this.player.y) / (blossom.vy || BLOSSOM_FALL_SPEED);
			let predictedX = blossom.x;

			// Integrate wind drift over time to refine the landing estimate
			if (windSystem && windSystem.isActive()) {
				predictedX += windSystem.getDirection() * BLOSSOM_WIND_DRIFT * timeToLand;
			}

			// Check if this predicted position would yield a perfect catch
			const laneRegion = laneSystem.getLaneRegionForPoint(predictedX);
			const isPerfect = laneRegion >= 0 && laneSystem.isInLaneCenter(predictedX, laneRegion);

			// Combine blossom type, perfect opportunity and distance into a score
			let score = 0;
			if (blossom.golden) score += AI_GOLDEN_BLOSSOM_SCORE;
			if (isPerfect) score += AI_PERFECT_CATCH_SCORE;

			const distance = Math.abs(predictedX - this.player.x);
			score -= distance * AI_DISTANCE_PENALTY;

			// Penalise targets where the opponent is significantly closer
			const distToOther = Math.abs(predictedX - otherPlayer.x);
			if (distToOther < distance * AI_OPPONENT_CLOSER_THRESHOLD) {
				score -= AI_OPPONENT_CLOSER_PENALTY;
			}

			// Reduce desirability when the opponent is physically blocking the path
			if (Math.abs(otherPlayer.x - predictedX) < AI_BLOCKING_DISTANCE && otherPlayer.x > this.player.x && predictedX > this.player.x) {
				score -= AI_OPPONENT_BLOCKING_PENALTY;
			}
			if (Math.abs(otherPlayer.x - predictedX) < AI_BLOCKING_DISTANCE && otherPlayer.x < this.player.x && predictedX < this.player.x) {
				score -= AI_OPPONENT_BLOCKING_PENALTY;
			}

			// Keep track of the best-scoring blossom candidate
			if (score > bestScore) {
				bestScore = score;
				bestBlossom = {
					x: predictedX,
					blossom: blossom,
					isPerfect: isPerfect
				};
			}
		});

		// Lock onto the highest scoring target and its predicted X
		if (bestBlossom) {
			this.targetBlossom = bestBlossom.blossom;
			this.targetX = bestBlossom.x;
		}

		// Layer lane-control behaviour on top: try to intercept streak lanes
		const lanes = laneSystem.lanes;
		lanes.forEach(lane => {
			if (lane.catchStreak.player1 > AI_LANE_STREAK_THRESHOLD && this.player.id === 2) {
				// Look for blossoms falling within this lane's horizontal bounds
				const laneBlossoms = activeBlossoms.filter(b => {
					const predictedX = b.x + (windSystem && windSystem.isActive() ? windSystem.getDirection() * BLOSSOM_WIND_DRIFT * AI_WIND_PREDICTION_TIME : 0);
					return predictedX >= lane.leftEdge && predictedX <= lane.rightEdge;
				});
				if (laneBlossoms.length > 0) {
					this.targetBlossom = laneBlossoms[0];
					this.targetX = lane.centerX;
				}
			}
		});

		// Evaluate push strategy when opponent blocks access to our target
		this.pushActive = false;
		if (this.targetBlossom && this.player.overlaps(otherPlayer)) {
			const laneRegion = this.player.getLaneRegion(laneSystem);
			const otherLaneRegion = otherPlayer.getLaneRegion(laneSystem);

			if (laneRegion >= 0 && laneRegion === otherLaneRegion) {
				const lane = laneSystem.getLane(laneRegion);
				if (lane.owner === this.player.id) {
					// Favour aggression when we own the contested lane
					this.pushActive = true;
				} else if (lane.owner === otherPlayer.id) {
					// Attempt to dash away when the opponent owns the lane
					if (this.player.dashCooldown <= 0 && !this.player.dashing) {
						const dashKeys = this.player.id === 1
							? { dash: 'Space' }
							: { dash: 'ShiftRight' };
						inputManager.simulateKeyPress(dashKeys.dash);
					}
				}
			}

			// Push if the opponent stands directly between the AI and its target
			if (this.targetBlossom) {
				const targetX = this.targetX;
				const playerX = this.player.x;
				const otherX = otherPlayer.x;

				if ((playerX < targetX && otherX > playerX && otherX < targetX) ||
					(playerX > targetX && otherX < playerX && otherX > targetX)) {
					this.pushActive = true;
				}
			}
		}

		// Allow higher difficulties to use special abilities as part of their plan
		const caps = AI_CAPABILITIES[this.difficulty];

		if (caps.canUseAbilities) {
			this.useAbilities(otherPlayer, laneSystem, activeBlossoms);
		}

	}

	/**
	 * Decides when to trigger AI-controlled abilities based on opponent
	 * behaviour, golden blossoms and lane ownership.
	 *
	 * @param {Player} otherPlayer - Opponent reference.
	 * @param {LaneSystem} laneSystem - Lane system used for ownership checks.
	 * @param {Array<Object>} blossoms - Current blossoms in play.
	 */
	useAbilities(otherPlayer, laneSystem, blossoms) {
		// Reverse Push: counter an aggressively pushing opponent once enough meter is built
		if (otherPlayer.pushActive && this.player.perfectMeter.value >= ABILITY_COSTS.reversePush &&
			this.player.abilities.reversePush.cooldown <= 0) {
			this.player.useAbility('reversePush');
		}

		// Ink Freeze: disrupt the opponent when they are near a golden blossom
		const nearbyGolden = blossoms.find(b => {
			if (!b.golden || !b.active) return false;
			const dx = Math.abs(b.x - otherPlayer.x);
			return dx < AI_GOLDEN_NEARBY_DISTANCE;
		});
		if (nearbyGolden && this.player.perfectMeter.value >= ABILITY_COSTS.inkFreeze &&
			this.player.abilities.inkFreeze.cooldown <= 0) {
			this.player.useAbility('inkFreeze');
		}

		// Momentum Surge: grab or contest lane control when behind on lane ownership
		const ownedLanes = laneSystem.lanes.filter(l => l.owner === this.player.id);
		if (ownedLanes.length < 2 && this.player.perfectMeter.value >= ABILITY_COSTS.momentumSurge &&
			this.player.abilities.momentumSurge.cooldown <= 0) {
			this.player.useAbility('momentumSurge');
		}
	}

	/**
	 * Converts AI targeting decisions into horizontal input via InputManager.
	 *
	 * @param {InputManager} inputManager - Input API to simulate key presses on.
	 */
	getMovementInput(inputManager) {
		// If there is no target, clear inputs so the player remains idle
		if (!this.targetX) {
			const keys = this.player.id === 1
				? { left: 'KeyA', right: 'KeyD', dash: 'Space', push: 'ControlRight' }
				: { left: 'ArrowLeft', right: 'ArrowRight', dash: 'ShiftRight', push: 'ControlRight' };
			inputManager.simulateKeyRelease(keys.left);
			inputManager.simulateKeyRelease(keys.right);
			return;
		}

		// Work out the horizontal delta to the target X
		const dx = this.targetX - this.player.x;
		const distance = Math.abs(dx);

		const keys = this.player.id === 1
			? { left: 'KeyA', right: 'KeyD', dash: 'Space', push: 'ControlRight' }
			: { left: 'ArrowLeft', right: 'ArrowRight', dash: 'ShiftRight', push: 'ControlRight' };

		// Reset movement keys so we don't accumulate stale input
		inputManager.simulateKeyRelease(keys.left);
		inputManager.simulateKeyRelease(keys.right);

		// Stop issuing movement input once we are close enough
		if (distance < AI_STOP_DISTANCE) {
			return;
		}

		// Gently steer left or right towards the target without snapping
		if (Math.abs(dx) > AI_STEER_THRESHOLD) {
			if (dx < 0) {
				inputManager.simulateKeyPress(keys.left);
			} else {
				inputManager.simulateKeyPress(keys.right);
			}
		}

		// Consider dashing for golden blossoms or defensive escapes
		const caps = AI_CAPABILITIES[this.difficulty];

		if (caps.canDash && this.player.dashCooldown <= 0 && !this.player.dashing) {
			// Offensive dash to reach distant golden blossoms
			if (distance > AI_DASH_DISTANCE_THRESHOLD && this.targetBlossom && this.targetBlossom.golden) {
				if (inputManager.wasKeyJustPressed(keys.dash)) {
					inputManager.consumeKey(keys.dash);
				} else {
					inputManager.simulateKeyPress(keys.dash);
				}
			}
			// Defensive dash when a defensive window is active
			if (this.defensiveTimer > 0) {
				if (inputManager.wasKeyJustPressed(keys.dash)) {
					inputManager.consumeKey(keys.dash);
				} else {
					inputManager.simulateKeyPress(keys.dash);
				}
			}
		}
	}
}