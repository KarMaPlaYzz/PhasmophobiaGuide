import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import {
    Animated,
    Dimensions,
    Image,
    Modal,
    Pressable,
    SafeAreaView,
    StyleSheet,
    View,
} from 'react-native';
import { PanGestureHandler, PinchGestureHandler, State } from 'react-native-gesture-handler';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface ImageCarouselModalProps {
  isVisible: boolean;
  images: string[];
  initialIndex?: number;
  onClose: () => void;
  title?: string;
}

const { width, height } = Dimensions.get('window');

export const ImageCarouselModal = ({
  isVisible,
  images,
  initialIndex = 0,
  onClose,
  title,
}: ImageCarouselModalProps) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale] = useState(new Animated.Value(1));
  const [position] = useState(new Animated.ValueXY());

  if (images.length === 0) {
    return null;
  }

  const handlePrevious = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    resetZoom();
  };

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    resetZoom();
  };

  const handlePinch = ({ nativeEvent }: any) => {
    if (nativeEvent.state === State.ACTIVE) {
      Animated.spring(scale, {
        toValue: nativeEvent.scale,
        useNativeDriver: false,
      }).start();
    } else if (nativeEvent.state === State.END) {
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: false,
      }).start();
    }
  };

  const handlePan = ({ nativeEvent }: any) => {
    if (nativeEvent.state === State.ACTIVE) {
      position.x.setValue(nativeEvent.translationX);
      position.y.setValue(nativeEvent.translationY);
    } else if (nativeEvent.state === State.END) {
      if (Math.abs(nativeEvent.velocityX) > 500) {
        if (nativeEvent.velocityX > 0) {
          handlePrevious();
        } else {
          handleNext();
        }
      }
      Animated.spring(position, {
        toValue: { x: 0, y: 0 },
        useNativeDriver: false,
      }).start();
    }
  };

  const resetZoom = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: false,
    }).start();
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start();
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <View style={{ flex: 1 }}>
            <ThemedText style={styles.headerTitle}>{title || 'Image Gallery'}</ThemedText>
            <ThemedText style={styles.counter}>
              {currentIndex + 1} of {images.length}
            </ThemedText>
          </View>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.text} />
          </Pressable>
        </View>

        {/* Image Viewer */}
        <View style={styles.imageContainer}>
          <PanGestureHandler onHandlerStateChange={handlePan}>
            <PinchGestureHandler onHandlerStateChange={handlePinch}>
              <Animated.Image
                source={{ uri: images[currentIndex] }}
                style={[
                  styles.image,
                  {
                    transform: [
                      { scale },
                      { translateX: position.x },
                      { translateY: position.y },
                    ],
                  },
                ]}
                resizeMode="contain"
              />
            </PinchGestureHandler>
          </PanGestureHandler>
        </View>

        {/* Navigation Controls */}
        <View style={[styles.controls, { borderTopColor: colors.border }]}>
          <Pressable
            onPress={handlePrevious}
            style={[styles.navButton, { backgroundColor: colors.surface }]}
          >
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </Pressable>

          {/* Thumbnail Strip */}
          <View style={styles.thumbnailStrip}>
            {images.map((img, idx) => (
              <Pressable
                key={idx}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setCurrentIndex(idx);
                  resetZoom();
                }}
                style={[
                  styles.thumbnail,
                  {
                    borderColor: idx === currentIndex ? Colors.light.spectral : colors.border,
                    borderWidth: idx === currentIndex ? 2 : 1,
                    backgroundColor: colors.surface,
                  },
                ]}
              >
                <Image
                  source={{ uri: img }}
                  style={styles.thumbnailImage}
                  resizeMode="cover"
                />
              </Pressable>
            ))}
          </View>

          <Pressable
            onPress={handleNext}
            style={[styles.navButton, { backgroundColor: colors.surface }]}
          >
            <Ionicons name="chevron-forward" size={24} color={colors.text} />
          </Pressable>
        </View>

        {/* Gesture Hints */}
        <View style={styles.hintsContainer}>
          <ThemedText style={styles.hint}>
            🔍 Pinch to zoom • ← Swipe to navigate
          </ThemedText>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  counter: {
    fontSize: 12,
    opacity: 0.6,
  },
  closeButton: {
    padding: 8,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  image: {
    width: width - 32,
    height: height * 0.5,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailStrip: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 8,
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  hintsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
  },
  hint: {
    fontSize: 12,
    opacity: 0.5,
    textAlign: 'center',
  },
});
