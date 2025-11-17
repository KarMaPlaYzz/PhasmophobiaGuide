/**
 * Maps Database
 * All 14 playable maps with details, unlock levels, and difficulty
 * Includes map characteristics, room counts, and strategy tips
 */

import { Map } from '@/lib/types';

// ============================================================================
// SMALL MAPS (7 locations, ~45-60 minutes)
// ============================================================================

export const SMALL_MAPS: Record<string, Map> = {
  'six-tanglewood': {
    id: 'six-tanglewood',
    name: '6 Tanglewood Drive',
    type: 'house',
    size: 'small',
    unlocksAtLevel: 0,
    difficulty: 'Beginner',
    maxRooms: 8,
    maxPlayers: 4,
    imageUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/a/a4/Tanglewood_Front.png/revision/latest?cb=20240112125825',
    floorPlanUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/c/cd/Rooms_Tanglewood.png/revision/latest?cb=20250927050359',
    characteristics: {
      lighting: 'Good',
      ghostSpawns: 'Main bedroom, basement',
      hazards: ['Crows outside', 'Dark basement'],
      specialFeatures: ['Basement', 'Patio'],
      fuse: true,
      breaker: true,
    },
    description:
      'A suburban family home. First map for new investigators. Small and manageable for learning game mechanics.',
    strategies: [
      'Start in living room to orient yourself',
      'Basement is darker - bring extra light',
      'Common ghost spawn: bedroom or basement',
      'Good for practicing evidence gathering',
      'Multiple exits make escape easy',
    ],
    tips: [
      'Check bedroom and living room first for activity',
      'Use video camera on bedroom for potential orb evidence',
      'Salt the main hallway entrance to track ghost movement',
      'Good starter map for all difficulty levels',
    ],
    zones: [
      {
        name: 'Upstairs Bedroom',
        description: 'Master bedroom - common ghost spawn location',
        huntTactics: [
          'Lock yourself in bathroom across hall if hunted',
          'Hide under bed as last resort',
          'Use exit door if available',
          'Listen for footsteps before venturing out',
        ],
        equipment: ['Video Camera', 'Ghost Orb', 'EMF Reader'],
        difficulty: 'Easy',
      },
      {
        name: 'Living Room',
        description: 'Central hub with good visibility and multiple exits',
        huntTactics: [
          'Good place to set up initial base',
          'Multiple escape routes to upstairs and kitchen',
          'Ghost often lingers here during events',
          'Good for motion sensor placement',
        ],
        equipment: ['Motion Sensor', 'Thermometer', 'Spirit Box'],
        difficulty: 'Easy',
      },
      {
        name: 'Basement',
        description: 'Dark area with lower lighting - risky but good for evidence',
        huntTactics: [
          'Only go down with light source',
          'Stairs are chokepoint - dangerous during hunt',
          'Good corner for hiding during hunts',
          'Exit through upstairs quickly if ghost approaches',
        ],
        equipment: ['Flashlight', 'Crucifix', 'Freezing Temperatures'],
        difficulty: 'Hard',
      },
    ],
    huntStrategy: 'Bedroom spawns are most common. If chased, retreat to basement corner or upstairs bathroom. Living room is safe zone before ghost becomes active.',
    soloTips: [
      'Solo play is challenging - gather evidence quickly',
      'Focus on high-sanity evidence gathering first',
      'Always have exit route planned',
      'Use crucifix if ghost hunts early',
      'Gather equipment before investigating basement',
    ],
    bestFor: ['Beginners', 'Solo players', 'Practice'],
  },

  'ten-ridgeview': {
    id: 'ten-ridgeview',
    name: '10 Ridgeview Court',
    type: 'house',
    size: 'small',
    unlocksAtLevel: 3,
    difficulty: 'Beginner',
    maxRooms: 7,
    maxPlayers: 4,
    imageUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/1/1e/Ridgeview_living_room.png/revision/latest?cb=20240112130102',
    floorPlanUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/5/51/Rooms_Ridgeview.png/revision/latest?cb=20250927050351',
    characteristics: {
      lighting: 'Good',
      ghostSpawns: 'Various bedroom, kitchen',
      hazards: ['None significant'],
      specialFeatures: ['Hallway maze', 'Kitchen'],
      fuse: true,
      breaker: true,
    },
    description:
      'A smaller suburban house with an interesting hallway layout. Good for beginners wanting more challenge.',
    strategies: [
      'Learn the hallway layout before ghost becomes active',
      'Kitchen is common area for ghost events',
      'Bedrooms are smaller and contained',
      'Good for practicing detection equipment',
      'Multiple routes help with hunt evasion',
    ],
    tips: [
      'Map the hallways first - they can be confusing during hunts',
      'Place motion sensors in hallway to track ghost path',
      'Bedrooms are ideal for EMF and DOTS evidence',
      'Good intermediate beginner map',
    ],
    bestFor: ['Beginners', 'Layout learning', 'Intermediate players'],
  },

  'thirteen-willow': {
    id: 'thirteen-willow',
    name: '13 Willow Street',
    type: 'house',
    size: 'small',
    unlocksAtLevel: 6,
    difficulty: 'Beginner',
    maxRooms: 7,
    maxPlayers: 4,
    imageUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/0/0c/Willow_new.png/revision/latest?cb=20240112130341',
    floorPlanUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/f/f6/Rooms_Willow.png/revision/latest?cb=20250927050400',
    characteristics: {
      lighting: 'Moderate',
      ghostSpawns: 'Bedroom, attic, basement',
      hazards: ['Dark attic', 'Basement shadows'],
      specialFeatures: ['Attic', 'Basement', 'Hidden corners'],
      fuse: true,
      breaker: true,
    },
    description:
      'A narrow suburban home with attic and basement. Multiple vertical levels add complexity.',
    strategies: [
      'Three-story building - climb carefully during hunts',
      'Attic is dark and cramped',
      'Basement is isolated from main house',
      'Ghost spawns spread across levels',
      'Plan escape routes before hunt',
    ],
    tips: [
      'Bring extra flashlights for attic',
      'Check all levels for ghost activity',
      'Basement ghost spawns are isolated - be careful',
      'D.O.T.S. projector good for narrow attic space',
      'Video camera coverage of stairs helpful',
    ],
    bestFor: ['Beginners advancing', 'Multi-level practice', 'Small teams'],
  },

  'fortytwo-edgefield': {
    id: 'fortytwo-edgefield',
    name: '42 Edgefield Road',
    type: 'house',
    size: 'small',
    unlocksAtLevel: 9,
    difficulty: 'Intermediate',
    maxRooms: 9,
    maxPlayers: 4,
    imageUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/8/80/Edgefield_first_floor_hallway.png/revision/latest?cb=20240112130531',
    floorPlanUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/8/8f/Rooms_Edgefield.png/revision/latest?cb=20250927050344',
    characteristics: {
      lighting: 'Moderate',
      ghostSpawns: 'Multiple rooms spread out',
      hazards: ['Large property', 'Some dark corners'],
      specialFeatures: ['Two-story', 'Garage'],
      fuse: true,
      breaker: true,
    },
    description:
      'Suburban home with attached garage. More expansive layout than other small maps.',
    strategies: [
      'Larger footprint than typical small map',
      'Garage is separate area - check it early',
      'Two-story increases hunt complexity',
      'More rooms to search systematically',
      'Good for practicing team coordination',
    ],
    tips: [
      'Assign areas to different team members',
      'Garage can be ghost spawn - dont forget it',
      'Video camera on second floor helpful',
      'Use motion sensors to narrow down ghost location',
      'Good warm-up before medium maps',
    ],
    bestFor: ['Intermediate', 'Team play', 'Advanced small-map challenge'],
  },

  'camp-woodwind': {
    id: 'camp-woodwind',
    name: 'Camp Woodwind',
    type: 'campground',
    size: 'small',
    unlocksAtLevel: 12,
    difficulty: 'Intermediate',
    maxRooms: 6,
    maxPlayers: 4,
    imageUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/7/7b/Camp_woodwind.png/revision/latest?cb=20240112131010',
    floorPlanUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/7/78/Rooms_Camp_Woodwind.png/revision/latest?cb=20251011190116',
    characteristics: {
      lighting: 'Poor (outdoor)',
      ghostSpawns: 'Various cabins, forest',
      hazards: ['Open outdoors', 'Dark forest', 'Scattered buildings'],
      specialFeatures: [
        'Multiple cabins',
        'Outdoor areas',
        'Forest sections',
        'Campfire',
      ],
      fuse: false,
      breaker: false,
    },
    description:
      'Outdoor campground with scattered cabins. First location without traditional power system. Unique outdoor hunting experience.',
    strategies: [
      'No fuse box - different gameplay',
      'Spread out buildings increase search time',
      'Outdoor areas are dark and disorienting',
      'Ghost can be in any cabin',
      'Forest sections make hunts dangerous',
    ],
    tips: [
      'Bring extra flashlights - no power control',
      'Cabins are smaller enclosed spaces',
      'Use light to navigate dark forest',
      'Video cameras helpful for orb detection in dark',
      'Great practice for outdoor scenarios',
      'Campfire can be lit for light/warmth',
    ],
    bestFor: ['Outdoor practice', 'Flashlight management', 'Team coordination'],
  },

  'grafton-farmhouse': {
    id: 'grafton-farmhouse',
    name: 'Grafton Farmhouse',
    type: 'house',
    size: 'small',
    unlocksAtLevel: 15,
    difficulty: 'Intermediate',
    maxRooms: 8,
    maxPlayers: 4,
    imageUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/1/1c/Grafton_farmhouse_entrance_brightened.webp/revision/latest?cb=20250812232937',
    floorPlanUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/3/37/Rooms_Grafton.png/revision/latest?cb=20250927050345',
    characteristics: {
      lighting: 'Poor',
      ghostSpawns: 'Various rooms, basement',
      hazards: ['Boarded windows', 'Dark interior', 'Basement decay'],
      specialFeatures: ['Basement', 'Boarded areas', 'Dilapidated'],
      fuse: true,
      breaker: true,
    },
    description:
      'Abandoned farmhouse in disrepair. Darker and more atmospheric than suburban homes. Good difficulty step up.',
    strategies: [
      'Very dark inside - light management critical',
      'Boarded windows limit natural light',
      'Basement is particularly dark',
      'Dilapidated structure feels more ominous',
      'Good for practicing in poor lighting',
    ],
    tips: [
      'Flashlights essential - bring multiple',
      'Basement has poor visibility - go prepared',
      'Boarded areas blocked off - plan routes carefully',
      'More creepy atmosphere - good for tension',
      'Practice evidence gathering in dark',
      'Good stepping stone to medium maps',
    ],
    bestFor: [
      'Intermediate players',
      'Atmosphere appreciation',
      'Dark location practice',
    ],
  },

  'nells-diner': {
    id: 'nells-diner',
    name: "Nell's Diner",
    type: 'commercial',
    size: 'small',
    unlocksAtLevel: 18,
    difficulty: 'Intermediate',
    maxRooms: 13,
    maxPlayers: 4,
    imageUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/b/bc/Nell%27s_Diner.png/revision/latest/scale-to-width-down/1000?cb=20251111161803',
    floorPlanUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/b/bd/Rooms_Nells_Diner.png/revision/latest?cb=20251112080535',
    characteristics: {
      lighting: 'Moderate',
      ghostSpawns: 'Various dining areas, kitchen, storage',
      hazards: ['Walk-in freezer', 'Multiple interconnected rooms'],
      specialFeatures: ['Walk-in freezer', 'Commercial kitchen', 'Dining area', 'Storage areas'],
      fuse: true,
      breaker: true,
    },
    description:
      'A retro-themed diner with a commercial kitchen and multiple dining areas. Dense layout with many interactable objects. Similar in size to 6 Tanglewood but much denser.',
    strategies: [
      'Dense layout with many rooms - thorough searching needed',
      'Multiple dining areas provide various ghost spawns',
      'Walk-in freezer is unique low-temperature area',
      'Kitchen equipment can be interactable',
      'Good for practicing in confined spaces',
    ],
    tips: [
      'Check dining areas and booths for ghost activity',
      'Walk-in freezer is guaranteed cold area - good for freezing evidence',
      'Kitchen has many objects - can create noise during hunts',
      'Multiple rooms mean more evidence gathering opportunities',
      'Dense layout good for practicing with limited space',
      'Commercial setting provides unique atmosphere',
      'Good transitional map between beginner and advanced',
    ],
    zones: [
      {
        name: 'Dining Area',
        description: 'Main customer seating area with booths and tables',
        huntTactics: [
          'Tables and booths provide hiding spots during hunts',
          'Multiple exits to kitchen and storage areas',
          'Ghost often lingers here during events',
          'Open layout allows ghost to see far',
          'Use booths for cover but be ready to move',
        ],
        equipment: ['Video Camera', 'Motion Sensor', 'Spirit Box'],
        difficulty: 'Easy',
      },
      {
        name: 'Kitchen',
        description: 'Commercial kitchen with stoves, counters, and cooking equipment',
        huntTactics: [
          'Many interactable objects - noisy during hunts',
          'Narrow walkways between equipment',
          'Multiple exits to dining area and storage',
          'Ghost interactions with equipment possible',
          'Good for evidence gathering but risky during hunts',
        ],
        equipment: ['Thermometer', 'EMF Reader', 'Ghost Writing Book'],
        difficulty: 'Medium',
      },
      {
        name: 'Walk-in Freezer',
        description: 'Large cold storage area with guaranteed freezing temperatures',
        huntTactics: [
          'Freezing temperatures always present - good for evidence',
          'Single exit makes it risky during hunts',
          'Hide inside only if absolutely necessary',
          'Thermometer useful here for confirmation',
          'Good place to gather freezing evidence safely pre-hunt',
        ],
        equipment: ['Thermometer', 'UV Light', 'Crucifix'],
        difficulty: 'Hard',
      },
    ],
    bestFor: ['Intermediate players', 'Commercial setting experience', 'Transitional challenge'],
  },
};

