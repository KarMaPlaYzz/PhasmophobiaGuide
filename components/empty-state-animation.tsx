import React, { useEffect } from 'react';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';

interface EmptyStateAnimationProps {
  children: React.ReactNode;
  type?: 'float' | 'bounce' | 'pulse';
}

/**
 * Wraps empty state content with floating, bounce, or pulsing animations
 * Creates engaging, non-intrusive animations for when lists are empty
 * 
 * Types:
 * - float: Gentle floating up-down motion
 * - bounce: Bouncy spring animation
 * - pulse: Pulsing scale effect
 */
export function EmptyStateAnimation({
  children,
  type = 'float',
}: EmptyStateAnimationProps) {
  const yOffset = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    if (type === 'float') {
      // Gentle floating animation
      yOffset.value = withRepeat(
        withSequence(
          withTiming(-12, { duration: 2000 }),
          withTiming(12, { duration: 2000 })
        ),
        -1,
        true
      );
    } else if (type === 'bounce') {
      // Bouncy spring animation
      yOffset.value = withRepeat(
        withSequence(
          withTiming(-20, { duration: 600 }),
          withTiming(0, { duration: 400 })
        ),
        -1,
        true
      );
    } else if (type === 'pulse') {
      // Pulsing scale effect
      scale.value = withRepeat(
        withSequence(
          withTiming(1.08, { duration: 1000 }),
          withTiming(1, { duration: 1000 })
        ),
        -1,
        true
      );
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.7, { duration: 1000 }),
          withTiming(0.5, { duration: 1000 })
        ),
        -1,
        true
      );
    }
  }, [type, yOffset, scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => {
    if (type === 'pulse') {
      return {
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
      };
    }
    return {
      transform: [{ translateY: yOffset.value }],
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      {children}
    </Animated.View>
  );
}
