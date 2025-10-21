/**
 * Evidence Identifier Algorithm
 * Core logic for filtering ghosts, calculating confidence, generating hints
 */

import { ALL_EVIDENCE_TYPES } from '@/lib/data/evidence-identifier';
import { GHOSTS } from '@/lib/data/ghosts';
import { EvidenceType, Ghost } from '@/lib/types';

export type EvidenceStatus = 'not-found' | 'investigating' | 'confirmed';

export interface GhostMatchResult {
  ghostId: string;
  ghostName: string;
  ghostImage?: string;
  confidence: number; // 0-100
  matchedEvidence: EvidenceType[];
  missingEvidence: EvidenceType[];
  extraEvidence: EvidenceType[]; // Confirmed evidence ghost doesn't have
  contradictions: string[];
  reason: string;
  confirmationMessage?: string;
}

export interface FilteredGhosts {
  definiteMatches: GhostMatchResult[]; // 100% confidence
  veryLikely: GhostMatchResult[]; // 80-99% confidence
  possible: GhostMatchResult[]; // 20-79% confidence
  unlikely: GhostMatchResult[]; // 1-19% confidence
  impossible: GhostMatchResult[]; // 0% confidence
  totalEliminated: number;
}

export interface SmartHint {
  evidence: EvidenceType;
  reason: string;
  eliminationPower: number; // How many ghosts would be eliminated if found/not found
  priority: 'high' | 'medium' | 'low';
}

export interface EvidenceState {
  [key: string]: EvidenceStatus;
}

/**
 * Main function to filter ghosts based on collected evidence
 */
export function filterGhostsByEvidence(evidenceState: EvidenceState): FilteredGhosts {
  // Get confirmed and investigating evidence
  const confirmedEvidence = Object.entries(evidenceState)
    .filter(([_, status]) => status === 'confirmed')
    .map(([evidence, _]) => evidence as EvidenceType);

  const investigatingEvidence = Object.entries(evidenceState)
    .filter(([_, status]) => status === 'investigating')
    .map(([evidence, _]) => evidence as EvidenceType);

  const allGhosts = Object.values(GHOSTS);
  const results: GhostMatchResult[] = [];

  for (const ghost of allGhosts) {
    const result = calculateGhostMatch(
      ghost,
      confirmedEvidence,
      investigatingEvidence
    );
    results.push(result);
  }

  // Sort by confidence
  results.sort((a, b) => b.confidence - a.confidence);

  // Categorize by confidence levels
  const definiteMatches = results.filter(r => r.confidence === 100);
  const veryLikely = results.filter(r => r.confidence >= 80 && r.confidence < 100);
  const possible = results.filter(r => r.confidence >= 20 && r.confidence < 80);
  const unlikely = results.filter(r => r.confidence > 0 && r.confidence < 20);
  const impossible = results.filter(r => r.confidence === 0);

  const totalEliminated = impossible.length;

  return {
    definiteMatches,
    veryLikely,
    possible,
    unlikely,
    impossible,
    totalEliminated,
  };
}

/**
 * Calculate confidence match for a single ghost
 */
function calculateGhostMatch(
  ghost: Ghost,
  confirmedEvidence: EvidenceType[],
  investigatingEvidence: EvidenceType[]
): GhostMatchResult {
  const ghostEvidence = new Set(ghost.evidence);
  const confirmedSet = new Set(confirmedEvidence);

  // Find which evidence types match
  const matchedEvidence = confirmedEvidence.filter(e => ghostEvidence.has(e));
  const extraEvidence = confirmedEvidence.filter(e => !ghostEvidence.has(e)); // Contradictions
  const missingEvidence = ghost.evidence.filter(e => !confirmedSet.has(e));

  // If there's contradictory evidence, confidence is 0
  if (extraEvidence.length > 0) {
    return {
      ghostId: ghost.id,
      ghostName: ghost.name,
      ghostImage: ghost.imageUrl,
      confidence: 0,
      matchedEvidence,
      missingEvidence: ghost.evidence,
      extraEvidence,
      contradictions: [
        `Has confirmed evidence "${extraEvidence[0]}" which ${ghost.name} doesn't have`,
      ],
      reason: 'IMPOSSIBLE - Contradictory evidence',
    };
  }

  // Calculate confidence based on evidence match
  let confidence = 0;

  if (confirmedEvidence.length === 0) {
    // No evidence collected yet, all ghosts are equally possible
    confidence = 50; // Base possibility
  } else if (matchedEvidence.length === ghost.evidence.length) {
    // All of ghost's evidence is confirmed
    confidence = 100;
  } else if (matchedEvidence.length > 0) {
    // Some evidence matches
    const matchPercentage = matchedEvidence.length / ghost.evidence.length;
    confidence = Math.round(matchPercentage * 100);

    // Bonus points for having more evidence confirmed overall
    const totalConfirmedPercentage = confirmedEvidence.length / ALL_EVIDENCE_TYPES.length;
    confidence = Math.round((confidence + totalConfirmedPercentage * 30) / 1.3);
  } else {
    // No matches yet, but possible
    confidence = 50;
  }

  // Generate reason string
  let reason = '';
  if (matchedEvidence.length === ghost.evidence.length) {
    reason = `✓ DEFINITE MATCH - All ${matchedEvidence.length} evidence types confirmed`;
  } else if (matchedEvidence.length > 0) {
    reason = `${matchedEvidence.length}/${ghost.evidence.length} evidence match`;
  } else {
    reason = 'Awaiting evidence collection';
  }

  return {
    ghostId: ghost.id,
    ghostName: ghost.name,
    ghostImage: ghost.imageUrl,
    confidence,
    matchedEvidence,
    missingEvidence,
    extraEvidence,
    contradictions: [],
    reason,
    confirmationMessage:
      confidence === 100
        ? `🎯 ${ghost.name} CONFIRMED! All evidence matches.`
        : confidence >= 80
          ? `${ghost.name} is very likely. Collect more evidence to confirm.`
          : undefined,
  };
}

