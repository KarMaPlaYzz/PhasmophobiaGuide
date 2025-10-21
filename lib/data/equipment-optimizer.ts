/**
 * Equipment Optimizer Data
 * Playstyle profiles, base equipment recommendations, and cost-effectiveness data
 */

import { Playstyle, PlaystyleProfile } from '@/lib/types';

// ============================================================================
// PLAYSTYLE PROFILES
// ============================================================================

export const PLAYSTYLE_PROFILES: Record<Playstyle, PlaystyleProfile> = {
  aggressive: {
    id: 'aggressive',
    name: 'Aggressive Hunter',
    description: 'Fast evidence gathering with minimal prep. High risk, high reward.',
    emoji: '⚡',
    budgetAllocation: {
      detection: 0.75,
      safety: 0.15,
      utility: 0.1,
    },
    priorityEquipment: [
      'emf-reader',
      'spirit-box',
      'ghost-writing-book',
      'uv-light',
      'video-camera',
      'dots-projector',
    ],
    avoidEquipment: [
      'crucifix', // Takes up space, not needed with this playstyle
      'incense', // Slows down gameplay
    ],
    recommendedForGhosts: [
      'spirit',
      'wraith',
      'phantom',
      'poltergeist',
      'banshee',
    ],
  },

  defensive: {
    id: 'defensive',
    name: 'Defensive Hunter',
    description: 'Focused on hunt survival and protection. Safety-first approach.',
    emoji: '🛡️',
    budgetAllocation: {
      detection: 0.35,
      safety: 0.55,
      utility: 0.1,
    },
    priorityEquipment: [
      'emf-reader',
      'spirit-box',
      'ghost-writing-book',
      'crucifix',
      'sanity-medication',
      'smudge-sticks',
    ],
    avoidEquipment: [
      'cursed-possessions', // Too risky
    ],
    recommendedForGhosts: [
      'demon',
      'shade',
      'revenants',
      'oni',
      'yokai',
    ],
  },

  balanced: {
    id: 'balanced',
    name: 'Balanced Hunter',
    description: 'Equal emphasis on evidence and survival. Versatile approach.',
    emoji: '⚖️',
    budgetAllocation: {
      detection: 0.55,
      safety: 0.35,
      utility: 0.1,
    },
    priorityEquipment: [
      'emf-reader',
      'spirit-box',
      'ghost-writing-book',
      'uv-light',
      'video-camera',
      'dots-projector',
      'crucifix',
      'sanity-medication',
    ],
    avoidEquipment: [],
    recommendedForGhosts: ['all'],
  },

  solo: {
    id: 'solo',
    name: 'Solo Hunter',
    description: 'Remote monitoring from truck. Minimize field risk.',
    emoji: '🚐',
    budgetAllocation: {
      detection: 0.4,
      safety: 0.2,
      utility: 0.4, // Cameras and monitoring equipment
    },
    priorityEquipment: [
      'video-camera',
      'head-mounted-camera',
      'motion-sensor',
      'temperature-sensor',
      'sound-recorder',
    ],
    avoidEquipment: ['smudge-sticks', 'salt'],
    recommendedForGhosts: [
      'wraith',
      'phantom',
      'mare',
    ],
  },

  team: {
    id: 'team',
    name: 'Team Coordinator',
    description: 'Coordinating specialized roles across team. Equipment sharing.',
    emoji: '👥',
    budgetAllocation: {
      detection: 0.5,
      safety: 0.35,
      utility: 0.15,
    },
    priorityEquipment: [
      'emf-reader',
      'spirit-box',
      'ghost-writing-book',
      'uv-light',
      'video-camera',
      'dots-projector',
      'crucifix',
      'sanity-medication',
      'thermometer',
      'parabolic-microphone',
    ],
    avoidEquipment: [],
    recommendedForGhosts: ['all'],
  },
};

// ============================================================================
// BASE EQUIPMENT FOR ALL PLAYSTYLES
// ============================================================================
// Equipment that should be in most loadouts for evidence coverage

export const BASE_EQUIPMENT = {
  essential: [
    'emf-reader',
    'spirit-box',
    'ghost-writing-book',
    'uv-light',
    'video-camera',
    'dots-projector',
  ],
  cost: 335, // Approximate total
};

// ============================================================================
// EQUIPMENT TIERS AND COSTS
// ============================================================================

