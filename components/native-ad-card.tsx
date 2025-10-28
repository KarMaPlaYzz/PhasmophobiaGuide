import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useInterstitialAds } from '@/hooks/use-interstitial-ads';
import { usePremium } from '@/hooks/use-premium';

interface NativeAdCardProps {
  /** Optional custom title */
  title?: string;
  /** Optional custom description */
  description?: string;
  /** Optional custom button text */
  buttonText?: string;
  /** Callback when user taps the ad */
  onPress?: () => void;
}

/**
 * Native Ad Card Component
 * 
 * Displays a native ad that blends seamlessly into lists.
 * Respects premium status and shows upgrade incentive.
 * 
 * Usage:
 * ```tsx
 * <NativeAdCard
 *   title="Remove Ads"
 *   description="Upgrade to Premium for an ad-free experience"
 *   buttonText="Upgrade Now"
 *   onPress={handlePremiumUpgrade}
 * />
 * ```
 */
export const NativeAdCard = ({
  title = 'Remove Ads',
  description = 'Enjoy the app ad-free. Upgrade to Premium now.',
  buttonText = 'Upgrade',
  onPress,
}: NativeAdCardProps) => {
  const colors = Colors['dark'];
  const { isPremium, handlePurchase } = usePremium();
  const { showAd, canShowAd } = useInterstitialAds();

  // If user is premium, don't show anything
  if (isPremium) {
    return null;
  }

  const handleCardPress = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    if (onPress) {
      onPress();
      return;
    }

    // Default behavior: show interstitial ad if available
    if (canShowAd()) {
      await showAd();
    }
  }, [onPress, canShowAd, showAd]);

  const handleUpgradePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    handlePurchase();
  }, [handlePurchase]);

  return (
    <Pressable
      onPress={handleCardPress}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: colors.spectral + '12',
          borderColor: colors.spectral + '30',
          opacity: pressed ? 0.7 : 1,
        },
      ]}
      android_ripple={{ color: colors.spectral + '20' }}
    >
      {/* Icon */}
      <View style={styles.iconContainer}>
        <View style={[styles.iconBackground, { backgroundColor: colors.spectral + '25' }]}>
          <Ionicons name="star" size={28} color={colors.spectral} />
        </View>
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        <ThemedText style={styles.title}>{title}</ThemedText>
        <ThemedText style={styles.description}>{description}</ThemedText>
      </View>

      {/* Action Button */}
      <Pressable
        onPress={handleUpgradePress}
        style={({ pressed }) => [
          styles.actionButton,
          {
            backgroundColor: colors.spectral,
            opacity: pressed ? 0.8 : 1,
          },
        ]}
      >
        <ThemedText style={styles.actionButtonText}>{buttonText}</ThemedText>
        <Ionicons name="arrow-forward" size={14} color="white" />
      </Pressable>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginHorizontal: 0,
    marginVertical: 8,
    gap: 12,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 56,
  },
  iconBackground: {
    width: 48,
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
  },
  description: {
    fontSize: 12,
    fontWeight: '500',
    opacity: 0.7,
    lineHeight: 16,
  },
  actionButton: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    gap: 4,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: 'white',
  },
});
