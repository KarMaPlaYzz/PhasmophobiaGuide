import { useFocusEffect } from '@react-navigation/native';
import React from 'react';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';

interface AnimatedScreenProps {
  children: React.ReactNode;
}

/**
 * Wraps screen content with fade-in/out animations on tab navigation
 * Creates smooth transitions between tabs using focus detection
 */
export function AnimatedScreen({ children }: AnimatedScreenProps) {
  const opacity = useSharedValue(0);

  // Trigger animation when screen gains/loses focus
  useFocusEffect(
    React.useCallback(() => {
      // Screen is focused - fade in
      opacity.value = withTiming(1, { duration: 300 });

      return () => {
        // Screen is unfocused - fade out
        opacity.value = withTiming(0, { duration: 200 });
      };
    }, [opacity])
  );

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[{ flex: 1 }, animatedStyle]}
    >
      {children}
    </Animated.View>
  );
}
