import { PerfectMeter } from './PerfectMeter.js';

export class Player {
	/**
	 * Constructs a new player bowl with movement, push and ability state.
	 *
	 * @param {number} id - Player identifier (1 or 2).
	 * @param {'left' | 'right'} side - Which side of the arena this player owns.
	 * @param {number} canvasWidth - Width of the game canvas.
	 * @param {number} canvasHeight - Height of the game canvas.
	 */
	constructor(id, side, canvasWidth, canvasHeight) {
		// Identity and placement information
		this.id = id;
		this.side = side;
		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;

		// Scoring and perfect meter resource
		this.score = 0;
		this.perfectMeter = new PerfectMeter(9);

		// Initial bowl position and basic movement parameters
		this.x = side === 'left' ? canvasWidth * 0.25 : canvasWidth * 0.75;
		this.y = canvasHeight - 60;
		this.speed = 300;
		this.width = 50;
		this.height = 30;
		this.radius = 30;

		// Push interaction state and cooldowns
		this.pushCooldown = 0;
		this.pushActive = false;

		// Dash state, duration and invulnerability
		this.dashing = false;
		this.dashTimer = 0;
		this.dashDuration = 0.2;
		this.dashCooldown = 0;
		this.dashCooldownTime = 2.5;
		this.dashDirection = { x: 0 };
		this.pushInvulnerable = false;

		// Ability slots and resource thresholds
		this.abilities = {
			reversePush: { cost: 3, cooldown: 0, active: false },
			inkFreeze: { cost: 6, cooldown: 0, active: false },
			momentumSurge: { cost: 9, cooldown: 0, active: false }
		};
		this.frozen = false;
		this.freezeTimer = 0;
		this.momentumActive = false;
		this.momentumTimer = 0;
		this.momentumPushCount = 0;

		// Collision side flags used to restrict movement
		this.blockedLeft = false;
		this.blockedRight = false;

		// Horizontal knockback velocity applied by push interactions
		this.pushVelocityX = 0;
	}

