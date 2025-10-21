import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import React, { useMemo, useState } from 'react';
import {
    Dimensions,
    Platform,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    UIManager,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { scrollRefRegistry } from '@/components/haptic-tab';
import { MapDetailSheet } from '@/components/map-detail-sheet';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, DifficultyColors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { MAP_LIST } from '@/lib/data/maps';
import { Map } from '@/lib/types';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const DIFFICULTY_LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];
const SIZE_ORDER = ['small', 'medium', 'large'];

export default function MapsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const { width } = Dimensions.get('window');
  
  const [searchText, setSearchText] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const viewMode = 'list';
  const [selectedMap, setSelectedMap] = useState<Map | null>(null);
  const [sheetVisible, setSheetVisible] = useState(false);

  // Use callback ref to always have the latest ref
  const handleScrollRef = (ref: ScrollView | null) => {
    if (ref) {
      scrollRefRegistry.set(route.name, ref as any);
    }
  };

  const filteredMaps = useMemo(() => {
    return MAP_LIST.filter((map) => {
      const matchesSearch = map.name.toLowerCase().includes(searchText.toLowerCase());
      const matchesDifficulty = selectedDifficulty === 'All' || map.difficulty === selectedDifficulty;
      return matchesSearch && matchesDifficulty;
    });
  }, [searchText, selectedDifficulty]);

  const mapsBySize = useMemo(() => {
    const grouped: Record<string, typeof filteredMaps> = {
      small: [],
      medium: [],
      large: [],
    };
    filteredMaps.forEach((map) => {
      grouped[map.size as keyof typeof grouped].push(map);
    });
    return grouped;
  }, [filteredMaps]);

  const getDifficultyColor = (difficulty: string) => {
    if (difficulty === 'All') return colors.spectral;
    return DifficultyColors[difficulty as keyof typeof DifficultyColors] || colors.text;
  };

  const getDifficultyIcon = (difficulty: string) => {
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

  const getSizeLabel = (size: string) => {
    const labels = { small: 'Small', medium: 'Medium', large: 'Large' };
    return labels[size as keyof typeof labels] || size;
  };

  const handleMapPress = (map: Map) => {
    console.log('Map pressed:', map.name);
    setSelectedMap(map);
    setSheetVisible(true);
  };

  const handleCloseSheet = () => {
    setSheetVisible(false);
    setTimeout(() => setSelectedMap(null), 300);
  };

  const cardWidth = width - 32;

  return (
    <>
      <ThemedView style={styles.container}>
        <ScrollView 
          ref={handleScrollRef}
          style={styles.fullScroll} 
          showsVerticalScrollIndicator={false} 
          nestedScrollEnabled={true}
          scrollEventThrottle={16}
        >
          <View style={[styles.header, { /*backgroundColor: colors.surface,*/ paddingTop: insets.top }]}>
            {/*<View style={styles.headerContent}>
              <View>
                <ThemedText type="title" style={[styles.headerTitle, { color: colors.spectral }]}>
                  Maps
                </ThemedText>
                <ThemedText style={styles.headerSubtitle}>
                  {filteredMaps.length} of {MAP_LIST.length} locations
                </ThemedText>
              </View>
              <TouchableOpacity
                onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                style={[styles.viewToggle, { backgroundColor: colors.spectral + '20' }]}
              >
                <Ionicons
                  size={20}
                  name={viewMode === 'grid' ? 'list' : 'grid'}
                  color={colors.spectral}
                />
              </TouchableOpacity>
            </View>*/}
          </View>

          {/* Search Bar */}
          <View style={[styles.contentPadding ]}>
            <View style={[styles.searchContainer, { borderColor: colors.border, backgroundColor: colors.surface }]}>
              <Ionicons size={20} name="search" color={colors.spectral} />
              <TextInput
                style={[styles.searchInput, { color: colors.text }]}
                placeholder="Search maps..."
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
          </View>

          {/* Difficulty Filter */}
          <ScrollView
            horizontal
            scrollEnabled={true}
            scrollEventThrottle={16}
            showsHorizontalScrollIndicator={false}
            style={[styles.filterContainer]}
            contentContainerStyle={styles.filterContent}
          >
              {DIFFICULTY_LEVELS.map((level) => {
            const count =
              level === 'All'
                ? MAP_LIST.length
                : MAP_LIST.filter((m) => m.difficulty === level).length;
            const diffColor = getDifficultyColor(level);
            return (
              <TouchableOpacity
                key={level}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelectedDifficulty(level);
                }}
                style={[
                  styles.filterButton,
                  {
                    backgroundColor:
                      selectedDifficulty === level
                        ? diffColor
                        : colors.tabIconDefault + '15',
                    borderWidth: selectedDifficulty === level ? 0 : 1,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Ionicons
                  size={12}
                  name={getDifficultyIcon(level)}
                  color={selectedDifficulty === level ? 'white' : colors.text}
                />
                <ThemedText
                  style={{
                    color: selectedDifficulty === level ? 'white' : colors.text,
                    fontSize: 11,
                    fontWeight: '600',
                    marginLeft: 4,
                  }}
                >
                  {level === 'All' ? 'All' : level}
                </ThemedText>
                <View
                  style={[
                    styles.filterCount,
                    {
                      backgroundColor:
                        selectedDifficulty === level ? 'rgba(255,255,255,0.3)' : diffColor + '30',
                    },
                  ]}
                >
                  <ThemedText
                    style={{
                      color: selectedDifficulty === level ? 'white' : diffColor,
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

            {/* Maps by Size */}
        {filteredMaps.length > 0 ? (
          SIZE_ORDER.map((size) => {
            const mapsInSize = mapsBySize[size as keyof typeof mapsBySize];
            if (mapsInSize.length === 0) return null;

            return (
              <View key={size} style={[styles.sizeSection, styles.contentPadding]}>
                <View style={styles.sectionHeader}>
                  <Ionicons
                    size={18}
                    name={
                      size === 'small'
                        ? 'home'
                        : size === 'medium'
                          ? 'business'
                          : 'business'
                    }
                    color={colors.tint}
                  />
                  <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
                    {getSizeLabel(size)} Maps
                  </ThemedText>
                  <View style={[styles.sizeCounter, { backgroundColor: colors.tint + '20' }]}>
                    <ThemedText style={styles.sizeCounterText}>{mapsInSize.length}</ThemedText>
                  </View>
                </View>

                <View
                  style={[
                    styles.mapGrid,
                    { flexDirection: 'column' },
                  ]}
                >
                  {mapsInSize.map((map) => (
                    <View
                      key={map.id}
                      style={[
                        styles.cardWrapper,
                        { width: cardWidth },
                      ]}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                          handleMapPress(map);
                        }}
                        activeOpacity={0.7}
                      >
                        <View
                          style={[
                            styles.mapCard,
                            {
                              borderColor: colors.tabIconDefault + '20',
                              backgroundColor:
                                colorScheme === 'dark'
                                  ? colors.tabIconDefault + '10'
                                  : colors.background,
                              borderWidth: 1,
                            },
                          ]}
                        >
                          {/* Card Header */}
                          <View style={styles.cardHeader}>
                            <View style={{ flex: 1 }}>
                              <ThemedText
                                type="defaultSemiBold"
                                style={styles.mapName}
                                numberOfLines={2}
                              >
                                {map.name}
                              </ThemedText>
                              <ThemedText style={styles.mapType}>
                                {(() => {
                                  const typeMap: { [key: string]: string } = {
                                    'house': 'Residential House',
                                    'campground': 'Campground',
                                    'campsite': 'Campsite',
                                    'lighthouse': 'Lighthouse',
                                    'facility': 'Facility',
                                    'institution': 'Mental Institution',
                                    'school': 'School'
                                  };
                                  return typeMap[map.type] || (map.type.charAt(0).toUpperCase() + map.type.slice(1));
                                })()}
                              </ThemedText>
                            </View>
                            <View
                              style={[
                                styles.difficultyBadge,
                                { backgroundColor: getDifficultyColor(map.difficulty) },
                              ]}
                            >
                              <Ionicons
                                size={10}
                                name={getDifficultyIcon(map.difficulty)}
                                color="white"
                              />
                              <ThemedText style={styles.difficultyText}>
                                {map.difficulty}
                              </ThemedText>
                            </View>
                          </View>

                          {/* Quick Stats */}
                          <View style={styles.quickStats}>
                            <View style={styles.quickStatItem}>
                              <Ionicons
                                size={12}
                                name="home-outline"
                                color={colors.tabIconDefault}
                              />
                              <ThemedText style={styles.quickStatText}>
                                {map.maxRooms}
                              </ThemedText>
                            </View>
                            <View style={styles.quickStatItem}>
                              <Ionicons
                                size={12}
                                name="people-outline"
                                color={colors.tabIconDefault}
                              />
                              <ThemedText style={styles.quickStatText}>
                                {map.maxPlayers}
                              </ThemedText>
                            </View>
                            <View style={styles.quickStatItem}>
                              <Ionicons
                                size={12}
                                name={map.characteristics.fuse ? 'flash' : 'close'}
                                color={
                                  map.characteristics.fuse ? '#FFD700' : colors.tabIconDefault
                                }
                              />
                              <ThemedText style={styles.quickStatText}>
                                {map.characteristics.fuse ? 'Fuse' : 'No'}
                              </ThemedText>
                            </View>
                            <View style={[styles.tapIndicator, { marginLeft: 'auto' }]}>
                              <Ionicons size={16} name="information-circle-outline" color={colors.tabIconDefault} />
                              <Ionicons size={14} name="chevron-forward" color={colors.tabIconDefault} />
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            );
          })
        ) : (
          <View style={styles.noResultsContainer}>
            <Ionicons size={48} name="map" color={colors.tabIconDefault + '40'} />
            <ThemedText style={styles.noResults}>
              No maps match your search
            </ThemedText>
            <ThemedText style={styles.noResultsHint}>
              Try adjusting your filters
            </ThemedText>
          </View>
        )}

            <View style={{ height: 32 }} />
        </ScrollView>
      </ThemedView>

      <MapDetailSheet
        map={selectedMap}
        isVisible={sheetVisible}
        onClose={handleCloseSheet}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  fullScroll: { flex: 1 },
  header: { paddingVertical: 16, paddingHorizontal: 16 },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 28, fontWeight: 'bold' },
  headerSubtitle: { fontSize: 13, opacity: 0.6, marginTop: 2, fontWeight: '500' },
  viewToggle: {
    padding: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 44,
  },
  contentPadding: { paddingHorizontal: 16, paddingTop: 16 },
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
  filterContainer: { height: 52, paddingHorizontal: 16, flex: 0, marginBottom: 12 },
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

  // Section Styles
  sizeSection: { marginBottom: 28 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 10,
  },
  sectionTitle: { fontSize: 17, fontWeight: '700', flex: 1 },
  sizeCounter: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  sizeCounterText: { fontSize: 12, fontWeight: '700' },

  // Grid Layout
  mapGrid: {
    justifyContent: 'space-between',
    gap: 12,
    flexWrap: 'wrap',
  },
  cardWrapper: { marginBottom: 0 },

  // Card Styles
  mapCard: {
    borderRadius: 14,
    padding: 14,
    minHeight: 130,
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 10,
  },
  mapName: { fontSize: 16, fontWeight: '700', flex: 1 },
  mapType: { fontSize: 12, opacity: 0.5, marginTop: 3, fontWeight: '400' },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    justifyContent: 'center',
  },
  difficultyText: { color: 'white', fontSize: 12, fontWeight: 'bold' },

  // Quick Stats
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 0,
    borderTopWidth: 1,
    borderBottomWidth: 0,
    borderColor: 'rgba(0,0,0,0.06)',
    gap: 16,
  },
  quickStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  quickStatText: { fontSize: 12, fontWeight: '700' },

  // Expand Indicator
  expandIndicator: {
    alignItems: 'center',
    paddingTop: 10,
  },
  tapIndicator: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
  },
  tapIndicatorText: {
    fontSize: 12,
    opacity: 0.5,
    fontWeight: '400',
  },

  // Expanded Content
  expandedContent: {
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    borderWidth: 0,
    borderTopWidth: 0,
    padding: 14,
    marginTop: -1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  expandedLabel: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 10,
  },
  expandedText: { fontSize: 13, lineHeight: 19, opacity: 0.75, marginBottom: 10 },

  // Tags and Features
  hazardsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 },
  hazardTag: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  hazardText: { fontSize: 12, fontWeight: '700' },
  featuresRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  featureTag: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  featureText: { fontSize: 12, fontWeight: '700' },

  // No Results
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  noResults: { textAlign: 'center', marginTop: 16, fontSize: 17, fontWeight: '700' },
  noResultsHint: { textAlign: 'center', marginTop: 8, fontSize: 13, opacity: 0.5 },
});
