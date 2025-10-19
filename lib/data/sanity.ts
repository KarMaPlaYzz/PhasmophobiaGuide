/**
 * Sanity Mechanics Database
 * Complete sanity system documentation including drain rates, effects, and protections
 */

export interface SanityDrainEvent {
  event: string;
  description: string;
  sanityDrain: number;
  difficulty: 'All' | 'Professional' | 'Nightmare' | 'Insanity';
  ghostSpecific?: string[];
}

export interface SanityThreshold {
  threshold: number;
  effect: string;
  huntsAllowed: boolean;
  ghostActivity: string;
}

export interface DifficultySettings {
  name: string;
  passiveDrainPerSecond: number;
  huntTriggerSanity: number;
  startingSanity: number;
  medicineRestored: number;
  difficultyMultiplier: number;
}

// ============================================================================
// DIFFICULTY SETTINGS
// ============================================================================

export const DIFFICULTY_SETTINGS: Record<string, DifficultySettings> = {
  amateur: {
    name: 'Amateur',
    passiveDrainPerSecond: 0.5,
    huntTriggerSanity: 40,
    startingSanity: 100,
    medicineRestored: 100,
    difficultyMultiplier: 1.0,
  },
  intermediate: {
    name: 'Intermediate',
    passiveDrainPerSecond: 0.75,
    huntTriggerSanity: 40,
    startingSanity: 100,
    medicineRestored: 75,
    difficultyMultiplier: 1.5,
  },
  professional: {
    name: 'Professional',
    passiveDrainPerSecond: 1.0,
    huntTriggerSanity: 40,
    startingSanity: 100,
    medicineRestored: 50,
    difficultyMultiplier: 2.0,
  },
  nightmare: {
    name: 'Nightmare',
    passiveDrainPerSecond: 1.5,
    huntTriggerSanity: 40,
    startingSanity: 75,
    medicineRestored: 25,
    difficultyMultiplier: 2.5,
  },
  insanity: {
    name: 'Insanity',
    passiveDrainPerSecond: 2.0,
    huntTriggerSanity: 40,
    startingSanity: 50,
    medicineRestored: 25,
    difficultyMultiplier: 3.0,
  },
};

// ============================================================================
// SANITY DRAIN EVENTS
// ============================================================================