/**
 * Generate smart hints for which evidence to collect next
 */
export function generateSmartHints(
  evidenceState: EvidenceState,
  filteredResults: FilteredGhosts
): SmartHint[] {
  const confirmedEvidence = Object.entries(evidenceState)
    .filter(([_, status]) => status === 'confirmed')
    .map(([evidence, _]) => evidence as EvidenceType);

  const uncollectedEvidence = ALL_EVIDENCE_TYPES.filter(
    e => !confirmedEvidence.includes(e)
  );

  const allGhosts = Object.values(GHOSTS);

  // Score each uncollected evidence by its elimination power
  const hints = uncollectedEvidence.map(evidence => {
    // Count how many remaining possible ghosts have this evidence
    const ghostsWithEvidence = allGhosts.filter(
      g => g.evidence.includes(evidence)
    ).length;
    const ghostsWithoutEvidence = allGhosts.length - ghostsWithEvidence;

    // Calculate elimination power: finding it eliminates some, not finding eliminates others
    const maxElimination = Math.max(
      ghostsWithEvidence,
      ghostsWithoutEvidence
    );

    // Prioritize evidence that distinguishes between current possibilities
    const remainingPossible = [
      ...filteredResults.definiteMatches,
      ...filteredResults.veryLikely,
      ...filteredResults.possible,
      ...filteredResults.unlikely,
    ];

    const distinguishingPower = remainingPossible.filter(
      r => r.missingEvidence.includes(evidence)
    ).length;

    const eliminationPower = Math.round(
      (maxElimination + distinguishingPower * 2) / 2
    );

    // Determine priority
    let priority: 'high' | 'medium' | 'low' = 'low';
    if (distinguishingPower > remainingPossible.length * 0.5) {
      priority = 'high';
    } else if (distinguishingPower > remainingPossible.length * 0.25) {
      priority = 'medium';
    }

    const reason =
      distinguishingPower > 0
        ? `Distinguishes between ${distinguishingPower} remaining possibilities`
        : `Eliminates ${maxElimination} ghosts`;

    return {
      evidence,
      reason,
      eliminationPower,
      priority,
    };
  });

  // Sort by elimination power and priority
  return hints.sort((a, b) => {
    if (a.priority !== b.priority) {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return b.eliminationPower - a.eliminationPower;
  });
}

/**
 * Get equipment needed for next evidence collection
 */
export function getRequiredEquipment(hints: SmartHint[]): string[] {
  const equipmentMap: Record<EvidenceType, string> = {
    'EMF Level 5': 'EMF Reader',
    'D.O.T.S. Projector': 'D.O.T.S. Projector',
    'Ultraviolet': 'UV Light',
    'Ghost Orb': 'Video Camera',
    'Ghost Writing': 'Ghost Writing Book',
    'Spirit Box': 'Spirit Box',
    'Freezing Temperatures': 'Thermometer',
  };

  // Get equipment for top 3 hints
  const topHints = hints.slice(0, 3);
  return topHints.map(hint => equipmentMap[hint.evidence] || 'Unknown');
}

/**
 * Get collected equipment from confirmed evidence
 */
export function getCollectedEquipment(evidenceState: EvidenceState): string[] {
  const equipmentMap: Record<EvidenceType, string> = {
    'EMF Level 5': 'EMF Reader',
    'D.O.T.S. Projector': 'D.O.T.S. Projector',
    'Ultraviolet': 'UV Light',
    'Ghost Orb': 'Video Camera',
    'Ghost Writing': 'Ghost Writing Book',
    'Spirit Box': 'Spirit Box',
    'Freezing Temperatures': 'Thermometer',
  };

  const confirmedEvidence = Object.entries(evidenceState)
    .filter(([_, status]) => status === 'confirmed')
    .map(([evidence, _]) => evidence as EvidenceType);

  const equipment = confirmedEvidence
    .map(e => equipmentMap[e])
    .filter((e, idx, arr) => arr.indexOf(e) === idx); // Remove duplicates

  return equipment;
}

/**
 * Calculate investigation progress percentage
 */
export function calculateProgress(
  evidenceState: EvidenceState
): {
  percentage: number;
  collected: number;
  remaining: number;
} {
  const confirmedCount = Object.values(evidenceState).filter(
    s => s === 'confirmed'
  ).length;
  const maxEvidence = 3; // Maximum evidence that can be collected

  return {
    percentage: Math.round((confirmedCount / maxEvidence) * 100),
    collected: confirmedCount,
    remaining: maxEvidence - confirmedCount,
  };
}

/**
 * Get identification status message
 */
export function getIdentificationStatus(
  evidenceState: EvidenceState,
  filteredResults: FilteredGhosts
): string {
  const confirmedCount = Object.values(evidenceState).filter(
    s => s === 'confirmed'
  ).length;

  if (confirmedCount === 0) {
    return 'Start collecting evidence to identify the ghost';
  }

  if (filteredResults.definiteMatches.length === 1) {
    return `✓ CONFIRMED: ${filteredResults.definiteMatches[0].ghostName}`;
  }

  if (filteredResults.definiteMatches.length > 1) {
    return `Multiple definite matches found. Need clarification.`;
  }

  if (filteredResults.veryLikely.length > 0) {
    return `Very likely: ${filteredResults.veryLikely[0].ghostName}. Need 1 more evidence to confirm.`;
  }

  if (filteredResults.possible.length > 0) {
    return `${filteredResults.possible.length} ghosts match evidence. Continue collecting.`;
  }

  if (filteredResults.impossible.length === Object.values(GHOSTS).length) {
    return 'No ghosts match current evidence. Check your findings.';
  }

  return 'Collecting evidence...';
}

/**
 * Validate evidence for contradictions
 */
export function validateEvidence(evidenceState: EvidenceState): {
  valid: boolean;
  issues: string[];
} {
  const confirmedEvidence = Object.entries(evidenceState)
    .filter(([_, status]) => status === 'confirmed')
    .map(([evidence, _]) => evidence as EvidenceType);

  const allGhosts = Object.values(GHOSTS);
  const matchingGhosts = allGhosts.filter(ghost => {
    const ghostEvidenceSet = new Set(ghost.evidence);
    return confirmedEvidence.every(e => ghostEvidenceSet.has(e));
  });

  const issues: string[] = [];

  if (matchingGhosts.length === 0) {
    issues.push(
      'No ghosts match this evidence combination. Check your findings.'
    );
  }

  if (confirmedEvidence.length > 3) {
    issues.push(
      'Most ghosts only have 3 evidence types. Verify your evidence.'
    );
  }

  return {
    valid: matchingGhosts.length > 0,
    issues,
  };
}

/**
 * Get top 3 recommendations for next steps
 */
export function getNextStepRecommendations(
  evidenceState: EvidenceState,
  filteredResults: FilteredGhosts
): string[] {
  const confirmedCount = Object.values(evidenceState).filter(
    s => s === 'confirmed'
  ).length;

  const recommendations: string[] = [];

  if (confirmedCount < 2) {
    recommendations.push('Collect at least 2 evidence types to narrow down');
  }

  if (filteredResults.definiteMatches.length === 0 && confirmedCount >= 2) {
    recommendations.push('Collect 1 more evidence to get a definite match');
  }

  if (filteredResults.veryLikely.length > 0) {
    const topGhost = filteredResults.veryLikely[0];
    const missingOne = topGhost.missingEvidence[0];
    if (missingOne) {
      recommendations.push(
        `Check for ${missingOne} to confirm ${topGhost.ghostName}`
      );
    }
  }

  if (filteredResults.impossible.length > 0) {
    recommendations.push(
      `Successfully eliminated ${filteredResults.impossible.length} ghosts`
    );
  }

  return recommendations.slice(0, 3); // Return top 3
}
