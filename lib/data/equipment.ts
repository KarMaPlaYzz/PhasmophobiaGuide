/**
 * Equipment Database
 * All purchasable equipment, cursed possessions, and truck equipment
 * Includes pricing, tiers, synergies, and recommendations
 */

import { Equipment } from '@/lib/types';

// ============================================================================
// STARTER EQUIPMENT (Always available, 1 of each included free)
// ============================================================================

export const STARTER_EQUIPMENT: Record<string, Equipment> = {
  'emf-reader': {
    id: 'emf-reader',
    name: 'EMF Reader',
    category: 'starter',
    type: 'detector',
    cost: 45,
    capacity: 2,
    description:
      'A device that detects electromagnetic fields. Used to locate the presence of a ghost and gather EMF Level 5 evidence.',
    usage:
      'Hold in hand and watch for spikes. EMF Level 5 appears when ghost interacts while EMF is held. Up to 5 spikes indicate level 5 evidence.',
    unlocksAtLevel: 0,
    detects: ['EMF Level 5'],
    consumable: false,
    tiers: [
      { level: 18, upgradeCost: 3000 },
      { level: 46, upgradeCost: 4500 },
    ],
    recommendedFor: [
      'All ghost types with EMF evidence',
      'First-time players (reliable)',
      'Active ghosts',
    ],
    imageUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/1/1d/EMF090_T1.png/revision/latest?cb=20230822153119',
  },

  'spirit-box': {
    id: 'spirit-box',
    name: 'Spirit Box',
    category: 'starter',
    type: 'audio',
    cost: 50,
    capacity: 2,
    description:
      'A device that connects to the ghost world through radio frequencies. The ghost can communicate through white noise.',
    usage:
      'Ask questions and listen for responses. Ghost must be triggered first (events, low sanity). Responses are EVP evidence.',
    unlocksAtLevel: 0,
    detects: ['Spirit Box'],
    consumable: false,
    tiers: [
      { level: 23, upgradeCost: 3000 },
      { level: 46, upgradeCost: 3000 },
    ],
    recommendedFor: [
      'Communication with ghosts',
      'Ghost identification',
      'Evidence collection',
    ],
    imageUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/a/ae/SpiritBox090_T1.png/revision/latest?cb=20230822153548',
  },

  'thermometer': {
    id: 'thermometer',
    name: 'Thermometer',
    category: 'starter',
    type: 'detector',
    cost: 30,
    capacity: 2,
    description:
      'A thermometer that measures temperature changes. Used to detect cold spots and gather Freezing Temperatures evidence.',
    usage:
      'Hold in hand and watch for temperature drops. Freezing Temperatures evidence appears when temperature drops below 10°C.',
    unlocksAtLevel: 0,
    detects: ['Freezing Temperatures'],
    consumable: false,
    tiers: [
      { level: 27, upgradeCost: 3000 },
      { level: 65, upgradeCost: 3000 },
    ],
    recommendedFor: [
      'Cold ghost detection',
      'Freezing temperature evidence',
      'Ghost identification',
    ],
    imageUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/1/1c/Thermometer090_T1.png/revision/latest?cb=20230822153607',
  },

  'ghost-writing-book': {
    id: 'ghost-writing-book',
    name: 'Ghost Writing Book',
    category: 'starter',
    type: 'detector',
    cost: 40,
    capacity: 2,
    description:
      'A blank book where ghosts can write messages. Place in haunted location to gather Ghost Writing evidence.',
    usage:
      'Place on ground in ghost room. Ghost will write in book when it manifests. Writing appears as visible text in book.',
    unlocksAtLevel: 0,
    detects: ['Ghost Writing'],
    consumable: false,
    tiers: [
      { level: 23, upgradeCost: 3000 },
      { level: 55, upgradeCost: 3000 },
    ],
    recommendedFor: [
      'Writing ghosts',
      'Ghost identification',
      'Passive evidence collection',
    ],
    imageUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/a/a2/WritingBook090_T1.png/revision/latest?cb=20230822153748',
  },

  'uv-light': {
    id: 'uv-light',
    name: 'UV Flashlight',
    category: 'starter',
    type: 'detector',
    cost: 35,
    capacity: 2,
    description:
      'An ultraviolet light that reveals fingerprints and footprints left by ghosts. Used to detect Ultraviolet evidence.',
    usage:
      'Shine on surfaces where ghost touched. Fingerprints appear as glowing marks. Look on doors, walls, and equipment.',
    unlocksAtLevel: 0,
    detects: ['Ultraviolet'],
    consumable: false,
    tiers: [
      { level: 18, upgradeCost: 3000 },
      { level: 46, upgradeCost: 2000 },
    ],
    recommendedFor: [
      'Fingerprint collection',
      'Surface examination',
      'Ghost path tracking',
    ],
    imageUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/0/0b/UV090_T2.png/revision/latest?cb=20230822153654',
  },

  'video-camera': {
    id: 'video-camera',
    name: 'Video Camera',
    category: 'starter',
    type: 'camera',
    cost: 50,
    capacity: 4,
    description:
      'A camera that records video to the truck monitor. Can detect Ghost Orbs and D.O.T.S silhouettes through video feed.',
    usage:
      'Place on tripod or mount on wall. Monitor truck screen to watch feed. Ghost Orbs appear as white spheres on video.',
    unlocksAtLevel: 0,
    detects: ['Ghost Orb'],
    consumable: false,
    tiers: [
      { level: 27, upgradeCost: 3000 },
      { level: 49, upgradeCost: 3000 },
    ],
    recommendedFor: [
      'Orb ghosts',
      'Remote monitoring',
      'Safe evidence collection',
    ],
    imageUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/d/d4/VideoCamera090_T1.png/revision/latest?cb=20230822153721',
  },

    'dots-projector': {
    id: 'dots-projector',
    name: 'D.O.T.S. Projector',
    category: 'starter',
    type: 'detector',
    cost: 65,
    capacity: 2,
    description:
      'A device that projects a laser matrix to make ghosts visible. Used to collect D.O.T.S evidence and track ghost movement.',
    usage:
      'Place in rooms where ghost activity is suspected. When ghost moves through the laser grid, a silhouette becomes visible.',
    unlocksAtLevel: 0,
    detects: ['D.O.T.S. Projector'],
    consumable: false,
    tiers: [
      { level: 27, upgradeCost: 3000 },
      { level: 49, upgradeCost: 4500 },
    ],
    recommendedFor: [
      'Visual ghost tracking',
      'Evidence confirmation',
      'Ghost activity monitoring',
    ],
    imageUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/0/08/DOTS090_T1.png/revision/latest?cb=20230822153100',
  },

  flashlight: {
    id: 'flashlight',
    name: 'Flashlight',
    category: 'starter',
    type: 'utility',
    cost: 30,
    capacity: 4,
    description: 'A standard flashlight for illumination. Can malfunction during ghost activity.',
    usage:
      'Provides light in dark areas. Can be turned on/off. Will flicker and fail during ghost events.',
    unlocksAtLevel: 0,
    detects: undefined,
    consumable: false,
    tiers: [
      { level: 18, upgradeCost: 3000 },
      { level: 34, upgradeCost: 3000 },
    ],
    recommendedFor: [
      'Navigation',
      'Basic illumination',
      'All playstyles',
    ],
    imageUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/4/43/Flash090_T1.png/revision/latest?cb=20230822153200',
  },
};

