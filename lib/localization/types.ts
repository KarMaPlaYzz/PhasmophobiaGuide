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
}
