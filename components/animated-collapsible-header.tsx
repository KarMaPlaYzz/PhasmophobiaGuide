import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import React, { useEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
    Extrapolate,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';

interface AnimatedCollapsibleHeaderProps {
  title: string;
  isExpanded: boolean;
  onPress: () => void;
  backgroundColor: string;
  titleColor?: string;
  iconColor?: string;
  icon?: string;
}

export function AnimatedCollapsibleHeader({
  title,
  isExpanded,
  onPress,
  backgroundColor,
  titleColor,
  iconColor,
  icon = 'chevron-forward',
}: AnimatedCollapsibleHeaderProps) {
  const rotationValue = useSharedValue(0);

  useEffect(() => {
    rotationValue.value = withSpring(isExpanded ? 1 : 0, {
      damping: 10,
      mass: 1,
      overshootClamping: false,
    });
  }, [isExpanded]);

  const animatedChevronStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${interpolate(
            rotationValue.value,
            [0, 1],
            [0, 90],
            Extrapolate.CLAMP
          )}deg`,
        },
      ],
    };
  });

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      style={[styles.header, { backgroundColor }]}
    >
      <Animated.View style={animatedChevronStyle}>
        <Ionicons
          name={icon as any}
          size={18}
          color={iconColor}
        />
      </Animated.View>
      <ThemedText
        style={[
          styles.title,
          { marginTop: 0, marginBottom: 0, marginLeft: 0, flex: 1, color: titleColor },
        ]}
      >
        {title}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 8,
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
});
