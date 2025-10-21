/**
 * Equipment Optimizer Algorithm
 * Generates optimal loadouts based on budget, ghost type, playstyle, and map size
 */

import {
    BASE_EQUIPMENT,
    DIFFICULTY_RECOMMENDATIONS,
    EQUIPMENT_COSTS,
    EQUIPMENT_EVIDENCE_MAP,
    GHOST_RECOMMENDATIONS,
    LOADOUT_NAMES,
    PLAYSTYLE_PROFILES
} from '@/lib/data/equipment-optimizer';
import { GHOSTS } from '@/lib/data/ghosts';
import { Ghost, LoadoutRecommendation, Playstyle } from '@/lib/types';

/**
 * Generate an optimal equipment loadout based on filters
 */
export function generateOptimalLoadout(
  budget: number,
  playstyle: Playstyle,
  ghostType?: string,
  mapSize?: 'small' | 'medium' | 'large',
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
): LoadoutRecommendation {
  const profile = PLAYSTYLE_PROFILES[playstyle];
  let loadout: string[] = [];
  let totalCost = 0;

  // Step 1: Add base equipment for all-evidence coverage
  const baseEquipment = [...BASE_EQUIPMENT.essential];
  loadout = [...baseEquipment];
  totalCost = baseEquipment.reduce((sum, item) => sum + (EQUIPMENT_COSTS[item] || 0), 0);

  // Step 2: Add ghost-specific equipment if provided
  let ghostSpecific: string[] = [];
  let ghostMatchup = calculateGhostMatchup(loadout, ghostType);

  if (ghostType && GHOST_RECOMMENDATIONS[ghostType]) {
    const ghostRecs = GHOST_RECOMMENDATIONS[ghostType];
    
    // Add must-have equipment
    ghostSpecific = [...ghostRecs.mustHave].filter(item => !loadout.includes(item));
    
    // Try to add within budget
    for (const item of ghostSpecific) {
      const cost = EQUIPMENT_COSTS[item] || 0;
      if (totalCost + cost <= budget) {
        loadout.push(item);
        totalCost += cost;
      }
    }

    // Add recommended equipment if budget allows
    const remaining = budget - totalCost;
    const allocation = profile.budgetAllocation.safety;
    const safetyBudget = remaining * allocation;

    for (const item of ghostRecs.recommended) {
      if (!loadout.includes(item)) {
        const cost = EQUIPMENT_COSTS[item] || 0;
        if (totalCost + cost <= budget && cost <= safetyBudget * 0.3) {
          loadout.push(item);
          totalCost += cost;
        }
      }
    }
  }

  // Step 3: Add playstyle-specific equipment
  const playstyleEquipment = profile.priorityEquipment.filter(
    item => !loadout.includes(item) && !profile.avoidEquipment.includes(item)
  );

  for (const item of playstyleEquipment) {
    const cost = EQUIPMENT_COSTS[item] || 0;
    if (totalCost + cost <= budget) {
      loadout.push(item);
      totalCost += cost;
    }
  }

  // Step 4: Add optional/utility equipment
  const optionalEquipment = ['tripod', 'photo-camera', 'salt', 'smudge-sticks'].filter(
    item => !loadout.includes(item) && !profile.avoidEquipment.includes(item)
  );

  for (const item of optionalEquipment) {
    const cost = EQUIPMENT_COSTS[item] || 0;
    if (totalCost + cost <= budget) {
      loadout.push(item);
      totalCost += cost;
    }
  }

  // Calculate effectiveness
  const efficiency = calculateEfficiency(loadout, ghostType);
  
  // Generate explanation and identify gaps
  const explanation = generateExplanation(loadout, profile, ghostType);
  const gaps = identifyGaps(loadout, ghostType);

  // Recalculate ghost matchup with final loadout
  ghostMatchup = calculateGhostMatchup(loadout, ghostType);

  // Generate loadout name
  const name = generateLoadoutName(playstyle, ghostType);

  return {
    id: `loadout-${Date.now()}`,
    name,
    description: `${profile.emoji} ${profile.name} loadout optimized for ${ghostType || 'all ghosts'}`,
    playstyle,
    difficulty: difficulty || 'Beginner',
    mapSize,
    ghostType,
    essential: baseEquipment,
    recommended: loadout.filter(item => !baseEquipment.includes(item)),
    optional: [],
    totalCost,
    maxBudget: budget,
    efficiency,
    explanation,
    gaps,
    ghostMatchup: [ghostMatchup],
    tags: [playstyle, ghostType || 'all-ghosts', `$${totalCost}`],
  };
}

/**
 * Calculate equipment effectiveness for a specific ghost
 */