export const SANITY_DRAIN_EVENTS: SanityDrainEvent[] = [
  // Ghost Activity Events
  {
    event: 'Ghost Event (Minor)',
    description:
      'Ghost interacts with environment (door opens, lights flicker, etc.)',
    sanityDrain: 5,
    difficulty: 'All',
  },
  {
    event: 'Ghost Event (Major)',
    description: 'Ghost throws objects or creates significant disturbance',
    sanityDrain: 10,
    difficulty: 'All',
  },
  {
    event: 'Ghost Hunt Starts',
    description: 'Ghost begins hunt phase',
    sanityDrain: 10,
    difficulty: 'All',
  },
  {
    event: 'During Hunt',
    description: 'Sanity drains 2% per second while being chased by ghost',
    sanityDrain: 0, // Special case - handled per-second
    difficulty: 'All',
  },
  {
    event: 'Ghost Caught (Failure)',
    description: 'Player eliminated by ghost',
    sanityDrain: 100,
    difficulty: 'All',
  },

  // Visual Encounters
  {
    event: 'See Ghost Manifestation',
    description: 'Witness ghost physically manifest',
    sanityDrain: 15,
    difficulty: 'All',
  },
  {
    event: 'Witness Supernatural Phenomenon',
    description: 'See unexplainable phenomena (floating objects, etc.)',
    sanityDrain: 10,
    difficulty: 'All',
  },

  // Cursed Possession Events
  {
    event: 'Use Ouija Board (Yes/No)',
    description: 'Interact with Ouija board to ask questions',
    sanityDrain: 40,
    difficulty: 'All',
  },
  {
    event: 'Use Ouija Board (Maybe)',
    description: 'Ouija board gives unclear answer',
    sanityDrain: 20,
    difficulty: 'All',
  },
  {
    event: 'Use Ouija Board (Attack)',
    description: 'Ouija board responds with ghost attack',
    sanityDrain: 100,
    difficulty: 'All',
  },
  {
    event: 'Draw Tarot Card',
    description: 'Draw tarot card - random effect',
    sanityDrain: 0, // Variable
    difficulty: 'All',
  },
  {
    event: 'Tarot - The Sun',
    description: 'Lucky draw - restores sanity',
    sanityDrain: -100,
    difficulty: 'All',
  },
  {
    event: 'Tarot - The Moon',
    description: 'Unlucky draw - major sanity drain',
    sanityDrain: 100,
    difficulty: 'All',
  },
  {
    event: 'Music Box Active',
    description:
      'Nearby music box playing - drains 2.5% sanity per second in range',
    sanityDrain: 0, // Per-second
    difficulty: 'All',
  },
  {
    event: 'Haunted Mirror Use',
    description: 'Interact with haunted mirror',
    sanityDrain: 20,
    difficulty: 'All',
  },
  {
    event: 'Voodoo Doll (Normal Pin)',
    description: 'Insert pin into voodoo doll',
    sanityDrain: 5,
    difficulty: 'All',
  },
  {
    event: 'Voodoo Doll (Heart Pin)',
    description: 'Insert heart pin into voodoo doll',
    sanityDrain: 10,
    difficulty: 'All',
  },
  {
    event: 'Summoning Circle (Candle)',
    description: 'Light candle in summoning circle',
    sanityDrain: 16,
    difficulty: 'All',
  },
  {
    event: 'Monkey Paw (Wish)',
    description: 'Make wish with monkey paw',
    sanityDrain: 25,
    difficulty: 'All',
  },

  // Location-Specific
  {
    event: 'Witness Dead Body',
    description: 'Find player corpse or dead body evidence',
    sanityDrain: 25,
    difficulty: 'All',
  },
  {
    event: 'Ghostly Presence (Nearby)',
    description: 'Ghost is in same room but not hunting',
    sanityDrain: 2,
    difficulty: 'All',
  },

  // Equipment Effects
  {
    event: 'Firelight Active',
    description: 'Firelight burning reduces sanity drain by 20-40%',
    sanityDrain: 0, // Reduction effect
    difficulty: 'All',
  },
];

// ============================================================================
// SANITY THRESHOLDS & EFFECTS
// ============================================================================

export const SANITY_THRESHOLDS: SanityThreshold[] = [
  {
    threshold: 100,
    effect: 'Healthy - No effects',
    huntsAllowed: false,
    ghostActivity: 'Normal',
  },
  {
    threshold: 80,
    effect: 'Low sanity warning appears',
    huntsAllowed: false,
    ghostActivity: 'Ghost activity increases',
  },
  {
    threshold: 60,
    effect: 'Screen becomes slightly warped/distorted',
    huntsAllowed: false,
    ghostActivity: 'Increased ghost interactions',
  },
  {
    threshold: 40,
    effect:
      'Screen distortion increases, audio becomes ominous (ghost can hunt)',
    huntsAllowed: true,
    ghostActivity: 'High activity, hunt likely',
  },
  {
    threshold: 20,
    effect: 'Severe screen distortion, constant audio warnings',
    huntsAllowed: true,
    ghostActivity: 'Ghost very active, frequent hunts',
  },
  {
    threshold: 0,
    effect: 'Game over - ghost catches player automatically',
    huntsAllowed: true,
    ghostActivity: 'Guaranteed hunt',
  },
];

// ============================================================================
// GHOST-SPECIFIC SANITY MECHANICS
// ============================================================================

export interface GhostSanityMechanic {
  ghostName: string;
  description: string;
  specialEffect: string;
  sanityDrainModifier: number;
}