// ============================================================================
// OPTIONAL EQUIPMENT (Must be purchased)
// ============================================================================

export const OPTIONAL_EQUIPMENT: Record<string, Equipment> = {
  crucifix: {
    id: 'crucifix',
    name: 'Crucifix',
    category: 'optional',
    type: 'protective',
    cost: 30,
    capacity: 2,
    description:
      'A crucifix that prevents ghosts from hunting nearby. Place strategically to block hunts.',
    usage:
      'Place on ground near ghost spawn. Creates 3m protection radius (5m for Banshee). Consumed when ghost attempts to hunt nearby. One-time use per crucifix.',
    unlocksAtLevel: 7,
    detects: undefined,
    consumable: true,
    tiers: [
      { level: 34, upgradeCost: 4000 },
      { level: 80, upgradeCost: 20000 },
    ],
    recommendedFor: [
      'Hunt prevention',
      'Beginner safety',
      'Difficult ghosts',
    ],
    imageUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/1/11/Crucifix090_T1.png/revision/latest?cb=20230822153036',
  },

  salt: {
    id: 'salt',
    name: 'Salt',
    category: 'optional',
    type: 'consumable',
    cost: 15,
    capacity: 3,
    description:
      'Salt piles that ghosts interact with to leave footprints. Used to track ghost movement patterns.',
    usage:
      'Place salt piles in high-traffic areas. Ghost will walk through and leave footprints visible with UV light.',
    unlocksAtLevel: 8,
    detects: ['Ultraviolet'],
    consumable: true,
    tiers: [
      { level: 39, upgradeCost: 2500 },
      { level: 65, upgradeCost: 5000 },
    ],
    recommendedFor: [
      'Footprint tracking',
      'Ghost path identification',
      'Wraith detection (no footprints)',
    ],
    imageUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/6/60/Salt090_T1.png/revision/latest?cb=20230822153506',
  },

  'sanity-medication': {
    id: 'sanity-medication',
    name: 'Sanity Medication',
    category: 'optional',
    type: 'consumable',
    cost: 20,
    capacity: 4,
    description:
      'Medication that restores player sanity. Amount restored depends on difficulty level.',
    usage:
      'Hold in inventory and consume when sanity is low. Restores: Amateur 100%, Intermediate 75%, Professional 50%, Nightmare/Insanity 25%.',
    unlocksAtLevel: 14,
    detects: undefined,
    consumable: true,
    tiers: [
      { level: 39, upgradeCost: 2000 },
      { level: 75, upgradeCost: 5000 },
    ],
    recommendedFor: [
      'Sanity management',
      'Hunt prevention',
      'Extended contracts',
    ],
    imageUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/1/1e/Med090_T1.png/revision/latest?cb=20230822153336',
  },

  incense: {
    id: 'incense',
    name: 'Incense',
    category: 'optional',
    type: 'protective',
    cost: 15,
    capacity: 4,
    description:
      'Incense sticks that prevent ghosts from hunting temporarily. Also blinds ghost during hunts.',
    usage:
      'Light with igniter. Prevents hunt for 60-120 seconds depending on difficulty. Can be used during hunts to blind ghost.',
    unlocksAtLevel: 14,
    detects: undefined,
    consumable: true,
    tiers: [
      { level: 37, upgradeCost: 3500 },
      { level: 80, upgradeCost: 15000 },
    ],
    recommendedFor: [
      'Hunt prevention',
      'Hunt evasion',
      'Emergency defense',
    ],
    imageUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/a/ae/Incense090_T1.png/revision/latest?cb=20230822153317',
  },

  igniter: {
    id: 'igniter',
    name: 'Igniter',
    category: 'optional',
    type: 'utility',
    cost: 10,
    capacity: 4,
    description: 'Lighter for starting fires. Used to light incense and firelight.',
    usage:
      'Hold incense or firelight and use igniter to light. Can also use on campfires in maps like Maple Lodge and Camp Woodwind.',
    unlocksAtLevel: 12,
    detects: undefined,
    consumable: true,
    tiers: [
      { level: 37, upgradeCost: 500 },
      { level: 52, upgradeCost: 750 },
    ],
    recommendedFor: [
      'Incense usage',
      'Firelight usage',
      'General utility',
    ],
    imageUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/0/00/Igniter090_T1.png/revision/latest?cb=20230822153300',
  },

  firelight: {
    id: 'firelight',
    name: 'Firelight',
    category: 'optional',
    type: 'utility',
    cost: 15,
    capacity: 4,
    description:
      'A portable campfire that prevents sanity drain and can prevent Onryo hunts when lit.',
    usage:
      'Light with igniter. Provides warmth and light. Reduces sanity drain by 20% (Tier I), 30% (Tier II), or 40% (Tier III) based on tier.',
    unlocksAtLevel: 12,
    detects: undefined,
    consumable: true,
    tiers: [
      { level: 37, upgradeCost: 3000 },
      { level: 75, upgradeCost: 10000 },
    ],
    recommendedFor: [
      'Sanity preservation',
      'Comfort/light source',
      'Onryo prevention',
    ],
    imageUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/3/37/FireLight090_T1.png/revision/latest?cb=20230822153139',
  },

  'photo-camera': {
    id: 'photo-camera',
    name: 'Photo Camera',
    category: 'optional',
    type: 'camera',
    cost: 40,
    capacity: 3,
    description:
      'Camera for taking photos of ghosts and environmental evidence. Earn money for photos.',
    usage:
      'Take photos of: ghosts, dead bodies, bone evidence, interactions, fingerprints. Earn $5-15 per photo depending on type.',
    unlocksAtLevel: 2,
    detects: undefined,
    consumable: false,
    tiers: [
      { level: 23, upgradeCost: 3000 },
      { level: 55, upgradeCost: 5000 },
    ],
    recommendedFor: [
      'Extra income',
      'Evidence documentation',
      'Photo challenges',
    ],
    imageUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/5/59/PhotoCamera090_T1.png/revision/latest?cb=20230822153435',
  },

  'parabolic-microphone': {
    id: 'parabolic-microphone',
    name: 'Parabolic Microphone',
    category: 'optional',
    type: 'audio',
    cost: 50,
    capacity: 2,
    description:
      'Long-range microphone for detecting paranormal sounds. Hears ghost whispers and voices.',
    usage:
      'Hold and listen for paranormal sounds. Ghosts produce sounds every 80-127 seconds. Myling produces them every 64-127 seconds.',
    unlocksAtLevel: 5,
    detects: undefined,
    consumable: false,
    tiers: [
      { level: 32, upgradeCost: 3000 },
      { level: 70, upgradeCost: 5000 },
    ],
    recommendedFor: [
      'Audio evidence gathering',
      'Myling identification',
      'Ghost activity monitoring',
    ],
    imageUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/c/c1/Parabolic090_T1.png/revision/latest?cb=20241127123220',
  },

  'sound-recorder': {
    id: 'sound-recorder',
    name: 'Sound Recorder',
    category: 'optional',
    type: 'audio',
    cost: 30,
    capacity: 2,
    description:
      'Records paranormal sounds from the environment. Captures EVP evidence.',
    usage:
      'Hold in ghost room. Records environmental sounds and ghost vocalizations. Review recordings later for evidence.',
    unlocksAtLevel: 4,
    detects: undefined,
    consumable: false,
    tiers: [
      { level: 39, upgradeCost: 3000 },
      { level: 60, upgradeCost: 5000 },
    ],
    recommendedFor: [
      'Audio evidence',
      'Backup evidence gathering',
      'Vocal ghost detection',
    ],
    imageUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/0/01/SoundRecorder_T1.png/revision/latest?cb=20250704191450',
  },

  'sound-sensor': {
    id: 'sound-sensor',
    name: 'Sound Sensor',
    category: 'optional',
    type: 'detector',
    cost: 80,
    capacity: 4,
    description:
      'Detects near-inaudible sounds and relays data to truck monitor.',
    usage:
      'Place in ghost room. Detects ghost activity and displays on truck sound monitor. Shows activity levels.',
    unlocksAtLevel: 10,
    detects: undefined,
    consumable: false,
    tiers: [
      { level: 32, upgradeCost: 3000 },
      { level: 52, upgradeCost: 1500 },
    ],
    recommendedFor: [
      'Remote activity monitoring',
      'Data collection',
      'Advanced tracking',
    ],
    imageUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/4/4d/SoundSensor090_T1.png/revision/latest?cb=20230822153530',
  },

  'motion-sensor': {
    id: 'motion-sensor',
    name: 'Motion Sensor',
    category: 'optional',
    type: 'detector',
    cost: 100,
    capacity: 4,
    description:
      'Most expensive equipment. Detects movement from both ghosts and players.',
    usage:
      'Place in hallways/pathways. Flashes light when motion detected. Data relayed to truck motion monitor.',
    unlocksAtLevel: 3,
    detects: undefined,
    consumable: false,
    tiers: [
      { level: 42, upgradeCost: 2500 },
      { level: 70, upgradeCost: 8000 },
    ],
    recommendedFor: [
      'Ghost tracking',
      'Room boundaries',
      'Hunt alerts',
    ],
    imageUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/5/52/MotionSensor090_T1.png/revision/latest?cb=20230822153355',
  },

  tripod: {
    id: 'tripod',
    name: 'Tripod',
    category: 'optional',
    type: 'utility',
    cost: 25,
    capacity: 4,
    description:
      'Mount for video cameras. Reduces chance ghost will throw camera during hunts.',
    usage:
      'Place camera on tripod instead of holding. Mounted cameras have lower throwable priority for ghosts.',
    unlocksAtLevel: 9,
    detects: undefined,
    consumable: false,
    tiers: [
      { level: 34, upgradeCost: 5000 },
      { level: 60, upgradeCost: 3000 },
    ],
    recommendedFor: [
      'Camera protection',
      'Hands-free recording',
      'Orb detection',
    ],
    imageUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/b/bd/Tripod090_T1.png/revision/latest?cb=20230822153630',
  },

  'head-gear': {
    id: 'head-gear',
    name: 'Head Gear',
    category: 'optional',
    type: 'camera',
    cost: 60,
    capacity: 4,
    description:
      'Head-mounted camera that provides video feed. Can detect Ghost Orbs like video camera.',
    usage:
      'Equip on head. Provides first-person video feed to truck. Useful for hands-free evidence gathering.',
    unlocksAtLevel: 13,
    detects: ['Ghost Orb'],
    consumable: false,
    tiers: [
      { level: 42, upgradeCost: 10000 },
      { level: 80, upgradeCost: 10000 },
    ],
    recommendedFor: [
      'Hands-free monitoring',
      'Orb detection',
      'Solo playstyle',
    ],
    imageUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/b/b8/HeadGear090_T1.png/revision/latest?cb=20230822153239',
  },
};

