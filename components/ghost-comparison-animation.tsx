import React from 'react';
import Animated, {
    Layout,
    ZoomIn,
    ZoomOut
} from 'react-native-reanimated';

interface GhostComparisonAnimationProps {
  children: React.ReactNode;
  key: string | number;
  delay?: number;
}

/**
 * GhostComparisonAnimation - Smooth transitions when comparing different ghosts
 * 
 * Features:
 * - Zoom out old content, zoom in new content
 * - Staggered animations for multiple comparison targets
 * - Layout animation for content reflow
 * - Smooth fade transitions
 * 
 * Usage:
 * ```tsx
 * <GhostComparisonAnimation key={ghost.id}>
 *   <GhostComparisonContent ghost={ghost} />
 * </GhostComparisonAnimation>
 * ```
 */
export const GhostComparisonAnimation: React.FC<GhostComparisonAnimationProps> = ({
  children,
  delay = 0,
}) => {
  return (
    <Animated.View
      entering={ZoomIn.springify().delay(delay)}
      exiting={ZoomOut.springify()}
      layout={Layout.springify()}
      style={{ overflow: 'hidden' }}
    >
      {children}
    </Animated.View>
  );
};
