import { Ionicons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView, TapGestureHandler } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AdBanner } from '@/components/ad-banner';
import { GhostComparisonSheet } from '@/components/ghost-comparison-sheet';
import { GhostDetailSheet } from '@/components/ghost-detail-sheet';
import { scrollRefRegistry } from '@/components/haptic-tab';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, DifficultyColors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useLocalization } from '@/hooks/use-localization';
import { usePremium } from '@/hooks/use-premium';
import { GHOST_LIST } from '@/lib/data/ghosts';
import { getActivityLabel, getDifficultyLabel, getGhostDescription, getGhostName, getSpeedLabel } from '@/lib/localization';
import { Ghost } from '@/lib/types';
import { getActivityIndicator, getMovementIndicator } from '@/lib/utils/colors';

export default function GhostsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors['dark'];
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const { language, t } = useLocalization();
  const { isPremium, checkPremiumStatus } = usePremium();
  
  const [searchText, setSearchText] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [selectedSpeed, setSelectedSpeed] = useState<string | null>(null);
  const [selectedGhost, setSelectedGhost] = useState<Ghost | null>(null);
  const [showComparisonSheet, setShowComparisonSheet] = useState(false);

  // Use callback ref to always have the latest ref
  const handleScrollRef = (ref: ScrollView | null) => {
    if (ref) {
      scrollRefRegistry.set(route.name, ref as any);
    }
  };

  const difficulties = ['All', 'beginner', 'intermediate', 'advanced', 'expert'];

  const filteredGhosts = useMemo(() => {
    const difficultyOrder: Record<string, number> = { 
      'beginner': 0, 
      'intermediate': 1, 
      'advanced': 2, 
      'expert': 3 
    };

    let filtered = GHOST_LIST.filter((ghost) => {
      const matchesSearch = ghost.name.toLowerCase().includes(searchText.toLowerCase());
      const matchesDifficulty = selectedDifficulty === 'All' || ghost.difficulty.toLowerCase() === selectedDifficulty;
      const matchesActivity = !selectedActivity || ghost.activityLevel === selectedActivity;
      const matchesSpeed = !selectedSpeed || ghost.movementSpeed === selectedSpeed;
      return matchesSearch && matchesDifficulty && matchesActivity && matchesSpeed;
    });

    // Sort by difficulty
    filtered.sort((a, b) => {
      const orderA = difficultyOrder[a.difficulty.toLowerCase()] ?? 999;
      const orderB = difficultyOrder[b.difficulty.toLowerCase()] ?? 999;
      return orderA - orderB;
    });

    return filtered;
  }, [searchText, selectedDifficulty, selectedActivity, selectedSpeed]);

  const getDifficultyColor = (difficulty: string) => {
    if (difficulty === 'All') return colors.spectral;
    // Convert to title case for DifficultyColors lookup
    const titleCase = difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase();
    return DifficultyColors[titleCase as keyof typeof DifficultyColors] || colors.text;
  };

  const getDifficultyIcon = (difficulty: string): string => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'star';
      case 'intermediate':
        return 'star-half';
      case 'advanced':
        return 'flame';
      case 'expert':
        return 'flash';
      default:
        return 'grid';
    }
  };

  // Map evidence names to translation keys
  const getEvidenceDisplayName = (evidenceName: string): string => {
    const evidenceKeyMap: Record<string, string> = {
      'EMF Level 5': t('tabs.evidence_emfLevel5'),
      'D.O.T.S. Projector': t('tabs.evidence_dots'),
      'Ultraviolet': t('tabs.evidence_ultraviolet'),
      'Ghost Orb': t('tabs.evidence_ghostOrb'),
      'Ghost Writing': t('tabs.evidence_ghostWriting'),
      'Spirit Box': t('tabs.evidence_spiritBox'),
      'Freezing Temperatures': t('tabs.evidence_freezingTemperatures'),
    };
    return evidenceKeyMap[evidenceName] || evidenceName;
  };

  const getSanityDrainLevel = (activityLevel: string): { label: string; icon: string; color: string } => {
    const indicator = getActivityIndicator(activityLevel);
    return { label: activityLevel, icon: indicator.icon, color: indicator.color };
  };

  const handleGhostPress = useCallback((ghost: Ghost) => {
    console.log('🎮 Ghost card tapped:', ghost.name);
    setSelectedGhost(ghost);
  }, []);

  const handleBottomSheetClose = useCallback(() => {
    console.log('🔚 Bottom sheet closed');
    setSelectedGhost(null);
  }, []);

  // Handle incoming route params to open ghost detail sheet
  useFocusEffect(
    useCallback(() => {
      const params = route.params as any;
      if (params?.selectedGhostName) {
        const ghost = GHOST_LIST.find(g => g.name === params.selectedGhostName);
        if (ghost) {
          console.log('📋 Opening ghost sheet from evidence:', ghost.name);
          setSelectedGhost(ghost);
        }
      }
    }, [route.params])
  );

  // Ensure premium status is fresh when this screen focuses so premium-only UI appears immediately
  useFocusEffect(
    useCallback(() => {
      void checkPremiumStatus();
    }, [checkPremiumStatus])
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        <ScrollView 
          ref={handleScrollRef}
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          nestedScrollEnabled
        >
          <View style={[styles.searchContainer, { borderColor: colors.border, backgroundColor: colors.surface }]}>
            <MaterialIcons size={20} name="search" color={colors.spectral} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder={t('tabs.ghosts_searchPlaceholder')}
              placeholderTextColor={colors.tabIconDefault}
              value={searchText}
              onChangeText={setSearchText}
            />
            {searchText && (
              <TouchableOpacity onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setSearchText('');
              }}>
                <MaterialIcons size={20} name="cancel" color={colors.spectral} />
              </TouchableOpacity>
            )}
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={[styles.filterContainer]}
            contentContainerStyle={styles.filterContent}
          >
            {difficulties.map((diff) => {
              const count =
                diff === 'All'
                  ? GHOST_LIST.length
                  : GHOST_LIST.filter((g) => g.difficulty.toLowerCase() === diff).length;
              const diffColor = getDifficultyColor(diff);
              return (
                <TouchableOpacity
                  key={diff}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSelectedDifficulty(diff);
                  }}
                  style={[
                    styles.filterButton,
                    {
                      backgroundColor:
                        selectedDifficulty === diff
                          ? diffColor + '25'
                          : colors.tabIconDefault + '10',
                      borderWidth: selectedDifficulty === diff ? 2 : 1,
                      borderColor: selectedDifficulty === diff ? diffColor : colors.tabIconDefault + '20',
                    },
                  ]}
                >
                  <Ionicons
                    size={12}
                    name={getDifficultyIcon(diff) as any}
                    color={selectedDifficulty === diff ? diffColor : colors.tabIconDefault}
                  />
                  <ThemedText
                    style={{
                      color: selectedDifficulty === diff ? diffColor : colors.tabIconDefault,
                      fontSize: 11,
                      fontWeight: selectedDifficulty === diff ? '700' : '500',
                      marginLeft: 4,
                    }}
                  >
                    {diff === 'All' ? t('componentLabels.filterAll') : getDifficultyLabel(diff, language)}
                  </ThemedText>
                  <View
                    style={[
                      styles.filterCount,
                      {
                        backgroundColor: selectedDifficulty === diff ? diffColor + '30' : colors.tabIconDefault + '15',
                      },
                    ]}
                  >
                    <ThemedText
                      style={{
                        color: selectedDifficulty === diff ? diffColor : colors.tabIconDefault,
                        fontSize: 10,
                        fontWeight: 'bold',
                      }}
                    >
                      {count}
                    </ThemedText>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Activity Level Filter - Premium Only */}
          {isPremium && (
            <View style={styles.filterSection}>
              <ThemedText style={styles.filterLabel}>Activity Level</ThemedText>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={[styles.filterContainer]}
                contentContainerStyle={styles.filterContent}
              >
                {['Very High', 'High', 'Medium', 'Low'].map((activity) => {
                  const count = GHOST_LIST.filter((g) => g.activityLevel === activity).length;
                  return (
                    <TouchableOpacity
                      key={activity}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setSelectedActivity(selectedActivity === activity ? null : activity);
                      }}
                      style={[
                        styles.filterButton,
                        {
                          backgroundColor:
                            selectedActivity === activity
                              ? colors.warning + '25'
                              : colors.tabIconDefault + '10',
                          borderWidth: selectedActivity === activity ? 2 : 1,
                          borderColor: selectedActivity === activity ? colors.warning : colors.border,
                        },
                      ]}
                    >
                      <Ionicons
                        size={12}
                        name="pulse"
                        color={selectedActivity === activity ? colors.warning : colors.text}
                      />
                      <ThemedText
                        style={{
                          color: selectedActivity === activity ? colors.warning : colors.text,
                          fontSize: 11,
                          fontWeight: selectedActivity === activity ? '700' : '500',
                          marginLeft: 4,
                        }}
                      >
                        {activity}
                      </ThemedText>
                      <View
                        style={[
                          styles.filterCount,
                          {
                            backgroundColor: (selectedActivity === activity ? colors.warning : colors.text) + '30',
                          },
                        ]}
                      >
                        <ThemedText
                          style={{
                            color: selectedActivity === activity ? colors.warning : colors.text,
                            fontSize: 10,
                            fontWeight: 'bold',
                          }}
                        >
                          {count}
                        </ThemedText>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}

          {/* Movement Speed Filter - Premium Only */}
          {isPremium && (
            <View style={styles.filterSection}>
              <ThemedText style={styles.filterLabel}>Movement Speed</ThemedText>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={[styles.filterContainer]}
                contentContainerStyle={styles.filterContent}
              >
                {['Slow', 'Normal', 'Fast', 'Variable'].map((speed) => {
                  const count = GHOST_LIST.filter((g) => g.movementSpeed === speed).length;
                  return (
                    <TouchableOpacity
                      key={speed}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setSelectedSpeed(selectedSpeed === speed ? null : speed);
                      }}
                      style={[
                        styles.filterButton,
                        {
                          backgroundColor:
                            selectedSpeed === speed
                              ? colors.paranormal + '25'
                              : colors.tabIconDefault + '10',
                          borderWidth: selectedSpeed === speed ? 2 : 1,
                          borderColor: selectedSpeed === speed ? colors.paranormal : colors.border,
                        },
                    ]}
                  >
                    <Ionicons
                      size={12}
                      name="flash"
                      color={selectedSpeed === speed ? colors.paranormal : colors.text}
                    />
                    <ThemedText
                      style={{
                        color: selectedSpeed === speed ? colors.paranormal : colors.text,
                        fontSize: 11,
                        fontWeight: selectedSpeed === speed ? '700' : '500',
                        marginLeft: 4,
                      }}
                    >
                      {speed}
                    </ThemedText>
                    <View
                      style={[
                        styles.filterCount,
                        {
                          backgroundColor: (selectedSpeed === speed ? colors.paranormal : colors.text) + '30',
                        },
                      ]}
                    >
                      <ThemedText
                        style={{
                          color: selectedSpeed === speed ? colors.paranormal : colors.text,
                          fontSize: 10,
                          fontWeight: 'bold',
                        }}
                      >
                        {count}
                      </ThemedText>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            </View>
          )}

          <ThemedText style={styles.resultCounter}>
            {filteredGhosts.length} {filteredGhosts.length === 1 ? t('tabs.ghosts_resultSingular') : t('tabs.ghosts_resultPlural')}
          </ThemedText>

          {filteredGhosts.length > 0 ? (
            filteredGhosts.map((ghost, index) => (
              <React.Fragment key={ghost.id}>
                {/* Show ad in the middle of the list */}
                {index === Math.floor(filteredGhosts.length / 2) && (
                  <View style={styles.adContainer}>
                    <AdBanner />
                  </View>
                )}
                <TapGestureHandler
                  onActivated={() => handleGhostPress(ghost)}
                  maxDurationMs={500}
                >
                  <TouchableOpacity
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                      handleGhostPress(ghost);
                    }}
                    activeOpacity={0.6}
                    delayPressIn={0}
                  >
                    <View
                      style={[
                        styles.ghostCard,
                        { 
                          borderLeftWidth: 4,
                          borderLeftColor: getDifficultyColor(ghost.difficulty),
                          backgroundColor: getDifficultyColor(ghost.difficulty) + '10',
                          borderColor: getDifficultyColor(ghost.difficulty) + '30',
                        },
                      ]}
                    >
                    <View style={styles.ghostHeader}>
                      <View style={{ flex: 1 }}>
                        <ThemedText type="defaultSemiBold" style={styles.ghostName}>
                          {getGhostName(ghost.id, language)}
                        </ThemedText>
                      </View>
                      <View
                        style={[
                          styles.difficultyBadge,
                          {
                            backgroundColor: getDifficultyColor(ghost.difficulty) + '20',
                            borderColor: getDifficultyColor(ghost.difficulty),
                            borderWidth: 1,
                          },
                        ]}
                      >
                        <Ionicons
                          size={12}
                          name={getDifficultyIcon(ghost.difficulty) as any}
                          color={getDifficultyColor(ghost.difficulty)}
                        />
                        <ThemedText style={[styles.difficultyText, { color: getDifficultyColor(ghost.difficulty) }]}>
                          {getDifficultyLabel(ghost.difficulty, language)}
                        </ThemedText>
                      </View>
                    </View>

                    {ghost.description && (
                      <ThemedText style={styles.ghostDescription}>{getGhostDescription(ghost.id, language)}</ThemedText>
                    )}

                    <View style={styles.ghostStats}>
                      <View style={styles.statItem}>
                        <ThemedText style={styles.statLabel}>{t('tabs.ghosts_speed')}</ThemedText>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                          <Ionicons 
                            name={getMovementIndicator(ghost.movementSpeed).icon as any} 
                            size={14} 
                            color={getMovementIndicator(ghost.movementSpeed).color} 
                          />
                          <ThemedText style={[styles.statValue, { color: getMovementIndicator(ghost.movementSpeed).color }]}>
                            {getSpeedLabel(ghost.movementSpeed, language)}
                          </ThemedText>
                        </View>
                      </View>
                      <View style={styles.statItem}>
                        <ThemedText style={styles.statLabel}>{t('tabs.ghosts_hunt')}</ThemedText>
                        <ThemedText style={styles.statValue}>{ghost.huntSanityThreshold}%</ThemedText>
                      </View>
                    </View>

                    {/* Sanity Drain Indicator */}
                    {ghost.activityLevel && (
                      <View style={[styles.sanityDrainContainer, { backgroundColor: getSanityDrainLevel(ghost.activityLevel).color + '15', borderColor: getSanityDrainLevel(ghost.activityLevel).color }]}>
                        <Ionicons name={getSanityDrainLevel(ghost.activityLevel).icon as any} size={15} color={getSanityDrainLevel(ghost.activityLevel).color} />
                        <ThemedText style={[styles.sanityDrainText, { color: getSanityDrainLevel(ghost.activityLevel).color }]}>
                          {t('tabs.ghosts_sanityDrain')} {getActivityLabel(ghost.activityLevel, language)}
                        </ThemedText>
                      </View>
                    )}

                    {ghost.evidence && ghost.evidence.length > 0 && (
                      <View style={styles.evidenceContainer}>
                        <ThemedText style={styles.evidenceLabel}>{t('tabs.ghosts_evidence')}</ThemedText>
                        <View style={styles.evidenceBadges}>
                          {ghost.evidence.map((ev) => (
                            <View key={ev} style={[styles.evidenceBadge, { backgroundColor: colors.tint + '25' }]}>
                              <ThemedText style={styles.evidenceText}>{getEvidenceDisplayName(ev)}</ThemedText>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}

                    <ThemedText style={styles.tapTip}>{t('tabs.ghosts_tapToViewDetails')}</ThemedText>
                  </View>
                </TouchableOpacity>
              </TapGestureHandler>
              </React.Fragment>
            ))
          ) : (
            <ThemedText style={styles.noResults}>{t('tabs.ghosts_noResults')}</ThemedText>
          )}

          {/* Ad at the bottom of the list */}
          {filteredGhosts.length > 0 && (
            <View style={styles.adContainer}>
              <AdBanner />
            </View>
          )}
        </ScrollView>
      </ThemedView>

      <GhostDetailSheet
        ghost={selectedGhost}
        isVisible={selectedGhost !== null}
        onClose={handleBottomSheetClose}
      />

      <GhostComparisonSheet
        isVisible={showComparisonSheet}
        onClose={() => setShowComparisonSheet(false)}
      />

      {/* Comparison FAB - Glassmorphism Design with BlurView */}
      {selectedGhost === null && !showComparisonSheet && (
        <BlurView intensity={15} style={[
          styles.fab,
          { 
            bottom: insets.bottom + 20,
            right: 20,
            borderWidth: 1.5,
            borderColor: colors.spectral + '50',
            overflow: 'hidden',
          },
        ]}>
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              setShowComparisonSheet(true);
            }}
            activeOpacity={0.7}
            style={styles.fabContent}
          >
            <MaterialIcons name="compare-arrows" size={28} color={colors.spectral} />
          </TouchableOpacity>
        </BlurView>
      )}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingVertical: 16, paddingHorizontal: 16 },
  headerTitle: { fontSize: 28, fontWeight: 'bold' },
  content: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  adContainer: { marginVertical: 12, marginHorizontal: -16 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    marginBottom: 16,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: { flex: 1, fontSize: 15, paddingVertical: 4 },
  filterContainer: { height: 52, flex: 0, marginBottom: 12 },
  filterContent: { paddingVertical: 6, gap: 10, flexGrow: 0, flexShrink: 0 },
  filterButton: {
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minHeight: 46,
  },
  filterCount: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 24,
  },
  filterSection: {
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 2,
    marginBottom: 8,
    opacity: 0.7,
  },
  resultCounter: { fontSize: 13, opacity: 0.6, marginBottom: 12, marginLeft: 2, fontWeight: '500' },
  ghostCard: {
    borderWidth: 0,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    minHeight: 110,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  ghostHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 10 },
  ghostName: { fontSize: 16, fontWeight: '700', flex: 1 },
  difficultyBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6, flexDirection: 'row', alignItems: 'center', gap: 4 },
  difficultyText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  ghostDescription: { fontSize: 13, marginBottom: 10, lineHeight: 18, display: 'none' },
  ghostStats: { flexDirection: 'row', gap: 12, marginBottom: 10 },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 5, flex: 1 },
  statLabel: { fontSize: 13, opacity: 0.65, fontWeight: '500' },
  statValue: { fontSize: 13, fontWeight: '700' },
  evidenceContainer: { marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.08)' },
  evidenceLabel: { fontSize: 13, opacity: 0.65, marginBottom: 8, fontWeight: '500' },
  evidenceBadges: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  evidenceBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  evidenceText: { fontSize: 12, fontWeight: '600' },
  sanityDrainContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10, borderWidth: 1, marginVertical: 10 },
  sanityDrainText: { fontSize: 13, fontWeight: '600' },
  noResults: { textAlign: 'center', marginTop: 32, fontSize: 15, opacity: 0.5 },
  tapTip: { fontSize: 12, opacity: 0.5, marginTop: 10, fontStyle: 'italic', fontWeight: '400' },
  fab: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00D9FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 5,
    overflow: 'hidden',
  },
  fabContent: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
