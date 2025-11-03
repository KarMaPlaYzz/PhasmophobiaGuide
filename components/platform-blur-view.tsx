import { Colors } from '@/constants/theme';
import { BlurView } from 'expo-blur';
import React from 'react';
import { Platform, StyleSheet, View, ViewStyle } from 'react-native';

interface PlatformBlurViewProps {
  /**
   * Blur intensity (0-100)
   * Only used on iOS
   */
  intensity?: number;
  
  /**
   * Tint color for blur effect
   * Only used on iOS
   * Options: 'light', 'dark'
   */
  tint?: 'light' | 'dark';
  
  /**
   * Style to apply (can be single style or array of styles)
   */
  style?: ViewStyle | ViewStyle[];
  
  /**
   * Children components
   */
  children?: React.ReactNode;
}

/**
 * PlatformBlurView Component
 * 
 * Handles blur effects with platform-specific logic:
 * - iOS: Uses expo-blur for true blur effect
 * - Android: Uses dark semi-transparent overlay instead (BlurView not supported)
 * 
 * This ensures consistent visual appearance across both platforms
 */
export const PlatformBlurView: React.FC<PlatformBlurViewProps> = ({
  intensity = 90,
  tint = 'dark',
  style,
  children,
}) => {
  const colors = Colors['dark'];
  
  // Android doesn't support blur effects well, use semi-transparent dark overlay
  if (Platform.OS === 'android') {
    // Calculate opacity based on intensity (0-100 maps to 0-0.9)
    const opacity = (intensity / 100) * 0.9;
    
    return (
      <View
        style={[
          StyleSheet.absoluteFillObject,
          {
            backgroundColor: `rgba(0, 0, 0, ${opacity})`,
          },
          style,
        ]}
      >
        {children}
      </View>
    );
  }
  
  // iOS uses true blur effect
  return (
    <BlurView intensity={intensity} tint={tint} style={[StyleSheet.absoluteFillObject, style]}>
      {children}
    </BlurView>
  );
};

export default PlatformBlurView;
