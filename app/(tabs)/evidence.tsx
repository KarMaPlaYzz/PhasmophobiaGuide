import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { BlurView } from 'expo-blur';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LongPressGestureHandler, State } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AdBanner } from '@/components/ad-banner';
import { AnimatedScreen } from '@/components/animated-screen';
import { EvidenceCollectionAnimation } from '@/components/evidence-collection-animation';
import { ghostSelectionEmitter } from '@/components/haptic-tab';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';
import { ALL_EVIDENCE_TYPES, EVIDENCE_DATABASE } from '@/lib/data/evidence-identifier';
import { GHOST_LIST } from '@/lib/data/ghosts';
import { EvidenceType } from '@/lib/types';
import {
  calculateProgress,
  EvidenceState,
  filterGhostsByEvidence,
  generateSmartHints,
} from '@/lib/utils/evidence-identifier';
import * as Haptics from 'expo-haptics';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: { paddingVertical: 16, paddingHorizontal: 16 },
  headerTitle: { fontSize: 28, fontWeight: 'bold' },
  content: {
    flex: 1,
  },
  contentPadding: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 12,
  },
  progressSection: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 11,
    opacity: 0.6,
  },
  matchesSection: {
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  ghostItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  ghostName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  ghostReason: {
    fontSize: 13,
    opacity: 0.65,
    fontWeight: '500',
  },
  hintsSection: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  hintItem: {
    paddingVertical: 8,
    borderLeftWidth: 3,
    paddingLeft: 10,
    marginBottom: 6,
  },
  hintLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  hintReason: {
    fontSize: 11,
    opacity: 0.6,
  },
  evidenceList: {
    marginBottom: 16,
  },
  evidenceCard: {
    borderWidth: 2,
    borderRadius: 14,
    padding: 10,
    marginBottom: 6,
    minHeight: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  evidenceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  evidenceEmoji: {
    fontSize: 22,
  },
  evidenceContent: {
    flex: 1,
  },
  evidenceTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  evidenceStatus: {
    fontSize: 11,
    opacity: 0.65,
    fontWeight: '500',
    marginTop: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: 'white',
  },
  fab: {
    position: 'absolute',
    bottom: 34,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  fabBlur: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 56,
    height: 56,
  },
  adContainer: { marginVertical: 12, marginHorizontal: -16 },
});

