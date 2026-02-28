import {
	LANE_OWNERSHIP_STREAK_THRESHOLD,
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

		const laneCenterRadiusMin = 40;
		const laneCenterRadiusFactor = 0.06;
		// Radius (in px) around lane center that counts as a perfect catch
		this.centerRadius = Math.max(laneCenterRadiusMin, Math.round(this.canvasWidth * laneCenterRadiusFactor));

		const laneLeftCenter = 0.166;
		const laneMiddleCenter = 0.5;
		const laneRightCenter = 0.833;
		const laneWidth = 0.333;
		// Create three visually-equal zones separated by two bamboo stalks
		this.lanes = [
			{
				index: 0,
				x: canvasWidth * laneLeftCenter,
				width: canvasWidth * laneWidth,
				owner: null,
				catchStreak: { player1: 0, player2: 0 },
				leftEdge: 0,
				rightEdge: canvasWidth * laneWidth,
				centerX: canvasWidth * laneLeftCenter
			},
			{
				index: 1,
				x: canvasWidth * laneMiddleCenter,
				width: canvasWidth * laneWidth,
				owner: null,
				catchStreak: { player1: 0, player2: 0 },
				leftEdge: canvasWidth * laneWidth,
				rightEdge: canvasWidth * (laneWidth * 2),
				centerX: canvasWidth * laneMiddleCenter
			},
			{
				index: 2,
				x: canvasWidth * laneRightCenter,
				width: canvasWidth * laneWidth,
				owner: null,
				catchStreak: { player1: 0, player2: 0 },
				leftEdge: canvasWidth * (laneWidth * 2),
				rightEdge: canvasWidth,
				centerX: canvasWidth * laneRightCenter
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
		const laneSpawnEdgeLeft = 133;
		const laneSpawnEdgeRight = 1668;
		switch(laneIndex)
		{
			case 0:
				leftEdge = laneSpawnEdgeLeft;
				break;
			case 2:
				rightEdge = laneSpawnEdgeRight;		
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
