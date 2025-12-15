// Renderer.js
export class Renderer {
	/**
	 * Handles all canvas-based drawing for the game: background, lanes,
	 * blossoms, bowls, meters, effects and tables.
	 *
	 * @param {CanvasRenderingContext2D} ctx - Primary drawing context.
	 * @param {number} canvasWidth - Canvas width in pixels.
	 * @param {number} canvasHeight - Canvas height in pixels.
	 * @param {SpriteLibrary|null} spriteLibrary - Optional sprite provider.
	 * @param {LaneTint|null} laneTint - Optional lane tint helper.
	 */
	constructor(ctx, canvasWidth, canvasHeight, spriteLibrary = null, laneTint = null) {
		// Core drawing context and geometry
		this.ctx = ctx;
		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;

		// Misc render timers and helpers
		this.paperTextureGenerated = false;
		this.spriteLibrary = spriteLibrary;
		this.laneTint = laneTint;

		// Build in-memory fallback blossom sprites for when none are loaded
		this.createBlossomSprites();
	}

	/**
	 * Creates simple canvas-based sprites for normal and golden blossoms for
	 * use when texture images are not available.
	 */
	createBlossomSprites() {
		// Create pink sakura blossom sprite
		const pinkCanvas = document.createElement('canvas');
		pinkCanvas.width = 40;
		pinkCanvas.height = 40;
		const pinkCtx = pinkCanvas.getContext('2d');

		// Draw 5-petal sakura blossom
		pinkCtx.fillStyle = 'rgba(255, 192, 203, 0.9)';
		pinkCtx.strokeStyle = 'rgba(219, 112, 147, 0.8)';
		pinkCtx.lineWidth = 2;

		const petals = 5;
		const angleStep = (Math.PI * 2) / petals;
		const size = 18;

		pinkCtx.beginPath();
		for (let i = 0; i < petals; i++) {
			const angle = i * angleStep;
			const x = 20 + Math.cos(angle) * size;
			const y = 20 + Math.sin(angle) * size;

			if (i === 0) {
				pinkCtx.moveTo(x, y);
			} else {
				pinkCtx.lineTo(x, y);
			}
		}
		pinkCtx.closePath();
		pinkCtx.fill();
		pinkCtx.stroke();

		// Center
		pinkCtx.fillStyle = 'rgba(255, 20, 147, 0.6)';
		pinkCtx.beginPath();
		pinkCtx.arc(20, 20, 6, 0, Math.PI * 2);
		pinkCtx.fill();

		this.pinkBlossomSprite = pinkCanvas;

		// Create golden blossom sprite
		const goldenCanvas = document.createElement('canvas');
		goldenCanvas.width = 50;
		goldenCanvas.height = 50;
		const goldenCtx = goldenCanvas.getContext('2d');

		goldenCtx.fillStyle = 'rgba(255, 215, 0, 0.9)';
		goldenCtx.strokeStyle = 'rgba(255, 140, 0, 0.9)';
		goldenCtx.lineWidth = 3;

		goldenCtx.beginPath();
		for (let i = 0; i < petals; i++) {
			const angle = i * angleStep;
			const x = 25 + Math.cos(angle) * 22;
			const y = 25 + Math.sin(angle) * 22;

			if (i === 0) {
				goldenCtx.moveTo(x, y);
			} else {
				goldenCtx.lineTo(x, y);
			}
		}
		goldenCtx.closePath();
		goldenCtx.fill();
		goldenCtx.stroke();

		// Golden center with glow
		goldenCtx.shadowBlur = 10;
		goldenCtx.shadowColor = '#ffd700';
		goldenCtx.fillStyle = 'rgba(255, 215, 0, 0.9)';
		goldenCtx.beginPath();
		goldenCtx.arc(25, 25, 10, 0, Math.PI * 2);
		goldenCtx.fill();
		goldenCtx.shadowBlur = 0;

		this.goldenBlossomSprite = goldenCanvas;
	}

