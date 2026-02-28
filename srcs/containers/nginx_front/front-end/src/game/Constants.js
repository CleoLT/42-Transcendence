// colors
export const RED = "#DC2626";

// Game constants
export const PLAYER_RADIUS = 54; // Player/bowl radius in pixels

// Player movement and physics
export const PLAYER_SPEED = 300;
export const PLAYER_INITIAL_X_LEFT = 0.25; // Fraction of canvas width
export const PLAYER_INITIAL_X_RIGHT = 0.75; // Fraction of canvas width
export const PLAYER_INITIAL_Y_OFFSET = 60; // Pixels from bottom

export const PUSH_MAX_SPEED = 1200;

// Abilities
export const ABILITY_COSTS = {
	reversePush: 2,
	inkFreeze: 4,
	momentumSurge: 6
};

// Perfect meter
export const PERFECT_METER_MAX = 6;

// Perfect catch
export const PERFECT_CATCH_FACTOR = 0.2; // Fraction of bowl radius for perfect window
export const PERFECT_CATCH_EFFECT_DURATION = 0.6; // seconds

// Blossom system
export const BLOSSOM_FALL_SPEED = 150;
export const BLOSSOM_WIND_DRIFT = 80;
export const BLOSSOM_DESPAWN_Y_OFFSET = 50; // Pixels below canvas
export const BLOSSOM_DESPAWN_X_OFFSET = 50; // Pixels outside canvas

//ROUND
export const ROUND_INDICATOR_DURATION = 5.0; // seconds

// Miss effects
export const MISS_EFFECT_DURATION = 2.0; // seconds

// Table rendering
export const TABLE_WIDTH_FACTOR = 0.95; // Fraction of canvas width
export const TABLE_HEIGHT_FACTOR = 1.2; // Multiplier of player radius
export const TABLE_INSET_FACTOR = 0.03; // Fraction of table width
export const TABLE_BOTTOM_OFFSET = 20; // Pixels from bottom
export const TABLE_MIN_INSET = 4; // Minimum inset in pixels

// Lane system
export const LANE_OWNERSHIP_STREAK_THRESHOLD = 3; // Catches needed to own lane

// Pause button
export const PAUSE_BUTTON_FONT = 'bold 30px corben';

// Round indicator rendering (circle style, Corben font)
export const ROUND_INDICATOR_CIRCLE_RADIUS = 300;
export const ROUND_INDICATOR_TEXT_COLOR = '#FFFFFF';
export const ROUND_INDICATOR_TITLE_FONT = '400 50px Sixtyfour, sans-serif';
export const ROUND_INDICATOR_SUBTITLE_FONT = '400 28px Corben, sans-serif';
export const ROUND_INDICATOR_CONTROLS_FONT = '700 26px Corben, sans-serif';
export const ROUND_INDICATOR_CONTROLS_SMALL_FONT = '400 20px Corben, sans-serif';
export const ROUND_INDICATOR_SCORE_FONT = '700 28px Corben, sans-serif';
export const ROUND_INDICATOR_SCORE_SUB_FONT = '700 22px Corben, sans-serif';
export const ROUND_INDICATOR_RESET_SUB_FONT = '700 30px Corben, sans-serif';
export const ROUND_INDICATOR_TIMER_FONT = '400 100px Sixtyfour, sans-serif';
export const ROUND_INDICATOR_COLUMN_OFFSET = 150; // horizontal distance from center to each column

// Pause overlay
export const PAUSE_TEXT_FONT = '400 70px Sixtyfour, sans-serif';
export const PAUSE_TIMER_FONT = '700 48px Corben, sans-serif';

// Bowl colors
export const BOWL_COLOR_DEFAULT_1 = '#2a2a2a';
export const BOWL_COLOR_DEFAULT_2 = '#3a2a2a';
export const BOWL_COLOR_FROZEN = 'rgba(74, 144, 226, 0.8)';
export const BOWL_COLOR_MOMENTUM = 'rgba(212, 175, 55, 0.9)';
export const BOWL_COLOR_DASHING = 'rgba(255, 100, 100, 0.9)';
export const BOWL_RIM_COLOR_DEFAULT = 'rgba(139, 115, 85, 0.5)';
export const BOWL_RIM_COLOR_FROZEN = '#4a90e2';
export const BOWL_RIM_COLOR_MOMENTUM = '#d4af37';
export const BOWL_RIM_COLOR_DASHING = '#ff6666';
export const BOWL_SHADOW_COLOR = 'rgba(0, 0, 0, 0.3)';
export const BOWL_STROKE_COLOR = '#1a1a1a';
export const BOWL_LABEL_COLOR = '#f5f5dc';
export const BOWL_LABEL_FONT = 'bold';

