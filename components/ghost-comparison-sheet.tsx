import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import * as Haptics from 'expo-haptics';
import React, { useMemo, useState } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, DifficultyColors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useLocalization } from '@/hooks/use-localization';
import { GHOST_LIST } from '@/lib/data/ghosts';
import { getGhostName } from '@/lib/localization';
import { Ghost } from '@/lib/types';
import BlurView from 'expo-blur/build/BlurView';

interface GhostComparisonSheetProps {
  isVisible: boolean;
  onClose: () => void;
  initialGhostIds?: string[];
}

interface ComparisonData {
  ghosts: Ghost[];
  commonEvidence: string[];
  uniqueEvidence: Map<string, string[]>;
  similarities: number;
}

export const GhostComparisonSheet = ({
  isVisible,
  onClose,
  initialGhostIds,
}: GhostComparisonSheetProps) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { language } = useLocalization();
  const snapPoints = useMemo(() => ['65%', '100%'], []);
  const screenWidth = Dimensions.get('window').width;

  const [selectedGhostIds, setSelectedGhostIds] = useState<string[]>(initialGhostIds || []);
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState<'basic' | 'abilities' | 'evidence' | 'equipment' | 'strategies'>('basic');

  const comparisonData = useMemo(() => {
    if (selectedGhostIds.length < 2) return null;

    const selectedGhosts = GHOST_LIST.filter((g) => selectedGhostIds.includes(g.id));
    const allEvidence = new Set<string>();
    const evidenceMap = new Map<string, number>();

    selectedGhosts.forEach((ghost) => {
      ghost.evidence.forEach((ev) => {
        allEvidence.add(ev);
        evidenceMap.set(ev, (evidenceMap.get(ev) || 0) + 1);
      });
    });

    const commonEvidence = Array.from(evidenceMap.entries())
      .filter(([_, count]) => count === selectedGhosts.length)
      .map(([ev]) => ev);

    const uniqueEvidence = new Map<string, string[]>();
    selectedGhosts.forEach((ghost) => {
      const unique = ghost.evidence.filter((ev) => !commonEvidence.includes(ev));
      if (unique.length > 0) {
        uniqueEvidence.set(ghost.id, unique);
      }
    });

    return {
      ghosts: selectedGhosts,
      commonEvidence,
      uniqueEvidence,
      similarities: calculateSimilarity(selectedGhosts),
    };
  }, [selectedGhostIds]);

  const filteredGhosts = useMemo(() => {
    const filtered = GHOST_LIST.filter((g) =>
      g.name.toLowerCase().includes(searchText.toLowerCase())
    );
    
    // Sort by difficulty category, then by name alphabetically
    const difficultyOrder: Record<string, number> = {
      'Beginner': 0,
      'Intermediate': 1,
      'Advanced': 2,
      'Expert': 3,
    };
    
    return filtered.sort((a, b) => {
      const diffA = difficultyOrder[a.difficulty] ?? 999;
      const diffB = difficultyOrder[b.difficulty] ?? 999;
      
      if (diffA !== diffB) {
        return diffA - diffB;
      }
      
      return a.name.localeCompare(b.name);
    });
  }, [searchText]);

  const getDifficultyColor = (difficulty: string) =>
    DifficultyColors[difficulty as keyof typeof DifficultyColors] || colors.text;

  const toggleGhostSelection = (ghostId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (selectedGhostIds.includes(ghostId)) {
      setSelectedGhostIds(selectedGhostIds.filter((id) => id !== ghostId));
    } else if (selectedGhostIds.length < 3) {
      setSelectedGhostIds([...selectedGhostIds, ghostId]);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  };

  const renderGhostCell = ({ item: ghost }: { item: Ghost }, columnIndex: number) => {
    const columnWidth = Math.floor(screenWidth / Math.max(selectedGhostIds.length, 2)) - 4;
    return (
      <View style={[styles.ghostColumn, { width: columnWidth }]}>
        <ThemedText style={[styles.ghostName, { color: getDifficultyColor(ghost.difficulty) }]}>
          {getGhostName(ghost.id, language)}
        </ThemedText>
        <View
          style={[
            styles.difficultyBadge,
            {
              backgroundColor: getDifficultyColor(ghost.difficulty) + '20',
              borderColor: getDifficultyColor(ghost.difficulty),
            },
          ]}
        >
          <ThemedText style={[styles.difficultyText, { color: getDifficultyColor(ghost.difficulty) }]}>
            {ghost.difficulty}
          </ThemedText>
        </View>
      </View>
    );
  };

  const renderBasicStats = () => (
    <View style={styles.tabContent}>
      <ScrollView
        horizontal
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalScroll}
      >
        {comparisonData?.ghosts.map((ghost, idx) => (
          <View key={ghost.id} style={[styles.statsColumn, { width: screenWidth * 0.4 }]}>
            <ThemedText style={styles.statsSectionTitle}>{getGhostName(ghost.id, language)}</ThemedText>

            <View style={styles.statRow}>
              <ThemedText style={styles.statLabel}>Difficulty</ThemedText>
              <ThemedText style={[styles.statValue, { color: getDifficultyColor(ghost.difficulty) }]}>
                {ghost.difficulty}
              </ThemedText>
            </View>

            <View style={styles.statRow}>
              <ThemedText style={styles.statLabel}>Hunt Sanity</ThemedText>
              <ThemedText style={styles.statValue}>{ghost.huntSanityThreshold}%</ThemedText>
            </View>

            <View style={styles.statRow}>
              <ThemedText style={styles.statLabel}>Activity</ThemedText>
              <ThemedText style={styles.statValue}>{ghost.activityLevel}</ThemedText>
            </View>

            {idx < (comparisonData?.ghosts.length || 0) - 1 && (
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );

  const renderEvidence = () => (
    <View style={styles.tabContent}>
      <ScrollView
        horizontal
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalScroll}
      >
        {comparisonData?.ghosts.map((ghost, idx) => (
          <View key={ghost.id} style={[styles.statsColumn, { width: screenWidth * 0.4 }]}>
            <ThemedText style={styles.statsSectionTitle}>{getGhostName(ghost.id, language)}</ThemedText>

            {ghost.evidence.map((ev) => {
              const isCommon = comparisonData?.commonEvidence.includes(ev);
              return (
                <View
                  key={ev}
                  style={[
                    styles.evidenceItem,
                    {
                      backgroundColor: isCommon ? colors.success + '20' : colors.tabIconDefault + '10',
                      borderColor: isCommon ? colors.success : colors.border,
                    },
                  ]}
                >
                  <MaterialIcons
                    name={isCommon ? 'check-circle' : 'radio-button-unchecked'}
                    size={14}
                    color={isCommon ? colors.success : colors.tabIconDefault}
                  />
                  <ThemedText style={styles.evidenceText}>{ev}</ThemedText>
                </View>
              );
            })}

            {idx < (comparisonData?.ghosts.length || 0) - 1 && (
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );

  const renderAbilities = () => (
    <View style={styles.tabContent}>
      <ScrollView
        horizontal
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalScroll}
      >
        {comparisonData?.ghosts.map((ghost, idx) => (
          <View key={ghost.id} style={[styles.statsColumn, { width: screenWidth * 0.4 }]}>
            <ThemedText style={styles.statsSectionTitle}>{getGhostName(ghost.id, language)}</ThemedText>

            {ghost.abilities.map((ability) => (
              <View key={ability.name} style={styles.abilityItem}>
                <ThemedText style={styles.abilityName}>{ability.name}</ThemedText>
                <ThemedText style={styles.abilityDesc}>{ability.description}</ThemedText>
              </View>
            ))}

            {idx < (comparisonData?.ghosts.length || 0) - 1 && (
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );

  const renderEquipment = () => (
    <View style={styles.tabContent}>
      <ScrollView
        horizontal
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalScroll}
      >
        {comparisonData?.ghosts.map((ghost, idx) => (
          <View key={ghost.id} style={[styles.statsColumn, { width: screenWidth * 0.4 }]}>
            <ThemedText style={styles.statsSectionTitle}>{getGhostName(ghost.id, language)}</ThemedText>

            {ghost.recommendedEquipment?.essential && (
              <>
                <ThemedText style={styles.equipmentCategory}>Essential</ThemedText>
                {ghost.recommendedEquipment.essential.map((item) => (
                  <ThemedText key={item} style={[styles.equipmentItem, { color: '#FF1744' }]}>
                    • {item}
                  </ThemedText>
                ))}
              </>
            )}

            {ghost.recommendedEquipment?.recommended && (
              <>
                <ThemedText style={styles.equipmentCategory}>Recommended</ThemedText>
                {ghost.recommendedEquipment.recommended.map((item) => (
                  <ThemedText key={item} style={styles.equipmentItem}>
                    • {item}
                  </ThemedText>
                ))}
              </>
            )}

            {idx < (comparisonData?.ghosts.length || 0) - 1 && (
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );

  const renderStrategies = () => (
    <View style={styles.tabContent}>
      <ScrollView
        horizontal
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalScroll}
      >
        {comparisonData?.ghosts.map((ghost, idx) => (
          <View key={ghost.id} style={[styles.statsColumn, { width: screenWidth * 0.4 }]}>
            <ThemedText style={styles.statsSectionTitle}>{getGhostName(ghost.id, language)}</ThemedText>

            {ghost.counterStrategies?.map((strategy) => (
              <View key={strategy.strategy} style={styles.strategyItem}>
                <ThemedText style={styles.strategyName}>{strategy.strategy}</ThemedText>
                {strategy.tips.map((tip) => (
                  <ThemedText key={tip} style={styles.strategyTip}>
                    → {tip}
                  </ThemedText>
                ))}
              </View>
            ))}

            {idx < (comparisonData?.ghosts.length || 0) - 1 && (
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return renderBasicStats();
      case 'abilities':
        return renderAbilities();
      case 'evidence':
        return renderEvidence();
      case 'equipment':
        return renderEquipment();
      case 'strategies':
        return renderStrategies();
      default:
        return null;
    }
  };

  if (!isVisible) return null;

  return (
    <BottomSheet
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      onClose={onClose}
      index={isVisible ? 0 : -1}
      animateOnMount={true}
      style={{ borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: 'hidden' }}
      backgroundComponent={() => (
              <BlurView intensity={94} style={StyleSheet.absoluteFillObject} />
        )}
      handleIndicatorStyle={{ backgroundColor: colors.spectral }}
    >
      <BottomSheetScrollView
        style={{ flex: 1, paddingHorizontal: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <ThemedText style={styles.title} numberOfLines={1}>Compare Ghosts</ThemedText>
            {selectedGhostIds.length > 0 && (
              <ThemedText style={styles.subtitle}>
                {selectedGhostIds.length} selected
              </ThemedText>
            )}
          </View>
        </View>

        {/* Selected Ghosts */}
        {selectedGhostIds.length > 0 && (
          <View style={styles.selectedContainer}>
            {GHOST_LIST.filter((g) => selectedGhostIds.includes(g.id)).map((ghost) => (
              <Pressable
                key={ghost.id}
                onPress={() => toggleGhostSelection(ghost.id)}
                style={[
                  styles.selectedChip,
                  {
                    backgroundColor: getDifficultyColor(ghost.difficulty) + '20',
                    borderColor: getDifficultyColor(ghost.difficulty),
                  },
                ]}
              >
                <ThemedText style={[styles.selectedChipText, { color: getDifficultyColor(ghost.difficulty) }]}>
                  {getGhostName(ghost.id, language)}
                </ThemedText>
                <MaterialIcons name="close" size={16} color={getDifficultyColor(ghost.difficulty)} />
              </Pressable>
            ))}
          </View>
        )}

        {/* Search Bar */}
        <View style={[styles.searchContainer, { backgroundColor: colors.tabIconDefault + '10' }]}>
          <ScrollView
            style={[styles.ghostListContainer]}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.ghostListContent}
            scrollEventThrottle={16}
          >
            {filteredGhosts.map((ghost, index) => {
              const prevGhost = index > 0 ? filteredGhosts[index - 1] : null;
              const nextGhost = index < filteredGhosts.length - 1 ? filteredGhosts[index + 1] : null;
              const isNewGroup = !prevGhost || prevGhost.difficulty !== ghost.difficulty;
              const isLastInGroup = !nextGhost || nextGhost.difficulty !== ghost.difficulty;
              
              return (
                <Pressable
                  key={ghost.id}
                  onPress={() => toggleGhostSelection(ghost.id)}
                  style={[
                    styles.ghostSelectButton,
                    {
                      backgroundColor: selectedGhostIds.includes(ghost.id)
                        ? getDifficultyColor(ghost.difficulty)
                        : colors.tabIconDefault + '15',
                      borderLeftWidth: isNewGroup ? 3 : 0,
                      borderLeftColor: getDifficultyColor(ghost.difficulty),
                      borderRightWidth: isLastInGroup ? 3 : 0,
                      borderRightColor: getDifficultyColor(ghost.difficulty),
                    },
                  ]}
                >
                  <ThemedText
                    style={[
                      styles.ghostSelectButtonText,
                      {
                        color: selectedGhostIds.includes(ghost.id) ? 'white' : colors.text,
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {(() => {
                      const name = getGhostName(ghost.id, language);
                      return name.length > 12 ? name.substring(0, 10) + '...' : name;
                    })()}
                  </ThemedText>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Comparison View */}
        {comparisonData && selectedGhostIds.length >= 2 && (
          <>
            {/* Tabs */}
            <View style={[styles.tabsContainer, { borderBottomColor: colors.border }]}>
              {['basic', 'abilities', 'evidence', 'equipment', 'strategies'].map((tab) => (
                <Pressable
                  key={tab}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setActiveTab(tab as typeof activeTab);
                  }}
                  style={[
                    styles.tab,
                    activeTab === tab && [styles.activeTab, { borderBottomColor: colors.spectral }],
                  ]}
                >
                  <ThemedText
                    style={[
                      styles.tabText,
                      activeTab === tab && { color: colors.spectral, fontWeight: '700' },
                    ]}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </ThemedText>
                </Pressable>
              ))}
            </View>

            {/* Tab Content */}
            {renderTabContent()}

            {/* Similarity Score */}
            <View style={[styles.similarityCard, { backgroundColor: colors.spectral + '10' }]}>
              <ThemedText style={styles.similarityLabel}>Similarity Score</ThemedText>
              <ThemedText style={[styles.similarityScore, { color: colors.spectral }]}>
                {`${comparisonData.similarities}%`}
              </ThemedText>
            </View>
          </>
        )}

        {selectedGhostIds.length < 2 && (
          <View style={styles.emptyState}>
            <MaterialIcons size={48} name="compare-arrows" color={colors.tabIconDefault} />
            <ThemedText style={styles.emptyStateText}>Select 2-3 ghosts to compare</ThemedText>
          </View>
        )}

        <View style={{ height: 40 }} />
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

function calculateSimilarity(ghosts: Ghost[]): number {
  if (ghosts.length < 2) return 0;

  let score = 0;
  const weights = {
    evidence: 0.3,
    abilities: 0.2,
    difficulty: 0.2,
    activity: 0.15,
    equipment: 0.15,
  };

  const ghost1 = ghosts[0];
  const ghost2 = ghosts[1];

  // Evidence match
  const commonEvidence = ghost1.evidence.filter((e) => ghost2.evidence.includes(e));
  const totalEvidence = new Set([...ghost1.evidence, ...ghost2.evidence]).size;
  score += (commonEvidence.length / totalEvidence) * weights.evidence;

  // Difficulty match
  if (ghost1.difficulty === ghost2.difficulty) {
    score += weights.difficulty;
  }

  // Activity level similarity
  if (ghost1.activityLevel === ghost2.activityLevel) {
    score += weights.activity;
  }

  // Hunt sanity similarity (within 10%)
  if (Math.abs(ghost1.huntSanityThreshold - ghost2.huntSanityThreshold) <= 10) {
    score += weights.activity * 0.5;
  }

  return Math.round(score * 100);
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 24,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
    lineHeight: 28,
    color: '#00D9FF',
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.6,
  },
  selectedContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  selectedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  selectedChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 16,
    gap: 8,
  },
  ghostListContainer: {
    flex: 1,
  },
  ghostListContent: {
    gap: 6,
  },
  ghostSelectButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    minWidth: 60,
  },
  ghostSelectButtonText: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    marginBottom: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
  },
  tabContent: {
    marginVertical: 12,
  },
  horizontalScroll: {
    gap: 12,
  },
  ghostColumn: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  ghostName: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
    textAlign: 'center',
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    marginBottom: 8,
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: '600',
  },
  statsColumn: {
    paddingHorizontal: 10,
  },
  statsSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
    color: '#00D9FF',
  },
  statRow: {
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  statLabel: {
    fontSize: 11,
    opacity: 0.7,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  evidenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 6,
    borderWidth: 1,
  },
  evidenceText: {
    fontSize: 12,
    fontWeight: '500',
  },
  abilityItem: {
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  abilityName: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
  },
  abilityDesc: {
    fontSize: 11,
    opacity: 0.8,
    lineHeight: 15,
  },
  equipmentCategory: {
    fontSize: 11,
    fontWeight: '700',
    opacity: 0.6,
    marginTop: 8,
    marginBottom: 4,
  },
  equipmentItem: {
    fontSize: 11,
    marginBottom: 4,
    lineHeight: 15,
  },
  strategyItem: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  strategyName: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  strategyTip: {
    fontSize: 11,
    opacity: 0.8,
    lineHeight: 15,
    marginBottom: 2,
  },
  similarityCard: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00D9FF' + '20',
  },
  similarityLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 4,
  },
  similarityScore: {
    fontSize: 36,
    fontWeight: '800',
    lineHeight: 40,
  },
  emptyState: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  emptyStateText: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
  },
});