	/**
	 * Renders the paper-like background with a subtle noise pattern.
	 *
	 * @param {CanvasRenderingContext2D} ctx - Drawing context.
	 * @param {number} width - Target width.
	 * @param {number} height - Target height.
	 */
	renderBackground(ctx, width, height) {
		// Step 1: Fill with a light cream colour for the base paper
		ctx.fillStyle = '#fffef0'; // Light cream/yellow
		ctx.fillRect(0, 0, width, height);

		// Step 2: Sprinkle a few random specks to suggest paper grain
		if (!this.paperTextureGenerated) {
			ctx.fillStyle = 'rgba(139, 115, 85, 0.02)';
			for (let i = 0; i < 200; i++) {
				const x = Math.random() * width;
				const y = Math.random() * height;
				const size = 1 + Math.random() * 2;
				ctx.fillRect(x, y, size, size);
			}
			this.paperTextureGenerated = true;
		}
	}

	/**
	 * Draws lane separators only; overlays are handled elsewhere.
	 *
	 * @param {LaneSystem} laneSystem - Lane definition reference.
	 */
	renderLanes(laneSystem) {
		// Read lane layout for computing separator positions
		const lanes = laneSystem.lanes;

		// Draw two bamboo separators (between left/middle and middle/right)
		this.drawBambooSeparator(lanes[0].rightEdge, 0); // Between left and middle
		this.drawBambooSeparator(lanes[1].rightEdge, 1); // Between middle and right
	}

	/**
	 * Draws a single bamboo separator using either a sprite or a procedural
	 * sumi-e style fallback.
	 *
	 * @param {number} x - Horizontal position of the separator.
	 * @param {number} index - Optional index for sprite variants.
	 */
	drawBambooSeparator(x, index) {
		const ctx = this.ctx;
		ctx.save();

		// Use bamboo sprite if available, otherwise fall back to a brush stroke
		const bambooSprite = this.spriteLibrary && this.spriteLibrary.getBambooSprite(index);

		if (bambooSprite) {
			const spriteWidth = 30;
			const spriteHeight = this.canvasHeight;
			ctx.translate(x, 0);
			ctx.drawImage(bambooSprite, -spriteWidth / 2, 0, spriteWidth, spriteHeight);
		} else {
			// Fallback: vertical, slightly irregular stroke with ink specks
			ctx.strokeStyle = '#2a2a2a';
			ctx.lineWidth = 4;
			ctx.lineCap = 'round';
			ctx.lineJoin = 'round';

			// Natural, irregular brushstroke
			ctx.beginPath();
			let currentX = x;
			ctx.moveTo(currentX, 0);

			for (let y = 0; y < this.canvasHeight; y += 8) {
				// Add natural variation and small ink bleed to the path
				const variation = (Math.sin(y * 0.03) + Math.cos(y * 0.05)) * 2;
				const inkBleed = Math.random() * 1.5; // Soft ink bleed
				currentX = x + variation + inkBleed;

				ctx.lineTo(currentX, y);

				// Add ink splotches occasionally
				if (Math.random() < 0.1) {
					ctx.fillStyle = 'rgba(42, 42, 42, 0.3)';
					ctx.beginPath();
					ctx.arc(currentX, y, 2 + Math.random() * 2, 0, Math.PI * 2);
					ctx.fill();
				}
			}

			ctx.stroke();

			// Add a faint ink wash around the separator
			ctx.fillStyle = 'rgba(42, 42, 42, 0.1)';
			ctx.beginPath();
			ctx.moveTo(x - 3, 0);
			ctx.lineTo(x + 3, 0);
			for (let y = 0; y < this.canvasHeight; y += 20) {
				ctx.lineTo(x + 2 + Math.sin(y * 0.02) * 1, y);
			}
			ctx.lineTo(x + 3, this.canvasHeight);
			ctx.lineTo(x - 3, this.canvasHeight);
			ctx.closePath();
			ctx.fill();
		}

		ctx.restore();
	}