export const GHOST_SANITY_MECHANICS: Record<string, GhostSanityMechanic> = {
  wraith: {
    ghostName: 'Wraith',
    description: 'Wraith has unique sanity effect',
    specialEffect:
      'No sanity drain from footprints (Wraith leaves no UV evidence)',
    sanityDrainModifier: 0,
  },
  banshee: {
    ghostName: 'Banshee',
    description: 'Banshee targets one player',
    specialEffect: 'Targeted player experiences increased sanity drain (25%)',
    sanityDrainModifier: 1.25,
  },
  demon: {
    ghostName: 'Demon',
    description: 'Demon hunts more frequently',
    specialEffect:
      'Demon can hunt at 40% sanity (same as others) but hunts more often',
    sanityDrainModifier: 1.0,
  },
  yurei: {
    ghostName: 'Yurei',
    description: 'Yurei affects sanity heavily',
    specialEffect:
      'Seeing Yurei (D.O.T.S. evidence) drains 15% sanity (normally 10%)',
    sanityDrainModifier: 1.5,
  },
  onryo: {
    ghostName: 'Onryo',
    description: 'Onryo sanity effects tied to fire',
    specialEffect:
      'Using firelight counts as offense to Onryo - increases hunt chance',
    sanityDrainModifier: 0.5,
  },
  mimic: {
    ghostName: 'The Mimic',
    description: 'Mimics copy ghosts and their effects',
    specialEffect:
      'Sanity drain depends on which ghost the Mimic is imitating',
    sanityDrainModifier: 1.0,
  },
};

// ============================================================================
// SANITY PROTECTION & RESTORATION
// ============================================================================

export interface SanityProtection {
  name: string;
  type: 'equipment' | 'location' | 'action';
  effect: string;
  protectionAmount: string;
  duration: string;
  notes: string;
}

export const SANITY_PROTECTIONS: SanityProtection[] = [
  {
    name: 'Sanity Medication',
    type: 'equipment',
    effect: 'Restores sanity',
    protectionAmount: '100% (Amateur), 75% (Intermediate), 50% (Professional), 25% (Nightmare)',
    duration: 'Instant',
    notes: 'Consumable item - single use',
  },
  {
    name: 'Firelight',
    type: 'equipment',
    effect: 'Reduces passive sanity drain',
    protectionAmount: '20% (Tier I), 30% (Tier II), 40% (Tier III)',
    duration: 'While burning',
    notes: 'Requires igniter to light. Consumable.',
  },
  {
    name: 'Standing Near Team',
    type: 'action',
    effect: 'Reduces sanity drain',
    protectionAmount: '5% reduction per teammate nearby (max 20%)',
    duration: 'While together',
    notes: 'Team bonding mechanic - stay together',
  },
  {
    name: 'Outside Safe Zone',
    type: 'location',
    effect: 'Safe from ghost',
    protectionAmount: 'No sanity drain from ghost activity',
    duration: 'While outside haunted location',
    notes: 'Sanity still drains slowly passively',
  },
  {
    name: 'Truck (Safe)',
    type: 'location',
    effect: 'Complete safety',
    protectionAmount: 'No sanity drain (except passive)',
    duration: 'While in truck',
    notes: 'Passive drain still occurs at 0.5% per second',
  },
  {
    name: 'Incense (Active)',
    type: 'equipment',
    effect: 'Prevents hunts',
    protectionAmount: 'Blocks hunts for 60-120 seconds',
    duration: 'While lit',
    notes: 'Also blinds ghost during hunts. Consumable.',
  },
  {
    name: 'Crucifix (Nearby)',
    type: 'equipment',
    effect: 'Prevents hunt',
    protectionAmount: '3m radius (5m for Banshee)',
    duration: 'Until consumed by ghost hunt attempt',
    notes: 'Consumable - one use per crucifix',
  },
];

// ============================================================================
// SANITY DRAIN CALCULATION
// ============================================================================

