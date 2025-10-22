import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import * as Haptics from 'expo-haptics';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useLocalization } from '@/hooks/use-localization';
import { PLAYSTYLE_PROFILES } from '@/lib/data/equipment-optimizer';
import { GHOSTS } from '@/lib/data/ghosts';
import { Playstyle } from '@/lib/types';
import { generateOptimalLoadout } from '@/lib/utils/equipment-optimizer';

interface EquipmentOptimizerSheetProps {
  isVisible: boolean;
  onClose: () => void;
}

// Helper function to format equipment names from kebab-case to Title Case
const formatEquipmentName = (name: string): string => {
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const EquipmentOptimizerSheet = ({ isVisible, onClose }: EquipmentOptimizerSheetProps) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { t } = useLocalization();
  const snapPoints = useMemo(() => ['80%', '100%'], []);

  // Filter state
  const [budget, setBudget] = useState(500);
  const [selectedPlaystyle, setSelectedPlaystyle] = useState<Playstyle>('balanced');
  const [selectedGhost, setSelectedGhost] = useState<string | undefined>(undefined);
  const [selectedMapSize, setSelectedMapSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'>('Beginner');

  // Generate recommendation
  const recommendation = useMemo(() => {
    return generateOptimalLoadout(budget, selectedPlaystyle, selectedGhost, selectedMapSize, selectedDifficulty);
  }, [budget, selectedPlaystyle, selectedGhost, selectedMapSize, selectedDifficulty]);

  const allGhosts = Object.values(GHOSTS);
  const playstyles = Object.values(PLAYSTYLE_PROFILES);

  return (
    <BottomSheet
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      onClose={onClose}
      index={isVisible ? 0 : -1}
      animateOnMount={true}
      backgroundStyle={{ backgroundColor: colors.surface }}
      handleIndicatorStyle={{ backgroundColor: colors.spectral }}
    >
      <BottomSheetScrollView
        style={{ flex: 1, paddingHorizontal: 16 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 32 }}
      >
        {/* Header */}
        <View style={styles.headerSection}>
          <ThemedText style={styles.mainTitle} numberOfLines={1}>Loadout Builder</ThemedText>
          <ThemedText style={styles.subtitle}>Get optimal equipment recommendations</ThemedText>
        </View>

        {/* Primary Filters - Horizontal */}
        <View style={styles.primaryFiltersContainer}>
          {/* Budget Selector */}
          <View style={styles.primaryFilter}>
            <ThemedText style={styles.filterLabel}>{t('componentLabels.budget')}</ThemedText>
            <View style={[styles.budgetDisplay, { backgroundColor: colors.spectral + '20' }]}>
              <ThemedText style={styles.budgetValue}>${budget}</ThemedText>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.budgetButtonsContainer}
            >
              {[250, 500, 800, 1200, 2000].map(preset => (
                <TouchableOpacity
                  key={preset}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setBudget(preset);
                  }}
                  style={[
                    styles.budgetButton,
                    {
                      backgroundColor: budget === preset ? colors.spectral : colors.tabIconDefault + '15',
                    },
                  ]}
                >
                  <ThemedText
                    style={[
                      styles.budgetButtonText,
                      { color: budget === preset ? 'white' : colors.text },
                    ]}
                  >
                    {preset === 250 ? 'Min' : preset === 2000 ? 'Max' : `$${preset}`}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Playstyle Selector */}
          <View style={styles.primaryFilter}>
            <ThemedText style={styles.filterLabel}>Playstyle</ThemedText>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.playstyleContainer}
            >
              {playstyles.map(playstyle => (
                <TouchableOpacity
                  key={playstyle.id}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSelectedPlaystyle(playstyle.id as Playstyle);
                  }}
                  style={[
                    styles.playstyleButton,
                    {
                      backgroundColor: selectedPlaystyle === playstyle.id ? colors.spectral : colors.tabIconDefault + '08',
                      borderColor: selectedPlaystyle === playstyle.id ? colors.spectral : colors.border,
                      borderWidth: 2,
                    },
                  ]}
                >
                  <ThemedText style={styles.playstyleEmoji}>{playstyle.emoji}</ThemedText>
                  <ThemedText
                    style={[
                      styles.playstyleLabel,
                      { color: selectedPlaystyle === playstyle.id ? 'white' : colors.text },
                    ]}
                  >
                    {playstyle.name}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Secondary Filters - Grid */}
        <View style={styles.secondaryFiltersContainer}>
          {/* Ghost Selection */}
          <View style={styles.secondaryFilterSection}>
            <ThemedText style={styles.filterLabel}>Target Ghost</ThemedText>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.ghostButtonsContainer}
            >
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelectedGhost(undefined);
                }}
                style={[
                  styles.ghostButton,
                  {
                    backgroundColor: !selectedGhost ? colors.spectral : colors.tabIconDefault + '15',
                  },
                ]}
              >
                <ThemedText
                  style={[
                    styles.ghostButtonLabel,
                    { color: !selectedGhost ? 'white' : colors.text },
                  ]}
                >
                  All
                </ThemedText>
              </TouchableOpacity>

              {allGhosts.slice(0, 12).map(ghost => (
                <TouchableOpacity
                  key={ghost.id}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSelectedGhost(ghost.id);
                  }}
                  style={[
                    styles.ghostButton,
                    {
                      backgroundColor: selectedGhost === ghost.id ? colors.spectral : colors.tabIconDefault + '15',
                    },
                  ]}
                >
                  <ThemedText
                    style={[
                      styles.ghostButtonLabel,
                      { color: selectedGhost === ghost.id ? 'white' : colors.text },
                    ]}
                  >
                    {ghost.name.split(' ')[0]}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Map Size & Difficulty */}
          <View style={styles.bottomFiltersRow}>
            <View style={styles.bottomFilterItem}>
              <ThemedText style={styles.filterLabel}>Map Size</ThemedText>
              <View style={styles.mapSizeButtons}>
                {(['small', 'medium', 'large'] as const).map(size => (
                  <TouchableOpacity
                    key={size}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setSelectedMapSize(size);
                    }}
                    style={[
                      styles.sizeButton,
                      {
                        backgroundColor: selectedMapSize === size ? colors.spectral : colors.tabIconDefault + '15',
                      },
                    ]}
                  >
                    <ThemedText
                      style={[
                        styles.sizeButtonText,
                        { color: selectedMapSize === size ? 'white' : colors.text },
                      ]}
                    >
                      {size === 'small' ? 'S' : size === 'medium' ? 'M' : 'L'}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.bottomFilterItem}>
              <ThemedText style={styles.filterLabel}>Difficulty</ThemedText>
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  const difficulties: ('Beginner' | 'Intermediate' | 'Advanced' | 'Expert')[] = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
                  const currentIndex = difficulties.indexOf(selectedDifficulty);
                  setSelectedDifficulty(difficulties[(currentIndex + 1) % difficulties.length]);
                }}
                style={[styles.difficultyButton, { backgroundColor: colors.spectral + '15' }]}
              >
                <ThemedText style={styles.difficultyLabel}>{selectedDifficulty}</ThemedText>
                <MaterialIcons name="arrow-forward" size={14} color={colors.spectral} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Divider */}
        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        {/* Recommendation Card */}
        {recommendation && (
          <View style={styles.recommendationSection}>
            {/* Stats Header */}
            <View style={[styles.statsHeader, { backgroundColor: colors.spectral + '08', borderColor: colors.spectral + '20' }]}>
              <View style={styles.statItem}>
                <ThemedText style={styles.statLabel}>Efficiency</ThemedText>
                <ThemedText style={styles.statValue}>{recommendation.efficiency}%</ThemedText>
              </View>
              <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
              <View style={styles.statItem}>
                <ThemedText style={styles.statLabel}>{t('componentLabels.cost')}</ThemedText>
                <ThemedText style={styles.statValue}>${recommendation.totalCost}</ThemedText>
              </View>
              <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
              <View style={styles.statItem}>
                <ThemedText style={styles.statLabel}>{t('componentLabels.budgetLeft')}</ThemedText>
                <ThemedText style={styles.statValue}>${budget - recommendation.totalCost}</ThemedText>
              </View>
            </View>

            {/* Equipment Lists */}
            {recommendation.essential.length > 0 && (
              <View style={styles.equipmentListContainer}>
                <View style={styles.equipmentListHeader}>
                  <MaterialIcons name="check-circle" size={16} color={colors.spectral} />
                  <ThemedText style={styles.equipmentListTitle}>Essential ({recommendation.essential.length})</ThemedText>
                </View>
                {recommendation.essential.map((item, idx) => (
                  <View key={idx} style={styles.equipmentListItem}>
                    <View style={[styles.checkmark, { backgroundColor: colors.spectral + '20' }]}>
                      <MaterialIcons name="check" size={12} color={colors.spectral} />
                    </View>
                    <ThemedText style={styles.equipmentName}>{formatEquipmentName(item)}</ThemedText>
                  </View>
                ))}
              </View>
            )}

            {recommendation.recommended.length > 0 && (
              <View style={styles.equipmentListContainer}>
                <View style={styles.equipmentListHeader}>
                  <MaterialIcons name="star" size={16} color={colors.spectral} />
                  <ThemedText style={styles.equipmentListTitle}>Recommended ({recommendation.recommended.length})</ThemedText>
                </View>
                {recommendation.recommended.map((item, idx) => (
                  <View key={idx} style={styles.equipmentListItem}>
                    <View style={[styles.checkmark, { backgroundColor: colors.tabIconDefault + '15' }]}>
                      <MaterialIcons name="add" size={12} color={colors.tabIconDefault} />
                    </View>
                    <ThemedText style={styles.equipmentName}>{formatEquipmentName(item)}</ThemedText>
                  </View>
                ))}
              </View>
            )}

            {/* Info Section */}
            {recommendation.explanation.length > 0 && (
              <View style={[styles.infoBox, { backgroundColor: colors.spectral + '08', borderLeftColor: colors.spectral }]}>
                <View style={styles.infoBoxHeader}>
                  <MaterialIcons name="info" size={14} color={colors.spectral} />
                  <ThemedText style={styles.infoBoxTitle}>Why this loadout?</ThemedText>
                </View>
                {recommendation.explanation.slice(0, 2).map((reason, idx) => (
                  <ThemedText key={idx} style={styles.infoBoxText}>• {reason}</ThemedText>
                ))}
              </View>
            )}

            {/* Gaps */}
            {recommendation.gaps.length > 0 && (
              <View style={[styles.warningBox, { backgroundColor: '#FF6B6B15', borderLeftColor: '#FF6B6B' }]}>
                <View style={styles.infoBoxHeader}>
                  <MaterialIcons name="warning" size={14} color="#FF6B6B" />
                  <ThemedText style={[styles.infoBoxTitle, { color: '#FF6B6B' }]}>Gaps to Consider</ThemedText>
                </View>
                {recommendation.gaps.slice(0, 2).map((gap, idx) => (
                  <ThemedText key={idx} style={[styles.infoBoxText, { color: colors.text }]}>• {gap}</ThemedText>
                ))}
              </View>
            )}

            {/* Effectiveness */}
            {recommendation.ghostMatchup.length > 0 && (
              <View style={[styles.effectivenessBox, { backgroundColor: colors.spectral + '12' }]}>
                <View style={styles.effectivenessHeader}>
                  <ThemedText style={styles.effectivenessLabel}>Effectiveness</ThemedText>
                  <ThemedText style={styles.effectivenessValue}>{recommendation.ghostMatchup[0].effectiveness}%</ThemedText>
                </View>
                <View style={[styles.progressBar, { backgroundColor: colors.tabIconDefault + '20' }]}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${recommendation.ghostMatchup[0].effectiveness}%`,
                        backgroundColor: colors.spectral,
                      },
                    ]}
                  />
                </View>
                <ThemedText style={styles.effectivenessReason}>{recommendation.ghostMatchup[0].reason}</ThemedText>
              </View>
            )}
          </View>
        )}
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  // Header
  headerSection: { marginBottom: 24, gap: 4 },
  mainTitle: { fontSize: 26, fontWeight: '800', color: '#00D9FF', lineHeight: 32,},
  subtitle: { fontSize: 13, opacity: 0.6, fontWeight: '500' },

  // Primary Filters Container
  primaryFiltersContainer: { gap: 20, marginBottom: 20 },
  primaryFilter: { gap: 10 },
  filterLabel: { fontSize: 12, fontWeight: '700', opacity: 0.7, textTransform: 'uppercase', letterSpacing: 0.5 },

  // Budget
  budgetDisplay: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10, alignItems: 'center' },
  budgetValue: { fontSize: 18, fontWeight: '700', color: '#00D9FF' },
  budgetButtonsContainer: { gap: 8, paddingVertical: 4 },
  budgetButton: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, minWidth: 65 },
  budgetButtonText: { fontSize: 11, fontWeight: '600', textAlign: 'center' },

  // Playstyle
  playstyleContainer: { gap: 10, paddingVertical: 4 },
  playstyleButton: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 12, alignItems: 'center', gap: 6, minWidth: 80 },
  playstyleEmoji: { fontSize: 20 },
  playstyleLabel: { fontSize: 10, fontWeight: '600', textAlign: 'center' },

  // Secondary Filters Container
  secondaryFiltersContainer: { gap: 14, marginBottom: 20 },
  secondaryFilterSection: { gap: 8 },
  ghostButtonsContainer: { gap: 6, paddingVertical: 2 },
  ghostButton: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14, minWidth: 55 },
  ghostButtonLabel: { fontSize: 10, fontWeight: '600', textAlign: 'center' },

  // Bottom Filters Row
  bottomFiltersRow: { flexDirection: 'row', gap: 12 },
  bottomFilterItem: { flex: 1, gap: 8 },
  mapSizeButtons: { flexDirection: 'row', gap: 6 },
  sizeButton: { flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  sizeButtonText: { fontSize: 11, fontWeight: '700' },
  difficultyButton: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, gap: 8 },
  difficultyLabel: { fontSize: 11, fontWeight: '600' },

  // Divider
  divider: { height: 1, marginVertical: 18 },

  // Recommendation Section
  recommendationSection: { gap: 14 },

  // Stats Header
  statsHeader: { flexDirection: 'row', paddingVertical: 12, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'space-around' },
  statItem: { flex: 1, alignItems: 'center', gap: 3 },
  statLabel: { fontSize: 10, opacity: 0.6, fontWeight: '500' },
  statValue: { fontSize: 16, fontWeight: '700', color: '#00D9FF' },
  statDivider: { width: 1, height: 28 },

  // Equipment Lists
  equipmentListContainer: { gap: 8 },
  equipmentListHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 4 },
  equipmentListTitle: { fontSize: 12, fontWeight: '700', color: '#00D9FF' },
  equipmentListItem: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, paddingHorizontal: 10, backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: 8 },
  checkmark: { width: 24, height: 24, borderRadius: 6, justifyContent: 'center', alignItems: 'center' },
  equipmentName: { fontSize: 12, fontWeight: '500', flex: 1 },

  // Info Boxes
  infoBox: { paddingVertical: 12, paddingHorizontal: 12, borderRadius: 10, borderLeftWidth: 4, gap: 8 },
  warningBox: { paddingVertical: 12, paddingHorizontal: 12, borderRadius: 10, borderLeftWidth: 4, gap: 8 },
  infoBoxHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  infoBoxTitle: { fontSize: 12, fontWeight: '700' },
  infoBoxText: { fontSize: 11, opacity: 0.8, lineHeight: 15, paddingLeft: 4 },

  // Effectiveness
  effectivenessBox: { paddingVertical: 12, paddingHorizontal: 12, borderRadius: 10, gap: 8, borderWidth: 1, borderColor: 'rgba(0, 217, 255, 0.2)' },
  effectivenessHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  effectivenessLabel: { fontSize: 12, fontWeight: '700' },
  effectivenessValue: { fontSize: 16, fontWeight: '800', color: '#00D9FF' },
  progressBar: { height: 6, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%' },
  effectivenessReason: { fontSize: 11, opacity: 0.7 },
});
