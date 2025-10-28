import { Ionicons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useMemo, useState } from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';

import { BookmarkButton } from '@/components/bookmark-button';
import { CollapsibleSection } from '@/components/collapsible-section';
import { FloorPlanViewer } from '@/components/floor-plan-viewer';
import { detailSheetEmitter } from '@/components/haptic-tab';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useLocalization } from '@/hooks/use-localization';
import { useInterstitialAds } from '@/hooks/use-interstitial-ads';
import { usePremium } from '@/hooks/use-premium';
import { getDifficultyLabel } from '@/lib/localization';
import { HistoryService } from '@/lib/storage/storageService';
import { Map } from '@/lib/types';

interface MapDetailSheetProps {
  map: Map | null;
  isVisible: boolean;
  onClose: () => void;
}

export const MapDetailSheet = ({ map, isVisible, onClose }: MapDetailSheetProps) => {
  const colors = Colors['dark'];
  const { language, t } = useLocalization();
  const { isPremium } = usePremium();
  const { showAd, canShowAd } = useInterstitialAds();
  const snapPoints = useMemo(() => ['60%', '100%'], []);
  const { width: screenWidth } = Dimensions.get('window');
  const [imageLoading, setImageLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    zones: false,
    strategies: false,
    hazards: false,
    features: false,
  });
  
  // Track first map open per session for interstitial ad
  const [firstMapViewThisSession, setFirstMapViewThisSession] = useState(true);
  const [detailOpenTime, setDetailOpenTime] = useState<number | null>(null);

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
      setDetailOpenTime(Date.now()); // Start engagement timer
      
      // Show ad on first map view this session (if conditions allow)
      if (firstMapViewThisSession && !isPremium && canShowAd()) {
        setTimeout(async () => {
          await showAd();
          setFirstMapViewThisSession(false);
        }, 1000); // Delay to let map load
      }
    }
  }, [isVisible, map, firstMapViewThisSession, isPremium, canShowAd, showAd]);

  // Handle close and track deep engagement
  useEffect(() => {
    if (!isVisible && detailOpenTime) {
      const timeSpent = Date.now() - detailOpenTime;
      if (timeSpent > 5000) {
        console.log(`[MapDetail] Deep engagement (${Math.floor(timeSpent / 1000)}s spent)`);
      }
      setDetailOpenTime(null);
    }
  }, [isVisible, detailOpenTime]);

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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
      animationConfigs={{
        damping: 80,
        mass: 1.2,
        overshootClamping: true,
      }}
      animatedPosition={undefined}
      animatedIndex={undefined}
      style={{ borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: 'hidden' }}
      backgroundComponent={() => (
        <BlurView intensity={94} tint="dark" style={StyleSheet.absoluteFillObject} />
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
                  {getDifficultyLabel(map.difficulty, language)}
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
            <ThemedText style={styles.statLabel}>{t('componentLabels.rooms')}</ThemedText>
          </View>
          <View style={styles.statCard}>
            <Ionicons size={20} name="people-outline" color={colors.spectral} />
            <ThemedText style={styles.statValue}>{map.maxPlayers}</ThemedText>
            <ThemedText style={styles.statLabel}>{t('componentLabels.players')}</ThemedText>
          </View>
          <View style={styles.statCard}>
            <Ionicons
              size={20}
              name={map.characteristics.fuse ? 'flash' : 'close'}
              color={map.characteristics.fuse ? '#FFB84D' : colors.tabIconDefault}
            />
            <ThemedText style={styles.statValue}>
              {map.characteristics.fuse ? t('componentLabels.yes') : t('componentLabels.no')}
            </ThemedText>
            <ThemedText style={styles.statLabel}>{t('componentLabels.fuse')}</ThemedText>
          </View>
        </View>

        {/* Description */}
        {map.description && (
          <>
            <ThemedText style={[styles.sectionTitle, { marginTop: 20, marginBottom: 12 }]}>
              {t('componentLabels.about')}
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
                {t('componentLabels.ghostSpawns')}
              </ThemedText>
              <ThemedText style={styles.description}>{map.characteristics.ghostSpawns}</ThemedText>
            </>
          )}

          {/* Lighting */}
          {map.characteristics.lighting && (
            <>
              <ThemedText style={[styles.sectionTitle, { marginTop: 20, marginBottom: 12 }]}>
                {t('componentLabels.lighting')}
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
                {t('componentLabels.floorPlan')}
              </ThemedText>
              <View style={{ marginHorizontal: -16, marginVertical: 12, paddingHorizontal: 16 }}>
                <FloorPlanViewer imageUrl={map.floorPlanUrl} mapName={map.name} />
              </View>
            </>
          )}
        </View>

        {/* Collapsible: Zones */}
        {map.zones && map.zones.length > 0 && (
          <CollapsibleSection
            title={`${t('componentLabels.zones')} (${map.zones.length})`}
            isExpanded={expandedSections.zones}
            onPress={() => toggleSection('zones')}
            backgroundColor={colors.spectral + '12'}
            borderColor={colors.spectral + '20'}
            headerBackgroundColor={colors.spectral + '12'}
            titleColor={colors.spectral}
            iconColor={colors.spectral}
          >
            <View style={{ gap: 12 }}>
              {map.zones.map((zone, idx) => (
                <View key={idx} style={[styles.zoneItem, { borderColor: colors.paranormal, borderLeftWidth: 3, paddingLeft: 12, paddingVertical: 12 }]}>
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
                  <ThemedText style={[styles.description, { marginBottom: 0 }]}>{zone.description}</ThemedText>
                </View>
              ))}
            </View>
          </CollapsibleSection>
        )}

        {/* Collapsible: Hazards */}
        {map.characteristics.hazards && map.characteristics.hazards.length > 0 && (
          <CollapsibleSection
            title={`${t('componentLabels.hazards')} (${map.characteristics.hazards.length})`}
            isExpanded={expandedSections.hazards}
            onPress={() => toggleSection('hazards')}
            backgroundColor={colors.spectral + '12'}
            borderColor={colors.spectral + '20'}
            headerBackgroundColor={colors.spectral + '12'}
            titleColor={colors.spectral}
            iconColor={colors.spectral}
          >
            <View style={[styles.tagsContainer, { gap: 8 }]}>
              {map.characteristics.hazards.map((hazard, idx) => (
                <View key={idx} style={[styles.hazardTag, { backgroundColor: '#FF4444' + '20' }]}>
                  <Ionicons size={14} name="warning-outline" color="#FF4444" />
                  <ThemedText style={[styles.tagText, { color: '#FF4444' }]}>{hazard}</ThemedText>
                </View>
              ))}
            </View>
          </CollapsibleSection>
        )}

        {/* Collapsible: Special Features */}
        {map.characteristics.specialFeatures && map.characteristics.specialFeatures.length > 0 && (
          <CollapsibleSection
            title={`${t('componentLabels.specialFeatures')} (${map.characteristics.specialFeatures.length})`}
            isExpanded={expandedSections.features}
            onPress={() => toggleSection('features')}
            backgroundColor={colors.spectral + '12'}
            borderColor={colors.spectral + '20'}
            headerBackgroundColor={colors.spectral + '12'}
            titleColor={colors.spectral}
            iconColor={colors.spectral}
          >
            <View style={[styles.tagsContainer, { gap: 8 }]}>
              {map.characteristics.specialFeatures.map((feature, idx) => (
                <View key={idx} style={[styles.featureTag, { backgroundColor: colors.spectral + '20' }]}>
                  <Ionicons size={14} name="checkmark-circle" color={colors.spectral} />
                  <ThemedText style={[styles.tagText, { color: colors.spectral }]}>{feature}</ThemedText>
                </View>
              ))}
            </View>
          </CollapsibleSection>
        )}

        {/* Collapsible: Strategies & Tips */}
        {/* Collapsible: Strategies & Tips */}
        {(map.strategies || map.tips) && (
          <CollapsibleSection
            title={`${t('componentLabels.strategies')} & ${t('componentLabels.tips')}`}
            isExpanded={expandedSections.strategies}
            onPress={() => toggleSection('strategies')}
            backgroundColor={colors.spectral + '12'}
            borderColor={colors.spectral + '20'}
            headerBackgroundColor={colors.spectral + '12'}
            titleColor={colors.spectral}
            iconColor={colors.spectral}
          >
            <View style={{ gap: 16 }}>
              {/* Strategies */}
              {map.strategies && map.strategies.length > 0 && (
                <>
                  <ThemedText style={[styles.sectionTitle, { marginTop: 0, fontSize: 14 }]}>
                    {t('componentLabels.strategies')}
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
                  <ThemedText style={[styles.sectionTitle, { marginTop: 0, fontSize: 14 }]}>
                    {t('componentLabels.tips')}
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
                  <ThemedText style={[styles.sectionTitle, { marginTop: 0, fontSize: 14 }]}>
                    {t('componentLabels.soloTips')}
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
                  <ThemedText style={[styles.sectionTitle, { marginTop: 0, fontSize: 14 }]}>
                    {t('componentLabels.huntStrategy')}
                  </ThemedText>
                  <View style={[styles.strategyBox, { backgroundColor: colors.spectral + '15' }]}>
                    <MaterialIcons name="verified" size={20} color={colors.spectral} />
                    <ThemedText style={styles.strategyText}>{map.huntStrategy}</ThemedText>
                  </View>
                </>
              )}
            </View>
          </CollapsibleSection>
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
