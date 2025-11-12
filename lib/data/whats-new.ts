// What's New / Upcoming Features Tracker
// Includes both app updates and Phasmophobia game updates

// Special constant for To Be Announced dates
export const TBA_DATE = -1;

export interface Feature {
  id: string;
  title: string;
  description: string;
  releaseDate: number; // Unix timestamp or TBA_DATE for unconfirmed dates
  icon?: string; // Icon name from Ionicons
  category: 'feature' | 'improvement' | 'bugfix' | 'balance' | 'content';
  status: 'released' | 'announced' | 'upcoming';
  details?: string;
  tags?: string[];
  priority?: 'low' | 'medium' | 'high';
  source?: 'app' | 'game'; // Track whether this is an app feature or game update
  images?: string[]; // URLs or local image paths for feature previews
}

export interface FeatureRelease {
  releaseId: string;
  version: string;
  releaseDate: number;
  title: string;
  description: string;
  features: Feature[];
  highlights?: string[];
}

// Current features and upcoming releases
export const FEATURE_RELEASES: FeatureRelease[] = [
  {
    releaseId: 'v1.0.0',
    version: '1.0.0',
    releaseDate: new Date('2024-11-15').getTime(),
    title: 'Phasmophobia Guide - Initial Release',
    description: 'The complete ghost hunting companion app with all essential tools',
    highlights: [
      'Complete ghost database with identification tools',
      'Equipment guide and optimizer',
      'Evidence tracker and identifier',
      'Sanity calculator',
      'Bookmark and history system',
    ],
    features: [
      {
        id: 'ghost-database',
        title: 'Complete Ghost Database',
        description: 'Browse all ghosts with detailed information including evidence, hunting grounds, and behaviors',
        releaseDate: new Date('2024-11-15').getTime(),
        icon: 'skull',
        category: 'content',
        status: 'released',
      },
      {
        id: 'equipment-guide',
        title: 'Equipment Guide',
        description: 'Comprehensive equipment listings with categories, costs, and usage tips',
        releaseDate: new Date('2024-11-15').getTime(),
        icon: 'flashlight-on',
        category: 'feature',
        status: 'released',
      },
      {
        id: 'evidence-identifier',
        title: 'Evidence Identifier',
        description: 'Quickly identify ghosts based on found evidence',
        releaseDate: new Date('2024-11-15').getTime(),
        icon: 'fingerprint',
        category: 'feature',
        status: 'released',
      },
      {
        id: 'sanity-calculator',
        title: 'Sanity Calculator',
        description: 'Track sanity levels and estimate ghost hunt timings',
        releaseDate: new Date('2024-11-15').getTime(),
        icon: 'pulse',
        category: 'feature',
        status: 'released',
      },
    ],
  },
];

export const UPCOMING_FEATURES: Feature[] = [
  {
    id: 'multiplayer-sharing',
    title: 'Multiplayer Loadout Sharing',
    description: 'Share your equipment loadouts and bookmarks with friends',
    releaseDate: new Date('2025-03-01').getTime(),
    icon: 'share-social',
    category: 'feature',
    status: 'upcoming',
    details: 'Generate shareable codes for loadouts and bookmarks collections',
    tags: ['Social', 'Features'],
  },
  {
    id: 'performance-improvements',
    title: 'Performance Optimizations',
    description: 'Faster app loading times and smoother animations throughout the app',
    releaseDate: new Date('2025-02-15').getTime(),
    icon: 'flash',
    category: 'improvement',
    status: 'announced',
    details: 'Reduced bundle size, optimized re-renders, and faster data loading',
    tags: ['Performance'],
  },
  {
    id: 'offline-mode',
    title: 'Offline Mode',
    description: 'Use the app without an internet connection with cached data',
    releaseDate: new Date('2025-04-01').getTime(),
    icon: 'cloud-offline',
    category: 'feature',
    status: 'upcoming',
    details: 'Download and cache all data for offline access',
    tags: ['Accessibility', 'Features'],
  },
];