// ============================================================================
// MEDIUM MAPS (5 locations, ~60-75 minutes)
// ============================================================================

export const MEDIUM_MAPS: Record<string, Map> = {
  'bleasdale-farmhouse': {
    id: 'bleasdale-farmhouse',
    name: 'Bleasdale Farmhouse',
    type: 'house',
    size: 'medium',
    unlocksAtLevel: 26,
    difficulty: 'Advanced',
    maxRooms: 15,
    maxPlayers: 4,
    imageUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/a/a6/Bleasdalereworked.png/revision/latest?cb=20250313110653',
    floorPlanUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/0/03/Rooms_Bleasdale.png/revision/latest?cb=20250927050340',
    characteristics: {
      lighting: 'Moderate',
      ghostSpawns: 'Multiple rooms across two floors',
      hazards: ['Large property', 'Multiple stairwells'],
      specialFeatures: ['Two-story farmhouse', 'Barn-like areas'],
      fuse: true,
      breaker: true,
    },
    description:
      'Larger farmhouse with multiple rooms and floors. First medium-size location. Significant increase from small maps.',
    strategies: [
      'Larger layout requires systematic searching',
      'Divide team to cover more ground',
      'Multiple ghost spawns across levels',
      'Take time to map layout before ghost activity',
      'More rooms mean more hunting grounds',
    ],
    tips: [
      'Scout layout in first minute if possible',
      'Use motion sensors across multiple areas',
      'Video camera placement critical - multiple spawns',
      'Team members should stay together during hunts',
      'More evidence sources due to size',
      'Good stepping stone to larger maps',
    ],
    bestFor: ['Intermediate', 'Team play', 'Large property exploration'],
  },

    'maple-lodge': {
    id: 'maple-lodge',
    name: 'Maple Lodge Campsite',
    type: 'campsite',
    size: 'medium',
    unlocksAtLevel: 25,
    difficulty: 'Advanced',
    maxRooms: 12,
    maxPlayers: 4,
    imageUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/9/9f/Maple-rework-main-shot.png/revision/latest?cb=20240112125636',
    floorPlanUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/b/bc/Rooms_Maple_Lodge.png/revision/latest?cb=20250927050347',
    characteristics: {
      lighting: 'Poor (outdoor, some structures)',
      ghostSpawns: 'Various buildings and outdoor areas',
      hazards: ['Large outdoor areas', 'Dark forest', 'Scattered buildings'],
      specialFeatures: [
        'Multiple cabins',
        'Large lodge',
        'Outdoor sections',
        'Campfire',
      ],
      fuse: false,
      breaker: false,
    },
    description:
      'Large campground with many buildings scattered across outdoor area. Outdoor hunting with more complexity.',
    strategies: [
      'No power system - manage with flashlights',
      'Very spread out - requires team coordination',
      'Multiple potential ghost spawns',
      'Outdoor navigation is disorienting',
      'Ghost could be far from starting truck',
    ],
    tips: [
      'Bring many flashlights - no power control',
      'Assign search areas to team members',
      'Motion sensors help track ghost through buildings',
      'Get bearings of layout before ghost becomes active',
      'Campfire can be lit for light',
      'Forest areas are very dark - be careful',
    ],
    bestFor: ['Outdoor hunting', 'Team coordination', 'Large area navigation'],
  },

  'point-hope': {
    id: 'point-hope',
    name: 'Point Hope',
    type: 'lighthouse',
    size: 'medium',
    unlocksAtLevel: 28,
    difficulty: 'Advanced',
    maxRooms: 16,
    maxPlayers: 4,
    imageUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/0/05/Phope_sunrise.jpg/revision/latest?cb=20240625133229',
    floorPlanUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/1/11/Rooms_Point_Hope.png/revision/latest?cb=20250927050348',
    characteristics: {
      lighting: 'Good exterior, variable interior',
      ghostSpawns: 'Multiple rooms, multiple floors',
      hazards: ['Cliffs nearby', 'Multiple levels'],
      specialFeatures: ['Multi-story', 'Coastal setting', 'Complex layout'],
      fuse: true,
      breaker: true,
    },
    description:
      'Large coastal house with complex layout. Medium map that leans toward difficulty. Multiple floors and rooms.',
    strategies: [
      'Complex layout requires careful navigation',
      'Multiple floors increase hunt complexity',
      'Ghost can be far from starting point',
      'More areas to search systematically',
      'Team coordination essential',
    ],
    tips: [
      'Take time to learn layout - it is complex',
      'Multiple DOTS/video camera placements helpful',
      'Use motion sensors to narrow ghost location',
      'Split team for efficiency but stay aware',
      'Good practice for large building navigation',
      'Difficulty jump - prepare well',
    ],
    bestFor: ['Advanced intermediate', 'Complex building practice', 'Team play'],
  },

  'prison': {
    id: 'prison',
    name: 'Prison',
    type: 'facility',
    size: 'medium',
    unlocksAtLevel: 27,
    difficulty: 'Advanced',
    maxRooms: 14,
    maxPlayers: 4,
    imageUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/8/87/Prison_entrance.png/revision/latest?cb=20240112131231',
    floorPlanUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/0/04/Rooms_Prison.png/revision/latest?cb=20250927050350',
    characteristics: {
      lighting: 'Poor (cell blocks)',
      ghostSpawns: 'Cell blocks, common areas',
      hazards: ['Multiple isolated areas', 'Long narrow corridors'],
      specialFeatures: ['Cell blocks', 'Guard areas', 'Cafeteria', 'Recreation'],
      fuse: true,
      breaker: true,
    },
    description:
      'Abandoned prison with cell blocks and guard areas. Claustrophobic layout with poor visibility. Advanced medium map.',
    strategies: [
      'Cell block layout is maze-like',
      'Long corridors make hunts dangerous',
      'Multiple isolated areas increase risk',
      'Ghost could be far from starting point',
      'Planned escape routes critical',
    ],
    tips: [
      'Learn cell block layout to avoid getting lost',
      'Long corridors provide escape routes during hunts',
      'Video cameras useful for cell block monitoring',
      'Stay together during hunts - easy to get separated',
      'Motion sensors help track in maze-like layout',
      'Prison is atmospheric but challenging',
    ],
    bestFor: ['Advanced players', 'Maze navigation', 'Intense hunts'],
  },

  'sunny-meadows-restricted': {
    id: 'sunny-meadows-restricted',
    name: 'Sunny Meadows - Restricted',
    type: 'institution',
    size: 'medium',
    unlocksAtLevel: 30,
    difficulty: 'Advanced',
    maxRooms: 12,
    maxPlayers: 4,
    imageUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/3/32/SMRestricted_Courtyard.png/revision/latest?cb=20250927054921',
    floorPlanUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/e/ec/Rooms_SM_Restricted_Courtyard.png/revision/latest?cb=20250930072258',
    characteristics: {
      lighting: 'Moderate (institutional)',
      ghostSpawns: 'Various patient rooms, offices',
      hazards: ['Multiple patient rooms', 'Locked areas'],
      specialFeatures: [
        'Patient rooms',
        'Office areas',
        'Restricted sections',
        'Therapy rooms',
      ],
      fuse: true,
      breaker: true,
    },
    description:
      'Restricted wing of Sunny Meadows Mental Institution. More advanced than other medium maps. Eerie institutional setting.',
    strategies: [
      'Multiple patient rooms provide many ghost spawns',
      'Institutional layout is clinical and disorienting',
      'Restricted areas limit exploration',
      'Multiple ghost possibilities',
      'Good for advanced team play',
    ],
    tips: [
      'Patient rooms are small enclosed spaces',
      'Multiple video camera placements needed',
      'Motion sensors helpful in hallways',
      'Stay together - layout can be disorienting',
      'More evidence sources due to multiple rooms',
      'Good challenge for advanced players',
    ],
    bestFor: ['Advanced players', 'Team coordination', 'Institutional atmosphere'],
  },
};