	/**
	 * Advances player movement, abilities and state for one frame.
	 *
	 * @param {number} deltaTime - Time step for this update.
	 * @param {InputManager} inputManager - Input source bound to this player.
	 * @param {LaneSystem} laneSystem - Lanes used for region queries.
	 * @param {Player} otherPlayer - Opposing player for collision checks.
	 * @returns {string|null} A logical ability result token (e.g. 'freeze').
	 */
	update(deltaTime, inputManager, laneSystem, otherPlayer) {
		// Track the most recently activated ability result
		let abilityUsed = null;

		// Step cooldown timers and deactivate abilities when finished
		Object.values(this.abilities).forEach(ability => {
			if (ability.cooldown > 0) {
				ability.cooldown -= deltaTime;
			}
			if (ability.active) {
				ability.cooldown -= deltaTime;
				if (ability.cooldown <= 0) {
					ability.active = false;
				}
			}
		});

		// Count down freeze duration and unfreeze when it expires
		if (this.frozen) {
			this.freezeTimer -= deltaTime;
			if (this.freezeTimer <= 0) {
				this.frozen = false;
			}
		}

		// Maintain momentum buff and clear it when the timer runs out
		if (this.momentumActive) {
			this.momentumTimer -= deltaTime;
			if (this.momentumTimer <= 0) {
				this.momentumActive = false;
				this.momentumPushCount = 0;
			}
		}

		// Let push cooldown tick down so pushes can be reused
		if (this.pushCooldown > 0) {
			this.pushCooldown -= deltaTime;
		}

		// Handle dash timing and cooldown logic
		if (this.dashing) {
			this.dashTimer -= deltaTime;
			if (this.dashTimer <= 0) {
				this.dashing = false;
				this.pushInvulnerable = false;
				this.dashCooldown = this.dashCooldownTime;
			}
		} else {
			if (this.dashCooldown > 0) {
				this.dashCooldown -= deltaTime;
			}
		}

		// A frozen player only updates timers and does not accept input
		if (this.frozen) return abilityUsed;

		// Resolve which key bindings apply to this player
		const keys = this.id === 1
			? { left: 'KeyA', right: 'KeyD', push: 'ShiftLeft', dash: 'Space' }
			: { left: 'ArrowLeft', right: 'ArrowRight', push: 'ControlRight', dash: 'ShiftRight' };

		// Cache whether the push key is currently held
		this.pushActive = inputManager.isKeyPressed(keys.push);

		// Dash input is edge-triggered with no buffering: the press is always
		// consumed on this frame, even if the dash cannot be started.
		if (inputManager.wasKeyJustPressed(keys.dash)) {
			inputManager.consumeKey(keys.dash);

			// Only start a dash when the state actually allows it
			if (!this.dashing && this.dashCooldown <= 0) {
				// Start from current movement keys to derive dash axis
				let dashX = 0;
				if (inputManager.isKeyPressed(keys.left)) dashX = -1;
				if (inputManager.isKeyPressed(keys.right)) dashX = 1;

				// Fallback direction when no input is held
				if (dashX === 0) {
					dashX = this.id === 1 ? -1 : 1;
				}

				this.dashDirection = { x: dashX };
				this.dashing = true;
				this.dashTimer = this.dashDuration;
				this.pushInvulnerable = true;
			}
		}

		// Calculate effective movement speed before applying input
		let moveSpeed = this.speed;
		if (this.dashing) {
			moveSpeed *= 2.0;
			this.x += this.dashDirection.x * moveSpeed * deltaTime;
		} else {
			if (this.momentumActive) {
				moveSpeed *= 1.5;
			}

			// Apply left / right input for horizontal-only motion
			if (inputManager.isKeyPressed(keys.left)) {
				this.x -= moveSpeed * deltaTime;
			}
			if (inputManager.isKeyPressed(keys.right)) {
				this.x += moveSpeed * deltaTime;
			}
		}

		// Apply any pending knockback from push interactions, with damping so
		// that the motion is smooth over multiple frames instead of a teleport.
		if (this.pushVelocityX !== 0) {
			this.x += this.pushVelocityX * deltaTime;

			// Exponential damping keeps the motion feeling like a shove
			const damping = 6; // higher = shorter push duration
			const decay = Math.exp(-damping * deltaTime);
			this.pushVelocityX *= decay;

			// Snap to zero once the remaining speed is visually negligible
			if (Math.abs(this.pushVelocityX) < 5) {
				this.pushVelocityX = 0;
			}
		}

		// Clamp the bowl within the horizontal canvas limits
		//this.x = Math.max(this.radius, Math.min(this.canvasWidth - this.radius, this.x));

		// Map keyboard inputs to abilities for this player index. Abilities are
		// also edge-triggered: a press that happens while the ability is on
		// cooldown or unaffordable is discarded instead of being buffered.
		if (this.id === 1) {
			if (inputManager.wasKeyJustPressed('Digit1')) {
				inputManager.consumeKey('Digit1');
				abilityUsed = this.useAbility('reversePush');
			}
			if (inputManager.wasKeyJustPressed('Digit2')) {
				inputManager.consumeKey('Digit2');
				abilityUsed = this.useAbility('inkFreeze');
			}
			if (inputManager.wasKeyJustPressed('Digit3')) {
				inputManager.consumeKey('Digit3');
				abilityUsed = this.useAbility('momentumSurge');
			}
		} else {
			if (inputManager.wasKeyJustPressed('Numpad1')) {
				inputManager.consumeKey('Numpad1');
				abilityUsed = this.useAbility('reversePush');
			}
			if (inputManager.wasKeyJustPressed('Numpad2')) {
				inputManager.consumeKey('Numpad2');
				abilityUsed = this.useAbility('inkFreeze');
			}
			if (inputManager.wasKeyJustPressed('Numpad3')) {
				inputManager.consumeKey('Numpad3');
				abilityUsed = this.useAbility('momentumSurge');
			}
		}

		return abilityUsed;
	}

	/**
	 * Updates collision flags and resolves penetration against the other player.
	 *
	 * @param {Player} otherPlayer - The opposing player to test against.
	 */
	checkCollision(otherPlayer) {
		// Calculate distance along the shared horizontal axis
		const dx = this.x - otherPlayer.x;
		const distance = Math.abs(dx);
		const minDistance = this.radius + otherPlayer.radius;

		// Use a reduced overlap threshold to keep bowls visually separated
		const collisionThreshold = minDistance * 0.99;

		if (distance < collisionThreshold) {
			// Collision detected: identify which side is blocked
			if (dx > 0) {
				this.blockedLeft = true;
				otherPlayer.blockedRight = true;

				// Nudge both players apart to resolve penetration
				const overlap = collisionThreshold - distance;
				this.x += overlap / 2;
				otherPlayer.x -= overlap / 2;
			} else {
				this.blockedRight = true;
				otherPlayer.blockedLeft = true;

				// Nudge both players apart to resolve penetration
				const overlap = collisionThreshold - distance;
				this.x -= overlap / 2;
				otherPlayer.x += overlap / 2;
			}
		} else {
			// Reset flags when no collision is present
			this.blockedLeft = false;
			this.blockedRight = false;
		}
	}