// ============================================================================
// TRUCK EQUIPMENT (Stationary, built-in to truck)
// ============================================================================

export const TRUCK_EQUIPMENT: Record<string, Equipment> = {
  'objective-board': {
    id: 'objective-board',
    name: 'Objective Board',
    category: 'truck',
    type: 'utility',
    cost: 0,
    capacity: 1,
    description: 'Displays all mandatory and optional objectives for the contract.',
    usage: 'Board on truck wall. Shows objectives to complete for payment.',
    unlocksAtLevel: 0,
    detects: undefined,
    consumable: false,
    tiers: [],
    recommendedFor: ['Objective tracking', 'Mission planning'],
    imageUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/7/7f/ObjectiveBoard.png/revision/latest?cb=20250627175457',
  },

  'site-map': {
    id: 'site-map',
    name: 'Site Map',
    category: 'truck',
    type: 'utility',
    cost: 0,
    capacity: 1,
    description: 'Provides detailed map of location with room layouts.',
    usage: 'Monitor on truck. Shows all rooms, doors, windows, and layout.',
    unlocksAtLevel: 0,
    detects: undefined,
    consumable: false,
    tiers: [],
    recommendedFor: ['Navigation', 'Location planning'],
    imageUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/1/13/Site_map_0.6.png/revision/latest?cb=20220408034152',
  },

  'sanity-monitor': {
    id: 'sanity-monitor',
    name: 'Sanity Monitor',
    category: 'truck',
    type: 'detector',
    cost: 0,
    capacity: 1,
    description: 'Real-time display of all players sanity levels.',
    usage: 'Monitor on truck. Shows individual and average team sanity.',
    unlocksAtLevel: 0,
    detects: undefined,
    consumable: false,
    tiers: [],
    recommendedFor: ['Sanity tracking', 'Hunt prediction'],
    imageUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/b/b9/Sanity_monitor_0.6.png/revision/latest?cb=20220411120049',
  },

  'site-activity-monitor': {
    id: 'site-activity-monitor',
    name: 'Site Activity Monitor',
    category: 'truck',
    type: 'detector',
    cost: 0,
    capacity: 1,
    description: 'Displays ghost activity and hunt alerts.',
    usage: 'Monitor on truck. Shows when ghost events and hunts occur.',
    unlocksAtLevel: 0,
    detects: undefined,
    consumable: false,
    tiers: [],
    recommendedFor: ['Activity tracking', 'Hunt alerts'],
    imageUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/8/80/Site_activity_monitor_0.6.png/revision/latest?cb=20220408034106',
  },

  computer: {
    id: 'computer',
    name: 'Computer',
    category: 'truck',
    type: 'camera',
    cost: 0,
    capacity: 1,
    description: 'Main computer for viewing all video camera feeds.',
    usage: 'Access on truck. View multiple video camera feeds simultaneously.',
    unlocksAtLevel: 0,
    detects: undefined,
    consumable: false,
    tiers: [],
    recommendedFor: ['Remote monitoring', 'Orb detection'],
    imageUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/0/02/Computer.png/revision/latest?cb=20250627163211',
  },

  'sound-monitor': {
    id: 'sound-monitor',
    name: 'Sound Monitor',
    category: 'truck',
    type: 'audio',
    cost: 0,
    capacity: 1,
    description: 'Connects to Sound Sensors placed on site.',
    usage: 'Monitor on truck. Displays data from sound sensors.',
    unlocksAtLevel: 0,
    detects: undefined,
    consumable: false,
    tiers: [],
    recommendedFor: ['Audio monitoring', 'Activity tracking'],
    imageUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/5/5a/Sound_monitor_0.6.png/revision/latest?cb=20220408034224',
  },

  clipboards: {
    id: 'clipboards',
    name: 'Clipboards',
    category: 'truck',
    type: 'utility',
    cost: 0,
    capacity: 1,
    description: 'Shows current daily and weekly tasks.',
    usage: 'Board on truck. Displays active daily/weekly challenges.',
    unlocksAtLevel: 0,
    detects: undefined,
    consumable: false,
    tiers: [],
    recommendedFor: ['Task tracking', 'Challenges'],
    imageUrl: '',
  },

  'setup-timer': {
    id: 'setup-timer',
    name: 'Setup Timer',
    category: 'truck',
    type: 'utility',
    cost: 0,
    capacity: 1,
    description: 'Displays remaining time in the setup phase before the ghost can hunt.',
    usage: 'Timer on truck. Starts when the exit door is opened. Shows setup phase duration.',
    unlocksAtLevel: 0,
    detects: undefined,
    consumable: false,
    tiers: [],
    recommendedFor: ['Time management', 'Hunt preparation'],
    imageUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/8/8d/SetupTimer.png/revision/latest?cb=20250627162053',
  },
};

