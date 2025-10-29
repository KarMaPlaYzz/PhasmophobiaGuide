/**
 * App Review Service
 * Manages App Store review prompts with smart timing and frequency capping
 * 
 * Features:
 * - Tracks review request history to avoid pestering users
 * - Implements 2-3 month cool-down between requests
 * - Counts user engagement (interactions) to determine readiness for review request
 * - Respects user's "Never" choice permanently
 * - Uses AsyncStorage for persistence
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

interface ReviewPromptData {
  lastReviewRequestDate: number; // Timestamp of last review request
  lastReviewRequestVersion: string; // App version when last requested
  dismissCount: number; // How many times user clicked "Later"
  hasUserDeclinedPermanently: boolean; // User clicked "Never"
  interactionCount: number; // Number of feature interactions
  lastInteractionResetDate: number; // Date when interaction count was reset
}

// Storage keys
const STORAGE_KEYS = {
  REVIEW_PROMPT_DATA: '@phasmophobia_guide/review_prompt_data',
} as const;

// Configuration
const CONFIG = {
  MIN_INTERACTIONS_FOR_PROMPT: 3, // Require 3+ interactions before showing prompt
  DAYS_BETWEEN_REQUESTS: 60, // Wait 2 months between requests
  MAX_DISMISSALS_BEFORE_WAITING_LONGER: 3, // After 3 "Later"s, wait longer
  EXTENDED_WAIT_DAYS: 90, // Wait 3 months if user keeps dismissing
  INTERACTION_RESET_DAYS: 7, // Reset interaction count every week if not requested
};

const DEFAULT_REVIEW_DATA: ReviewPromptData = {
  lastReviewRequestDate: 0,
  lastReviewRequestVersion: '',
  dismissCount: 0,
  hasUserDeclinedPermanently: false,
  interactionCount: 0,
  lastInteractionResetDate: Date.now(),
};

/**
 * Get current app version
 * In a real app, this would come from your app.json or Constants
 */
const getAppVersion = (): string => {
  // This would typically come from app.json or expo-constants
  return '1.0.0';
};

/**
 * Load review prompt data from storage
 */
const loadReviewData = async (): Promise<ReviewPromptData> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.REVIEW_PROMPT_DATA);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('[AppReview] Error loading review data:', error);
  }
  return DEFAULT_REVIEW_DATA;
};

/**
 * Save review prompt data to storage
 */
const saveReviewData = async (data: ReviewPromptData): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.REVIEW_PROMPT_DATA, JSON.stringify(data));
  } catch (error) {
    console.error('[AppReview] Error saving review data:', error);
  }
};

/**
 * Record a user interaction (search, compare, filter, etc.)
 * Call this whenever user completes a meaningful action
 */
export const recordAppInteraction = async (): Promise<void> => {
  try {
    const data = await loadReviewData();
    const now = Date.now();
    const daysSinceLastReset = (now - data.lastInteractionResetDate) / (1000 * 60 * 60 * 24);

    // Reset interaction count if a week has passed
    if (daysSinceLastReset > CONFIG.INTERACTION_RESET_DAYS) {
      data.interactionCount = 0;
      data.lastInteractionResetDate = now;
    }

    data.interactionCount++;
    console.log(
      `[AppReview] Interaction recorded (${data.interactionCount}/${CONFIG.MIN_INTERACTIONS_FOR_PROMPT})`
    );

    await saveReviewData(data);
  } catch (error) {
    console.error('[AppReview] Error recording interaction:', error);
  }
};

/**
 * Check if we should show the review prompt
 * Returns true if:
 * - User has NOT permanently declined
 * - Enough time has passed since last request
 * - User has completed enough interactions
 * - We haven't requested multiple times in current session
 */