export interface SanityCalculation {
  baseSanity: number;
  eventDrain: number;
  difficultyMultiplier: number;
  ghostModifier: number;
  protectionBonus: number;
  finalDrain: number;
}

/**
 * Calculate sanity drain for an event
 */
export function calculateSanityDrain(
  baseDrain: number,
  difficulty: string,
  ghostModifier: number = 1.0,
  protectionBonus: number = 0
): number {
  const difficultySettings = DIFFICULTY_SETTINGS[difficulty.toLowerCase()];
  if (!difficultySettings) return baseDrain;

  let drain =
    baseDrain * difficultySettings.difficultyMultiplier * ghostModifier;
  drain = Math.max(0, drain - protectionBonus);
  return Math.round(drain);
}

/**
 * Determine if ghost can hunt at current sanity level
 */
export function canGhostHunt(
  currentSanity: number,
  difficulty: string
): boolean {
  const settings = DIFFICULTY_SETTINGS[difficulty.toLowerCase()];
  if (!settings) return currentSanity <= 40;
  return currentSanity <= settings.huntTriggerSanity;
}

/**
 * Get sanity threshold level description
 */
export function getSanityStatus(sanity: number): {
  status: string;
  huntsAllowed: boolean;
  ghostActivity: string;
} {
  for (const threshold of SANITY_THRESHOLDS) {
    if (sanity >= threshold.threshold) {
      return {
        status: threshold.effect,
        huntsAllowed: threshold.huntsAllowed,
        ghostActivity: threshold.ghostActivity,
      };
    }
  }
  return {
    status: 'Critical - Ghost will hunt',
    huntsAllowed: true,
    ghostActivity: 'Guaranteed hunt imminent',
  };
}

/**
 * Calculate time until ghost hunt based on activity level
 */
export function estimateHuntTime(
  currentSanity: number,
  difficulty: string,
  ghostActivityLevel: string
): number {
  const settings = DIFFICULTY_SETTINGS[difficulty.toLowerCase()];
  if (!settings) return 0;

  const sanityToHunt = currentSanity - settings.huntTriggerSanity;
  if (sanityToHunt <= 0) return 0; // Can hunt now

  const drainPerSecond = settings.passiveDrainPerSecond;
  const activityMultiplier =
    ghostActivityLevel === 'High' ? 1.5 : ghostActivityLevel === 'Very High' ? 2.0 : 1.0;

  return Math.ceil(sanityToHunt / (drainPerSecond * activityMultiplier));
}

/**
 * Get all sanity drain events
 */
export function getAllSanityDrainEvents(): SanityDrainEvent[] {
  return SANITY_DRAIN_EVENTS;
}

/**
 * Get sanity drain events by difficulty
 */
export function getSanityDrainEventsByDifficulty(difficulty: string): SanityDrainEvent[] {
  return SANITY_DRAIN_EVENTS.filter(
    (event) => event.difficulty === 'All' || event.difficulty === difficulty
  );
}

/**
 * Get protection effectiveness
 */
export function getSanityProtections(): SanityProtection[] {
  return SANITY_PROTECTIONS;
}

/**
 * Get sanity statistics
 */
export function getSanityStatistics() {
  return {
    totalDrainEvents: SANITY_DRAIN_EVENTS.length,
    totalProtections: SANITY_PROTECTIONS.length,
    startingSanityByDifficulty: {
      amateur: DIFFICULTY_SETTINGS.amateur.startingSanity,
      intermediate: DIFFICULTY_SETTINGS.intermediate.startingSanity,
      professional: DIFFICULTY_SETTINGS.professional.startingSanity,
      nightmare: DIFFICULTY_SETTINGS.nightmare.startingSanity,
      insanity: DIFFICULTY_SETTINGS.insanity.startingSanity,
    },
    huntTriggerSanity: 40,
    ghostSpecificMechanics: Object.keys(GHOST_SANITY_MECHANICS).length,
  };
}
