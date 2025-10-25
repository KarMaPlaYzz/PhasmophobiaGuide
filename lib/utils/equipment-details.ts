/**
 * Equipment Details & Descriptions
 * Provides detailed information about each piece of equipment
 */


export interface EquipmentDetail {
  id: string;
  name: string;
  cost: number;
  detects: string[];
  category: 'detection' | 'safety' | 'utility';
  description: string;
  tips: string[];
  effectiveness: 'high' | 'medium' | 'low';
}

export const EQUIPMENT_DETAILS: Record<string, EquipmentDetail> = {
  'emf-reader': {
    id: 'emf-reader',
    name: 'EMF Reader',
    cost: 45,
    detects: ['EMF Level 5'],
    category: 'detection',
    description: 'Detects high EMF radiation. Essential for most ghost types. Lights up when ghost is nearby.',
    tips: [
      'Always bring one - needed for almost every ghost type',
      'Lights up to Level 5 when ghost interacts with objects',
      'Helps narrow down ghost location',
      'Critical for Jinn, Oni, and Poltergeist identification'
    ],
    effectiveness: 'high'
  },
  'spirit-box': {
    id: 'spirit-box',
    name: 'Spirit Box',
    cost: 50,
    detects: ['Spirit Box'],
    category: 'detection',
    description: 'Radio device that ghosts can communicate through. Tuned correctly detects ghost voices.',
    tips: [
      'Requires lights off to work effectively',
      'Listen for voice response within 2 seconds',
      'Some ghosts respond immediately, others hesitate',
      'Essential for hunts - nearly all ghosts can be caught with this'
    ],
    effectiveness: 'high'
  },
  'ghost-writing-book': {
    id: 'ghost-writing-book',
    name: 'Ghost Writing Book',
    cost: 40,
    detects: ['Ghost Writing'],
    category: 'detection',
    description: 'Blank book where ghosts write messages. Place on floor for ghost to write in.',
    tips: [
      'Leave in haunted room - ghost may write in it during hunt',
      'More effective if ghost sanity is low',
      'Wraiths cannot write',
      'One of the most reliable evidence sources'
    ],
    effectiveness: 'high'
  },
  'uv-light': {
    id: 'uv-light',
    name: 'UV Light',
    cost: 35,
    detects: ['Ultraviolet'],
    category: 'detection',
    description: 'Ultraviolet flashlight that reveals fingerprints left by ghosts.',
    tips: [
      'Look for handprints and fingerprints on walls/furniture',
      'Phantoms leave no fingerprints - useful for identification',
      'Works in dark rooms better - turn off flashlight',
      'Good for Wraiths and Phantoms confirmation'
    ],
    effectiveness: 'medium'
  },
  'video-camera': {
    id: 'video-camera',
    name: 'Video Camera',
    cost: 50,
    detects: ['Ghost Orb', 'D.O.T.S. Projector'],
    category: 'detection',
    description: 'Records video. Can catch ghost orbs (when D.O.T.S. is active) or ghost manifestations.',
    tips: [
      'Place in room with D.O.T.S. projector to catch orbs',
      'Some ghosts invisible on camera (Wraiths, Phantoms)',
      'Requires power outlet - uses truck power',
      'Can review footage later for evidence'
    ],
    effectiveness: 'high'
  },
  'dots-projector': {
    id: 'dots-projector',
    name: 'D.O.T.S. Projector',
    cost: 65,
    detects: ['D.O.T.S. Projector'],
    category: 'detection',
    description: 'Projects grid of dots. Ghosts interact with dots, creating visible disturbances.',
    tips: [
      'Great for Spirits and Poltergeists - very active interactions',
      'Requires video camera to record ghost walking through',
      'Phantoms and Wraiths harder to catch on D.O.T.S.',
      'Placement matters - put in main activity area'
    ],
    effectiveness: 'high'
  },
  'thermometer': {
    id: 'thermometer',
    name: 'Thermometer',
    cost: 30,
    detects: ['Freezing Temperatures'],
    category: 'detection',
    description: 'Measures temperature. Ghosts cause sudden temperature drops.',
    tips: [
      'Essential for identifying Demons, Demons, and Jinn',
      'Look for significant drops below room baseline',
      'Wraithes do not cause freezing temperatures',
      'Often fastest evidence to collect'
    ],
    effectiveness: 'medium'
  },
  'parabolic-microphone': {
    id: 'parabolic-microphone',
    name: 'Parabolic Microphone',
    cost: 45,
    detects: ['Spirit Box'],
    category: 'detection',
    description: 'Long-range directional microphone. Captures ghost sounds from distance.',
    tips: [
      'Good alternative to Spirit Box for same evidence',
      'Lets you stay at safe distance - great for defensive play',
      'Capture screams or growls for Banshees and Demons',
      'Requires headphones in game for audio feedback'
    ],
    effectiveness: 'medium'
  },
  'sound-recorder': {
    id: 'sound-recorder',
    name: 'Sound Recorder',
    cost: 50,
    detects: ['Spirit Box'],
    category: 'detection',
    description: 'Records audio. Ghosts may be captured on tape even if Spirit Box fails.',
    tips: [
      'Useful backup for Spirit Box evidence',
      'Place in ghost room and review later',
      'Better for defensive playstyle - no risk while using',
      'Works well with Banshees that require distance'
    ],
    effectiveness: 'medium'
  },
  'motion-sensor': {
    id: 'motion-sensor',
    name: 'Motion Sensor',
    cost: 40,
    detects: [],
    category: 'utility',
    description: 'Detects movement. Useful for tracking ghost location and activity patterns.',
    tips: [
      'Place in corridors to track ghost movement between rooms',
      'Alerts team when ghost passes sensor area',
      'Great for solo play to know if ghost is near',
      'Does not detect evidence but helps with safe gathering'
    ],
    effectiveness: 'medium'
  },
  'crucifix': {
    id: 'crucifix',
    name: 'Crucifix',
    cost: 30,
    detects: [],
    category: 'safety',
    description: 'Religious artifact that prevents hunts within area. Crucifixes don\'t work on all ghosts.',
    tips: [
      'Essential for Demons - one of few things that stops them',
      'Place before hunt starts for maximum coverage',
      'Some ghosts ignore it (check ghost guide)',
      'Takes up inventory slot but saves lives'
    ],
    effectiveness: 'high'
  },
  'sanity-medication': {
    id: 'sanity-medication',
    name: 'Sanity Medication',
    cost: 20,
    detects: [],
    category: 'safety',
    description: 'Restores sanity quickly. Used when sanity gets critically low.',
    tips: [
      'Low sanity increases hunt chance - use preventatively',
      'Cheap insurance for defensive builds',
      'Less important for aggressive playstyle',
      'Bring 2-3 for long hunts with low-level hunters'
    ],
    effectiveness: 'medium'
  },
  'smudge-sticks': {
    id: 'smudge-sticks',
    name: 'Smudge Sticks',
    cost: 35,
    detects: [],
    category: 'safety',
    description: 'Burning sticks that protect from hunts for 90 seconds. Essential safety tool.',
    tips: [
      'Light when hunt starts to buy time for escape/grouping',
      'Works on most ghosts - check exceptions',
      'You must be in area where you light it',
      'Critical for higher difficulty hunts'
    ],
    effectiveness: 'high'
  },
  'incense': {
    id: 'incense',
    name: 'Incense',
    cost: 30,
    detects: [],
    category: 'safety',
    description: 'Burns slowly to reduce hunt frequency in nearby area.',
    tips: [
      'Passive protection - set and forget',
      'Reduces hunting urge, not instant hunt prevention',
      'Good for maintaining sanity indirectly',
      'Best for solo/defensive play'
    ],
    effectiveness: 'medium'
  },
  'salt': {
    id: 'salt',
    name: 'Salt',
    cost: 15,
    detects: [],
    category: 'utility',
    description: 'Cheap utility item. Wraiths are repelled by salt but still can interact with it.',
    tips: [
      'Great budget filler when you have remaining funds',
      'Helps with Wraith identification',
      'Low cost makes it worth bringing',
      'Can prevent multiple hunts from same location'
    ],
    effectiveness: 'low'
  },
  'photo-camera': {
    id: 'photo-camera',
    name: 'Photo Camera',
    cost: 40,
    detects: [],
    category: 'utility',
    description: 'Take photos for mission objectives. Photograph ghost, fingerprints, or interactions.',
    tips: [
      'Mostly for money bonus photos (photo objective)',
      'Can catch ghost on film for objectives',
      'Ultraviolet fingerprints show better in photos',
      'Takes inventory space for low value'
    ],
    effectiveness: 'low'
  },
  'tripod': {
    id: 'tripod',
    name: 'Tripod',
    cost: 25,
    detects: [],
    category: 'utility',
    description: 'Holds video camera steady. Frees up a player slot.',
    tips: [
      'Good for team play - frees player to gather evidence',
      'Solo play: place camera and hunt safely',
      'Best value utility item for team hunts',
      'Saves equipment carrying capacity'
    ],
    effectiveness: 'medium'
  },
  'temperature-sensor': {
    id: 'temperature-sensor',
    name: 'Temperature Sensor',
    cost: 35,
    detects: [],
    category: 'detection',
    description: 'Automated temperature monitoring device. Alternative to handheld thermometer.',
    tips: [
      'Place in ghost room and monitor from truck',
      'Provides continuous readings without entering room',
      'Great for defensive play from distance',
      'More reliable than thermometer in chaotic hunts'
    ],
    effectiveness: 'medium'
  },
  'head-mounted-camera': {
    id: 'head-mounted-camera',
    name: 'Head-Mounted Camera',
    cost: 60,
    detects: ['Ghost Orb', 'D.O.T.S. Projector'],
    category: 'detection',
    description: 'Wearable camera. Records from first-person perspective.',
    tips: [
      'Hands-free recording - good for evidence gathering',
      'Captures interactions from player perspective',
      'More expensive than regular camera',
      'Best for active hunters who need both hands'
    ],
    effectiveness: 'high'
  },
  'prayer-candle': {
    id: 'prayer-candle',
    name: 'Prayer Candle',
    cost: 25,
    detects: [],
    category: 'safety',
    description: 'Religious item that offers spiritual protection against certain ghosts.',
    tips: [
      'Particularly effective against religious ghosts like Demon',
      'Light and place in ghost room for continuous protection',
      'Stacks with crucifix for enhanced protection',
      'Low cost makes it efficient for budget loadouts'
    ],
    effectiveness: 'medium'
  }
};

