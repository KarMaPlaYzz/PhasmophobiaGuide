import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { usePremium } from '@/hooks/use-premium';
import { getBannerAdId, resetBannerFailures, rotateBannerAd } from '@/lib/services/admobService';
import { isExpoGo } from '@/lib/utils/is-expo-go';

// Lazy import BannerAd - only available if native modules are loaded
let BannerAd: any = null;
try {
  if (!isExpoGo()) {
    BannerAd = require('react-native-google-mobile-ads').BannerAd;
  }
} catch (error) {
  console.warn('[AdBanner] Failed to load BannerAd component:', error);
}

interface AdBannerProps {
  /**
   * Size of the banner
   * Default: ANCHORED_ADAPTIVE_BANNER
   */
  size?: string;
}

// Retry configuration - robust with exponential backoff
const INITIAL_RETRY_DELAY = 10000; // Start at 10 seconds (conservative)
const MAX_RETRY_DELAY = 300000; // Cap at 5 minutes
const BACKOFF_MULTIPLIER = 2; // Double delay each time
const MAX_RETRIES = 8; // Maximum number of retry attempts

/**
 * Ad Banner Component
 * Shows Google AdMob banner ads (only for non-premium users)
 * Crash-proof with robust retry logic and proper lifecycle management
 */
export const AdBanner = ({ size = 'ANCHORED_ADAPTIVE_BANNER' }: AdBannerProps) => {
  const colorScheme = useColorScheme();
  const colors = Colors['dark'];
  const { isPremium, isLoading } = usePremium();
  const [adLoaded, setAdLoaded] = useState(false);
  const [showSpinner, setShowSpinner] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);
  const [adKey, setAdKey] = useState(0); // Used to force remount for retries
  const [bannerId, setBannerId] = useState(() => getBannerAdId()); // Track current banner ID
  
  // Use refs to prevent stale closures and manage timeouts safely
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const spinnerTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMountedRef = useRef(true);
  const lastErrorTimeRef = useRef<number>(0);
  const retryCountRef = useRef(0); // Use ref instead of state to avoid re-renders
  const isRetryingRef = useRef(false); // Track if we're currently in retry mode

  // Cleanup on unmount - CRITICAL for preventing crashes
  useEffect(() => {
    isMountedRef.current = true;
    
    // Hide spinner after 10 seconds if ad still hasn't loaded
    spinnerTimeoutRef.current = setTimeout(() => {
      if (isMountedRef.current && !adLoaded) {
        console.log('[AdBanner] Hiding spinner after timeout');
        setShowSpinner(false);
      }
    }, 10000);
    
    return () => {
      isMountedRef.current = false;
      // Clear any pending timeouts
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
      if (spinnerTimeoutRef.current) {
        clearTimeout(spinnerTimeoutRef.current);
        spinnerTimeoutRef.current = null;
      }
    };
  }, []);

  // Reset retry count when premium status changes
  useEffect(() => {
    if (isPremium) {
      // Clear retry timeout if user becomes premium
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
      if (spinnerTimeoutRef.current) {
        clearTimeout(spinnerTimeoutRef.current);
        spinnerTimeoutRef.current = null;
      }
      retryCountRef.current = 0;
    }
  }, [isPremium]);

  // Don't show ads for premium users or while loading premium status
  if (isPremium || isLoading) {
    return null;
  }

  // Don't render if BannerAd module is not available (e.g., in Expo Go)
  if (!BannerAd) {
    console.log('[AdBanner] BannerAd module not available - ads disabled');
    return null;
  }

  // If we've exceeded max retries, don't render
  if (retryCountRef.current >= MAX_RETRIES || !shouldRender) {
    console.log('[AdBanner] Max retries exceeded or rendering disabled - hiding banner');
    return null;
  }

  /**
   * Calculate retry delay with exponential backoff
   */
  const getRetryDelay = (attempt: number): number => {
    const delay = INITIAL_RETRY_DELAY * Math.pow(BACKOFF_MULTIPLIER, attempt);
    return Math.min(delay, MAX_RETRY_DELAY);
  };

  /**
   * Handle ad load failure with robust retry logic
   */
  const handleAdFailedToLoad = (error: any) => {
    // If we're in the middle of a retry remount, ignore this error
    // (it's from the old component being unmounted)
    if (isRetryingRef.current) {
      console.log('[AdBanner] Ignoring error during retry remount');
      return;
    }
    
    // Prevent rapid-fire errors (debounce)
    const now = Date.now();
    if (now - lastErrorTimeRef.current < 1000) {
      console.log('[AdBanner] Ignoring rapid error (debounced)');
      return;
    }
    lastErrorTimeRef.current = now;

    console.warn(`[AdBanner] Failed to load banner ad (attempt ${retryCountRef.current + 1}/${MAX_RETRIES}):`, error);
    
    // Rotate to next banner ID when current one fails
    rotateBannerAd();
    console.log('[AdBanner] Rotated to next banner ID');
    
    // Hide spinner on error
    if (isMountedRef.current) {
      setShowSpinner(false);
    }
    
    // Don't retry if component is unmounted
    if (!isMountedRef.current) {
      console.log('[AdBanner] Component unmounted - canceling retry');
      return;
    }

    // If we've hit max retries, stop trying
    if (retryCountRef.current >= MAX_RETRIES - 1) {
      console.error('[AdBanner] Max retries exceeded - giving up');
      setShouldRender(false);
      return;
    }

    // Schedule retry with exponential backoff
    const retryDelay = getRetryDelay(retryCountRef.current);
    console.log(`[AdBanner] Scheduling retry in ${retryDelay / 1000}s (attempt ${retryCountRef.current + 2}/${MAX_RETRIES})`);
    
    // Clear any existing timeout
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }

    // Schedule retry ONLY if component is still mounted
    retryTimeoutRef.current = setTimeout(() => {
      if (!isMountedRef.current) {
        console.log('[AdBanner] Component unmounted during retry - canceling');
        return;
      }

      console.log('[AdBanner] Executing retry by remounting ad component');
      retryCountRef.current += 1;
      isRetryingRef.current = true;
      
      // Get the new banner ID after rotation
      const newBannerId = getBannerAdId();
      console.log(`[AdBanner] Switching to banner ID: ${newBannerId}`);
      setBannerId(newBannerId);
      
      // Change key to force remount - this is safe because we're doing it
      // AFTER a delay, not during an active render/error cycle
      setAdKey(prev => prev + 1);
      setShowSpinner(true); // Show spinner again for retry
      setAdLoaded(false); // Reset loaded state
      
      // Clear the retry flag after component has time to remount
      setTimeout(() => {
        isRetryingRef.current = false;
      }, 100);
      
      retryTimeoutRef.current = null;
    }, retryDelay);
  };

  /**
   * Handle successful ad load
   */
  const handleAdLoaded = () => {
    if (!isMountedRef.current) {
      console.log('[AdBanner] Component unmounted - ignoring load event');
      return;
    }

    setAdLoaded(true);
    setShowSpinner(false); // Hide spinner on successful load
    retryCountRef.current = 0; // Reset retry count on success
    
    // Reset failure count for this banner ID since it loaded successfully
    resetBannerFailures();
    
    console.log('[AdBanner] Banner ad loaded successfully');
    
    // Clear any pending timeouts
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
    if (spinnerTimeoutRef.current) {
      clearTimeout(spinnerTimeoutRef.current);
      spinnerTimeoutRef.current = null;
    }
  };

  /**
   * Handle ad opened (user clicked)
   */
  const handleAdOpened = () => {
    console.log('[AdBanner] Banner ad opened (user clicked)');
  };

  /**
   * Handle ad closed
   */
  const handleAdClosed = () => {
    console.log('[AdBanner] Banner ad closed');
  };

  return (
    <View style={styles.container}>
      {showSpinner && !adLoaded && (
        <ActivityIndicator size="small" color={colors.tabIconDefault} />
      )}
      {/* Wrap in try-catch at render level for maximum safety */}
      {(() => {
        try {
          return (
            <BannerAd
              key={`banner-ad-safe-${adKey}`}
              unitId={bannerId}
              size={size}
              requestOptions={{
                requestNonPersonalizedAdsOnly: true,
                keywords: [ 'games', 'mobile games', 'gaming', 'casual games', 'paranormal', 'horror', 'indie'],
                contentUrl: 'https://phasmophobia.fandom.com',
              }}
              onAdLoaded={handleAdLoaded}
              onAdFailedToLoad={handleAdFailedToLoad}
              onAdOpened={handleAdOpened}
              onAdClosed={handleAdClosed}
            />
          );
        } catch (error) {
          console.error('[AdBanner] Critical error rendering BannerAd:', error);
          // Fail gracefully - don't crash the app
          return null;
        }
      })()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    minHeight: 60,
  },
});
