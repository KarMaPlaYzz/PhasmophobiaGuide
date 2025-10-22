import { usePremium } from '@/hooks/use-premium';
import { showInterstitialAd } from '@/lib/services/admobService';
import { useEffect, useRef } from 'react';

/**
 * Hook for managing interstitial ad impressions
 * Shows ads after user interactions with a configurable frequency
 */
export const useInterstitialAds = (triggerKey: string, triggerCount: number = 3) => {
  const { isPremium } = usePremium();
  const impressionCount = useRef(0);

  useEffect(() => {
    // Don't show ads for premium users
    if (isPremium) {
      impressionCount.current = 0;
      return;
    }

    impressionCount.current++;

    // Show ad every N interactions
    if (impressionCount.current >= triggerCount) {
      showInterstitialAd().then(() => {
        impressionCount.current = 0; // Reset counter after showing ad
      });
    }
  }, [triggerKey, isPremium]);

  return {
    impressionCount: impressionCount.current,
    resetCount: () => {
      impressionCount.current = 0;
    },
  };
};
