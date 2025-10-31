import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as Notifications from 'expo-notifications';
import React, { useRef, useState } from 'react';
import {
  Dimensions,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useLocalization } from '@/hooks/use-localization';
import { usePremium } from '@/hooks/use-premium';

interface OnboardingScreenProps {
  isVisible: boolean;
  onClose: () => void;
  onShowPremium: () => void;
}

const BASE_ONBOARDING_STEPS = [
  {
    icon: 'skull' as const,
    title: 'Identify Ghosts',
    description: 'Learn about all types of ghosts in Phasmophobia and their unique characteristics',
    color: '#9B59B6',
  },
  {
    icon: 'flashlight' as const,
    title: 'Manage Equipment',
    description: 'Explore all available equipment and build optimal loadouts for your investigations',
    color: '#F39C12',
  },
  {
    icon: 'finger-print' as const,
    title: 'Track Evidence',
    description: 'Identify ghosts by analyzing evidence and environmental clues',
    color: '#E74C3C',
  },
  {
    icon: 'pulse' as const,
    title: 'Monitor Sanity',
    description: 'Track sanity levels and understand how they affect your investigation',
    color: '#3498DB',
  },
  {
    icon: 'notifications' as const,
    title: 'Stay Updated',
    description: 'Get notifications for new Phasmophobia blog posts and game updates',
    color: '#E91E63',
  },
];

const PREMIUM_STEP = {
  icon: 'star' as const,
  title: 'Unlock Premium',
  description: 'Get unlimited access to all features including no ads, ghost comparison, and more',
  color: '#2ECC71',
};

const getOnboardingSteps = (isPremium: boolean) => {
  if (isPremium) {
    return BASE_ONBOARDING_STEPS;
  }
  return [...BASE_ONBOARDING_STEPS, PREMIUM_STEP];
};