function calculateGhostMatchup(
  loadout: string[],
  ghostType?: string
): {
  ghostId: string;
  ghostName: string;
  effectiveness: number;
  reason: string;
} {
  if (!ghostType) {
    return {
      ghostId: 'all',
      ghostName: 'All Ghosts',
      effectiveness: 75,
      reason: 'Balanced loadout for any ghost type',
    };
  }

  const ghost = Object.values(GHOSTS).find((g: Ghost) => g.id === ghostType);
  if (!ghost) {
    return {
      ghostId: ghostType,
      ghostName: 'Unknown Ghost',
      effectiveness: 50,
      reason: 'Ghost type not found',
    };
  }

  const ghostRecs = GHOST_RECOMMENDATIONS[ghostType];
  if (!ghostRecs) {
    return {
      ghostId: ghostType,
      ghostName: ghost.name,
      effectiveness: 60,
      reason: 'Generic loadout effectiveness',
    };
  }

  // Calculate based on must-have coverage
  const mustHaveCoverage = ghostRecs.mustHave.filter(item => loadout.includes(item)).length;
  const mustHaveRatio = mustHaveCoverage / ghostRecs.mustHave.length;

  // Calculate based on evidence coverage
  const evidence = ghost.evidence || [];
  const coveredEvidence = evidence.filter((ev: string) => {
    return loadout.some(item => {
      const detectedEvidence = EQUIPMENT_EVIDENCE_MAP[item] || [];
      return detectedEvidence.includes(ev);
    });
  });
  const evidenceRatio = evidence.length > 0 ? coveredEvidence.length / evidence.length : 0.5;

  // Weighted effectiveness
  const effectiveness = Math.round((mustHaveRatio * 0.5 + evidenceRatio * 0.5) * 100);

  return {
    ghostId: ghostType,
    ghostName: ghost.name,
    effectiveness: Math.max(50, Math.min(100, effectiveness)),
    reason: `Covers ${coveredEvidence.length}/${evidence.length} evidence types`,
  };
}

/**
 * Calculate overall efficiency score (0-100)
 */
function calculateEfficiency(loadout: string[], ghostType?: string): number {
  let score = 60; // Base score

  // Evidence coverage
  const evidenceTypes = new Set<string>();
  loadout.forEach(item => {
    const evidence = EQUIPMENT_EVIDENCE_MAP[item] || [];
    evidence.forEach(ev => evidenceTypes.add(ev));
  });
  score += Math.min(20, evidenceTypes.size * 2.8); // Max +20

  // Cost efficiency
  const totalCost = loadout.reduce((sum, item) => sum + (EQUIPMENT_COSTS[item] || 0), 0);
  const costEfficiency = Math.min(10, 10 - (totalCost / 1000) * 2); // Max +10
  score += Math.max(0, costEfficiency);

  // Ghost-specific bonus
  if (ghostType && GHOST_RECOMMENDATIONS[ghostType]) {
    const ghostRecs = GHOST_RECOMMENDATIONS[ghostType];
    const mustHaveMatch = ghostRecs.mustHave.filter(item => loadout.includes(item)).length;
    score += (mustHaveMatch / ghostRecs.mustHave.length) * 10; // Max +10
  }

  return Math.min(100, Math.round(score));
}

/**
 * Generate explanation for why this loadout is recommended
 */
function generateExplanation(
  loadout: string[],
  profile: typeof PLAYSTYLE_PROFILES[Playstyle],
  ghostType?: string
): string[] {
  const explanation: string[] = [];

  // Evidence coverage
  const evidenceTypes = new Set<string>();
  loadout.forEach(item => {
    const evidence = EQUIPMENT_EVIDENCE_MAP[item] || [];
    evidence.forEach(ev => evidenceTypes.add(ev));
  });
  explanation.push(`Covers ${evidenceTypes.size}/7 evidence types`);

  // Playstyle focus
  if (profile.budgetAllocation.detection > 0.6) {
    explanation.push('Heavy focus on evidence detection');
  } else if (profile.budgetAllocation.safety > 0.4) {
    explanation.push('Prioritizes hunter safety and protection');
  } else {
    explanation.push('Balanced approach to detection and safety');
  }

  // Ghost-specific
  if (ghostType && GHOST_RECOMMENDATIONS[ghostType]) {
    const ghostRecs = GHOST_RECOMMENDATIONS[ghostType];
    const mustHaveMatch = ghostRecs.mustHave.filter(item => loadout.includes(item)).length;
    explanation.push(`Optimized for ${ghostType} (${mustHaveMatch}/${ghostRecs.mustHave.length} must-haves included)`);
  }

  // Cost
  const totalCost = loadout.reduce((sum, item) => sum + (EQUIPMENT_COSTS[item] || 0), 0);
  if (totalCost < 400) {
    explanation.push('Budget-friendly starter loadout');
  } else if (totalCost < 800) {
    explanation.push('Mid-range loadout with good coverage');
  } else {
    explanation.push('Premium loadout with comprehensive coverage');
  }

  // Safety equipment
  const hasSafety = loadout.some(item => ['crucifix', 'sanity-medication', 'smudge-sticks'].includes(item));
  if (hasSafety) {
    explanation.push('Includes protective measures');
  }

  return explanation;
}

