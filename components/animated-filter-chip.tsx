import React from 'react';
import { Pressable } from 'react-native';
import Animated, {
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from 'react-native-reanimated';

interface AnimatedFilterChipProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
  selectedColor: string;
  unselectedColor: string;
  textColor?: string;
  selectedTextColor?: string;
}

/**
 * AnimatedFilterChip - Smooth selection feedback for filter chips
 * 
 * Features:
 * - Color transitions on selection
 * - Scale animation for press feedback
 * - Smooth background and text color changes
 * - Spring physics for natural feel
 * 
 * Usage:
 * ```tsx
 * <AnimatedFilterChip
 *   label="Beginner"
 *   isSelected={difficulty === 'Beginner'}
 *   onPress={() => setDifficulty('Beginner')}
 *   selectedColor={colors.spectral}
 *   unselectedColor={colors.border}
 * />
 * ```
 */
export const AnimatedFilterChip: React.FC<AnimatedFilterChipProps> = ({
  label,
  isSelected,
  onPress,
  selectedColor,
  unselectedColor,
  textColor = '#000',
  selectedTextColor = '#FFF',
}) => {
  const scaleValue = useSharedValue(1);
  const colorValue = useSharedValue(isSelected ? 1 : 0);

  React.useEffect(() => {
    colorValue.value = withTiming(isSelected ? 1 : 0, {
      duration: 200,
    });
  }, [isSelected, colorValue]);

  const handlePressIn = () => {
    scaleValue.value = withSpring(0.92, {
      damping: 12,
      mass: 1,
      overshootClamping: true,
    });
  };

  const handlePressOut = () => {
    scaleValue.value = withSpring(1, {
      damping: 10,
      mass: 1,
      overshootClamping: false,
    });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scaleValue.value }],
      backgroundColor: interpolateColor(
        colorValue.value,
        [0, 1],
        [unselectedColor, selectedColor]
      ),
    };
  });

  const textAnimatedStyle = useAnimatedStyle(() => {
    return {
      color: interpolateColor(
        colorValue.value,
        [0, 1],
        [textColor, selectedTextColor]
      ),
    };
  });

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={{ marginRight: 8, marginBottom: 8 }}
    >
      <Animated.View
        style={[
          {
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
          },
          animatedStyle,
        ]}
      >
        <Animated.Text
          style={[
            {
              fontSize: 13,
              fontWeight: '600',
            },
            textAnimatedStyle,
          ]}
        >
          {label}
        </Animated.Text>
      </Animated.View>
    </Pressable>
  );
};
