import { PLAYER_SPEED, BLOSSOM_FALL_SPEED, BLOSSOM_WIND_DRIFT, ABILITY_COSTS } from './Constants.js';

/**
 * Sistema de IA completamente reescrito desde cero.
 * Arquitectura modular basada en Strategy Pattern para diferentes dificultades.
 * 
 * Estructura:
 * - AIStrategy: Clase base abstracta para estrategias de dificultad
 * - EasyStrategy, MediumStrategy, HardStrategy: Implementaciones específicas
 * - AI: Coordinador principal que delega a la estrategia correspondiente
 */

/**
 * Clase base abstracta para estrategias de dificultad de IA.
 * Define la interfaz común que todas las dificultades deben implementar.
 */
class AIStrategy {
	/**
	 * @param {Player} player - El jugador controlado por esta IA
	 * @param {number} canvasWidth - Ancho del canvas
	 * @param {number} canvasHeight - Alto del canvas
	 */
	constructor(player, canvasWidth, canvasHeight) {
		this.player = player;
		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;
	}

	/**
	 * Calcula la posición objetivo X basada en el estado del juego.
	 * 
	 * @param {Array<Object>} blossoms - Lista de blossoms activos
	 * @param {Player} otherPlayer - Jugador oponente
	 * @param {LaneSystem} laneSystem - Sistema de carriles (opcional)
	 * @param {WindSystem} windSystem - Sistema de viento (opcional)
	 * @returns {number|null} Posición X objetivo, o null si no hay objetivo
	 */
	calculateTargetX(blossoms, otherPlayer, laneSystem, windSystem) {
		throw new Error('calculateTargetX must be implemented by subclass');
	}

	/**
	 * Calcula si debe activarse el push.
	 * 
	 * @param {Player} otherPlayer - Jugador oponente
	 * @param {Array<Object>} blossoms - Lista de blossoms activos
	 * @returns {boolean} True si debe activarse push
	 */
	shouldPush(otherPlayer, blossoms) {
		return false;
	}

	/**
	 * Calcula si debe usarse dash.
	 * 
	 * @param {number} targetX - Posición objetivo X
	 * @param {Array<Object>} blossoms - Lista de blossoms activos
	 * @returns {boolean} True si debe usarse dash
	 */
	shouldDash(targetX, blossoms) {
		return false;
	}

	/**
	 * Calcula qué habilidad debe usarse, si alguna.
	 * 
	 * @param {Player} otherPlayer - Jugador oponente
	 * @param {Array<Object>} blossoms - Lista de blossoms activos
	 * @param {LaneSystem} laneSystem - Sistema de carriles (opcional)
	 * @returns {string|null} Nombre de la habilidad a usar ('reversePush', 'inkFreeze', 'momentumSurge') o null
	 */
	shouldUseAbility(otherPlayer, blossoms, laneSystem) {
		return null;
	}

	/**
	 * Predice la posición futura de un blossom considerando viento.
	 * 
	 * @param {Object} blossom - Blossom a predecir
	 * @param {number} timeToReach - Tiempo estimado para alcanzar la altura del jugador
	 * @param {WindSystem} windSystem - Sistema de viento
	 * @returns {number} Posición X predicha
	 */
	predictBlossomPosition(blossom, timeToReach, windSystem) {
		let predictedX = blossom.x;
		
		// Aplicar velocidad horizontal actual
		if (blossom.vx) {
			predictedX += blossom.vx * timeToReach;
		}
		
		// Aplicar deriva del viento si está activo
		if (windSystem && windSystem.isActive()) {
			const windDirection = windSystem.getDirection();
			predictedX += windDirection * BLOSSOM_WIND_DRIFT * timeToReach;
		}
		
		return predictedX;
	}

