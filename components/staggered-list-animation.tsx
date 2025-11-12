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
 * Optimization: Automatically reduces delay for large lists to prevent
 * animations from feeling sluggish on longer lists
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
  // Optimize delay for large lists: reduce delay multiplier for better performance
  // For lists > 15 items, use faster stagger (25ms) to avoid long animation sequences
  const optimizedDelayMultiplier = useMemo(() => {
    if (itemCount > 20) return 15; // Very fast stagger for long lists
    if (itemCount > 15) return 25; // Fast stagger for medium-large lists
    return delayMultiplier; // Normal stagger for small lists
  }, [itemCount, delayMultiplier]);

  // Calculate delay based on index
  const delay = useMemo(() => {
    return index * optimizedDelayMultiplier;
  }, [index, optimizedDelayMultiplier]);

  return (
    <Animated.View
      entering={FadeInDown.delay(delay)
        .damping(12)
        .springify()
        .duration(300)} // Reduced from 400ms for faster animations
      layout={Layout.springify()}
    >
      {children}
    </Animated.View>
  );
}
