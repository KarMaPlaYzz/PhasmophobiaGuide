import React from 'react';
import { Platform, UIManager } from 'react-native';
import Animated, {
    FadeIn,
    FadeOut,
    Layout,
    ZoomIn,
    ZoomOut,
} from 'react-native-reanimated';

// Enable Layout animations on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface CollapsibleSectionAnimationProps {
  children: React.ReactNode;
  isVisible: boolean;
  animationType?: 'fade' | 'slide' | 'zoom';
}

/**
 * CollapsibleSectionAnimation - Smooth expand/collapse animations for collapsible sections
 * 
 * Features:
 * - Height-based transitions (not just opacity)
 * - Multiple animation types (fade, slide, zoom)
 * - Native layout animations for smooth performance
 * - Works with react-native-reanimated for consistency
 * 
 * Usage:
 * ```tsx
 * <CollapsibleSectionAnimation isVisible={isExpanded}>
 *   <Content />
 * </CollapsibleSectionAnimation>
 * ```
 */
export const CollapsibleSectionAnimation: React.FC<CollapsibleSectionAnimationProps> = ({
  children,
  isVisible,
  animationType = 'fade',
}) => {
  const getEnteringAnimation = () => {
    switch (animationType) {
      case 'slide':
        return FadeIn.duration(300);
      case 'zoom':
        return ZoomIn.duration(250);
      case 'fade':
      default:
        return FadeIn.duration(300);
    }
  };

  const getExitingAnimation = () => {
    switch (animationType) {
      case 'slide':
        return FadeOut.duration(200);
      case 'zoom':
        return ZoomOut.duration(200);
      case 'fade':
      default:
        return FadeOut.duration(200);
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Animated.View
      entering={getEnteringAnimation()}
      exiting={getExitingAnimation()}
      layout={Layout.springify()}
      style={{ overflow: 'hidden' }}
    >
      {children}
    </Animated.View>
  );
};