export default function EvidenceScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors['dark'];
  const insets = useSafeAreaInsets();

  // Evidence collection state
  const [evidenceState, setEvidenceState] = useState<EvidenceState>({
    'EMF Level 5': 'not-found',
    'D.O.T.S. Projector': 'not-found',
    'Ultraviolet': 'not-found',
    'Ghost Orb': 'not-found',
    'Ghost Writing': 'not-found',
    'Spirit Box': 'not-found',
    'Freezing Temperatures': 'not-found',
  });

  // Calculate results
  const filteredResults = useMemo(() => filterGhostsByEvidence(evidenceState), [evidenceState]);
  const smartHints = useMemo(() => generateSmartHints(evidenceState, filteredResults), [evidenceState, filteredResults]);
  const progress = useMemo(() => calculateProgress(evidenceState), [evidenceState]);

  // Cycle through evidence states
  const toggleEvidence = (evidence: EvidenceType) => {
    const current = evidenceState[evidence];
    const confirmedCount = Object.values(evidenceState).filter(s => s === 'confirmed').length;
    
    // If we have 3 confirmed and this one is not confirmed, can't interact with it
    if (confirmedCount >= 3 && current !== 'confirmed') {
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setEvidenceState(prev => {
      let next: 'not-found' | 'investigating' | 'confirmed';
      if (current === 'not-found') {
        next = 'investigating';
      } else if (current === 'investigating') {
        next = 'confirmed';
      } else {
        // When confirmed, cycle back to not-found
        next = 'not-found';
      }
      return { ...prev, [evidence]: next };
    });
  };

  // Long press to reset evidence to not-found
  const handleLongPress = (evidence: EvidenceType, state: State) => {
    if (state === State.ACTIVE) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setEvidenceState(prev => ({
        ...prev,
        [evidence]: 'not-found',
      }));
    }
  };

  const resetAll = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setEvidenceState({
      'EMF Level 5': 'not-found',
      'D.O.T.S. Projector': 'not-found',
      'Ultraviolet': 'not-found',
      'Ghost Orb': 'not-found',
      'Ghost Writing': 'not-found',
      'Spirit Box': 'not-found',
      'Freezing Temperatures': 'not-found',
    });
  };

  // Navigate to ghost detail
  const navigateToGhost = (ghostName: string) => {
    const ghost = GHOST_LIST.find(g => g.name === ghostName);
    if (ghost) {
      ghostSelectionEmitter.emit(ghost);
    }
  };

  // Get status display
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'confirmed':
        return { symbol: '✓', color: '#22c55e', label: 'Confirmed' };
      case 'investigating':
        return { symbol: '◐', color: '#f59e0b', label: 'Investigating' };
      default:
        return { symbol: '□', color: '#9ca3af', label: 'Not Found' };
    }
  };

  const confirmedCount = Object.values(evidenceState).filter(s => s === 'confirmed').length;

  return (
    <AnimatedScreen>
      <ThemedView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.contentPadding}>
          {/* Ghost Matches - Always reserve space */}
          <View style={{ minHeight: confirmedCount > 0 ? 'auto' : 0 }}>
            {confirmedCount > 0 && (filteredResults.definiteMatches.length > 0 || filteredResults.veryLikely.length > 0) && (
              <>
                <ThemedText style={styles.sectionLabel}>🎯 Ghost Matches</ThemedText>
                <View style={[styles.matchesSection, { backgroundColor: colors.surfaceLight, borderColor: '#22c55e' }]}>
                  {[...filteredResults.definiteMatches, ...filteredResults.veryLikely].map((ghost, idx) => (
                    <TouchableOpacity
                      key={idx}
                      onPress={() => navigateToGhost(ghost.ghostName)}
                      activeOpacity={0.7}
                    >
                      <View
                        style={[
                          styles.ghostItem,
                          { borderBottomColor: idx === [...filteredResults.definiteMatches, ...filteredResults.veryLikely].length - 1 ? 'transparent' : colors.border },
                        ]}
                      >
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                          <View style={{ flex: 1 }}>
                            <ThemedText style={styles.ghostName}>{ghost.ghostName}</ThemedText>
                            <ThemedText style={styles.ghostReason}>{ghost.reason}</ThemedText>
                          </View>
                          <MaterialIcons name="chevron-right" size={20} color={colors.text} opacity={0.5} />
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            {confirmedCount === 3 && filteredResults.definiteMatches.length === 0 && filteredResults.veryLikely.length === 0 && (
              <>
                <ThemedText style={styles.sectionLabel}>🔍 No Matches Found</ThemedText>
                <View style={[styles.matchesSection, { backgroundColor: colors.surfaceLight, borderColor: '#ef4444' }]}>
                  <ThemedText style={[styles.ghostName, { color: '#ef4444' }]}>
                    ❌ No ghost matches this evidence combination
                  </ThemedText>
                  <ThemedText style={styles.ghostReason}>
                    Double-check your evidence collection. This combination may indicate contradictory findings.
                  </ThemedText>
                </View>
              </>
            )}
          </View>

          {/* Evidence List - Always visible */}
          <ThemedText style={[styles.sectionLabel, { marginTop: confirmedCount > 0 ? 0 : 0 }]}>Collect Evidence</ThemedText>
          <View style={styles.evidenceList}>
            {ALL_EVIDENCE_TYPES.map((evidenceType, idx) => {
              const info = EVIDENCE_DATABASE[evidenceType];
              const status = evidenceState[evidenceType];
              const statusInfo = getStatusInfo(status);
              const confirmedCountLocal = Object.values(evidenceState).filter(s => s === 'confirmed').length;
              const isLocked = confirmedCountLocal >= 3 && status !== 'confirmed';
              const isCollected = status === 'confirmed';

              return (
                <EvidenceCollectionAnimation
                  key={idx}
                  isCollected={isCollected}
                  delay={idx * 50}
                >
                  <LongPressGestureHandler
                    onHandlerStateChange={({ nativeEvent }) => handleLongPress(evidenceType, nativeEvent.state)}
                    minDurationMs={150}
                  >
                  <TouchableOpacity
                      onPress={() => toggleEvidence(evidenceType)}
                      activeOpacity={0.6}
                      disabled={isLocked}
                    >
                      <View
                        style={[
                          styles.evidenceCard,
                          {
                            backgroundColor: colors.tabIconDefault + '10',
                            borderColor: (status === 'confirmed' || status === 'investigating') ? statusInfo.color : colors.tabIconDefault + '20',
                            opacity: isLocked ? 0.5 : 1,
                          },
                        ]}
                      >
                        <View style={styles.evidenceHeader}>
                          <Text style={styles.evidenceEmoji}>{info.emoji}</Text>
                          <View style={styles.evidenceContent}>
                            <ThemedText style={styles.evidenceTitle}>{evidenceType}</ThemedText>
                            <ThemedText style={styles.evidenceStatus}>{statusInfo.label}</ThemedText>
                          </View>
                          <View style={[styles.statusBadge, { backgroundColor: statusInfo.color }]}>
                            <ThemedText style={styles.statusText}>
                              {statusInfo.symbol}
                            </ThemedText>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </LongPressGestureHandler>
                </EvidenceCollectionAnimation>
              );
            })}
          </View>

          {/* Smart Hints - When collecting evidence */}
          {confirmedCount > 0 && confirmedCount < 3 && smartHints.length > 0 && filteredResults.definiteMatches.length === 0 && filteredResults.veryLikely.length === 0 && (
            <>
              <Collapsible title={`Next Steps (${filteredResults.possible.length + filteredResults.unlikely.length} Possible Ghosts)`}>
                <View style={[styles.hintsSection, { backgroundColor: colors.surfaceLight }]}>
                  {smartHints.slice(0, 3).map((hint, idx) => (
                    <View
                      key={idx}
                      style={[
                        styles.hintItem,
                        {
                          borderLeftColor:
                            hint.priority === 'high'
                              ? '#ef4444'
                              : hint.priority === 'medium'
                                ? '#f59e0b'
                                : '#9ca3af',
                          borderBottomWidth: idx === smartHints.slice(0, 3).length - 1 ? 0 : 1,
                          borderBottomColor: colors.border,
                          marginBottom: idx === smartHints.slice(0, 3).length - 1 ? 0 : 6,
                        },
                      ]}
                    >
                      <ThemedText style={styles.hintLabel}>#{idx + 1} {hint.evidence}</ThemedText>
                      <ThemedText style={styles.hintReason}>{hint.reason}</ThemedText>
                    </View>
                  ))}
                </View>

                {/* Show possible ghosts when expanded */}
                {confirmedCount > 0 && (filteredResults.possible.length > 0 || filteredResults.unlikely.length > 0) && (
                  <>
                    <ThemedText style={[styles.sectionLabel, { marginTop: 16 }]}>Possible Ghosts</ThemedText>
                    <View style={[styles.matchesSection, { backgroundColor: colors.surfaceLight, borderColor: colors.border }]}>
                      {[...filteredResults.possible, ...filteredResults.unlikely].map((ghost, idx) => (
                        <TouchableOpacity
                          key={idx}
                          onPress={() => navigateToGhost(ghost.ghostName)}
                          activeOpacity={0.7}
                        >
                          <View
                            style={[
                              styles.ghostItem,
                              { borderBottomColor: idx === [...filteredResults.possible, ...filteredResults.unlikely].length - 1 ? 'transparent' : colors.border },
                            ]}
                          >
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                              <View style={{ flex: 1 }}>
                                <ThemedText style={styles.ghostName}>{ghost.ghostName}</ThemedText>
                                <ThemedText style={styles.ghostReason}>{ghost.reason}</ThemedText>
                              </View>
                              <MaterialIcons name="chevron-right" size={20} color={colors.text} opacity={0.5} />
                            </View>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </>
                )}
              </Collapsible>
            </>
          )}

          {/* Recovery Guide - When no match found with 3 evidences */}
          {confirmedCount === 3 && filteredResults.definiteMatches.length === 0 && filteredResults.veryLikely.length === 0 && (
            <>
              <ThemedText style={styles.sectionLabel}>💡 Troubleshooting Guide</ThemedText>
              <View style={[styles.hintsSection, { backgroundColor: colors.surfaceLight }]}>
                <View
                  style={[
                    styles.hintItem,
                    {
                      borderLeftColor: '#ef4444',
                      borderBottomWidth: 1,
                      borderBottomColor: colors.border,
                      marginBottom: 6,
                    },
                  ]}
                >
                  <ThemedText style={styles.hintLabel}>1. Verify Your Evidence</ThemedText>
                  <ThemedText style={styles.hintReason}>
                    Double-check each piece of evidence. You may have misidentified one or more evidence types.
                  </ThemedText>
                </View>

                <View
                  style={[
                    styles.hintItem,
                    {
                      borderLeftColor: '#f59e0b',
                      borderBottomWidth: 1,
                      borderBottomColor: colors.border,
                      marginBottom: 6,
                    },
                  ]}
                >
                  <ThemedText style={styles.hintLabel}>2. Check Multiple Sources</ThemedText>
                  <ThemedText style={styles.hintReason}>
                    Use different equipment to cross-verify findings. Some ghosts may be tricky to detect.
                  </ThemedText>
                </View>

                <View
                  style={[
                    styles.hintItem,
                    {
                      borderLeftColor: '#9ca3af',
                    },
                  ]}
                >
                  <ThemedText style={styles.hintLabel}>3. Reset and Try Again</ThemedText>
                  <ThemedText style={styles.hintReason}>
                    Use the refresh button to reset your findings and start fresh with a clearer approach.
                  </ThemedText>
                </View>
              </View>
            </>
          )}
        </View>

        {/* Ad at the bottom */}
        <View style={styles.adContainer}>
          <AdBanner />
        </View>
      </ScrollView>

      {/* Reset FAB */}
      {confirmedCount > 0 && (
        <TouchableOpacity
          onPress={resetAll}
          activeOpacity={0.7}
          style={[styles.fab, { backgroundColor: colors.spectral + '30' }]}
        >
          <BlurView intensity={90} style={styles.fabBlur}>
            <MaterialIcons name="refresh" size={24} color={colors.spectral} />
          </BlurView>
        </TouchableOpacity>
      )}
      </ThemedView>
    </AnimatedScreen>
  );
}
