import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';
import Animated, {
    BounceInLeft
} from 'react-native-reanimated';

interface EvidenceCollectionAnimationProps {
  children: React.ReactNode;
  isCollected: boolean;
  delay?: number;
}

/**
 * EvidenceCollectionAnimation - Animated feedback when collecting evidence
 * 
 * Features:
 * - Bounce entrance animation ONLY on initial collection
 * - No animation on toggling or state changes after collection
 * - Staggered animations with configurable delays
 * - Clean visual feedback for first-time collection
 */
export const EvidenceCollectionAnimation: React.FC<EvidenceCollectionAnimationProps> = ({
  children,
  isCollected,
  delay = 0,
}) => {
  const hasPlayedRef = useRef(false);
  const wasCollectedRef = useRef(isCollected);

  // Only animate on the transition from not-collected to collected
  useEffect(() => {
    if (isCollected && !wasCollectedRef.current) {
      hasPlayedRef.current = true;
    }
    wasCollectedRef.current = isCollected;
  }, [isCollected]);

  // Show animation wrapper only if:
  // 1. Evidence is currently collected AND
  // 2. This is the first time we're seeing it collected
  const shouldShowAnimation = isCollected && hasPlayedRef.current;

  if (!shouldShowAnimation) {
    return <View>{children}</View>;
  }

  return (
    <Animated.View
      entering={BounceInLeft.springify().delay(delay)}
      style={{ overflow: 'hidden' }}
    >
      {children}
    </Animated.View>
  );
};