	/**
	 * Calcula el tiempo estimado para que un blossom alcance la altura del jugador.
	 * 
	 * @param {Object} blossom - Blossom a evaluar
	 * @returns {number} Tiempo en segundos, o Infinity si no es alcanzable
	 */
	calculateTimeToReach(blossom) {
		if (blossom.y >= this.player.y) {
			// El blossom ya está a la altura del jugador o más abajo
			return 0;
		}
		
		const verticalDistance = this.player.y - blossom.y;
		const fallSpeed = blossom.vy || BLOSSOM_FALL_SPEED;
		
		if (fallSpeed <= 0) {
			return Infinity;
		}
		
		return verticalDistance / fallSpeed;
	}
}

/**
 * Estrategia Easy: IA básica con limitaciones artificiales.
 * - Delay artificial en reacciones
 * - Errores pequeños en el seguimiento
 * - Sin predicción de movimiento
 * - Velocidad limitada
 */
class EasyStrategy extends AIStrategy {
	constructor(player, canvasWidth, canvasHeight) {
		super(player, canvasWidth, canvasHeight);
		
		// Estado interno para delay artificial
		this.reactionDelay = 0.5; // segundos de delay (aumentado para hacer más fácil)
		this.reactionTimer = 0;
		this.lastTargetX = null;
		
		// Parámetros de error artificial (aumentados para hacer más fácil)
		this.trackingError = 40; // píxeles de offset máximo (aumentado)
		this.errorChance = 0.5; // probabilidad de cometer error (aumentado)
	}

	calculateTargetX(blossoms, otherPlayer, laneSystem, windSystem) {
		// Filtrar blossoms activos y alcanzables
		const activeBlossoms = blossoms.filter(b => b.active && b.y < this.player.y);
		
		if (activeBlossoms.length === 0) {
			return null;
		}

		// Aplicar delay artificial: solo actualizar objetivo cada cierto tiempo
		// Nota: el timer se actualiza en AI.update() con deltaTime real
		if (this.reactionTimer < this.reactionDelay) {
			return this.lastTargetX;
		}
		this.reactionTimer = 0;

		// Seleccionar el blossom más cercano verticalmente
		let bestBlossom = null;
		let minVerticalDistance = Infinity;

		for (const blossom of activeBlossoms) {
			const verticalDistance = this.player.y - blossom.y;
			if (verticalDistance < minVerticalDistance && verticalDistance > 0) {
				minVerticalDistance = verticalDistance;
				bestBlossom = blossom;
			}
		}

		if (!bestBlossom) {
			return null;
		}

		// Sin predicción: usar posición actual
		let targetX = bestBlossom.x;

		// Aplicar error artificial ocasional
		if (Math.random() < this.errorChance) {
			const errorOffset = (Math.random() - 0.5) * 2 * this.trackingError;
			targetX += errorOffset;
		}

		this.lastTargetX = targetX;
		return targetX;
	}

	shouldPush(otherPlayer, blossoms) {
		// Easy raramente hace push
		return false;
	}

	shouldUseAbility(otherPlayer, blossoms, laneSystem) {
		// Easy no usa habilidades o las usa muy mal (muy raramente)
		if (!this.player.abilitiesEnabled) {
			return null;
		}

		// Solo usar habilidades muy ocasionalmente y sin estrategia (muy raro)
		if (Math.random() < 0.01) { // 1% de probabilidad por frame (reducido)
			// Usar la habilidad más barata si está disponible
			const cost = ABILITY_COSTS.reversePush;
			if (this.player.perfectMeter.value >= cost && 
			    this.player.abilities.reversePush.cooldown <= 0) {
				return 'reversePush';
			}
		}

		return null;
	}
}

/**
 * Estrategia Medium: IA intermedia sin limitaciones extremas.
 * - Sin delay artificial
 * - Sigue correctamente el objetivo
 * - Predicción básica (sin viento)
 * - Velocidad normal
 * - Usa habilidades básicamente (sin mucha estrategia)
 */