	renderPerfectMeterBackplate(ctx, centerX, y) {
		/**
		 * Draws the static backplate behind both players' perfect meters.
		 */

		// Compute shared bar bounds across the middle of the canvas
		const totalWidth = this.canvasWidth * 0.9;
		const height = 48;

		const x = centerX - totalWidth / 2;
		const yTop = y - height / 2;

		ctx.save();

		// Draw solid bar background
		ctx.fillStyle = 'rgba(8,8,8, 0.5)';
		ctx.beginPath();
		ctx.roundRect(x, yTop, totalWidth, height, 14);
		ctx.fill();

		// Outline the bar for definition
		ctx.strokeStyle = '#00000080';
		ctx.lineWidth = 2;
		ctx.stroke();

		ctx.restore();
	}

	/**
	 * Renders a single player's perfect meter using the shared fill sprite,
	 * clipped to their side of the bar.
	 *
	 * @param {CanvasRenderingContext2D} ctx - Drawing context.
	 * @param {Player} player - Player whose meter is rendered.
	 * @param {number} centerX - Center X of the shared bar.
	 * @param {number} y - Vertical position of the bar center.
	 */
	renderPerfectMeter(ctx, player, centerX, y) {
		const meter = player.perfectMeter;
		if (!meter) return;

		// Bullet layout configuration for thresholds (3, 6, 9)
		const bulletRadius = 10;
		const bulletOffset = 120;
		const bulletSpacing = 180;
		const maxBullets = 3;

		// Resolve ink sprite used to fill the bar dynamically
		const inkSprite = (this.spriteLibrary && this.spriteLibrary.getInkFillSprite());
		if (!inkSprite) return;

		const inkWidth = inkSprite.width;
		const inkHeight = inkSprite.height;

		const isLeftPlayer = player.side === 'left';

		// Prepare bullet positions (they will be drawn on top of the ink sprite)
		const bullets = [];
		for (let i = 0; i < maxBullets; i++) {
			const dist = bulletOffset + i * bulletSpacing;
			bullets.push({
				x: isLeftPlayer ? centerX - dist : centerX + dist,
				y
			});
		}

		// Use the smoothed visualValue for a more fluid animation
		const visual = (typeof meter.visualValue === 'number') ? meter.visualValue : meter.value;
		if (!visual || visual <= 0) {
			// Still draw bullets (always visible) even when no ink is present
			bullets.forEach((b, i) => {
				const active = meter.value >= (i + 1) * 3;
				ctx.fillStyle = active ? '#e00000' : '#000000';
				ctx.beginPath();
				ctx.arc(b.x, b.y, bulletRadius, 0, Math.PI * 2);
				ctx.fill();

				ctx.fillStyle = '#ffffff';
				ctx.beginPath();
				ctx.arc(b.x, b.y, bulletRadius * 0.45, 0, Math.PI * 2);
				ctx.fill();
			});
			return;
		}

		// Calculate how far the sprite should travel for each meter segment
		const firstBulletDist = bulletOffset; // distance from center to first bullet
		const lastBulletDist = bulletOffset + bulletSpacing * (maxBullets - 1);

		// Ensure a small visible nib when visual > 0 so 1 point is visible
		const minVisible = 12;

		let travel = 0;
		if (!visual || visual <= 0) {
			travel = 0;
		} else if (visual < 3) {
			// Map visual in (0..3) -> (minVisible .. firstBulletDist)
			const t = visual / 3; // 0..1
			travel = minVisible + t * (firstBulletDist - minVisible);
		} else {
			// Linear mapping: travel(visual=3) === firstBulletDist, travel(visual=meter.max) === lastBulletDist
			const a = (lastBulletDist - firstBulletDist) / (meter.max - 3);
			const b = firstBulletDist - a * 3;
			travel = a * visual + b;
		}

		// Clamp travel into sensible range
		travel = Math.max(0, Math.min(travel, lastBulletDist));

		// Determine sprite X for each player so the tip extends from center
		let drawX;
		if (isLeftPlayer) {
			// Sprite slides left from center
			// Tip (left edge) extends leftward from center
			// drawX is the left edge position = centerX - travel
			drawX = centerX - travel;
		} else {
			// Sprite slides right from center
			// Tip (right edge) extends rightward from center
			// drawX is the left edge position = centerX + travel - inkWidth
			// But we want the right edge at (centerX + travel), so:
			drawX = centerX + travel - inkWidth;
		}

		const drawY = y - inkHeight / 2;

		ctx.save();

		// Clip at the centre line so each player only occupies their half
		ctx.beginPath();
		if (isLeftPlayer) {
			// Only allow pixels LEFT of center
			ctx.rect(
				-10000,               // far left
				-10000,
				centerX + 10000,      // stop at center
				20000
			);
		} else {
			// Only allow pixels RIGHT of center
			ctx.rect(
				centerX,              // start at center
				-10000,
				20000,                // extend far right
				20000
			);
		}
		ctx.clip();

		// Draw sprite at calculated position (slides from center)
		if (isLeftPlayer) {
			ctx.drawImage(
				inkSprite,
				drawX,
				drawY,
				inkWidth,
				inkHeight
			);
		} else {
			// Right-side player: mirror the sprite horizontally so the tip faces outward
			ctx.save();
			// Move origin to the right edge of where the sprite would be, then flip
			ctx.translate(drawX + inkWidth, 0);
			ctx.scale(-1, 1);
			// Draw at x=0 because we've translated to the right edge
			ctx.drawImage(
				inkSprite,
				0,
				drawY,
				inkWidth,
				inkHeight
			);
			ctx.restore();
		}

		ctx.restore();

		// Render threshold bullets on top of the ink sprite
		bullets.forEach((b, i) => {
			// Bullets activate from center outward (i=0 is closest to center)
			const active = meter.value >= (i + 1) * 3;

			ctx.fillStyle = active ? '#e00000' : '#000000';
			ctx.beginPath();
			ctx.arc(b.x, b.y, bulletRadius, 0, Math.PI * 2);
			ctx.fill();

			ctx.fillStyle = '#ffffff';
			ctx.beginPath();
			ctx.arc(b.x, b.y, bulletRadius * 0.45, 0, Math.PI * 2);
			ctx.fill();
		});

	}

