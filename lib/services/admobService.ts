import { isExpoGo } from '@/lib/utils/is-expo-go';
import { AppState, Platform } from 'react-native';

/**
 * AdMob Service
 * Manages banner ads, interstitial ads, and rewarded ads
 * Uses test IDs by default - replace with real IDs in production
 * 
 * Note: In Expo Go, native modules (like Google Mobile Ads) are not available,
 * so ads are gracefully disabled and all functions return safe defaults.
 */

// Lazy load the Google Mobile Ads module only when needed (not in Expo Go)
let BannerAdSize: any = null;
let InterstitialAd: any = null;
let RewardedAd: any = null;
let TestIds: any = null;

const initializeGoogleMobileAds = () => {
  if (isExpoGo()) {
    console.log('[AdMob] Running in Expo Go - native modules disabled, ads will not be shown');
    return false;
  }
  
  try {
    const module = require('react-native-google-mobile-ads');
    BannerAdSize = module.BannerAdSize;
    InterstitialAd = module.InterstitialAd;
    RewardedAd = module.RewardedAd;
    TestIds = module.TestIds;
    console.log('[AdMob] Google Mobile Ads module loaded successfully');
    return true;
  } catch (error) {
    console.warn('[AdMob] Failed to load Google Mobile Ads module:', error);
    return false;
  }
};

// Initialize on module load
const ADS_AVAILABLE = initializeGoogleMobileAds();

// Test Ad IDs (use these in development)
const TEST_BANNER_ID = TestIds?.BANNER || 'test_banner';
const TEST_INTERSTITIAL_ID = TestIds?.INTERSTITIAL || 'test_interstitial';
const TEST_REWARDED_ID = TestIds?.REWARDED || 'test_rewarded';

// Production Ad IDs (replace with your real IDs from AdMob)
// Format: "ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyyyyyy"
const PRODUCTION_BANNER_ID = {
  ios: 'ca-app-pub-1542092338741994/1508942265',
  android: 'ca-app-pub-3940256099942544/6300978111', // Replace with your Android banner ID
};

const PRODUCTION_INTERSTITIAL_ID = {
  ios: 'ca-app-pub-1542092338741994/7284013125', 
  android: 'ca-app-pub-3940256099942544/1033173712', // Replace with your Android interstitial ID
};

const PRODUCTION_REWARDED_ID = {
  ios: 'ca-app-pub-1542092338741994/1890588787',
  android: 'ca-app-pub-3940256099942544/5224354917', // Replace with your Android rewarded ID
};

// Use test IDs for development
const USE_TEST_IDS = false; // Set to false in production

const getBannerId = (): string => {
  if (!ADS_AVAILABLE) return 'ads_disabled';
  if (USE_TEST_IDS) return TEST_BANNER_ID;
  const platformId = Platform.OS === 'ios' 
    ? PRODUCTION_BANNER_ID.ios 
    : PRODUCTION_BANNER_ID.android;
  return platformId;
};

const getInterstitialId = (): string => {
  if (!ADS_AVAILABLE) return 'ads_disabled';
  if (USE_TEST_IDS) return TEST_INTERSTITIAL_ID;
  const platformId = Platform.OS === 'ios'
    ? PRODUCTION_INTERSTITIAL_ID.ios
    : PRODUCTION_INTERSTITIAL_ID.android;
  return platformId;
};

const getRewardedId = (): string => {
  if (!ADS_AVAILABLE) return 'ads_disabled';
  if (USE_TEST_IDS) return TEST_REWARDED_ID;
  const platformId = Platform.OS === 'ios'
    ? PRODUCTION_REWARDED_ID.ios
    : PRODUCTION_REWARDED_ID.android;
  return platformId;
};

// State tracking
let interstitialAd: any = null;
let interstitialLoaded = false;
let rewardedAd: any = null;
let rewardedLoaded = false;

// Retry tracking for exponential backoff
let interstitialRetryCount = 0;
let rewardedRetryCount = 0;
let interstitialRetryTimeout: any = null;
let rewardedRetryTimeout: any = null;