class MediumStrategy extends AIStrategy {
	constructor(player, canvasWidth, canvasHeight) {
		super(player, canvasWidth, canvasHeight);
		this.lastAbilityUse = 0;
		this.abilityCooldown = 3.0; // Segundos entre usos de habilidades
	}

	calculateTargetX(blossoms, otherPlayer, laneSystem, windSystem) {
		// Filtrar blossoms activos y alcanzables
		const activeBlossoms = blossoms.filter(b => b.active && b.y < this.player.y);
		
		if (activeBlossoms.length === 0) {
			return null;
		}

		// Priorizar blossoms dorados
		const goldenBlossoms = activeBlossoms.filter(b => b.golden);
		const candidates = goldenBlossoms.length > 0 ? goldenBlossoms : activeBlossoms;

		// Seleccionar el mejor blossom basado en distancia y valor
		let bestBlossom = null;
		let bestScore = Infinity;

		for (const blossom of candidates) {
			const timeToReach = this.calculateTimeToReach(blossom);
			
			if (timeToReach === Infinity || timeToReach < 0) {
				continue;
			}

			// Predicción básica: solo posición actual + velocidad horizontal (sin viento)
			const predictedX = this.predictBlossomPosition(blossom, timeToReach, null);
			
			// Calcular distancia horizontal
			const horizontalDistance = Math.abs(predictedX - this.player.x);
			
			// Score: distancia vertical + distancia horizontal (normalizada)
			const score = (this.player.y - blossom.y) + horizontalDistance * 0.5;
			
			// Penalizar si el oponente está más cerca (umbral más permisivo para Medium)
			const opponentDistance = Math.abs(predictedX - otherPlayer.x);
			if (opponentDistance < horizontalDistance * 0.5) {
				continue; // Oponente mucho más cerca, ignorar este blossom
			}

			if (score < bestScore) {
				bestScore = score;
				bestBlossom = blossom;
			}
		}

		if (!bestBlossom) {
			return null;
		}

		const timeToReach = this.calculateTimeToReach(bestBlossom);
		return this.predictBlossomPosition(bestBlossom, timeToReach, null);
	}

	shouldPush(otherPlayer, blossoms) {
		// Medium hace push ocasionalmente cuando está superpuesto (menos agresivo)
		if (!this.player.overlaps(otherPlayer)) {
			return false;
		}

		// Verificar si hay blossoms cercanos
		const nearbyBlossoms = blossoms.filter(b => 
			b.active && 
			Math.abs(b.y - this.player.y) < 100
		);

		return nearbyBlossoms.length > 0 && Math.random() < 0.25; // Reducido de 0.4 a 0.25
	}

	shouldDash(targetX, blossoms) {
		if (!targetX || this.player.dashCooldown > 0 || this.player.dashing) {
			return false;
		}

		const distance = Math.abs(targetX - this.player.x);
		// Dash si el objetivo está lejos y hay un blossom dorado cerca
		const hasGoldenNearby = blossoms.some(b => 
			b.active && 
			b.golden && 
			Math.abs(b.x - this.player.x) < 200
		);

		return distance > 150 && hasGoldenNearby;
	}

