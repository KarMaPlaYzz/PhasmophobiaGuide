import React, { useCallback } from 'react';
import { Pressable, PressableProps } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

interface AnimatedPressableProps extends Omit<PressableProps, 'onPress' | 'onPressIn' | 'onPressOut'> {
  onPress?: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
  scaleDown?: number;
  children?: React.ReactNode;
}

/**
 * Animated pressable component with spring scale feedback
 * - Scales down on press (default: 0.95)
 * - Scales back up with spring animation on release
 * - Perfect for list items and interactive elements
 */
export function AnimatedPressable({
  onPress,
  onPressIn,
  onPressOut,
  scaleDown = 0.95,
  style,
  children,
  ...props
}: AnimatedPressableProps) {
  const scaleValue = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    scaleValue.value = withSpring(scaleDown, {
      damping: 12,
      mass: 1,
      overshootClamping: true,
    });
    onPressIn?.();
  }, [scaleDown, onPressIn]);

  const handlePressOut = useCallback(() => {
    scaleValue.value = withSpring(1, {
      damping: 10,
      mass: 1,
      overshootClamping: false,
    });
    onPressOut?.();
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scaleValue.value }],
    };
  });

  // For Animated.View, we need layout styles (flex, width, etc.)
  // For Pressable, we need state-dependent styles (like opacity changes)
  const layoutStyle = typeof style === 'function' ? undefined : style;

  return (
    <Animated.View style={[animatedStyle, layoutStyle]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={layoutStyle}
        {...props}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}
