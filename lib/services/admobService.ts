import { Platform } from 'react-native';
import { BannerAdSize, InterstitialAd, TestIds } from 'react-native-google-mobile-ads';

/**
 * AdMob Service
 * Manages banner ads and interstitial video ads
 * Uses test IDs by default - replace with real IDs in production
 */

// Test Ad IDs (use these in development)
const TEST_BANNER_ID = TestIds.BANNER;
const TEST_INTERSTITIAL_ID = TestIds.INTERSTITIAL;

// Production Ad IDs (replace with your real IDs from AdMob)
// Format: "ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyyyyyy"
const PRODUCTION_BANNER_ID = {
  ios: 'ca-app-pub-1542092338741994/1508942265', // Replace with your iOS banner ID
  android: 'ca-app-pub-3940256099942544/6300978111', // Replace with your Android banner ID
};

const PRODUCTION_INTERSTITIAL_ID = {
  ios: 'ca-app-pub-1542092338741994/7284013125', // Replace with your iOS interstitial ID
  android: 'ca-app-pub-3940256099942544/1033173712', // Replace with your Android interstitial ID
};

// Use test IDs for development
const USE_TEST_IDS = false; // Set to false in production

const getBannerId = (): string => {
  if (USE_TEST_IDS) return TEST_BANNER_ID;
  const platformId = Platform.OS === 'ios' 
    ? PRODUCTION_BANNER_ID.ios 
    : PRODUCTION_BANNER_ID.android;
  return platformId;
};

const getInterstitialId = (): string => {
  if (USE_TEST_IDS) return TEST_INTERSTITIAL_ID;
  const platformId = Platform.OS === 'ios'
    ? PRODUCTION_INTERSTITIAL_ID.ios
    : PRODUCTION_INTERSTITIAL_ID.android;
  return platformId;
};

// State tracking
let interstitialAd: any = null;
let interstitialLoaded = false;

/**
 * Initialize AdMob service
 * Call this once in your root layout
 */
export const initializeAdMob = async () => {
  try {
    console.log('[AdMob] Starting initialization');
    // AdMob SDK is automatically initialized by the plugin
    console.log('[AdMob] SDK auto-initialized by plugin');
    
    // Load ads asynchronously without blocking
    setTimeout(() => {
      try {
        console.log('[AdMob] Loading ads in background');
        loadInterstitialAd();
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
    interstitialAd = InterstitialAd.createForAdRequest(getInterstitialId(), {
      requestNonPersonalizedAdsOnly: false,
    });

    // Check if addListener method exists before calling
    if (interstitialAd && typeof interstitialAd.addListener === 'function') {
      interstitialAd.addListener('onAdLoaded', () => {
        interstitialLoaded = true;
        console.log('[AdMob] Interstitial ad loaded');
      });

      interstitialAd.addListener('onAdFailedToLoad', (error: any) => {
        console.log('[AdMob] Interstitial ad failed to load:', error);
        interstitialLoaded = false;
        // Retry loading after delay
        setTimeout(loadInterstitialAd, 5000);
      });

      interstitialAd.addListener('onAdClosed', () => {
        console.log('[AdMob] Interstitial ad closed');
        interstitialLoaded = false;
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
 * Show interstitial ad if available
 * Returns true if ad was shown, false otherwise
 */
export const showInterstitialAd = async (): Promise<boolean> => {
  try {
    if (interstitialLoaded && interstitialAd) {
      await interstitialAd.show();
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error showing interstitial ad:', error);
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
 * Get banner ad ID (used in BannerAd component)
 */
export const getBannerAdId = (): string => {
  return getBannerId();
};

/**
 * Get banner ad size (standard 320x50)
 */
export const getBannerAdSize = (): string => {
  return BannerAdSize.ANCHORED_ADAPTIVE_BANNER;
};

export default {
  initializeAdMob,
  showInterstitialAd,
  isInterstitialAdReady,
  getBannerAdId,
  getBannerAdSize,
};
