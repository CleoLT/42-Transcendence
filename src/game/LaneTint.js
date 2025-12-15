export class LaneTint {
	/**
	 * Renders simple coloured tints for lane ownership with alpha fades.
	 * Intended to draw after the background but before most gameplay elements.
	 *
	 * @param {LaneSystem} laneSystem - Lane layout and ownership source.
	 * @param {number} canvasWidth - Width of the render canvas.
	 * @param {number} canvasHeight - Height of the render canvas.
	 */
	constructor(laneSystem, canvasWidth, canvasHeight) {
		// References and basic render ordering information
		this.laneSystem = laneSystem;
		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;
		this.sortingOrder = 2;
		this.color = 'rgb(33, 144, 182)';

		// Track per-lane tint details (owner, target alpha, colour)
		this.tints = [
			{
				laneIndex: 0,
				owner: null,
				alpha: 0,
				targetAlpha: 0,
				color: null
			},
			{
				laneIndex: 1,
				owner: null,
				alpha: 0,
				targetAlpha: 0,
				color: null
			},
			{
				laneIndex: 2,
				owner: null,
				alpha: 0,
				targetAlpha: 0,
				color: null
			}
		];

		// Player colour palette used when lanes are claimed
		this.playerColors = {
			1: { r: 33, g: 144, b: 182 },
			2: { r: 144, g: 238, b: 144 }
		};
	}

	/**
	 * Adjusts tint target alpha and colours based on lane ownership, then
	 * fades current alpha towards its targets.
	 *
	 * @param {number} deltaTime - Time elapsed since last frame.
	 */
	update(deltaTime) {
		const lanes = this.laneSystem.lanes;

		lanes.forEach((lane, index) => {
			const tint = this.tints[index];

			// Step 1: Detect ownership changes and update target tints
			if (lane.owner !== tint.owner) {
				if (lane.owner) {
					// New owner: ramp tint up to a stronger colour
					tint.owner = lane.owner;
					tint.targetAlpha = 0.50;
					tint.color = this.playerColors[lane.owner];
				} else {
					// Lane cleared: fade tint away
					tint.targetAlpha = 0;
					tint.owner = null;
					tint.color = null;
				}
			}

			// Step 2: Animate alpha towards the desired value
			const fadeSpeed = 1.0;
			if (tint.alpha < tint.targetAlpha) {
				tint.alpha = Math.min(tint.targetAlpha, tint.alpha + deltaTime * fadeSpeed);
			} else if (tint.alpha > tint.targetAlpha) {
				tint.alpha = Math.max(tint.targetAlpha, tint.alpha - deltaTime * fadeSpeed);
			}
		});
	}

	/**
	 * Renders each lane tint as a solid coloured rectangle with alpha fade.
	 *
	 * @param {CanvasRenderingContext2D} ctx - Drawing context.
	 */
	render(ctx) {
		const lanes = this.laneSystem.lanes;

		lanes.forEach((lane, index) => {
			const tint = this.tints[index];

			if (tint.owner && tint.alpha > 0 && tint.color) {
				const width = lane.rightEdge - lane.leftEdge;

				ctx.save();
				ctx.fillStyle = `rgba(${tint.color.r}, ${tint.color.g}, ${tint.color.b}, ${tint.alpha})`;
				ctx.fillRect(lane.leftEdge, 0, width, this.canvasHeight);
				ctx.restore();
			}
		});
	}

	/**
	 * Resets tint values to the default starting ownership configuration.
	 */
	reset() {
		// Left lane: player 1, right lane: player 2, middle neutral
		this.tints[0] = {
			laneIndex: 0,
			owner: 1,
			alpha: 0.5,
			targetAlpha: 0.5,
			color: this.playerColors[1]
		};

		this.tints[1] = {
			laneIndex: 1,
			owner: null,
			alpha: 0,
			targetAlpha: 0,
			color: null
		};

		this.tints[2] = {
			laneIndex: 2,
			owner: 2,
			alpha: 0.5,
			targetAlpha: 0.5,
			color: this.playerColors[2]
		};
	}
}

