import { Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import React, { useMemo } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { SYNERGIES } from '@/lib/data/equipment';
import { Equipment } from '@/lib/types';

interface EquipmentDetailSheetProps {
  equipment: Equipment | null;
  isVisible: boolean;
  onClose: () => void;
}

export const EquipmentDetailSheet = ({ equipment, isVisible, onClose }: EquipmentDetailSheetProps) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const snapPoints = useMemo(() => ['60%', '95%'], []);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'starter':
        return '#1FB46B';
      case 'optional':
        return '#00D9FF';
      case 'truck':
        return '#FFB84D';
      case 'cursed':
        return '#6B4AAC';
      default:
        return colors.text;
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

  const equipmentSynergies = SYNERGIES[equipment.id as keyof typeof SYNERGIES] || [];

  return (
    <BottomSheet
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      onClose={onClose}
      index={isVisible ? 0 : -1}
      animateOnMount={true}
      backgroundStyle={{ backgroundColor: colors.surface }}
      handleIndicatorStyle={{ backgroundColor: colors.spectral }}
    >
      <BottomSheetScrollView
        style={{ flex: 1, paddingHorizontal: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Equipment Image */}
        {equipment.imageUrl ? (
          <View style={[styles.imageContainer, { backgroundColor: colors.haunted + '30' }]}>
            <Image
              source={{ uri: equipment.imageUrl }}
              style={styles.equipmentImage}
              onError={(error) => console.log('Image load error:', error)}
            />
          </View>
        ) : null}

        <ThemedText style={styles.bottomSheetTitle}>{equipment.name}</ThemedText>
        
        <View style={styles.badgeContainer}>
          <View
            style={[
              styles.categoryBadge,
              { backgroundColor: getCategoryColor(equipment.category) },
            ]}
          >
            <ThemedText style={styles.badgeText}>
              {equipment.category.replace('_', ' ')}
            </ThemedText>
          </View>
          <View
            style={[
              styles.typeBadge,
              { backgroundColor: colors.spectral },
            ]}
          >
            <Ionicons size={14} name={getTypeIcon(equipment.type) as any} color="white" />
            <ThemedText style={[styles.badgeText, { marginLeft: 4 }]}>
              {equipment.type}
            </ThemedText>
          </View>
        </View>

        <ThemedText style={styles.sectionTitle}>Description</ThemedText>
        <ThemedText style={styles.description}>{equipment.description}</ThemedText>

        <ThemedText style={styles.sectionTitle}>Usage</ThemedText>
        <ThemedText style={styles.description}>{equipment.usage}</ThemedText>

        <View style={styles.statsContainer}>
          <ThemedText style={styles.sectionTitle}>Stats</ThemedText>
          <View style={styles.statsGrid}>
            {equipment.cost !== undefined && (
              <View style={[styles.statBox, { borderColor: colors.tabIconDefault + '30' }]}>
                <ThemedText style={styles.statLabel}>Cost</ThemedText>
                <ThemedText style={styles.statValue}>
                  {equipment.cost > 0 ? `$${equipment.cost}` : 'Free'}
                </ThemedText>
              </View>
            )}
            {equipment.capacity !== undefined && (
              <View style={[styles.statBox, { borderColor: colors.tabIconDefault + '30' }]}>
                <ThemedText style={styles.statLabel}>Capacity</ThemedText>
                <ThemedText style={styles.statValue}>{equipment.capacity}</ThemedText>
              </View>
            )}
            {equipment.unlocksAtLevel !== undefined && (
              <View style={[styles.statBox, { borderColor: colors.tabIconDefault + '30' }]}>
                <ThemedText style={styles.statLabel}>Unlocks</ThemedText>
                <ThemedText style={styles.statValue}>Level {equipment.unlocksAtLevel}</ThemedText>
              </View>
            )}
            {equipment.consumable !== undefined && (
              <View style={[styles.statBox, { borderColor: colors.tabIconDefault + '30' }]}>
                <ThemedText style={styles.statLabel}>Type</ThemedText>
                <ThemedText style={styles.statValue}>
                  {equipment.consumable ? 'Consumable' : 'Reusable'}
                </ThemedText>
              </View>
            )}
          </View>
        </View>

        {equipment.detects && equipment.detects.length > 0 && (
          <>
            <ThemedText style={styles.sectionTitle}>Detects Evidence</ThemedText>
            <View style={styles.evidenceBadges}>
              {equipment.detects.map((evidence) => (
                <View key={evidence} style={[styles.evidenceBadge, { backgroundColor: colors.spectral + '20' }]}>
                  <ThemedText style={styles.evidenceText}>{evidence}</ThemedText>
                </View>
              ))}
            </View>
          </>
        )}

        {equipment.tiers && equipment.tiers.length > 0 && (
          <>
            <ThemedText style={styles.sectionTitle}>Tiers</ThemedText>
            {equipment.tiers.map((tier, idx) => (
              <View key={idx} style={[styles.tierItem, { borderColor: colors.paranormal }]}>
                <ThemedText style={styles.tierLabel}>Tier {idx + 1}</ThemedText>
                <View style={styles.tierDetails}>
                  <View style={styles.tierDetail}>
                    <ThemedText style={styles.tierDetailLabel}>Level:</ThemedText>
                    <ThemedText style={styles.tierDetailValue}>{tier.level}</ThemedText>
                  </View>
                  <View style={styles.tierDetail}>
                    <ThemedText style={styles.tierDetailLabel}>Cost:</ThemedText>
                    <ThemedText style={styles.tierDetailValue}>${tier.upgradeCost.toLocaleString()}</ThemedText>
                  </View>
                </View>
              </View>
            ))}
          </>
        )}

        {equipmentSynergies.length > 0 && (
          <>
            <ThemedText style={styles.sectionTitle}>Synergies</ThemedText>
            <ThemedText style={[styles.description, { marginBottom: 12 }]}>
              Works great with these items:
            </ThemedText>
            <View style={styles.synergies}>
              {equipmentSynergies.map((synergyId) => (
                <View key={synergyId} style={[styles.synergy, { backgroundColor: colors.spectral + '15' }]}>
                  <Ionicons size={14} name="link" color={colors.spectral} />
                  <ThemedText style={[styles.synergyText, { marginLeft: 6 }]}>
                    {synergyId.replace('-', ' ')}
                  </ThemedText>
                </View>
              ))}
            </View>
          </>
        )}

        {equipment.recommendedFor && equipment.recommendedFor.length > 0 && (
          <>
            <ThemedText style={styles.sectionTitle}>Recommended For</ThemedText>
            {equipment.recommendedFor.map((recommendation, idx) => (
              <View key={idx} style={styles.recommendationItem}>
                <ThemedText style={styles.recommendationBullet}>•</ThemedText>
                <ThemedText style={styles.recommendationText}>{recommendation}</ThemedText>
              </View>
            ))}
          </>
        )}

        <View style={{ height: 20 }} />
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 16,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#6B4AAC',
  },
  equipmentImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  bottomSheetTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 12, color: '#00D9FF' },
  badgeContainer: { flexDirection: 'row', gap: 8, marginBottom: 16, flexWrap: 'wrap' },
  categoryBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  typeBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, flexDirection: 'row', alignItems: 'center' },
  badgeText: { color: 'white', fontWeight: '600', fontSize: 12 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 16, marginBottom: 8, color: '#00D9FF' },
  description: { fontSize: 13, lineHeight: 20, marginBottom: 8 },
  statsContainer: { marginBottom: 8 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 12 },
  statBox: { 
    flex: 1, 
    minWidth: '45%', 
    borderWidth: 1, 
    borderRadius: 8, 
    padding: 12,
    alignItems: 'center',
    borderColor: '#3D3847',
  },
  statLabel: { fontSize: 11, opacity: 0.7, marginBottom: 4 },
  statValue: { fontSize: 14, fontWeight: '600' },
  evidenceBadges: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  evidenceBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  evidenceText: { fontSize: 12, fontWeight: '500' },
  tierItem: { marginBottom: 12, paddingBottom: 12, paddingLeft: 12, borderLeftWidth: 3 },
  tierLabel: { fontWeight: '600', marginBottom: 6, fontSize: 14 },
  tierDetails: { flexDirection: 'row', gap: 16 },
  tierDetail: { flex: 1 },
  tierDetailLabel: { fontSize: 11, opacity: 0.7, marginBottom: 2 },
  tierDetailValue: { fontSize: 13, fontWeight: '600' },
  synergies: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  synergy: { flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  synergyText: { fontSize: 12, fontWeight: '500', textTransform: 'capitalize' },
  recommendationItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 8 },
  recommendationBullet: { fontSize: 16, fontWeight: 'bold', marginTop: -2, color: '#00D9FF' },
  recommendationText: { flex: 1, fontSize: 13, lineHeight: 18 },
});