// Frequency capping (prevent ad fatigue)
let lastInterstitialShowTime = 0;
let interstitialShowCount = 0;
const INTERSTITIAL_MIN_INTERVAL = 2 * 60 * 1000; // 2 minutes between ads
const INTERSTITIAL_MAX_PER_SESSION = 3; // Max 3 ads per session

// Daily capping (prevent excessive ads across sessions)
let dailyAdCount = 0;
let lastDailyResetTime = Date.now();
const INTERSTITIAL_MAX_PER_DAY = 6; // Max 6 ads per 24 hours
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

// Configuration
const INITIAL_RETRY_DELAY = 5000; // 5 seconds
const MAX_RETRIES = 5; // Max retry attempts for interstitial/rewarded
const MAX_RETRIES_BANNER = 6; // Max retry attempts for banner (more aggressive)
const BACKOFF_MULTIPLIER = 1.5; // Exponential backoff multiplier
const MAX_BACKOFF_DELAY = 60000; // Cap at 60 seconds

/**
 * Calculate exponential backoff delay
 * Prevents overwhelming AdMob servers with requests
 */
const getRetryDelay = (retryCount: number): number => {
  const exponentialDelay = INITIAL_RETRY_DELAY * Math.pow(BACKOFF_MULTIPLIER, retryCount);
  return Math.min(exponentialDelay, MAX_BACKOFF_DELAY);
};

/**
 * Check if daily ad limit has been exceeded
 * Returns true if we can show an ad, false if daily limit reached
 */
const checkDailyAdCap = (): boolean => {
  const now = Date.now();
  const timeSinceLastReset = now - lastDailyResetTime;
  
  // Reset daily count if 24 hours have passed
  if (timeSinceLastReset >= ONE_DAY_MS) {
    dailyAdCount = 0;
    lastDailyResetTime = now;
    console.log('[AdMob] Daily ad counter reset (24 hours passed)');
  }
  
  if (dailyAdCount >= INTERSTITIAL_MAX_PER_DAY) {
    console.log(`[AdMob] Daily ad cap reached (${dailyAdCount}/${INTERSTITIAL_MAX_PER_DAY})`);
    return false;
  }
  
  return true;
};

/**
 * Check if enough time has passed since last interstitial ad
 * Returns true if we can show an ad, false if too soon
 */
const canShowInterstitialAd = (): boolean => {
  // Check daily cap first
  if (!checkDailyAdCap()) {
    return false;
  }
  
  const now = Date.now();
  const timeSinceLastAd = now - lastInterstitialShowTime;
  const enoughTimeHasPassed = timeSinceLastAd >= INTERSTITIAL_MIN_INTERVAL;
  const belowSessionLimit = interstitialShowCount < INTERSTITIAL_MAX_PER_SESSION;
  
  if (!enoughTimeHasPassed) {
    const minutesRemaining = Math.ceil((INTERSTITIAL_MIN_INTERVAL - timeSinceLastAd) / 60000);
    console.log(`[AdMob] Interstitial ad blocked: too soon (${minutesRemaining}min remaining)`);
    return false;
  }
  
  if (!belowSessionLimit) {
    console.log(`[AdMob] Interstitial ad blocked: session limit reached (${interstitialShowCount}/${INTERSTITIAL_MAX_PER_SESSION})`);
    return false;
  }
  
  return true;
};

/**
 * Record that an interstitial ad was shown
 * Updates frequency capping counters
 */
const recordInterstitialAdShow = (): void => {
  lastInterstitialShowTime = Date.now();
  interstitialShowCount++;
  dailyAdCount++;
  console.log(`[AdMob] Interstitial ad shown (${interstitialShowCount}/${INTERSTITIAL_MAX_PER_SESSION} session, ${dailyAdCount}/${INTERSTITIAL_MAX_PER_DAY} daily)`);
};

/**
 * Reset session ad counters (call when app backgrounded/foregrounded)
 */
export const resetSessionAdCounters = (): void => {
  interstitialShowCount = 0;
  lastInterstitialShowTime = 0;
  console.log('[AdMob] Session ad counters reset');
};

/**
 * Initialize AdMob service
 * Call this once in your root layout
 */