	renderLaneBar() {
		/**
		 * Deprecated helper kept for API compatibility; lane bar visuals are
		 * now driven by the perfect meter renderer directly.
		 */
		return;
	}

	/**
	 * Renders all active blossoms using sprites or canvas-based fallbacks.
	 *
	 * @param {BlossomSystem} blossomSystem - Source of blossom list.
	 */
	renderBlossoms(blossomSystem) {
		const blossoms = blossomSystem.getBlossoms();
		const ctx = this.ctx;

		// Prefer loader-based sprites, fall back to procedural sprites otherwise
		const pinkBlossomSprite = this.spriteLibrary && this.spriteLibrary.getBlossomSprite() ||
			this.pinkBlossomSprite;
		const goldenBlossomSprite = this.spriteLibrary && this.spriteLibrary.getGoldenBlossomSprite() ||
			this.goldenBlossomSprite;

		blossoms.forEach(blossom => {
			// Only render active blossoms to avoid ghost shadows
			if (!blossom.active) return;

			ctx.save();

			// Draw blossom using translation + rotation
			ctx.translate(blossom.x, blossom.y);
			ctx.rotate(blossom.rotation);

			// Use sprite (from loader or fallback) depending on golden flag
			if (blossom.golden) {
				// Golden blossom sprite with shimmer
				const size = goldenBlossomSprite.width - 10;
				ctx.drawImage(goldenBlossomSprite, -size / 2, -size / 2, size, size);
			} else {
				// Pink sakura blossom sprite
				const size = pinkBlossomSprite.width;
				ctx.drawImage(pinkBlossomSprite, -size / 2, -size / 2, size, size);
			}

			ctx.restore();
		});
	}