	/**
	 * Attempts to trigger an ability and returns its logical effect result.
	 *
	 * @param {string} abilityName - Key of the ability to activate.
	 * @returns {string|null} A logical effect token or null if not used.
	 */
	useAbility(abilityName) {
		// Find the requested ability and validate cooldown
		const ability = this.abilities[abilityName];
		if (!ability || ability.cooldown > 0) return null;

		// Spend perfect-meter points; fail if not enough resource
		if (!this.perfectMeter.consume(ability.cost)) {
			return null;
		}

		// Seed cooldown and mark the ability as active
		ability.cooldown = this.getAbilityCooldown(abilityName);
		ability.active = true;

		// Map abilities to high-level effect tokens
		if (abilityName === 'inkFreeze') {
			return 'freeze';
		} else if (abilityName === 'reversePush') {
			return 'reversePush';
		} else if (abilityName === 'momentumSurge') {
			this.momentumActive = true;
			this.momentumTimer = 1.5; // 1-2 seconds
			this.momentumPushCount = 0;
			return 'momentum';
		}

		return null;
	}

	/**
	 * Returns the cooldown time for a given ability name.
	 *
	 * @param {string} abilityName - Ability identifier.
	 * @returns {number} Cooldown duration in seconds.
	 */
	getAbilityCooldown(abilityName) {
		const cooldowns = {
			reversePush: 5,
			inkFreeze: 8,
			momentumSurge: 10
		};
		return cooldowns[abilityName] || 5;
	}

	/**
	 * Adds the given number of points to this player's score.
	 *
	 * @param {number} points - Points to award.
	 */
	addScore(points) {
		this.score += points;
	}

	/**
	 * Returns true when a world point lies inside the bowl radius.
	 *
	 * @param {number} x - World x coordinate.
	 * @param {number} y - World y coordinate.
	 * @returns {boolean} True if the point is inside the bowl.
	 */
	containsPoint(x, y) {
		const dx = x - this.x;
		const dy = y - this.y;
		const distance = Math.sqrt(dx * dx + dy * dy);
		return distance < this.radius;
	}

	/**
	 * Tests for overlap with another player for push detection.
	 *
	 * @param {Player} otherPlayer - Player to test against.
	 * @returns {boolean} True if the two bowls are overlapping.
	 */
	/**
	 * Tests for overlap with another player for push detection.
	 *
	 * @param {Player} otherPlayer - Player to test against.
	 * @returns {boolean} True if the two bowls are overlapping.
	 */
	overlaps(otherPlayer) {
		if (this.pushInvulnerable || otherPlayer.pushInvulnerable) {
			return false;
		}
		const dx = this.x - otherPlayer.x;
		const distance = Math.abs(dx);
		const minDistance = this.radius + otherPlayer.radius;

		// Allow a small extra tolerance so pushes still feel responsive
		return distance < minDistance * 1.1;
	}

	/**
	 * Indicates if the player is currently allowed to catch blossoms.
	 *
	 * @returns {boolean} True when catching is enabled.
	 */
	canCatch() {
		return !this.dashing;
	}

	/**
	 * Determines which lane region the player is visually occupying.
	 *
	 * @param {LaneSystem} laneSystem - System to query lane boundaries from.
	 * @returns {number} Lane index or -1 when outside any lane.
	 */
	getLaneRegion(laneSystem) {
		const lanes = laneSystem.lanes;
		for (let i = 0; i < lanes.length; i++) {
			const lane = lanes[i];
			if (this.x >= lane.leftEdge && this.x <= lane.rightEdge) {
				return i;
			}
		}
		return -1; // Not in any lane region
	}

