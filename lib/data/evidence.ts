/**
 * Evidence Database
 * All 7 evidence types with detection methods, equipment, and related ghosts
 * Complete identification guide
 */

import { EvidenceType } from '@/lib/types';

// ============================================================================
// EVIDENCE TYPES DEFINITION
// ============================================================================

export interface Evidence {
  id: EvidenceType;
  name: string;
  description: string;
  howToDetect: string[];
  equipment: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Very Rare';
  ghostsWithEvidence: string[];
  tips: string[];
  commonMistakes: string[];
  sanityDrain?: number;
}

// ============================================================================
// EVIDENCE MASTER DATABASE
// ============================================================================

export const EVIDENCE_DATA: Record<EvidenceType, Evidence> = {
  'EMF Level 5': {
    id: 'EMF Level 5',
    name: 'EMF Level 5',
    description:
      'Electromagnetic Field activity detected at maximum level (5). Indicates ghost interaction with physical objects.',
    howToDetect: [
      'Hold EMF Reader in hand',
      'Watch for spikes as ghost interacts with objects',
      'Spikes reach level 5 (highest level)',
      'Up to 5 spikes appear on reading',
      'Each spike represents a ghost interaction',
    ],
    equipment: ['emf-reader'],
    difficulty: 'Easy',
    rarity: 'Common',
    ghostsWithEvidence: [
      'Spirit',
      'Wraith',
      'Jinn',
      'Shade',
      'Oni',
      'Myling',
      'Onryo',
      'Raiju',
      'Obake',
      'Mare',
    ],
    tips: [
      'EMF is one of easiest evidence to detect',
      'Ghost must be triggered/active to register',
      'Hold EMF while ghost is hunting or interacting',
      'Best detected during ghost events',
      'Multiple spikes confirm EMF Level 5',
      'Reliable for about 50% of ghosts',
      'No sanity drain from detection',
    ],
    commonMistakes: [
      'Assuming low spikes mean negative EMF',
      'Not holding it actively while ghost hunts',
      'Confusing EMF level 3-4 with level 5',
      'Leaving EMF in truck instead of taking to location',
      'Thinking one spike is enough (need up to 5)',
    ],
  },

  'D.O.T.S. Projector': {
    id: 'D.O.T.S. Projector',
    name: 'D.O.T.S. Projector',
    description:
      'Ghost visible as silhouette walking through projected infrared dots. Indicates physical manifestation.',
    howToDetect: [
      'Place D.O.T.S. Projector in ghost room',
      'Watch for silhouette walking through dots',
      'Silhouette appears when ghost manifests',
      'Can be viewed directly or on video camera',
      'Ghost must be close to D.O.T.S. Projector',
    ],
    equipment: ['dots-projector', 'video-camera'],
    difficulty: 'Easy',
    rarity: 'Common',
    ghostsWithEvidence: [
      'Wraith',
      'Phantom',
      'Banshee',
      'Yurei',
      'Oni',
      'Yokai',
      'Myling',
      'Obake',
      'Hantu',
      'Thaye',
    ],
    tips: [
      'D.O.T.S. is best evidence to see visually',
      'Place in room where ghost activity happens',
      'Watch through video camera from truck safety',
      'Use tripod to mount camera on D.O.T.S. for perfect angle',
      'Silhouette very clear when visible',
      'Ghost must be actively moving through dots',
      'Better than EMF for visual confirmation',
    ],
    commonMistakes: [
      'Placing D.O.T.S. in wrong room',
      'Not having video camera to see it clearly',
      'Assuming any dot disturbance means ghost (could be dust)',
      'Forgetting ghost must be close to D.O.T.S.',
      'Placing it too high or in bad angle',
    ],
  },

  Ultraviolet: {
    id: 'Ultraviolet',
    name: 'Ultraviolet',
    description:
      'Ghost fingerprints and footprints visible under UV light. Shows physical contact traces.',
    howToDetect: [
      'Hold UV Light and shine on surfaces',
      'Look for glowing fingerprints on objects',
      'Check doorknobs, walls, windows',
      'Place salt piles on ground for footprints',
      'Ghost will walk through salt leaving UV-visible tracks',
    ],
    equipment: ['uv-light', 'salt'],
    difficulty: 'Medium',
    rarity: 'Common',
    ghostsWithEvidence: [
      'Phantom',
      'Poltergeist',
      'Banshee',
      'Jinn',
      'Demon',
      'Goryo',
      'Myling',
      'Onryo',
      'Mare',
      'Moroi',
    ],
    tips: [
      'Shine UV on high-touch areas: doorknobs, light switches',
      'Check walls near ghost activity spots',
      'Use salt strategically in hallways',
      'Footprints in salt are very clear evidence',
      'Multiple fingerprints = high activity',
      'Works best in darker areas',
      'Take photos of UV evidence for money',
    ],
    commonMistakes: [
      'Wraiths don\'t leave fingerprints - easy mistake',
      'Not checking all doorknobs and switches',
      'Forgetting to place salt lines',
      'Using UV in wrong rooms',
      'Not waiting long enough for ghost to interact',
      'Confusing dust reflections with fingerprints',
    ],
  },

  'Ghost Writing': {
    id: 'Ghost Writing',
    name: 'Ghost Writing',
    description: 'Ghost writes messages in notebook. Direct communication evidence.',
    howToDetect: [
      'Place Ghost Writing Book on ground in ghost room',
      'Wait for ghost to interact with it',
      'Text appears in book when ghost writes',
      'Can check book anytime to see if written',
      'Works when ghost is active',
    ],
    equipment: ['ghost-writing-book'],
    difficulty: 'Easy',
    rarity: 'Common',
    ghostsWithEvidence: [
      'Spirit',
      'Poltergeist',
      'Mare',
      'Revenant',
      'Shade',
      'Demon',
      'Onryo',
      'Deogen',
      'Hantu',
      'Thaye',
    ],
    tips: [
      'Ghost Writing is passive - place and wait',
      'Place in room where ghost spawns',
      'No interaction needed from players',
      'Ghost will write when it manifests',
      'Check regularly during contract',
      'Very reliable evidence type',
      'Works even when no one is near it',
    ],
    commonMistakes: [
      'Placing writing book in wrong room',
      'Not checking book frequently enough',
      'Assuming no writing = ghost without this evidence',
      'Forgetting to pick up book to check it',
      'Leaving book outside ghost spawning room',
    ],
  },

  'Spirit Box': {
    id: 'Spirit Box',
    name: 'Spirit Box',
    description:
      'Ghost responds to questions through radio frequencies. Audio evidence of communication.',
    howToDetect: [
      'Hold Spirit Box and ask questions',
      'Ghost must be triggered first',
      'Listen for paranormal responses through static',
      'Responses come in disembodied voices',
      'Ghost must be near for responses',
    ],
    equipment: ['spirit-box'],
    difficulty: 'Medium',
    rarity: 'Common',
    ghostsWithEvidence: [
      'Spirit',
      'Wraith',
      'Phantom',
      'Poltergeist',
      'Mare',
      'Yokai',
      'The Twins',
      'Raiju',
      'Moroi',
      'Deogen',
      'Hantu',
    ],
    tips: [
      'Spirit Box requires ghost to be active',
      'Ask clear questions: "Are you here?", "What is your name?"',
      'Listen carefully through white noise',
      'Ghost closer = better responses',
      'Responses are usually one word answers',
      'Use with parabolic microphone for audio recording',
      'Multiple responses = confirmation',
    ],
    commonMistakes: [
      'Using Spirit Box before triggering ghost',
      'Not listening carefully to responses',
      'Expecting full sentences (usually single words)',
      'Ghost too far away to respond',
      'Background noise making responses hard to hear',
      'Confusing equipment malfunction with responses',
    ],
  },

  'Freezing Temperatures': {
    id: 'Freezing Temperatures',
    name: 'Freezing Temperatures',
    description:
      'Ghost activity causes temperature drop below 0°C (32°F). Cold spot evidence.',
    howToDetect: [
      'Hold Thermometer and check temperature',
      'Room temperature drops below 0°C (32°F)',
      'Stays in cold zone when ghost active',
      'Can identify cold spots in location',
      'Temperature rises when ghost less active',
    ],
    equipment: ['thermometer'],
    difficulty: 'Easy',
    rarity: 'Common',
    ghostsWithEvidence: [
      'Jinn',
      'Revenant',
      'Shade',
      'Demon',
      'Yurei',
      'Oni',
      'Goryo',
      'The Twins',
      'Raiju',
      'Moroi',
      'Deogen',
    ],
    tips: [
      'Thermometer takes time to register - be patient',
      'Below 0°C = Freezing Temperatures evidence',
      'Hantu is unique - prefers cold rooms',
      'Move through rooms with thermometer',
      'Fastest temperature drop = likely ghost location',
      'Very reliable evidence',
      'Works even without ghost activity in some cases',
    ],
    commonMistakes: [
      'Confusing room baseline with freezing temps',
      'Not checking thermometer frequently',
      'Assuming all cold spots are evidence',
      'Not waiting for temperature to stabilize',
      'Using thermometer incorrectly',
    ],
  },

  'Ghost Orb': {
    id: 'Ghost Orb',
    name: 'Ghost Orb',
    description:
      'Floating orb visible on video camera only. Ghost manifestation evidence.',
    howToDetect: [
      'Place Video Camera on tripod in ghost room',
      'Monitor truck screen to watch feed',
      'Watch for glowing spheres (orbs)',
      'Orbs appear as white/blue floating balls',
      'Only visible on video feed, not with naked eye',
    ],
    equipment: ['video-camera', 'head-gear', 'tripod'],
    difficulty: 'Medium',
    rarity: 'Uncommon',
    ghostsWithEvidence: [
      'Banshee',
      'Mare',
      'Revenant',
      'Yurei',
      'Yokai',
      'Goryo',
      'The Twins',
      'Obake',
      'Thaye',
    ],
    tips: [
      'Ghost Orb only visible on camera - not with eyes',
      'Use video camera from truck for safety',
      'Place camera on tripod for best angle',
      'Monitor multiple cameras if possible',
      'Orbs are distinctive - easy to spot on video',
      'Hantu orbs have distinctive movement pattern',
      'One clear orb = definite Ghost Orb evidence',
    ],
    commonMistakes: [
      'Looking for orbs with naked eye (impossible)',
      'Not placing camera in ghost room',
      'Confusing dust or reflections with orbs',
      'Not watching truck monitor closely',
      'Thinking camera must be on all time',
      'Placing camera in wrong position',
    ],
  },
};

