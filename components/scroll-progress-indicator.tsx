import React from 'react';
import { ScrollView, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';

interface ScrollProgressIndicatorProps {
  children: React.ReactNode;
  progressBarHeight?: number;
  progressBarColor?: string;
  backgroundColor?: string;
}

/**
 * ScrollProgressIndicator - Shows scroll progress for long lists
 * 
 * Features:
 * - Animated progress bar that fills based on scroll position
 * - Smooth transitions using react-native-reanimated
 * - Customizable colors and height
 * - Works with any ScrollView content
 */
export const ScrollProgressIndicator: React.FC<ScrollProgressIndicatorProps> = ({
  children,
  progressBarHeight = 3,
  progressBarColor = '#8B5CF6',
  backgroundColor = 'transparent',
}) => {
  const scrollProgress = useSharedValue(0);

  const handleScroll = (event: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const scrollDistance = contentSize.height - layoutMeasurement.height;
    
    if (scrollDistance > 0) {
      const progress = contentOffset.y / scrollDistance;
      scrollProgress.value = withTiming(Math.min(progress, 1), {
        duration: 100,
      });
    }
  };

  const progressBarStyle = useAnimatedStyle(() => {
    return {
      flex: scrollProgress.value,
    };
  });

  return (
    <View style={{ flex: 1 }}>
      {/* Progress Bar Container */}
      <View
        style={{
          height: progressBarHeight,
          backgroundColor,
          overflow: 'hidden',
          flexDirection: 'row',
        }}
      >
        {/* Animated Progress Bar */}
        <Animated.View
          style={[
            {
              height: progressBarHeight,
              backgroundColor: progressBarColor,
              borderRadius: progressBarHeight / 2,
            },
            progressBarStyle,
          ]}
        />
      </View>

      {/* Scrollable Content */}
      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={{ flex: 1 }}
      >
        {children}
      </ScrollView>
    </View>
  );
};
