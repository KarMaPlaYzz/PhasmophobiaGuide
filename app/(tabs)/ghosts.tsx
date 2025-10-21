import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView, TapGestureHandler } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GhostDetailSheet } from '@/components/ghost-detail-sheet';
import { scrollRefRegistry } from '@/components/haptic-tab';
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
  const route = useRoute();
  
  const [searchText, setSearchText] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedGhost, setSelectedGhost] = useState<Ghost | null>(null);

  // Use callback ref to always have the latest ref
  const handleScrollRef = (ref: ScrollView | null) => {
    if (ref) {
      scrollRefRegistry.set(route.name, ref as any);
    }
  };

  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];

  const filteredGhosts = useMemo(() => {
    const difficultyOrder: Record<string, number> = { 
      'Beginner': 0, 
      'Intermediate': 1, 
      'Advanced': 2, 
      'Expert': 3 
    };

    let filtered = GHOST_LIST.filter((ghost) => {
      const matchesSearch = ghost.name.toLowerCase().includes(searchText.toLowerCase());
      const matchesDifficulty = selectedDifficulty === 'All' || ghost.difficulty === selectedDifficulty;
      return matchesSearch && matchesDifficulty;
    });

    // Sort by difficulty
    filtered.sort((a, b) => {
      const orderA = difficultyOrder[a.difficulty] ?? 999;
      const orderB = difficultyOrder[b.difficulty] ?? 999;
      return orderA - orderB;
    });

    return filtered;
  }, [searchText, selectedDifficulty]);

  const getDifficultyColor = (difficulty: string) => {
    if (difficulty === 'All') return colors.spectral;
    return DifficultyColors[difficulty as keyof typeof DifficultyColors] || colors.text;
  };

  const getDifficultyIcon = (difficulty: string): string => {
    switch (difficulty) {
      case 'Beginner':
        return 'star';
      case 'Intermediate':
        return 'star-half';
      case 'Advanced':
        return 'flame';
      case 'Expert':
        return 'flash';
      default:
        return 'grid';
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
            <Ionicons size={20} name="search" color={colors.spectral} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search ghosts..."
              placeholderTextColor={colors.tabIconDefault}
              value={searchText}
              onChangeText={setSearchText}
            />
            {searchText && (
              <TouchableOpacity onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setSearchText('');
              }}>
                <Ionicons size={20} name="close-circle" color={colors.spectral} />
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
                diff === 'all'
                  ? GHOST_LIST.length
                  : GHOST_LIST.filter((g) => g.difficulty === diff).length;
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
                          ? diffColor
                          : colors.tabIconDefault + '15',
                      borderWidth: selectedDifficulty === diff ? 0 : 1,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Ionicons
                    size={12}
                    name={getDifficultyIcon(diff) as any}
                    color={selectedDifficulty === diff ? 'white' : colors.text}
                  />
                  <ThemedText
                    style={{
                      color: selectedDifficulty === diff ? 'white' : colors.text,
                      fontSize: 11,
                      fontWeight: '600',
                      marginLeft: 4,
                    }}
                  >
                    {diff === 'all' ? 'All' : diff}
                  </ThemedText>
                  <View
                    style={[
                      styles.filterCount,
                      {
                        backgroundColor:
                          selectedDifficulty === diff ? 'rgba(255,255,255,0.3)' : diffColor + '30',
                      },
                    ]}
                  >
                    <ThemedText
                      style={{
                        color: selectedDifficulty === diff ? 'white' : diffColor,
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
                      <ThemedText style={styles.statLabel}>Speed</ThemedText>
                      <ThemedText style={styles.statValue}>{ghost.movementSpeed}</ThemedText>
                    </View>
                    <View style={styles.statItem}>
                      <ThemedText style={styles.statLabel}>Hunt</ThemedText>
                      <ThemedText style={styles.statValue}>{ghost.huntSanityThreshold}%</ThemedText>
                    </View>
                  </View>

                  {/* Sanity Drain Indicator */}
                  {ghost.activityLevel && (
                    <View style={[styles.sanityDrainContainer, { backgroundColor: getSanityDrainLevel(ghost.activityLevel).color + '15', borderColor: getSanityDrainLevel(ghost.activityLevel).color }]}>
                      <Ionicons name={getSanityDrainLevel(ghost.activityLevel).icon as any} size={15} color={getSanityDrainLevel(ghost.activityLevel).color} />
                      <ThemedText style={[styles.sanityDrainText, { color: getSanityDrainLevel(ghost.activityLevel).color }]}>
                        Sanity drain: {getSanityDrainLevel(ghost.activityLevel).label}
                      </ThemedText>
                    </View>
                  )}

                  {ghost.evidence && ghost.evidence.length > 0 && (
                    <View style={styles.evidenceContainer}>
                      <ThemedText style={styles.evidenceLabel}>Evidence:</ThemedText>
                      <View style={styles.evidenceBadges}>
                        {ghost.evidence.map((ev) => (
                          <View key={ev} style={[styles.evidenceBadge, { backgroundColor: colors.tint + '25' }]}>
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
  header: { paddingVertical: 16, paddingHorizontal: 16 },
  headerTitle: { fontSize: 28, fontWeight: 'bold' },
  content: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
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
    gap: 7,
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
  difficultyBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6 },
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
});
