// Game constants
export const PLAYER_RADIUS = 54; // Player/bowl radius in pixels

// Canvas dimensions
export const CANVAS_BASE_WIDTH = 1800;
export const CANVAS_BASE_HEIGHT = 800;

// Player movement and physics
export const PLAYER_SPEED = 300;
export const PLAYER_INITIAL_X_LEFT = 0.25; // Fraction of canvas width
export const PLAYER_INITIAL_X_RIGHT = 0.75; // Fraction of canvas width
export const PLAYER_INITIAL_Y_OFFSET = 60; // Pixels from bottom

// Dash mechanics
export const DASH_DURATION = 0.2; // seconds
export const DASH_COOLDOWN = 2.5; // seconds
export const DASH_SPEED_MULTIPLIER = 2.0;

// Push mechanics
export const PUSH_COOLDOWN_NORMAL = 1.0; // seconds
export const PUSH_COOLDOWN_ABILITY = 0.5; // seconds
export const PUSH_IMPULSE = 900;
export const PUSH_MAX_SPEED = 1200;
export const PUSH_DAMPING = 6;
export const PUSH_VELOCITY_THRESHOLD = 5; // Minimum speed before snapping to zero

// Abilities
export const ABILITY_COSTS = {
	reversePush: 2,
	inkFreeze: 4,
	momentumSurge: 6
};

export const ABILITY_COOLDOWNS = {
	reversePush: 5,
	inkFreeze: 8,
	momentumSurge: 10
};

// Perfect meter
export const PERFECT_METER_MAX = 6;
export const PERFECT_METER_GOLDEN_BONUS = 2; // Additional points for golden blossom

// Perfect catch
export const PERFECT_CATCH_FACTOR = 0.2; // Fraction of bowl radius for perfect window
export const PERFECT_CATCH_EFFECT_DURATION = 0.6; // seconds
export const PERFECT_CATCH_EFFECT_SCALE = 0.3; // Scale animation factor

// Status effects
export const FREEZE_DURATION = 0.4; // seconds
export const MOMENTUM_DURATION = 1.5; // seconds
export const MOMENTUM_PUSH_COUNT = 2; // Number of pushes allowed during momentum
export const MOMENTUM_SPEED_MULTIPLIER = 1.5;

// Blossom system
export const BLOSSOM_SPAWN_INTERVAL = 1.0; // seconds
export const BLOSSOM_FALL_SPEED = 150;
export const BLOSSOM_GOLDEN_CHANCE = 0.1; // 10% chance
export const BLOSSOM_SIZE_NORMAL = 20;
export const BLOSSOM_SIZE_GOLDEN = 25;
export const BLOSSOM_WIND_DRIFT = 80;
export const BLOSSOM_SWAY_AMOUNT = 10; // Random horizontal sway
export const BLOSSOM_SPAWN_Y = -30; // Spawn above canvas
export const BLOSSOM_DESPAWN_Y_OFFSET = 50; // Pixels below canvas
export const BLOSSOM_DESPAWN_X_OFFSET = 50; // Pixels outside canvas

// Wind system
export const WIND_GUST_DURATION = 3; // seconds
export const WIND_MIN_COOLDOWN = 10; // seconds
export const WIND_MAX_COOLDOWN = 20; // seconds
export const WIND_DIRECTION_LEFT = -1;
export const WIND_DIRECTION_RIGHT = 1;

// Round system
export const ROUND_TIME = 20; // seconds per round
export const MAX_ROUNDS = 2;
export const ROUND_INDICATOR_DURATION = 5.0; // seconds
export const ROUND_RESET_DELAY = 2000; // milliseconds

// Miss effects
export const MISS_EFFECT_DURATION = 2.0; // seconds
export const MISS_EFFECT_Y_OFFSET = 50; // Pixels from bottom
export const MISS_EFFECT_SIZE_MIN = 30;
export const MISS_EFFECT_SIZE_MAX = 50;
export const MISS_EFFECT_ALPHA = 0.6;