	/**
	 * Attempts to push the opposing player, optionally using special effects.
	 *
	 * @param {Player} otherPlayer - Target of the push.
	 * @param {LaneSystem} laneSystem - Lane system for contextual logic.
	 * @returns {boolean} True if a push was actually performed.
	 */
	push(otherPlayer, laneSystem) {
		if (this.pushCooldown > 0) return false;
		if (!this.pushActive) return false;

		// Reverse push inverts direction and immediately ends the buff
		if (this.abilities.reversePush.active) {
			this.applyPush(otherPlayer, true);
			this.abilities.reversePush.active = false;
			this.pushCooldown = 0.5;
			return true;
		} else {
			// Momentum surge allows two rapid pushes within the buff window
			if (this.momentumActive && this.momentumPushCount < 2) {
				this.applyPush(otherPlayer, false);
				this.momentumPushCount++;
				this.pushCooldown = 0.5;
				return true;
			} else {
				this.applyPush(otherPlayer, false);
				this.pushCooldown = 1;
				return true;
			}
		}
	}

	/**
	 * Applies a horizontal knockback impulse to the other player.
	 *
	 * @param {Player} otherPlayer - Player being pushed or pulled.
	 * @param {boolean} reverse - True to pull instead of push.
	 */
	applyPush(otherPlayer, reverse) {
		// Determine the normalised direction from this player to the target
		const dx = otherPlayer.x - this.x;
		const distance = Math.abs(dx);

		// Base impulse strength for the knockback; this is converted into an
		// initial horizontal velocity that decays over subsequent frames.
		const baseImpulse = 900;

		let directionX = 0;
		if (distance === 0) {
			// If overlapping exactly, bias movement away from player sides
			directionX = this.id === 1 ? -1 : 1;
		} else {
			directionX = dx / distance;
		}

		// Reverse push pulls instead of pushing away
		if (reverse) {
			directionX *= -1;
		}

		// Apply the impulse as an additive velocity on the target
		const impulseX = directionX * baseImpulse;
		const maxSpeed = 1200;

		otherPlayer.pushVelocityX += impulseX;
		// Clamp to a sensible maximum speed so repeated pushes don't explode
		if (otherPlayer.pushVelocityX > maxSpeed) otherPlayer.pushVelocityX = maxSpeed;
		if (otherPlayer.pushVelocityX < -maxSpeed) otherPlayer.pushVelocityX = -maxSpeed;
	}

	/**
	 * Freezes this player in place for a short duration.
	 *
	 * @param {number} [duration=0.4] - How long the freeze should last.
	 */
	freeze(duration = 0.4) {
		this.frozen = true;
		this.freezeTimer = duration;
	}

	/**
	 * Restores the player to their starting position and clears motion flags.
	 */
	resetPosition() {
		this.x = this.side === 'left' ? this.canvasWidth * 0.25 : this.canvasWidth * 0.75;
		this.y = this.canvasHeight - 60;
		this.frozen = false;
		this.momentumActive = false;
		this.momentumTimer = 0;
		this.momentumPushCount = 0;
		this.pushCooldown = 0;
		this.dashing = false;
		this.dashTimer = 0;
		this.dashCooldown = 0;
		this.pushInvulnerable = false;
		this.blockedLeft = false;
		this.blockedRight = false;
		this.pushVelocityX = 0;
	}

	/**
	 * Performs a full logical reset including score and abilities.
	 */
	reset() {
		this.score = 0;
		this.perfectMeter.reset();
		this.resetPosition();
		this.frozen = false;
		this.freezeTimer = 0;
		this.momentumActive = false;
		this.momentumTimer = 0;
		this.momentumPushCount = 0;
		Object.values(this.abilities).forEach(ability => {
			ability.active = false;
			ability.cooldown = 0;
		});
	}

	/**
	 * Summarises whether each ability can currently be used and its cooldown.
	 *
	 * @returns {Object} Ability status snapshot for UI rendering.
	 */
	getAbilityStatus() {
		return {
			reversePush: {
				canUse: this.perfectMeter.value >= 3 && this.abilities.reversePush.cooldown <= 0,
				cooldown: this.abilities.reversePush.cooldown
			},
			inkFreeze: {
				canUse: this.perfectMeter.value >= 6 && this.abilities.inkFreeze.cooldown <= 0,
				cooldown: this.abilities.inkFreeze.cooldown
			},
			momentumSurge: {
				canUse: this.perfectMeter.value >= 9 && this.abilities.momentumSurge.cooldown <= 0,
				cooldown: this.abilities.momentumSurge.cooldown
			}
		};
	}

	getX() { return this.x; }
	getY() { return this.y; }
	getWidth() { return this.width; }
	getHeight() { return this.height; }
	getRadius() { return this.radius; }
}
