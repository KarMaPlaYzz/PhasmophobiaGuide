import React, { useState } from 'react';
import { Pressable } from 'react-native';
import Animated, {
    Extrapolate,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    ZoomIn,
} from 'react-native-reanimated';

interface CardFlipAnimationProps {
  children: React.ReactNode;
  backContent?: React.ReactNode;
  isFlipped?: boolean;
  onFlip?: (isFlipped: boolean) => void;
}

/**
 * CardFlipAnimation - Smooth flip and reveal animations for cards
 * 
 * Features:
 * - 3D flip effect using perspective transforms
 * - Smooth rotation animations
 * - Optional back content reveal
 * - Tap to flip interaction
 * - Zoom entrance animation
 * 
 * Usage:
 * ```tsx
 * <CardFlipAnimation>
 *   <GhostCard ghost={ghost} />
 * </CardFlipAnimation>
 * ```
 */
export const CardFlipAnimation: React.FC<CardFlipAnimationProps> = ({
  children,
  backContent,
  isFlipped: controlledFlipped,
  onFlip,
}) => {
  const [uncontrolledFlipped, setUncontrolledFlipped] = useState(false);
  const isFlipped = controlledFlipped ?? uncontrolledFlipped;
  const rotationValue = useSharedValue(0);

  const handleFlip = () => {
    const newFlipped = !isFlipped;
    setUncontrolledFlipped(newFlipped);
    onFlip?.(newFlipped);

    rotationValue.value = withTiming(newFlipped ? 180 : 0, {
      duration: 600,
    });
  };

  React.useEffect(() => {
    rotationValue.value = withTiming(isFlipped ? 180 : 0, {
      duration: 600,
    });
  }, [controlledFlipped, rotationValue]);

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotation = interpolate(
      rotationValue.value,
      [0, 180],
      [0, 180],
      Extrapolate.CLAMP
    );

    return {
      transform: [
        {
          perspective: 1000,
        },
        {
          rotateY: `${rotation}deg`,
        },
      ],
      backfaceVisibility: 'hidden',
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotation = interpolate(
      rotationValue.value,
      [0, 180],
      [180, 360],
      Extrapolate.CLAMP
    );

    return {
      transform: [
        {
          perspective: 1000,
        },
        {
          rotateY: `${rotation}deg`,
        },
      ],
      backfaceVisibility: 'hidden',
      position: 'absolute',
      width: '100%',
      height: '100%',
    };
  });

  return (
    <Pressable
      onPress={backContent ? handleFlip : undefined}
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      <Animated.View
        entering={ZoomIn.springify()}
        style={frontAnimatedStyle}
      >
        {children}
      </Animated.View>

      {backContent && (
        <Animated.View style={backAnimatedStyle}>
          {backContent}
        </Animated.View>
      )}
    </Pressable>
  );
};