// ============================================================================
// LARGE MAPS (2 locations, 75+ minutes)
// ============================================================================

export const LARGE_MAPS: Record<string, Map> = {
  'brownstone-high-school': {
    id: 'brownstone-high-school',
    name: 'Brownstone High School',
    type: 'school',
    size: 'large',
    unlocksAtLevel: 33,
    difficulty: 'Expert',
    maxRooms: 20,
    maxPlayers: 4,
    imageUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/a/a5/High_school_updated2.png/revision/latest?cb=20240112131538',
    floorPlanUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/0/02/Rooms_Brownstone_High_School.png/revision/latest?cb=20250927050341',
    characteristics: {
      lighting: 'Moderate (hallways), variable (classrooms)',
      ghostSpawns: 'Multiple classrooms, offices, gymnasium',
      hazards: ['Very large', 'Many isolated areas', 'Complex layout'],
      specialFeatures: [
        'Multiple hallways',
        'Gymnasium',
        'Classrooms',
        'Administrative offices',
        'Cafeteria',
      ],
      fuse: true,
      breaker: true,
    },
    description:
      'Large high school building. First of two large maps. Massive area with many rooms. Very challenging even for experienced players.',
    strategies: [
      'Enormous search area - team must divide efficiently',
      'Multiple ghost spawns across building',
      'Easy to get lost or separated from team',
      'Hunts are very dangerous due to size',
      'Planning and communication critical',
    ],
    tips: [
      'Split team strategically - assign sections',
      'Motion sensors critical - place multiple',
      'Video cameras on every hallway intersection',
      'Use walkie-talkies to maintain communication',
      'Learn main hallway first - it is your navigation hub',
      'Gymnasium is very large - prepare for that space',
      'Evidence gathering takes significant time',
      'Bring plenty of supplies - long contracts',
    ],
    zones: [
      {
        name: 'Main Hallway',
        description: 'Central navigation hub connecting all sections',
        huntTactics: [
          'Main hallway is your lifeline - know exits',
          'Hide in nearby classrooms if chased',
          'Multiple classrooms offer escape',
          'Ghost often travels main hallway during events',
          'Place cameras here for overview',
        ],
        equipment: ['Motion Sensor', 'Video Camera', 'Crucifixes'],
        difficulty: 'Medium',
      },
      {
        name: 'Gymnasium',
        description: 'Largest open area - high-risk hunt zone',
        huntTactics: [
          'Extremely open - limited hiding spots',
          'If hunted here, run to adjacent hallway immediately',
          'Ghost can traverse large distance quickly',
          'Bleachers provide minimal cover only',
          'High escape difficulty during hunts',
        ],
        equipment: ['Crucifixes (multiple)', 'Sanity Medication', 'EMF Reader'],
        difficulty: 'Hard',
      },
      {
        name: 'Classrooms (East Wing)',
        description: 'Common ghost spawn area with multiple rooms',
        huntTactics: [
          'Many interconnected classrooms',
          'Easy to get separated - use buddy system',
          'Desks provide minimal cover during hunts',
          'Multiple exits allow escape to hallway',
          'Ghost often spawns in east wing',
        ],
        equipment: ['Video Camera', 'Ghost Writing Book', 'Thermometer'],
        difficulty: 'Hard',
      },
      {
        name: 'Administrative Offices',
        description: 'Smaller rooms with moderate visibility',
        huntTactics: [
          'Isolated from main hallway - high risk',
          'Multiple small rooms - confusing layout',
          'If hunted, sprint to main hallway',
          'Darker than classroom areas',
          'Good evidence location but risky',
        ],
        equipment: ['Flashlight', 'Spirit Box', 'Crucifix'],
        difficulty: 'Hard',
      },
      {
        name: 'Cafeteria',
        description: 'Large open space with some cover options',
        huntTactics: [
          'Tables provide temporary hiding spots',
          'Long room - ghost can chase far',
          'Multiple exits to hallway',
          'Moderate visibility - not as risky as gym',
          'Ghost spawns here occasionally',
        ],
        equipment: ['Video Camera', 'Motion Sensor', 'Sanity Medication'],
        difficulty: 'Medium',
      },
    ],
    huntStrategy: 'Assign team to specific wings: East to East Wing, West to Classrooms, Center to Cafeteria/Admin. Main hallway team monitors activity. During hunts, retreat to nearest hallway intersection. Gymnasium should be avoided until ghost zone identified.',
    soloTips: [
      'Solo Brownstone is expert-level challenge',
      'Plan escape routes before each investigation area',
      'Never investigate gym alone',
      'Place crucifixes at hallway intersections',
      'Use motion sensors to track ghost location remotely',
      'Gather evidence from safe areas first',
      'Leave map if sanity drops below 40%',
    ],
    bestFor: ['Expert players', 'Large team coordination', 'Challenging hunts'],
  },

  'sunny-meadows-full': {
    id: 'sunny-meadows-full',
    name: 'Sunny Meadows Mental Institution',
    type: 'institution',
    size: 'large',
    unlocksAtLevel: 36,
    difficulty: 'Expert',
    maxRooms: 21,
    maxPlayers: 4,
    imageUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/c/cb/Smmi_updated1.png/revision/latest?cb=20240112131752',
    floorPlanUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/a/ae/Rooms_Sunny_Meadows.png/revision/latest?cb=20250930072315',
    characteristics: {
      lighting: 'Poor to moderate',
      ghostSpawns: 'Multiple patient rooms, offices, therapy areas',
      hazards: [
        'Massive complex',
        'Many isolated rooms',
        'Confusing layout',
      ],
      specialFeatures: [
        'Patient wings',
        'Administrative areas',
        'Therapy rooms',
        'Pharmacy',
        'Emergency room',
      ],
      fuse: true,
      breaker: true,
    },
    description:
      'Full Sunny Meadows Mental Institution. Massive institutional complex. Most challenging large map with eerie atmosphere.',
    strategies: [
      'Biggest map - extremely large search area',
      'Multiple patient wings provide many spawns',
      'Institutional layout is disorienting',
      'Very easy to get lost or separated',
      'Requires excellent team coordination',
    ],
    tips: [
      'Assign team to specific wings - do not free-roam',
      'Use comprehensive camera network - multiple monitors needed',
      'Motion sensors essential throughout',
      'Radio communication is critical',
      'Pharmacy and emergency room are unique areas',
      'Evidence gathering will take very long time',
      'Prepare mentally for intensity',
      'Bring maximum supplies',
      'Only attempt with experienced team',
    ],
    bestFor: ['Expert players', 'Coordinated teams', 'Ultimate challenge'],
  },
};