/**
 * Get detailed information about an equipment item
 */
export function getEquipmentDetail(equipmentId: string): EquipmentDetail | null {
  return EQUIPMENT_DETAILS[equipmentId] || null;
}

/**
 * Calculate cost-effectiveness data for different budget points
 * Shows effectiveness percentages at various budget levels
 */
export function calculateBudgetOptimization(
  currentEfficiency: number,
  currentCost: number,
  maxBudget: number
): Array<{ budget: number; efficiency: number; label: string }> {
  const optimizationPoints: Array<{ budget: number; efficiency: number; label: string }> = [];

  // Add current point
  optimizationPoints.push({
    budget: currentCost,
    efficiency: currentEfficiency,
    label: `Current: $${currentCost}`
  });

  // Generate alternative budget points based on current loadout
  const budgetSteps = [300, 600, 800, 1200, 1500, 2000, 3000];

  for (const budget of budgetSteps) {
    if (budget === currentCost) continue; // Skip if same as current
    if (budget > maxBudget) break; // Don't suggest over max

    // Estimate efficiency based on budget ratio
    // More budget typically = higher efficiency, but with diminishing returns
    let estimatedEfficiency = currentEfficiency;

    if (budget > currentCost) {
      // Going up in budget - modest efficiency gains
      const budgetRatio = (budget - currentCost) / currentCost;
      estimatedEfficiency = Math.min(100, currentEfficiency + budgetRatio * 8);
    } else {
      // Going down in budget - bigger efficiency loss
      const budgetRatio = (currentCost - budget) / currentCost;
      estimatedEfficiency = Math.max(50, currentEfficiency - budgetRatio * 12);
    }

    optimizationPoints.push({
      budget,
      efficiency: Math.round(estimatedEfficiency),
      label: `$${budget}`
    });
  }

  // Sort by budget and limit to 5 most relevant
  return optimizationPoints
    .sort((a, b) => a.budget - b.budget)
    .slice(0, 5);
}

/**
 * Format equipment ID to readable name
 */
export function formatEquipmentName(id: string): string {
  return id
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Get equipment category color
 */
export function getCategoryColor(category: string): string {
  switch (category) {
    case 'detection':
      return '#00D9FF'; // Cyan - Detection
    case 'safety':
      return '#FF6B6B'; // Red - Safety
    case 'utility':
      return '#95E1D3'; // Teal - Utility
    default:
      return '#A8A8A8'; // Gray
  }
}

/**
 * Get effectiveness emoji/visual indicator
 */
export function getEffectivenessIndicator(effectiveness: 'high' | 'medium' | 'low'): string {
  switch (effectiveness) {
    case 'high':
      return '⭐⭐⭐';
    case 'medium':
      return '⭐⭐';
    case 'low':
      return '⭐';
    default:
      return '⭐';
  }
}
