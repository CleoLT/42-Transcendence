// Renderer.js
import {
	PLAYER_RADIUS,
	BLOSSOM_SPRITE_SIZE_NORMAL,
	BLOSSOM_SPRITE_SIZE_GOLDEN,
	BLOSSOM_PETAL_COUNT,
	BLOSSOM_PETAL_SIZE_NORMAL,
	BLOSSOM_CENTER_SIZE_NORMAL,
	BLOSSOM_CENTER_SIZE_GOLDEN,
	BLOSSOM_PINK_FILL,
	BLOSSOM_PINK_STROKE,
	BLOSSOM_PINK_CENTER,
	BLOSSOM_GOLDEN_FILL,
	BLOSSOM_GOLDEN_STROKE,
	BLOSSOM_GOLDEN_CENTER,
	BLOSSOM_GOLDEN_GLOW_BLUR,
	BLOSSOM_GOLDEN_GLOW_COLOR,
	BLOSSOM_STROKE_WIDTH_NORMAL,
	BLOSSOM_STROKE_WIDTH_GOLDEN,
	PAPER_TEXTURE_POINTS,
	PAPER_TEXTURE_SIZE_MIN,
	PAPER_TEXTURE_SIZE_MAX,
	PAPER_TEXTURE_COLOR,
	PAPER_BACKGROUND_COLOR,
	BAMBOO_SEPARATOR_STROKE_WIDTH,
	BAMBOO_SEPARATOR_COLOR,
	BAMBOO_SEPARATOR_INK_BLEED,
	BAMBOO_SEPARATOR_SPLOTCH_CHANCE,
	BAMBOO_SEPARATOR_SPLOTCH_SIZE_MIN,
	BAMBOO_SEPARATOR_SPLOTCH_SIZE_MAX,
	BAMBOO_SEPARATOR_SPLOTCH_COLOR,
	BAMBOO_SEPARATOR_WASH_COLOR,
	BAMBOO_SEPARATOR_WASH_WIDTH,
	BAMBOO_SEPARATOR_STEP,
	BAMBOO_SEPARATOR_VARIATION_FACTOR,
	BAMBOO_SEPARATOR_WASH_STEP,
	TABLE_WIDTH_FACTOR,
	TABLE_HEIGHT_FACTOR,
	TABLE_INSET_FACTOR,
	TABLE_BOTTOM_OFFSET,
	TABLE_MIN_INSET,
	TABLE_LEG_COLOR,
	TABLE_OUTLINE_COLOR,
	TABLE_GRAIN_COLOR,
	TABLE_INK_WASHES,
	BOWL_COLOR_DEFAULT_1,
	BOWL_COLOR_DEFAULT_2,
	BOWL_COLOR_DASHING,
	BOWL_RIM_COLOR_DEFAULT,
	BOWL_RIM_COLOR_DASHING,
	BOWL_SHADOW_COLOR,
	BOWL_STROKE_COLOR,
	BOWL_LABEL_FONT,
	PERFECT_CATCH_FACTOR
} from './Constants.js';

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
	constructor(ctx, canvasWidth, canvasHeight, spriteLibrary = null, laneTint = null, theme = "classic") {
		// Core drawing context and geometry
		this.ctx = ctx;
		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;

		// Misc render timers and helpers
		this.paperTextureGenerated = false;
		this.spriteLibrary = spriteLibrary;
		this.laneTint = laneTint;
		this.theme = theme;
		console.log("theme render constructor", this.theme);
		// Build in-memory fallback blossom sprites for when none are loaded
		this.createBlossomSprites();
	}

	setTheme(theme) {
		this.theme = theme;
	
		// Si laneTint depende del theme
		if (this.laneTint?.updateForTheme) {
			this.laneTint.updateForTheme(theme);
		}
	
		// Si tus sprites dependen del theme
		if (this.spriteLibrary?.updateForTheme) {
			this.spriteLibrary.updateForTheme(theme);
		}
	
		// Redibuja el canvas si es necesario
		if (typeof this.render === "function") {
			this.render();
		}
	
		console.log("Renderer theme updated to:", this.theme);
	}
	/**
	 * Creates simple canvas-based sprites for normal and golden blossoms for
	 * use when texture images are not available.
	 */
	createBlossomSprites() {
		// Create pink sakura blossom sprite
		const pinkCanvas = document.createElement('canvas');
		pinkCanvas.width = BLOSSOM_SPRITE_SIZE_NORMAL;
		pinkCanvas.height = BLOSSOM_SPRITE_SIZE_NORMAL;
		const pinkCtx = pinkCanvas.getContext('2d');

		// Draw 5-petal sakura blossom
		pinkCtx.fillStyle = BLOSSOM_PINK_FILL;
		pinkCtx.strokeStyle = BLOSSOM_PINK_STROKE;
		pinkCtx.lineWidth = BLOSSOM_STROKE_WIDTH_NORMAL;

		const petals = BLOSSOM_PETAL_COUNT;
		const angleStep = (Math.PI * 2) / petals;
		const size = BLOSSOM_PETAL_SIZE_NORMAL;

		pinkCtx.beginPath();
		const center = BLOSSOM_SPRITE_SIZE_NORMAL / 2;
		for (let i = 0; i < petals; i++) {
			const angle = i * angleStep;
			const x = center + Math.cos(angle) * size;
			const y = center + Math.sin(angle) * size;

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
		pinkCtx.fillStyle = BLOSSOM_PINK_CENTER;
		pinkCtx.beginPath();
		pinkCtx.arc(center, center, BLOSSOM_CENTER_SIZE_NORMAL, 0, Math.PI * 2);
		pinkCtx.fill();

		this.pinkBlossomSprite = pinkCanvas;

		// Create golden blossom sprite
		const goldenCanvas = document.createElement('canvas');
		goldenCanvas.width = BLOSSOM_SPRITE_SIZE_GOLDEN;
		goldenCanvas.height = BLOSSOM_SPRITE_SIZE_GOLDEN;
		const goldenCtx = goldenCanvas.getContext('2d');

		goldenCtx.fillStyle = BLOSSOM_GOLDEN_FILL;
		goldenCtx.strokeStyle = BLOSSOM_GOLDEN_STROKE;
		goldenCtx.lineWidth = BLOSSOM_STROKE_WIDTH_GOLDEN;

		const goldenCenter = BLOSSOM_SPRITE_SIZE_GOLDEN / 2;
		goldenCtx.beginPath();
		for (let i = 0; i < petals; i++) {
			const angle = i * angleStep;
			const x = goldenCenter + Math.cos(angle);
			const y = goldenCenter + Math.sin(angle);

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
		goldenCtx.shadowBlur = BLOSSOM_GOLDEN_GLOW_BLUR;
		goldenCtx.shadowColor = BLOSSOM_GOLDEN_GLOW_COLOR;
		goldenCtx.fillStyle = BLOSSOM_GOLDEN_CENTER;
		goldenCtx.beginPath();
		goldenCtx.arc(goldenCenter, goldenCenter, BLOSSOM_CENTER_SIZE_GOLDEN, 0, Math.PI * 2);
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
		ctx.fillStyle = PAPER_BACKGROUND_COLOR;
		ctx.fillRect(0, 0, width, height);

		// Step 2: Sprinkle a few random specks to suggest paper grain
		if (!this.paperTextureGenerated) {
			ctx.fillStyle = PAPER_TEXTURE_COLOR;
			for (let i = 0; i < PAPER_TEXTURE_POINTS; i++) {
				const x = Math.random() * width;
				const y = Math.random() * height;
				const size = PAPER_TEXTURE_SIZE_MIN + Math.random() * (PAPER_TEXTURE_SIZE_MAX - PAPER_TEXTURE_SIZE_MIN);
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
			//CHANGE
			// Fallback: vertical, slightly irregular stroke with ink specks
			ctx.strokeStyle = BAMBOO_SEPARATOR_COLOR;
			ctx.lineWidth = BAMBOO_SEPARATOR_STROKE_WIDTH;
			ctx.lineCap = 'round';
			ctx.lineJoin = 'round';

			// Natural, irregular brushstroke
			ctx.beginPath();
			let currentX = x;
			ctx.moveTo(currentX, 0);

			for (let y = 0; y < this.canvasHeight; y += BAMBOO_SEPARATOR_STEP) {
				// Add natural variation and small ink bleed to the path
				const variation = (Math.sin(y * BAMBOO_SEPARATOR_VARIATION_FACTOR) + Math.cos(y * 0.05)) * 2;
				const inkBleed = Math.random() * BAMBOO_SEPARATOR_INK_BLEED;
				currentX = x + variation + inkBleed;

				ctx.lineTo(currentX, y);

				// Add ink splotches occasionally
				if (Math.random() < BAMBOO_SEPARATOR_SPLOTCH_CHANCE) {
					ctx.fillStyle = BAMBOO_SEPARATOR_SPLOTCH_COLOR;
					ctx.beginPath();
					ctx.arc(currentX, y, BAMBOO_SEPARATOR_SPLOTCH_SIZE_MIN + Math.random() * (BAMBOO_SEPARATOR_SPLOTCH_SIZE_MAX - BAMBOO_SEPARATOR_SPLOTCH_SIZE_MIN), 0, Math.PI * 2);
					ctx.fill();
				}
			}

			ctx.stroke();

			// Add a faint ink wash around the separator
			ctx.fillStyle = BAMBOO_SEPARATOR_WASH_COLOR;
			ctx.beginPath();
			ctx.moveTo(x - BAMBOO_SEPARATOR_WASH_WIDTH, 0);
			ctx.lineTo(x + BAMBOO_SEPARATOR_WASH_WIDTH, 0);
			for (let y = 0; y < this.canvasHeight; y += BAMBOO_SEPARATOR_WASH_STEP) {
				ctx.lineTo(x + 2 + Math.sin(y * 0.02) * 1, y);
			}
			ctx.lineTo(x + BAMBOO_SEPARATOR_WASH_WIDTH, this.canvasHeight);
			ctx.lineTo(x - BAMBOO_SEPARATOR_WASH_WIDTH, this.canvasHeight);
			ctx.closePath();
			ctx.fill();
		}

		ctx.restore();
	}

	renderPerfectMeterBackplate(ctx, centerX, y) {
		const totalWidth = 200;
		const height = 100;

		const x = centerX - totalWidth / 2;
		const yTop = y - height / 2;

		ctx.save();

		// Draw solid bar background	
		ctx.fillStyle = '#dc262679';
		ctx.beginPath();
		ctx.roundRect(x, yTop, totalWidth, height, 100);
		ctx.fill();

		// Outline the bar for definition
		ctx.strokeStyle = '#9d0000';
		ctx.lineWidth = 2;
		ctx.stroke();

		ctx.restore();
	}

	renderPerfectMeterLabels(ctx, player, centerX, y) {
		const isLeft = player.side === 'left';
		const nameX = isLeft
		? centerX - 700
		: centerX + 700;
		this.renderPerfectMeterBackplate(ctx, isLeft ? nameX + 60 : nameX - 60, y + 5);
		
		ctx.save();
		ctx.fillStyle = '#000000';
		ctx.font = '25px font-corben font-bold text-s';
		ctx.textBaseline = 'middle';
		
		
		
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
		const abilityIndicatorSpacing = 30;
		const abilityIndicatorOffset = 4;
		// For left player (right-aligned text), dots start from nameX and go left
		// For right player (left-aligned text), dots start from nameX and go right
		const dotStartX = isLeft 
			? nameX + (abilityIndicatorSpacing * abilityIndicatorOffset) // Right-align: start from nameX, go left
			: nameX - (abilityIndicatorSpacing * abilityIndicatorOffset); // Left-align: start from nameX, go right

		ctx.save();

		// Define abilities in order: reversePush, inkFreeze, momentumSurge
		const abilities = ['reversePush', 'inkFreeze', 'momentumSurge'];

		abilities.forEach((abilityName, index) => {
			const ability = player.abilities[abilityName];
			// For left player, subtract to go left; for right player, add to go right
			const dotX = isLeft 
				? dotStartX - (index * abilityIndicatorSpacing)
				: dotStartX + (index * abilityIndicatorSpacing);

			const hasAbility = !!ability;
			const onCooldown = hasAbility && ability.cooldown > 0;
			const hasMeter = hasAbility && player.perfectMeter.value >= ability.cost;
			// Ability is available only if not on cooldown and player has enough perfect meter
			const isAvailable = hasAbility && !onCooldown && hasMeter && !player.frozen;
			const indicatorRadius = 9;
			const indicatorStrokeColor = '#999999';
			// Draw dot - lit if available, red with timer if on cooldown,
			// solid red when the player is frozen, dim otherwise.
			ctx.beginPath();
			ctx.arc(dotX, dotY, indicatorRadius, 0, Math.PI * 2);
			
			if (player.frozen) {
				// While frozen, all abilities are visually blocked in solid red
				ctx.fillStyle = '#ff3333';
				ctx.fill();
				ctx.strokeStyle = indicatorStrokeColor;
				ctx.lineWidth = 1;
				ctx.stroke();
			} else if (isAvailable) {
				const indicatorColor = '#00ff11';
				// Lit: glowing/filled circle
				ctx.fillStyle = indicatorColor;
				ctx.fill();
				// Add a subtle glow effect
				ctx.shadowBlur = 10;
				ctx.shadowColor = indicatorColor;
				ctx.fill();
				ctx.shadowBlur = 0;
			} else if (onCooldown) {
				// Cooldown: red indicator with remaining seconds
				ctx.fillStyle = '#ff3333';
				ctx.fill();
				ctx.strokeStyle = indicatorStrokeColor;
				ctx.lineWidth = 1;
				ctx.stroke();

				// Draw remaining cooldown seconds on top of the dot
				const remaining = Math.ceil(ability.cooldown);
				ctx.save();
				ctx.fillStyle = '#ffffff';
				ctx.font = '12px sans-serif';
				ctx.textAlign = 'center';
				ctx.textBaseline = 'middle';
				ctx.fillText(`${remaining}`, dotX, dotY + 2);
				ctx.restore();
			} else {
				const indicatorColor = '#CCCCCC';
				// Dim: outline only
				ctx.fillStyle = indicatorColor;
				ctx.fill();
				ctx.strokeStyle = indicatorStrokeColor;
				ctx.lineWidth = 1;
				ctx.stroke();
			}

			// Draw ability sprite below the dot
			const spriteYOffset = 12;
			const spriteY = dotY + indicatorRadius + spriteYOffset;
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
			ctx.strokeStyle = isAvailable ? '#fbff00' : '#999999';
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
			ctx.lineTo(-s / 3, s / 1.5); // bottom left
			// ctx.lineTo(s / 2, s / 4); // bottom right
		
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
		const perfectMeterCapsuleCount = 6;
		const perfectMeterCapsuleWidth = 40;
		const perfectMeterCapsuleHeight = 75;
		const perfectMeterCapsuleGap = 10;
		const perfectMeterCapsuleRadius = 100;
		const perfectMeterCapsuleColors = [
			'#FEEBEB', // First two
			'#FEEBEB',
			'#F9BEBE', // Middle two
			'#F9BEBE',
			'#FDD28B', // Last two
			'#FDD28B'
		];
		const perfectMeterInactiveColor = '#D9D9D9';


		const meter = player.perfectMeter;
		if (!meter) return;
	
		const isLeft = player.side === 'left';
		const filled = meter.value;
	
		const totalWidth =
			perfectMeterCapsuleCount * perfectMeterCapsuleWidth +
			(perfectMeterCapsuleCount - 1) * perfectMeterCapsuleGap;
	
			// Capsules grow outward from center
			const startX = isLeft
			? (centerX - 50) - totalWidth
			: (centerX + 50);
			
			const yTop = y - perfectMeterCapsuleHeight / 2;
	
		for (let i = 0; i < perfectMeterCapsuleCount; i++) {
			const index = isLeft
				? perfectMeterCapsuleCount - 1 - i // fill from center outward
				: i;
	
			const active = index < filled;
	
			const x =
				startX +
				i * (perfectMeterCapsuleWidth + perfectMeterCapsuleGap);
	
			this.drawCapsule(
				ctx,
				x,
				yTop,
				perfectMeterCapsuleWidth,
				perfectMeterCapsuleHeight,
				perfectMeterCapsuleRadius,
				active ? perfectMeterCapsuleColors[index] : perfectMeterInactiveColor
			);
		}
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
				// Center bowl vertically in the middle of the table
				drawY = this.tableTop + 10;
			} else {
				drawY = player.getY();
			}

			// Clamp bowl visuals within the horizontal bounds of the table
			let drawX = px;
			if (typeof this.tableX === 'number' && typeof this.tableWidth === 'number' && typeof this.tableInset === 'number') {
				const minX = this.tableX + this.tableInset + (PLAYER_RADIUS - 40);
				const maxX = this.tableX + this.tableWidth - this.tableInset - (PLAYER_RADIUS - 40);
				drawX = Math.max(minX, Math.min(maxX, px));
			}

			// The bowl is the avatar representation; draw it in place
			this.drawBowl(drawX, drawY, player.id, player, this.theme);
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

		// Compute table rectangle and top edge so bowls can rest on it
		const tableHeight = Math.round(PLAYER_RADIUS * TABLE_HEIGHT_FACTOR);
		const tableWidth = Math.round(this.canvasWidth * TABLE_WIDTH_FACTOR);
		const tableX = (this.canvasWidth - tableWidth) / 2 ;
		const tableTop = this.canvasHeight - tableHeight - TABLE_BOTTOM_OFFSET;
		// Compute inset early so callers can clamp horizontally
		const _inset = Math.max(TABLE_MIN_INSET, Math.round(tableWidth * TABLE_INSET_FACTOR));
		// Expose metrics so `renderPlayers` can align and clamp bowls
		this.tableTop = tableTop;
		this.tableHeight = tableHeight;
		this.tableX = tableX;
		this.tableWidth = tableWidth;
		this.tableInset = _inset;

		// Fallback: draw a stylised wooden/ink table with legs
		ctx.save();

		

		// Tabletop trapezoid with subtle perspective and ink washes
		const inset = Math.max(TABLE_MIN_INSET, Math.round(tableWidth * TABLE_INSET_FACTOR));
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

		//CHANGE
		// Layer multiple ink washes for a richer, sumi-e-style top
		for (let i = 0; i < TABLE_INK_WASHES.length; i++) {
			ctx.save();
			ctx.translate(0, (i - 1) * 1); // slight vertical offset per layer
			ctx.fillStyle = `rgba(139, 115, 85, ${TABLE_INK_WASHES[i]})`;
			ctx.fill();
			ctx.restore();
		}

		const outlineWidthFactor = 0.18;
		const outlineMinWidth = 4;
		// Bold brush-like outline around the tabletop
		ctx.lineWidth = Math.max(outlineMinWidth, Math.round(PLAYER_RADIUS * outlineWidthFactor));
		ctx.strokeStyle = TABLE_OUTLINE_COLOR;
		ctx.stroke();


		// Add gentle horizontal grain lines across tabletop
		ctx.strokeStyle = TABLE_GRAIN_COLOR;
		ctx.lineWidth = 1;
		const grainPadding = 4;
		const grainLines = 4;
		for (let g = 0; g < grainLines; g++) {
			const gy = topY + grainPadding + (g / (grainLines - 1)) * (tableHeight - grainPadding * 2);
			ctx.beginPath();
			ctx.moveTo(topLeftX + grainPadding, gy);
			ctx.lineTo(topRightX - grainPadding, gy);
			ctx.stroke();
		}

		const widthFactor = 0.32;
		const minWidth = 10;
		const heightFactor = 1.25;
		const posLeft = 0.08;
		const posCenter = 0.5;
		const posRight = 0.92;

		// Draw three sturdy legs as ink silhouettes
		const legWidth = Math.max(minWidth, Math.round(PLAYER_RADIUS * widthFactor));
		const legHeight = Math.round(tableHeight * heightFactor);
		const leftLegX = topLeftX + Math.round(tableWidth * posLeft);
		const centerLegX = tableX + Math.round(tableWidth * posCenter);
		const rightLegX = topRightX - Math.round(tableWidth * (1 - posRight));
		ctx.fillStyle = TABLE_LEG_COLOR;

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
			const minRadius = 6;
			const radiusFactor = 0.4;
			roundedRectPath(ctx, lx0, ly0, legWidth, legHeight, Math.max(minRadius, Math.round(legWidth * radiusFactor)));
			ctx.fill();
			// Small shadow to visually connect leg to the underside of the table
			
			ctx.fillStyle = TABLE_LEG_COLOR;
		});

		ctx.restore();
	}

	drawBowl(x, y, playerId, player, theme) {
		const ctx = this.ctx;
		// Bowl design matching reference image; the bowl is the player avatar
		ctx.save();
		ctx.translate(x, y);

		// Scale and layout configuration for the bowl and surrounding FX
		const bowlRadius = PLAYER_RADIUS;
		const scale = bowlRadius / 25;
		const shadowYOffset = bowlRadius * 0.5;
		const shadowRadiusX = bowlRadius - 6;
		const shadowRadiusY = bowlRadius * 0.22;
		const lineWidth = Math.max(2, bowlRadius * 0.08);
		const labelYOffset = 45;
		const fontSize = Math.round(bowlRadius * 0.3);

		// Pick colours based on player state and ID
		let bowlColor = BOWL_COLOR_DEFAULT_1;
		let rimColor = BOWL_RIM_COLOR_DEFAULT;

		if (player.dashing) {
			bowlColor = BOWL_COLOR_DASHING;
			rimColor = BOWL_RIM_COLOR_DASHING;
		} else {
			bowlColor = playerId === 1 ? BOWL_COLOR_DEFAULT_1 : BOWL_COLOR_DEFAULT_2;
		}

		// Drop shadow under the bowl to anchor it to the table
		ctx.fillStyle = BOWL_SHADOW_COLOR;
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
			ctx.strokeStyle = BOWL_STROKE_COLOR;
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
		const perfectHalfWidth = bowlRadius * PERFECT_CATCH_FACTOR;
		const windowCenterYFactor = theme === "classic" ? 0.45 : 0.45 + 20;
		const center_Y = -bowlRadius * windowCenterYFactor;
		// if(theme === "classic"){
		// 	center_Y = -bowlRadius * BOWL_PERFECT_WINDOW_Y_FACTOR;
		// } else if(theme === "fishbowl"){
		// 	center_Y = -bowlRadius * BOWL_PERFECT_WINDOW_Y_FACTOR + 20;
		// } else if(theme === "sushiland"){
		// 	center_Y = -bowlRadius * BOWL_PERFECT_WINDOW_Y_FACTOR + 20;
		// }
		const perfectHalfHeight = perfectHalfWidth * 0.2;
		const perfectWindowColor = 'rgba(255, 196, 0, 0.65)';
		const perfectWindowLineWidth = 3;
		ctx.save();
		ctx.strokeStyle = perfectWindowColor;
		ctx.lineWidth = perfectWindowLineWidth;

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
		ctx.fillStyle = '#000';
		ctx.font = BOWL_LABEL_FONT + ' ' + fontSize + 'px Georgia';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText(`P${playerId}`, 0, labelYOffset);

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
		const inkBloomRings = 3;
		const inkBloomAlphaBase = 0.3;
		const ctx = this.ctx;
		for (let i = inkBloomRings; i > 0; i--) {
			const radius = size * (i / inkBloomRings);
			const alpha = inkBloomAlphaBase * (i / inkBloomRings);
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
		const ctx = this.ctx;
		const windActive = windSystem.isActive();
		const direction = windSystem.getDirection();

		// Lazily create list that stores individual wind streaks
		if (!this.windStreaks) {
			this.windStreaks = [];
		}

		const windStreakSpeed = 20;
		// Update existing streaks
		this.windStreaks.forEach(streak => {
			// Move streaks regardless of wind state
			streak.x += direction * windStreakSpeed;
			// Initialize fade timer if not set
			if (streak.fadeTimer === undefined) {
				streak.fadeTimer = 1.0; // Full opacity
			}
		});

		const boundsOffset = 50;
		// Remove streaks that have scrolled outside the view or fully faded
		this.windStreaks = this.windStreaks.filter(streak => {
			const inBounds = streak.x < this.canvasWidth + boundsOffset && streak.x > -boundsOffset;
			const visible = streak.fadeTimer === undefined || streak.fadeTimer > 0;
			return inBounds && visible;
		});

		const spawnChance = 0.2;
		const lengthMin = 30;
		const lengthMax = 70;
		// Spawn new streaks only when wind is active
		if (windActive && Math.random() < spawnChance) {
			this.windStreaks.push({
				x: direction > 0 ? -30 : this.canvasWidth + 30,
				y: Math.random() * this.canvasHeight,
				length: lengthMin + Math.random() * (lengthMax - lengthMin),
				fadeTimer: 1.0 // Start at full opacity
			});
		}

		const streakLineWidth = 2;
		// Draw all visible streaks as short horizontal lines with fade
		ctx.lineWidth = streakLineWidth;

		this.windStreaks.forEach(streak => {
			const alpha = streak.fadeTimer !== undefined ? streak.fadeTimer : 1.0;
			ctx.strokeStyle = `rgba(141, 141, 141, ${alpha})`;
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

}
