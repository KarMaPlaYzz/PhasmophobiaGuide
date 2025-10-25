import React, { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';

import { AnimatedCollapsibleHeader } from '@/components/animated-collapsible-header';
import { Colors } from '@/constants/theme';

interface CollapsibleSectionProps {
  title: string;
  isExpanded: boolean;
  onPress: () => void;
  children: ReactNode;
  backgroundColor?: string;
  borderColor?: string;
  headerBackgroundColor?: string;
  titleColor?: string;
  iconColor?: string;
}

export const CollapsibleSection = ({
  title,
  isExpanded,
  onPress,
  children,
  backgroundColor,
  borderColor,
  headerBackgroundColor,
  titleColor,
  iconColor,
}: CollapsibleSectionProps) => {
  const colors = Colors['dark'];
  
  const bgColor = backgroundColor || colors.spectral + '08';
  const borderCol = borderColor || colors.spectral + '20';
  const headerBg = headerBackgroundColor || colors.spectral + '12';
  const titleCol = titleColor || colors.spectral;
  const iconCol = iconColor || colors.spectral;

  return (
    <View style={[styles.container, { backgroundColor: bgColor, borderColor: borderCol }]}>
      <AnimatedCollapsibleHeader
        title={title}
        isExpanded={isExpanded}
        onPress={onPress}
        backgroundColor={headerBg}
        titleColor={titleCol}
        iconColor={iconCol}
        icon="chevron-forward"
      />
      {isExpanded && (
        <Animated.View entering={FadeInDown.springify()} exiting={FadeOutUp.springify()} style={styles.content}>
          {children}
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 14,
  },
  content: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },
});
