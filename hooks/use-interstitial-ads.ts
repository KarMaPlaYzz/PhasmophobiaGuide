import { usePremium } from '@/hooks/use-premium';
import { showInterstitialAd } from '@/lib/services/admobService';
import { useEffect, useRef } from 'react';

/**
 * Hook for managing interstitial ad impressions
 * Shows ads after user interactions with a configurable frequency
 */
export const useInterstitialAds = (triggerKey: string, triggerCount: number = 3, dependency?: number | string) => {
  const { isPremium } = usePremium();
  const impressionCount = useRef(0);

  useEffect(() => {
    // Don't show ads for premium users
    if (isPremium) {
      impressionCount.current = 0;
      return;
    }

    // If dependency is provided and is a number (usage count), check if we should show ad
    if (dependency !== undefined && typeof dependency === 'number') {
      if (dependency > 0 && dependency % triggerCount === 0) {
        showInterstitialAd().then(() => {
          // Counter reset is handled by parent since this is usage-based
        });
      }
    }
  }, [triggerKey, isPremium, dependency, triggerCount]);

  return {
    impressionCount: impressionCount.current,
    resetCount: () => {
      impressionCount.current = 0;
    },
  };
};