// ============================================================================
// ALL MAPS
// ============================================================================

export const ALL_MAPS = {
  ...SMALL_MAPS,
  ...MEDIUM_MAPS,
  ...LARGE_MAPS,
};

export const MAP_LIST = Object.values(ALL_MAPS);

export const MAPS_BY_SIZE = {
  small: Object.values(SMALL_MAPS),
  medium: Object.values(MEDIUM_MAPS),
  large: Object.values(LARGE_MAPS),
};

export const MAPS_BY_DIFFICULTY = {
  'Beginner': MAP_LIST.filter((m) => m.difficulty === 'Beginner'),
  'Intermediate': MAP_LIST.filter((m) => m.difficulty === 'Intermediate'),
  'Advanced': MAP_LIST.filter((m) => m.difficulty === 'Advanced'),
  'Expert': MAP_LIST.filter((m) => m.difficulty === 'Expert'),
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function getMapById(id: string): Map | undefined {
  return ALL_MAPS[id];
}

export function getMapsBySize(size: 'small' | 'medium' | 'large'): Map[] {
  return MAPS_BY_SIZE[size];
}

export function getMapsByDifficulty(difficulty: string): Map[] {
  return (
    MAPS_BY_DIFFICULTY[difficulty as keyof typeof MAPS_BY_DIFFICULTY] || []
  );
}

export function getMapsByUnlockLevel(level: number): Map[] {
  return MAP_LIST.filter((m) => m.unlocksAtLevel <= level);
}

export function getUnlockedMapsCount(level: number): number {
  return getMapsByUnlockLevel(level).length;
}

export function getMapProgressionPath(): Map[] {
  return MAP_LIST.sort((a, b) => a.unlocksAtLevel - b.unlocksAtLevel);
}