// Table rendering
export const TABLE_WIDTH_FACTOR = 0.95; // Fraction of canvas width
export const TABLE_HEIGHT_FACTOR = 1.2; // Multiplier of player radius
export const TABLE_INSET_FACTOR = 0.03; // Fraction of table width
export const TABLE_BOTTOM_OFFSET = 20; // Pixels from bottom
export const TABLE_MIN_INSET = 4; // Minimum inset in pixels

// Lane system
export const LANE_COUNT = 3;
export const LANE_CENTER_RADIUS_MIN = 40; // Minimum pixels
export const LANE_CENTER_RADIUS_FACTOR = 0.06; // Fraction of canvas width
export const LANE_OWNERSHIP_STREAK_THRESHOLD = 3; // Catches needed to own lane
export const LANE_SPAWN_EDGE_LEFT = 133; // Hardcoded spawn boundary
export const LANE_SPAWN_EDGE_RIGHT = 1668; // Hardcoded spawn boundary

// Lane positions (fractions of canvas width)
export const LANE_LEFT_CENTER = 0.166;
export const LANE_MIDDLE_CENTER = 0.5;
export const LANE_RIGHT_CENTER = 0.833;
export const LANE_WIDTH = 0.333; // Each lane is 1/3 of canvas

// Lane tint
export const LANE_TINT_TARGET_ALPHA = 0.5;
export const LANE_TINT_FADE_SPEED = 1.0;

// Player colors (for lane tint)
export const PLAYER_COLORS = {
	1: { r: 232, g: 176, b: 163 },
	2: { r: 253, g: 210, b: 139 }
};

// Perfect meter rendering
export const PERFECT_METER_CAPSULE_COUNT = 6;
export const PERFECT_METER_CAPSULE_WIDTH = 40;
export const PERFECT_METER_CAPSULE_HEIGHT = 75;
export const PERFECT_METER_CAPSULE_GAP = 10;
export const PERFECT_METER_CAPSULE_RADIUS = 100;
export const PERFECT_METER_CAPSULE_COLORS = [
	'#FEEBEB', // First two
	'#FEEBEB',
	'#F9BEBE', // Middle two
	'#F9BEBE',
	'#FDD28B', // Last two
	'#FDD28B'
];
export const PERFECT_METER_INACTIVE_COLOR = '#D9D9D9';
export const PERFECT_METER_BAR_Y_FACTOR = 0.1; // Fraction of canvas height

// Ability indicators
export const ABILITY_INDICATOR_RADIUS = 9;
export const ABILITY_INDICATOR_SPACING = 30;
export const ABILITY_INDICATOR_OFFSET = 4; // Multiplier for positioning
export const ABILITY_INDICATOR_AVAILABLE_COLOR = '#00ff11';
export const ABILITY_INDICATOR_UNAVAILABLE_COLOR = '#CCCCCC';
export const ABILITY_INDICATOR_STROKE_COLOR = '#999999';
export const ABILITY_SPRITE_SIZE = 16;
export const ABILITY_SPRITE_Y_OFFSET = 12;

// Pause button
export const PAUSE_BUTTON_SIZE = 80;
export const PAUSE_BUTTON_X_OFFSET = 40;
export const PAUSE_BUTTON_Y_OFFSET = 40;
export const PAUSE_BUTTON_COLOR = '#FF0000';
export const PAUSE_BUTTON_TEXT_COLOR = '#000000';
export const PAUSE_BUTTON_FONT = 'bold 30px corben';

// Round indicator rendering
export const ROUND_INDICATOR_BG_ALPHA = 0.8;
export const ROUND_INDICATOR_TEXT_COLOR = '#FFFFFF';
export const ROUND_INDICATOR_TITLE_FONT = 'bold 72px Arial';
export const ROUND_INDICATOR_CONTROLS_FONT = 'bold 32px Arial';
export const ROUND_INDICATOR_CONTROLS_SMALL_FONT = '24px Arial';
export const ROUND_INDICATOR_SCORE_FONT = 'bold 48px Arial';
export const ROUND_INDICATOR_SCORE_SUB_FONT = 'bold 36px Arial';
export const ROUND_INDICATOR_TIMER_FONT = 'bold 700px Arial';
export const ROUND_INDICATOR_TIMER_ALPHA = 0.28;
export const ROUND_INDICATOR_Y_OFFSET = -150;
export const ROUND_INDICATOR_CONTROLS_Y_OFFSET = -50;
export const ROUND_INDICATOR_SCORE_Y_OFFSET = -30;