// ============================================================================
// EVIDENCE LOOKUP & UTILITY FUNCTIONS
// ============================================================================

export const EVIDENCE_LIST = Object.values(EVIDENCE_DATA);

export const EVIDENCE_BY_NAME: Record<string, Evidence> = EVIDENCE_LIST.reduce(
  (acc, evidence) => {
    acc[evidence.name] = evidence;
    return acc;
  },
  {} as Record<string, Evidence>
);

/**
 * Get evidence by ID or name
 */
export function getEvidenceById(id: EvidenceType): Evidence | undefined {
  return EVIDENCE_DATA[id];
}

export function getEvidenceByName(name: string): Evidence | undefined {
  return EVIDENCE_BY_NAME[name];
}

/**
 * Get all ghosts that produce specific evidence
 */
export function getGhostsByEvidence(evidenceType: EvidenceType): string[] {
  const evidence = getEvidenceById(evidenceType);
  return evidence?.ghostsWithEvidence || [];
}

/**
 * Get all evidence for a specific ghost
 */
export function getEvidenceByGhost(ghostId: string): Evidence[] {
  return EVIDENCE_LIST.filter((evidence) =>
    evidence.ghostsWithEvidence.some((g) =>
      g.toLowerCase().includes(ghostId.toLowerCase())
    )
  );
}