export const OnboardingScreen = ({
  isVisible,
  onClose,
  onShowPremium,
}: OnboardingScreenProps) => {
  const colorScheme = useColorScheme();
  const colors = Colors['dark'];
  const { t } = useLocalization();
  const { isPremium } = usePremium();
  const insets = useSafeAreaInsets();

  const [currentStep, setCurrentStep] = useState(0);
  const { width } = Dimensions.get('window');
  const touchStart = useRef(0);
  const touchEnd = useRef(0);

  const onboardingSteps = getOnboardingSteps(isPremium);
  const step = onboardingSteps[currentStep];

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (currentStep === onboardingSteps.length - 1 && !isPremium) {
      // Show premium sheet which handles purchase
      onShowPremium();
      onClose();
    } else {
      // Go to last step
      setCurrentStep(onboardingSteps.length - 1);
    }
  };

  const handleMaybeLater = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  const handleSkip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  const handleSwipeLeft = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSwipeRight = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRequestNotifications = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    try {
      // Request permissions and wait for response
      const { status } = await Notifications.requestPermissionsAsync();
      console.log('[Onboarding] Notification permission status:', status);
    } catch (error) {
      console.error('[Onboarding] Error requesting notification permissions:', error);
    } finally {
      // Always close onboarding after permission request completes (or fails)
      // Use a small delay to ensure native module has finished
      setTimeout(() => {
        onClose();
      }, 100);
    }
  };

  const handleShowPremium = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onClose();
    onShowPremium();
  };

  const handleTouchStart = (e: any) => {
    touchStart.current = e.nativeEvent.pageX;
  };

  const handleTouchEnd = (e: any) => {
    touchEnd.current = e.nativeEvent.pageX;
    handleSwipe();
  };

  const handleSwipe = () => {
    const distance = touchStart.current - touchEnd.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleSwipeLeft();
    } else if (isRightSwipe) {
      handleSwipeRight();
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <View
      style={[
        styles.overlay,
        { backgroundColor: colors.background }
      ]}
    >
      <View
        style={[styles.container, { backgroundColor: colors.background }]}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Header with skip button */}
        <View style={[styles.header, { borderBottomColor: colors.border, paddingTop: insets.top }]}>
          <ThemedText style={styles.headerTitle}></ThemedText>
          <Pressable
            onPress={handleSkip}
            style={({ pressed }) => [
              styles.skipButton,
              { opacity: pressed ? 0.6 : 1 },
            ]}
          >
            <ThemedText style={[styles.skipButtonText, { color: colors.tint }]}>
              Skip
            </ThemedText>
          </Pressable>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          <View style={styles.contentContainer}>
            {/* Icon Circle */}
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: step.color + '15', borderColor: step.color + '30' },
              ]}
            >
              <View style={[styles.iconBackground, { backgroundColor: step.color + '20' }]}>
                <Ionicons name={step.icon} size={64} color={step.color} />
              </View>
            </View>

            {/* Title */}
            <ThemedText type="title" style={styles.title}>
              {step.title}
            </ThemedText>

            {/* Description */}
            <ThemedText style={[styles.description, { color: colors.text + '80' }]}>
              {step.description}
            </ThemedText>

            {/* Step Indicators */}
            <View style={styles.stepIndicators}>
              {onboardingSteps.map((_: any, index: any) => (
                <View
                  key={index}
                  style={[
                    styles.stepDot,
                    {
                      backgroundColor:
                        index <= currentStep
                          ? colors.tint
                          : colors.border,
                      width: index === currentStep ? 32 : 8,
                    },
                  ]}
                />
              ))}
            </View>

            {/* Additional Info for Premium Step */}
            {currentStep === onboardingSteps.length - 1 && !isPremium && (
              <View style={[styles.premiumFeatures, { backgroundColor: colors.surface }]}>
                <View style={styles.premiumFeatureItem}>
                  <Ionicons name="ban" size={20} color={colors.tint} />
                  <ThemedText style={[styles.premiumFeatureText, { color: colors.text }]}>No Ads</ThemedText>
                </View>
                <View style={styles.premiumFeatureItem}>
                  <Ionicons name="git-compare" size={20} color={colors.tint} />
                  <ThemedText style={[styles.premiumFeatureText, { color: colors.text }]}>Ghost Comparison</ThemedText>
                </View>
                <View style={styles.premiumFeatureItem}>
                  <Ionicons name="build" size={20} color={colors.tint} />
                  <ThemedText style={[styles.premiumFeatureText, { color: colors.text }]}>Equipment Optimizer</ThemedText>
                </View>
                <View style={styles.premiumFeatureItem}>
                  <Ionicons name="bookmark" size={20} color={colors.tint} />
                  <ThemedText style={[styles.premiumFeatureText, { color: colors.text }]}>Smart Bookmarks</ThemedText>
                </View>

                {/* Price Section */}
                <View style={[styles.priceSection, { borderTopColor: colors.border }]}>
                  <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 2 }}>
                    <ThemedText style={[styles.priceText, { color: '#2ECC71' }]}>$2.99</ThemedText>
                    <ThemedText style={[styles.priceSubtext, { color: colors.text + '70', fontSize: 11 }]}>
                      forever
                    </ThemedText>
                  </View>
                  <ThemedText style={[styles.priceSubtext, { color: colors.text + '60', marginTop: 6 }]}>
                    No subscription • One-time payment
                  </ThemedText>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Bottom Buttons */}
        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          {currentStep === 4 ? (
            <>
              {/* Notifications Step - Show Allow and Skip */}
              <Pressable
                onPress={handleMaybeLater}
                style={({ pressed }) => [
                  styles.secondaryButton,
                  {
                    borderColor: colors.border,
                    opacity: pressed ? 0.7 : 1,
                    flex: 1,
                  },
                ]}
              >
                <ThemedText style={[styles.secondaryButtonText, { color: colors.text }]}>
                  Skip
                </ThemedText>
              </Pressable>

              <Pressable
                onPress={handleRequestNotifications}
                style={({ pressed }) => [
                  styles.primaryButton,
                  { backgroundColor: '#E91E63', opacity: pressed ? 0.8 : 1, flex: 1 },
                ]}
              >
                <ThemedText
                  style={[
                    styles.primaryButtonText,
                    { color: colors.background, fontWeight: '700' },
                  ]}
                >
                  Continue
                </ThemedText>
                <Ionicons
                  name="notifications"
                  size={18}
                  color={colors.background}
                  style={{ marginLeft: 8 }}
                />
              </Pressable>
            </>
          ) : currentStep === onboardingSteps.length - 1 && !isPremium ? (
            <>
              {/* Premium Step - Show Unlock and Maybe Later */}
              <Pressable
                onPress={handleMaybeLater}
                style={({ pressed }) => [
                  styles.secondaryButton,
                  {
                    borderColor: colors.border,
                    opacity: pressed ? 0.7 : 1,
                    flex: 1,
                  },
                ]}
              >
                <ThemedText style={[styles.secondaryButtonText, { color: colors.text }]}>
                  Maybe Later
                </ThemedText>
              </Pressable>

              <Pressable
                onPress={handleShowPremium}
                style={({ pressed }) => [
                  styles.primaryButton,
                  { backgroundColor: '#2ECC71', opacity: pressed ? 0.8 : 1, flex: 1 },
                ]}
              >
                <ThemedText
                  style={[
                    styles.primaryButtonText,
                    { color: colors.background, fontWeight: '700' },
                  ]}
                >
                  Unlock Premium
                </ThemedText>
                <Ionicons
                  name="star"
                  size={18}
                  color={colors.background}
                  style={{ marginLeft: 8 }}
                />
              </Pressable>
            </>
          ) : (
            <>
              {/* Regular Steps - Show Navigation */}
              <Pressable
                onPress={handlePrevious}
                disabled={currentStep === 0}
                style={({ pressed }) => [
                  styles.secondaryButton,
                  {
                    borderColor: colors.border,
                    opacity: currentStep === 0 ? 0.5 : pressed ? 0.7 : 1,
                  },
                ]}
              >
                <Ionicons name="chevron-back" size={20} color={colors.text} />
              </Pressable>

              <Pressable
                onPress={handleNext}
                disabled={currentStep === onboardingSteps.length - 1}
                style={({ pressed }) => [
                  styles.secondaryButton,
                  {
                    borderColor: colors.border,
                    opacity:
                      currentStep === onboardingSteps.length - 1
                        ? 0.5
                        : pressed
                          ? 0.7
                          : 1,
                  },
                ]}
              >
                <Ionicons name="chevron-forward" size={20} color={colors.text} />
              </Pressable>

              <Pressable
                onPress={handleShowPremium}
                style={({ pressed }) => [
                  styles.primaryButton,
                  { backgroundColor: '#2ECC71', opacity: pressed ? 0.8 : 1 },
                ]}
              >
                <ThemedText
                  style={[
                    styles.primaryButtonText,
                    { color: colors.background, fontWeight: '700' },
                  ]}
                >
                  {isPremium ? 'Enter App' : 'Skip to Premium'}
                </ThemedText>
                <Ionicons
                  name={isPremium ? 'arrow-forward' : 'star'}
                  size={18}
                  color={colors.background}
                  style={{ marginLeft: 8 }}
                />
              </Pressable>
            </>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
  container: {
    flex: 1,
  },
  header: {
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  skipButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  contentContainer: {
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 2,
  },
  iconBackground: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  stepIndicators: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 32,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  stepDot: {
    height: 8,
    borderRadius: 4,
  },
  premiumFeatures: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 20,
    width: '90%',
    minHeight: 'auto',
  },
  premiumFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  premiumFeatureText: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  priceSection: {
    marginTop: 18,
    paddingTop: 18,
    paddingBottom: 8,
    borderTopWidth: 1,
    alignItems: 'center',
    width: '100%',
  },
  priceText: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 2,
    lineHeight: 40,
  },
  priceSubtext: {
    fontSize: 11,
    fontWeight: '500',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  primaryButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    minHeight: 50,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 50,
    minWidth: 50,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