	/**
	 * Renders the player table and bowls for each player.
	 *
	 * @param {Array<Player>} players - Collection of players to draw.
	 */
	renderPlayers(players) {
		const ctx = this.ctx;

		// Draw shared table surface behind the bowls
		this.drawTable(players);

		players.forEach(player => {
			const px = player.getX();
			// Prefer renderer table position for visual Y so bowls sit on the table
			let drawY;
			if (typeof this.tableTop === 'number' && typeof this.tableHeight === 'number') {
				// place bowl slightly into the top area of the table
				drawY = this.tableTop + 5;
			} else {
				drawY = player.getY();
			}

			// Clamp bowl visuals within the horizontal bounds of the table
			let drawX = px;
			const bowlRadius = 36;
			if (typeof this.tableX === 'number' && typeof this.tableWidth === 'number' && typeof this.tableInset === 'number') {
				const minX = this.tableX + this.tableInset + (bowlRadius - 40);
				const maxX = this.tableX + this.tableWidth - this.tableInset - (bowlRadius - 40);
				drawX = Math.max(minX, Math.min(maxX, px));
			}

			// The bowl is the avatar representation; draw it in place
			this.drawBowl(drawX, drawY, player.id, player);
		});
	}

	/**
	 * Draws a table across the bottom using a sprite when available or a
	 * stylised ink/wood table fallback otherwise.
	 *
	 * @param {Array<Player>} players - Used for sizing/alignment only.
	 */
	drawTable(players) {
		if (!players || players.length === 0) return;
		const ctx = this.ctx;
		const bowlRadius = 36; // should match drawBowl default radius

		// Compute table rectangle and top edge so bowls can rest on it
		const tableHeight = Math.round(bowlRadius * 1.2);
		const tableWidth = Math.round(this.canvasWidth * 0.95);
		const tableX = (this.canvasWidth - tableWidth) / 2 ;
		const tableTop = this.canvasHeight - tableHeight - 20;
		// Compute inset early so callers can clamp horizontally
		const _inset = Math.max(4, Math.round(tableWidth * 0.03));
		// Expose metrics so `renderPlayers` can align and clamp bowls
		this.tableTop = tableTop;
		this.tableHeight = tableHeight;
		this.tableX = tableX;
		this.tableWidth = tableWidth;
		this.tableInset = _inset;

		// Use sprite if available, scaling it to the configured width
		const tableSprite = this.spriteLibrary && this.spriteLibrary.getTableSprite();
		if (tableSprite) {
			// Scale sprite to width while preserving aspect
			const aspect = tableSprite.width && tableSprite.height ? tableSprite.width / tableSprite.height : tableWidth / tableHeight;
			const drawW = tableWidth;
			const drawH = Math.round(drawW / aspect);
			const drawY = tableTop + (tableHeight - drawH) / 2;
			ctx.drawImage(tableSprite, tableX, drawY, drawW, drawH);
			return;
		}

		// Fallback: draw a stylised wooden/ink table with legs
		ctx.save();

		

		// Tabletop trapezoid with subtle perspective and ink washes
		const inset = Math.max(4, Math.round(tableWidth * 0.03));
		const topLeftX = tableX + inset;
		const topRightX = tableX + tableWidth - inset;
		const topY = tableTop;
		const bottomY = tableTop + tableHeight;

		ctx.beginPath();
		ctx.moveTo(topLeftX, topY);
		ctx.lineTo(topRightX, topY);
		ctx.lineTo(tableX + tableWidth, bottomY);
		ctx.lineTo(tableX, bottomY);
		ctx.closePath();

		// Layer multiple ink washes for a richer, sumi-e-style top
		const washes = [1, 0.4, 0.2];
		for (let i = 0; i < washes.length; i++) {
			ctx.save();
			ctx.translate(0, (i - 1) * 1); // slight vertical offset per layer
			// ctx.fillStyle = `rgba(8,8,8,${washes[i]})`;
			ctx.fillStyle = `rgba(139, 115, 85, ${washes[i]})`;
			ctx.fill();
			ctx.restore();
		}

		// Bold brush-like outline around the tabletop
		ctx.lineWidth = Math.max(4, Math.round(bowlRadius * 0.18));
		ctx.strokeStyle = 'rgba(10,10,10,0.95)';
		ctx.stroke();


		// Add gentle horizontal grain lines across tabletop
		ctx.strokeStyle = 'rgba(0,0,0,0.06)';
		ctx.lineWidth = 1;
		const grainLines = 4;
		for (let g = 0; g < grainLines; g++) {
			const gy = topY + 4 + (g / (grainLines - 1)) * (tableHeight - 8);
			ctx.beginPath();
			ctx.moveTo(topLeftX + 4, gy);
			ctx.lineTo(topRightX - 4, gy);
			ctx.stroke();
		}

		// Draw three sturdy legs as ink silhouettes
		const legWidth = Math.max(10, Math.round(bowlRadius * 0.32));
		const legHeight = Math.round(tableHeight * 1.25);
		const leftLegX = topLeftX + Math.round(tableWidth * 0.08);
		const centerLegX = tableX + Math.round(tableWidth * 0.5);
		const rightLegX = topRightX - Math.round(tableWidth * 0.08);
		ctx.fillStyle = 'rgba(12,12,12,0.95)';

		// Helper: build a rounded-rectangle path for leg silhouettes
		function roundedRectPath(ctx, x, y, w, h, r) {
			const radius = Math.min(r, w / 2, h / 2);
			ctx.beginPath();
			ctx.moveTo(x + radius, y);
			ctx.lineTo(x + w - radius, y);
			ctx.arcTo(x + w, y, x + w, y + radius, radius);
			ctx.lineTo(x + w, y + h - radius);
			ctx.arcTo(x + w, y + h, x + w - radius, y + h, radius);
			ctx.lineTo(x + radius, y + h);
			ctx.arcTo(x, y + h, x, y + h - radius, radius);
			ctx.lineTo(x, y + radius);
			ctx.arcTo(x, y, x + radius, y, radius);
			ctx.closePath();
		}

		[ leftLegX, centerLegX, rightLegX ].forEach(lx => {
			const lx0 = Math.round(lx - legWidth / 2);
			const ly0 = Math.round(bottomY);
			roundedRectPath(ctx, lx0, ly0, legWidth, legHeight, Math.max(6, Math.round(legWidth * 0.4)));
			ctx.fill();
			// Small shadow to visually connect leg to the underside of the table
			
			ctx.fillStyle = 'rgba(12,12,12,0.95)';
		});

		ctx.restore();
	}