export const EQUIPMENT_COSTS: Record<string, number> = {
  // Detection Equipment
  'emf-reader': 45,
  'spirit-box': 50,
  'ghost-writing-book': 40,
  'uv-light': 35,
  'video-camera': 50,
  'dots-projector': 65,
  'thermometer': 30,
  'parabolic-microphone': 45,
  'sound-recorder': 50,
  'motion-sensor': 40,
  'temperature-sensor': 35,
  'head-mounted-camera': 60,

  // Safety Equipment
  'crucifix': 30,
  'sanity-medication': 20,
  'smudge-sticks': 35,
  'incense': 30,
  'salt': 15,

  // Truck Equipment
  'photo-camera': 40,
  'tripod': 25,
};

// ============================================================================
// EVIDENCE DETECTION MAPPING
// ============================================================================

export const EQUIPMENT_EVIDENCE_MAP: Record<string, string[]> = {
  'emf-reader': ['EMF Level 5'],
  'spirit-box': ['Spirit Box'],
  'ghost-writing-book': ['Ghost Writing'],
  'uv-light': ['Ultraviolet'],
  'video-camera': ['Ghost Orb', 'D.O.T.S. Projector'],
  'dots-projector': ['D.O.T.S. Projector'],
  'thermometer': ['Freezing Temperatures'],
  'parabolic-microphone': ['Spirit Box'],
};

// ============================================================================
// GHOST-SPECIFIC RECOMMENDATIONS
// ============================================================================

export const GHOST_RECOMMENDATIONS: Record<string, {
  mustHave: string[];
  recommended: string[];
  optional: string[];
  effectiveness: number; // 0-100
  reasoning: string[];
}> = {
  spirit: {
    mustHave: ['emf-reader', 'spirit-box', 'ghost-writing-book'],
    recommended: ['uv-light', 'video-camera', 'dots-projector', 'crucifix'],
    optional: ['thermometer', 'sanity-medication'],
    effectiveness: 95,
    reasoning: [
      'Covers all evidence types',
      'Active ghost - EMF crucial',
      'Communication possible',
      'Writing evidence reliable',
    ],
  },
  wraith: {
    mustHave: ['emf-reader', 'ghost-writing-book', 'uv-light'],
    recommended: ['spirit-box', 'video-camera', 'thermometer'],
    optional: ['dots-projector', 'crucifix'],
    effectiveness: 88,
    reasoning: [
      'No freezing temperatures',
      'Flying ability requires quick EMF',
      'UV detects fingerprints well',
      'Prefers to avoid salt',
    ],
  },
  phantom: {
    mustHave: ['ghost-writing-book', 'uv-light', 'video-camera'],
    recommended: ['emf-reader', 'spirit-box', 'thermometer'],
    optional: ['dots-projector', 'sanity-medication'],
    effectiveness: 92,
    reasoning: [
      'Cannot be photographed',
      'Ghost writing reliable',
      'UV fingerprints detection',
      'Can weaken hunters',
    ],
  },
  poltergeist: {
    mustHave: ['emf-reader', 'spirit-box', 'ghost-writing-book'],
    recommended: ['video-camera', 'uv-light', 'sanity-medication'],
    optional: ['dots-projector', 'thermometer'],
    effectiveness: 90,
    reasoning: [
      'Very active - EMF spikes frequent',
      'Communication reliable',
      'Throws objects constantly',
      'Requires sanity management',
    ],
  },
  banshee: {
    mustHave: ['emf-reader', 'parabolic-microphone', 'ghost-writing-book'],
    recommended: ['video-camera', 'sound-recorder', 'dots-projector'],
    optional: ['thermometer', 'crucifix'],
    effectiveness: 85,
    reasoning: [
      'Parabolic mic detects screams',
      'Targets single player',
      'Low activity elsewhere',
      'Cruise control is key',
    ],
  },
  jinn: {
    mustHave: ['emf-reader', 'thermometer', 'ghost-writing-book'],
    recommended: ['uv-light', 'video-camera', 'spirit-box'],
    optional: ['motion-sensor', 'sanity-medication'],
    effectiveness: 87,
    reasoning: [
      'Freezing temperature common',
      'High activity level',
      'Electrical interference',
      'Crucifix ineffective',
    ],
  },
  mare: {
    mustHave: ['spirit-box', 'ghost-writing-book', 'video-camera'],
    recommended: ['emf-reader', 'thermometer', 'sanity-medication'],
    optional: ['parabolic-microphone', 'dots-projector'],
    effectiveness: 84,
    reasoning: [
      'Prefers darkness',
      'Less active with lights on',
      'Sanity drain important',
      'Crucifix helps significantly',
    ],
  },
  revenant: {
    mustHave: ['thermometer', 'ghost-writing-book', 'video-camera'],
    recommended: ['emf-reader', 'spirit-box', 'crucifix', 'smudge-sticks'],
    optional: ['sanity-medication', 'parabolic-microphone'],
    effectiveness: 86,
    reasoning: [
      'Fast when hunting',
      'Freezing temperatures reliable',
      'Low activity when away',
      'Requires multiple precautions',
    ],
  },
  shade: {
    mustHave: ['emf-reader', 'thermometer', 'ghost-writing-book'],
    recommended: ['crucifix', 'smudge-sticks', 'sanity-medication'],
    optional: ['spirit-box', 'video-camera'],
    effectiveness: 83,
    reasoning: [
      'Shy - less active with people',
      'Hides from groups',
      'Freezing temperatures likely',
      'Protection equipment crucial',
    ],
  },
  demon: {
    mustHave: ['thermometer', 'ghost-writing-book', 'crucifix', 'smudge-sticks'],
    recommended: ['sanity-medication', 'emf-reader', 'prayer-candle'],
    optional: ['spirit-box', 'video-camera'],
    effectiveness: 82,
    reasoning: [
      'Most dangerous ghost',
      'Freezing temperatures reliable',
      'Crucifix essential',
      'Religious items help',
    ],
  },
  oni: {
    mustHave: ['emf-reader', 'thermometer', 'video-camera'],
    recommended: ['ghost-writing-book', 'sanity-medication', 'crucifix'],
    optional: ['spirit-box', 'parabolic-microphone'],
    effectiveness: 88,
    reasoning: [
      'Very active - constant EMF',
      'Visible manifestations',
      'Freezing temperatures present',
      'Multiple crises possible',
    ],
  },
  yokai: {
    mustHave: ['ghost-writing-book', 'parabolic-microphone', 'video-camera'],
    recommended: ['emf-reader', 'thermometer', 'sanity-medication'],
    optional: ['spirit-box', 'dots-projector'],
    effectiveness: 84,
    reasoning: [
      'Affected by noise levels',
      'Parabolic mic crucial',
      'Less active in groups',
      'Freezing temperatures present',
    ],
  },
};

