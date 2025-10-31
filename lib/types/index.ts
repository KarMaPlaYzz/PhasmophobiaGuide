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

export interface GhostCounterStrategy {
  strategy: string;
  effectiveness: 'High' | 'Medium' | 'Low';
  tips: string[];
}

export interface GhostRecommendedEquipment {
  essential: string[]; // Must-have equipment
  recommended: string[]; // Should bring
  optional: string[]; // Nice to have
  avoid: string[]; // Don't use against this ghost
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
  counterStrategies: GhostCounterStrategy[];
  recommendedEquipment: GhostRecommendedEquipment;
  huntSanityThreshold: number;
  movementSpeed: 'Slow' | 'Normal' | 'Fast' | 'Variable';
  activityLevel: 'Low' | 'Medium' | 'High' | 'Very High' | 'Variable';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  // Hunting speeds in m/s (meters per second)
  huntSpeed?: number; // Base hunting speed
  huntSpeedLoS?: number; // Line of sight variant (some ghosts have +65%)
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
  imageUrl?: string;
}

// ============================================================================
// MAP TYPES
// ============================================================================

export type MapSize = 'small' | 'medium' | 'large';

export interface MapZone {
  name: string;
  description: string;
  huntTactics: string[];
  equipment: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

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
  zones?: MapZone[];
  huntStrategy?: string;
  soloTips?: string[];
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

export type Playstyle = 'aggressive' | 'defensive' | 'balanced' | 'solo' | 'team';

export interface PlaystyleProfile {
  id: Playstyle;
  name: string;
  description: string;
  emoji: string;
  budgetAllocation: {
    detection: number;
    safety: number;
    utility: number;
  };
  priorityEquipment: string[];
  avoidEquipment: string[];
  recommendedForGhosts: string[];
}

export interface LoadoutRecommendation {
  id: string;
  name: string;
  description: string;
  playstyle: Playstyle;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  mapSize?: MapSize;
  ghostType?: string;
  essential: string[];
  recommended: string[];
  optional: string[];
  totalCost: number;
  maxBudget: number;
  efficiency: number; // 0-100
  explanation: string[];
  gaps: string[];
  ghostMatchup: {
    ghostId: string;
    ghostName: string;
    effectiveness: number; // 0-100
    reason: string;
  }[];
  savedAt?: number;
  tags: string[];
}

export interface UserProgress {
  favoriteGhosts: string[];
  favoriteEquipment: string[];
  favoriteMaps: string[];
  lastVisitedSection: string;
  lastUpdated: number;
  savedLoadouts?: LoadoutRecommendation[];
}

export interface EvidenceSelection {
  evidence: EvidenceType[];
  excludedGhosts: string[];
  possibleGhosts: string[];
}

// ============================================================================
// BOOKMARKS & HISTORY TYPES
// ============================================================================

export interface Bookmark {
  id: string;
  type: 'ghost' | 'equipment' | 'map' | 'evidence';
  itemId: string;
  itemName: string;
  createdAt: number;
  tags: string[];
  // Premium features
  note?: string; // User's personal note
  collectionId?: string; // Collection it belongs to
  color?: string; // Custom color tag
  isPinned?: boolean; // Pin to top
}

export interface BookmarkCollection {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon?: string;
  bookmarkIds: string[];
  createdAt: number;
  updatedAt: number;
}

export interface HistoryItem {
  id: string;
  type: 'ghost' | 'equipment' | 'map' | 'evidence';
  itemId: string;
  itemName: string;
  viewedAt: number;
  timeSpent: number; // in milliseconds
}

export interface CustomCategory {
  id: string;
  name: string;
  color: string;
  bookmarkIds: string[];
}

export interface UserLibrary {
  bookmarks: Bookmark[];
  history: HistoryItem[];
  customCategories: CustomCategory[];
  // Premium features
  bookmarkCollections?: BookmarkCollection[];
  lastUpdated: number;
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