export const initializeAdMob = async () => {
  try {
    if (!ADS_AVAILABLE) {
      console.log('[AdMob] Ads not available (running in Expo Go or module not loaded)');
      return;
    }
    
    console.log('[AdMob] Starting initialization');
    // AdMob SDK is automatically initialized by the plugin
    console.log('[AdMob] SDK auto-initialized by plugin');
    
    // Set up app state listener to reset session counters when app returns from background
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        console.log('[AdMob] App returned to foreground - resetting session counters');
        resetSessionAdCounters();
      }
    });
    
    // Load ads asynchronously without blocking
    setTimeout(() => {
      try {
        console.log('[AdMob] Loading ads in background');
        loadInterstitialAd();
        loadRewardedAd();
      } catch (error) {
        console.warn('[AdMob] Error loading ads in background:', error);
      }
    }, 1000);
    
    console.log('[AdMob] Initialization complete');
  } catch (error) {
    console.error('[AdMob] Failed to initialize:', error);
    throw error;
  }
};

/**
 * Load interstitial ad
 */
const loadInterstitialAd = async () => {
  try {
    if (!ADS_AVAILABLE || !InterstitialAd) {
      console.log('[AdMob] Cannot load interstitial ad - ads not available');
      return;
    }

    interstitialAd = InterstitialAd.createForAdRequest(getInterstitialId(), {
      requestNonPersonalizedAdsOnly: false,
    });

    // Check if addListener method exists before calling
    if (interstitialAd && typeof interstitialAd.addListener === 'function') {
      interstitialAd.addListener('onAdLoaded', () => {
        interstitialLoaded = true;
        interstitialRetryCount = 0; // Reset retry count on success
        console.log('[AdMob] Interstitial ad loaded successfully');
      });

      interstitialAd.addListener('onAdFailedToLoad', (error: any) => {
        console.warn(`[AdMob] Interstitial ad failed to load (attempt ${interstitialRetryCount + 1}/${MAX_RETRIES}):`, error);
        interstitialLoaded = false;
        
        // Implement exponential backoff retry
        if (interstitialRetryCount < MAX_RETRIES) {
          const retryDelay = getRetryDelay(interstitialRetryCount);
          console.log(`[AdMob] Retrying interstitial ad in ${retryDelay}ms...`);
          
          // Clear any existing retry timeout
          if (interstitialRetryTimeout) {
            clearTimeout(interstitialRetryTimeout);
          }
          
          interstitialRetryCount++;
          interstitialRetryTimeout = setTimeout(() => {
            loadInterstitialAd();
          }, retryDelay);
        } else {
          console.error('[AdMob] Interstitial ad: Max retries exceeded. Will retry again in 5 minutes.');
          // Try again after 5 minutes
          interstitialRetryCount = 0;
          if (interstitialRetryTimeout) {
            clearTimeout(interstitialRetryTimeout);
          }
          interstitialRetryTimeout = setTimeout(() => {
            console.log('[AdMob] Retrying interstitial ad after 5 minute cooldown...');
            loadInterstitialAd();
          }, 5 * 60 * 1000);
        }
      });

      interstitialAd.addListener('onAdClosed', () => {
        console.log('[AdMob] Interstitial ad closed');
        interstitialLoaded = false;
        interstitialRetryCount = 0; // Reset retry count
        // Reload for next time
        loadInterstitialAd();
      });
    } else {
      console.warn('[AdMob] InterstitialAd.addListener not available');
    }

    if (interstitialAd && typeof interstitialAd.load === 'function') {
      await interstitialAd.load();
    }
  } catch (error) {
    console.error('[AdMob] Error loading interstitial ad:', error);
  }
};

/**
 * Load rewarded ad
 */
