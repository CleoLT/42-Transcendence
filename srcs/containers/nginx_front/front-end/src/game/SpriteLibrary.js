export class SpriteLibrary {
	/**
	 * Provides lazily-loaded sprite references for various game elements.
	 * Sprites are loaded from theme-based paths (e.g. classic vs sakura/dark/neon).
	 */
	constructor() {
		// Sprite references (may be assigned before or after calling loadSprites)
		this.BambooSprite = null;
		this.BlossomSprite = null;
		this.GoldenBlossomSprite = null;
		this.BowlSprite = null;
		this.FillSprite = null;

		this.loaded = false;
		this.theme = 'classic';
		this._loadedTheme = null;
	}

	/**
	 * Returns the base path for sprite assets for the current theme.
	 * Classic uses root sprites folder; other themes use a subfolder.
	 */
	getSpriteBasePath() {
		if (this.theme === 'classic' || !this.theme) {
			return '/images_png/sprites/';
		}
		return `/images_png/sprites/${this.theme}/`;
	}

	/**
	 * Loads sprite images from theme-based paths. Re-runs when theme changes.
	 * Safe to call multiple times; skips only when already loaded for current theme.
	 */
	async loadSprites() {
		console.log(this.theme);
		if (this.loaded && this._loadedTheme === this.theme) {
			return this;
		}

		// Theme changed or first load: clear existing refs so we load fresh
		this.loaded = false;
		this.BambooSprite = null;
		this.BlossomSprite = null;
		this.GoldenBlossomSprite = null;
		this.FillSprite = null;
		this.BowlSprite = null;

		const base = this.getSpriteBasePath();
		const spritePaths = {
			BambooSprite: `${base}bamboo.png`,
			BlossomSprite: `${base}blossom.png`,
			GoldenBlossomSprite: `${base}golden.png`,
			FillSprite: `${base}bar.png`,
			BowlSprite: `${base}bowl.png`,
		};

		const classicBase = '/images_png/sprites/';
		const fallbackPaths = {
			BambooSprite: `${classicBase}bamboo.png`,
			BlossomSprite: `${classicBase}blossom.png`,
			GoldenBlossomSprite: `${classicBase}golden.png`,
			FillSprite: `${classicBase}bar.png`,
			BowlSprite: `${classicBase}bowl.png`,
		};

		for (const [key, path] of Object.entries(spritePaths)) {
			try {
				const img = await this.loadImage(path);
				if (img) {
					this[key] = img;
				}
			} catch (e) {
				const fallback = fallbackPaths[key];
				try {
					const img = await this.loadImage(fallback);
					if (img) {
						this[key] = img;
					}
				} catch (e2) {
					console.warn(`Sprite not found: ${path} (fallback ${fallback} also failed)`);
				}
			}
		}

		this._loadedTheme = this.theme;
		this.loaded = true;
		return this;
	}

	/**
	 * Sets the current theme and reloads sprites for that theme.
	 * Call this before or when starting a game so the correct assets are loaded.
	 *
	 * @param {string} theme - One of: 'classic', 'sakura', 'dark', 'neon'
	 * @returns {Promise<void>}
	 */
	async setTheme(theme) {
		if (!theme || typeof theme !== 'string') {
			return;
		}
		this.theme = theme;
		this.loaded = false;
		this._loadedTheme = null;
		this.BambooSprite = null;
		this.BlossomSprite = null;
		this.GoldenBlossomSprite = null;
		this.FillSprite = null;
		this.BowlSprite = null;
		await this.loadSprites();
	}

	/**
	 * Loads an image at the given path and resolves to an HTMLImageElement.
	 *
	 * @param {string} path - Sprite image path.
	 * @returns {Promise<HTMLImageElement>} Promise that resolves when loaded.
	 */
	loadImage(path) {
		return new Promise((resolve, reject) => {
			const img = new Image();
			img.onload = () => resolve(img);
			img.onerror = () => reject(new Error(`Failed to load: ${path}`));
			img.src = path;
		});
	}

	/**
	 * Returns the width of a sprite image.
	 */
	getWidth(sprite) {
		return sprite.width;
	}
	/**
	 * Returns the height of a sprite image.
	 */
	getHeight(sprite) {
		return sprite.height;
	}
	/**
	 * Retrieves the bamboo sprite (optionally using an index for variants).
	 */
	getBambooSprite(index = 0) {
		return this.BambooSprite;
	}

	/**
	 * Retrieves the default blossom sprite.
	 */
	getBlossomSprite() {
		return this.BlossomSprite;
	}

	/**
	 * Retrieves the golden blossom sprite variant.
	 */
	getGoldenBlossomSprite() {
		return this.GoldenBlossomSprite;
	}

	/**
	 * Retrieves the player bowl sprite.
	 */
	getBowlSprite() {
		return this.BowlSprite;
	}

	/**
	 * Retrieves the fill sprite used for the perfect meter bar.
	 */
	getInkFillSprite() {
		return this.FillSprite;
	}
}