/**
 * Get evidence by difficulty level
 */
export function getEvidenceByDifficulty(
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert'
): Evidence[] {
  return EVIDENCE_LIST.filter((e) => e.difficulty === difficulty);
}

/**
 * Get equipment needed for specific evidence
 */
export function getEquipmentForEvidence(evidenceType: EvidenceType): string[] {
  const evidence = getEvidenceById(evidenceType);
  return evidence?.equipment || [];
}

/**
 * Get all equipment combinations needed for multiple evidence types
 */
export function getEquipmentForMultipleEvidence(
  evidenceTypes: EvidenceType[]
): string[] {
  const equipmentSet = new Set<string>();
  evidenceTypes.forEach((type) => {
    const equipment = getEquipmentForEvidence(type);
    equipment.forEach((eq) => equipmentSet.add(eq));
  });
  return Array.from(equipmentSet);
}

/**
 * Identify possible ghosts from collected evidence
 * Returns ghosts that match ALL provided evidence
 */
export function identifyGhostsByEvidence(
  collectedEvidence: EvidenceType[]
): string[] {
  if (collectedEvidence.length === 0) return [];

  // Get ghosts for first evidence
  const firstEvidenceGhosts = getGhostsByEvidence(collectedEvidence[0]);

  // Filter to only ghosts that have ALL collected evidence
  return firstEvidenceGhosts.filter((ghost) => {
    return collectedEvidence.every((evidence) => {
      const ghostsWithEvidence = getGhostsByEvidence(evidence);
      return ghostsWithEvidence.some((g) =>
        g.toLowerCase() === ghost.toLowerCase()
      );
    });
  });
}