	drawBowl(x, y, playerId, player) {
		const ctx = this.ctx;
		// Bowl design matching reference image; the bowl is the player avatar
		ctx.save();
		ctx.translate(x, y);

		// Scale and layout configuration for the bowl and surrounding FX
		const bowlRadius = 36;
		const scale = bowlRadius / 25;
		const shadowYOffset = bowlRadius * 0.5; // ~5 -> ~7.2
		const shadowRadiusX = bowlRadius - 6; // ~19 at default
		const shadowRadiusY = bowlRadius * 0.22; // ~8 at default
		const lineWidth = Math.max(2, bowlRadius * 0.08);
		const labelYOffset = 10;
		const fontSize = Math.round(bowlRadius * 0.3);
		const inkBloomSize = bowlRadius * 2;

		// Pick colours based on player state and ID
		let bowlColor = '#2a2a2a';
		let rimColor = 'rgba(139, 115, 85, 0.5)';

		if (player.frozen) {
			bowlColor = 'rgba(74, 144, 226, 0.8)';
			rimColor = '#4a90e2';
		} else if (player.momentumActive) {
			bowlColor = 'rgba(212, 175, 55, 0.9)';
			rimColor = '#d4af37';
		} else if (player.dashing) {
			bowlColor = 'rgba(255, 100, 100, 0.9)';
			rimColor = '#ff6666';
		} else {
			bowlColor = playerId === 1 ? '#2a2a2a' : '#3a2a2a';
		}

		// Drop shadow under the bowl to anchor it to the table
		ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
		ctx.beginPath();
		ctx.ellipse(0, shadowYOffset, shadowRadiusX, shadowRadiusY, 0, 0, Math.PI * 2);
		ctx.fill();

		// Prefer a bowl sprite when provided, otherwise fall back to vector art
		const bowlSprite = this.spriteLibrary && this.spriteLibrary.getBowlSprite();
		if (bowlSprite) {
			const spriteAspect = (bowlSprite.width && bowlSprite.height) ? (bowlSprite.width / bowlSprite.height) : 1;
			const drawW = bowlRadius * 2;
			const drawH = Math.round(drawW / spriteAspect);
			ctx.drawImage(bowlSprite, -drawW / 2, -drawH / 2, drawW, drawH);
		} else {
			// Draw bowl body as a dark, rounded shape
			ctx.fillStyle = bowlColor;
			ctx.strokeStyle = '#1a1a1a';
			ctx.lineWidth = lineWidth;

			ctx.beginPath();
			ctx.arc(0, 0, bowlRadius, 0, Math.PI, false); // Top half circle
			ctx.lineTo(-bowlRadius, 0);
			ctx.lineTo(-23 * scale, 10 * scale);
			ctx.quadraticCurveTo(-18 * scale, 15 * scale, 0, 15 * scale);
			ctx.quadraticCurveTo(18 * scale, 15 * scale, 23 * scale, 10 * scale);
			ctx.lineTo(bowlRadius, 0);
			ctx.closePath();
			ctx.fill();
			ctx.stroke();

			// Accent the rim for better readability
			ctx.strokeStyle = rimColor;
			ctx.lineWidth = lineWidth;
			ctx.beginPath();
			ctx.arc(0, 0, bowlRadius, 0, Math.PI, false);
			ctx.stroke();
		}

		// Visualise the horizontal "perfect" catch window as a subtle band
		// centred over the bowl. This mirrors the logic in Game.isPerfectCatch.
		const perfectFactor = 0.2;
		const perfectHalfWidth = bowlRadius * perfectFactor;
		const center_Y = -bowlRadius * 0.45;

		const perfectHalfHeight = perfectHalfWidth * 0.2;

		ctx.save();
		ctx.strokeStyle = 'rgba(255, 196, 0, 0.65)';
		ctx.lineWidth = 3;

		ctx.beginPath();
		ctx.ellipse(
			0,
			center_Y,
			perfectHalfWidth,
			perfectHalfHeight,
			0,
			0,
			2 * Math.PI
		);
		ctx.stroke();
		ctx.restore();

		// Draw player label inside the bowl
		ctx.fillStyle = '#f5f5dc';
		ctx.font = 'bold ' + fontSize + 'px Georgia';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText(`P${playerId}`, 0, labelYOffset);

		// Add ink bloom effect when the momentum ability is active
		if (player.momentumActive) {
			this.drawInkBloom(0, 0, inkBloomSize);
		}

		ctx.restore();
	}

