import { Platform } from 'react-native';
import { BannerAdSize, InterstitialAd, RewardedAd, TestIds } from 'react-native-google-mobile-ads';

/**
 * AdMob Service
 * Manages banner ads, interstitials, and rewarded video ads
 * Uses test IDs by default - replace with real IDs in production
 */

// Test Ad IDs (use these in development)
const TEST_BANNER_ID = TestIds.BANNER;
const TEST_INTERSTITIAL_ID = TestIds.INTERSTITIAL;
const TEST_REWARDED_ID = TestIds.REWARDED;

// Production Ad IDs (replace with your real IDs from AdMob)
// Format: "ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyyyyyy"
const PRODUCTION_BANNER_ID = {
  ios: 'ca-app-pub-3940256099942544/2934735716', // Replace with your iOS banner ID
  android: 'ca-app-pub-3940256099942544/6300978111', // Replace with your Android banner ID
};

const PRODUCTION_INTERSTITIAL_ID = {
  ios: 'ca-app-pub-3940256099942544/4411468910', // Replace with your iOS interstitial ID
  android: 'ca-app-pub-3940256099942544/1033173712', // Replace with your Android interstitial ID
};

const PRODUCTION_REWARDED_ID = {
  ios: 'ca-app-pub-3940256099942544/5224354917', // Replace with your iOS rewarded ID
  android: 'ca-app-pub-3940256099942544/5354046379', // Replace with your Android rewarded ID
};

// Use test IDs for development
const USE_TEST_IDS = true; // Set to false in production

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

const getRewardedId = (): string => {
  if (USE_TEST_IDS) return TEST_REWARDED_ID;
  const platformId = Platform.OS === 'ios'
    ? PRODUCTION_REWARDED_ID.ios
    : PRODUCTION_REWARDED_ID.android;
  return platformId;
};

// State tracking
let interstitialAd: any = null;
let rewardedAd: any = null;
let interstitialLoaded = false;
let rewardedLoaded = false;

/**
 * Initialize AdMob service
 * Call this once in your root layout
 */
export const initializeAdMob = async () => {
  try {
    // AdMob SDK is automatically initialized by the plugin
    console.log('AdMob initialized');
    loadInterstitialAd();
    loadRewardedAd();
  } catch (error) {
    console.error('Failed to initialize AdMob:', error);
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

    interstitialAd.addListener('onAdLoaded', () => {
      interstitialLoaded = true;
      console.log('Interstitial ad loaded');
    });

    interstitialAd.addListener('onAdFailedToLoad', (error: any) => {
      console.log('Interstitial ad failed to load:', error);
      interstitialLoaded = false;
      // Retry loading after delay
      setTimeout(loadInterstitialAd, 5000);
    });

    interstitialAd.addListener('onAdClosed', () => {
      console.log('Interstitial ad closed');
      interstitialLoaded = false;
      // Reload for next time
      loadInterstitialAd();
    });

    await interstitialAd.load();
  } catch (error) {
    console.error('Error loading interstitial ad:', error);
  }
};

/**
 * Load rewarded ad
 */
const loadRewardedAd = async () => {
  try {
    rewardedAd = RewardedAd.createForAdRequest(getRewardedId(), {
      requestNonPersonalizedAdsOnly: false,
    });

    rewardedAd.addListener('onAdLoaded', () => {
      rewardedLoaded = true;
      console.log('Rewarded ad loaded');
    });

    rewardedAd.addListener('onAdFailedToLoad', (error: any) => {
      console.log('Rewarded ad failed to load:', error);
      rewardedLoaded = false;
      // Retry loading after delay
      setTimeout(loadRewardedAd, 5000);
    });

    rewardedAd.addListener('onUserEarnedReward', (reward: any) => {
      console.log('User earned reward:', reward);
      // Handle reward (if you implement rewarded ads)
    });

    rewardedAd.addListener('onAdClosed', () => {
      console.log('Rewarded ad closed');
      rewardedLoaded = false;
      // Reload for next time
      loadRewardedAd();
    });

    await rewardedAd.load();
  } catch (error) {
    console.error('Error loading rewarded ad:', error);
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
 * Show rewarded ad if available
 */
export const showRewardedAd = async (): Promise<boolean> => {
  try {
    if (rewardedLoaded && rewardedAd) {
      await rewardedAd.show();
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error showing rewarded ad:', error);
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
  return BannerAdSize.ANCHORED_ADAPTIVE_BANNER;
};

export default {
  initializeAdMob,
  showInterstitialAd,
  showRewardedAd,
  isInterstitialAdReady,
  isRewardedAdReady,
  getBannerAdId,
  getBannerAdSize,
};
