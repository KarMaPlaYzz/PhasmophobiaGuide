/**
 * Evidence Identifier Data
 * Contains all evidence types with collection tips, equipment mappings, and difficulty ratings
 */

import { EvidenceType } from '@/lib/types';

export interface EvidenceInfo {
  id: string;
  name: EvidenceType;
  emoji: string;
  description: string;
  howToCollect: string[];
  tips: string[];
  equipment: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  rarity: number; // 0-100, percentage of ghosts that have it
  ghostsWithThis: string[];
  ghostsWithoutThis: string[];
  commonMistakes: string[];
  visualIndicators: string[];
}

export const EVIDENCE_DATABASE: Record<EvidenceType, EvidenceInfo> = {
  'EMF Level 5': {
    id: 'emf-level-5',
    name: 'EMF Level 5',
    emoji: '📡',
    description: 'The EMF Reader detects electromagnetic fields. EMF Level 5 is the strongest reading indicating ghost presence.',
    howToCollect: [
      'Hold an EMF Reader in your hand during an active investigation',
      'Wait for the ghost to interact with the environment (knock, move objects, etc.)',
      'Watch the EMF Reader screen for spikes',
      'You need to see 5 consecutive spikes for a confirmed reading',
      'The ghost must be actively triggered to produce readings',
    ],
    tips: [
      'Ghost must be triggered or active for best results',
      'More reliable during active ghost events',
      'Appears as red spikes on the EMF Reader display',
      'Works for approximately 50% of all ghosts',
      'No sanity drain from detecting EMF',
      'Easiest evidence type to collect',
      'Works through walls and floors',
    ],
    equipment: ['EMF Reader'],
    difficulty: 'Easy',
    rarity: 50,
    ghostsWithThis: ['Spirit', 'Wraith', 'Jinn', 'Shade', 'Oni', 'Myling', 'Onryo', 'Raiju', 'Obake', 'Banshee'],
    ghostsWithoutThis: ['Phantom', 'Poltergeist', 'Mare', 'Revenant', 'Demon', 'Yurei', 'Doppelgänger', 'Hantu', 'Moroi', 'Deogen', 'Twins', 'Gorgon', 'Mimic', 'Goryo'],
    commonMistakes: [
      'Confusing EMF Level 5 with lower readings (EMF 2 or 3)',
      'Not waiting long enough for ghost to be active',
      'Expecting continuous readings instead of spikes',
      'Holding reader too close to electrical appliances',
    ],
    visualIndicators: [
      'Five red spikes in sequence on EMF Reader',
      'Audible beeping sounds from EMF Reader',
      'Visual pattern appearing on device screen',
    ],
  },
  'D.O.T.S. Projector': {
    id: 'dots-projector',
    name: 'D.O.T.S. Projector',
    emoji: '🔴',
    description: 'The D.O.T.S. Projector creates a grid of laser dots. Ghosts can disrupt this grid when manifesting.',
    howToCollect: [
      'Place D.O.T.S. Projector in a room where you suspect ghost activity',
      'Activate the projector to create the laser grid',
      'Watch the grid for disruptions or disturbances',
      'You may need to trigger the ghost with sounds or interactions',
      'Confirmed when you see the ghostly figure moving through the grid',
    ],
    tips: [
      'Best placed in small to medium-sized rooms',
      'Requires line of sight to work properly',
      'Ghost must be actively manifesting to see disruption',
      'The ghost appears as a silhouette in the grid',
      'Works best in darker environments',
      'Medium difficulty - requires observation skills',
      'Ghost often appears as a humanoid or animal shape',
    ],
    equipment: ['D.O.T.S. Projector'],
    difficulty: 'Medium',
    rarity: 38,
    ghostsWithThis: ['Wraith', 'Yurei', 'Moroi', 'Deogen', 'Goryo'],
    ghostsWithoutThis: ['Spirit', 'Phantom', 'Poltergeist', 'Jinn', 'Shade', 'Oni', 'Myling', 'Onryo', 'Mare', 'Revenant', 'Demon', 'Doppelgänger', 'Hantu', 'Raiju', 'Obake', 'Banshee', 'Twins', 'Gorgon', 'Mimic'],
    commonMistakes: [
      'Placing in too large a room (grid spread too thin)',
      'Not waiting long enough for ghost to manifest',
      'Confusing dust or environmental particles for ghost',
      'Placing where ghosts cannot reach',
    ],
    visualIndicators: [
      'Visible distortion in the laser grid pattern',
      'Silhouette of ghostly figure appearing in dots',
      'Grid suddenly breaks or scatters',
      'Glowing figure moving through the projected dots',
    ],
  },
  'Ultraviolet': {
    id: 'ultraviolet',
    name: 'Ultraviolet',
    emoji: '🔦',
    description: 'Ultraviolet light reveals fingerprints, footprints, and residue left by certain ghosts.',
    howToCollect: [
      'Use a UV Light to scan surfaces around the investigation area',
      'Sweep the light across walls, doors, and objects',
      'Look for glowing fingerprints or ghostly residue',
      'Check areas where ghosts were spotted or objects were moved',
      'The residue glows purple/violet under UV light',
    ],
    tips: [
      'Check high-traffic areas and doorways',
      'Look for handprints and fingerprints on surfaces',
      'Often appears on walls, doors, and grabbed objects',
      'Residue fades over time',
      'Works through any solid surface',
      'Medium difficulty - requires systematic searching',
      'Also shows footprints and body impressions',
    ],
    equipment: ['UV Light'],
    difficulty: 'Medium',
    rarity: 29,
    ghostsWithThis: ['Phantom', 'Jinn', 'Raiju', 'Hantu', 'Gorgon', 'Mimic'],
    ghostsWithoutThis: ['Spirit', 'Wraith', 'Poltergeist', 'Shade', 'Oni', 'Myling', 'Onryo', 'Mare', 'Revenant', 'Demon', 'Yurei', 'Doppelgänger', 'Moroi', 'Deogen', 'Obake', 'Banshee', 'Twins', 'Goryo'],
    commonMistakes: [
      'Confusing natural dust or reflections with UV residue',
      'Not using UV light in dark enough environment',
      'Expecting continuous glows instead of spots',
      'Searching too quickly without thorough coverage',
    ],
    visualIndicators: [
      'Purple/violet glowing fingerprints',
      'Bright glowing residue on surfaces',
      'Handprints appearing on walls or doors',
      'Footprints glowing on floors or stairs',
    ],
  },
  'Ghost Orb': {
    id: 'ghost-orb',
    name: 'Ghost Orb',
    emoji: '⭕',
    description: 'A ghostly sphere seen on video cameras. Indicates certain ghosts possess this property.',
    howToCollect: [
      'Set up video Cameras in rooms with suspected ghost activity',
      'Review the footage for glowing orbs or spheres',
      'Orbs often appear briefly during ghost activity',
      'Watch for small glowing balls moving independently',
      'Sometimes appears multiple times in same footage',
    ],
    tips: [
      'Requires Video Camera equipment to detect',
      'Most reliable when placed in ghost\'s favorite room',
      'Orbs appear as bright glowing spheres on video',
      'May see several orbs, or just one',
      'Often seen just before or during ghost activity',
      'Medium-to-hard difficulty - requires monitoring footage',
      'Can appear at any time during investigation',
    ],
    equipment: ['Video Camera'],
    difficulty: 'Medium',
    rarity: 33,
    ghostsWithThis: ['Spirit', 'Jinn', 'Shade', 'Demon', 'Yurei', 'Doppelgänger', 'Moroi', 'Twins', 'Mimic'],
    ghostsWithoutThis: ['Wraith', 'Phantom', 'Poltergeist', 'Oni', 'Myling', 'Onryo', 'Mare', 'Revenant', 'Hantu', 'Raiju', 'Obake', 'Banshee', 'Gorgon', 'Deogen', 'Goryo'],
    commonMistakes: [
      'Confusing dust particles with ghost orbs',
      'Not checking video footage carefully enough',
      'Expecting orbs to be obviously visible',
      'Placing cameras without watching footage',
    ],
    visualIndicators: [
      'Bright glowing sphere on video feed',
      'Orb moving independently around room',
      'Multiple orbs appearing together',
      'Opalescent or translucent spherical object',
    ],
  },
  'Ghost Writing': {
    id: 'ghost-writing',
    name: 'Ghost Writing',
    emoji: '✍️',
    description: 'Ghosts can write messages in Ghost Writing Books left in specific locations.',
    howToCollect: [
      'Place a Ghost Writing Book in a room where ghosts are active',
      'The ghost may write in the book if triggered or during activity',
      'Check the book periodically for writings',
      'Writing appears as dark scribbles or words',
      'Take note of location where book is found written in',
    ],
    tips: [
      'Ghost Writing often appears quickly in high-activity rooms',
      'Place book in ghost\'s favorite room for best results',
      'Some ghosts write more frequently than others',
      'Writing can appear at any time during investigation',
      'Book can be picked up and moved to different rooms',
      'Easy difficulty but requires patience',
      'Writing is often illegible but clearly visible',
    ],
    equipment: ['Ghost Writing Book'],
    difficulty: 'Easy',
    rarity: 38,
    ghostsWithThis: ['Spirit', 'Poltergeist', 'Shade', 'Oni', 'Myling', 'Onryo', 'Mare', 'Revenant', 'Demon', 'Doppelgänger', 'Moroi', 'Goryo'],
    ghostsWithoutThis: ['Wraith', 'Phantom', 'Jinn', 'Yurei', 'Hantu', 'Raiju', 'Obake', 'Banshee', 'Gorgon', 'Deogen', 'Twins', 'Mimic'],
    commonMistakes: [
      'Placing book in wrong room (where ghost won\'t go)',
      'Not waiting long enough for writing to appear',
      'Confusing old writing with new',
      'Expecting writing to be clear and readable',
    ],
    visualIndicators: [
      'Dark scribbles or marks in Ghost Writing Book',
      'Written words (even if illegible)',
      'Clear handwriting or ghostly script',
      'Smudged or rushed writing patterns',
    ],
  },
  'Spirit Box': {
    id: 'spirit-box',
    name: 'Spirit Box',
    emoji: '📻',
    description: 'Communication device that allows ghosts to respond through radio frequency. Responses are often cryptic or angry.',
    howToCollect: [
      'Turn on the Spirit Box to activate it',
      'Ask the ghost questions in the room where Spirit Box is active',
      'Listen for ghost responses through the Spirit Box speaker',
      'Responses often sound like voices in static',
      'Ghost will respond to direct questions or accusations',
    ],
    tips: [
      'Ghost must be in the same room to hear response',
      'Speak clearly and ask direct questions',
      'Some ghosts respond more frequently than others',
      'Can hear words like "hello", "no", "yes", or angry shouts',
      'Medium difficulty - requires listening skills',
      'Response sounds like voice emerging from static',
      'Drains sanity slightly when hearing responses',
    ],
    equipment: ['Spirit Box'],
    difficulty: 'Medium',
    rarity: 33,
    ghostsWithThis: ['Spirit', 'Wraith', 'Poltergeist', 'Jinn', 'Oni', 'Myling', 'Onryo', 'Raiju', 'Obake', 'Banshee'],
    ghostsWithoutThis: ['Phantom', 'Shade', 'Mare', 'Revenant', 'Demon', 'Yurei', 'Doppelgänger', 'Hantu', 'Gorgon', 'Deogen', 'Moroi', 'Twins', 'Mimic', 'Goryo'],
    commonMistakes: [
      'Expecting clear English phrases',
      'Not being in the same room as ghost',
      'Confusing background noise with spirit responses',
      'Not asking direct questions',
    ],
    visualIndicators: [
      'Voice sounds emerging from radio static',
      'Clearer than background noise but still distorted',
      'Recognizable human-like sounds',
      'Emotional tone in the voice (angry, sad, etc.)',
    ],
  },
  'Freezing Temperatures': {
    id: 'freezing-temperatures',
    name: 'Freezing Temperatures',
    emoji: '❄️',
    description: 'Certain ghosts lower room temperatures. A Thermometer detects these drops below freezing.',
    howToCollect: [
      'Use a Thermometer to measure room temperature',
      'Track temperature changes in different rooms',
      'Look for drops below freezing (32°F / 0°C)',
      'Temperature drop indicates ghost presence',
      'Take readings in multiple rooms for comparison',
    ],
    tips: [
      'Best detected in smaller, enclosed rooms',
      'Temperature drops most near ghost location',
      'Can take time to see significant temperature change',
      'Some ghosts cause more dramatic drops than others',
      'Medium difficulty - requires systematic measurement',
      'Easy to confirm once you see the drop',
      'Check room gradually to catch temperature change',
    ],
    equipment: ['Thermometer'],
    difficulty: 'Medium',
    rarity: 29,
    ghostsWithThis: ['Mare', 'Revenant', 'Hantu', 'Twins', 'Goryo'],
    ghostsWithoutThis: ['Spirit', 'Wraith', 'Phantom', 'Poltergeist', 'Jinn', 'Shade', 'Oni', 'Myling', 'Onryo', 'Demon', 'Yurei', 'Doppelgänger', 'Raiju', 'Obake', 'Banshee', 'Gorgon', 'Deogen', 'Moroi', 'Mimic'],
    commonMistakes: [
      'Not establishing baseline room temperature first',
      'Confusing natural cold spots with ghost presence',
      'Not checking all rooms for comparison',
      'Expecting instantaneous temperature drops',
    ],
    visualIndicators: [
      'Thermometer reading drops significantly',
      'Display shows below-freezing temperature',
      'Visible breath or frost formation in room',
      'Sustained temperature drop in ghost\'s presence',
    ],
  },
};