// Paper texture
export const PAPER_TEXTURE_POINTS = 200;
export const PAPER_TEXTURE_SIZE_MIN = 1;
export const PAPER_TEXTURE_SIZE_MAX = 3;
export const PAPER_TEXTURE_COLOR = 'rgba(139, 115, 85, 0.02)';
export const PAPER_BACKGROUND_COLOR = 'rgba(255, 254, 240, 0.48)';

// Table rendering (fallback)
export const TABLE_LEG_HEIGHT_FACTOR = 1.25; // Multiplier of table height
export const TABLE_LEG_COLOR = 'rgba(12,12,12,0.95)';
export const TABLE_OUTLINE_COLOR = 'rgba(10,10,10,0.95)';
export const TABLE_GRAIN_COLOR = 'rgba(0,0,0,0.06)';
export const TABLE_INK_WASHES = [1, 0.4, 0.2];
export const TABLE_INK_WASH_COLOR = 'rgba(139, 115, 85, 1)';

// Bamboo separator
export const BAMBOO_SEPARATOR_WIDTH = 30;
export const BAMBOO_SEPARATOR_STROKE_WIDTH = 4;
export const BAMBOO_SEPARATOR_COLOR = '#2a2a2a';
export const BAMBOO_SEPARATOR_INK_BLEED = 1.5;
export const BAMBOO_SEPARATOR_SPLOTCH_CHANCE = 0.1;
export const BAMBOO_SEPARATOR_SPLOTCH_SIZE_MIN = 2;
export const BAMBOO_SEPARATOR_SPLOTCH_SIZE_MAX = 4;
export const BAMBOO_SEPARATOR_SPLOTCH_COLOR = 'rgba(42, 42, 42, 0.3)';
export const BAMBOO_SEPARATOR_WASH_COLOR = 'rgba(42, 42, 42, 0.1)';
export const BAMBOO_SEPARATOR_WASH_WIDTH = 3;
export const BAMBOO_SEPARATOR_STEP = 8;
export const BAMBOO_SEPARATOR_VARIATION_FACTOR = 0.03;
export const BAMBOO_SEPARATOR_WASH_STEP = 20;

// Blossom sprite generation
export const BLOSSOM_SPRITE_SIZE_NORMAL = 40;
export const BLOSSOM_SPRITE_SIZE_GOLDEN = 50;
export const BLOSSOM_PETAL_COUNT = 5;
export const BLOSSOM_PETAL_SIZE_NORMAL = 18;
export const BLOSSOM_PETAL_SIZE_GOLDEN = 22;
export const BLOSSOM_CENTER_SIZE_NORMAL = 6;
export const BLOSSOM_CENTER_SIZE_GOLDEN = 10;
export const BLOSSOM_PINK_FILL = 'rgba(255, 192, 203, 0.9)';
export const BLOSSOM_PINK_STROKE = 'rgba(219, 112, 147, 0.8)';
export const BLOSSOM_PINK_CENTER = 'rgba(255, 20, 147, 0.6)';
export const BLOSSOM_GOLDEN_FILL = 'rgba(255, 215, 0, 0.9)';
export const BLOSSOM_GOLDEN_STROKE = 'rgba(255, 140, 0, 0.9)';
export const BLOSSOM_GOLDEN_CENTER = 'rgba(255, 215, 0, 0.9)';
export const BLOSSOM_GOLDEN_GLOW_BLUR = 10;
export const BLOSSOM_GOLDEN_GLOW_COLOR = '#ffd700';
export const BLOSSOM_STROKE_WIDTH_NORMAL = 2;
export const BLOSSOM_STROKE_WIDTH_GOLDEN = 3;

// Loading screen
export const LOADING_BACKGROUND_COLOR = '#1a0f2e';
export const LOADING_TEXT_COLOR = '#ffffff';
export const LOADING_TEXT_FONT = '24px Arial';