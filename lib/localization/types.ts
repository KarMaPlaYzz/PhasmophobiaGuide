export type SupportedLanguage = 'en' | 'de' | 'nl' | 'fr' | 'es' | 'it' | 'pt' | 'sv';

export const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  en: 'English',
  de: 'Deutsch',
  nl: 'Nederlands',
  fr: 'Français',
  es: 'Español',
  it: 'Italiano',
  pt: 'Português',
  sv: 'Svenska',
};

export const LANGUAGE_CODES: Record<SupportedLanguage, string> = {
  en: 'en-US',
  de: 'de-DE',
  nl: 'nl-NL',
  fr: 'fr-FR',
  es: 'es-ES',
  it: 'it-IT',
  pt: 'pt-PT',
  sv: 'sv-SE',
};

export interface Translations {
  // Navigation & Tabs
  tabs: {
    ghosts: string;
    equipment: string;
    maps: string;
    evidence: string;
    sanity: string;
    // Tab Screen UI Strings
    ghosts_searchPlaceholder: string;
    ghosts_speed: string;
    ghosts_hunt: string;
    ghosts_sanityDrain: string;
    ghosts_evidence: string;
    ghosts_tapToViewDetails: string;
    ghosts_noResults: string;
    ghosts_resultSingular: string;
    ghosts_resultPlural: string;
    // Evidence names (for display in ghost cards/detail)
    evidence_emfLevel5: string;
    evidence_dots: string;
    evidence_ultraviolet: string;
    evidence_ghostOrb: string;
    evidence_ghostWriting: string;
    evidence_spiritBox: string;
    evidence_freezingTemperatures: string;
    equipment_searchPlaceholder: string;
    equipment_resultSingular: string;
    equipment_resultPlural: string;
    equipment_costLabel: string;
    equipment_capacityLabel: string;
    equipment_noResults: string;
    maps_searchPlaceholder: string;
    maps_sizeSmall: string;
    maps_sizeMedium: string;
    maps_sizeLarge: string;
    sanity_diffAmateur: string;
    sanity_diffIntermediate: string;
    sanity_diffProfessional: string;
    sanity_diffNightmare: string;
    sanity_diffInsanity: string;
    sanity_sizeSmall: string;
    sanity_sizeMedium: string;
    sanity_sizeLarge: string;
  };

  // Common
  common: {
    settings: string;
    close: string;
    cancel: string;
    clear: string;
    delete: string;
    save: string;
    loading: string;
    error: string;
    success: string;
    warning: string;
    confirm: string;
  };

  // Header
  header: {
    whatsNew: string;
    bookmarks: string;
    history: string;
    settings: string;
  };

  // Settings
  settings: {
    title: string;
    managePreferences: string;
    notificationsUpdates: string;
    blogNotifications: string;
    blogNotificationsDesc: string;
    dataStorage: string;
    clearHistory: string;
    clearHistoryDesc: string;
    clearHistoryConfirm: string;
    clearHistoryMessage: string;
    clearBookmarks: string;
    clearBookmarksDesc: string;
    clearBookmarksConfirm: string;
    clearBookmarksMessage: string;
    behaviorPreferences: string;
    hapticFeedback: string;
    hapticFeedbackDesc: string;
    defaultTab: string;
    defaultTabDesc: string;
    language: string;
    languageDesc: string;
    aboutInfo: string;
    appVersion: string;
    gameDataUpdated: string;
    clearSuccess: string;
    clearError: string;
  };

  // Evidence
  evidence: {
    title: string;
    collectEvidence: string;
    ghostMatches: string;
    noMatches: string;
    noMatchesMessage: string;
    nextSteps: string;
    troubleshootingGuide: string;
    verifyEvidence: string;
    verifyEvidenceMessage: string;
    checkSources: string;
    checkSourcesMessage: string;
    resetAndTry: string;
    resetAndTryMessage: string;
    confirmed: string;
    investigating: string;
    notFound: string;
  };

  // Ghosts
  ghosts: {
    title: string;
    difficulty: string;
    strengths: string;
    weaknesses: string;
    evidence: string;
    abilities: string;
    loot: string;
  };

  // Equipment
  equipment: {
    title: string;
    effectiveness: string;
    range: string;
    battery: string;
    description: string;
    usage: string;
  };

  // Bookmarks
  bookmarks: {
    title: string;
    empty: string;
    noBookmarks: string;
    addBookmark: string;
    removeBookmark: string;
  };

  // History
  history: {
    title: string;
    empty: string;
    noHistory: string;
    clearAll: string;
  };

  // What's New
  whatsNew: {
    title: string;
    features: string;
    upcomingFeatures: string;
    newIn: string;
    comingSoon: string;
  };

  // Maps
  maps: {
    title: string;
    layout: string;
    exits: string;
    hazards: string;
    ghosts: string;
  };

  // Sanity
  sanity: {
    title: string;
    calculator: string;
    currentSanity: string;
    estimate: string;
  };

  // Status & Feedback
  status: {
    loading: string;
    loaded: string;
    failed: string;
    retry: string;
    noData: string;
  };

  // Component Labels (UI titles, section headers)
  componentLabels: {
    description: string;
    evidenceRequired: string;
    huntSanityThreshold: string;
    ghostHuntsWhenSanity: string;
    safe: string;
    danger: string;
    specialAbilities: string;
    strengths: string;
    weaknesses: string;
    counterStrategies: string;
    recommendedEquipment: string;
    mustBring: string;
    recommended: string;
    optional: string;
    avoid: string;
    high: string;
    medium: string;
    low: string;
    tiers: string;
    evidence: string;
    synergies: string;
    filterAll: string;
    about: string;
    howToUse: string;
    detectsEvidence: string;
    upgradeTiers: string;
    bestFor: string;
    identificationTips: string;
    zones: string;
    strategies: string;
    hazards: string;
    specialFeatures: string;
    ghostSpawns: string;
    lighting: string;
    floorPlan: string;
    tips: string;
    soloTips: string;
    huntStrategy: string;
    consumable: string;
    reusable: string;
    fuse: string;
    cost: string;
    capacity: string;
    unlocks: string;
    rooms: string;
    players: string;
    free: string;
    yes: string;
    no: string;
    level: string;
    budget: string;
    budgetLeft: string;
    totalCost: string;
    tier: string;
    playstyle: string;
    loadoutBuilder: string;
    loadoutBuilderDesc: string;
    targetGhost: string;
    all: string;
    mapSize: string;
    difficulty: string;
    efficiency: string;
    essential: string;
  };

  // Ghost Data - Descriptions (24 ghosts)
  ghostData?: {
    descriptions?: Record<string, string>;
    abilities?: Record<string, string>;
    strengths?: Record<string, string>;
    weaknesses?: Record<string, string>;
    tips?: Record<string, string>;
    strategies?: Record<string, string>;
  };
}
