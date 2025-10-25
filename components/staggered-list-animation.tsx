import React, { useMemo } from 'react';
import Animated, {
    FadeInDown,
    Layout
} from 'react-native-reanimated';

interface StaggeredListAnimationProps {
  children: React.ReactNode;
  index?: number;
  itemCount?: number;
  delayMultiplier?: number;
}

/**
 * Wraps list item with staggered entrance animation
 * Each item animates in with a sequential delay for a cascading effect
 * 
 * Usage: Wrap each list item with this component, pass the index and total count
 * Example:
 * {items.map((item, idx) => (
 *   <StaggeredListAnimation key={idx} index={idx} itemCount={items.length}>
 *     <ListItem />
 *   </StaggeredListAnimation>
 * ))}
 */
export function StaggeredListAnimation({
  children,
  index = 0,
  itemCount = 1,
  delayMultiplier = 50,
}: StaggeredListAnimationProps) {
  // Calculate delay based on index
  const delay = useMemo(() => {
    return index * delayMultiplier;
  }, [index, delayMultiplier]);

  return (
    <Animated.View
      entering={FadeInDown.delay(delay)
        .damping(12)
        .springify()
        .duration(400)}
      layout={Layout.springify()}
    >
      {children}
    </Animated.View>
  );
}
