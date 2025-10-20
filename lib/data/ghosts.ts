/**
 * Ghost Database
 * Contains all 24 ghost types with complete information
 */

import { Ghost } from '@/lib/types';

export const GHOSTS: Record<string, Ghost> = {
  spirit: {
    id: 'spirit',
    name: 'Spirit',
    description:
      'Spirits are the most commonly encountered ghosts. They are very active and commonly cause poltergeist activity. Spirits are said to be the most dangerous ghosts when angered.',
    evidence: ['EMF Level 5', 'Spirit Box', 'Ghost Writing'],
    abilities: [
      {
        name: 'Poltergeist-like Activity',
        description: 'Throws objects around the area',
        effects: ['Environmental interaction', 'Sanity loss', 'Distraction'],
      },
    ],
    strengths: [
      {
        description: 'Very active',
        mechanicalAdvantage: 'Frequently interacts with environment',
      },
    ],
    weaknesses: [
      {
        description: 'No significant weakness',
        counter: 'Use standard identification procedures',
      },
    ],
    identificationTips: [
      'Most common ghost type',
      'Highly active compared to other ghosts',
      'Look for EMF Level 5 and Spirit Box evidence first',
      'May leave ghost writing quickly',
    ],
    counterStrategies: [
      {
        strategy: 'Use containment methods',
        effectiveness: 'High',
        tips: ['Place crucifixes near spawn points', 'Use salt lines at exits'],
      },
      {
        strategy: 'Maintain team cohesion',
        effectiveness: 'Medium',
        tips: ['Stay grouped to reduce sanity drain', 'Support teammates when hunts begin'],
      },
    ],
    recommendedEquipment: {
      essential: ['EMF Reader', 'Spirit Box', 'Ghost Writing Book'],
      recommended: ['Crucifixes', 'Sanity Medication', 'Video Camera'],
      optional: ['UV Light', 'Thermometer'],
      avoid: [],
    },
    huntSanityThreshold: 50,
    movementSpeed: 'Normal',
    activityLevel: 'Very High',
    difficulty: 'Beginner',
    imageUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/c/c1/Spirit_Discovered.jpg/revision/latest?cb=20231115114542',
  },

  wraith: {
    id: 'wraith',
    name: 'Wraith',
    description:
      'Wraiths are one of the most dangerous ghosts to encounter. It is said that Wraiths fear salt and are the only ghost that levitates.',
    evidence: ['EMF Level 5', 'Spirit Box', 'D.O.T.S. Projector'],
    abilities: [
      {
        name: 'Levitation',
        description: 'Wraith can levitate and pass through objects',
        effects: ['Can traverse obstacles', 'Leaves no footprints in salt'],
      },
      {
        name: 'Teleportation',
        description: 'Can teleport to players',
        effects: ['Sudden appearance', 'High-speed approach'],
      },
    ],
    strengths: [
      {
        description: 'Can pass through walls',
        mechanicalAdvantage: 'Ignores physical barriers',
      },
      {
        description: 'No footprints in salt',
        mechanicalAdvantage: 'Salt will not reveal footprints',
      },
    ],
    weaknesses: [
      {
        description: 'Fears salt',
        counter: 'Place salt near ghost spawn location',
      },
    ],
    identificationTips: [
      'No footprints in salt despite passing through rooms',
      'Look for D.O.T.S. Projector evidence',
      'Very aggressive behavior',
      'Can appear suddenly near players',
    ],
    counterStrategies: [
      {
        strategy: 'Avoid salt at spawn location',
        effectiveness: 'High',
        tips: ['Place salt away from suspected spawn points', 'Use crucifixes instead', 'Track where it appears most'],
      },
      {
        strategy: 'Watch for lack of footprints',
        effectiveness: 'High',
        tips: ['Check salt lines in all rooms', 'No footprints = likely Wraith', 'No UV evidence on surfaces'],
      },
    ],
    recommendedEquipment: {
      essential: ['EMF Reader', 'Spirit Box', 'D.O.T.S. Projector'],
      recommended: ['Video Camera', 'Sanity Medication', 'Crucifixes'],
      optional: ['Thermometer', 'Ghost Writing Book'],
      avoid: ['Salt'],
    },
    huntSanityThreshold: 50,
    movementSpeed: 'Fast',
    activityLevel: 'High',
    difficulty: 'Intermediate',
    imageUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/c/c1/Wraith_Discovered.jpg/revision/latest?cb=20231115114549',
  },

  phantom: {
    id: 'phantom',
    name: 'Phantom',
    description:
      'A Phantom is a ghost that can possess the living. Looking at a Phantom will drain your sanity. The Phantom is also the only known ghost to drool.',
    evidence: ['Spirit Box', 'Ultraviolet', 'D.O.T.S. Projector'],
    abilities: [
      {
        name: 'Possession',
        description: 'Can temporarily control players',
        effects: ['Player movement control loss', 'Vision manipulation'],
      },
      {
        name: 'Sanity Drain from Sight',
        description: 'Looking at the phantom drains sanity',
        effects: ['Continuous sanity loss at ~0.5%/s when in sight'],
      },
    ],
    strengths: [
      {
        description: 'More visible during hunts',
        mechanicalAdvantage: 'Easier to see and photograph',
      },
    ],
    weaknesses: [
      {
        description: 'Taking a photo will make it disappear',
        counter: 'Use Photo Camera to banish temporarily',
      },
      {
        description: 'Less visible during manifestations',
        counter: 'Use Photo Camera or D.O.T.S. projector to detect',
        mechanicalAdvantage: 'Harder to detect during ghost events',
      },
    ],
    identificationTips: [
      'Looking at it continuously drains your sanity',
      'Visible during hunts (more than other ghosts)',
      'Can be photographed - it will disappear',
      'Look for UV fingerprints and D.O.T.S evidence',
      'Heart rate will increase when looking at phantom',
    ],
    counterStrategies: [
      {
        strategy: 'Use Photo Camera strategically',
        effectiveness: 'High',
        tips: ['Take photo to banish temporarily', 'Resets hunt aggression', 'Gives team breathing room'],
      },
      {
        strategy: 'Keep head down or covered',
        effectiveness: 'Medium',
        tips: ['Look away from ghost manifestations', 'Reduce sanity drain from sight', 'Use darkness to your advantage'],
      },
    ],
    recommendedEquipment: {
      essential: ['Spirit Box', 'Ultraviolet', 'D.O.T.S. Projector'],
      recommended: ['Photo Camera', 'Video Camera', 'Sanity Medication'],
      optional: ['EMF Reader'],
      avoid: [],
    },
    huntSanityThreshold: 50,
    movementSpeed: 'Normal',
    activityLevel: 'High',
    difficulty: 'Intermediate',
    imageUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/2/27/Phantom_Discovered.jpg/revision/latest?cb=20231115114535',
  },

  poltergeist: {
    id: 'poltergeist',
    name: 'Poltergeist',
    description:
      'A Poltergeist is a loud physical manifestation of a ghost. They are known for moving objects around violently and quickly.',
    evidence: ['Spirit Box', 'Ultraviolet', 'Ghost Writing'],
    abilities: [
      {
        name: 'Object Throwing',
        description:
          'Throws multiple objects at once at high velocities',
        effects: [
          'Environmental chaos',
          '2% sanity loss per object thrown',
          'Player damage',
        ],
      },
    ],
    strengths: [
      {
        description: 'Can throw multiple objects simultaneously',
        mechanicalAdvantage: 'More dangerous during manifestations',
      },
      {
        description: 'Throws objects at high speed',
        mechanicalAdvantage: 'More likely to hit players',
      },
    ],
    weaknesses: [
      {
        description: 'Becomes powerless with no throwables nearby',
        counter: 'Move to empty rooms to avoid manifestations',
      },
    ],
    identificationTips: [
      'Room will be full of flying objects',
      'Multiple items thrown simultaneously',
      'Look for signs of violence in environment',
      'Gather Spirit Box and UV evidence',
      'More active in cluttered rooms',
    ],
    counterStrategies: [
      {
        strategy: 'Move to empty rooms',
        effectiveness: 'High',
        tips: ['Find room with no throwables', 'Reduces manifestation power', 'Safer environment'],
      },
      {
        strategy: 'Avoid clutter',
        effectiveness: 'Medium',
        tips: ['Stay away from kitchens and warehouses', 'Less objects to throw', 'Easier to evade'],
      },
    ],
    recommendedEquipment: {
      essential: ['Spirit Box', 'Ultraviolet', 'Ghost Writing Book'],
      recommended: ['Crucifixes', 'Sanity Medication', 'Body Armor'],
      optional: ['EMF Reader', 'Video Camera'],
      avoid: [],
    },
    huntSanityThreshold: 50,
    movementSpeed: 'Normal',
    activityLevel: 'Very High',
    difficulty: 'Beginner',
    imageUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/1/10/Poltergeist_Discovered.jpg/revision/latest?cb=20231115114536',
  },

  banshee: {
    id: 'banshee',
    name: 'Banshee',
    description:
      "A Banshee is a ghost that targets one player and will only hunt that player. They are known for their high-pitched scream. It's death scream is a mournful wail.",
    evidence: ['Ghost Orb', 'Ultraviolet', 'D.O.T.S. Projector'],
    abilities: [
      {
        name: 'Scream',
        description: 'Emits a distinctive wail that only affects target',
        effects: ['Drains 15% sanity from target', 'Drains 10% from others'],
      },
      {
        name: 'Singing Ghost Event',
        description: 'May perform singing events',
        effects: ['Increased chance of ghost event'],
      },
    ],
    strengths: [
      {
        description: 'Will target a single player',
        mechanicalAdvantage: 'More predictable hunts',
      },
      {
        description: 'Increased singing events',
        mechanicalAdvantage: 'Better chance to hear evidence',
      },
    ],
    weaknesses: [
      {
        description: 'Crucifix range is 50% larger',
        counter: 'Crucifix is very effective against this ghost',
        mechanicalAdvantage: 'Easier to prevent hunts',
      },
    ],
    identificationTips: [
      'Always targets one specific player',
      'Can hear distinctive wailing sounds',
      'Look for Ghost Orb evidence',
      'More common singing events',
      'Uses Parabolic Microphone sounds frequently',
    ],
    counterStrategies: [
      {
        strategy: 'Play with multiple players',
        effectiveness: 'High',
        tips: ['Spread target around team', 'Each player shares curse', 'Banshee focuses on one player'],
      },
      {
        strategy: 'Identify the target early',
        effectiveness: 'Medium',
        tips: ['Target player experiences higher activity', 'Extra preparation for that player', 'Enhanced hunts against target'],
      },
    ],
    recommendedEquipment: {
      essential: ['D.O.T.S. Projector', 'Ultraviolet', 'Ghost Orb'],
      recommended: ['Crucifixes (many)', 'Sanity Medication (extra)', 'Video Camera'],
      optional: ['EMF Reader', 'Thermometer'],
      avoid: [],
    },
    huntSanityThreshold: 50,
    movementSpeed: 'Normal',
    activityLevel: 'Medium',
    difficulty: 'Intermediate',
    imageUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/2/26/Banshee_Discovered.jpg/revision/latest?cb=20231115114509',
  },

  jinn: {
    id: 'jinn',
    name: 'Jinn',
    description:
      'A Jinn is a rare ghost, rarely seen in the human world. It is said they are attracted to warm areas and will travel through walls when chasing prey.',
    evidence: ['EMF Level 5', 'Ultraviolet', 'Freezing Temperatures'],
    abilities: [
      {
        name: 'Ability',
        description:
          'Drains 25% sanity from nearby player when breaker is on',
        effects: ['15 meter range', 'Only works with breaker on'],
      },
    ],
    strengths: [
      {
        description: 'Travels fast when in line of sight with distant player',
        mechanicalAdvantage:
          'Very fast hunting speed with fuse box on if player seen',
      },
      {
        description: 'Affected by temperature',
        mechanicalAdvantage: 'Can drain extra sanity ability',
      },
    ],
    weaknesses: [
      {
        description: 'Cannot use ability if fuse box is off',
        counter: 'Turn off breaker to prevent sanity drain',
      },
      {
        description: 'Never turns fuse box off directly',
        counter: 'Keep power on to mitigate abilities',
        mechanicalAdvantage: 'Fuse box stays on',
      },
    ],
    identificationTips: [
      'Look for Freezing Temperatures evidence',
      'Ability only works with power on',
      'Faster movement with distant visible player',
      'Turn off breaker to disable main ability',
      'EMF spikes during ability use',
    ],
    counterStrategies: [
      {
        strategy: 'Turn off power/disable breaker',
        effectiveness: 'High',
        tips: ['Jinn needs power to work at full strength', 'Reduce its speed advantage', 'Easier hunts if breaker off'],
      },
      {
        strategy: 'Stay close to power source',
        effectiveness: 'High',
        tips: ['Power off reduces speed', 'If power on, stay near fuse box', 'Limits Jinns teleportation range'],
      },
    ],
    recommendedEquipment: {
      essential: ['EMF Reader', 'Ultraviolet', 'Freezing Temperatures'],
      recommended: ['Crucifixes', 'Sanity Medication', 'Breaker Key'],
      optional: ['Video Camera', 'Ghost Writing Book'],
      avoid: [],
    },
    huntSanityThreshold: 50,
    movementSpeed: 'Variable',
    activityLevel: 'High',
    difficulty: 'Intermediate',
    imageUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/5/56/Jinn_Discovered.jpg/revision/latest?cb=20231115114529',
  },

  mare: {
    id: 'mare',
    name: 'Mare',
    description:
      'A Mare is the source of all nightmares. They have the ability to turn off lights in order to scare their prey.',
    evidence: ['Ghost Orb', 'Spirit Box', 'Ghost Writing'],
    abilities: [
      {
        name: 'Light Control',
        description: 'Turns off lights immediately after they are turned on',
        effects: ['Forced darkness', 'Increased sanity drain'],
      },
    ],
    strengths: [
      {
        description: 'Can hunt at higher sanity in the dark',
        mechanicalAdvantage:
          'Higher hunt threshold when lights are off (60% instead of 40%)',
      },
      {
        description: 'Will turn off lights immediately',
        mechanicalAdvantage: 'Forces darkness on players',
      },
      {
        description: 'Never turns lights on',
        mechanicalAdvantage: 'Maintains darkness advantage',
      },
    ],
    weaknesses: [
      {
        description: 'Has lower hunt sanity threshold in the light',
        counter: 'Keep lights on to prevent hunts',
      },
    ],
    identificationTips: [
      'Lights constantly turn off',
      'Always active in darkness',
      'Look for Ghost Orb early',
      'Keep lights on to slow activity',
      'More dangerous at night',
    ],
    counterStrategies: [
      {
        strategy: 'Keep lights on everywhere',
        effectiveness: 'High',
        tips: ['Mare prefers darkness', 'Lights reduce activity', 'Turn on all switches'],
      },
      {
        strategy: 'Avoid dark rooms entirely',
        effectiveness: 'High',
        tips: ['Most dangerous in blackness', 'Stick to lit areas', 'Place flares in dark rooms'],
      },
    ],
    recommendedEquipment: {
      essential: ['Ghost Orb', 'Ghost Writing Book', 'Spirit Box'],
      recommended: ['Lights (many)', 'Sanity Medication', 'Flares'],
      optional: ['Video Camera', 'Thermometer'],
      avoid: [],
    },
    huntSanityThreshold: 60,
    movementSpeed: 'Normal',
    activityLevel: 'High',
    difficulty: 'Beginner',
    imageUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/3/32/Mare_Discovered.jpg/revision/latest?cb=20231115114529',
  },

  revenant: {
    id: 'revenant',
    name: 'Revenant',
    description:
      'A Revenant is a slow, powerful ghost. It is said a Revenant will attack and kill the nearest living thing it can find.',
    evidence: ['Ghost Orb', 'Freezing Temperatures', 'Ghost Writing'],
    abilities: [
      {
        name: 'Slow/Fast Movement',
        description: 'Slow when not detecting players, very fast when it does',
        effects: ['Speeds up dramatically when target found', 'Very dangerous'],
      },
    ],
    strengths: [
      {
        description: 'Moves significantly faster when player is detected',
        mechanicalAdvantage:
          'Extremely fast when chasing (can be very difficult to escape)',
      },
    ],
    weaknesses: [
      {
        description: 'Moves very slowly when not detecting a player',
        counter: 'Hide when not detected to maintain safety',
      },
    ],
    identificationTips: [
      'Extremely slow until detection, then extremely fast',
      'Will aggressively pursue detected targets',
      'Look for Freezing Temperatures',
      'Can trap players with speed changes',
      'Listen for movement changes',
    ],
    counterStrategies: [
      {
        strategy: 'Keep moving during hunts',
        effectiveness: 'High',
        tips: ['Revenant speeds up chasing players', 'Stay mobile and evasive', 'Don\'t let it catch you'],
      },
      {
        strategy: 'Hide and wait for hunt end',
        effectiveness: 'Medium',
        tips: ['Speed advantage decreases when Revenant loses sight', 'Find safe hiding spots', 'Wait out the hunt'],
      },
    ],
    recommendedEquipment: {
      essential: ['Ghost Orb', 'Ghost Writing Book', 'Freezing Temperatures'],
      recommended: ['Crucifixes', 'Sanity Medication', 'Body Armor'],
      optional: ['Video Camera', 'EMF Reader'],
      avoid: [],
    },
    huntSanityThreshold: 50,
    movementSpeed: 'Variable',
    activityLevel: 'Medium',
    difficulty: 'Advanced',
    imageUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/1/16/Revenant_Discovered.jpg/revision/latest?cb=20231115114538',
  },

  shade: {
    id: 'shade',
    name: 'Shade',
    description:
      'A Shade is a shy ghost. It hides when players are around and will not hunt if the team is not separated.',
    evidence: ['EMF Level 5', 'Freezing Temperatures', 'Ghost Writing'],
    abilities: [
      {
        name: 'Shyness',
        description: 'Avoids activity when players are nearby',
        effects: ['Reduced interactions', 'Cannot hunt if people are nearby'],
      },
    ],
    strengths: [
      {
        description: 'Cannot hunt if people are nearby',
        mechanicalAdvantage: 'Safe while together as group',
      },
    ],
    weaknesses: [
      {
        description: 'Cannot hunt if people are nearby',
        counter: 'Stay together to prevent hunts',
      },
      {
        description: 'Very shy - less likely to perform interactions',
        counter: 'Separate to trigger activity',
      },
    ],
    identificationTips: [
      'Very inactive when group is together',
      'More active when alone',
      'Look for EMF Level 5 and freezing temps',
      'Separate group to find ghost',
      'Will avoid direct confrontation',
    ],
    counterStrategies: [
      {
        strategy: 'Avoid group activity near ghost',
        effectiveness: 'High',
        tips: ['Shade avoids players', 'Breaks activity when grouped', 'Spread team apart for detection'],
      },
      {
        strategy: 'Play solo or in small groups',
        effectiveness: 'High',
        tips: ['Less scary with small numbers', 'Single player ideal for evidence', 'Less aggressive when outnumbered psychologically'],
      },
    ],
    recommendedEquipment: {
      essential: ['EMF Reader', 'Ghost Writing Book', 'Freezing Temperatures'],
      recommended: ['Crucifixes', 'Sanity Medication', 'Video Camera'],
      optional: ['Spirit Box', 'Thermometer'],
      avoid: [],
    },
    huntSanityThreshold: 50,
    movementSpeed: 'Normal',
    activityLevel: 'Low',
    difficulty: 'Beginner',
    imageUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/f/ff/Shade_Discovered.jpg/revision/latest?cb=20231115114541',
  },

  demon: {
    id: 'demon',
    name: 'Demon',
    description:
      'A Demon is one of the most dangerous ghosts to find. It is said to be extremely aggressive and powerful. It has been known to hunt players more often than any other ghost.',
    evidence: ['Freezing Temperatures', 'Ultraviolet', 'Ghost Writing'],
    abilities: [
      {
        name: 'Aggression',
        description: 'Can initiate hunts at any sanity level',
        effects: ['Unpredictable hunts', 'Very dangerous'],
      },
    ],
    strengths: [
      {
        description: 'Can hunt at any sanity level (rarely)',
        mechanicalAdvantage: 'Can hunt even at high sanity',
      },
      {
        description: 'Very aggressive',
        mechanicalAdvantage: 'More frequent hunts',
      },
    ],
    weaknesses: [
      {
        description: 'Crucifix is more effective (50% larger range)',
        counter: 'Place crucifixes strategically',
      },
    ],
    identificationTips: [
      'Extremely aggressive behavior',
      'Hunts more frequently than others',
      'Can hunt at unusual times',
      'Look for Ghost Writing evidence',
      'Best to use crucifixes',
    ],
    counterStrategies: [
      {
        strategy: 'Banish with crucifix early',
        effectiveness: 'High',
        tips: ['Demons hunt frequently', 'Crucifix essential for survival', 'Use immediately when hunt starts'],
      },
      {
        strategy: 'Have multiple crucifixes',
        effectiveness: 'High',
        tips: ['Demon hunts very often', 'Plan for 3+ crucifix uses', 'Save crucifixes for critical moments'],
      },
    ],
    recommendedEquipment: {
      essential: ['Ultraviolet', 'Ghost Writing Book', 'Freezing Temperatures'],
      recommended: ['Multiple Crucifixes', 'Sanity Medication (extra)', 'Body Armor'],
      optional: ['Video Camera', 'Spirit Box'],
      avoid: [],
    },
    huntSanityThreshold: 50,
    movementSpeed: 'Normal',
    activityLevel: 'Very High',
    difficulty: 'Expert',
    imageUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/f/f5/Demon_Discovered.jpg/revision/latest?cb=20231115114516',
  },

  yurei: {
    id: 'yurei',
    name: 'Yurei',
    description:
      'A Yurei is a ghost that is said to be capable of lowering the temperature of a room in order to cause discomfort.',
    evidence: ['Ghost Orb', 'Freezing Temperatures', 'D.O.T.S. Projector'],
    abilities: [
      {
        name: 'Door Slamming & Sanity Drain',
        description:
          'Slams doors and drains sanity from nearby players',
        effects: ['15% sanity drain', 'Required open door in room'],
      },
      {
        name: 'Smudge Trap',
        description: 'Smudging temporarily traps and slows it',
        effects: ['Reduced wandering after smudging'],
      },
    ],
    strengths: [
      {
        description: 'Can drain significant sanity with ability',
        mechanicalAdvantage: '15% sanity drain from nearby players',
      },
    ],
    weaknesses: [
      {
        description: 'Smudging traps it and reduces wandering',
        counter: 'Use smudge sticks to slow it down',
      },
      {
        description: 'Cannot use ability without open door',
        counter: 'Keep doors closed to prevent ability',
      },
    ],
    identificationTips: [
      'Look for Freezing Temperatures',
      'Listen for door slamming sounds',
      'Smudging temporarily slows it',
      'Needs open door to drain sanity',
      'More active with open doors',
    ],
    counterStrategies: [
      {
        strategy: 'Limit D.O.T.S. usage',
        effectiveness: 'High',
        tips: ['Seeing Yurei drains sanity', 'Use D.O.T.S. strategically', 'Brief viewing only'],
      },
      {
        strategy: 'Maximize team protection',
        effectiveness: 'Medium',
        tips: ['Stay grouped for sanity protection', 'Share medication', 'Team buffs reduce drain effects'],
      },
    ],
    recommendedEquipment: {
      essential: ['D.O.T.S. Projector', 'Ghost Orb', 'Freezing Temperatures'],
      recommended: ['Sanity Medication', 'Crucifixes', 'Video Camera'],
      optional: ['EMF Reader', 'Spirit Box'],
      avoid: [],
    },
    huntSanityThreshold: 50,
    movementSpeed: 'Normal',
    activityLevel: 'High',
    difficulty: 'Intermediate',
    imageUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/3/31/Yurei_Discovered.jpg/revision/latest?cb=20231115114551',
  },

  oni: {
    id: 'oni',
    name: 'Oni',
    description:
      'An Oni is a very active and aggressive ghost. It is stronger when ghost events occur near other players.',
    evidence: ['EMF Level 5', 'Freezing Temperatures', 'D.O.T.S. Projector'],
    abilities: [
      {
        name: 'Aggression Near Players',
        description:
          'More active when other players are nearby during ghost events',
        effects: ['Increased ghost events', 'More aggressive hunts'],
      },
      {
        name: 'Event Collision Drain',
        description: 'Drains 20% sanity when colliding during ghost events',
        effects: ['High sanity loss', 'During events only'],
      },
    ],
    strengths: [
      {
        description: 'Increased activity when players are nearby',
        mechanicalAdvantage: 'More dangerous in groups',
      },
      {
        description: 'More visible during hunts',
        mechanicalAdvantage: 'Easier to see - harder to escape',
      },
    ],
    weaknesses: [
      {
        description: 'No strength',
        counter: 'Standard evasion tactics',
      },
    ],
    identificationTips: [
      'Very aggressive around groups',
      'More visible during hunts',
      'Look for EMF Level 5',
      'Very active with multiple players',
      'Cannot perform "airball" ghost event',
    ],
    counterStrategies: [
      {
        strategy: 'Prepare for aggressive hunts',
        effectiveness: 'High',
        tips: ['Stock crucifixes throughout map', 'Have sanity medication ready', 'Plan safe zones'],
      },
      {
        strategy: 'Coordinate team defense',
        effectiveness: 'High',
        tips: ['Team cooperation critical', 'Share equipment strategically', 'Multiple players reduce hunt risk'],
      },
    ],
    recommendedEquipment: {
      essential: ['EMF Reader', 'D.O.T.S. Projector', 'Freezing Temperatures'],
      recommended: ['Crucifixes', 'Sanity Medication', 'Video Camera'],
      optional: ['Ghost Writing Book', 'Thermometer'],
      avoid: [],
    },
    huntSanityThreshold: 50,
    movementSpeed: 'Normal',
    activityLevel: 'Very High',
    difficulty: 'Intermediate',
    imageUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/8/86/Oni_Discovered.jpg/revision/latest?cb=20231115114533',
  },

  yokai: {
    id: 'yokai',
    name: 'Yokai',
    description:
      'A Yokai is a japanese ghost that is attracted to human voices. It is very dangerous when more than one player is present.',
    evidence: ['Ghost Orb', 'Spirit Box', 'D.O.T.S. Projector'],
    abilities: [
      {
        name: 'Voice Sensitivity',
        description: 'Can hunt at higher sanity if talking is detected',
        effects: [
          'Increased hunt threshold (80%) when player is talking',
          'Significantly more dangerous with communication',
        ],
      },
    ],
    strengths: [
      {
        description: 'Can hunt at much higher sanity when players talk',
        mechanicalAdvantage:
          'Hunting threshold jumps to 80% when talking detected',
      },
    ],
    weaknesses: [
      {
        description:
          'Can only hear players within short radius during hunts',
        counter: 'Stay quiet during hunts',
      },
    ],
    identificationTips: [
      'Gets triggered by voice communication',
      'Very dangerous in groups that talk',
      'Look for Ghost Orb evidence',
      'Silent playstyle is required',
      'Can hear player chatter from distance',
    ],
    counterStrategies: [
      {
        strategy: 'Control noise levels',
        effectiveness: 'High',
        tips: ['Minimize voice communication', 'Use hand signals instead', 'Strategic silence only'],
      },
      {
        strategy: 'Use isolated areas',
        effectiveness: 'Medium',
        tips: ['Separate team for less voice overlap', 'Setup in quiet zones', 'Minimal walkie-talkie use'],
      },
    ],
    recommendedEquipment: {
      essential: ['D.O.T.S. Projector', 'Ghost Orb', 'Spirit Box'],
      recommended: ['Ultraviolet', 'Thermometer', 'Video Camera'],
      optional: ['EMF Reader', 'Ghost Writing Book'],
      avoid: [],
    },
    huntSanityThreshold: 50,
    movementSpeed: 'Normal',
    activityLevel: 'High',
    difficulty: 'Intermediate',
    imageUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/2/27/Yokai_Discovered.jpg/revision/latest?cb=20231115114550',
  },

  hantu: {
    id: 'hantu',
    name: 'Hantu',
    description:
      'A Hantu is a ghost that is attracted to warm areas and afraid of the cold. It will move faster in colder areas.',
    evidence: ['Ghost Orb', 'Ultraviolet', 'Freezing Temperatures'],
    abilities: [
      {
        name: 'Temperature Control',
        description: 'Moves faster in cold, slower in warm areas',
        effects: [
          'Speed decreases in warm areas',
          'Speed increases in cold areas',
        ],
      },
      {
        name: 'Breath Manifestation',
        description:
          'Produces freezing breath during hunts when power is off',
        effects: ['Visual indicator', 'Freezing Temperatures evidence'],
      },
    ],
    strengths: [
      {
        description:
          'Moves faster in lower temperatures, slower in warm areas',
        mechanicalAdvantage: 'Temperature advantage',
      },
      {
        description: 'Produces freezing breath when fuse box is off',
        mechanicalAdvantage: 'Easy to see in darkness',
      },
    ],
    weaknesses: [
      {
        description: 'Warmer areas slow its movement',
        counter: 'Heat building/use warmth to slow it',
      },
      {
        description: 'Never turns fuse box on',
        counter: 'Turn fuse box off to reduce activity',
        mechanicalAdvantage: 'Power will stay off',
      },
    ],
    identificationTips: [
      'Check room temperature carefully',
      'Cold rooms = faster movement',
      'Warm rooms = slower movement',
      'Look for Freezing Temperatures',
      'Power being off shows breath',
    ],
    counterStrategies: [
      {
        strategy: 'Disable heating systems',
        effectiveness: 'High',
        tips: ['Keep warm areas heated', 'Use sanity medication in cold zones', 'Balance temperature'],
      },
      {
        strategy: 'Avoid cold zones',
        effectiveness: 'High',
        tips: ['Stay in heated areas during hunts', 'Turn on all heat sources', 'Minimize cold room exposure'],
      },
    ],
    recommendedEquipment: {
      essential: ['Ultraviolet', 'Ghost Orb', 'Freezing Temperatures'],
      recommended: ['Thermometer', 'Video Camera', 'Sanity Medication'],
      optional: ['EMF Reader', 'Spirit Box'],
      avoid: [],
    },
    huntSanityThreshold: 50,
    movementSpeed: 'Variable',
    activityLevel: 'High',
    difficulty: 'Intermediate',
    imageUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/e/e0/Hantu_Discovered.jpg/revision/latest?cb=20231115114526',
  },

  goryo: {
    id: 'goryo',
    name: 'Goryo',
    description:
      'A Goryo is a ghost that is very shy and will only reveal itself in front of the D.O.T.S. Projector. It can only enter a D.O.T.S. state when no player is in the same room.',
    evidence: ['EMF Level 5', 'Ultraviolet', 'D.O.T.S. Projector'],
    abilities: [
      {
        name: 'D.O.T.S. Only Visibility',
        description:
          'Can only be seen through D.O.T.S. Projector when no players in room',
        effects: [
          'Only visible via video camera D.O.T.S. silhouette',
          'Must be alone in room',
        ],
      },
    ],
    strengths: [
      {
        description: 'Can only be seen in D.O.T.S. when player is absent',
        mechanicalAdvantage: 'Cannot be directly seen',
      },
    ],
    weaknesses: [
      {
        description: 'Cannot wander far from its room',
        counter: 'Ghost stays localized',
      },
      {
        description: 'Cannot change favorite rooms',
        counter: 'Ghost room is permanent',
      },
      {
        description: 'D.O.T.S. silhouette only visible on video',
        counter: 'Use video camera and tripod to monitor D.O.T.S.',
        mechanicalAdvantage: 'Difficult to observe directly',
      },
    ],
    identificationTips: [
      'Very hard to see directly',
      'Must use video camera to see D.O.T.S. silhouette',
      'Leave room to trigger D.O.T.S. manifestation',
      'Look for EMF and UV evidence',
      'Set up camera with D.O.T.S. Projector and leave',
    ],
    counterStrategies: [
      {
        strategy: 'Stay close to D.O.T.S. projector',
        effectiveness: 'High',
        tips: ['Remain in ghost room with camera', 'Setup video trap immediately', 'Monitor D.O.T.S. from outside'],
      },
      {
        strategy: 'Monitor ghost room closely',
        effectiveness: 'High',
        tips: ['Never leave room unmonitored', 'Use multiple cameras if possible', 'Track D.O.T.S. activity'],
      },
    ],
    recommendedEquipment: {
      essential: ['EMF Reader', 'D.O.T.S. Projector', 'Ultraviolet'],
      recommended: ['Video Camera', 'Tripod', 'Thermometer'],
      optional: ['Ghost Orb', 'Spirit Box'],
      avoid: [],
    },
    huntSanityThreshold: 50,
    movementSpeed: 'Normal',
    activityLevel: 'Medium',
    difficulty: 'Advanced',
    imageUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/6/6b/Goryo_Discovered.jpg/revision/latest?cb=20231115114525',
  },

  myling: {
    id: 'myling',
    name: 'Myling',
    description:
      'A Myling is a ghost that is very vocal and can be heard frequently. It produces paranormal sounds more often than any other ghost.',
    evidence: ['EMF Level 5', 'Ultraviolet', 'Ghost Writing'],
    abilities: [
      {
        name: 'Vocal Activity',
        description:
          'Produces paranormal sounds more frequently than other ghosts',
        effects: [
          'Every 64-127 seconds (vs 80-127 for others)',
          'Easier to detect via audio',
        ],
      },
    ],
    strengths: [
      {
        description: 'Produces paranormal sounds more frequently',
        mechanicalAdvantage:
          'Easier to detect with parabolic microphone/sound recorder',
      },
    ],
    weaknesses: [
      {
        description:
          'Only becomes audible during hunts at closer range than others',
        counter: 'Harder to hear during hunts',
      },
    ],
    identificationTips: [
      'Very vocal - frequent paranormal sounds',
      'Use Parabolic Microphone to easily detect',
      'More vocal activity than other ghosts',
      'Look for EMF Level 5 evidence',
      'Sound Recorder will capture many sounds',
    ],
    counterStrategies: [
      {
        strategy: 'Listen for distinctive sound',
        effectiveness: 'High',
        tips: ['Use Parabolic Microphone constantly', 'Record all audio evidence', 'Identify within minutes'],
      },
      {
        strategy: 'Use audio equipment strategically',
        effectiveness: 'Medium',
        tips: ['Position microphone in common areas', 'Monitor for frequent vocalizations', 'Sound Recorder essential'],
      },
    ],
    recommendedEquipment: {
      essential: ['EMF Reader', 'Ultraviolet', 'Ghost Writing Book'],
      recommended: ['Parabolic Microphone', 'Sound Recorder', 'Thermometer'],
      optional: ['D.O.T.S. Projector', 'Spirit Box'],
      avoid: [],
    },
    huntSanityThreshold: 50,
    movementSpeed: 'Normal',
    activityLevel: 'Very High',
    difficulty: 'Beginner',
    imageUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/e/e0/Myling_Discovered.jpg/revision/latest?cb=20231115114531',
  },

  onryo: {
    id: 'onryo',
    name: 'Onryo',
    description:
      'A Onryo is a ghost that is attracted to flames. It is said that a Onryo is compelled to hunt if there are 3 or more active flames nearby.',
    evidence: ['Ghost Orb', 'Spirit Box', 'Freezing Temperatures'],
    abilities: [
      {
        name: 'Fire Attraction',
        description:
          'Will attempt to hunt after extinguishing 3 flames regardless of sanity',
        effects: [
          'Automatic hunt after 3 fires extinguished',
          'Bypasses sanity threshold',
        ],
      },
    ],
    strengths: [
      {
        description: 'Can hunt after extinguishing 3 flames at any sanity',
        mechanicalAdvantage: 'Hunt not dependent on sanity after 3 extinguished',
      },
    ],
    weaknesses: [
      {
        description: 'Nearby lit flame prevents hunting (like crucifix)',
        counter: 'Keep fires/lights lit to prevent hunts',
      },
    ],
    identificationTips: [
      'Interacts heavily with fire sources',
      'Avoid letting it extinguish 3+ flames',
      'Keep lights and fires burning',
      'Look for freezing temperatures',
      'Aggressive fire manipulation',
    ],
    counterStrategies: [
      {
        strategy: 'Avoid using fire',
        effectiveness: 'High',
        tips: ['Do not light candles/fires', 'Use flashlights instead', 'Prevent flame interaction'],
      },
      {
        strategy: 'Use alternative lighting',
        effectiveness: 'High',
        tips: ['Electronic lights instead of flames', 'Avoid all fire sources', 'Minimize hunting triggers'],
      },
    ],
    recommendedEquipment: {
      essential: ['Ghost Orb', 'Spirit Box', 'Freezing Temperatures'],
      recommended: ['Flashlight', 'Video Camera', 'Sanity Medication'],
      optional: ['Thermometer', 'EMF Reader'],
      avoid: [],
    },
    huntSanityThreshold: 50,
    movementSpeed: 'Normal',
    activityLevel: 'High',
    difficulty: 'Intermediate',
    imageUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/f/f3/Onryo_Discovered.jpg/revision/latest?cb=20231115114534',
  },

  theTwins: {
    id: 'the-twins',
    name: 'The Twins',
    description:
      'A pair of ghosts that may manifest separately or together. One is fast and one is slow, making them unpredictable and deadly.',
    evidence: ['EMF Level 5', 'Spirit Box', 'Freezing Temperatures'],
    abilities: [
      {
        name: 'Dual Hunt',
        description: 'Either twin may start a hunt, not at the same time',
        effects: [
          'One fast twin, one slow twin',
          'Can appear independently',
        ],
      },
      {
        name: 'Coordinated Interaction',
        description: 'Will often interact at same time in different places',
        effects: ['Distraction and confusion'],
      },
    ],
    strengths: [
      {
        description: 'Two independent ghosts',
        mechanicalAdvantage: 'Can hunt separately',
      },
      {
        description: 'One fast, one slow',
        mechanicalAdvantage: 'Unpredictable behavior',
      },
    ],
    weaknesses: [
      {
        description: 'Still two separate ghosts',
        counter: 'Treat as two distinct entities',
      },
    ],
    identificationTips: [
      'Will see double activity',
      'Different movement speeds',
      'Simultaneous events in different locations',
      'Look for EMF and Spirit Box evidence',
      'Can appear to hunt together',
    ],
    counterStrategies: [
      {
        strategy: 'Identify dual manifestation patterns',
        effectiveness: 'High',
        tips: ['Monitor multiple areas simultaneously', 'Track both twins separately', 'Use multiple cameras'],
      },
      {
        strategy: 'Monitor multiple rooms closely',
        effectiveness: 'Medium',
        tips: ['Divide team to cover locations', 'Watch for simultaneous activity', 'Predict next manifestation'],
      },
    ],
    recommendedEquipment: {
      essential: ['EMF Reader', 'Spirit Box', 'Freezing Temperatures'],
      recommended: ['Video Camera', 'D.O.T.S. Projector', 'Sanity Medication'],
      optional: ['Ghost Orb', 'Thermometer'],
      avoid: [],
    },
    huntSanityThreshold: 50,
    movementSpeed: 'Variable',
    activityLevel: 'Very High',
    difficulty: 'Advanced',
    imageUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/f/f8/The_Twins_Discovered.jpg/revision/latest?cb=20231115114546',
  },

  raiju: {
    id: 'raiju',
    name: 'Raiju',
    description:
      'A Raiju is a ghost that feeds on electrical activity and equipment. It is said they can be found wherever there is electrical interference.',
    evidence: ['EMF Level 5', 'Ghost Orb', 'D.O.T.S. Projector'],
    abilities: [
      {
        name: 'Electrical Sensitivity',
        description:
          'Moves faster near active electronic equipment and can drain equipment',
        effects: [
          'Faster speed near electronics',
          'Equipment interference radius 15m instead of 10m',
        ],
      },
    ],
    strengths: [
      {
        description:
          'Travels at faster speed if distant player in line of sight with power on',
        mechanicalAdvantage: 'Increased hunt speed with electronics active',
      },
      {
        description:
          'Can disrupt electronic equipment from further away (15m vs 10m)',
        mechanicalAdvantage: 'Larger interference radius',
      },
    ],
    weaknesses: [
      {
        description: 'Drawn to active electronics',
        counter: 'Turn off unnecessary equipment to avoid attention',
      },
    ],
    identificationTips: [
      'Very active near electronic equipment',
      'Faster when electronics are on',
      'Look for EMF Level 5 spikes',
      'Equipment constantly malfunctions',
      'Aggressive near power sources',
    ],
    counterStrategies: [
      {
        strategy: 'Avoid electronic interference',
        effectiveness: 'High',
        tips: ['Minimize active equipment use', 'Distance cameras away from ghost room', 'Keep EMF Reader away'],
      },
      {
        strategy: 'Minimize tech in ghost area',
        effectiveness: 'High',
        tips: ['Turn off unnecessary devices', 'Use minimal equipment setup', 'Reduce electrical activity'],
      },
    ],
    recommendedEquipment: {
      essential: ['EMF Reader', 'D.O.T.S. Projector', 'Ghost Orb'],
      recommended: ['Video Camera (positioned away)', 'Thermometer', 'Sanity Medication'],
      optional: ['Spirit Box', 'Ghost Writing Book'],
      avoid: [],
    },
    huntSanityThreshold: 50,
    movementSpeed: 'Variable',
    activityLevel: 'High',
    difficulty: 'Intermediate',
    imageUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/a/aa/Raiju_Discovered.jpg/revision/latest?cb=20231115114537',
  },

  obake: {
    id: 'obake',
    name: 'Obake',
    description:
      'An Obake is a ghost that has the ability to shapeshift. It can take many forms and may be dangerous to approach.',
    evidence: ['EMF Level 5', 'Ghost Orb', 'Ultraviolet'],
    abilities: [
      {
        name: 'Shapeshifting',
        description: 'Can briefly shapeshift into another model during hunts',
        effects: [
          'Model changes temporarily during hunts',
          'Confusion and disorientation',
        ],
      },
      {
        name: 'Fingerprint Manipulation',
        description: 'May not leave fingerprints and can cause them to fade',
        effects: [
          'No fingerprints sometimes',
          'Existing fingerprints disappear faster',
        ],
      },
      {
        name: 'Special Fingerprints',
        description: 'Occasionally leaves unique special fingerprints',
        effects: ['Distinctive evidence'],
      },
    ],
    strengths: [
      {
        description: 'Can shapeshift during hunts',
        mechanicalAdvantage: 'Changing appearance',
      },
      {
        description: 'May not leave fingerprints',
        mechanicalAdvantage: 'Evidence harder to find',
      },
    ],
    weaknesses: [
      {
        description: 'Will leave special fingerprints sometimes',
        counter: 'Look for unique UV patterns',
      },
    ],
    identificationTips: [
      'Ghost model changes during hunts',
      'Look for unique fingerprint patterns',
      'UV evidence may be sporadic',
      'Missing fingerprints are suspicious',
      'May need multiple attempts to confirm',
    ],
    counterStrategies: [
      {
        strategy: 'Collect evidence quickly',
        effectiveness: 'High',
        tips: ['Rush UV scanning immediately', 'Document all fingerprints fast', 'Minimize time in ghost room'],
      },
      {
        strategy: 'Use UV light comprehensively',
        effectiveness: 'High',
        tips: ['Full room UV scans required', 'Check for special fingerprints', 'Multiple UV checks essential'],
      },
    ],
    recommendedEquipment: {
      essential: ['EMF Reader', 'Ultraviolet', 'Ghost Orb'],
      recommended: ['Video Camera', 'Ghost Writing Book', 'Thermometer'],
      optional: ['D.O.T.S. Projector', 'Spirit Box'],
      avoid: [],
    },
    huntSanityThreshold: 50,
    movementSpeed: 'Normal',
    activityLevel: 'Medium',
    difficulty: 'Advanced',
    imageUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/7/7e/Obake_Discovered.jpg/revision/latest?cb=20231115114533',
  },

  theMinic: {
    id: 'the-mimic',
    name: 'The Mimic',
    description:
      'A Mimic is a rare ghost that is unknown to many. It can mimic the abilities of other ghosts, making it nearly impossible to identify.',
    evidence: ['Spirit Box', 'Ultraviolet', 'Freezing Temperatures'],
    abilities: [
      {
        name: 'Mimicry',
        description: 'Can mimic abilities and traits of other ghosts',
        effects: [
          'Unpredictable behavior',
          'Can appear as any other ghost type',
        ],
      },
      {
        name: 'Fake Ghost Orbs',
        description: 'Will present fake Ghost Orbs as secondary evidence',
        effects: ['Misleading evidence', 'False positives'],
      },
    ],
    strengths: [
      {
        description: 'Can mimic any ghost ability',
        mechanicalAdvantage: 'Unpredictable and dangerous',
      },
      {
        description: 'Always shows Ghost Orbs (fake)',
        mechanicalAdvantage: 'Disguises true evidence',
      },
    ],
    weaknesses: [
      {
        description: 'Real evidence never includes Ghost Orb',
        counter: 'If Ghost Orbs appear, it may be the Mimic',
      },
    ],
    identificationTips: [
      'Will always show fake Ghost Orbs',
      'Mimic is the only one with extra evidence',
      'Behavior constantly changes',
      'Hardest ghost to identify',
      'Process of elimination is key',
    ],
    counterStrategies: [
      {
        strategy: 'Understand Mimic copies ghosts',
        effectiveness: 'High',
        tips: ['It is always a Mimic if Ghost Orbs appear', 'Extra evidence is the key indicator', 'Verify with multiple tests'],
      },
      {
        strategy: 'Look for Ghost Orbs',
        effectiveness: 'High',
        tips: ['Ghost Orbs + 3 other evidence = Mimic', 'Always triggers this combination', 'Most reliable identification'],
      },
    ],
    recommendedEquipment: {
      essential: ['Ultraviolet', 'Spirit Box', 'Freezing Temperatures'],
      recommended: ['Ghost Orb', 'EMF Reader', 'Video Camera'],
      optional: ['D.O.T.S. Projector', 'Ghost Writing Book'],
      avoid: [],
    },
    huntSanityThreshold: 50,
    movementSpeed: 'Variable',
    activityLevel: 'High',
    difficulty: 'Expert',
    imageUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/e/e0/The_Mimic_Discovered.jpg/revision/latest?cb=20231115114545',
  },

  moroi: {
    id: 'moroi',
    name: 'Moroi',
    description:
      'A Moroi is a ghost that is from a human background. It can curse players, making them lose sanity quicker than usual.',
    evidence: ['Spirit Box', 'Freezing Temperatures', 'Ghost Writing'],
    abilities: [
      {
        name: 'Curse',
        description: 'Can curse players via Spirit Box communication',
        effects: [
          'Cursed players drain sanity 2x faster',
          'Lights no longer help',
          'Firelights do not help',
        ],
      },
      {
        name: 'Movement Speed',
        description: 'Moves faster at low average sanity',
        effects: ['Accelerates as team sanity decreases'],
      },
    ],
    strengths: [
      {
        description: 'Moves noticeably faster at low average sanity',
        mechanicalAdvantage: 'More dangerous as sanity drops',
      },
      {
        description: 'Can curse players via Spirit Box',
        mechanicalAdvantage: 'Doubles sanity drain on cursed',
      },
    ],
    weaknesses: [
      {
        description: 'Incense blinds it for 50% longer',
        counter: 'Use incense more effectively',
      },
    ],
    identificationTips: [
      'Uses Spirit Box frequently',
      'Moves faster when sanity is low',
      'Listen for curses via Spirit Box',
      'Doubles sanity drain when cursed',
      'Stay high sanity to keep it slow',
    ],
    counterStrategies: [
      {
        strategy: 'Minimize direct questioning',
        effectiveness: 'High',
        tips: ['Avoid Spirit Box communication', 'Use Spirit Box only when necessary', 'Reduce curse chances'],
      },
      {
        strategy: 'Prepare sanity management',
        effectiveness: 'High',
        tips: ['Keep sanity high always', 'Use sanity medication preemptively', 'Manage team sanity carefully'],
      },
    ],
    recommendedEquipment: {
      essential: ['Spirit Box', 'Ultraviolet', 'Freezing Temperatures'],
      recommended: ['Ghost Writing Book', 'Sanity Medication', 'Incense'],
      optional: ['EMF Reader', 'Thermometer'],
      avoid: [],
    },
    huntSanityThreshold: 50,
    movementSpeed: 'Variable',
    activityLevel: 'High',
    difficulty: 'Advanced',
    imageUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/9/95/Moroi_Discovered.jpg/revision/latest?cb=20231115114530',
  },

  deogen: {
    id: 'deogen',
    name: 'Deogen',
    description:
      'A Deogen is a ghost that is said to be attracted to large groups of people. It is extremely aggressive when chasing.',
    evidence: ['Spirit Box', 'Ghost Writing', 'D.O.T.S. Projector'],
    abilities: [
      {
        name: 'Aggression',
        description: 'Always knows where player is and hunts relentlessly',
        effects: [
          'Perfect tracking during hunts',
          'Very fast approach',
        ],
      },
      {
        name: 'Slow When Close',
        description: 'Moves extremely slowly once near its victim',
        effects: ['Slows down at close range', 'Can be escaped'],
      },
    ],
    strengths: [
      {
        description: 'Always knows where player is during hunt',
        mechanicalAdvantage: 'Perfect tracking - cannot hide',
      },
      {
        description: 'Moves very quickly toward victim',
        mechanicalAdvantage: 'Very fast initial approach',
      },
    ],
    weaknesses: [
      {
        description: 'Moves extremely slowly once near victim',
        counter: 'Let it get close then run - it becomes slow',
      },
    ],
    identificationTips: [
      'Terrifyingly fast initial approach',
      'Slows down dramatically at close range',
      'Cannot evade its detection',
      'Very high level difficulty',
      'Requires strategy to survive',
    ],
    counterStrategies: [
      {
        strategy: 'Recognize hunt frequency',
        effectiveness: 'High',
        tips: ['Prepare for constant hunts', 'Very aggressive from start', 'Expect frequent manifestations'],
      },
      {
        strategy: 'Use crucifixes strategically',
        effectiveness: 'High',
        tips: ['Place crucifixes in multiple rooms', 'Prepare escape routes', 'Have backup crucifixes ready'],
      },
    ],
    recommendedEquipment: {
      essential: ['Ghost Orb', 'Spirit Box', 'Freezing Temperatures'],
      recommended: ['Crucifixes', 'Sanity Medication', 'Video Camera'],
      optional: ['D.O.T.S. Projector', 'Ghost Writing Book'],
      avoid: [],
    },
    huntSanityThreshold: 40,
    movementSpeed: 'Variable',
    activityLevel: 'High',
    difficulty: 'Expert',
    imageUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/d/dd/Deogen_Discovered.jpg/revision/latest?cb=20231115114517',
  },

  thaye: {
    id: 'thaye',
    name: 'Thaye',
    description:
      'A Thaye is a ghost that is said to age over time. It becomes more active as it gets older.',
    evidence: ['Ghost Orb', 'Ghost Writing', 'D.O.T.S. Projector'],
    abilities: [
      {
        name: 'Aging Process',
        description: 'Gets faster and more active as time progresses',
        effects: [
          'Slow at beginning of contract',
          'Becomes faster over time',
        ],
      },
      {
        name: 'Time-based Activity',
        description: 'Activity increases significantly after contract start',
        effects: ['Initially very slow', 'Dramatically increases over time'],
      },
    ],
    strengths: [
      {
        description:
          'Moves faster during hunt and much more active over time at start',
        mechanicalAdvantage: 'Gets progressively more dangerous',
      },
    ],
    weaknesses: [
      {
        description: 'Becomes slower and less active over time when players nearby',
        counter: 'Hunt it early, extends contract time to tire it',
      },
    ],
    identificationTips: [
      'Initially very inactive and slow',
      'Becomes dramatically more active',
      'Activity increases throughout contract',
      'Early activity is minimal',
      'Time-based changes are distinctive',
    ],
    counterStrategies: [
      {
        strategy: 'Hunt often initially',
        effectiveness: 'High',
        tips: ['Quick identification at start', 'Less aggressive early on', 'Gather evidence quickly'],
      },
      {
        strategy: 'Manage early aggression',
        effectiveness: 'High',
        tips: ['Prepare for escalation over time', 'Rush initial hunts', 'Complete contract before it strengthens'],
      },
    ],
    recommendedEquipment: {
      essential: ['Ghost Orb', 'Ghost Writing Book', 'Freezing Temperatures'],
      recommended: ['D.O.T.S. Projector', 'Video Camera', 'Sanity Medication'],
      optional: ['EMF Reader', 'Spirit Box'],
      avoid: [],
    },
    huntSanityThreshold: 50,
    movementSpeed: 'Variable',
    activityLevel: 'Variable',
    difficulty: 'Beginner',
    imageUrl: 'https://static.wikia.nocookie.net/phasmophobia/images/6/6a/Thaye_Discovered.jpg/revision/latest?cb=20231115114544',
  },
};

export const GHOST_LIST = Object.values(GHOSTS);
export const GHOST_NAMES = GHOST_LIST.map((g) => g.name);
