/**
 * Phasmophobia Guide App - Type Definitions
 * All TypeScript interfaces for the app
 */

// ============================================================================
// EVIDENCE TYPES
// ============================================================================

export type EvidenceType = 
  | 'EMF Level 5'
  | 'D.O.T.S. Projector'
  | 'Ultraviolet'
  | 'Ghost Orb'
  | 'Ghost Writing'
  | 'Spirit Box'
  | 'Freezing Temperatures';

export interface Evidence {
  id: string;
  name: EvidenceType;
  description: string;
  howToFind: string;
  equipment: string[];
  visualIndicators: string[];
}

// ============================================================================
// GHOST TYPES
// ============================================================================

export interface GhostAbility {
  name: string;
  description: string;
  huntSanityThreshold?: number;
  effects: string[];
}

export interface GhostStrength {
  description: string;
  mechanicalAdvantage: string;
}

export interface GhostWeakness {
  description: string;
  counter: string;
  mechanicalAdvantage?: string;
}

export interface Ghost {
  id: string;
  name: string;
  description: string;
  evidence: EvidenceType[];
  abilities: GhostAbility[];
  strengths: GhostStrength[];
  weaknesses: GhostWeakness[];
  identificationTips: string[];
  huntSanityThreshold: number;
  movementSpeed: 'Slow' | 'Normal' | 'Fast' | 'Variable';
  activityLevel: 'Low' | 'Medium' | 'High' | 'Very High' | 'Variable';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  imageUrl?: string;
}

// ============================================================================
// EQUIPMENT TYPES
// ============================================================================

export type EquipmentCategory = 'starter' | 'optional' | 'truck' | 'cursed';
export type EquipmentType = 'camera' | 'audio' | 'detector' | 'consumable' | 'protective' | 'utility' | 'cursed';

export interface EquipmentTier {
  level: number;
  upgradeCost: number;
}

export interface Equipment {
  id: string;
  name: string;
  category: EquipmentCategory;
  type: EquipmentType;
  cost: number;
  capacity: number;
  description: string;
  usage: string;
  unlocksAtLevel: number;
  tiers: EquipmentTier[];
  detects?: EvidenceType[];
  consumable: boolean;
  recommendedFor: string[];
}

// ============================================================================
// MAP TYPES
// ============================================================================

export type MapSize = 'small' | 'medium' | 'large';

export interface MapCharacteristics {
  lighting: string;
  ghostSpawns: string;
  hazards: string[];
  specialFeatures: string[];
  fuse: boolean;
  breaker: boolean;
}

export interface Map {
  id: string;
  name: string;
  type: string;
  size: MapSize;
  unlocksAtLevel: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  maxRooms: number;
  maxPlayers: number;
  characteristics: MapCharacteristics;
  description: string;
  strategies: string[];
  tips: string[];
  bestFor: string[];
  imageUrl?: string;
  floorPlanUrl?: string;
}

// ============================================================================
// SANITY TYPES
// ============================================================================

export interface SanityDrainRate {
  difficulty: 'Amateur' | 'Intermediate' | 'Professional' | 'Nightmare' | 'Insanity';
  lightsOn: number;
  lightsOff: number;
  soloMultiplier: number;
  bloodMoonMultiplier: number;
}

export interface SanityEffect {
  sanityThreshold: number;
  description: string;
  effects: string[];
  ghostBehavior: string;
}

export interface SanityMechanic {
  name: string;
  description: string;
  sanityImpact: number | string;
  duration?: string;
  conditions?: string[];
}

// ============================================================================
// USER DATA TYPES
// ============================================================================

export interface UserProgress {
  favoriteGhosts: string[];
  favoriteEquipment: string[];
  favoriteMaps: string[];
  lastVisitedSection: string;
  lastUpdated: number;
}

export interface EvidenceSelection {
  evidence: EvidenceType[];
  excludedGhosts: string[];
  possibleGhosts: string[];
}

// ============================================================================
// APP STATE TYPES
// ============================================================================

export interface AppState {
  ghosts: Ghost[];
  equipment: Equipment[];
  maps: Map[];
  evidence: Evidence[];
  sanityMechanics: SanityMechanic[];
  userProgress: UserProgress;
  lastDataUpdate: number;
}