	/**
	 * Renders a simple expanding ink bloom around a given position.
	 *
	 * @param {number} x - Center X of the bloom.
	 * @param {number} y - Center Y of the bloom.
	 * @param {number} size - Overall size of the largest ring.
	 */
	drawInkBloom(x, y, size) {
		const ctx = this.ctx;
		for (let i = 3; i > 0; i--) {
			const radius = size * (i / 3);
			const alpha = 0.3 * (i / 3);

			ctx.fillStyle = `rgba(212, 175, 55, ${alpha})`;
			ctx.beginPath();
			ctx.arc(x, y, radius, 0, Math.PI * 2);
			ctx.fill();
		}
	}

	/**
	 * Renders soft water-stain style miss effects on the table.
	 *
	 * @param {Array<Object>} effects - List of miss effect descriptors.
	 */
	renderMissEffects(effects) {
		const ctx = this.ctx;
		effects.forEach(effect => {
			ctx.save();
			ctx.globalAlpha = effect.alpha;

			ctx.fillStyle = 'rgba(139, 115, 85, 0.4)';
			ctx.beginPath();
			const points = 8;
			for (let i = 0; i < points; i++) {
				const angle = (i / points) * Math.PI * 2;
				const radius = effect.size * (0.7 + Math.random() * 0.3);
				const x = effect.x + Math.cos(angle) * radius;
				const y = effect.y + Math.sin(angle) * radius;
				if (i === 0) {
					ctx.moveTo(x, y + 60);
				} else {
					ctx.lineTo(x, y + 60);
				}
			}
			ctx.closePath();
			ctx.fill();

			ctx.restore();
		});
	}