/**
 * Identify gaps in the loadout
 */
function identifyGaps(loadout: string[], ghostType?: string): string[] {
  const gaps: string[] = [];

  // Check evidence coverage
  const evidenceTypes = new Set<string>();
  loadout.forEach(item => {
    const evidence = EQUIPMENT_EVIDENCE_MAP[item] || [];
    evidence.forEach(ev => evidenceTypes.add(ev));
  });

  if (evidenceTypes.size < 7) {
    const allEvidence = ['EMF Level 5', 'Spirit Box', 'Ghost Writing', 'Ultraviolet', 'Ghost Orb', 'D.O.T.S. Projector', 'Freezing Temperatures'];
    const missing = allEvidence.filter(ev => !evidenceTypes.has(ev));
    gaps.push(`Missing evidence types: ${missing.slice(0, 2).join(', ')}`);
  }

  // Check safety equipment
  const hasSafety = loadout.some(item => ['crucifix', 'sanity-medication', 'smudge-sticks'].includes(item));
  if (!hasSafety) {
    gaps.push('No protective equipment included');
  }

  // Ghost-specific gaps
  if (ghostType && GHOST_RECOMMENDATIONS[ghostType]) {
    const ghostRecs = GHOST_RECOMMENDATIONS[ghostType];
    const missingMustHaves = ghostRecs.mustHave.filter(item => !loadout.includes(item));
    if (missingMustHaves.length > 0) {
      gaps.push(`Missing ${ghostType}-specific equipment: ${missingMustHaves.slice(0, 2).join(', ')}`);
    }
  }

  return gaps;
}

/**
 * Generate a descriptive name for the loadout
 */
function generateLoadoutName(playstyle: Playstyle, ghostType?: string): string {
  if (ghostType && LOADOUT_NAMES[playstyle]?.[ghostType]) {
    return LOADOUT_NAMES[playstyle][ghostType];
  }

  if (LOADOUT_NAMES[playstyle]?.default) {
    return LOADOUT_NAMES[playstyle].default;
  }

  // Fallback names
  const fallbacks: Record<Playstyle, string> = {
    aggressive: 'Aggressive Loadout',
    defensive: 'Defensive Loadout',
    balanced: 'Balanced Loadout',
    solo: 'Solo Loadout',
    team: 'Team Loadout',
  };

  return fallbacks[playstyle];
}

/**
 * Compare two loadouts side-by-side
 */
export function compareLoadouts(
  loadout1: LoadoutRecommendation,
  loadout2: LoadoutRecommendation
): {
  equipment1: string[];
  equipment2: string[];
  cost1: number;
  cost2: number;
  efficiency1: number;
  efficiency2: number;
  differences: string;
} {
  const all1 = [...loadout1.essential, ...loadout1.recommended];
  const all2 = [...loadout2.essential, ...loadout2.recommended];

  const unique1 = all1.filter(item => !all2.includes(item));
  const unique2 = all2.filter(item => !all1.includes(item));

  const costDiff = Math.abs(loadout1.totalCost - loadout2.totalCost);
  const efficiencyDiff = Math.abs(loadout1.efficiency - loadout2.efficiency);

  let differences = '';
  if (unique1.length > 0) {
    differences += `Unique to ${loadout1.name}: ${unique1.join(', ')}. `;
  }
  if (unique2.length > 0) {
    differences += `Unique to ${loadout2.name}: ${unique2.join(', ')}. `;
  }
  differences += `Cost difference: $${costDiff}. Efficiency difference: ${efficiencyDiff}%.`;

  return {
    equipment1: all1,
    equipment2: all2,
    cost1: loadout1.totalCost,
    cost2: loadout2.totalCost,
    efficiency1: loadout1.efficiency,
    efficiency2: loadout2.efficiency,
    differences,
  };
}

/**
 * Get recommended budget ranges by difficulty
 */
export function getRecommendedBudget(difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'): {
  min: number;
  suggested: number;
  max: number;
} {
  const rec = DIFFICULTY_RECOMMENDATIONS[difficulty];
  return {
    min: rec.budgetMin,
    suggested: rec.budgetSuggested,
    max: rec.budgetMax,
  };
}

export { PLAYSTYLE_PROFILES } from '@/lib/data/equipment-optimizer';