// Pause overlay
export const PAUSE_OVERLAY_ALPHA = 0.7;
export const PAUSE_TEXT_FONT = 'bold 64px Arial';
export const PAUSE_TEXT_Y_OFFSET = -60;
export const PAUSE_TIMER_FONT = 'bold 48px Arial';
export const PAUSE_TIMER_COLOR = '#FFD700';
export const PAUSE_TIMER_Y_OFFSET = 40;

// Bowl rendering
export const BOWL_SHADOW_Y_OFFSET_FACTOR = 0.5; // Multiplier of radius
export const BOWL_SHADOW_RADIUS_X_OFFSET = 6; // Pixels less than radius
export const BOWL_SHADOW_RADIUS_Y_FACTOR = 0.22; // Multiplier of radius
export const BOWL_LINE_WIDTH_FACTOR = 0.08; // Multiplier of radius
export const BOWL_LABEL_Y_OFFSET = 10;
export const BOWL_FONT_SIZE_FACTOR = 0.3; // Multiplier of radius
export const BOWL_INK_BLOOM_SIZE_FACTOR = 2.0; // Multiplier of radius
export const BOWL_PERFECT_WINDOW_Y_FACTOR = 0.45; // Multiplier of radius (negative)
export const BOWL_PERFECT_WINDOW_HEIGHT_FACTOR = 0.2; // Multiplier of perfect width
export const BOWL_PERFECT_WINDOW_ALPHA = 0.65;
export const BOWL_PERFECT_WINDOW_COLOR = 'rgba(255, 196, 0, 0.65)';
export const BOWL_PERFECT_WINDOW_LINE_WIDTH = 3;

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

// Ink bloom effect
export const INK_BLOOM_RINGS = 3;
export const INK_BLOOM_ALPHA_BASE = 0.3;
export const INK_BLOOM_COLOR = 'rgba(212, 175, 55, 0.3)';

// Perfect catch effect
export const PERFECT_CATCH_SPLASH_RADIUS = 50;
export const PERFECT_CATCH_SPLASH_COLOR = 'rgba(0,0,0,0.35)';
export const PERFECT_CATCH_TEXT_FONT = '36px sixtyfour';
export const PERFECT_CATCH_TEXT_LETTER_SPACING = '-0.13em';
export const PERFECT_CATCH_TEXT_STROKE_COLOR = '#000';
export const PERFECT_CATCH_TEXT_COLOR_NORMAL = '#4a90e2';
export const PERFECT_CATCH_TEXT_COLOR_GOLDEN = '#d4af37';
export const PERFECT_CATCH_TEXT_Y_OFFSET = -40;

// Wind effect rendering
export const WIND_STREAK_SPAWN_CHANCE = 0.2;
export const WIND_STREAK_SPEED = 20;
export const WIND_STREAK_LENGTH_MIN = 30;
export const WIND_STREAK_LENGTH_MAX = 70;
export const WIND_STREAK_LINE_WIDTH = 2;
export const WIND_STREAK_COLOR = 'rgba(141, 141, 141, 1.0)';
export const WIND_STREAK_BOUNDS_OFFSET = 50;

// Paper texture
export const PAPER_TEXTURE_POINTS = 200;
export const PAPER_TEXTURE_SIZE_MIN = 1;
export const PAPER_TEXTURE_SIZE_MAX = 3;
export const PAPER_TEXTURE_COLOR = 'rgba(139, 115, 85, 0.02)';
export const PAPER_BACKGROUND_COLOR = '#fffef0';

