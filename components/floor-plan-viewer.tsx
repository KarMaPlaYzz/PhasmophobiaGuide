import { Ionicons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useState } from 'react';
import {
    Dimensions,
    Image,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withDecay,
    withSpring,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface FloorPlanViewerProps {
  imageUrl: string;
  mapName: string;
}

export const FloorPlanViewer = ({ imageUrl, mapName }: FloorPlanViewerProps) => {
  const colorScheme = useColorScheme();
  const colors = Colors['dark'];
  const { width: screenWidth } = Dimensions.get('window');

  const [imageLoading, setImageLoading] = useState(true);
  const [displayScale, setDisplayScale] = useState(1);

  const containerWidth = screenWidth - 32;
  const containerHeight = 380;
  const imageWidth = containerWidth;
  const imageHeight = 310;

  // Shared animated values
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const scale = useSharedValue(1);
  const startScale = useSharedValue(1);
  const startOffsetX = useSharedValue(0);
  const startOffsetY = useSharedValue(0);

  // Pan gesture
  const panGesture = Gesture.Pan()
    .enabled(true)
    .onStart(() => {
      startOffsetX.value = offsetX.value;
      startOffsetY.value = offsetY.value;
    })
    .onUpdate((event) => {
      // Only pan if zoomed in
      if (scale.value > 1) {
        const maxX = Math.max(0, (imageWidth * scale.value - containerWidth) / 2);
        const maxY = Math.max(0, (imageHeight * scale.value - containerHeight) / 2);

        offsetX.value = Math.max(
          -maxX,
          Math.min(maxX, startOffsetX.value + event.translationX)
        );
        offsetY.value = Math.max(
          -maxY,
          Math.min(maxY, startOffsetY.value + event.translationY)
        );
      }
    })
    .onEnd((event) => {
      // Apply momentum only if zoomed in
      if (scale.value > 1) {
        const maxX = Math.max(0, (imageWidth * scale.value - containerWidth) / 2);
        const maxY = Math.max(0, (imageHeight * scale.value - containerHeight) / 2);

        offsetX.value = withDecay({
          velocity: event.velocityX,
          clamp: [-maxX, maxX],
        });
        offsetY.value = withDecay({
          velocity: event.velocityY,
          clamp: [-maxY, maxY],
        });
      }
    });

  // Pinch gesture for zoom
  const pinchGesture = Gesture.Pinch()
    .onStart((event) => {
      startScale.value = scale.value;
    })
    .onUpdate((event) => {
      // Smooth zoom based on pinch delta
      const newScale = Math.max(1, Math.min(3, startScale.value * event.scale));
      scale.value = newScale;
      runOnJS(setDisplayScale)(newScale);
    })
    .onEnd(() => {
      // If zoomed out too much, snap back to 1
      if (scale.value < 1.1) {
        scale.value = withSpring(1);
        offsetX.value = withSpring(0);
        offsetY.value = withSpring(0);
      } else {
        // Constrain pan after zoom ends
        const maxX = Math.max(0, (imageWidth * scale.value - containerWidth) / 2);
        const maxY = Math.max(0, (imageHeight * scale.value - containerHeight) / 2);

        offsetX.value = withSpring(
          Math.max(-maxX, Math.min(maxX, offsetX.value))
        );
        offsetY.value = withSpring(
          Math.max(-maxY, Math.min(maxY, offsetY.value))
        );
      }
    });

  // Combine gestures
  const composed = Gesture.Simultaneous(pinchGesture, panGesture);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: offsetX.value },
        { translateY: offsetY.value },
        { scale: scale.value },
      ],
    };
  });

  const handleReset = () => {
    setDisplayScale(1);
    scale.value = withSpring(1);
    offsetX.value = withSpring(0);
    offsetY.value = withSpring(0);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header with title and reset button */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <ThemedText style={styles.zoomLabel}>
          Zoom: {(displayScale * 100).toFixed(0)}%
        </ThemedText>
        <TouchableOpacity
          onPress={handleReset}
          disabled={displayScale === 1}
          style={[
            styles.resetButton,
            {
              backgroundColor:
                displayScale === 1
                  ? colors.tabIconDefault + '20'
                  : colors.tint + '20',
            },
          ]}
        >
          <Ionicons
            size={20}
            name="refresh"
            color={displayScale === 1 ? colors.tabIconDefault : colors.tint}
          />
        </TouchableOpacity>
      </View>

      {/* Image container with gesture support */}
      <GestureDetector gesture={composed}>
        <View
          style={[
            styles.imageContainer,
            {
              width: containerWidth,
              height: containerHeight,
              backgroundColor: colors.tabIconDefault + '10',
            },
          ]}
        >
          {imageLoading && (
            <View style={styles.loadingOverlay}>
              <MaterialIcons size={48} name="image" color={colors.tabIconDefault} />
              <ThemedText style={styles.loadingText}>
                Loading floor plan...
              </ThemedText>
            </View>
          )}

          <Animated.View style={[styles.imageWrapper, animatedStyle]}>
            <Image
              source={{ uri: imageUrl }}
              style={[
                styles.image,
                {
                  width: imageWidth,
                  height: imageHeight,
                },
              ]}
              resizeMode="contain"
              onLoad={() => setImageLoading(false)}
              onError={() => setImageLoading(false)}
              progressiveRenderingEnabled={true}
            />
          </Animated.View>
        </View>
      </GestureDetector>

      {/* Info bar */}
      <View style={[styles.infoBar, { backgroundColor: colors.tabIconDefault + '10' }]}>
        <ThemedText style={styles.infoText}>
          {displayScale === 1
            ? 'Pinch to zoom • Drag to pan'
            : 'Drag to pan • Pinch to zoom more'}
        </ThemedText>
      </View>
    </View>
  );
};const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
    maxHeight: 480,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  zoomLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  resetButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loadingOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loadingText: {
    fontSize: 13,
    marginTop: 12,
    opacity: 0.6,
  },
  infoBar: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  infoText: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: 'center',
  },
});