// Phasmophobia game updates and announcements
// Data sourced from official Kinetic Games announcements and GameWatcher coverage
export const PHASMOPHOBIA_UPDATES: Feature[] = [
  {
    id: 'chronicle-update',
    title: 'Chronicle Update - Evidence Capture Rework',
    description: 'Major journal and evidence capture system overhaul introducing new Media tab and Sound Recorder equipment',
    releaseDate: TBA_DATE,
    icon: 'folder-open',
    category: 'feature',
    status: 'announced',
    details: 'New Media tab replaces Photos, captures photos/videos/sound separately. First capture of any media type labeled "unique" for bonus rewards. Sound Recorder equipment added for capturing paranormal audio evidence.',
    tags: ['Chronicle', 'Feature', 'Evidence'],
    source: 'game',
    images: [
      'https://images.gamewatcherstatic.com/image/file/1/8a/129991/Phasmophobia-2025-Roadmap.jpg',
    ],
  },
  {
    id: 'player-character-overhaul',
    title: 'Player Character Overhaul',
    description: 'Complete visual and mechanical redesign of player characters',
    releaseDate: TBA_DATE,
    icon: 'person',
    category: 'feature',
    status: 'announced',
    details: 'Major update affecting character models, customization options, and visual presentation',
    tags: ['Characters', 'Visual'],
    source: 'game',
  },
  {
    id: 'nells-diner-map',
    title: "Nell's Diner - New Small Map",
    description: 'Classic retro American diner with counter, booths, kitchen, and jukebox. Phasmophobia\'s 14th map.',
    releaseDate: new Date('2025-11-11').getTime(),
    icon: 'restaurant',
    category: 'content',
    status: 'announced',
    details: 'Intimate diner setting with size comparable to house locations. Features classic diner counter, comfy booths, working kitchen, and unique atmospheric elements. Contains plenty of surprises according to Lead Developer Dknighter.',
    tags: ['Map', 'Content', 'Nell\'s Diner'],
    source: 'game',
    images: [
      'https://images.gamewatcherstatic.com/image/file/0/25/131810/NellsDinerPhasmophobia.jpg',
      'https://images.gamewatcherstatic.com/image/file/1/61/131811/NellsDinerPhasmophobia2.jpg',
      'https://images.gamewatcherstatic.com/image/file/2/09/131812/NellsDinerPhasmophobia3.jpg',
      'https://images.gamewatcherstatic.com/image/file/4/40/131814/Diner_screenshot_2.jpg',
      'https://images.gamewatcherstatic.com/image/file/3/d7/131813/Diner_screenshot_1.jpg',
      'https://images.gamewatcherstatic.com/image/file/5/3b/131815/Diner_screenshot_3.jpg',
      'https://images.gamewatcherstatic.com/image/file/6/18/131816/Diner_screenshot_4.jpg',
    ],
  },
  {
    id: 'moneybags-cosmetic',
    title: 'Moneybags ID Card & Badge',
    description: 'New cosmetic cosmetics unlock tied to the "Break the Bank" achievement',
    releaseDate: new Date('2025-11-11').getTime(),
    icon: 'wallet',
    category: 'content',
    status: 'released',
    details: 'Exclusive Moneybags ID Card and Badge cosmetics reward for players who earn the "Break the Bank" achievement. Players who previously earned the achievement will receive the cosmetic upon spending $1 in the in-game shop after updating to v0.15.0.0.',
    tags: ['Cosmetic', 'Achievement', 'Reward', 'Moneybags'],
    source: 'game',
  },
  {
    id: 'bleasdale-farmhouse-rework',
    title: 'Bleasdale Farmhouse - Complete Rework',
    description: 'Visual enhancements and complete redesign with new outdoor garden areas',
    releaseDate: TBA_DATE,
    icon: 'home',
    category: 'improvement',
    status: 'announced',
    details: 'New garden area outside main living room with ghost rooms. Revamped interior layout and visual design for enhanced horror',
    tags: ['Rework', 'Map', 'Farmhouse'],
    source: 'game',
  },
  {
    id: 'grafton-farmhouse-rework',
    title: 'Grafton Farmhouse - Redesign & Visual Update',
    description: 'Isolated farmland map receives complete visual and layout overhaul',
    releaseDate: new Date('2025-08-12').getTime(),
    icon: 'home',
    category: 'improvement',
    status: 'released',
    details: 'Dilapidated home with faulty electrics, caved-in ceilings, layers of dust. New themed rooms: eerie attic and harrowing seamstress room',
    tags: ['Rework', 'Map', 'Farmhouse'],
    source: 'game',
    images: [
      'https://images.gamewatcherstatic.com/image/file/8/98/131818/phas_grafton_screenshot_1.jpg',
      'https://images.gamewatcherstatic.com/image/file/0/01/131820/phas_grafton_screenshot_3.jpg',
      'https://images.gamewatcherstatic.com/image/file/1/f8/131821/phas_grafton_screenshot_4.jpg',
      'https://images.gamewatcherstatic.com/image/file/2/43/131822/phas_grafton_screenshot_5.jpg',
      'https://images.gamewatcherstatic.com/image/file/3/0c/131823/phas_grafton_screenshot_6.jpg',
    ],
  },
  {
    id: 'seasonal-events-2025',
    title: 'Seasonal Events - Easter, Halloween, Holidays',
    description: 'Limited-time seasonal events throughout 2025 with exclusive content and rewards',
    releaseDate: TBA_DATE,
    icon: 'gift',
    category: 'content',
    status: 'announced',
    details: 'Easter, Halloween, and holiday seasonal events with unique cosmetics, hunting bonuses, and limited-time challenges',
    tags: ['Events', 'Seasonal'],
    source: 'game',
  },
  {
    id: 'horror-2-0-teaser',
    title: 'Horror 2.0 - Major 2026 Relaunch',
    description: 'Planned for 2026: Complete horror system overhaul with new maps and major gameplay changes',
    releaseDate: TBA_DATE,
    icon: 'skull',
    category: 'feature',
    status: 'announced',
    details: 'Kinetic Games planning major horror systems update alongside additional house map reworks and new maps in 2026',
    tags: ['Horror 2.0', '2026', 'Major Update'],
    source: 'game',
  },
];

