import { usePremium } from '@/hooks/use-premium';
import { isRewardedAdReady, showRewardedAd } from '@/lib/services/admobService';
import { useCallback, useEffect, useState } from 'react';

/**
 * Hook for managing rewarded ads
 * Handles showing ads and managing loading/error states
 * Skips ads for premium users
 */
export const useRewardedAds = () => {
  const { isPremium } = usePremium();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAdReady, setIsAdReady] = useState(false);

  // Check if ad is ready periodically
  useEffect(() => {
    const checkAdStatus = () => {
      const ready = isRewardedAdReady();
      setIsAdReady(ready);
      if (ready) {
        console.log('[useRewardedAds] Rewarded ad is ready');
      } else {
        console.log('[useRewardedAds] Rewarded ad is not ready yet');
      }
    };

    // Check immediately
    checkAdStatus();

    // Check every 5 seconds
    const interval = setInterval(checkAdStatus, 5000);

    return () => clearInterval(interval);
  }, []);

  const showAd = useCallback(async (): Promise<boolean> => {
    if (isPremium) {
      console.log('[RewardedAds] Premium user - no ad shown');
      return false;
    }

    if (!isAdReady) {
      setError('Ad is still loading. Please wait a moment and try again.');
      console.warn('[RewardedAds] Ad not ready - cannot show');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const shown = await showRewardedAd();
      if (!shown) {
        setError('Ad not ready. Please try again in a moment.');
        return false;
      }
      return true;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      console.error('[RewardedAds] Error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isPremium, isAdReady]);

  const dismissError = useCallback(() => {
    setError(null);
  }, []);

  return { showAd, isLoading, error, dismissError, isAdReady };
};