// ============================================================================
// CURSED POSSESSIONS (Interactive items, not purchased)
// ============================================================================

export const CURSED_POSSESSIONS: Record<string, Equipment> = {
  'ouija-board': {
    id: 'ouija-board',
    name: 'Ouija Board',
    category: 'cursed',
    type: 'cursed',
    cost: 0,
    capacity: 1,
    description:
      'Ancient board for communicating with spirits. Interaction drains sanity significantly.',
    usage:
      'Found on location. Ask questions about ghost. Each question costs sanity: Yes=40%, No=40%, Maybe=20%, Attack=100%.',
    unlocksAtLevel: 0,
    detects: undefined,
    consumable: false,
    tiers: [],
    recommendedFor: ['Ghost communication', 'Sanity risk', 'Challenge'],
    imageUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/2/2f/Ouija_Board_New.png/revision/latest?cb=20211210172553',
  },

  'tarot-cards': {
    id: 'tarot-cards',
    name: 'Tarot Cards',
    category: 'cursed',
    type: 'cursed',
    cost: 0,
    capacity: 1,
    description: 'Draw cards for mysterious effects. Highly unpredictable.',
    usage:
      'Found on location. Draw card. The Sun=+100% sanity, The Moon=-100% sanity, Wheel=±25% sanity. Other cards have various effects.',
    unlocksAtLevel: 0,
    detects: undefined,
    consumable: false,
    tiers: [],
    recommendedFor: ['Gamble', 'Risky sanity management', 'Challenge'],
    imageUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/a/a7/Tarot_Cards.png/revision/latest?cb=20211210181436',
  },

  'music-box': {
    id: 'music-box',
    name: 'Music Box',
    category: 'cursed',
    type: 'cursed',
    cost: 0,
    capacity: 1,
    description: 'Plays eerie music. Nearby players lose sanity continuously.',
    usage:
      'Found on location. When activated, plays music. Nearby players drain 2.5% sanity per second within 2.5m radius.',
    unlocksAtLevel: 0,
    detects: undefined,
    consumable: false,
    tiers: [],
    recommendedFor: ['Sanity drain', 'Haunting', 'Forced hunts'],
    imageUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/5/5f/Music_box_display.jpg/revision/latest?cb=20230131144318',
  },

  'haunted-mirror': {
    id: 'haunted-mirror',
    name: 'Haunted Mirror',
    category: 'cursed',
    type: 'cursed',
    cost: 0,
    capacity: 1,
    description: 'Mirror with dark presence. Interacting costs significant sanity.',
    usage:
      'Found on location. Interact to use. Costs 20% sanity or 7.5% per second, whichever is higher.',
    unlocksAtLevel: 0,
    detects: undefined,
    consumable: false,
    tiers: [],
    recommendedFor: ['Sanity drain', 'Test of will', 'Danger'],
    imageUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/7/7b/Cursed_Mirror.jpg/revision/latest?cb=20220303041525',
  },

  'voodoo-doll': {
    id: 'voodoo-doll',
    name: 'Voodoo Doll',
    category: 'cursed',
    type: 'cursed',
    cost: 0,
    capacity: 1,
    description: 'Ancient doll with pins. Using pins causes pain and sanity loss.',
    usage:
      'Found on location. Insert pins to drain sanity: Normal pin=5%, Heart pin=10%. Can be used repeatedly.',
    unlocksAtLevel: 0,
    detects: undefined,
    consumable: false,
    tiers: [],
    recommendedFor: ['Sanity drain', 'Risk/reward', 'Cursed hunts'],
    imageUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/e/e2/Voodoo_Doll_New.jpg/revision/latest?cb=20211210173413',
  },

  'summoning-circle': {
    id: 'summoning-circle',
    name: 'Summoning Circle',
    category: 'cursed',
    type: 'cursed',
    cost: 0,
    capacity: 1,
    description: 'Circle for summoning supernatural entities. Extremely dangerous.',
    usage:
      'Found on location. Light candles to summon ghost. Each candle drains 16% sanity from nearby players and increases ghost activity.',
    unlocksAtLevel: 0,
    detects: undefined,
    consumable: false,
    tiers: [],
    recommendedFor: ['Forced activity', 'Risk/reward', 'Challenges'],
    imageUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/d/de/Sc_new1.jpg/revision/latest?cb=20231230161505',
  },

  'monkey-paw': {
    id: 'monkey-paw',
    name: 'Monkey Paw',
    category: 'cursed',
    type: 'cursed',
    cost: 0,
    capacity: 1,
    description:
      'Legendary cursed object. Grants wishes with terrible consequences.',
    usage:
      'Found on location. Make wish: "Be sane"=All sanity to 50% + 50% drain increase. Weather wish=-25% sanity.',
    unlocksAtLevel: 0,
    detects: undefined,
    consumable: false,
    tiers: [],
    recommendedFor: ['Risky wishes', 'Cursed hunts', 'Challenge'],
    imageUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/c/cc/Monkey_Paw.png/revision/latest?cb=20230228154004',
  },
};