// Utility functions
export const getLatestRelease = (): FeatureRelease | null => {
  return FEATURE_RELEASES.sort(
    (a, b) => b.releaseDate - a.releaseDate
  )[0] || null;
};

export const getReleasedFeatures = (): Feature[] => {
  const released = FEATURE_RELEASES.flatMap((release) =>
    release.features.filter((f) => f.status === 'released')
  );
  return released.sort((a, b) => b.releaseDate - a.releaseDate);
};

export const getAnnouncedFeatures = (): Feature[] => {
  return UPCOMING_FEATURES
    .filter((f) => f.status === 'announced')
    .sort((a, b) => a.releaseDate - b.releaseDate);
};

export const getUpcomingFeatures = (): Feature[] => {
  return UPCOMING_FEATURES
    .filter((f) => f.status === 'upcoming')
    .sort((a, b) => a.releaseDate - b.releaseDate);
};

export const getAllFeatures = (): Feature[] => {
  return [
    ...getReleasedFeatures(),
    ...getAnnouncedFeatures(),
    ...getUpcomingFeatures(),
  ].sort((a, b) => b.releaseDate - a.releaseDate);
};

export const getFeaturesByCategory = (category: Feature['category']): Feature[] => {
  return getAllFeatures().filter((f) => f.category === category);
};

export const getFeaturesByPriority = (priority: Feature['priority']): Feature[] => {
  return getAllFeatures().filter((f) => f.priority === priority);
};

// Phasmophobia game updates utilities
export const getPhasmophobiaUpdates = (): Feature[] => {
  return PHASMOPHOBIA_UPDATES.sort((a, b) => {
    // TBA dates go to the end
    if (a.releaseDate === TBA_DATE && b.releaseDate === TBA_DATE) return 0;
    if (a.releaseDate === TBA_DATE) return 1;
    if (b.releaseDate === TBA_DATE) return -1;
    return b.releaseDate - a.releaseDate;
  });
};

export const getLatestPhasmophobiaUpdate = (): Feature | null => {
  return PHASMOPHOBIA_UPDATES.sort((a, b) => {
    // TBA dates go to the end
    if (a.releaseDate === TBA_DATE && b.releaseDate === TBA_DATE) return 0;
    if (a.releaseDate === TBA_DATE) return 1;
    if (b.releaseDate === TBA_DATE) return -1;
    return b.releaseDate - a.releaseDate;
  })[0] || null;
};

export const getPhasmophobiaUpdatesByCategory = (category: Feature['category']): Feature[] => {
  return PHASMOPHOBIA_UPDATES.filter((f) => f.category === category).sort((a, b) => {
    // TBA dates go to the end
    if (a.releaseDate === TBA_DATE && b.releaseDate === TBA_DATE) return 0;
    if (a.releaseDate === TBA_DATE) return 1;
    if (b.releaseDate === TBA_DATE) return -1;
    return b.releaseDate - a.releaseDate;
  });
};

export const formatReleaseDate = (timestamp: number): string => {
  if (timestamp === TBA_DATE) {
    return 'TBA';
  }
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const getDaysUntilRelease = (releaseDate: number): number => {
  if (releaseDate === TBA_DATE) {
    return 0;
  }
  return Math.ceil((releaseDate - Date.now()) / (1000 * 60 * 60 * 24));
};

export const getCountdownLabel = (releaseDate: number): string => {
  if (releaseDate === TBA_DATE) {
    return '';
  }

  const now = Date.now();
  const diff = releaseDate - now;

  if (diff < 0) return '';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0 || parts.length > 0) parts.push(`${hours}h`);
  if (minutes > 0 || parts.length > 0) parts.push(`${minutes}m`);
  parts.push(`${seconds}s`);

  return parts.join(' ');
};

export const getStatusLabel = (status: string, releaseDate: number): string => {
  if (status === 'released') return 'Released';
  if (releaseDate === TBA_DATE) return 'TBA';
  if (status === 'announced') return 'Coming Soon';
  
  const daysUntil = getDaysUntilRelease(releaseDate);
  if (daysUntil < 0) return 'Overdue';
  if (daysUntil === 0) return 'Today';
  if (daysUntil === 1) return 'Tomorrow';
  return `${daysUntil}d away`;
};
