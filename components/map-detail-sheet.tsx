import { Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import React, { useMemo, useState } from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Map } from '@/lib/types';

interface MapDetailSheetProps {
  map: Map | null;
  isVisible: boolean;
  onClose: () => void;
}

export const MapDetailSheet = ({ map, isVisible, onClose }: MapDetailSheetProps) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const snapPoints = useMemo(() => ['60%', '95%'], []);
  const { width: screenWidth } = Dimensions.get('window');
  const [imageLoading, setImageLoading] = useState(true);

  console.log('MapDetailSheet - isVisible:', isVisible, 'map:', map?.name, 'index:', isVisible ? 0 : -1);

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
      backgroundStyle={{
        backgroundColor: colors.background,
      }}
      handleIndicatorStyle={{
        backgroundColor: colors.tabIconDefault,
      }}
    >
      <BottomSheetScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        {/* Map Image */}
        {map.imageUrl && (
          <View style={[styles.imageContainer, { backgroundColor: colors.tabIconDefault + '20' }]}>
            {imageLoading && (
              <View style={styles.imagePlaceholder}>
                <Ionicons size={48} name="image" color={colors.tabIconDefault} />
              </View>
            )}
            <Image
              source={{ uri: map.imageUrl }}
              style={styles.mapImage}
              resizeMode="cover"
              onLoad={() => setImageLoading(false)}
              onError={(error) => {
                console.log('Image load error:', error);
                setImageLoading(false);
              }}
              progressiveRenderingEnabled={true}
            />
            <View style={styles.imageOverlay} />
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
            <View
              style={[
                styles.difficultyBadgeSheet,
                { backgroundColor: getDifficultyColor(map.difficulty) },
              ]}
            >
              <ThemedText style={styles.difficultyBadgeText}>
                {map.difficulty}
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={[styles.section, styles.statsGrid]}>
          <View style={styles.statCard}>
            <Ionicons size={20} name="home-outline" color={colors.tint} />
            <ThemedText style={styles.statValue}>{map.maxRooms}</ThemedText>
            <ThemedText style={styles.statLabel}>Rooms</ThemedText>
          </View>
          <View style={styles.statCard}>
            <Ionicons size={20} name="people-outline" color={colors.tint} />
            <ThemedText style={styles.statValue}>{map.maxPlayers}</ThemedText>
            <ThemedText style={styles.statLabel}>Players</ThemedText>
          </View>
          <View style={styles.statCard}>
            <Ionicons
              size={20}
              name={map.characteristics.fuse ? 'flash' : 'close'}
              color={map.characteristics.fuse ? '#FFD700' : colors.tabIconDefault}
            />
            <ThemedText style={styles.statValue}>
              {map.characteristics.fuse ? 'Yes' : 'No'}
            </ThemedText>
            <ThemedText style={styles.statLabel}>Fuse</ThemedText>
          </View>
        </View>

        {/* Description */}
        {map.description && (
          <View style={styles.section}>
            <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
              About
            </ThemedText>
            <ThemedText style={styles.descriptionText}>{map.description}</ThemedText>
          </View>
        )}

        {/* Floor Plan */}
        {map.floorPlanUrl && (
          <View style={styles.section}>
            <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
              Floor Plan
            </ThemedText>
            <View style={[styles.floorPlanContainer, { backgroundColor: colors.tabIconDefault + '10' }]}>
              {imageLoading && (
                <View style={styles.imagePlaceholder}>
                  <Ionicons size={48} name="image" color={colors.tabIconDefault} />
                </View>
              )}
              <Image
                source={{ uri: map.floorPlanUrl }}
                style={styles.floorPlanImage}
                resizeMode="contain"
              />
            </View>
          </View>
        )}

        {/* Ghost Spawns */}
        {map.characteristics.ghostSpawns && (
          <View style={styles.section}>
            <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
              Ghost Spawns
            </ThemedText>
            <ThemedText style={styles.descriptionText}>
              {map.characteristics.ghostSpawns}
            </ThemedText>
          </View>
        )}

        {/* Lighting */}
        {map.characteristics.lighting && (
          <View style={styles.section}>
            <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
              Lighting
            </ThemedText>
            <View style={[styles.infoTag, { backgroundColor: colors.tint + '20' }]}>
              <Ionicons size={16} name="bulb" color={colors.tint} />
              <ThemedText style={styles.infoTagText}>{map.characteristics.lighting}</ThemedText>
            </View>
          </View>
        )}

        {/* Hazards */}
        {map.characteristics.hazards && map.characteristics.hazards.length > 0 && (
          <View style={styles.section}>
            <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
              Hazards
            </ThemedText>
            <View style={styles.tagsContainer}>
              {map.characteristics.hazards.map((hazard, idx) => (
                <View key={idx} style={[styles.hazardTag, { backgroundColor: '#F44336' + '20' }]}>
                  <Ionicons size={14} name="warning-outline" color="#F44336" />
                  <ThemedText style={[styles.tagText, { color: '#F44336' }]}>{hazard}</ThemedText>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Special Features */}
        {map.characteristics.specialFeatures && map.characteristics.specialFeatures.length > 0 && (
          <View style={styles.section}>
            <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
              Special Features
            </ThemedText>
            <View style={styles.tagsContainer}>
              {map.characteristics.specialFeatures.map((feature, idx) => (
                <View key={idx} style={[styles.featureTag, { backgroundColor: colors.tint + '20' }]}>
                  <Ionicons size={14} name="checkmark-circle" color={colors.tint} />
                  <ThemedText style={[styles.tagText, { color: colors.tint }]}>{feature}</ThemedText>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Strategies */}
        {map.strategies && map.strategies.length > 0 && (
          <View style={styles.section}>
            <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
              Strategies
            </ThemedText>
            <View style={styles.listContainer}>
              {map.strategies.map((strategy, idx) => (
                <View key={idx} style={styles.listItem}>
                  <ThemedText style={styles.listBullet}>•</ThemedText>
                  <ThemedText style={styles.listText}>{strategy}</ThemedText>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Tips */}
        {map.tips && map.tips.length > 0 && (
          <View style={styles.section}>
            <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
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
          </View>
        )}

        {/* Best For */}
        {map.bestFor && map.bestFor.length > 0 && (
          <View style={styles.section}>
            <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
              Best For
            </ThemedText>
            <View style={styles.tagsContainer}>
              {map.bestFor.map((category, idx) => (
                <View key={idx} style={[styles.bestForTag, { backgroundColor: colors.tint + '15' }]}>
                  <ThemedText style={[styles.tagText, { color: colors.tint }]}>
                    ✓ {category}
                  </ThemedText>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={{ height: 32 }} />
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerSection: {
    paddingTop: 16,
  },
  imageContainer: {
    position: 'relative',
    width: Dimensions.get('window').width,
    height: 240,
    overflow: 'hidden',
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
    width: Dimensions.get('window').width,
    height: 240,
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
  },
  difficultyBadgeText: {
    color: 'white',
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
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
    gap: 8,
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
});