	shouldUseAbility(otherPlayer, blossoms, laneSystem) {
		if (!this.player.abilitiesEnabled) {
			return null;
		}

		// Medium usa habilidades básicamente cuando tiene recursos suficientes
		// Sin mucha estrategia, más reactivo que proactivo
		// Evaluar todas las habilidades y elegir la mejor según la situación

		const abilityScores = [];

		// 1. Evaluar inkFreeze (la más potente) - prioridad alta
		const inkFreezeCost = ABILITY_COSTS.inkFreeze;
		if (this.player.perfectMeter.value >= inkFreezeCost && 
		    this.player.abilities.inkFreeze.cooldown <= 0 &&
		    !otherPlayer.frozen) {
			let score = 0;
			const goldenBlossoms = blossoms.filter(b => b.active && b.golden);
			if (goldenBlossoms.length > 0) {
				const targetBlossom = goldenBlossoms[0];
				const opponentDistance = Math.abs(targetBlossom.x - otherPlayer.x);
				const myDistance = Math.abs(targetBlossom.x - this.player.x);
				
				// Score alto si el oponente está más cerca de un objetivo dorado
				if (opponentDistance < myDistance && opponentDistance < 120) {
					score = 80 + (120 - opponentDistance); // Más cerca = más score
				}
			}
			
			// También score si el oponente está bloqueando el camino
			if (this.player.overlaps(otherPlayer)) {
				const nearbyBlossoms = blossoms.filter(b => 
					b.active && 
					Math.abs(b.y - this.player.y) < 100
				);
				if (nearbyBlossoms.length > 0) {
					score = Math.max(score, 50);
				}
			}
			
			if (score > 0 && Math.random() < 0.4) { // 40% de probabilidad si hay score
				abilityScores.push({ ability: 'inkFreeze', score });
			}
		}

		// 2. Evaluar reversePush
		const reversePushCost = ABILITY_COSTS.reversePush;
		if (this.player.perfectMeter.value >= reversePushCost && 
		    this.player.abilities.reversePush.cooldown <= 0 &&
		    !otherPlayer.invertControlsActive) {
			let score = 0;
			const distanceToOpponent = Math.abs(this.player.x - otherPlayer.x);
			const hasImportantBlossoms = blossoms.some(b => 
				b.active && 
				(b.golden || Math.abs(b.y - this.player.y) < 100)
			);
			
			if (distanceToOpponent < 180 && hasImportantBlossoms) {
				score = 30 + (180 - distanceToOpponent) * 0.2;
			}
			
			if (score > 0 && Math.random() < 0.3) { // 30% de probabilidad
				abilityScores.push({ ability: 'reversePush', score });
			}
		}

		// 3. Evaluar momentumSurge
		const momentumSurgeCost = ABILITY_COSTS.momentumSurge;
		if (this.player.perfectMeter.value >= momentumSurgeCost && 
		    this.player.abilities.momentumSurge.cooldown <= 0) {
			let score = 0;
			
			// Score alto si está en situación de push competitiva
			if (this.player.overlaps(otherPlayer)) {
				const nearbyBlossoms = blossoms.filter(b => 
					b.active && 
					Math.abs(b.y - this.player.y) < 120
				);
				if (nearbyBlossoms.length > 0) {
					score = 40;
				}
			}
			
			if (score > 0 && Math.random() < 0.25) { // 25% de probabilidad
				abilityScores.push({ ability: 'momentumSurge', score });
			}
		}

		// Elegir la habilidad con mayor score
		if (abilityScores.length > 0) {
			abilityScores.sort((a, b) => b.score - a.score);
			return abilityScores[0].ability;
		}

		return null;
	}
}

/**
 * Estrategia Hard: IA avanzada con predicción completa.
 * - Sin delay
 * - Predice posición futura del objetivo con viento
 * - Reacción inmediata
 * - Usa velocidad máxima
 * - Sin errores artificiales
 * - Usa habilidades de forma estratégica e inteligente
 */
class HardStrategy extends AIStrategy {
	constructor(player, canvasWidth, canvasHeight) {
		super(player, canvasWidth, canvasHeight);
	}