// Table rendering (fallback)
export const TABLE_LEG_COUNT = 3;
export const TABLE_LEG_WIDTH_FACTOR = 0.32; // Multiplier of player radius
export const TABLE_LEG_HEIGHT_FACTOR = 1.25; // Multiplier of table height
export const TABLE_LEG_POSITION_LEFT = 0.08; // Fraction of table width
export const TABLE_LEG_POSITION_CENTER = 0.5;
export const TABLE_LEG_POSITION_RIGHT = 0.92;
export const TABLE_LEG_MIN_WIDTH = 10;
export const TABLE_LEG_RADIUS_FACTOR = 0.4; // Multiplier of leg width
export const TABLE_LEG_MIN_RADIUS = 6;
export const TABLE_LEG_COLOR = 'rgba(12,12,12,0.95)';
export const TABLE_OUTLINE_WIDTH_FACTOR = 0.18; // Multiplier of player radius
export const TABLE_OUTLINE_MIN_WIDTH = 4;
export const TABLE_OUTLINE_COLOR = 'rgba(10,10,10,0.95)';
export const TABLE_GRAIN_LINES = 4;
export const TABLE_GRAIN_COLOR = 'rgba(0,0,0,0.06)';
export const TABLE_GRAIN_LINE_WIDTH = 1;
export const TABLE_GRAIN_PADDING = 4;
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

// AI configuration
export const AI_CAPABILITIES = {
	easy: {
		canPush: true,
		canDash: false,
		canUseAbilities: false
	},
	normal: {
		canPush: true,
		canDash: true,
		canUseAbilities: false
	},
	hard: {
		canPush: true,
		canDash: true,
		canUseAbilities: true
	}
};

export const AI_CONFIG = {
	easy: { hesitationChance: 0.35, perfectChance: 0.35, aimError: 16 },
	normal: { hesitationChance: 0.25, perfectChance: 0.55, aimError: 12 },
	hard: { hesitationChance: 0.08, perfectChance: 0.85, aimError: 6 }
};

export const AI_REACTION_TIME = 0.1; // seconds
export const AI_PERFECT_ZONE = 18; // pixels
export const AI_PREDICTION_TIME = 0.15; // seconds
export const AI_AIM_ERROR_MULTIPLIER = 1.4;
export const AI_AIM_JITTER_THRESHOLD = 50; // pixels
export const AI_IMMINENT_BLOSSOM_THRESHOLD = 60; // pixels
export const AI_PUSH_CHANCE_EASY = 0.25;
export const AI_PUSH_CHANCE_NORMAL = 0.45;
export const AI_GOLDEN_BLOSSOM_SCORE = 100;
export const AI_PERFECT_CATCH_SCORE = 50;
export const AI_DISTANCE_PENALTY = 0.1;
export const AI_OPPONENT_CLOSER_PENALTY = 30;
export const AI_OPPONENT_BLOCKING_PENALTY = 20;
export const AI_OPPONENT_CLOSER_THRESHOLD = 0.8;
export const AI_BLOCKING_DISTANCE = 50; // pixels
export const AI_STOP_DISTANCE = 10; // pixels
export const AI_STEER_THRESHOLD = 5; // pixels
export const AI_DASH_DISTANCE_THRESHOLD = 150; // pixels
export const AI_GOLDEN_NEARBY_DISTANCE = 100; // pixels
export const AI_LANE_STREAK_THRESHOLD = 3;
export const AI_WIND_PREDICTION_TIME = 0.5; // seconds

// Collision detection
export const COLLISION_OVERLAP_THRESHOLD = 0.99; // Fraction of min distance
export const COLLISION_PUSH_TOLERANCE = 1.1; // Multiplier for push detection
export const COLLISION_WALL_THRESHOLD = 0.5; // Pixels from wall

// Player collision resolution
export const PLAYER_COLLISION_TARGET_DISTANCE = 0.99; // Fraction of min distance

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

// Delta time cap (for preventing large jumps)
export const DELTA_TIME_MAX = 0.1; // seconds
