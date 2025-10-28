import { usePremium } from '@/hooks/use-premium';
import { showRewardedAd } from '@/lib/services/admobService';
import { useCallback, useState } from 'react';

/**
 * Hook for managing rewarded ads
 * Handles showing ads and managing loading/error states
 * Skips ads for premium users
 */
export const useRewardedAds = () => {
  const { isPremium } = usePremium();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const showAd = useCallback(async (): Promise<boolean> => {
    if (isPremium) {
      console.log('[RewardedAds] Premium user - no ad shown');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const shown = await showRewardedAd();
      if (!shown) {
        setError('Ad not ready. Please try again.');
        return false;
      }
      return true;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isPremium]);

  const dismissError = useCallback(() => {
    setError(null);
  }, []);

  return { showAd, isLoading, error, dismissError };
};
