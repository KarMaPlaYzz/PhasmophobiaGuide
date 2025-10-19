import { Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import React, { useMemo } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, DifficultyColors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ghost } from '@/lib/types';

interface GhostDetailSheetProps {
  ghost: Ghost | null;
  isVisible: boolean;
  onClose: () => void;
}

export const GhostDetailSheet = ({ ghost, isVisible, onClose }: GhostDetailSheetProps) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const snapPoints = useMemo(() => ['34%', '60%', '95%'], []);

  const getDifficultyColor = (difficulty: string) =>
    DifficultyColors[difficulty as keyof typeof DifficultyColors] || colors.text;

  console.log('GhostDetailSheet - isVisible:', isVisible, 'ghost:', ghost?.name, 'index:', isVisible ? 0 : -1);

  if (!ghost) return null;

  return (
    <BottomSheet
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      onClose={onClose}
      index={isVisible ? 0 : -1}
      animateOnMount={true}
      backgroundStyle={{ backgroundColor: colors.background }}
      handleIndicatorStyle={{ backgroundColor: colors.text }}
    >
      <BottomSheetScrollView
        style={{ flex: 1, paddingHorizontal: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Ghost Image */}
        {ghost.imageUrl ? (
          <View style={[styles.imageContainer, { backgroundColor: colors.tabIconDefault + '10' }]}>
            <Image
              source={{ uri: ghost.imageUrl }}
              style={styles.ghostImage}
              onError={(error) => console.log('Image load error:', error)}
            />
          </View>
        ) : null}

        <ThemedText style={styles.bottomSheetTitle}>{ghost.name}</ThemedText>
        <View
          style={[
            styles.difficultyBadgeLarge,
            { backgroundColor: getDifficultyColor(ghost.difficulty) },
          ]}
        >
          <ThemedText style={styles.difficultyTextLarge}>
            {ghost.difficulty} Difficulty
          </ThemedText>
        </View>

        <ThemedText style={styles.sectionTitle}>Description</ThemedText>
        <ThemedText style={styles.description}>{ghost.description}</ThemedText>

        <ThemedText style={styles.sectionTitle}>Evidence</ThemedText>
        <View style={styles.evidenceBadgesLarge}>
          {ghost.evidence.map((ev) => (
            <View key={ev} style={[styles.evidenceBadgeLarge, { backgroundColor: colors.tint + '20' }]}>
              <ThemedText style={styles.evidenceTextLarge}>{ev}</ThemedText>
            </View>
          ))}
        </View>

        <ThemedText style={styles.sectionTitle}>Abilities</ThemedText>
        {ghost.abilities.map((ability, idx) => (
          <View key={idx} style={styles.abilityItem}>
            <ThemedText style={styles.abilityName}>{ability.name}</ThemedText>
            <ThemedText style={styles.abilityDescription}>{ability.description}</ThemedText>
          </View>
        ))}

        <ThemedText style={styles.sectionTitle}>Strengths & Weaknesses</ThemedText>
        {ghost.strengths.map((strength, idx) => (
          <View key={`strength-${idx}`} style={[styles.strengthItem, { borderColor: colors.tint }]}>
            <Ionicons size={16} name="checkmark-circle" color={colors.tint} />
            <View style={{ flex: 1 }}>
              <ThemedText style={styles.strengthLabel}>{strength.description}</ThemedText>
              <ThemedText style={styles.strengthDetail}>{strength.mechanicalAdvantage}</ThemedText>
            </View>
          </View>
        ))}
        {ghost.weaknesses.map((weakness, idx) => (
          <View key={`weakness-${idx}`} style={[styles.weaknessItem, { borderColor: '#F44336' }]}>
            <Ionicons size={16} name="close-circle" color="#F44336" />
            <View style={{ flex: 1 }}>
              <ThemedText style={styles.weaknessLabel}>{weakness.description}</ThemedText>
              <ThemedText style={styles.weaknessDetail}>{weakness.counter}</ThemedText>
            </View>
          </View>
        ))}

        <ThemedText style={styles.sectionTitle}>Identification Tips</ThemedText>
        {ghost.identificationTips.map((tip, idx) => (
          <View key={idx} style={styles.tipItem}>
            <ThemedText style={styles.tipBullet}>•</ThemedText>
            <ThemedText style={styles.tipText}>{tip}</ThemedText>
          </View>
        ))}

        <View style={{ height: 20 }} />
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 16,
    marginBottom: 16,
  },
  ghostImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bottomSheetTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  difficultyBadgeLarge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, alignSelf: 'flex-start', marginBottom: 16 },
  difficultyTextLarge: { color: 'white', fontWeight: '600' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 16, marginBottom: 8 },
  description: { fontSize: 14, lineHeight: 20, marginBottom: 16 },
  evidenceBadgesLarge: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  evidenceBadgeLarge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  evidenceTextLarge: { fontSize: 12, fontWeight: '500' },
  abilityItem: { marginBottom: 12, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.1)' },
  abilityName: { fontWeight: '600', marginBottom: 4 },
  abilityDescription: { fontSize: 13, lineHeight: 18 },
  strengthItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10, gap: 8, paddingLeft: 8, borderLeftWidth: 3 },
  strengthLabel: { fontWeight: '600', marginBottom: 2 },
  strengthDetail: { fontSize: 12, opacity: 0.7 },
  weaknessItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10, gap: 8, paddingLeft: 8, borderLeftWidth: 3 },
  weaknessLabel: { fontWeight: '600', marginBottom: 2 },
  weaknessDetail: { fontSize: 12, opacity: 0.7 },
  tipItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 8 },
  tipBullet: { fontSize: 16, fontWeight: 'bold', marginTop: -2 },
  tipText: { flex: 1, fontSize: 13, lineHeight: 18 },
});