// ============================================================================
// EQUIPMENT SYNERGIES & COMBINATIONS
// ============================================================================

export interface EquipmentBuild {
  name: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  budget: number;
  equipment: string[];
  description: string;
  ghostsGoodFor: string[];
  tips: string[];
}

export const EQUIPMENT_BUILDS: Record<string, EquipmentBuild> = {
  'beginner-starter': {
    name: 'Beginner Starter',
    difficulty: 'Beginner',
    budget: 100,
    equipment: [
      'emf-reader',
      'spirit-box',
      'thermometer',
      'ghost-writing-book',
      'uv-light',
      'video-camera',
      'dots-projector',
      'flashlight',
    ],
    description: 'Use only default starter equipment. Great for learning.',
    ghostsGoodFor: ['Spirit', 'Shade', 'Mare'],
    tips: [
      'No cost - use default equipment',
      'Covers all 7 evidence types',
      'Limited capacity',
      'Perfect for first contract',
    ],
  },

  'evidence-collector': {
    name: 'Evidence Collector',
    difficulty: 'Intermediate',
    budget: 500,
    equipment: [
      'emf-reader',
      'spirit-box',
      'thermometer',
      'ghost-writing-book',
      'uv-light',
      'video-camera',
      'dots-projector',
      'flashlight',
      'parabolic-microphone',
      'sound-recorder',
      'salt',
      'photo-camera',
    ],
    description: 'Maximize evidence gathering with audio and visual tools.',
    ghostsGoodFor: ['All', 'Myling', 'Vocal ghosts'],
    tips: [
      'Excellent audio capture',
      'Multiple evidence paths',
      'Photo income bonus',
      'Great for beginners advancing',
    ],
  },

  'safety-first': {
    name: 'Safety First',
    difficulty: 'Beginner',
    budget: 300,
    equipment: [
      'emf-reader',
      'spirit-box',
      'thermometer',
      'ghost-writing-book',
      'uv-light',
      'video-camera',
      'flashlight',
      'crucifix',
      'crucifix',
      'incense',
      'igniter',
    ],
    description: 'Focus on hunt prevention and safety.',
    ghostsGoodFor: ['Demon', 'Oni', 'Aggressive ghosts'],
    tips: [
      'Multiple crucifixes for hunts',
      'Incense for emergencies',
      'Lower risk playstyle',
      'Good for solo players',
    ],
  },

  'professional-tier': {
    name: 'Professional Tier',
    difficulty: 'Advanced',
    budget: 1000,
    equipment: [
      'emf-reader',
      'spirit-box',
      'thermometer',
      'ghost-writing-book',
      'uv-light',
      'video-camera',
      'dots-projector',
      'flashlight',
      'parabolic-microphone',
      'sound-recorder',
      'sound-sensor',
      'motion-sensor',
      'salt',
      'crucifix',
      'incense',
      'photo-camera',
      'head-gear',
      'tripod',
    ],
    description: 'Premium gear for serious investigators. Maximum information.',
    ghostsGoodFor: ['All ghosts', 'Professional difficulty'],
    tips: [
      'Complete monitoring suite',
      'Remote evidence gathering',
      'Highest success rate',
      'All evidence types covered',
      'High cost, high reward',
    ],
  },
};