	calculateTargetX(blossoms, otherPlayer, laneSystem, windSystem) {
		// Filtrar blossoms activos y alcanzables
		const activeBlossoms = blossoms.filter(b => b.active && b.y < this.player.y);
		
		if (activeBlossoms.length === 0) {
			return null;
		}

		// Priorizar blossoms dorados
		const goldenBlossoms = activeBlossoms.filter(b => b.golden);
		const candidates = goldenBlossoms.length > 0 ? goldenBlossoms : activeBlossoms;

		// Evaluar cada candidato con predicción completa
		let bestBlossom = null;
		let bestScore = -Infinity;

		for (const blossom of candidates) {
			const timeToReach = this.calculateTimeToReach(blossom);
			
			if (timeToReach === Infinity || timeToReach < 0) {
				continue;
			}

			// Predicción completa con viento
			const predictedX = this.predictBlossomPosition(blossom, timeToReach, windSystem);
			
			// Calcular si el jugador puede alcanzar esa posición
			const horizontalDistance = Math.abs(predictedX - this.player.x);
			const timeToMove = horizontalDistance / PLAYER_SPEED;
			
			// Verificar si es alcanzable
			if (timeToMove > timeToReach * 1.1) {
				continue; // No alcanzable
			}

			// Calcular score basado en valor y accesibilidad
			let score = 0;
			
			// Bonus por blossom dorado
			if (blossom.golden) {
				score += 200;
			}
			
			// Bonus por perfect catch potencial (si hay laneSystem)
			if (laneSystem) {
				const laneRegion = laneSystem.getLaneRegionForPoint(predictedX);
				if (laneRegion >= 0 && laneSystem.isInLaneCenter(predictedX, laneRegion)) {
					score += 100;
				}
			}
			
			// Penalizar por distancia
			score -= horizontalDistance * 0.3;
			
			// Penalizar si el oponente está más cerca
			const opponentDistance = Math.abs(predictedX - otherPlayer.x);
			if (opponentDistance < horizontalDistance * 0.8) {
				score -= 50;
			}

			// Penalizar si el oponente está bloqueando el camino
			const isBlocked = (this.player.x < predictedX && otherPlayer.x > this.player.x && otherPlayer.x < predictedX) ||
			                  (this.player.x > predictedX && otherPlayer.x < this.player.x && otherPlayer.x > predictedX);
			if (isBlocked && Math.abs(otherPlayer.x - predictedX) < 80) {
				score -= 80;
			}

			if (score > bestScore) {
				bestScore = score;
				bestBlossom = blossom;
			}
		}

		if (!bestBlossom) {
			return null;
		}

		const timeToReach = this.calculateTimeToReach(bestBlossom);
		return this.predictBlossomPosition(bestBlossom, timeToReach, windSystem);
	}

	shouldPush(otherPlayer, blossoms) {
		if (!this.player.overlaps(otherPlayer)) {
			return false;
		}

		// Hard hace push estratégicamente cuando hay blossoms cercanos
		const nearbyBlossoms = blossoms.filter(b => 
			b.active && 
			Math.abs(b.y - this.player.y) < 120
		);

		if (nearbyBlossoms.length === 0) {
			return false;
		}

		// Push si hay un blossom objetivo cerca del oponente
		const targetBlossom = nearbyBlossoms[0];
		const distanceToBlossom = Math.abs(targetBlossom.x - this.player.x);
		const opponentDistanceToBlossom = Math.abs(targetBlossom.x - otherPlayer.x);

		return opponentDistanceToBlossom < distanceToBlossom * 0.9;
	}

	shouldDash(targetX, blossoms) {
		if (!targetX || this.player.dashCooldown > 0 || this.player.dashing) {
			return false;
		}

		const distance = Math.abs(targetX - this.player.x);
		
		// Dash si el objetivo está lejos y es alcanzable con dash
		if (distance > 120) {
			// Verificar si hay un blossom dorado como objetivo
			const hasGoldenTarget = blossoms.some(b => 
				b.active && 
				b.golden && 
				Math.abs(b.x - targetX) < 30
			);

			return hasGoldenTarget || distance > 200;
		}

		return false;
	}