// ============================================================================
// DIFFICULTY SCALING
// ============================================================================

export const DIFFICULTY_RECOMMENDATIONS = {
  Beginner: {
    budgetMin: 250,
    budgetSuggested: 500,
    budgetMax: 1000,
    essentialEquipment: 6,
    safetyFocus: true,
  },
  Intermediate: {
    budgetMin: 400,
    budgetSuggested: 800,
    budgetMax: 1500,
    essentialEquipment: 8,
    safetyFocus: true,
  },
  Advanced: {
    budgetMin: 600,
    budgetSuggested: 1200,
    budgetMax: 2500,
    essentialEquipment: 10,
    safetyFocus: false,
  },
  Expert: {
    budgetMin: 800,
    budgetSuggested: 2000,
    budgetMax: 5000,
    essentialEquipment: 12,
    safetyFocus: false,
  },
};

// ============================================================================
// MAP SIZE CONSIDERATIONS
// ============================================================================

export const MAP_SIZE_EQUIPMENT: Record<string, string[]> = {
  small: [
    'emf-reader',
    'spirit-box',
    'ghost-writing-book',
    'uv-light',
    'video-camera',
  ],
  medium: [
    'emf-reader',
    'spirit-box',
    'ghost-writing-book',
    'uv-light',
    'video-camera',
    'dots-projector',
    'thermometer',
  ],
  large: [
    'emf-reader',
    'spirit-box',
    'ghost-writing-book',
    'uv-light',
    'video-camera',
    'dots-projector',
    'thermometer',
    'parabolic-microphone',
    'motion-sensor',
  ],
};

// ============================================================================
// LOADOUT NAMING
// ============================================================================

export const LOADOUT_NAMES: Record<Playstyle, Record<string, string>> = {
  aggressive: {
    spirit: 'Spirit Speedrunner',
    wraith: 'Wraith Chaser',
    phantom: 'Phantom Stalker',
    poltergeist: 'Poltergeist Blitzer',
    default: 'Aggressive Tracker',
  },
  defensive: {
    demon: 'Demon Slayer',
    shade: 'Shade Guardian',
    revenant: 'Revenant Tank',
    default: 'Defensive Guardian',
  },
  balanced: {
    spirit: 'Spirit Hunter',
    default: 'Jack of All Trades',
  },
  solo: {
    spirit: 'Solo Spirit Watch',
    mare: 'Solo Night Watcher',
    default: 'Truck Commander',
  },
  team: {
    demon: 'Team Demon Slayer',
    spirit: 'Team Spirit Assassin',
    default: 'Squad Leader',
  },
};