// ============================================================================
// EQUIPMENT SYNERGIES
// ============================================================================

export const SYNERGIES: Record<string, string[]> = {
  'uv-light': ['salt', 'photo-camera', 'video-camera', 'head-gear'],
  salt: ['uv-light', 'photo-camera', 'motion-sensor'],
  'video-camera': ['tripod', 'dots-projector', 'parabolic-microphone', 'computer'],
  'dots-projector': ['video-camera', 'head-gear', 'computer'],
  'parabolic-microphone': ['sound-recorder', 'sound-sensor', 'sound-monitor'],
  'sound-recorder': ['parabolic-microphone', 'sound-sensor', 'sound-monitor'],
  'motion-sensor': ['site-activity-monitor', 'video-camera'],
  'sound-sensor': ['sound-monitor', 'parabolic-microphone', 'sound-recorder'],
  crucifix: ['incense', 'firelight', 'sanity-medication'],
  incense: ['crucifix', 'igniter', 'firelight'],
  firelight: ['igniter', 'incense', 'sanity-medication'],
  tripod: ['video-camera', 'head-gear'],
  'head-gear': ['video-camera', 'tripod', 'dots-projector'],
};

// ============================================================================
// EXPORTS
// ============================================================================

export const ALL_EQUIPMENT = {
  ...STARTER_EQUIPMENT,
  ...OPTIONAL_EQUIPMENT,
  ...TRUCK_EQUIPMENT,
  ...CURSED_POSSESSIONS,
};

export const EQUIPMENT_LIST = Object.values(ALL_EQUIPMENT);

export function getEquipmentById(id: string): Equipment | undefined {
  return ALL_EQUIPMENT[id];
}

export function getEquipmentByCategory(category: 'starter' | 'optional' | 'truck' | 'cursed'): Equipment[] {
  return EQUIPMENT_LIST.filter((eq) => eq.category === category);
}

export function getTotalEquipmentCost(equipmentIds: string[]): number {
  return equipmentIds.reduce((total, id) => {
    const eq = ALL_EQUIPMENT[id];
    return total + (eq?.cost || 0);
  }, 0);
}

export function getGhostSpecificEquipment(ghostId: string): Equipment[] {
  const ghostRecommendations: Record<string, string[]> = {
    hantu: ['thermometer', 'firelight'],
    wraith: ['salt', 'uv-light'],
    phantom: ['photo-camera', 'parabolic-microphone'],
    myling: ['parabolic-microphone', 'sound-recorder'],
    mare: ['incense', 'firelight'],
  };

  const equipIds = ghostRecommendations[ghostId] || [];
  return equipIds
    .map((id) => ALL_EQUIPMENT[id])
    .filter((eq) => eq !== undefined);
}
