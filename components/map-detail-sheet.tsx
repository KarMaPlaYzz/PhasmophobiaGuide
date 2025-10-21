import { Ionicons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useMemo, useState } from 'react';
import { Dimensions, Image, Pressable, StyleSheet, View } from 'react-native';

import { BookmarkButton } from '@/components/bookmark-button';
import { FloorPlanViewer } from '@/components/floor-plan-viewer';
import { detailSheetEmitter } from '@/components/haptic-tab';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { HistoryService } from '@/lib/storage/storageService';
import { Map } from '@/lib/types';

interface MapDetailSheetProps {
  map: Map | null;
  isVisible: boolean;
  onClose: () => void;
}

export const MapDetailSheet = ({ map, isVisible, onClose }: MapDetailSheetProps) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const snapPoints = useMemo(() => ['60%', '100%'], []);
  const { width: screenWidth } = Dimensions.get('window');
  const [imageLoading, setImageLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    zones: false,
    strategies: false,
    hazards: false,
    features: false,
  });

  // Close sheet when tab changes
  useEffect(() => {
    const unsubscribe = detailSheetEmitter.subscribe(() => {
      // Reset sections before closing
      setExpandedSections({
        zones: false,
        strategies: false,
        hazards: false,
        features: false,
      });
      onClose();
    });
    return unsubscribe;
  }, [onClose]);

  // Track view when map is shown
  useEffect(() => {
    if (isVisible && map) {
      HistoryService.trackView('map', map.id, map.name);
    }
  }, [isVisible, map]);

  // Reset sections when sheet becomes invisible
  useEffect(() => {
    if (!isVisible) {
      setExpandedSections({
        zones: false,
        strategies: false,
        hazards: false,
        features: false,
      });
    }
  }, [isVisible]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  console.log('MapDetailSheet - isVisible:', isVisible, 'map:', map?.name, 'index:', isVisible ? 0 : -1);

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

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'star' as const;
      case 'Intermediate': return 'star-half' as const;
      case 'Advanced': return 'flame' as const;
      case 'Expert': return 'flash' as const;
      default: return 'grid' as const;
    }
  };

  if (!map) return null;

  return (
    <BottomSheet
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      onClose={onClose}
      index={isVisible ? 0 : -1}
      animateOnMount={true}
      animatedPosition={undefined}
      animatedIndex={undefined}
      style={{ borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: 'hidden' }}
      backgroundComponent={() => (
        <BlurView intensity={94} style={StyleSheet.absoluteFillObject} />
      )}
      handleIndicatorStyle={{
        backgroundColor: colors.spectral,
      }}
    >
      <BottomSheetScrollView
        style={[styles.container, { paddingHorizontal: 16 }]}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        nestedScrollEnabled={false}
      >
        {/* Map Image */}
        {map.imageUrl && (
          <View style={[styles.imageContainer, { marginHorizontal: -16, paddingHorizontal: 16, paddingVertical: 12, paddingBottom: 20 }]}>
            {imageLoading && (
              <View style={styles.imagePlaceholder}>
                <Ionicons size={48} name="image" color={colors.spectral} />
              </View>
            )}
            <Image
              source={{ uri: map.imageUrl }}
              style={[styles.mapImage, { borderRadius: 12 }]}
              resizeMode="cover"
              onLoad={() => setImageLoading(false)}
              onError={(error) => {
                console.log('Image load error:', error);
                setImageLoading(false);
              }}
              progressiveRenderingEnabled={true}
            />
          </View>
        )}

        {/* Header Section */}
        <View style={[styles.section, styles.headerSection]}>
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <ThemedText type="defaultSemiBold" style={styles.mapName}>
                {map.name}
              </ThemedText>
              <ThemedText style={styles.mapType}>
                {map.type.charAt(0).toUpperCase() + map.type.slice(1)}
              </ThemedText>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View
                style={[
                  styles.difficultyBadgeSheet,
                  {
                    backgroundColor: getDifficultyColor(map.difficulty) + '20',
                    borderColor: getDifficultyColor(map.difficulty),
                    borderWidth: 1,
                  },
                ]}
              >
                <Ionicons size={14} name={getDifficultyIcon(map.difficulty)} color={getDifficultyColor(map.difficulty)} />
                <ThemedText style={[styles.difficultyBadgeText, { color: getDifficultyColor(map.difficulty) }]}>
                  {map.difficulty}
                </ThemedText>
              </View>
              <BookmarkButton
                itemId={map.id}
                itemType="map"
                itemName={map.name}
                size={28}
                color={colors.spectral}
              />
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={[styles.section, styles.statsGrid]}>
          <View style={styles.statCard}>
            <Ionicons size={20} name="home-outline" color={colors.spectral} />
            <ThemedText style={styles.statValue}>{map.maxRooms}</ThemedText>
            <ThemedText style={styles.statLabel}>Rooms</ThemedText>
          </View>
          <View style={styles.statCard}>
            <Ionicons size={20} name="people-outline" color={colors.spectral} />
            <ThemedText style={styles.statValue}>{map.maxPlayers}</ThemedText>
            <ThemedText style={styles.statLabel}>Players</ThemedText>
          </View>
          <View style={styles.statCard}>
            <Ionicons
              size={20}
              name={map.characteristics.fuse ? 'flash' : 'close'}
              color={map.characteristics.fuse ? '#FFB84D' : colors.tabIconDefault}
            />
            <ThemedText style={styles.statValue}>
              {map.characteristics.fuse ? 'Yes' : 'No'}
            </ThemedText>
            <ThemedText style={styles.statLabel}>Fuse</ThemedText>
          </View>
        </View>

        {/* Description */}
        {map.description && (
          <>
            <ThemedText style={[styles.sectionTitle, { marginTop: 20, marginBottom: 12 }]}>
              About
            </ThemedText>
            <ThemedText style={styles.description}>{map.description}</ThemedText>
          </>
        )}

        {/* Map Characteristics - Always Visible */}
        <View>
          {/* Ghost Spawns */}
          {map.characteristics.ghostSpawns && (
            <>
              <ThemedText style={[styles.sectionTitle, { marginTop: 20, marginBottom: 12 }]}>
                Ghost Spawns
              </ThemedText>
              <ThemedText style={styles.description}>{map.characteristics.ghostSpawns}</ThemedText>
            </>
          )}

          {/* Lighting */}
          {map.characteristics.lighting && (
            <>
              <ThemedText style={[styles.sectionTitle, { marginTop: 20, marginBottom: 12 }]}>
                Lighting
              </ThemedText>
              <View style={[styles.infoTag, { backgroundColor: colors.spectral + '20' }]}>
                <Ionicons size={16} name="bulb" color={colors.spectral} />
                <ThemedText style={styles.infoTagText}>{map.characteristics.lighting}</ThemedText>
              </View>
            </>
          )}

          {/* Floor Plan */}
          {map.floorPlanUrl && (
            <>
              <ThemedText style={[styles.sectionTitle, { marginTop: 20, marginBottom: 12 }]}>
                Floor Plan
              </ThemedText>
              <View style={{ marginHorizontal: -16, marginVertical: 12, paddingHorizontal: 16 }}>
                <FloorPlanViewer imageUrl={map.floorPlanUrl} mapName={map.name} />
              </View>
            </>
          )}
        </View>

        {/* Collapsible: Zones */}
        {map.zones && map.zones.length > 0 && (
          <>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                toggleSection('zones');
              }}
              style={[styles.collapsibleHeader, { backgroundColor: colors.spectral + '12', marginTop: 16 }]}
            >
              <Ionicons
                name={expandedSections.zones ? 'chevron-down' : 'chevron-forward'}
                size={18}
                color={colors.spectral}
              />
              <ThemedText style={[styles.sectionTitle, { marginTop: 0, marginBottom: 0, marginLeft: 0, flex: 1 }]}>
                Zones ({map.zones.length})
              </ThemedText>
            </Pressable>
            {expandedSections.zones && (
              <View>
                {map.zones.map((zone, idx) => (
                  <View key={idx} style={[styles.zoneItem, { borderColor: colors.paranormal, borderLeftWidth: 3, paddingLeft: 12, paddingVertical: 12, marginBottom: 12 }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                      <ThemedText style={[styles.zoneName, { flex: 1 }]}>{zone.name}</ThemedText>
                      <View
                        style={[
                          styles.zoneDifficultyBadge,
                          {
                            backgroundColor:
                              zone.difficulty === 'Easy'
                                ? '#4CAF50'
                                : zone.difficulty === 'Medium'
                                  ? '#FFC107'
                                  : '#FF6F6F',
                          },
                        ]}
                      >
                        <ThemedText style={styles.zoneDifficultyText}>{zone.difficulty}</ThemedText>
                      </View>
                    </View>
                    <ThemedText style={[styles.description, { marginBottom: 8 }]}>{zone.description}</ThemedText>
                  </View>
                ))}
              </View>
            )}
          </>
        )}

        {/* Collapsible: Hazards */}
        {map.characteristics.hazards && map.characteristics.hazards.length > 0 && (
          <>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                toggleSection('hazards');
              }}
              style={[styles.collapsibleHeader, { backgroundColor: colors.spectral + '12', marginTop: 16 }]}
            >
              <Ionicons
                name={expandedSections.hazards ? 'chevron-down' : 'chevron-forward'}
                size={18}
                color={colors.spectral}
              />
              <ThemedText style={[styles.sectionTitle, { marginTop: 0, marginBottom: 0, marginLeft: 0, flex: 1 }]}>
                Hazards ({map.characteristics.hazards.length})
              </ThemedText>
            </Pressable>
            {expandedSections.hazards && (
              <View style={styles.tagsContainer}>
                {map.characteristics.hazards.map((hazard, idx) => (
                  <View key={idx} style={[styles.hazardTag, { backgroundColor: '#FF4444' + '20' }]}>
                    <Ionicons size={14} name="warning-outline" color="#FF4444" />
                    <ThemedText style={[styles.tagText, { color: '#FF4444' }]}>{hazard}</ThemedText>
                  </View>
                ))}
              </View>
            )}
          </>
        )}

        {/* Collapsible: Special Features */}
        {map.characteristics.specialFeatures && map.characteristics.specialFeatures.length > 0 && (
          <>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                toggleSection('features');
              }}
              style={[styles.collapsibleHeader, { backgroundColor: colors.spectral + '12', marginTop: 16 }]}
            >
              <Ionicons
                name={expandedSections.features ? 'chevron-down' : 'chevron-forward'}
                size={18}
                color={colors.spectral}
              />
              <ThemedText style={[styles.sectionTitle, { marginTop: 0, marginBottom: 0, marginLeft: 0, flex: 1 }]}>
                Special Features ({map.characteristics.specialFeatures.length})
              </ThemedText>
            </Pressable>
            {expandedSections.features && (
              <View style={styles.tagsContainer}>
                {map.characteristics.specialFeatures.map((feature, idx) => (
                  <View key={idx} style={[styles.featureTag, { backgroundColor: colors.spectral + '20' }]}>
                    <Ionicons size={14} name="checkmark-circle" color={colors.spectral} />
                    <ThemedText style={[styles.tagText, { color: colors.spectral }]}>{feature}</ThemedText>
                  </View>
                ))}
              </View>
            )}
          </>
        )}

        {/* Collapsible: Strategies & Tips */}
        {(map.strategies || map.tips) && (
          <>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                toggleSection('strategies');
              }}
              style={[styles.collapsibleHeader, { backgroundColor: colors.spectral + '12', marginTop: 16 }]}
            >
              <Ionicons
                name={expandedSections.strategies ? 'chevron-down' : 'chevron-forward'}
                size={18}
                color={colors.spectral}
              />
              <ThemedText style={[styles.sectionTitle, { marginTop: 0, marginBottom: 0, marginLeft: 0, flex: 1 }]}>
                Strategies & Tips
              </ThemedText>
            </Pressable>
            {expandedSections.strategies && (
              <View>
                {/* Strategies */}
                {map.strategies && map.strategies.length > 0 && (
                  <>
                    <ThemedText style={[styles.sectionTitle, { marginTop: 12, fontSize: 14 }]}>
                      Strategies
                    </ThemedText>
                    <View style={styles.listContainer}>
                      {map.strategies.map((strategy, idx) => (
                        <View key={idx} style={styles.listItem}>
                          <ThemedText style={[styles.listBullet, { color: colors.spectral }]}>•</ThemedText>
                          <ThemedText style={styles.listText}>{strategy}</ThemedText>
                        </View>
                      ))}
                    </View>
                  </>
                )}

                {/* Tips */}
                {map.tips && map.tips.length > 0 && (
                  <>
                    <ThemedText style={[styles.sectionTitle, { marginTop: 12, fontSize: 14 }]}>
                      Tips
                    </ThemedText>
                    <View style={styles.listContainer}>
                      {map.tips.map((tip, idx) => (
                        <View key={idx} style={styles.listItem}>
                          <ThemedText style={styles.listBullet}>💡</ThemedText>
                          <ThemedText style={styles.listText}>{tip}</ThemedText>
                        </View>
                      ))}
                    </View>
                  </>
                )}

                {/* Solo Tips */}
                {map.soloTips && map.soloTips.length > 0 && (
                  <>
                    <ThemedText style={[styles.sectionTitle, { marginTop: 12, fontSize: 14 }]}>
                      Solo Tips
                    </ThemedText>
                    <View style={styles.listContainer}>
                      {map.soloTips.map((tip, idx) => (
                        <View key={idx} style={styles.listItem}>
                          <ThemedText style={styles.listBullet}>👤</ThemedText>
                          <ThemedText style={styles.listText}>{tip}</ThemedText>
                        </View>
                      ))}
                    </View>
                  </>
                )}

                {/* Hunt Strategy */}
                {map.huntStrategy && (
                  <>
                    <ThemedText style={[styles.sectionTitle, { marginTop: 12, fontSize: 14 }]}>
                      Hunt Strategy
                    </ThemedText>
                    <View style={[styles.strategyBox, { backgroundColor: colors.spectral + '15' }]}>
                      <MaterialIcons name="verified" size={20} color={colors.spectral} />
                      <ThemedText style={styles.strategyText}>{map.huntStrategy}</ThemedText>
                    </View>
                  </>
                )}
              </View>
            )}
          </>
        )}

        <View style={{ height: 20 }} />
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    paddingVertical: 14,
  },
  headerSection: {
    paddingTop: 0,
  },
  imageContainer: {
    position: 'relative',
    width: Dimensions.get('window').width,
    height: 'auto',
    overflow: 'visible',
  },
  imagePlaceholder: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  mapImage: {
    width: '100%',
    height: 200,
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  mapName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#00D9FF',
  },
  mapType: {
    fontSize: 13,
    opacity: 0.6,
    marginTop: 4,
  },
  difficultyBadgeSheet: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  difficultyBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 11,
    opacity: 0.6,
    marginTop: 4,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginTop: 20, marginBottom: 12, color: '#00D9FF' },
  description: { fontSize: 13, lineHeight: 20, marginBottom: 12, opacity: 0.85 },
  collapsibleHeader: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 12, borderRadius: 8, marginBottom: 8 },
  infoTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  infoTagText: {
    fontSize: 13,
    fontWeight: '500',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  hazardTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  featureTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  bestForTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  listContainer: {
    gap: 10,
  },
  listItem: {
    flexDirection: 'row',
    paddingVertical: 8,
    gap: 10,
  },
  listBullet: {
    fontSize: 14,
    marginTop: 2,
    minWidth: 20,
  },
  listText: {
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
    opacity: 0.8,
  },
  floorPlanContainer: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
  },
  floorPlanImage: {
    width: '100%',
    height: '100%',
  },
  floorPlanSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: '100%',
  },
  zoneItem: { paddingLeft: 12, borderLeftWidth: 3, paddingVertical: 12, paddingRight: 10, marginBottom: 10 },
  zoneCard: {
    borderLeftWidth: 3,
    marginVertical: 2,
  },
  zoneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  zoneName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00D9FF',
    flex: 1,
  },
  zoneDifficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  zoneDifficultyText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },
  zoneDescription: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
    opacity: 0.8,
  },
  equipmentTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  strategyBox: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    borderRadius: 8,
    alignItems: 'flex-start',
  },
  strategyText: {
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
  },
});
