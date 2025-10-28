import { usePremium } from '@/hooks/use-premium';
import admobService from '@/lib/services/admobService';
import { useCallback } from 'react';

/**
 * Hook for managing interstitial ads with intelligent frequency capping
 * 
 * Features:
 * - Respects premium user status (no ads for premium users)
 * - Automatically respects frequency capping (max 3 ads per session, min 2 minutes apart)
 * - Non-intrusive placement only
 * - Graceful fallback if ads not available
 * 
 * Usage:
 * ```typescript
 * const { showAd, isReady, canShowAd } = useInterstitialAds();
 * 
 * // Check if ad can be shown
 * if (canShowAd()) {
 *   await showAd();
 * }
 * ```
 */
export const useInterstitialAds = () => {
  const { isPremium } = usePremium();

  /**
   * Check if an interstitial ad can be shown
   * Returns false if: user is premium, ads not ready, frequency caps exceeded
   */
  const canShowAd = useCallback((): boolean => {
    if (isPremium) {
      return false;
    }
    return admobService.canShowInterstitialAd();
  }, [isPremium]);

  /**
   * Show an interstitial ad if conditions are met
   * Automatically respects: premium status, frequency caps, ad availability
   * 
   * @returns true if ad was shown, false otherwise
   */
  const showAd = useCallback(async (): Promise<boolean> => {
    if (isPremium) {
      console.log('[InterstitialAds] Premium user - skipping ad');
      return false;
    }

    if (!canShowAd()) {
      return false;
    }

    try {
      const shown = await admobService.showInterstitialAd();
      return shown;
    } catch (error) {
      console.error('[InterstitialAds] Error showing ad:', error);
      return false;
    }
  }, [isPremium, canShowAd]);

  /**
   * Check if interstitial ad is loaded and ready
   */
  const isReady = useCallback((): boolean => {
    return admobService.isInterstitialAdReady();
  }, []);

  return {
    showAd,
    canShowAd,
    isReady,
  };
};
