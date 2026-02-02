export class SpriteLibrary {
	/**
	 * Provides lazily-loaded sprite references for various game elements.
	 * This class does not scan folders; sprites are loaded from explicit paths.
	 */
	constructor() {
		// Sprite references (may be assigned before or after calling loadSprites)
		this.BambooSprite = null;
		this.BlossomSprite = null;
		this.GoldenBlossomSprite = null;
		this.BowlSprite = null;
		this.TableSprite = null;

		this.loaded = false;
	}

	/**
	 * Loads sprite images from predefined paths if they are not already set.
	 * Safe to call multiple times; subsequent calls no-op once loaded.
	 */
	async loadSprites() {
		if (this.loaded) return;

		// Preferred paths for each sprite; can be overridden by pre-set fields
		const spritePaths = {
			BambooSprite: '/src/sprites/bamboo.png',
			BlossomSprite: '/src/sprites/blossom.png',
			GoldenBlossomSprite: '/src/sprites/golden.png',
			FillSprite: '/src/sprites/bar.png',
			BowlSprite: '/src/sprites/bowl.png'
			,TableSprite: '/src/sprites/table.png'
		};

		// Attempt to load any missing sprites from disk
		for (const [key, path] of Object.entries(spritePaths)) {
			if (!this[key]) {
				try {
					const img = await this.loadImage(path);
					if (img) {
						this[key] = img;
					}
				} catch (e) {
					// Missing sprites remain null and will be handled by fallbacks
					console.warn(`Sprite not found: ${path}`);
				}
			}
		}

		this.loaded = true;
		return this;
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
	 * Retrieves the table sprite used under the bowls.
	 */
	getTableSprite() {
		return this.TableSprite;
	}

	/**
	 * Retrieves the fill sprite used for the perfect meter bar.
	 */
	getInkFillSprite() {
		return this.FillSprite;
	}
}

