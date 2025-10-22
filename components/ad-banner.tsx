import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { usePremium } from '@/hooks/use-premium';
import { getBannerAdId } from '@/lib/services/admobService';

interface AdBannerProps {
  /**
   * Size of the banner
   * Default: BannerAdSize.ANCHORED_ADAPTIVE_BANNER
   */
  size?: string;
}

/**
 * Ad Banner Component
 * Shows Google AdMob banner ads (only for non-premium users)
 */
export const AdBanner = ({ size = BannerAdSize.ANCHORED_ADAPTIVE_BANNER }: AdBannerProps) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { isPremium, isLoading } = usePremium();
  const [adLoaded, setAdLoaded] = useState(false);
  const [adError, setAdError] = useState(false);

  // Don't show ads for premium users or while loading premium status
  if (isPremium || isLoading) {
    return null;
  }

  // Don't render if ad failed to load
  if (adError) {
    return null;
  }

  return (
    <View style={styles.container}>
      {!adLoaded && <ActivityIndicator size="small" color={colors.tabIconDefault} />}
      <BannerAd
        unitId={getBannerAdId()}
        size={size}
        requestOptions={{
          requestNonPersonalizedAdsOnly: false,
          keywords: ['game', 'guide', 'phasmophobia', 'ghost'],
          contentUrl: 'https://phasmophobia.fandom.com',
        }}
        onAdLoaded={() => {
          setAdLoaded(true);
          console.log('Banner ad loaded');
        }}
        onAdFailedToLoad={(error) => {
          console.log('Banner ad failed to load:', error);
          setAdError(true);
        }}
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
