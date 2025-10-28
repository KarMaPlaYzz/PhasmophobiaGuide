import { Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import {
  useSharedValue
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useLocalization } from '@/hooks/use-localization';
import { useMockPremium } from '@/hooks/use-mock-premium';
import { usePremium } from '@/hooks/use-premium';
import { useRewardedAds } from '@/hooks/use-rewarded-ads';

interface PremiumPaywallSheetProps {
  isVisible: boolean;
  onClose: () => void;
}

const PREMIUM_FEATURES = [
  {
    icon: 'ban' as const,
    title: 'No Ads',
    description: 'Browse without interruptions',
  },
  {
    icon: 'git-compare' as const,
    title: 'Ghost Comparison',
    description: 'Compare ghosts side-by-side',
  },
  {
    icon: 'build' as const,
    title: 'Equipment Optimizer',
    description: 'Build the best equipment loadouts',
  },
  {
    icon: 'layers' as const,
    title: 'Loadout Presets',
    description: 'Save and share equipment configurations',
  },
  {
    icon: 'finger-print' as const,
    title: 'Evidence Identifier',
    description: 'Identify ghosts by evidence',
  },
  {
    icon: 'bookmark' as const,
    title: 'Smart Bookmarks',
    description: 'Organize with notes, colors & collections',
  },
  {
    icon: 'settings' as const,
    title: 'Advanced Filters',
    description: 'Filter by activity, difficulty, speed',
  },
];

export const PremiumPaywallSheet = ({
  isVisible,
  onClose,
}: PremiumPaywallSheetProps) => {
  const colors = Colors['dark'];
  const snapPoints = useMemo(() => ['90%'], []);
  const { t } = useLocalization();
  const { isPremium, isPurchasing, error, handlePurchase, handleRestore } = usePremium();
  const { isMockPremiumEnabled, toggleMockPremium, isAvailable: isMockAvailable } = useMockPremium();
  const { showAd, isLoading: isAdLoading, error: adError, dismissError } = useRewardedAds();
  const [trialUsed, setTrialUsed] = useState(false);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const animatedPosition = useSharedValue(0);

  // Check if user already used trial
  useEffect(() => {
    const checkTrialStatus = async () => {
      try {
        const hasUsedTrial = await AsyncStorage.getItem('trial_ad_used');
        setTrialUsed(!!hasUsedTrial);
      } catch (error) {
        console.warn('Error checking trial status:', error);
      }
    };
    checkTrialStatus();
  }, []);

  // Handle sheet visibility
  useEffect(() => {
    if (isVisible && !isPremium) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isVisible, isPremium]);

  if (isPremium) {
    return null; // Don't show paywall for premium users
  }

  const handlePurchasePress = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      // In Expo Go, toggle mock premium instead of real purchase
      if (isMockAvailable) {
        await toggleMockPremium();
        Alert.alert(
          'Mock Premium',
          isMockPremiumEnabled ? 'Premium disabled' : 'Premium enabled - Enjoy all features!',
          [{ text: 'OK', onPress: () => isMockPremiumEnabled && onClose() }]
        );
      } else {
        await handlePurchase();
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to process request. Please try again.');
    }
  };

  const handleRestorePress = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await handleRestore();
    } catch (err) {
      Alert.alert('Error', 'Failed to restore purchases. Please try again.');
    }
  };

  const handleWatchAdForTrial = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const shown = await showAd();
      
      if (shown) {
        // Grant 15-minute trial access
        const trialExpiry = Date.now() + (15 * 60 * 1000); // 15 minutes
        await AsyncStorage.setItem('trial_ad_expiry', trialExpiry.toString());
        await AsyncStorage.setItem('trial_ad_used', 'true');
        
        setTrialUsed(true);
        
        Alert.alert(
          'Trial Started!',
          'You now have access to premium features for 15 minutes. Try them out and consider getting the full version!',
          [{ text: 'OK', onPress: onClose }]
        );
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to start trial. Please try again.');
    }
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      onClose={onClose}
      enablePanDownToClose={true}
      animationConfigs={{
        damping: 80,
        mass: 1.2,
        overshootClamping: true,
      }}
      animatedPosition={animatedPosition}
      handleComponent={() => (
        <View style={[styles.handleContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.handle, { backgroundColor: colors.text + '30' }]} />
        </View>
      )}
      backgroundComponent={() => (
        <BlurView intensity={90} tint="dark" style={styles.blurContainer} />
      )}
    >
      <BottomSheetScrollView
        style={[styles.content, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.premiumBadge, { backgroundColor: colors.tint + '20' }]}>
            <Ionicons name="star" size={20} color={colors.tint} />
            <ThemedText style={[styles.premiumBadgeText, { color: colors.tint }]}>
              Premium
            </ThemedText>
          </View>

          <ThemedText type="title" style={styles.title}>
            Unlock Full Power
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: colors.text + '80' }]}>
            Get unlimited access to all features
          </ThemedText>
        </View>

        {/* Features Grid */}
        <View style={styles.featuresGrid}>
          {PREMIUM_FEATURES.map((feature, index) => (
            <View
              key={index}
              style={[
                styles.featureCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <View
                style={[
                  styles.featureIconContainer,
                  { backgroundColor: colors.tint + '15' },
                ]}
              >
                <Ionicons name={feature.icon} size={24} color={colors.tint} />
              </View>
              <ThemedText type="defaultSemiBold" style={styles.featureTitle}>
                {feature.title}
              </ThemedText>
              <ThemedText
                style={[styles.featureDescription, { color: colors.text + '70' }]}
              >
                {feature.description}
              </ThemedText>
            </View>
          ))}
        </View>

        {/* Pricing Section */}
        <View style={styles.pricingSection}>
          <View
            style={[
              styles.priceCard,
              { backgroundColor: colors.tint + '10', borderColor: colors.tint },
            ]}
          >
            <View style={styles.priceHeader}>
              <ThemedText type="title" style={[styles.price, { color: colors.tint }]}>
                $2.99
              </ThemedText>
              <ThemedText style={[styles.priceSubtext, { color: colors.text + '70' }]}>
                One-time purchase
              </ThemedText>
            </View>

            <ThemedText style={[styles.priceDescription, { color: colors.text + '80' }]}>
              Unlock all features forever. No subscriptions, no hidden fees.
            </ThemedText>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonsContainer}>
          {!trialUsed && (
            <Pressable
              onPress={handleWatchAdForTrial}
              disabled={isAdLoading || isPurchasing}
              style={({ pressed }) => [
                styles.trialButton,
                {
                  backgroundColor: colors.tint + '20',
                  opacity: pressed || isAdLoading ? 0.7 : 1,
                },
              ]}
            >
              <Ionicons
                name="play"
                size={18}
                color={colors.tint}
                style={{ marginRight: 8 }}
              />
              <ThemedText
                style={[
                  styles.trialButtonText,
                  { color: colors.tint, fontWeight: '600' },
                ]}
              >
                {isAdLoading ? 'Loading Ad...' : 'Try for 15 Minutes'}
              </ThemedText>
            </Pressable>
          )}

          <Pressable
            onPress={handlePurchasePress}
            disabled={isPurchasing}
            style={({ pressed }) => [
              styles.purchaseButton,
              {
                backgroundColor: colors.tint,
                opacity: pressed || isPurchasing ? 0.8 : 1,
              },
            ]}
          >
            <Ionicons
              name="diamond"
              size={20}
              color={colors.background}
              style={{ marginRight: 8 }}
            />
            <ThemedText
              style={[
                styles.purchaseButtonText,
                { color: colors.background, fontWeight: '700' },
              ]}
            >
              {isPurchasing ? 'Processing...' : isMockAvailable ? (isMockPremiumEnabled ? 'Disable Mock Premium' : 'Enable Mock Premium') : 'Unlock Premium'}
            </ThemedText>
          </Pressable>

          {!isMockAvailable && (
            <Pressable
              onPress={handleRestorePress}
              disabled={isPurchasing}
              style={({ pressed }) => [
                styles.restoreButton,
                {
                  borderColor: colors.tint,
                  opacity: pressed || isPurchasing ? 0.7 : 1,
                },
              ]}
            >
              <ThemedText
                style={[
                  styles.restoreButtonText,
                  { color: colors.tint, fontWeight: '600' },
                ]}
              >
                Restore Purchase
              </ThemedText>
            </Pressable>
          )}
        </View>

        {/* Error Message */}
        {error && (
          <View
            style={[
              styles.errorContainer,
              { backgroundColor: '#FF3B30' + '20' },
            ]}
          >
            <Ionicons name="warning" size={16} color="#FF3B30" />
            <ThemedText style={[styles.errorText, { color: '#FF3B30' }]}>
              {error}
            </ThemedText>
          </View>
        )}

        {/* Mock Premium Info */}
        {isMockAvailable && (
          <View
            style={[
              styles.infoContainer,
              { backgroundColor: colors.tint + '20' },
            ]}
          >
            <Ionicons name="bulb" size={16} color={colors.tint} />
            <ThemedText style={[styles.infoText, { color: colors.tint }]}>
              {isMockPremiumEnabled 
                ? 'Mock Premium is active - test all features!' 
                : 'Click "Enable Mock Premium" to test all features in Expo Go'}
            </ThemedText>
          </View>
        )}

        {/* Footer Info */}
        <ThemedText style={[styles.footer, { color: colors.text + '60' }]}>
          {isMockAvailable 
            ? 'Mock premium is for testing in Expo Go only.'
            : 'Restore purchases to regain access on a new device. You\'ll need an internet connection to verify your purchase.'}
        </ThemedText>

        <View style={{ height: 32 }} />
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  blurContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  handleContainer: {
    paddingTop: 12,
    paddingBottom: 8,
    alignItems: 'center',
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },

  // Header
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  premiumBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },

  // Features Grid
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 28,
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%',
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  featureIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 11,
    textAlign: 'center',
    fontWeight: '400',
    lineHeight: 14,
  },

  // Pricing
  pricingSection: {
    marginBottom: 28,
  },
  priceCard: {
    borderRadius: 14,
    borderWidth: 2,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  priceHeader: {
    marginBottom: 12,
  },
  price: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 4,
  },
  priceSubtext: {
    fontSize: 13,
    fontWeight: '500',
  },
  priceDescription: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },

  // Buttons
  buttonsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  trialButton: {
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 48,
  },
  trialButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  purchaseButton: {
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 56,
  },
  purchaseButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  restoreButton: {
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 50,
  },
  restoreButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },

  // Error
  errorContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  errorText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '500',
  },

  // Info
  infoContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '500',
  },

  // Footer
  footer: {
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
    fontWeight: '400',
  },
});
