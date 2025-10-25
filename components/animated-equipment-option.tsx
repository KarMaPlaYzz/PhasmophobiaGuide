import React from 'react';
import { Pressable } from 'react-native';
import Animated, {
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

interface AnimatedEquipmentOptionProps {
  children: React.ReactNode;
  isSelected: boolean;
  onPress: () => void;
  selectedColor: string;
  unselectedColor: string;
}

/**
 * AnimatedEquipmentOption - Smooth animations for equipment loadout selection
 * 
 * Features:
 * - Color transitions on selection
 * - Scale feedback on press
 * - Spring physics for natural feel
 * - Smooth background transitions
 */
export const AnimatedEquipmentOption: React.FC<AnimatedEquipmentOptionProps> = ({
  children,
  isSelected,
  onPress,
  selectedColor,
  unselectedColor,
}) => {
  const scaleValue = useSharedValue(1);
  const colorValue = useSharedValue(isSelected ? 1 : 0);

  React.useEffect(() => {
    colorValue.value = withSpring(isSelected ? 1 : 0, {
      damping: 10,
      mass: 1,
      overshootClamping: false,
    });
  }, [isSelected, colorValue]);

  const handlePressIn = () => {
    scaleValue.value = withSpring(0.95, {
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

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={{ overflow: 'hidden', borderRadius: 12 }}
    >
      <Animated.View style={[{ flex: 1 }, animatedStyle]}>
        {children}
      </Animated.View>
    </Pressable>
  );
};
