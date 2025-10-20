import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GhostDetailSheet } from '@/components/ghost-detail-sheet';
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
  
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceType[]>([]);
  const [selectedGhost, setSelectedGhost] = useState<Ghost | null>(null);
  
  const matchingGhosts = useMemo(() => {
    if (selectedEvidence.length === 0) return [];
    return identifyGhostsByEvidence(selectedEvidence);
  }, [selectedEvidence]);

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
        return '#4CAF50';
      case 'Intermediate':
        return '#FF9800';
      case 'Advanced':
        return '#F44336';
      case 'Expert':
        return '#9C27B0';
      default:
        return colors.text;
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { backgroundColor: colors.background, paddingTop: insets.top }]}>
        <ThemedText type="title" style={styles.headerTitle}>
          Ghost Identifier
        </ThemedText>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
                    { backgroundColor: colors.tint + '20' },
                  ],
                  isDisabled && styles.evidenceCardDisabled,
                ]}
              >
                <View style={styles.evidenceContent}>
                  <ThemedText style={[styles.evidenceTitle, isDisabled && styles.evidenceTextDisabled]}>
                    {evidence.name}
                  </ThemedText>
                  {isSelected && (
                    <Ionicons size={20} name="checkmark-circle" color={colors.tint} />
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
            style={[styles.clearButton, { backgroundColor: colors.tint + '20' }]}
          >
            <Ionicons size={16} name="close-circle" color={colors.tint} />
            <ThemedText style={[styles.clearButtonText, { color: colors.tint }]}>
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
              <ThemedText style={styles.resultsTitle}>
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
                        { borderColor: colors.tabIconDefault + '30', backgroundColor: colors.tabIconDefault + '10' },
                      ]}
                    >
                    <View style={styles.ghostHeader}>
                      <ThemedText type="defaultSemiBold" style={styles.ghostName}>
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

                    {/* Evidence Badges */}
                    <View style={styles.evidenceBadges}>
                      {ghostData.evidence.map((ev: any) => (
                        <View
                          key={ev}
                          style={[
                            styles.evidenceBadge,
                            {
                              backgroundColor:
                                selectedEvidence.includes(ev as EvidenceType) ? colors.tint : colors.tint + '30',
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
  header: { paddingVertical: 12, paddingHorizontal: 16 },
  headerTitle: { fontSize: 28, fontWeight: 'bold' },
  content: { flex: 1, paddingHorizontal: 16, paddingTop: 12 },
  subtitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  description: { fontSize: 12, opacity: 0.6, marginBottom: 16 },
  evidenceGrid: { marginBottom: 16 },
  evidenceCard: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderColor: '#ccc',
  },
  evidenceCardSelected: { borderWidth: 2 },
  evidenceCardDisabled: { opacity: 0.4 },
  evidenceContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  evidenceTitle: { fontSize: 14, fontWeight: '500' },
  evidenceTextDisabled: { opacity: 0.5 },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 16,
    justifyContent: 'center',
  },
  clearButtonText: { fontSize: 14, fontWeight: '600' },
  resultsSection: { marginTop: 8, marginBottom: 32 },
  placeholderText: { textAlign: 'center', opacity: 0.5, fontSize: 14, marginTop: 32 },
  resultsTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  ghostResult: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  ghostHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  ghostName: { fontSize: 16, flex: 1 },
  difficultyBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  difficultyText: { color: 'white', fontSize: 11, fontWeight: 'bold' },
  ghostStats: { flexDirection: 'row', gap: 8, marginBottom: 10, flexWrap: 'wrap' },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statLabel: { fontSize: 11, opacity: 0.7 },
  statValue: { fontSize: 11, fontWeight: '600' },
  evidenceBadges: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  evidenceBadge: { paddingHorizontal: 8, paddingVertical: 6, borderRadius: 4 },
  evidenceBadgeText: { fontSize: 11, fontWeight: '600' },
  noResultsText: { textAlign: 'center', opacity: 0.5, fontSize: 14, marginTop: 20 },
});