/**
 * Get evidence detection difficulty summary
 */
export function getEvidenceDetectionSummary(): {
  easy: Evidence[];
  medium: Evidence[];
  hard: Evidence[];
  expert: Evidence[];
} {
  return {
    easy: getEvidenceByDifficulty('Easy'),
    medium: getEvidenceByDifficulty('Medium'),
    hard: getEvidenceByDifficulty('Hard'),
    expert: getEvidenceByDifficulty('Expert'),
  };
}

/**
 * Get evidence statistics
 */
export function getEvidenceStatistics() {
  return {
    totalEvidenceTypes: EVIDENCE_LIST.length,
    byDifficulty: {
      easy: EVIDENCE_LIST.filter((e) => e.difficulty === 'Easy').length,
      medium: EVIDENCE_LIST.filter((e) => e.difficulty === 'Medium').length,
      hard: EVIDENCE_LIST.filter((e) => e.difficulty === 'Hard').length,
      expert: EVIDENCE_LIST.filter((e) => e.difficulty === 'Expert').length,
    },
    byRarity: {
      common: EVIDENCE_LIST.filter((e) => e.rarity === 'Common').length,
      uncommon: EVIDENCE_LIST.filter((e) => e.rarity === 'Uncommon').length,
      rare: EVIDENCE_LIST.filter((e) => e.rarity === 'Rare').length,
      veryRare: EVIDENCE_LIST.filter((e) => e.rarity === 'Very Rare').length,
    },
    mostCommon: EVIDENCE_LIST.filter((e) => e.rarity === 'Common').map(
      (e) => e.name
    ),
    leastCommon: EVIDENCE_LIST.filter((e) => e.rarity === 'Very Rare').map(
      (e) => e.name
    ),
  };
}

/**
 * Check if ghost is possible with evidence (for filter)
 */
export function canGhostHaveEvidence(
  ghostId: string,
  evidenceType: EvidenceType
): boolean {
  const ghostsWithEvidence = getGhostsByEvidence(evidenceType);
  return ghostsWithEvidence.some((g) =>
    g.toLowerCase().includes(ghostId.toLowerCase())
  );
}

/**
 * Get all unique equipment needed across all evidence types
 */
export function getAllEvidenceEquipment(): string[] {
  const equipmentSet = new Set<string>();
  EVIDENCE_LIST.forEach((evidence) => {
    evidence.equipment.forEach((eq) => equipmentSet.add(eq));
  });
  return Array.from(equipmentSet);
}
