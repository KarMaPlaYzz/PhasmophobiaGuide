/**
 * App Review Modal
 * Non-obnoxious review request prompt with smooth animations
 * 
 * Features:
 * - Smooth fade-in/out animations
 * - Three clear CTAs: "Rate Now", "Maybe Later", "Never"
 * - Optional pre-review feedback form
 * - Opens iOS App Store review page when rating
 */

import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import { Alert, Linking, Modal, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useLocalization } from '@/hooks/use-localization';
import {
    recordReviewDeclinedPermanently,
    recordReviewDismissed,
    recordReviewRequested
} from '@/lib/services/appReviewService';

interface AppReviewModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export const AppReviewModal = ({ isVisible, onClose }: AppReviewModalProps) => {
  const colors = Colors['dark'];
  const { t } = useLocalization();
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedback, setFeedback] = useState('');
  const scaleValue = useSharedValue(0.8);
  const opacityValue = useSharedValue(0);

  useEffect(() => {
    if (isVisible) {
      scaleValue.value = withTiming(1, {
        duration: 300,
        easing: Easing.out(Easing.cubic),
      });
      opacityValue.value = withTiming(1, {
        duration: 300,
        easing: Easing.out(Easing.cubic),
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      scaleValue.value = withTiming(0.8, {
        duration: 200,
        easing: Easing.in(Easing.cubic),
      });
      opacityValue.value = withTiming(0, {
        duration: 200,
        easing: Easing.in(Easing.cubic),
      });
    }
  }, [isVisible]);

  const modalAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
    opacity: opacityValue.value,
  }));

  const handleRateNow = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // If feedback form is shown, log feedback first
      if (showFeedbackForm && feedback.trim()) {
        console.log('[AppReview] User feedback:', feedback);
        // In production, you'd send this to analytics or a feedback service
      }

      // Record the review action
      await recordReviewRequested();

      // Open App Store review on iOS
      const appStoreUrl = 'itms-apps://apps.apple.com/app/id1234567890?action=write-review';
      if (await Linking.canOpenURL(appStoreUrl)) {
        await Linking.openURL(appStoreUrl);
      } else {
        // Fallback: Open app on App Store
        const appStoreLink = 'https://apps.apple.com/app/id1234567890';
        if (await Linking.canOpenURL(appStoreLink)) {
          await Linking.openURL(appStoreLink);
        } else {
          Alert.alert(
            'Rate Phasmophobia Guide',
            'Thank you for your interest! Please visit the App Store to rate us.'
          );
        }
      }

      onClose();
    } catch (error) {
      console.error('[AppReview] Error requesting review:', error);
      Alert.alert('Error', 'Could not open App Store. Please try again later.');
    }
  };

  const handleMaybeLater = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await recordReviewDismissed();
      onClose();
    } catch (error) {
      console.error('[AppReview] Error recording dismissal:', error);
    }
  };

  const handleNeverAsk = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await recordReviewDeclinedPermanently();
      onClose();
    } catch (error) {
      console.error('[AppReview] Error recording permanent decline:', error);
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
        <Animated.View
          style={[
            styles.modalWrapper,
            modalAnimatedStyle,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconWrapper}>
              <Ionicons name="star" size={32} color="#FFD700" />
            </View>
            <ThemedText style={styles.title} type="subtitle">
              Love This App?
            </ThemedText>
            <ThemedText style={styles.subtitle} type="default">
              Help us reach more ghost hunters! Rate us on the App Store.
            </ThemedText>
          </View>

          {/* Feedback Form (Optional) */}
          {showFeedbackForm && (
            <View style={[styles.feedbackForm, { backgroundColor: colors.background }]}>
              <ThemedText style={styles.feedbackLabel} type="default">
                What could we improve?
              </ThemedText>
              {/* Note: In production, use a real TextInput component */}
              <ThemedText style={styles.feedbackPlaceholder} type="default">
                (Optional feedback would go here)
              </ThemedText>
            </View>
          )}

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            {/* Rate Now Button */}
            <Pressable
              style={({ pressed }) => [
                styles.buttonPrimary,
                {
                  backgroundColor: colors.supernatural,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
              onPress={handleRateNow}
              android_ripple={{ color: 'rgba(255, 255, 255, 0.3)' }}
            >
              <Ionicons name="star" size={18} color="white" />
              <ThemedText style={styles.buttonTextPrimary} type="subtitle">
                Rate Now
              </ThemedText>
            </Pressable>

            {/* Maybe Later Button */}
            <Pressable
              style={({ pressed }) => [
                styles.buttonSecondary,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
              onPress={handleMaybeLater}
              android_ripple={{ color: 'rgba(0, 0, 0, 0.1)' }}
            >
              <ThemedText
                style={[
                  styles.buttonTextSecondary,
                  { color: colors.text },
                ]}
                type="default"
              >
                Maybe Later
              </ThemedText>
            </Pressable>

            {/* Never Ask Button */}
            <Pressable
              style={({ pressed }) => [
                styles.buttonTertiary,
                {
                  opacity: pressed ? 0.6 : 0.8,
                },
              ]}
              onPress={handleNeverAsk}
              android_ripple={{ color: 'rgba(0, 0, 0, 0.1)' }}
            >
              <ThemedText
                style={[
                  styles.buttonTextTertiary,
                  { color: colors.tabIconDefault },
                ]}
                type="default"
              >
                Never Ask Again
              </ThemedText>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalWrapper: {
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconWrapper: {
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  feedbackForm: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 20,
  },
  feedbackLabel: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 8,
  },
  feedbackPlaceholder: {
    fontSize: 12,
    fontStyle: 'italic',
    opacity: 0.6,
  },
  buttonContainer: {
    gap: 10,
  },
  buttonPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonTextPrimary: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  buttonSecondary: {
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonTextSecondary: {
    fontSize: 15,
    fontWeight: '500',
  },
  buttonTertiary: {
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonTextTertiary: {
    fontSize: 14,
    fontWeight: '400',
  },
});
