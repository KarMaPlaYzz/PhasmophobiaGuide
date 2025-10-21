import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GhostDetailSheet } from '@/components/ghost-detail-sheet';
import { scrollRefRegistry } from '@/components/haptic-tab';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { EVIDENCE_LIST, identifyGhostsByEvidence } from '@/lib/data/evidence';
import { GHOST_LIST } from '@/lib/data/ghosts';
import { EvidenceType, Ghost } from '@/lib/types';

export default function IdentifierScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  const route = useRoute();
  
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceType[]>([]);
  const [selectedGhost, setSelectedGhost] = useState<Ghost | null>(null);

  // Use callback ref to always have the latest ref
  const handleScrollRef = (ref: ScrollView | null) => {
    if (ref) {
      scrollRefRegistry.set(route.name, ref as any);
    }
  };
  
  const matchingGhosts = useMemo(() => {
    if (selectedEvidence.length === 0) return [];
    return identifyGhostsByEvidence(selectedEvidence);
  }, [selectedEvidence]);

  // Check if we have identified a single ghost (all 3 evidence match)
  const identifiedGhost = useMemo(() => {
    if (matchingGhosts.length === 1 && selectedEvidence.length === 3) {
      return matchingGhosts[0];
    }
    return null;
  }, [matchingGhosts, selectedEvidence.length]);

  const toggleEvidence = (evidence: EvidenceType) => {
    setSelectedEvidence((prev) => {
      // If already selected, remove it
      if (prev.includes(evidence)) {
        return prev.filter((e) => e !== evidence);
      }
      // If not selected, add only if less than 3
      if (prev.length < 3) {
        return [...prev, evidence];
      }
      // If already have 3, don't add more
      return prev;
    });
  };

  const clearSelection = () => {
    setSelectedEvidence([]);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return '#1FB46B';
      case 'Intermediate':
        return '#FFB84D';
      case 'Advanced':
        return '#FF4444';
      case 'Expert':
        return '#6B4AAC';
      default:
        return colors.text;
    }
  };

  const getSanityDrainLevel = (activityLevel: string): { label: string; icon: string; color: string } => {
    switch (activityLevel) {
      case 'Low':
        return { label: 'Low', icon: 'arrow-down', color: '#4CAF50' };
      case 'Medium':
        return { label: 'Medium', icon: 'trending-up', color: '#FFC107' };
      case 'High':
        return { label: 'High', icon: 'arrow-up', color: '#FF9800' };
      case 'Very High':
        return { label: 'Very High', icon: 'flame', color: '#FF6F6F' };
      case 'Variable':
        return { label: 'Variable', icon: 'shuffle', color: '#9C27B0' };
      default:
        return { label: 'Unknown', icon: 'help', color: colors.text };
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        {/*<ThemedText type="title" style={[styles.headerTitle, { color: colors.spectral }]}>
          Ghost Identifier
        </ThemedText>*/}
      </View>

      <ScrollView ref={handleScrollRef} style={styles.content} showsVerticalScrollIndicator={false}>
        <ThemedText style={styles.subtitle}>Select Evidence Found</ThemedText>
        <ThemedText style={styles.description}>
          Tap evidence types you found to identify which ghost you're hunting
        </ThemedText>

        {/* Evidence Grid */}
        <View style={styles.evidenceGrid}>
          {EVIDENCE_LIST.map((evidence) => {
            const isSelected = selectedEvidence.includes(evidence.id as EvidenceType);
            const isDisabled = selectedEvidence.length >= 3 && !isSelected;
            
            return (
              <TouchableOpacity
                key={evidence.id}
                onPress={() => toggleEvidence(evidence.id as EvidenceType)}
                disabled={isDisabled}
                style={[
                  styles.evidenceCard,
                  isSelected && [
                    styles.evidenceCardSelected,
                    { backgroundColor: colors.spectral + '20', borderColor: colors.spectral },
                  ],
                  isDisabled && styles.evidenceCardDisabled,
                  { borderColor: colors.border },
                ]}
              >
                <View style={styles.evidenceContent}>
                  <ThemedText style={[styles.evidenceTitle, isDisabled && styles.evidenceTextDisabled]}>
                    {evidence.name}
                  </ThemedText>
                  {isSelected && (
                    <Ionicons size={20} name="checkmark-circle" color={colors.spectral} />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Clear Button */}
        {selectedEvidence.length > 0 && (
          <TouchableOpacity
            onPress={clearSelection}
            style={[styles.clearButton, { backgroundColor: colors.spectral + '20' }]}
          >
            <Ionicons size={16} name="close-circle" color={colors.spectral} />
            <ThemedText style={[styles.clearButtonText, { color: colors.spectral }]}>
              Clear Selection
            </ThemedText>
          </TouchableOpacity>
        )}

        {/* Results */}
        <View style={styles.resultsSection}>
          {selectedEvidence.length === 0 ? (
            <ThemedText style={styles.placeholderText}>
              Select 3 evidence types to identify your ghost
            </ThemedText>
          ) : matchingGhosts.length > 0 ? (
            <>
              {/* Progress indicator */}
              <View style={[styles.progressContainer, { backgroundColor: colors.spectral + '15' }]}>
                <ThemedText style={[styles.progressText, { color: colors.spectral }]}>
                  {selectedEvidence.length === 3 && identifiedGhost
                    ? '🎯 Ghost Identified!'
                    : `${matchingGhosts.length} ${matchingGhosts.length === 1 ? 'ghost' : 'ghosts'} possible`}
                </ThemedText>
                {selectedEvidence.length < 3 && (
                  <ThemedText style={[styles.progressSubtext, { color: colors.spectral }]}>
                    Collect {3 - selectedEvidence.length} more evidence to narrow down
                  </ThemedText>
                )}
              </View>

              <ThemedText style={[styles.resultsTitle, { color: colors.spectral }]}>
                Matching Ghosts ({matchingGhosts.length})
              </ThemedText>
              {matchingGhosts.map((ghostName) => {
                const trimmedName = ghostName.trim();
                const ghostData = GHOST_LIST.find((g) => g.name.toLowerCase() === trimmedName.toLowerCase());
                if (!ghostData) {
                  console.warn(`Ghost not found: "${ghostName}" (trimmed: "${trimmedName}")`);
                  return null;
                }
                return (
                  <TouchableOpacity
                    key={ghostName}
                    onPress={() => setSelectedGhost(ghostData)}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.ghostResult,
                        { borderColor: colors.border, backgroundColor: colors.surfaceLight },
                        identifiedGhost === ghostData.name && {
                          borderColor: colors.spectral,
                          backgroundColor: colors.spectral + '20',
                          borderWidth: 2,
                        },
                      ]}
                    >
                    <View style={styles.ghostHeader}>
                      <ThemedText type="defaultSemiBold" style={[styles.ghostName, { color: colors.spectral }]}>
                        {ghostData.name}
                      </ThemedText>
                      <View
                        style={[
                          styles.difficultyBadge,
                          { backgroundColor: getDifficultyColor(ghostData.difficulty) },
                        ]}
                      >
                        <ThemedText style={styles.difficultyText}>
                          {ghostData.difficulty}
                        </ThemedText>
                      </View>
                    </View>

                    <View style={styles.ghostStats}>
                      <View style={styles.statItem}>
                        <ThemedText style={styles.statLabel}>Speed:</ThemedText>
                        <ThemedText style={styles.statValue}>
                          {ghostData.movementSpeed}
                        </ThemedText>
                      </View>
                      <View style={styles.statItem}>
                        <ThemedText style={styles.statLabel}>Activity:</ThemedText>
                        <ThemedText style={styles.statValue}>
                          {ghostData.activityLevel}
                        </ThemedText>
                      </View>
                      <View style={styles.statItem}>
                        <ThemedText style={styles.statLabel}>Hunt at:</ThemedText>
                        <ThemedText style={styles.statValue}>
                          {ghostData.huntSanityThreshold}%
                        </ThemedText>
                      </View>
                    </View>

                    {/* Sanity Drain Indicator */}
                    {ghostData.activityLevel && (
                      <View style={[styles.sanityDrainContainer, { backgroundColor: getSanityDrainLevel(ghostData.activityLevel).color + '20', borderColor: getSanityDrainLevel(ghostData.activityLevel).color }]}>
                        <Ionicons name={getSanityDrainLevel(ghostData.activityLevel).icon as any} size={14} color={getSanityDrainLevel(ghostData.activityLevel).color} />
                        <ThemedText style={[styles.sanityDrainText, { color: getSanityDrainLevel(ghostData.activityLevel).color }]}>
                          Drain: {getSanityDrainLevel(ghostData.activityLevel).label}
                        </ThemedText>
                      </View>
                    )}

                    {/* Evidence Badges */}
                    <View style={styles.evidenceBadges}>
                      {ghostData.evidence.map((ev: any) => (
                        <View
                          key={ev}
                          style={[
                            styles.evidenceBadge,
                            {
                              backgroundColor:
                                selectedEvidence.includes(ev as EvidenceType) ? colors.spectral : colors.spectral + '30',
                            },
                          ]}
                        >
                          <ThemedText
                            style={[
                              styles.evidenceBadgeText,
                              {
                                color: selectedEvidence.includes(ev as EvidenceType) ? 'white' : colors.text,
                              },
                            ]}
                          >
                            {ev}
                          </ThemedText>
                        </View>
                      ))}
                    </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </>
          ) : (
            <ThemedText style={styles.noResultsText}>
              No ghosts match this evidence combination
            </ThemedText>
          )}
        </View>
      </ScrollView>

      <GhostDetailSheet
        ghost={selectedGhost}
        isVisible={selectedGhost !== null}
        onClose={() => setSelectedGhost(null)}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingVertical: 16, paddingHorizontal: 16 },
  headerTitle: { fontSize: 28, fontWeight: 'bold' },
  content: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  subtitle: { fontSize: 17, fontWeight: '700', marginBottom: 8, color: '#00D9FF' },
  description: { fontSize: 13, opacity: 0.6, marginBottom: 20, lineHeight: 19 },
  evidenceGrid: { marginBottom: 24 },
  evidenceCard: {
    borderWidth: 0,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    minHeight: 54,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  evidenceCardSelected: { borderWidth: 0, shadowOpacity: 0.12, elevation: 3 },
  evidenceCardDisabled: { opacity: 0.5 },
  evidenceContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  evidenceTitle: { fontSize: 15, fontWeight: '600' },
  evidenceTextDisabled: { opacity: 0.5 },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 20,
    justifyContent: 'center',
    minHeight: 50,
  },
  clearButtonText: { fontSize: 15, fontWeight: '600' },
  resultsSection: { marginTop: 12, marginBottom: 32 },
  placeholderText: { textAlign: 'center', opacity: 0.5, fontSize: 14, marginTop: 32 },
  progressContainer: { 
    padding: 14, 
    borderRadius: 14, 
    marginBottom: 20,
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  progressText: { fontSize: 17, fontWeight: '700', textAlign: 'center' },
  progressSubtext: { fontSize: 13, opacity: 0.7, textAlign: 'center', marginTop: 6 },
  resultsTitle: { fontSize: 17, fontWeight: '700', marginBottom: 14, marginTop: 0 },
  ghostResult: {
    borderWidth: 0,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    minHeight: 110,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  ghostHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  ghostName: { fontSize: 16, flex: 1, fontWeight: '700' },
  difficultyBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6 },
  difficultyText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  ghostStats: { flexDirection: 'row', gap: 12, marginBottom: 10, flexWrap: 'wrap' },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statLabel: { fontSize: 13, opacity: 0.65, fontWeight: '500' },
  statValue: { fontSize: 13, fontWeight: '700' },
  evidenceBadges: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  evidenceBadge: { paddingHorizontal: 9, paddingVertical: 5, borderRadius: 6 },
  evidenceBadgeText: { fontSize: 12, fontWeight: '600' },
  sanityDrainContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8, paddingHorizontal: 10, borderRadius: 8, borderWidth: 0, marginVertical: 0, marginTop: 8 },
  sanityDrainText: { fontSize: 13, fontWeight: '700' },
  noResultsText: { textAlign: 'center', opacity: 0.5, fontSize: 14, marginTop: 20 },
});