const loadRewardedAd = async () => {
  try {
    if (!ADS_AVAILABLE || !RewardedAd) {
      console.log('[AdMob] Cannot load rewarded ad - ads not available');
      return;
    }

    rewardedAd = RewardedAd.createForAdRequest(getRewardedId(), {
      requestNonPersonalizedAdsOnly: false,
    });

    if (rewardedAd && typeof rewardedAd.addListener === 'function') {
      rewardedAd.addListener('onAdLoaded', () => {
        rewardedLoaded = true;
        rewardedRetryCount = 0; // Reset retry count on success
        console.log('[AdMob] Rewarded ad loaded successfully');
      });

      rewardedAd.addListener('onAdFailedToLoad', (error: any) => {
        console.warn(`[AdMob] Rewarded ad failed to load (attempt ${rewardedRetryCount + 1}/${MAX_RETRIES}):`, error);
        rewardedLoaded = false;
        
        // Implement exponential backoff retry
        if (rewardedRetryCount < MAX_RETRIES) {
          const retryDelay = getRetryDelay(rewardedRetryCount);
          console.log(`[AdMob] Retrying rewarded ad in ${retryDelay}ms...`);
          
          // Clear any existing retry timeout
          if (rewardedRetryTimeout) {
            clearTimeout(rewardedRetryTimeout);
          }
          
          rewardedRetryCount++;
          rewardedRetryTimeout = setTimeout(() => {
            loadRewardedAd();
          }, retryDelay);
        } else {
          console.error('[AdMob] Rewarded ad: Max retries exceeded. Will retry again in 5 minutes.');
          // Try again after 5 minutes
          rewardedRetryCount = 0;
          if (rewardedRetryTimeout) {
            clearTimeout(rewardedRetryTimeout);
          }
          rewardedRetryTimeout = setTimeout(() => {
            console.log('[AdMob] Retrying rewarded ad after 5 minute cooldown...');
            loadRewardedAd();
          }, 5 * 60 * 1000);
        }
      });

      rewardedAd.addListener('onAdClosed', () => {
        console.log('[AdMob] Rewarded ad closed');
        rewardedLoaded = false;
        rewardedRetryCount = 0; // Reset retry count
        // Reload for next time
        loadRewardedAd();
      });

      rewardedAd.addListener('onUserEarnedReward', (reward: any) => {
        console.log(`[AdMob] User earned reward: ${reward.amount} ${reward.type}`);
      });
    } else {
      console.warn('[AdMob] RewardedAd.addListener not available');
    }

    if (rewardedAd && typeof rewardedAd.load === 'function') {
      await rewardedAd.load();
    }
  } catch (error) {
    console.error('[AdMob] Error loading rewarded ad:', error);
  }
};

/**
 * Show interstitial ad if available and not blocked by frequency caps
 * Returns true if ad was shown, false otherwise
 */
export const showInterstitialAd = async (): Promise<boolean> => {
  try {
    // Check frequency caps first (prevent ad fatigue)
    if (!canShowInterstitialAd()) {
      return false;
    }
    
    if (interstitialLoaded && interstitialAd) {
      await interstitialAd.show();
      recordInterstitialAdShow();
      return true;
    }
    return false;
  } catch (error) {
    console.error('[AdMob] Error showing interstitial ad:', error);
    return false;
  }
};

/**
 * Check if interstitial ad is ready
 */
export const isInterstitialAdReady = (): boolean => {
  return interstitialLoaded;
};

/**
 * Show rewarded ad if available
 * Returns true if ad was shown, false otherwise
 */
export const showRewardedAd = async (): Promise<boolean> => {
  try {
    if (rewardedLoaded && rewardedAd) {
      await rewardedAd.show();
      return true;
    }
    return false;
  } catch (error) {
    console.error('[AdMob] Error showing rewarded ad:', error);
    return false;
  }
};

/**
 * Check if rewarded ad is ready
 */
export const isRewardedAdReady = (): boolean => {
  return rewardedLoaded;
};

/**
 * Get banner ad ID (used in BannerAd component)
 */
export const getBannerAdId = (): string => {
  return getBannerId();
};

/**
 * Get banner ad size (standard 320x50)
 */
export const getBannerAdSize = (): string => {
  if (!ADS_AVAILABLE || !BannerAdSize) {
    return 'BANNER'; // Return a safe default
  }
  return BannerAdSize.ANCHORED_ADAPTIVE_BANNER;
};

export default {
  initializeAdMob,
  showInterstitialAd,
  isInterstitialAdReady,
  showRewardedAd,
  isRewardedAdReady,
  getBannerAdId,
  getBannerAdSize,
  resetSessionAdCounters,
  canShowInterstitialAd,
};
