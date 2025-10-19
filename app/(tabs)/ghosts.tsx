import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView, TapGestureHandler } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GhostDetailSheet } from '@/components/ghost-detail-sheet';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, DifficultyColors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { GHOST_LIST } from '@/lib/data/ghosts';
import { Ghost } from '@/lib/types';

export default function GhostsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  
  const [searchText, setSearchText] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedGhost, setSelectedGhost] = useState<Ghost | null>(null);

  const difficulties = ['all', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];

  const filteredGhosts = useMemo(() => {
    return GHOST_LIST.filter((ghost) => {
      const matchesSearch = ghost.name.toLowerCase().includes(searchText.toLowerCase());
      const matchesDifficulty = selectedDifficulty === 'all' || ghost.difficulty === selectedDifficulty;
      return matchesSearch && matchesDifficulty;
    });
  }, [searchText, selectedDifficulty]);

  const getDifficultyColor = (difficulty: string) => DifficultyColors[difficulty as keyof typeof DifficultyColors] || colors.text;

  const handleGhostPress = useCallback((ghost: Ghost) => {
    console.log('🎮 Ghost card tapped:', ghost.name);
    setSelectedGhost(ghost);
  }, []);

  const handleBottomSheetClose = useCallback(() => {
    console.log('🔚 Bottom sheet closed');
    setSelectedGhost(null);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        <View style={[styles.header, { backgroundColor: colors.background, paddingTop: insets.top }]}>
          <ThemedText type="title" style={styles.headerTitle}>
            Ghosts
          </ThemedText>
        </View>

        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          nestedScrollEnabled
        >
          <View style={[styles.searchContainer, { borderColor: colors.tabIconDefault }]}>
            <Ionicons size={20} name="search" color={colors.tabIconDefault} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search ghosts..."
              placeholderTextColor={colors.tabIconDefault}
              value={searchText}
              onChangeText={setSearchText}
            />
            {searchText && (
              <TouchableOpacity onPress={() => setSearchText('')}>
                <Ionicons size={20} name="close-circle" color={colors.tabIconDefault} />
              </TouchableOpacity>
            )}
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterContainer}
            contentContainerStyle={styles.filterContent}
          >
            {difficulties.map((diff) => (
              <TouchableOpacity
                key={diff}
                onPress={() => setSelectedDifficulty(diff)}
                style={[
                  styles.filterButton,
                  {
                    backgroundColor:
                      selectedDifficulty === diff
                        ? colors.tint
                        : colors.tabIconDefault + '20',
                  },
                ]}
              >
                <ThemedText
                  style={{
                    color: selectedDifficulty === diff ? 'white' : colors.text,
                    fontSize: 12,
                    fontWeight: '600',
                  }}
                >
                  {diff === 'all' ? 'All' : diff}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <ThemedText style={styles.resultCounter}>
            {filteredGhosts.length} ghost{filteredGhosts.length !== 1 ? 's' : ''}
          </ThemedText>

          {filteredGhosts.length > 0 ? (
            filteredGhosts.map((ghost) => (
              <TapGestureHandler
                key={ghost.id}
                onActivated={() => handleGhostPress(ghost)}
                maxDurationMs={500}
              >
                <TouchableOpacity
                  onPress={() => handleGhostPress(ghost)}
                  activeOpacity={0.6}
                  delayPressIn={0}
                >
                  <View
                    style={[
                      styles.ghostCard,
                      { borderColor: colors.tabIconDefault + '30', backgroundColor: colors.tabIconDefault + '10' },
                    ]}
                  >
                  <View style={styles.ghostHeader}>
                    <View style={{ flex: 1 }}>
                      <ThemedText type="defaultSemiBold" style={styles.ghostName}>
                        {ghost.name}
                      </ThemedText>
                    </View>
                    <View
                      style={[
                        styles.difficultyBadge,
                        { backgroundColor: getDifficultyColor(ghost.difficulty) },
                      ]}
                    >
                      <ThemedText style={styles.difficultyText}>
                        {ghost.difficulty}
                      </ThemedText>
                    </View>
                  </View>

                  {ghost.description && (
                    <ThemedText style={styles.ghostDescription}>{ghost.description}</ThemedText>
                  )}

                  <View style={styles.ghostStats}>
                    <View style={styles.statItem}>
                      <ThemedText style={styles.statLabel}>Speed:</ThemedText>
                      <ThemedText style={styles.statValue}>{ghost.movementSpeed}</ThemedText>
                    </View>
                    <View style={styles.statItem}>
                      <ThemedText style={styles.statLabel}>Activity:</ThemedText>
                      <ThemedText style={styles.statValue}>{ghost.activityLevel}%</ThemedText>
                    </View>
                    <View style={styles.statItem}>
                      <ThemedText style={styles.statLabel}>Hunt Sanity:</ThemedText>
                      <ThemedText style={styles.statValue}>{ghost.huntSanityThreshold}%</ThemedText>
                    </View>
                  </View>

                  {ghost.evidence && ghost.evidence.length > 0 && (
                    <View style={styles.evidenceContainer}>
                      <ThemedText style={styles.evidenceLabel}>Evidence:</ThemedText>
                      <View style={styles.evidenceBadges}>
                        {ghost.evidence.map((ev) => (
                          <View key={ev} style={[styles.evidenceBadge, { backgroundColor: colors.tint + '30' }]}>
                            <ThemedText style={styles.evidenceText}>{ev}</ThemedText>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}

                  <ThemedText style={styles.tapTip}>Tap to view details →</ThemedText>
                </View>
              </TouchableOpacity>
            </TapGestureHandler>
            ))
          ) : (
            <ThemedText style={styles.noResults}>No ghosts match your search</ThemedText>
          )}
        </ScrollView>
      </ThemedView>

      <GhostDetailSheet
        ghost={selectedGhost}
        isVisible={selectedGhost !== null}
        onClose={handleBottomSheetClose}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingVertical: 12, paddingHorizontal: 16 },
  headerTitle: { fontSize: 28, fontWeight: 'bold' },
  content: { flex: 1, paddingHorizontal: 16, paddingTop: 12 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 14, paddingVertical: 4 },
  filterContainer: { marginBottom: 12 },
  filterContent: { paddingVertical: 4, gap: 8 },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  resultCounter: { fontSize: 12, opacity: 0.6, marginBottom: 8, marginLeft: 2 },
  ghostCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 5,
  },
  ghostHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 },
  ghostName: { fontSize: 16 },
  difficultyBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  difficultyText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  ghostDescription: { fontSize: 12, marginBottom: 8, lineHeight: 16 },
  ghostStats: { flexDirection: 'row', gap: 12, marginBottom: 8 },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statLabel: { fontSize: 11, opacity: 0.7 },
  statValue: { fontSize: 11, fontWeight: '600' },
  evidenceContainer: { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.1)' },
  evidenceLabel: { fontSize: 11, opacity: 0.7, marginBottom: 6 },
  evidenceBadges: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  evidenceBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  evidenceText: { fontSize: 10, fontWeight: '500' },
  noResults: { textAlign: 'center', marginTop: 32, fontSize: 14, opacity: 0.5 },
  tapTip: { fontSize: 11, opacity: 0.6, marginTop: 8, fontStyle: 'italic' },
});
