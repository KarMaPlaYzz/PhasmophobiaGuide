import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Animated, {
    FadeInDown,
    FadeOutUp,
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';

interface AnimatedSearchBarProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  searchIconColor: string;
  textColor: string;
  placeholderTextColor: string;
  backgroundColor: string;
  borderColor: string;
  focusedBorderColor: string;
  clearButtonColor: string;
  style?: any;
}

export function AnimatedSearchBar({
  placeholder,
  value,
  onChangeText,
  searchIconColor,
  textColor,
  placeholderTextColor,
  backgroundColor,
  borderColor,
  focusedBorderColor,
  clearButtonColor,
  style,
}: AnimatedSearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const focusValue = useSharedValue(0);

  const handleFocus = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsFocused(true);
    focusValue.value = withSpring(1, {
      damping: 10,
      mass: 1,
      overshootClamping: false,
    });
  };

  const handleBlur = () => {
    setIsFocused(false);
    focusValue.value = withSpring(0, {
      damping: 10,
      mass: 1,
      overshootClamping: false,
    });
  };

  const animatedBorderStyle = useAnimatedStyle(() => {
    return {
      borderColor: interpolateColor(
        focusValue.value,
        [0, 1],
        [borderColor, focusedBorderColor],
        'RGB'
      ),
      borderWidth: focusValue.value * 1.5 + 1,
    };
  });

  const clearButtonOpacity = useAnimatedStyle(() => {
    return {
      opacity: value.length > 0 ? 1 : 0.3,
    };
  });

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor },
        animatedBorderStyle,
        style,
      ]}
    >
      <Ionicons size={20} name="search" color={searchIconColor} />
      <TextInput
        style={[styles.searchInput, { color: textColor }]}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        value={value}
        onChangeText={onChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      {value.length > 0 && (
        <Animated.View
          entering={FadeInDown.springify()}
          exiting={FadeOutUp.springify()}
        >
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onChangeText('');
            }}
            style={styles.clearButton}
          >
            <Ionicons size={20} name="close-circle" color={clearButtonColor} />
          </TouchableOpacity>
        </Animated.View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    marginBottom: 16,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 4,
  },
  clearButton: {
    padding: 4,
  },
});
