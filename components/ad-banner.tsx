import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { usePremium } from '@/hooks/use-premium';
import { getBannerAdId } from '@/lib/services/admobService';
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

// Retry configuration for banner ads
const INITIAL_RETRY_DELAY = 8000; // 8 seconds
const MAX_RETRIES = 4; // Max retry attempts
const BACKOFF_MULTIPLIER = 1.5; // Exponential backoff multiplier
const MAX_BACKOFF_DELAY = 120000; // Cap at 2 minutes

const getRetryDelay = (retryCount: number): number => {
  const exponentialDelay = INITIAL_RETRY_DELAY * Math.pow(BACKOFF_MULTIPLIER, retryCount);
  return Math.min(exponentialDelay, MAX_BACKOFF_DELAY);
};

/**
 * Ad Banner Component
 * Shows Google AdMob banner ads (only for non-premium users)
 * Gracefully handles Expo Go by returning null when native modules aren't available
 * Implements smart retry logic with exponential backoff for failed ad loads
 */
export const AdBanner = ({ size = 'ANCHORED_ADAPTIVE_BANNER' }: AdBannerProps) => {
  const colorScheme = useColorScheme();
  const colors = Colors['dark'];
  const { isPremium, isLoading } = usePremium();
  const [adLoaded, setAdLoaded] = useState(false);
  const [adError, setAdError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [retryTimeout, setRetryTimeout] = useState<any>(null);

  // Don't show ads for premium users or while loading premium status
  if (isPremium || isLoading) {
    return null;
  }

  // Don't render if BannerAd module is not available (e.g., in Expo Go)
  if (!BannerAd) {
    console.log('[AdBanner] BannerAd module not available - ads disabled');
    return null;
  }

  const handleAdFailedToLoad = (error: any) => {
    console.warn(`[AdBanner] Failed to load banner ad (attempt ${retryCount + 1}/${MAX_RETRIES}):`, error);
    
    if (retryCount < MAX_RETRIES) {
      const retryDelay = getRetryDelay(retryCount);
      console.log(`[AdBanner] Retrying banner ad in ${retryDelay}ms...`);
      
      // Clear existing timeout
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
      
      // Set new timeout for retry
      const newTimeout = setTimeout(() => {
        console.log('[AdBanner] Retrying banner ad load...');
        setRetryCount(retryCount + 1);
        setAdError(false); // Reset error state to allow re-render
      }, retryDelay);
      
      setRetryTimeout(newTimeout);
    } else {
      console.error('[AdBanner] Max retries exceeded. Will try again in 10 minutes.');
      setAdError(true);
      
      // Try again after 10 minutes
      const cooldownTimeout = setTimeout(() => {
        console.log('[AdBanner] Retrying banner ad after 10 minute cooldown...');
        setRetryCount(0);
        setAdError(false);
      }, 10 * 60 * 1000);
      
      setRetryTimeout(cooldownTimeout);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, [retryTimeout]);

  // Don't render if ad failed and we've exhausted retries
  if (adError && retryCount >= MAX_RETRIES) {
    return null;
  }

  return (
    <View style={styles.container}>
      {!adLoaded && <ActivityIndicator size="small" color={colors.tabIconDefault} />}
      <BannerAd
        key={`banner-${retryCount}`} // Force re-render on retry
        unitId={getBannerAdId()}
        size={size}
        requestOptions={{
          requestNonPersonalizedAdsOnly: false,
          keywords: ['game', 'guide', 'phasmophobia', 'ghost'],
          contentUrl: 'https://phasmophobia.fandom.com',
        }}
        onAdLoaded={() => {
          setAdLoaded(true);
          setRetryCount(0); // Reset retry count on success
          console.log('[AdBanner] Banner ad loaded successfully');
        }}
        onAdFailedToLoad={handleAdFailedToLoad}
      />
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
