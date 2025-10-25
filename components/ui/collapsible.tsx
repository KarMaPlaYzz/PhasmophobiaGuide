import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as Haptics from 'expo-haptics';
import { PropsWithChildren, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  Extrapolate,
  FadeInDown,
  FadeOutUp,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function Collapsible({ children, title }: PropsWithChildren & { title: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useColorScheme() ?? 'light';
  const rotationValue = useSharedValue(0);
  const colors = Colors[theme];

  const animatedChevronStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${interpolate(
            rotationValue.value,
            [0, 1],
            [0, 180],
            Extrapolate.CLAMP
          )}deg`,
        },
      ],
    };
  });

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newState = !isOpen;
    setIsOpen(newState);
    rotationValue.value = withSpring(newState ? 1 : 0, {
      damping: 12,
      mass: 1,
      overshootClamping: false,
    });
  };

  return (
    <ThemedView>
      <TouchableOpacity
        style={[styles.heading, { backgroundColor: colors.surface + '80' }]}
        onPress={handlePress}
        activeOpacity={0.6}>
        <Animated.View style={[animatedChevronStyle, styles.chevron]}>
          <MaterialIcons
            name="expand-more"
            size={20}
            color={colors.spectral}
          />
        </Animated.View>

        <ThemedText style={styles.title}>{title}</ThemedText>
      </TouchableOpacity>
      {isOpen && (
        <Animated.View
          entering={FadeInDown.springify().damping(12)}
          exiting={FadeOutUp.springify()}
          style={styles.content}>
          {children}
        </Animated.View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginVertical: 4,
  },
  chevron: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
  },
  content: {
    marginTop: 8,
    marginLeft: 0,
  },
});