	/**
	 * Renders subtle wind streaks across the canvas while wind is active.
	 *
	 * @param {WindSystem} windSystem - Wind system used for direction/status.
	 */
	renderWindEffect(windSystem) {
		if (!windSystem.isActive()) return;
		const ctx = this.ctx;

		const direction = windSystem.getDirection();
		const intensity = 0.15;

		// Lazily create list that stores individual wind streaks
		if (!this.windStreaks) {
			this.windStreaks = [];
		}

		// Move existing streaks horizontally over time
		this.windStreaks.forEach(streak => {
			streak.x += direction * 20; // Slow movement
		});

		// Remove streaks that have scrolled outside the view
		this.windStreaks = this.windStreaks.filter(streak => 
			streak.x < this.canvasWidth + 50 && streak.x > -50
		);

		// Occasionally spawn a new streak near one edge
		if (Math.random() < 0.2) { // Lower spawn rate for longer visibility
			this.windStreaks.push({
				x: direction > 0 ? -30 : this.canvasWidth + 30,
				y: Math.random() * this.canvasHeight,
				length: 30 + Math.random() * 40
			});
		}

		// Draw all visible streaks as short horizontal lines
		const a = 'rgba(141, 141, 141, 1)';
		ctx.strokeStyle = a;
		ctx.lineWidth = 2;

		this.windStreaks.forEach(streak => {
			ctx.beginPath();
			ctx.moveTo(streak.x, streak.y);
			ctx.lineTo(streak.x + streak.length, streak.y);
			ctx.stroke();
		});
	}


	/**
	 * Renders big "PERFECT" ink splashes for each recent perfect catch.
	 *
	 * @param {Array<Object>} effects - Perfect catch effects.
	 */
	renderPerfectCatchEffects(effects) {
		const ctx = this.ctx;

		effects.forEach(e => {
			ctx.save();
			ctx.globalAlpha = e.alpha;
			ctx.translate(e.x, e.y);
			ctx.scale(e.scale, e.scale);

			// ink splash
			ctx.fillStyle = 'rgba(0,0,0,0.35)';
			ctx.beginPath();
			ctx.arc(0, 0, 50, 0, Math.PI * 2);
			ctx.fill();

			ctx.font = 'bold 36px Georgia';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.lineWidth = 4;

			ctx.strokeStyle = '#000';
			ctx.fillStyle = e.golden ? '#d4af37' : '#4a90e2';

			ctx.strokeText('PERFECT', 0, 0);
			ctx.fillText('PERFECT', 0, 0);

			ctx.restore();
		});
	}

	/**
	 * Safe no-op kept for compatibility; perfect meters are rendered directly
	 * from `Game.render` using `renderPerfectMeter`.
	 */
	renderPerfectMeters(perfectMeters) {
		// Intentionally empty.
	}
}