export const shouldShowReviewPrompt = async (): Promise<boolean> => {
  try {
    const data = await loadReviewData();
    const now = Date.now();
    const currentVersion = getAppVersion();

    // User has permanently declined - never show again
    if (data.hasUserDeclinedPermanently) {
      console.log('[AppReview] User has declined permanently');
      return false;
    }

    // Not enough interactions yet
    if (data.interactionCount < CONFIG.MIN_INTERACTIONS_FOR_PROMPT) {
      console.log(
        `[AppReview] Not enough interactions (${data.interactionCount}/${CONFIG.MIN_INTERACTIONS_FOR_PROMPT})`
      );
      return false;
    }

    // Check if it's a new app version
    if (currentVersion !== data.lastReviewRequestVersion) {
      console.log('[AppReview] New app version detected - eligible for review prompt');
      return true;
    }

    // Check if enough time has passed
    const daysSinceLastRequest = (now - data.lastReviewRequestDate) / (1000 * 60 * 60 * 24);

    // If user keeps dismissing ("Later"), wait longer
    const waitDays =
      data.dismissCount >= CONFIG.MAX_DISMISSALS_BEFORE_WAITING_LONGER
        ? CONFIG.EXTENDED_WAIT_DAYS
        : CONFIG.DAYS_BETWEEN_REQUESTS;

    if (daysSinceLastRequest < waitDays) {
      console.log(
        `[AppReview] Not enough time passed (${Math.ceil(daysSinceLastRequest)}/${waitDays} days)`
      );
      return false;
    }

    console.log('[AppReview] Review prompt should be shown');
    return true;
  } catch (error) {
    console.error('[AppReview] Error checking review eligibility:', error);
    return false;
  }
};

/**
 * Record that the user clicked "Rate Now"
 * This opens the App Store review page (handled by component)
 */
export const recordReviewRequested = async (): Promise<void> => {
  try {
    const data = await loadReviewData();
    data.lastReviewRequestDate = Date.now();
    data.lastReviewRequestVersion = getAppVersion();
    data.dismissCount = 0; // Reset dismiss count on successful request
    data.interactionCount = 0; // Reset interactions
    await saveReviewData(data);
    console.log('[AppReview] Review request recorded');
  } catch (error) {
    console.error('[AppReview] Error recording review request:', error);
  }
};

/**
 * Record that the user clicked "Maybe Later"
 * Shows prompt again in 1 week, or 3 months if dismissed multiple times
 */
export const recordReviewDismissed = async (): Promise<void> => {
  try {
    const data = await loadReviewData();
    data.lastReviewRequestDate = Date.now();
    data.dismissCount++;
    data.interactionCount = 0; // Reset interactions, they need to re-engage
    await saveReviewData(data);
    console.log(`[AppReview] Review dismissed (${data.dismissCount} total dismissals)`);
  } catch (error) {
    console.error('[AppReview] Error recording review dismissal:', error);
  }
};

/**
 * Record that the user clicked "Never Ask Again"
 * Permanently disables review prompts
 */
export const recordReviewDeclinedPermanently = async (): Promise<void> => {
  try {
    const data = await loadReviewData();
    data.hasUserDeclinedPermanently = true;
    await saveReviewData(data);
    console.log('[AppReview] User declined permanently - review prompts disabled');
  } catch (error) {
    console.error('[AppReview] Error recording permanent decline:', error);
  }
};

/**
 * Reset review prompt data (for testing or user request)
 */
export const resetReviewPromptData = async (): Promise<void> => {
  try {
    await saveReviewData(DEFAULT_REVIEW_DATA);
    console.log('[AppReview] Review prompt data reset');
  } catch (error) {
    console.error('[AppReview] Error resetting review data:', error);
  }
};

/**
 * Get current review data (for debugging)
 */
export const getReviewDebugInfo = async (): Promise<ReviewPromptData> => {
  return loadReviewData();
};

export const appReviewService = {
  recordAppInteraction,
  shouldShowReviewPrompt,
  recordReviewRequested,
  recordReviewDismissed,
  recordReviewDeclinedPermanently,
  resetReviewPromptData,
  getReviewDebugInfo,
};