/**
 * Equipment to Evidence mapping
 * Shows which equipment detects which evidence
 */
export const EQUIPMENT_TO_EVIDENCE: Record<string, EvidenceType[]> = {
  'EMF Reader': ['EMF Level 5'],
  'D.O.T.S. Projector': ['D.O.T.S. Projector'],
  'UV Light': ['Ultraviolet'],
  'Video Camera': ['Ghost Orb'],
  'Ghost Writing Book': ['Ghost Writing'],
  'Spirit Box': ['Spirit Box'],
  'Thermometer': ['Freezing Temperatures'],
};

/**
 * All evidence types in order
 */
export const ALL_EVIDENCE_TYPES: EvidenceType[] = [
  'EMF Level 5',
  'D.O.T.S. Projector',
  'Ultraviolet',
  'Ghost Orb',
  'Ghost Writing',
  'Spirit Box',
  'Freezing Temperatures',
];

/**
 * Ghost identification hints and tips
 */
export const IDENTIFICATION_TIPS = {
  getting_started: [
    'Start by collecting at least 2 pieces of evidence',
    'Collect evidence in high-activity areas first',
    'Use equipment systematically to gather data',
  ],
  troubleshooting: [
    'If evidence contradicts: double-check your findings',
    'Some evidence is harder to collect than others',
    'Be patient - ghost activity is not constant',
  ],
  speedrunning: [
    'Focus on the fastest evidence types first',
    'Eliminate ghosts strategically',
    'Narrow down to one ghost quickly for efficiency',
  ],
};

/**
 * Contract difficulty recommendations
 */
export const CONTRACT_DIFFICULTIES = {
  amateur: {
    ghostOptions: 5,
    timeLimit: 5,
    evidenceRequired: 1,
    sanityDrainMultiplier: 0.5,
  },
  intermediate: {
    ghostOptions: 10,
    timeLimit: 10,
    evidenceRequired: 2,
    sanityDrainMultiplier: 1,
  },
  professional: {
    ghostOptions: 15,
    timeLimit: 15,
    evidenceRequired: 2,
    sanityDrainMultiplier: 1.5,
  },
  nightmare: {
    ghostOptions: 24,
    timeLimit: 20,
    evidenceRequired: 3,
    sanityDrainMultiplier: 2,
  },
};
