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
let adsInitializationError: string | null = null;

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
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('[AdMob] CRITICAL: Failed to load Google Mobile Ads module:', error);
    adsInitializationError = `AdMob module failed to load: ${errorMsg}. Check native configuration.`;
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
// Multiple banner units for rotation - improves fill rates and provides fallbacks
const PRODUCTION_BANNER_IDS = {
  ios: [
    'ca-app-pub-1542092338741994/1508942265', // Primary banner unit
    'ca-app-pub-1542092338741994/7204417229', // Secondary banner unit
    'ca-app-pub-1542092338741994/7148576900', // Tertiary banner unit
    // Add more banner units here for rotation, e.g.:
  ],
  android: [
    'ca-app-pub-1542092338741994/4213338090', // Primary banner unit
    'ca-app-pub-1542092338741994/2900256420', // Secondary banner unit (replace with your own)
    'ca-app-pub-1542092338741994/8559777211', // Tertiary banner unit (replace with your own)
    // Add more banner units here for rotation
  ],
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

// Banner rotation state - tracks which banner ID to use next
let currentBannerIndex = 0;
const bannerFailureCount = new Map<string, number>(); // Track failures per banner ID

/**
 * Get next banner ID using rotation strategy
 * If a banner fails repeatedly, it will be skipped in favor of working units
 */
const getBannerId = (): string => {
  try {
    if (!ADS_AVAILABLE) return 'ads_disabled';
    if (USE_TEST_IDS) return TEST_BANNER_ID;
    
    const platformIds = Platform.OS === 'ios' 
      ? PRODUCTION_BANNER_IDS.ios 
      : PRODUCTION_BANNER_IDS.android;
    
    if (!platformIds || platformIds.length === 0) {
      console.warn('[AdMob] No banner IDs configured for platform');
      return 'ads_disabled';
    }
    
    // If only one banner ID, return it
    if (platformIds.length === 1) {
      return platformIds[0];
    }
    
    // Find the next banner ID that hasn't failed too many times
    const maxFailures = 5; // Skip banners that have failed 5+ times
    let attempts = 0;
    let selectedId = platformIds[currentBannerIndex];
    
    while (attempts < platformIds.length) {
      const failures = bannerFailureCount.get(selectedId) || 0;
      
      if (failures < maxFailures) {
        // Found a good candidate
        console.log(`[AdMob] Using banner ID ${currentBannerIndex + 1}/${platformIds.length} (${failures} recent failures)`);
        return selectedId;
      }
      
      // This one has too many failures, try next
      console.log(`[AdMob] Skipping banner ID ${currentBannerIndex + 1} (${failures} failures, threshold: ${maxFailures})`);
      currentBannerIndex = (currentBannerIndex + 1) % platformIds.length;
      selectedId = platformIds[currentBannerIndex];
      attempts++;
    }
    
    // All banners have high failure rates - reset counters and use first one
    console.warn('[AdMob] All banner IDs have high failure rates - resetting failure counters');
    bannerFailureCount.clear();
    currentBannerIndex = 0;
    return platformIds[0];
  } catch (error) {
    console.error('[AdMob] Error getting banner ID:', error);
    return 'ads_disabled';
  }
};

/**
 * Move to the next banner ID in rotation
 * Call this when a banner fails to load
 */
export const rotateBannerAd = (): void => {
  try {
    const platformIds = Platform.OS === 'ios' 
      ? PRODUCTION_BANNER_IDS.ios 
      : PRODUCTION_BANNER_IDS.android;
    
    if (!platformIds || platformIds.length <= 1) {
      return; // No rotation needed
    }
    
    const currentId = platformIds[currentBannerIndex];
    const failures = (bannerFailureCount.get(currentId) || 0) + 1;
    bannerFailureCount.set(currentId, failures);
    
    // Move to next banner
    const previousIndex = currentBannerIndex;
    currentBannerIndex = (currentBannerIndex + 1) % platformIds.length;
    
    console.log(`[AdMob] Banner rotation: ${previousIndex + 1} → ${currentBannerIndex + 1} (${failures} failures on previous)`);
  } catch (error) {
    console.error('[AdMob] Error rotating banner ad:', error);
  }
};

/**
 * Reset failure count for a banner (call on successful load)
 */
export const resetBannerFailures = (): void => {
  try {
    const platformIds = Platform.OS === 'ios' 
      ? PRODUCTION_BANNER_IDS.ios 
      : PRODUCTION_BANNER_IDS.android;
    
    if (!platformIds) return;
    
    const currentId = platformIds[currentBannerIndex];
    if (bannerFailureCount.has(currentId)) {
      console.log(`[AdMob] Resetting failure count for banner ${currentBannerIndex + 1}`);
      bannerFailureCount.delete(currentId);
    }
  } catch (error) {
    console.error('[AdMob] Error resetting banner failures:', error);
  }
};

const getInterstitialId = (): string => {
  try {
    if (!ADS_AVAILABLE) return 'ads_disabled';
    if (USE_TEST_IDS) {
      console.log('[AdMob] Using TEST interstitial ad ID (development mode)');
      return TEST_INTERSTITIAL_ID;
    }
    const platformId = Platform.OS === 'ios'
      ? PRODUCTION_INTERSTITIAL_ID.ios
      : PRODUCTION_INTERSTITIAL_ID.android;
    console.log(`[AdMob] Using PRODUCTION interstitial ad ID for ${Platform.OS}`);
    return platformId;
  } catch (error) {
    console.error('[AdMob] Error getting interstitial ID:', error);
    return 'ads_disabled';
  }
};

const getRewardedId = (): string => {
  try {
    if (!ADS_AVAILABLE) return 'ads_disabled';
    if (USE_TEST_IDS) return TEST_REWARDED_ID;
    const platformId = Platform.OS === 'ios'
      ? PRODUCTION_REWARDED_ID.ios
      : PRODUCTION_REWARDED_ID.android;
    return platformId;
  } catch (error) {
    console.error('[AdMob] Error getting rewarded ID:', error);
    return 'ads_disabled';
  }
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

// App state listener subscription (kept to prevent garbage collection)
let appStateSubscription: any = null;

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
    console.log('[AdMob] ========================================');
    console.log('[AdMob] === INITIALIZING ADMOB SERVICE ===');
    console.log('[AdMob] ========================================');
    console.log(`[AdMob] Platform: ${Platform.OS}`);
    console.log(`[AdMob] Is Expo Go: ${isExpoGo()}`);
    console.log(`[AdMob] USE_TEST_IDS: ${USE_TEST_IDS}`);
    
    // If ads failed to initialize at module load, log error and return early
    if (adsInitializationError) {
      console.error(`[AdMob] ❌ Initialization blocked: ${adsInitializationError}`);
      return;
    }

    if (!ADS_AVAILABLE) {
      console.log('[AdMob] ❌ Ads not available (running in Expo Go or module not loaded)');
      return;
    }
    
    console.log('[AdMob] ✅ Ads available - proceeding with initialization');
    console.log('[AdMob] SDK auto-initialized by plugin');
    
    // Set up app state listener to reset session counters when app returns from background
    // Store subscription to prevent garbage collection
    try {
      if (!appStateSubscription) {
        appStateSubscription = AppState.addEventListener('change', (state) => {
          if (state === 'active') {
            console.log('[AdMob] App returned to foreground - resetting session counters');
            resetSessionAdCounters();
          }
        });
        console.log('[AdMob] ✅ App state listener configured');
      }
    } catch (error) {
      console.error('[AdMob] ❌ Error setting up app state listener:', error);
    }
    
    // Load ads asynchronously without blocking
    // IMPORTANT: Use long delay (3 seconds) to avoid memory pressure during app startup
    // On first load, there are many competing processes (fonts, localization, navigation, UI rendering)
    // If we try to load ads too early, it can cause memory allocation issues with Hermes
    console.log('[AdMob] Scheduling ad load in 3 seconds...');
    setTimeout(() => {
      try {
        console.log('[AdMob] === STARTING AD LOAD ===');
        loadInterstitialAd();
        loadRewardedAd();
      } catch (error) {
        console.warn('[AdMob] ❌ Error loading ads in background:', error);
      }
    }, 3000); // Increased from 1000ms to 3000ms for app startup stability
    
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
    console.log('[AdMob] === LOADING INTERSTITIAL AD ===');
    console.log(`[AdMob] ADS_AVAILABLE: ${ADS_AVAILABLE}`);
    console.log(`[AdMob] InterstitialAd module: ${InterstitialAd ? 'Available' : 'Not Available'}`);
    
    if (!ADS_AVAILABLE || !InterstitialAd) {
      console.log('[AdMob] Cannot load interstitial ad - ads not available');
      return;
    }

    const adId = getInterstitialId();
    console.log(`[AdMob] Creating interstitial ad with ID: ${adId}`);
    
    try {
      interstitialAd = InterstitialAd.createForAdRequest(adId, {
        requestNonPersonalizedAdsOnly: false,
      });
      console.log('[AdMob] Interstitial ad instance created successfully');
    } catch (error) {
      console.error('[AdMob] Error creating interstitial ad:', error);
      throw error;
    }

    // Check if addListener method exists before calling
    if (interstitialAd && typeof interstitialAd.addListener === 'function') {
      console.log('[AdMob] Setting up interstitial ad event listeners...');
      
      interstitialAd.addListener('onAdLoaded', () => {
        interstitialLoaded = true;
        interstitialRetryCount = 0; // Reset retry count on success
        console.log('[AdMob] ✅ Interstitial ad loaded successfully');
      });

      interstitialAd.addListener('onAdFailedToLoad', (error: any) => {
        console.warn(`[AdMob] ❌ Interstitial ad failed to load (attempt ${interstitialRetryCount + 1}/${MAX_RETRIES}):`, error);
        console.log('[AdMob] Error code:', error?.code);
        console.log('[AdMob] Error message:', error?.message);
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

    try {
      if (interstitialAd && typeof interstitialAd.load === 'function') {
        console.log('[AdMob] Calling interstitial ad load()...');
        await interstitialAd.load();
        console.log('[AdMob] Interstitial ad load() called successfully (waiting for onAdLoaded callback)');
      }
    } catch (error) {
      console.error('[AdMob] Error calling interstitial ad load():', error);
    }
  } catch (error) {
    console.error('[AdMob] Fatal error loading interstitial ad:', error);
  }
};

/**
 * Load rewarded ad
 */
const loadRewardedAd = async () => {
  try {
    console.log('[AdMob] === LOADING REWARDED AD ===');
    console.log(`[AdMob] ADS_AVAILABLE: ${ADS_AVAILABLE}`);
    console.log(`[AdMob] RewardedAd module: ${RewardedAd ? 'Available' : 'Not Available'}`);
    
    if (!ADS_AVAILABLE || !RewardedAd) {
      console.log('[AdMob] Cannot load rewarded ad - ads not available');
      return;
    }

    const adId = getRewardedId();
    console.log(`[AdMob] Creating rewarded ad with ID: ${adId}`);
    
    try {
      rewardedAd = RewardedAd.createForAdRequest(adId, {
        requestNonPersonalizedAdsOnly: false,
      });
      console.log('[AdMob] Rewarded ad instance created successfully');
    } catch (error) {
      console.error('[AdMob] Error creating rewarded ad:', error);
      throw error;
    }

    if (rewardedAd && typeof rewardedAd.addListener === 'function') {
      console.log('[AdMob] Setting up rewarded ad event listeners...');
      
      rewardedAd.addListener('onAdLoaded', () => {
        rewardedLoaded = true;
        rewardedRetryCount = 0; // Reset retry count on success
        console.log('[AdMob] ✅ Rewarded ad loaded successfully');
      });

      rewardedAd.addListener('onAdFailedToLoad', (error: any) => {
        console.warn(`[AdMob] ❌ Rewarded ad failed to load (attempt ${rewardedRetryCount + 1}/${MAX_RETRIES}):`, error);
        console.log('[AdMob] Error code:', error?.code);
        console.log('[AdMob] Error message:', error?.message);
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

    try {
      if (rewardedAd && typeof rewardedAd.load === 'function') {
        console.log('[AdMob] Calling rewarded ad load()...');
        await rewardedAd.load();
        console.log('[AdMob] Rewarded ad load() called successfully (waiting for onAdLoaded callback)');
      }
    } catch (error) {
      console.error('[AdMob] Error calling rewarded ad load():', error);
    }
  } catch (error) {
    console.error('[AdMob] Fatal error loading rewarded ad:', error);
  }
};

/**
 * Show interstitial ad if available and not blocked by frequency caps
 * Returns true if ad was shown, false otherwise
 */
export const showInterstitialAd = async (): Promise<boolean> => {
  try {
    if (!ADS_AVAILABLE || !InterstitialAd) {
      console.warn('[AdMob] Cannot show interstitial ad - ads not available');
      return false;
    }

    // Check frequency caps first (prevent ad fatigue)
    if (!canShowInterstitialAd()) {
      console.log('[AdMob] Interstitial ad blocked by frequency caps');
      return false;
    }

    if (!interstitialLoaded) {
      console.warn('[AdMob] Interstitial ad not ready yet - still loading');
      console.log('[AdMob] Attempting to load interstitial ad now...');
      // Try to load it now if it's not loaded
      loadInterstitialAd();
      return false;
    }
    
    try {
      if (interstitialAd) {
        console.log('[AdMob] Showing interstitial ad...');
        await interstitialAd.show();
        recordInterstitialAdShow();
        return true;
      } else {
        console.warn('[AdMob] Interstitial ad instance is null');
        return false;
      }
    } catch (error) {
      console.error('[AdMob] Error showing interstitial ad:', error);
      return false;
    }
  } catch (error) {
    console.error('[AdMob] Fatal error showing interstitial ad:', error);
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
 * Get interstitial ad status for debugging
 */
export const getInterstitialAdStatus = (): {
  loaded: boolean;
  canShow: boolean;
  sessionCount: number;
  dailyCount: number;
  timeSinceLastAd: number;
} => {
  const now = Date.now();
  return {
    loaded: interstitialLoaded,
    canShow: canShowInterstitialAd(),
    sessionCount: interstitialShowCount,
    dailyCount: dailyAdCount,
    timeSinceLastAd: lastInterstitialShowTime ? now - lastInterstitialShowTime : -1,
  };
};

/**
 * Get comprehensive ad system status for debugging
 * Call this to see the full state of the ad system
 */
export const getAdSystemStatus = () => {
  const status = {
    // Module Status
    adsAvailable: ADS_AVAILABLE,
    isExpoGo: isExpoGo(),
    initError: adsInitializationError,
    useTestIds: USE_TEST_IDS,
    
    // Interstitial Status
    interstitial: {
      loaded: interstitialLoaded,
      adInstanceExists: interstitialAd !== null,
      retryCount: interstitialRetryCount,
      adId: getInterstitialId(),
    },
    
    // Rewarded Status
    rewarded: {
      loaded: rewardedLoaded,
      adInstanceExists: rewardedAd !== null,
      retryCount: rewardedRetryCount,
      adId: getRewardedId(),
    },
    
    // Frequency Caps
    frequencyCaps: {
      sessionCount: interstitialShowCount,
      sessionMax: INTERSTITIAL_MAX_PER_SESSION,
      dailyCount: dailyAdCount,
      dailyMax: INTERSTITIAL_MAX_PER_DAY,
      timeSinceLastAd: lastInterstitialShowTime ? Date.now() - lastInterstitialShowTime : -1,
      minInterval: INTERSTITIAL_MIN_INTERVAL,
    },
  };
  
  console.log('[AdMob] === AD SYSTEM STATUS ===');
  console.log(JSON.stringify(status, null, 2));
  
  return status;
};

/**
 * Show rewarded ad if available
 * Returns true if ad was shown, false otherwise
 */
export const showRewardedAd = async (): Promise<boolean> => {
  try {
    if (!ADS_AVAILABLE || !RewardedAd) {
      console.warn('[AdMob] Cannot show rewarded ad - ads not available');
      return false;
    }

    if (!rewardedLoaded) {
      console.warn('[AdMob] Rewarded ad not ready yet - still loading');
      console.log('[AdMob] Attempting to load rewarded ad now...');
      // Try to load it now if it's not loaded
      loadRewardedAd();
      return false;
    }

    try {
      if (rewardedAd) {
        console.log('[AdMob] Showing rewarded ad...');
        await rewardedAd.show();
        return true;
      } else {
        console.warn('[AdMob] Rewarded ad instance is null');
        return false;
      }
    } catch (error) {
      console.error('[AdMob] Error showing rewarded ad:', error);
      return false;
    }
  } catch (error) {
    console.error('[AdMob] Fatal error showing rewarded ad:', error);
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
  getInterstitialAdStatus,
  getAdSystemStatus,
  showRewardedAd,
  isRewardedAdReady,
  getBannerAdId,
  getBannerAdSize,
  resetSessionAdCounters,
  canShowInterstitialAd,
  rotateBannerAd,
  resetBannerFailures,
};
