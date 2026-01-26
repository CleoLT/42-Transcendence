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

	// renderPerfectMeterBackplate(ctx, centerX, y) {
	// 	/**
	// 	 * Draws the static backplate behind both players' perfect meters.
	// 	 */

	// 	// Compute shared bar bounds across the middle of the canvas
	// 	const totalWidth = this.canvasWidth * 0.9;
	// 	const height = 48;

	// 	const x = centerX - totalWidth / 2;
	// 	const yTop = y - height / 2;

	// 	ctx.save();

	// 	// Draw solid bar background
	// 	ctx.fillStyle = 'rgba(8,8,8, 0.5)';
	// 	ctx.beginPath();
	// 	ctx.roundRect(x, yTop, totalWidth, height, 14);
	// 	ctx.fill();

	// 	// Outline the bar for definition
	// 	ctx.strokeStyle = '#00000080';
	// 	ctx.lineWidth = 2;
	// 	ctx.stroke();

	// 	ctx.restore();
	// }

	renderPerfectMeterLabels(ctx, player, centerX, y) {
		const isLeft = player.side === 'left';
	
		ctx.save();
		ctx.fillStyle = '#000000';
		ctx.font = '25px font-corben font-bold text-s';
		ctx.textBaseline = 'middle';
		
	
		const nameX = isLeft
			? centerX - 700
			: centerX + 700;
	
		ctx.textAlign = isLeft ? 'left' : 'right';
		ctx.fillText(player.name, nameX, y - 18);
	
		ctx.font = '20px font-corben font-bold';
		ctx.fillText(
			`${player.score}`,
			nameX,
			y + 18
		);
	
		ctx.restore();
	}

	/**
	 * Renders three ability indicator dots below the player name/score.
	 * Each dot shows whether an ability is available (lit) or on cooldown (dim).
	 *
	 * @param {CanvasRenderingContext2D} ctx - Drawing context.
	 * @param {Player} player - Player whose abilities to display.
	 * @param {number} centerX - Center X coordinate of the perfect meter.
	 * @param {number} y - Y coordinate of the perfect meter bar.
	 */
	renderAbilityIndicators(ctx, player, centerX, y) {
		const isLeft = player.side === 'left';
		const nameX = isLeft
			? centerX - 700
			: centerX + 700;

		// Position dots below the score (which is at y + 18)
		const dotY = y + 18;
		const dotRadius = 9;
		const dotSpacing = 30;
		
		// For left player (right-aligned text), dots start from nameX and go left
		// For right player (left-aligned text), dots start from nameX and go right
		const dotStartX = isLeft 
			? nameX + (dotSpacing * 3) // Right-align: start from nameX, go left
			: nameX - (dotSpacing * 3); // Left-align: start from nameX, go right

		ctx.save();

		// Define abilities in order: reversePush, inkFreeze, momentumSurge
		const abilities = ['reversePush', 'inkFreeze', 'momentumSurge'];

		abilities.forEach((abilityName, index) => {
			const ability = player.abilities[abilityName];
			// For left player, subtract to go left; for right player, add to go right
			const dotX = isLeft 
				? dotStartX - (index * dotSpacing)
				: dotStartX + (index * dotSpacing);

			// Ability is available if cooldown is 0 and player has enough perfect meter
			const isAvailable = ability && 
				ability.cooldown <= 0 && 
				player.perfectMeter.value >= ability.cost;

			// Draw dot - lit if available, dim if on cooldown
			ctx.beginPath();
			ctx.arc(dotX, dotY, dotRadius, 0, Math.PI * 2);
			
			if (isAvailable) {
				// Lit: glowing/filled circle
				ctx.fillStyle = '#00ff11'; // Green when available
				ctx.fill();
				// Add a subtle glow effect
				ctx.shadowBlur = 10;
				ctx.shadowColor = '#00ff11';
				ctx.fill();
				ctx.shadowBlur = 0;
			} else {
				// Dim: outline only
				ctx.fillStyle = '#CCCCCC'; // Gray when unavailable
				ctx.fill();
				ctx.strokeStyle = '#999999';
				ctx.lineWidth = 1;
				ctx.stroke();
			}

			// Draw ability sprite below the dot
			const spriteY = dotY + dotRadius + 12;
			this.drawAbilitySprite(ctx, abilityName, dotX, spriteY, isAvailable);
		});

		ctx.restore();
	}

	/**
	 * Draws a simple icon/sprite representing an ability.
	 * 
	 * @param {CanvasRenderingContext2D} ctx - Drawing context.
	 * @param {string} abilityName - Name of the ability.
	 * @param {number} x - Center X coordinate.
	 * @param {number} y - Center Y coordinate.
	 * @param {boolean} isAvailable - Whether the ability is available.
	 */
	drawAbilitySprite(ctx, abilityName, x, y, isAvailable) {
		const spriteSize = 16;
		const alpha = isAvailable ? 1.0 : 0.4;

		ctx.save();
		ctx.globalAlpha = alpha;
		ctx.translate(x, y);

		if (abilityName === 'reversePush') {
			// Draw a double-arrow (push back symbol)
			ctx.strokeStyle = isAvailable ? '#FF6B6B' : '#999999';
			ctx.lineWidth = 2;
			ctx.beginPath();
			// Left arrow
			ctx.moveTo(-spriteSize / 2, 0);
			ctx.lineTo(-spriteSize / 4, -spriteSize / 4);
			ctx.moveTo(-spriteSize / 2, 0);
			ctx.lineTo(-spriteSize / 4, spriteSize / 4);
			// Right arrow (reversed)
			ctx.moveTo(spriteSize / 2, 0);
			ctx.lineTo(spriteSize / 4, -spriteSize / 4);
			ctx.moveTo(spriteSize / 2, 0);
			ctx.lineTo(spriteSize / 4, spriteSize / 4);
			ctx.stroke();
		} else if (abilityName === 'inkFreeze') {
			// Draw a snowflake/freeze symbol
			ctx.strokeStyle = isAvailable ? '#4A90E2' : '#999999';
			ctx.lineWidth = 2;
			ctx.beginPath();
			// Horizontal line
			ctx.moveTo(-spriteSize / 2, 0);
			ctx.lineTo(spriteSize / 2, 0);
			// Vertical line
			ctx.moveTo(0, -spriteSize / 2);
			ctx.lineTo(0, spriteSize / 2);
			// Diagonal lines
			ctx.moveTo(-spriteSize / 3, -spriteSize / 3);
			ctx.lineTo(spriteSize / 3, spriteSize / 3);
			ctx.moveTo(spriteSize / 3, -spriteSize / 3);
			ctx.lineTo(-spriteSize / 3, spriteSize / 3);
			ctx.stroke();
		} else if (abilityName === 'momentumSurge') {
			const s = spriteSize / 2; // half size for convenience
			ctx.strokeStyle = isAvailable ? '#00ff11' : '#999999';
			ctx.lineWidth = 2; // visible but not too thick
			ctx.beginPath();
		
			// Simple jagged lightning bolt with lines
			ctx.moveTo(0, -s);       // top center
			ctx.lineTo(-s / 2, -s / 4); // middle left
			ctx.lineTo(s / 4, 0);    // middle right
			ctx.lineTo(-s / 4, s / 2); // bottom left
			ctx.lineTo(s / 2, s / 4); // bottom right
		
			ctx.stroke();
		}

		ctx.restore();
	}
	

	drawCapsule(ctx, x, y, w, h, r, color) {
		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.roundRect(x, y, w, h, r);
		ctx.fill();
	}

	renderPerfectMeter(ctx, player, centerX, y) {
		const CAPSULE_COUNT = 6;
		const CAPSULE_WIDTH = 40;
		const CAPSULE_HEIGHT = 75;
		const CAPSULE_GAP = 10;
		const CAPSULE_RADIUS = 100;

		const FIRST_COLOR = '#FEEBEB';
		const SECOND_COLOR = '#F9BEBE';
		const THIRD_COLOR = '#FDD28B';
		const INACTIVE_COLOR = '#D9D9D9';
		const CAPSULE_COLORS = [FIRST_COLOR, FIRST_COLOR, SECOND_COLOR, SECOND_COLOR, THIRD_COLOR, THIRD_COLOR];

		const meter = player.perfectMeter;
		if (!meter) return;
	
		const isLeft = player.side === 'left';
		const filled = meter.value;
	
		const totalWidth =
			CAPSULE_COUNT * CAPSULE_WIDTH +
			(CAPSULE_COUNT - 1) * CAPSULE_GAP;
	
			// Capsules grow outward from center
			const startX = isLeft
			? (centerX - 50) - totalWidth
			: (centerX + 50);
			
			const yTop = y - CAPSULE_HEIGHT / 2;
	
		for (let i = 0; i < CAPSULE_COUNT; i++) {
			const index = isLeft
				? CAPSULE_COUNT - 1 - i // fill from center outward
				: i;
	
			const active = index < filled;
	
			const x =
				startX +
				i * (CAPSULE_WIDTH + CAPSULE_GAP);
	
			this.drawCapsule(
				ctx,
				x,
				yTop,
				CAPSULE_WIDTH,
				CAPSULE_HEIGHT,
				CAPSULE_RADIUS,
				active ? CAPSULE_COLORS[index] : INACTIVE_COLOR
			);
		}
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

			// Lazily generate a stable organic shape for this stain the first
			// time it is rendered so that it does not flicker or change shape
			// every frame.
			if (!effect._shape) {
				const pointCount = 8;
				const points = [];
				for (let i = 0; i < pointCount; i++) {
					const angle = (i / pointCount) * Math.PI * 2;
					// Precompute a radius jitter for this vertex; this stays
					// fixed for the lifetime of the effect.
					const radius = effect.size * (0.7 + Math.random() * 0.3);
					points.push({ angle, radius });
				}
				effect._shape = points;
			}

			ctx.fillStyle = 'rgba(139, 115, 85, 0.4)';
			ctx.beginPath();
			const points = effect._shape;
			points.forEach((p, index) => {
				const x = effect.x + Math.cos(p.angle) * p.radius;
				const y = effect.y + Math.sin(p.angle) * p.radius;
				if (index === 0) {
					ctx.moveTo(x, y + 60);
				} else {
					ctx.lineTo(x, y + 60);
				}
			});
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

			ctx.font = '36px sixtyfour';
			ctx.letterSpacing = '-0.13em';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.lineWidth = 1;

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
