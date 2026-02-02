import {
	LANE_CENTER_RADIUS_MIN,
	LANE_CENTER_RADIUS_FACTOR,
	LANE_OWNERSHIP_STREAK_THRESHOLD,
	LANE_SPAWN_EDGE_LEFT,
	LANE_SPAWN_EDGE_RIGHT,
	LANE_LEFT_CENTER,
	LANE_MIDDLE_CENTER,
	LANE_RIGHT_CENTER,
	LANE_WIDTH
} from './Constants.js';

export class LaneSystem {
	/**
	 * Describes the three visual lane regions used for spawning and ownership.
	 * Lanes are purely visual; they do not directly constrain movement.
	 *
	 * @param {number} canvasWidth - Overall canvas width.
	 * @param {number} canvasHeight - Overall canvas height.
	 */
	constructor(canvasWidth, canvasHeight) {
		// Store dimensions so lane edges can be expressed in pixels
		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;

		// Radius (in px) around lane center that counts as a perfect catch
		this.centerRadius = Math.max(LANE_CENTER_RADIUS_MIN, Math.round(this.canvasWidth * LANE_CENTER_RADIUS_FACTOR));

		// Create three visually-equal zones separated by two bamboo stalks
		this.lanes = [
			{
				index: 0,
				x: canvasWidth * LANE_LEFT_CENTER,
				width: canvasWidth * LANE_WIDTH,
				owner: null,
				catchStreak: { player1: 0, player2: 0 },
				leftEdge: 0,
				rightEdge: canvasWidth * LANE_WIDTH,
				centerX: canvasWidth * LANE_LEFT_CENTER
			},
			{
				index: 1,
				x: canvasWidth * LANE_MIDDLE_CENTER,
				width: canvasWidth * LANE_WIDTH,
				owner: null,
				catchStreak: { player1: 0, player2: 0 },
				leftEdge: canvasWidth * LANE_WIDTH,
				rightEdge: canvasWidth * (LANE_WIDTH * 2),
				centerX: canvasWidth * LANE_MIDDLE_CENTER
			},
			{
				index: 2,
				x: canvasWidth * LANE_RIGHT_CENTER,
				width: canvasWidth * LANE_WIDTH,
				owner: null,
				catchStreak: { player1: 0, player2: 0 },
				leftEdge: canvasWidth * (LANE_WIDTH * 2),
				rightEdge: canvasWidth,
				centerX: canvasWidth * LANE_RIGHT_CENTER
			}
		];
	}

	/**
	 * Returns a lane definition by index.
	 *
	 * @param {number} index - Lane index (0, 1 or 2).
	 */
	getLane(index) {
		return this.lanes[index];
	}

	/**
	 * Gets a random X spawn position inside a given lane's horizontal extent.
	 *
	 * @param {number} laneIndex - Index of target lane.
	 * @returns {{x:number, laneIndex:number}} Random spawn position data.
	 */
	getRandomSpawnPosition(laneIndex) {
		const lane = this.lanes[laneIndex];
		var leftEdge = lane.leftEdge;
		var rightEdge = lane.rightEdge;
		switch(laneIndex)
		{
			case 0:
				leftEdge = LANE_SPAWN_EDGE_LEFT;
				break;
			case 2:
				rightEdge = LANE_SPAWN_EDGE_RIGHT;		
				break;
		}
		const x = leftEdge + Math.random() * (rightEdge - leftEdge);
		return { x, laneIndex };
	}

	/**
	 * Checks whether a given X coordinate is inside the "perfect" center band.
	 *
	 * @param {number} x - World x coordinate to evaluate.
	 * @param {number} laneIndex - Lane whose center band to test against.
	 * @param {number} [centerRadius] - Optional override for perfect radius.
	 */
	isInLaneCenter(x, laneIndex, centerRadius) {
		const lane = this.lanes[laneIndex];
		const radius = (typeof centerRadius === 'number') ? centerRadius : this.centerRadius;
		const distance = Math.abs(x - lane.centerX);
		return distance < radius;
	}

	/**
	 * Returns the index of the lane which contains the given X position.
	 *
	 * @param {number} x - World x coordinate to test.
	 * @returns {number} Lane index or -1 when outside all lanes.
	 */
	getLaneRegionForPoint(x) {
		for (let i = 0; i < this.lanes.length; i++) {
			const lane = this.lanes[i];
			if (x >= lane.leftEdge && x <= lane.rightEdge) {
				return i;
			}
		}
		return -1; // Not in any lane region
	}

	/**
	 * Records that a player caught a blossom in the given lane and updates
	 * streaks and ownership where needed.
	 *
	 * @param {number} laneIndex - Lane where the catch occurred.
	 * @param {number} playerId - ID of the player who caught the blossom.
	 */
	recordCatch(laneIndex, playerId) {
		const lane = this.lanes[laneIndex];
		const otherPlayerId = playerId === 1 ? 2 : 1;

		// Reset the opposing player's streak for this lane
		lane.catchStreak[`player${otherPlayerId}`] = 0;

		// Increment the catching player's streak
		lane.catchStreak[`player${playerId}`]++;

		// Claim lane when this player reaches the threshold streak
		if (lane.catchStreak[`player${playerId}`] >= LANE_OWNERSHIP_STREAK_THRESHOLD) {
			lane.owner = playerId;
		} else if (lane.catchStreak[`player${otherPlayerId}`] >= LANE_OWNERSHIP_STREAK_THRESHOLD) {
			// Preserve logic for the case where the other player was owner
			lane.owner = otherPlayerId;
		}
	}

	/**
	 * Clears lane ownership and streaks so a new game/round can begin.
	 */
	reset() {
		this.lanes.forEach(lane => {
			lane.owner = null;
			lane.catchStreak = { player1: 0, player2: 0 };
		});
	}
}
