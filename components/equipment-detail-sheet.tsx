import { Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useMemo, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { BookmarkButton } from '@/components/bookmark-button';
import { CollapsibleSection } from '@/components/collapsible-section';
import { detailSheetEmitter } from '@/components/haptic-tab';
import { ThemedText } from '@/components/themed-text';
import { Colors, EquipmentCategoryColors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useInterstitialAds } from '@/hooks/use-interstitial-ads';
import { useLocalization } from '@/hooks/use-localization';
import { usePremium } from '@/hooks/use-premium';
import { SYNERGIES } from '@/lib/data/equipment';
import { getEquipmentDescription, getEquipmentName, getEquipmentUsage } from '@/lib/localization';
import { HistoryService } from '@/lib/storage/storageService';
import { Equipment } from '@/lib/types';

interface EquipmentDetailSheetProps {
  equipment: Equipment | null;
  isVisible: boolean;
  onClose: () => void;
}

export const EquipmentDetailSheet = ({ equipment, isVisible, onClose }: EquipmentDetailSheetProps) => {
  const colorScheme = useColorScheme();
  const colors = Colors['dark'];
  const { language, t } = useLocalization();
  const { isPremium } = usePremium();
  const { showAd, canShowAd } = useInterstitialAds();
  const snapPoints = useMemo(() => ['60%', '100%'], []);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    tiers: false,
    evidence: false,
    synergies: false,
    recommended: false,
  });
  
  // Engagement tracking for interstitial ads
  const [detailOpenTime, setDetailOpenTime] = useState<number | null>(null);
  const [deepViewCount, setDeepViewCount] = useState(0);

  // Close sheet when tab changes and reset expanded sections
  useEffect(() => {
    const unsubscribe = detailSheetEmitter.subscribe(() => {
      // Reset all sections before closing
      setExpandedSections({
        tiers: false,
        evidence: false,
        synergies: false,
        recommended: false,
      });
      onClose();
    });
    return unsubscribe;
  }, [onClose]);

  // Track view when equipment is shown
  useEffect(() => {
    if (isVisible && equipment) {
      HistoryService.trackView('equipment', equipment.id, equipment.name);
      setDetailOpenTime(Date.now()); // Start engagement timer
    }
  }, [isVisible, equipment]);

  // Handle close and check for ad opportunity
  useEffect(() => {
    if (!isVisible && detailOpenTime) {
      const timeSpent = Date.now() - detailOpenTime;
      
      // Only count as "engaged" if spent 5+ seconds reading
      if (timeSpent > 5000) {
        const newCount = deepViewCount + 1;
        setDeepViewCount(newCount);
        
        // Show ad after every 3 deep views (respects frequency caps)
        // IMPORTANT: Don't show ad while sheet is animating - wait longer to avoid memory issues
        if (newCount % 3 === 0 && !isPremium && canShowAd()) {
          setTimeout(async () => {
            try {
              await showAd();
            } catch (error) {
              console.error('[EquipmentDetail] Error showing ad:', error);
            }
          }, 1500); // Increased delay to let animations complete
        }
        
        console.log(`[EquipmentDetail] Engaged view ${newCount} (${Math.floor(timeSpent / 1000)}s spent)`);
      }
      
      setDetailOpenTime(null);
    }
  }, [isVisible, detailOpenTime, deepViewCount, isPremium, canShowAd, showAd]);

  // Reset sections when sheet becomes invisible
  useEffect(() => {
    if (!isVisible) {
      setExpandedSections({
        tiers: false,
        evidence: false,
        synergies: false,
        recommended: false,
      });
    }
  }, [isVisible]);

  const getCategoryColor = (category: string) => {
    return EquipmentCategoryColors[category as keyof typeof EquipmentCategoryColors] || colors.text;
  };

  const getCategoryIcon = (category: string): string => {
    switch (category) {
      case 'starter':
        return 'play';
      case 'optional':
        return 'star';
      case 'truck':
        return 'car';
      case 'cursed':
        return 'skull';
      default:
        return 'grid';
    }
  };

  const getTypeIcon = (type: string): string => {
    switch (type) {
      case 'camera':
        return 'camera';
      case 'audio':
        return 'volume-high';
      case 'detector':
        return 'radio';
      case 'consumable':
        return 'flash';
      case 'protective':
        return 'shield';
      case 'utility':
        return 'hammer';
      case 'cursed':
        return 'skull';
      default:
        return 'help-circle';
    }
  };

  if (!equipment) return null;

  const toggleSection = (section: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const equipmentSynergies = SYNERGIES[equipment.id as keyof typeof SYNERGIES] || [];

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
      style={{ borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: 'hidden' }}
      backgroundComponent={() => (
        <BlurView intensity={94} tint="dark" style={StyleSheet.absoluteFillObject} />
      )}
      handleIndicatorStyle={{ backgroundColor: colors.spectral }}
    >
      <BottomSheetScrollView
        style={{ flex: 1, paddingHorizontal: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Equipment Image - Compact */}
        <View style={[styles.imageContainer, { backgroundColor: colors.haunted + '30' }]}>
          {equipment.imageUrl ? (
            <Image
              source={{ uri: equipment.imageUrl }}
              style={styles.equipmentImage}
              onError={(error) => console.log('Image load error:', error)}
            />
          ) : (
            <ThemedText style={{ color: colors.text + '80', fontSize: 16 }}>No image available</ThemedText>
          )}
        </View>

        {/* Header: Name + Badges + Bookmark */}
        <View style={styles.headerRow}>
          <ThemedText style={styles.bottomSheetTitle}>{equipment.name}</ThemedText>
          <BookmarkButton
            itemId={equipment.id}
            itemType="equipment"
            itemName={equipment.name}
            size={28}
            color={colors.spectral}
          />
        </View>
        <View style={styles.badgeContainer}>
          <View
            style={[
              styles.categoryBadge,
              {
                backgroundColor: getCategoryColor(equipment.category) + '20',
                borderColor: getCategoryColor(equipment.category),
                borderWidth: 1,
              },
            ]}
          >
            <Ionicons size={14} name={getCategoryIcon(equipment.category) as any} color={getCategoryColor(equipment.category)} />
            <ThemedText style={[styles.badgeText, { color: getCategoryColor(equipment.category) }]}>
              {equipment.category.replace('_', ' ').charAt(0).toUpperCase() + equipment.category.replace('_', ' ').slice(1)}
            </ThemedText>
          </View>
          <View
            style={[
              styles.typeBadge,
              {
                backgroundColor: getCategoryColor(equipment.category) + '20',
                borderColor: getCategoryColor(equipment.category),
                borderWidth: 1,
              },
            ]}
          >
            <Ionicons size={14} name={getTypeIcon(equipment.type) as any} color={getCategoryColor(equipment.category)}/>
            <ThemedText style={[styles.badgeText, { color: getCategoryColor(equipment.category) }]}>
              {equipment.type.charAt(0).toUpperCase() + equipment.type.slice(1)}
            </ThemedText>
          </View>
        </View>

        {/* Quick Stats - 2x2 Grid */}
        <View style={styles.quickStatsGrid}>
          {equipment.cost !== undefined && (
            <View style={[styles.quickStatBox, { backgroundColor: colors.spectral + '12' }]}>
              <ThemedText style={styles.quickStatLabel}>{t('componentLabels.cost')}</ThemedText>
              <ThemedText style={styles.quickStatValue}>
                {equipment.cost > 0 ? `$${equipment.cost}` : t('componentLabels.free')}
              </ThemedText>
            </View>
          )}
          {equipment.capacity !== undefined && (
            <View style={[styles.quickStatBox, { backgroundColor: colors.spectral + '12' }]}>
              <ThemedText style={styles.quickStatLabel}>{t('componentLabels.capacity')}</ThemedText>
              <ThemedText style={styles.quickStatValue}>{equipment.capacity}</ThemedText>
            </View>
          )}
          {equipment.unlocksAtLevel !== undefined && (
            <View style={[styles.quickStatBox, { backgroundColor: colors.spectral + '12' }]}>
              <ThemedText style={styles.quickStatLabel}>{t('componentLabels.unlocks')}</ThemedText>
              <ThemedText style={styles.quickStatValue}>{t('componentLabels.level')} {equipment.unlocksAtLevel}</ThemedText>
            </View>
          )}
        </View>

        {/* Consumable Badge - Styled */}
        {equipment.consumable !== undefined && (
          <View
            style={[
              styles.consumableBadge,
              {
                backgroundColor: equipment.consumable ? '#FFB84D' + '20' : colors.spectral + '20',
                borderColor: equipment.consumable ? '#FFB84D' : colors.spectral,
                borderWidth: 1,
              },
            ]}
          >
            <Ionicons
              size={14}
              name={equipment.consumable ? 'flame' : 'repeat'}
              color={equipment.consumable ? '#FFB84D' : colors.spectral}
            />
            <ThemedText style={[styles.badgeText, { color: equipment.consumable ? '#FFB84D' : colors.spectral }]}>
              {equipment.consumable ? t('componentLabels.consumable') : t('componentLabels.reusable')}
            </ThemedText>
          </View>
        )}

        {/* Description - Key Info Only */}
        <ThemedText style={styles.sectionTitle}>{t('componentLabels.about')}</ThemedText>
        <ThemedText style={styles.description}>{getEquipmentDescription(equipment.id, language)}</ThemedText>

        {/* Usage - Key Info Only */}
        <ThemedText style={styles.sectionTitle}>{t('componentLabels.howToUse')}</ThemedText>
        <ThemedText style={styles.description}>{getEquipmentUsage(equipment.id, language)}</ThemedText>

        {/* Evidence Detection - Always Show (if applicable) */}
        {equipment.detects && equipment.detects.length > 0 && (
          <>
            <ThemedText style={styles.sectionTitle}>{t('componentLabels.detectsEvidence')}</ThemedText>
            <View style={styles.evidenceBadges}>
              {equipment.detects.map((evidence) => (
                <View key={evidence} style={[styles.evidenceBadge, { backgroundColor: colors.spectral + '20' }]}>
                  <ThemedText style={styles.evidenceText}>{evidence}</ThemedText>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Collapsible: Tiers */}
        {equipment.tiers && equipment.tiers.length > 0 && (
          <CollapsibleSection
            title={t('componentLabels.upgradeTiers')}
            isExpanded={expandedSections.tiers}
            onPress={() => toggleSection('tiers')}
            backgroundColor={colors.spectral + '12'}
            borderColor={colors.spectral + '20'}
            headerBackgroundColor={colors.spectral + '12'}
            titleColor={colors.spectral}
            iconColor={colors.spectral}
          >
            <View style={{ gap: 8 }}>
              {equipment.tiers.map((tier, idx) => (
                <View key={idx} style={[styles.tierItem, { borderColor: colors.paranormal }]}>
                  <ThemedText style={styles.tierLabel}>Tier {idx + 1}</ThemedText>
                  <View style={styles.tierDetails}>
                    <View style={styles.tierDetail}>
                      <ThemedText style={styles.tierDetailLabel}>{t('componentLabels.level')}:</ThemedText>
                      <ThemedText style={styles.tierDetailValue}>{tier.level}</ThemedText>
                    </View>
                    <View style={styles.tierDetail}>
                      <ThemedText style={styles.tierDetailLabel}>{t('componentLabels.cost')}:</ThemedText>
                      <ThemedText style={styles.tierDetailValue}>${tier.upgradeCost.toLocaleString()}</ThemedText>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </CollapsibleSection>
        )}

        {/* Collapsible: Synergies */}
        {equipmentSynergies.length > 0 && (
          <CollapsibleSection
            title={`${t('componentLabels.synergies')} (${equipmentSynergies.length})`}
            isExpanded={expandedSections.synergies}
            onPress={() => toggleSection('synergies')}
            backgroundColor={colors.spectral + '12'}
            borderColor={colors.spectral + '20'}
            headerBackgroundColor={colors.spectral + '12'}
            titleColor={colors.spectral}
            iconColor={colors.spectral}
          >
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {equipmentSynergies.map((synergyId) => (
                <View key={synergyId} style={[styles.synergy, { backgroundColor: colors.spectral + '15' }]}>
                  <Ionicons size={14} name="link" color={colors.spectral} />
                  <ThemedText style={[styles.synergyText, { marginLeft: 6 }]}>
                    {getEquipmentName(synergyId, language)}
                  </ThemedText>
                </View>
              ))}
            </View>
          </CollapsibleSection>
        )}

        {/* Collapsible: Recommended For */}
        {equipment.recommendedFor && equipment.recommendedFor.length > 0 && (
          <CollapsibleSection
            title={`${t('componentLabels.bestFor')} (${equipment.recommendedFor.length})`}
            isExpanded={expandedSections.recommended}
            onPress={() => toggleSection('recommended')}
            backgroundColor={colors.spectral + '12'}
            borderColor={colors.spectral + '20'}
            headerBackgroundColor={colors.spectral + '12'}
            titleColor={colors.spectral}
            iconColor={colors.spectral}
          >
            <View style={{ gap: 8 }}>
              {equipment.recommendedFor.map((recommendation, idx) => (
                <View key={idx} style={styles.recommendationItem}>
                  <ThemedText style={styles.recommendationBullet}>•</ThemedText>
                  <ThemedText style={styles.recommendationText}>{recommendation}</ThemedText>
                </View>
              ))}
            </View>
          </CollapsibleSection>
        )}

        <View style={{ height: 20 }} />
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 16,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  equipmentImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  bottomSheetTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 12, color: '#00D9FF', flex: 1 },
  badgeContainer: { flexDirection: 'row', gap: 8, marginBottom: 18, flexWrap: 'wrap' },
  categoryBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, flexDirection: 'row', alignItems: 'center', gap: 6 },
  typeBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, flexDirection: 'row', alignItems: 'center', gap: 6 },
  consumableBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 },
  badgeText: { color: 'white', fontWeight: '600', fontSize: 12 },

  // Quick Stats Grid - Prominent
  quickStatsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  quickStatBox: {
    flex: 1,
    minWidth: '48%',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  quickStatLabel: { fontSize: 11, fontWeight: '600', opacity: 0.7, marginBottom: 6 },
  quickStatValue: { fontSize: 16, fontWeight: '700' },

  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 20, marginBottom: 12, color: '#00D9FF' },
  description: { fontSize: 13, lineHeight: 20, marginBottom: 12, opacity: 0.85 },

  collapsibleHeader: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 12, borderRadius: 8, marginBottom: 8 },

  evidenceBadges: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  evidenceBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  evidenceText: { fontSize: 12, fontWeight: '500' },

  tierItem: { marginBottom: 12, paddingBottom: 12, paddingLeft: 12, borderLeftWidth: 3 },
  tierLabel: { fontWeight: '600', marginBottom: 6, fontSize: 14 },
  tierDetails: { flexDirection: 'row', gap: 16 },
  tierDetail: { flex: 1 },
  tierDetailLabel: { fontSize: 11, opacity: 0.7, marginBottom: 2 },
  tierDetailValue: { fontSize: 13, fontWeight: '600' },

  synergies: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12, paddingLeft: 0 },
  synergy: { flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  synergyText: { fontSize: 12, fontWeight: '500', textTransform: 'capitalize' },

  recommendationItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 8, paddingLeft: 0 },
  recommendationBullet: { fontSize: 16, fontWeight: 'bold', marginTop: -2, color: '#00D9FF' },
  recommendationText: { flex: 1, fontSize: 13, lineHeight: 18 },
});
