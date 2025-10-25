import React, { useEffect } from 'react';
import Animated, {
    Extrapolate,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';

interface PremiumPaywallAnimationProps {
  children: React.ReactNode;
  type?: 'pulse' | 'scale-bounce' | 'shine';
}

/**
 * Wraps premium paywall elements with attention-grabbing animations
 * Creates visual hierarchy and encourages user interaction with CTAs
 * 
 * Types:
 * - pulse: Gentle pulsing glow effect (for badges/icons)
 * - scale-bounce: Bouncy scale animation (for feature cards)
 * - shine: Horizontal shine effect (for buttons/CTAs)
 */
export function PremiumPaywallAnimation({
  children,
  type = 'pulse',
}: PremiumPaywallAnimationProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const shinePosition = useSharedValue(-1);

  useEffect(() => {
    if (type === 'pulse') {
      // Gentle pulsing glow
      scale.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 1200 }),
          withTiming(1, { duration: 1200 })
        ),
        -1,
        true
      );
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.9, { duration: 1200 }),
          withTiming(1, { duration: 1200 })
        ),
        -1,
        true
      );
    } else if (type === 'scale-bounce') {
      // Bouncy scale for feature cards
      scale.value = withRepeat(
        withSequence(
          withTiming(1.08, { duration: 500 }),
          withTiming(0.97, { duration: 300 }),
          withTiming(1, { duration: 300 })
        ),
        -1,
        true
      );
    } else if (type === 'shine') {
      // Horizontal shine effect for buttons
      shinePosition.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1500 }),
          withTiming(-1, { duration: 0 })
        ),
        -1,
        false
      );
    }
  }, [type, scale, opacity, shinePosition]);

  const animatedStyle = useAnimatedStyle(() => {
    if (type === 'pulse') {
      return {
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
      };
    }
    if (type === 'scale-bounce') {
      return {
        transform: [{ scale: scale.value }],
      };
    }
    if (type === 'shine') {
      // Shine effect through opacity gradient
      return {
        opacity: interpolate(
          shinePosition.value,
          [-1, -0.5, 0, 0.5, 1],
          [1, 1, 0.8, 1, 1],
          Extrapolate.CLAMP
        ),
      };
    }
    return {};
  });

  return (
    <Animated.View style={animatedStyle}>
      {children}
    </Animated.View>
  );
}