	shouldUseAbility(otherPlayer, blossoms, laneSystem) {
		if (!this.player.abilitiesEnabled) {
			return null;
		}

		// Hard usa habilidades de forma estratégica e inteligente
		// Evaluar todas las habilidades y elegir la mejor según la situación
		// Priorizar inkFreeze cuando sea más útil (es la más potente)

		const abilityScores = [];

		// 1. Evaluar inkFreeze (la más potente) - máxima prioridad
		const inkFreezeCost = ABILITY_COSTS.inkFreeze;
		if (this.player.perfectMeter.value >= inkFreezeCost && 
		    this.player.abilities.inkFreeze.cooldown <= 0 &&
		    !otherPlayer.frozen) {
			let score = 0;
			
			const goldenBlossoms = blossoms.filter(b => b.active && b.golden);
			if (goldenBlossoms.length > 0) {
				const targetBlossom = goldenBlossoms[0];
				const timeToReach = this.calculateTimeToReach(targetBlossom);
				const predictedX = this.predictBlossomPosition(targetBlossom, timeToReach, null);
				
				const opponentDistance = Math.abs(predictedX - otherPlayer.x);
				const myDistance = Math.abs(predictedX - this.player.x);
				
				// Score muy alto si el oponente está más cerca y está a punto de alcanzarlo
				if (opponentDistance < myDistance && 
				    opponentDistance < 70 && 
				    timeToReach < 1.0) {
					score = 150 + (70 - opponentDistance) * 2; // Score muy alto
				}
			}
			
			// También score alto si el oponente está bloqueando el camino
			const tempTargetX = this.calculateTargetX(blossoms, otherPlayer, laneSystem, null);
			if (tempTargetX !== null) {
				const isBlocked = (this.player.x < tempTargetX && otherPlayer.x > this.player.x && otherPlayer.x < tempTargetX) ||
				                  (this.player.x > tempTargetX && otherPlayer.x < this.player.x && otherPlayer.x > tempTargetX);
				if (isBlocked && Math.abs(otherPlayer.x - tempTargetX) < 120) {
					score = Math.max(score, 120);
				}
			}
			
			if (score > 0) {
				abilityScores.push({ ability: 'inkFreeze', score });
			}
		}

		// 2. Evaluar reversePush
		const reversePushCost = ABILITY_COSTS.reversePush;
		if (this.player.perfectMeter.value >= reversePushCost && 
		    this.player.abilities.reversePush.cooldown <= 0 &&
		    !otherPlayer.invertControlsActive) {
			let score = 0;
			
			const goldenBlossoms = blossoms.filter(b => b.active && b.golden);
			if (goldenBlossoms.length > 0) {
				const targetBlossom = goldenBlossoms[0];
				const timeToReach = this.calculateTimeToReach(targetBlossom);
				const predictedX = this.predictBlossomPosition(targetBlossom, timeToReach, null);
				
				const opponentDistance = Math.abs(predictedX - otherPlayer.x);
				const myDistance = Math.abs(predictedX - this.player.x);
				
				// Score si el oponente está más cerca y está a punto de alcanzarlo
				if (opponentDistance < myDistance && 
				    opponentDistance < 90 && 
				    timeToReach < 1.2) {
					score = 60 + (90 - opponentDistance);
				}
			}
			
			// También score cuando el oponente está moviéndose activamente
			if (this.player.overlaps(otherPlayer)) {
				const nearbyBlossoms = blossoms.filter(b => 
					b.active && 
					Math.abs(b.y - this.player.y) < 120
				);
				if (nearbyBlossoms.length > 0) {
					score = Math.max(score, 50);
				}
			}
			
			if (score > 0) {
				abilityScores.push({ ability: 'reversePush', score });
			}
		}

		// 3. Evaluar momentumSurge
		const momentumSurgeCost = ABILITY_COSTS.momentumSurge;
		if (this.player.perfectMeter.value >= momentumSurgeCost && 
		    this.player.abilities.momentumSurge.cooldown <= 0) {
			let score = 0;
			
			// Score alto en situaciones de control de carril
			if (laneSystem) {
				const myLane = this.player.getLaneRegion(laneSystem);
				const opponentLane = otherPlayer.getLaneRegion(laneSystem);
				
				if (myLane >= 0 && myLane === opponentLane) {
					const laneBlossoms = blossoms.filter(b => {
						if (!b.active) return false;
						const timeToReach = this.calculateTimeToReach(b);
						const predictedX = this.predictBlossomPosition(b, timeToReach, null);
						const laneRegion = laneSystem.getLaneRegionForPoint(predictedX);
						return laneRegion === myLane;
					});
					
					if (laneBlossoms.length > 0 && this.player.overlaps(otherPlayer)) {
						score = 80;
					}
				}
			}
			
			// También score cuando hay múltiples blossoms dorados
			const goldenBlossoms = blossoms.filter(b => b.active && b.golden);
			if (goldenBlossoms.length >= 2 && this.player.overlaps(otherPlayer)) {
				score = Math.max(score, 70);
			}
			
			if (score > 0) {
				abilityScores.push({ ability: 'momentumSurge', score });
			}
		}

		// Elegir la habilidad con mayor score
		if (abilityScores.length > 0) {
			abilityScores.sort((a, b) => b.score - a.score);
			return abilityScores[0].ability;
		}

		return null;
	}
}

/**
 * Clase principal de IA que coordina las estrategias de dificultad.
 * Completamente desacoplada del render y basada en lógica determinista.
 */
export class AI {
	/**
	 * Crea un controlador de IA que maneja un jugador usando estrategias de dificultad.
	 * 
	 * @param {Player} player - Instancia del jugador controlado por esta IA
	 * @param {'easy' | 'medium' | 'hard'} difficulty - Nivel de dificultad
	 * @param {number} canvasWidth - Ancho del canvas
	 * @param {number} canvasHeight - Alto del canvas
	 */
	constructor(player, difficulty = 'easy', canvasWidth, canvasHeight) {
		this.player = player;
		this.difficulty = difficulty;
		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;
		// Crear estrategia según dificultad
		this.strategy = this.createStrategy(difficulty, player, canvasWidth, canvasHeight);
		
		// Estado interno
		this.targetX = null;
		this.pushActive = false;
		this.abilityToUse = null;
		this.currentBlossoms = [];
		this.currentOtherPlayer = null;
		this.currentLaneSystem = null;
	}

	/**
	 * Factory method para crear la estrategia apropiada según la dificultad.
	 * 
	 * @param {string} difficulty - Nivel de dificultad
	 * @param {Player} player - Jugador controlado
	 * @param {number} canvasWidth - Ancho del canvas
	 * @param {number} canvasHeight - Alto del canvas
	 * @returns {AIStrategy} Instancia de la estrategia
	 */
	createStrategy(difficulty, player, canvasWidth, canvasHeight) {
		switch (difficulty.toLowerCase()) {
			case 'easy':
				return new EasyStrategy(player, canvasWidth, canvasHeight);
			case 'medium':
			case 'normal': // Compatibilidad con dificultad anterior
				return new MediumStrategy(player, canvasWidth, canvasHeight);
			case 'hard':
				return new HardStrategy(player, canvasWidth, canvasHeight);
			default:
				return new EasyStrategy(player, canvasWidth, canvasHeight);
		}
	}

	/**
	 * Actualiza la lógica de IA en cada frame del juego.
	 * Completamente determinista y desacoplada del render.
	 * 
	 * @param {number} deltaTime - Tiempo transcurrido desde el último frame (en segundos)
	 * @param {Array<Object>} blossoms - Lista actual de blossoms
	 * @param {Player} otherPlayer - Jugador oponente
	 * @param {LaneSystem} laneSystem - Sistema de carriles (opcional)
	 * @param {WindSystem} windSystem - Sistema de viento (opcional)
	 * @param {InputManager} inputManager - Gestor de entrada (no usado aquí, solo para compatibilidad)
	 */
	update(deltaTime, blossoms, otherPlayer, laneSystem, windSystem, inputManager) {
		// Actualizar delay timer para Easy (si es necesario)
		if (this.strategy instanceof EasyStrategy) {
			this.strategy.reactionTimer += deltaTime;
		}

		// Calcular posición objetivo usando la estrategia
		this.targetX = this.strategy.calculateTargetX(
			blossoms,
			otherPlayer,
			laneSystem,
			windSystem
		);

		// Calcular si debe hacer push
		this.pushActive = this.strategy.shouldPush(otherPlayer, blossoms);
		
		// Calcular qué habilidad usar (si alguna)
		this.abilityToUse = this.strategy.shouldUseAbility(otherPlayer, blossoms, laneSystem);
		
		// Guardar blossoms para uso en getMovementInput
		this.currentBlossoms = blossoms;
		this.currentOtherPlayer = otherPlayer;
		this.currentLaneSystem = laneSystem;
	}

	/**
	 * Convierte las decisiones de IA en entradas de teclado simuladas.
	 * Este método aplica el movimiento calculado por la estrategia.
	 * 
	 * @param {InputManager} inputManager - Gestor de entrada para simular teclas
	 */
	getMovementInput(inputManager) {
		// Obtener mapeo de teclas según el ID del jugador
		const keys = this.player.id === 1
			? { left: 'KeyA', right: 'KeyD', dash: 'Space', push: 'ControlRight' }
			: { left: 'ArrowLeft', right: 'ArrowRight', dash: 'ShiftRight', push: 'ControlRight' };

		// Limpiar todas las entradas de movimiento primero
		inputManager.simulateKeyRelease(keys.left);
		inputManager.simulateKeyRelease(keys.right);

		// Si no hay objetivo, no hacer nada
		if (this.targetX === null) {
			return;
		}

		// Calcular distancia y dirección al objetivo
		const dx = this.targetX - this.player.x;
		const distance = Math.abs(dx);

		// Si estamos suficientemente cerca, no moverse
		const stopThreshold = 8; // píxeles
		if (distance < stopThreshold) {
			return;
		}

		// Determinar dirección de movimiento
		const moveThreshold = 3; // píxeles mínimos para iniciar movimiento
		if (Math.abs(dx) > moveThreshold) {
			if (dx < 0) {
				inputManager.simulateKeyPress(keys.left);
			} else {
				inputManager.simulateKeyPress(keys.right);
			}
		}

		// Evaluar dash según la estrategia
		const blossoms = this.currentBlossoms || [];
		if (this.strategy.shouldDash(this.targetX, blossoms)) {
			if (this.player.dashCooldown <= 0 && !this.player.dashing) {
				inputManager.simulateKeyPress(keys.dash);
			}
		}

		// Aplicar push si está activo
		if (this.pushActive && this.player.pushCooldown <= 0) {
			inputManager.simulateKeyPress(keys.push);
		}

		// Usar habilidad si está disponible y la estrategia lo recomienda
		if (this.abilityToUse && this.player.abilitiesEnabled) {
			// Mapeo de habilidades a teclas (jugador 2 usa Numpad)
			const abilityKeys = {
				reversePush: 'Numpad1',
				inkFreeze: 'Numpad2',
				momentumSurge: 'Numpad3'
			};

			const abilityKey = abilityKeys[this.abilityToUse];
			if (abilityKey) {
				// Verificar que la habilidad esté disponible con doble verificación
				const ability = this.player.abilities[this.abilityToUse];
				const requiredCost = ABILITY_COSTS[this.abilityToUse];
				
				// Verificar cooldown, recursos y que la habilidad exista
				if (ability && 
				    ability.cooldown <= 0 && 
				    this.player.perfectMeter.value >= requiredCost &&
				    !this.player.frozen) {
					// Simular presión de tecla (edge-triggered)
					if (!inputManager.wasKeyJustPressed(abilityKey)) {
						inputManager.simulateKeyPress(abilityKey);
					}
				}
			}
		}
	}
}
