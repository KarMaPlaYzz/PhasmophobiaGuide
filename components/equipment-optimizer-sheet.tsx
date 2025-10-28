import { Ionicons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { BlurView } from 'expo-blur';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import React, { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { CollapsibleSection } from '@/components/collapsible-section';
import { EquipmentDetailSheet } from '@/components/equipment-detail-sheet';
import { LoadoutPresetSheet } from '@/components/loadout-preset-sheet';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useInterstitialAds } from '@/hooks/use-interstitial-ads';
import { useLocalization } from '@/hooks/use-localization';
import { usePremium } from '@/hooks/use-premium';
import { useRewardedAds } from '@/hooks/use-rewarded-ads';
import { ALL_EQUIPMENT } from '@/lib/data/equipment';
import { PLAYSTYLE_PROFILES } from '@/lib/data/equipment-optimizer';
import { GHOSTS } from '@/lib/data/ghosts';
import { Equipment, Playstyle } from '@/lib/types';
import { generateOptimalLoadout } from '@/lib/utils/equipment-optimizer';

interface EquipmentOptimizerSheetProps {
  isVisible: boolean;
  onClose: () => void;
}

const formatEquipmentName = (name: string): string => {
  return name
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const EquipmentOptimizerSheet = ({
  isVisible,
  onClose,
}: EquipmentOptimizerSheetProps) => {
  const colors = Colors['dark'];
  const { t } = useLocalization();
  const { isPremium, handlePurchase, isPurchasing } = usePremium();
  const { showAd, isLoading: isAdLoading, error: adError, dismissError } = useRewardedAds();
  const { showAd: showInterstitial, canShowAd: canShowInterstitial } = useInterstitialAds();
  const snapPoints = useMemo(() => ['80%', '100%'], []);

  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | undefined>(undefined);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [showEquipmentDetail, setShowEquipmentDetail] = useState(false);
  const [showGaps, setShowGaps] = useState(false);
  const [expandedAdvanced, setExpandedAdvanced] = useState(false);
  const [expandedEssential, setExpandedEssential] = useState(true);
  const [expandedRecommended, setExpandedRecommended] = useState(true);
  const [isPresetSheetVisible, setIsPresetSheetVisible] = useState(false);

  const [selectedPlaystyle, setSelectedPlaystyle] = useState<Playstyle>('balanced');
  const [budget, setBudget] = useState(800);
  const [selectedGhost, setSelectedGhost] = useState<string | undefined>(undefined);
  const [selectedMapSize, setSelectedMapSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'>('Intermediate');

  const recommendation = useMemo(() => {
    return generateOptimalLoadout(budget, selectedPlaystyle, selectedGhost, selectedMapSize, selectedDifficulty);
  }, [budget, selectedPlaystyle, selectedGhost, selectedMapSize, selectedDifficulty]);

  const allGhosts = Object.values(GHOSTS);
  const playstyles = Object.values(PLAYSTYLE_PROFILES);

  return (
    <>
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
        <BlurView intensity={90} tint="dark" style={StyleSheet.absoluteFillObject} />
      )}
      handleIndicatorStyle={{ backgroundColor: colors.spectral }}
    >
      <BottomSheetScrollView
        style={{ flex: 1, paddingHorizontal: 16 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 32 }}
      >
        {!isPremium ? (
          <View style={styles.premiumPaywall}>
            <MaterialIcons name="lock" size={48} color={colors.spectral} />
            <ThemedText style={styles.premiumTitle}>Feature Locked</ThemedText>
            <ThemedText style={[styles.premiumDescription, { color: colors.text + '80' }]}>
              Equipment optimizer is a premium feature.
            </ThemedText>
            <Pressable
              onPress={handlePurchase}
              disabled={isPurchasing}
              style={[styles.premiumButton, { backgroundColor: colors.spectral, opacity: isPurchasing ? 0.6 : 1 }]}
            >
              <Ionicons name="diamond" size={20} color="white" />
              <ThemedText style={styles.premiumButtonText}>
                {isPurchasing ? 'Processing...' : 'Unlock Premium - $2.99'}
              </ThemedText>
            </Pressable>
            <View style={styles.divider} />
            <Pressable
              onPress={async () => {
                try {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  const shown = await showAd();
                  if (shown) {
                    // Show interstitial after user watches rewarded ad (if frequency caps allow)
                    if (canShowInterstitial()) {
                      setTimeout(async () => {
                        await showInterstitial();
                      }, 500); // Delay to let user process the reward first
                    }
                    Alert.alert('Success!', 'You now have access to the Equipment Optimizer!');
                  }
                } catch (err) {
                  Alert.alert('Error', 'Failed to show ad. Please try again.');
                }
              }}
              disabled={isAdLoading}
              style={[styles.premiumButtonSecondary, { borderColor: colors.spectral, opacity: isAdLoading ? 0.6 : 1 }]}
            >
              <Ionicons name="play" size={20} color={colors.spectral} />
              <ThemedText style={[styles.premiumButtonSecondaryText, { color: colors.spectral }]}>
                {isAdLoading ? 'Loading...' : 'Watch Ad to Unlock'}
              </ThemedText>
            </Pressable>
          </View>
        ) : (
          <>
            <View style={styles.header}>
              <View style={{ flex: 1 }}>
                <ThemedText style={styles.title}>Equipment Optimizer</ThemedText>
                <ThemedText style={styles.subtitle}>Get the optimal loadout for your playstyle</ThemedText>
              </View>
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  setIsPresetSheetVisible(true);
                }}
                style={({ pressed }) => [
                  styles.presetButton,
                  { opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <Ionicons name="save" size={20} color={colors.spectral} />
              </Pressable>
            </View>

            {/* Playstyle Selection */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <MaterialIcons name="person" size={20} color={colors.spectral} />
                <View style={{ flex: 1 }}>
                  <ThemedText style={styles.sectionTitle}>Your Playstyle</ThemedText>
                  <ThemedText style={styles.sectionHelper}>Choose how you play</ThemedText>
                </View>
              </View>
              <View style={styles.playstyleGrid}>
                {playstyles.map((playstyle) => (
                  <Pressable
                    key={playstyle.id}
                    onPress={() => {
                      setSelectedPlaystyle(playstyle.id as Playstyle);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    }}
                    style={({ pressed }) => [
                      styles.playstyleCard,
                      selectedPlaystyle === playstyle.id && {
                        backgroundColor: colors.spectral + '20',
                        borderColor: colors.spectral,
                        borderWidth: 2,
                      },
                      selectedPlaystyle !== playstyle.id && {
                        borderWidth: 1,
                        borderColor: colors.border,
                      },
                      pressed && { opacity: 0.7 },
                    ]}
                  >
                    <ThemedText style={styles.playstyleEmoji}>{playstyle.emoji}</ThemedText>
                    <ThemedText style={styles.playstyleName}>{playstyle.name}</ThemedText>
                    <ThemedText style={styles.playstyleDesc} numberOfLines={2}>{playstyle.description}</ThemedText>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Budget Selection */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <MaterialIcons name="attach-money" size={20} color={colors.spectral} />
                <View style={{ flex: 1 }}>
                  <ThemedText style={styles.sectionTitle}>Budget</ThemedText>
                  <ThemedText style={styles.sectionHelper}>How much do you want to spend?</ThemedText>
                </View>
              </View>
              <View style={[styles.budgetCard, { backgroundColor: colors.spectral + '15', borderColor: colors.spectral + '30' }]}>
                <ThemedText style={styles.budgetLabel}>Total</ThemedText>
                <ThemedText style={styles.budgetAmount}>${budget}</ThemedText>
              </View>
              <View style={styles.budgetButtonGrid}>
                {[250, 500, 800, 1200, 2000].map((preset) => (
                  <Pressable
                    key={preset}
                    onPress={() => { setBudget(preset); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
                    style={[
                      styles.budgetButton,
                      budget === preset && { backgroundColor: colors.spectral },
                      budget !== preset && { backgroundColor: colors.spectral + '10' },
                    ]}
                  >
                    <ThemedText style={[styles.budgetButtonText, budget === preset && { color: 'white', fontWeight: '700' }]}>
                      {preset === 250 ? 'Min' : preset === 2000 ? 'Max' : `$${preset}`}
                    </ThemedText>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Ghost Type (Optional) */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <MaterialIcons name="pets" size={20} color={colors.tabIconDefault} />
                <View style={{ flex: 1 }}>
                  <ThemedText style={styles.sectionTitle}>Specific Ghost? (Optional)</ThemedText>
                  <ThemedText style={styles.sectionHelper}>Leave empty for general loadout</ThemedText>
                </View>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.ghostList}>
                <Pressable onPress={() => { setSelectedGhost(undefined); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }} style={[styles.ghostButton, !selectedGhost && { backgroundColor: colors.spectral }]}>
                  <ThemedText style={[styles.ghostButtonText, !selectedGhost && { color: 'white', fontWeight: '700' }]}>All</ThemedText>
                </Pressable>
                {allGhosts.slice(0, 15).map((ghost) => (
                  <Pressable
                    key={ghost.id}
                    onPress={() => { setSelectedGhost(ghost.id); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
                    style={[styles.ghostButton, selectedGhost === ghost.id && { backgroundColor: colors.spectral }]}
                  >
                    <ThemedText style={[styles.ghostButtonText, selectedGhost === ghost.id && { color: 'white', fontWeight: '700' }]}>{ghost.name.split(' ')[0]}</ThemedText>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            {/* Advanced Settings */}
            <CollapsibleSection
              title="Advanced Settings (Optional)"
              isExpanded={expandedAdvanced}
              onPress={() => setExpandedAdvanced(!expandedAdvanced)}
              backgroundColor={colors.spectral + '08'}
              borderColor={colors.spectral + '20'}
              headerBackgroundColor={colors.spectral + '12'}
              titleColor={colors.spectral}
              iconColor={colors.spectral}
            >
              <View style={styles.optionGroup}>
                <ThemedText style={styles.optionLabel}>Map Size</ThemedText>
                <View style={styles.optionButtons}>
                  {(['small', 'medium', 'large'] as const).map((size) => (
                    <Pressable key={size} onPress={() => { setSelectedMapSize(size); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }} style={[styles.optionButton, selectedMapSize === size && { backgroundColor: colors.spectral, borderColor: colors.spectral }]}>
                      <ThemedText style={[styles.optionButtonText, selectedMapSize === size && { color: 'white', fontWeight: '700' }]}>{size === 'small' ? 'S' : size === 'medium' ? 'M' : 'L'}</ThemedText>
                    </Pressable>
                  ))}
                </View>
              </View>

              <View style={styles.optionGroup}>
                <ThemedText style={styles.optionLabel}>Difficulty</ThemedText>
                <Pressable
                  onPress={() => {
                    const difficulties: ('Beginner' | 'Intermediate' | 'Advanced' | 'Expert')[] = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
                    const idx = difficulties.indexOf(selectedDifficulty);
                    setSelectedDifficulty(difficulties[(idx + 1) % difficulties.length]);
                  }}
                  style={[styles.difficultyButton, { backgroundColor: colors.spectral + '15', borderColor: colors.spectral }]}
                >
                  <ThemedText style={styles.difficultyButtonText}>{selectedDifficulty}</ThemedText>
                  <MaterialIcons name="arrow-forward" size={14} color={colors.spectral} />
                </Pressable>
              </View>
            </CollapsibleSection>

            {/* Results */}
            {recommendation && (
              <View style={styles.resultsSection}>
                <View style={styles.sectionHeader}>
                  <MaterialIcons name="check-circle" size={20} color={colors.spectral} />
                  <View style={{ flex: 1 }}>
                    <ThemedText style={styles.sectionTitle}>Your Optimal Loadout</ThemedText>
                    <ThemedText style={styles.sectionHelper}>{recommendation.name}</ThemedText>
                  </View>
                </View>

                <View style={[styles.statsCard, { backgroundColor: colors.spectral + '15' }]}>
                  <View style={styles.stat}>
                    <ThemedText style={styles.statLabel}>Efficiency</ThemedText>
                    <ThemedText style={styles.statValue}>{recommendation.efficiency}%</ThemedText>
                  </View>
                  <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
                  <View style={styles.stat}>
                    <ThemedText style={styles.statLabel}>Cost</ThemedText>
                    <ThemedText style={styles.statValue}>${recommendation.totalCost}</ThemedText>
                  </View>
                  <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
                  <View style={styles.stat}>
                    <ThemedText style={styles.statLabel}>Left</ThemedText>
                    <ThemedText style={styles.statValue}>${budget - recommendation.totalCost}</ThemedText>
                  </View>
                </View>

                <View style={styles.actionButtons}>
                  <Pressable
                    onPress={async () => {
                      const text = `${recommendation.name}\n\n📦 Equipment:\n${[...recommendation.essential, ...recommendation.recommended].map((e) => `• ${formatEquipmentName(e)}`).join('\n')}\n\n💰 Cost: $${recommendation.totalCost}\n⭐ Efficiency: ${recommendation.efficiency}%`;
                      await Clipboard.setStringAsync(text);
                      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    }}
                    style={({ pressed }) => [styles.actionButton, { backgroundColor: colors.spectral + '15', opacity: pressed ? 0.6 : 1 }]}
                  >
                    <MaterialIcons name="content-copy" size={18} color={colors.spectral} />
                    <ThemedText style={[styles.actionButtonText, { color: colors.spectral }]}>Copy</ThemedText>
                  </Pressable>

                  {isPremium && (
                    <Pressable
                      onPress={() => {
                        console.log('[EquipmentOptimizerSheet] Save button pressed');
                        console.log('[EquipmentOptimizerSheet] Current loadout:', {
                          essential: recommendation.essential.length,
                          recommended: recommendation.recommended.length,
                        });
                        setIsPresetSheetVisible(true);
                      }}
                      style={({ pressed }) => [styles.actionButton, { backgroundColor: colors.spectral, opacity: pressed ? 0.8 : 1 }]}
                    >
                      <MaterialIcons name="save" size={18} color="white" />
                      <ThemedText style={[styles.actionButtonText, { color: 'white', fontWeight: '700' }]}>Save</ThemedText>
                    </Pressable>
                  )}
                </View>

                {recommendation.essential.length > 0 && (
                  <CollapsibleSection
                    title={`Must-Have (${recommendation.essential.length})`}
                    isExpanded={expandedEssential}
                    onPress={() => setExpandedEssential(!expandedEssential)}
                    backgroundColor={colors.spectral + '08'}
                    borderColor={colors.spectral + '20'}
                    headerBackgroundColor={colors.spectral + '12'}
                    titleColor={colors.spectral}
                    iconColor={colors.spectral}
                  >
                    {recommendation.essential.map((item, idx) => (
                      <Pressable
                        key={idx}
                        onPress={() => { 
                          const equipmentId = item?.trim?.() || item;
                          const equipment = ALL_EQUIPMENT[equipmentId as keyof typeof ALL_EQUIPMENT];
                          if (equipment) {
                            setSelectedEquipment(equipment);
                            setShowEquipmentDetail(true);
                            onClose();
                          }
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); 
                        }}
                        android_ripple={{ color: colors.spectral + '30' }}
                        style={({ pressed }) => [
                          styles.equipmentItem, 
                          pressed && { backgroundColor: colors.spectral + '20', opacity: 0.8 }
                        ]}
                      >
                        <View style={[styles.checkmark, { backgroundColor: colors.spectral + '25' }]}>
                          <MaterialIcons name="check" size={12} color={colors.spectral} />
                        </View>
                        <View style={{ flex: 1 }}>
                          <ThemedText style={styles.equipmentName}>{formatEquipmentName(item)}</ThemedText>
                          <ThemedText style={styles.equipmentHint}>Tap to learn more →</ThemedText>
                        </View>
                        <MaterialIcons name="info" size={14} color={colors.spectral + '60'} />
                      </Pressable>
                    ))}
                  </CollapsibleSection>
                )}

                {recommendation.recommended.length > 0 && (
                  <CollapsibleSection
                    title={`Recommended (${recommendation.recommended.length})`}
                    isExpanded={expandedRecommended}
                    onPress={() => setExpandedRecommended(!expandedRecommended)}
                    backgroundColor={colors.spectral + '08'}
                    borderColor={colors.spectral + '20'}
                    headerBackgroundColor={colors.spectral + '12'}
                    titleColor={colors.spectral}
                    iconColor={colors.spectral}
                  >
                    {recommendation.recommended.map((item, idx) => (
                      <Pressable
                        key={idx}
                        onPress={() => { 
                          const equipmentId = item?.trim?.() || item;
                          const equipment = ALL_EQUIPMENT[equipmentId as keyof typeof ALL_EQUIPMENT];
                          if (equipment) {
                            setSelectedEquipment(equipment);
                            setShowEquipmentDetail(true);
                            onClose();
                          }
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); 
                        }}
                        android_ripple={{ color: colors.spectral + '30' }}
                        style={({ pressed }) => [
                          styles.equipmentItem, 
                          pressed && { backgroundColor: colors.spectral + '20', opacity: 0.8 }
                        ]}
                      >
                        <View style={[styles.checkmark, { backgroundColor: colors.tabIconDefault + '20' }]}>
                          <MaterialIcons name="add" size={12} color={colors.tabIconDefault} />
                        </View>
                        <View style={{ flex: 1 }}>
                          <ThemedText style={styles.equipmentName}>{formatEquipmentName(item)}</ThemedText>
                          <ThemedText style={styles.equipmentHint}>Tap to learn more →</ThemedText>
                        </View>
                        <MaterialIcons name="info" size={14} color={colors.spectral + '60'} />
                      </Pressable>
                    ))}
                  </CollapsibleSection>
                )}

                {recommendation.explanation.length > 0 && (
                  <View style={[styles.infoBox, { backgroundColor: colors.spectral + '10', borderLeftColor: colors.spectral, borderLeftWidth: 4 }]}>
                    <View style={styles.infoBoxHeader}>
                      <MaterialIcons name="lightbulb" size={16} color={colors.spectral} />
                      <ThemedText style={styles.infoBoxTitle}>Why This?</ThemedText>
                    </View>
                    {recommendation.explanation.map((reason, idx) => (
                      <ThemedText key={idx} style={styles.infoBoxText}>• {reason}</ThemedText>
                    ))}
                  </View>
                )}

                {recommendation.gaps.length > 0 && (
                  <Pressable onPress={() => { setShowGaps(!showGaps); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }} style={[styles.infoBox, { backgroundColor: '#FF6B6B15', borderLeftColor: '#FF6B6B', borderLeftWidth: 4 }]}>
                    <View style={styles.infoBoxHeader}>
                      <MaterialIcons name={showGaps ? 'expand-less' : 'expand-more'} size={16} color="#FF6B6B" />
                      <ThemedText style={[styles.infoBoxTitle, { color: '#FF6B6B' }]}>Limitations ({recommendation.gaps.length})</ThemedText>
                    </View>
                    {showGaps && recommendation.gaps.map((gap, idx) => (
                      <ThemedText key={idx} style={[styles.infoBoxText, { color: colors.text }]}>• {gap}</ThemedText>
                    ))}
                  </Pressable>
                )}


              </View>
            )}
          </>
        )}
      </BottomSheetScrollView>
    </BottomSheet>

    <EquipmentDetailSheet
      equipment={selectedEquipment}
      isVisible={showEquipmentDetail}
      onClose={() => {
        setShowEquipmentDetail(false);
        setSelectedEquipment(null);
      }}
    />

    <LoadoutPresetSheet
      isVisible={isPresetSheetVisible}
      onClose={() => setIsPresetSheetVisible(false)}
      currentLoadout={recommendation}
    />
    </>
  );
};

const styles = StyleSheet.create({
  header: { marginBottom: 20, gap: 8, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  presetButton: { padding: 8, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '800', color: '#00D9FF', lineHeight: 36 },
  subtitle: { fontSize: 14, opacity: 0.6, fontWeight: '500' },
  section: { marginBottom: 20, gap: 12 },
  sectionHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', lineHeight: 22 },
  sectionHelper: { fontSize: 12, opacity: 0.6, fontWeight: '500' },
  stepBadge: { width: 32, height: 32, borderRadius: 8, justifyContent: 'center', alignItems: 'center', minWidth: 32 },
  stepNumber: { fontSize: 14, fontWeight: '800', color: 'white' },
  playstyleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  playstyleCard: { flex: 1, minWidth: '47%', paddingHorizontal: 12, paddingVertical: 12, borderRadius: 12, alignItems: 'center', gap: 8 },
  playstyleEmoji: { fontSize: 28 },
  playstyleName: { fontSize: 13, fontWeight: '700', textAlign: 'center' },
  playstyleDesc: { fontSize: 11, opacity: 0.7, textAlign: 'center', lineHeight: 15 },
  budgetCard: { paddingHorizontal: 16, paddingVertical: 14, borderRadius: 12, borderWidth: 1, gap: 4 },
  budgetLabel: { fontSize: 12, opacity: 0.7, fontWeight: '600' },
  budgetAmount: { fontSize: 24, fontWeight: '800', color: '#00D9FF' },
  budgetButtonGrid: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  budgetButton: { flex: 1, minWidth: 60, paddingVertical: 10, borderRadius: 10, alignItems: 'center', borderWidth: 1 },
  budgetButtonText: { fontSize: 12, fontWeight: '600' },
  ghostList: { gap: 8, paddingRight: 8 },
  ghostButton: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, minWidth: 70, alignItems: 'center', borderWidth: 1, backgroundColor: 'rgba(0,0,0,0.05)' },
  ghostButtonText: { fontSize: 12, fontWeight: '600' },
  optionGroup: { gap: 10 },
  optionLabel: { fontSize: 12, fontWeight: '700', opacity: 0.8 },
  optionButtons: { flexDirection: 'row', gap: 8 },
  optionButton: { flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center', borderWidth: 1, backgroundColor: 'rgba(0,0,0,0.05)' },
  optionButtonText: { fontSize: 12, fontWeight: '600' },
  difficultyButton: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1 },
  difficultyButtonText: { fontSize: 12, fontWeight: '600' },
  advancedSection: { borderWidth: 1, borderRadius: 12, overflow: 'hidden', marginBottom: 20 },
  advancedContent: { paddingHorizontal: 12, paddingVertical: 12, gap: 14 },
  resultsSection: { gap: 14 },
  statsCard: { flexDirection: 'row', paddingVertical: 14, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'space-around' },
  stat: { flex: 1, alignItems: 'center', gap: 3 },
  statLabel: { fontSize: 10, opacity: 0.6, fontWeight: '500' },
  statValue: { fontSize: 18, fontWeight: '800', color: '#00D9FF' },
  statDivider: { width: 1, height: 32 },
  actionButtons: { flexDirection: 'row', gap: 10 },
  actionButton: { flex: 1, flexDirection: 'row', paddingVertical: 11, borderRadius: 10, gap: 6, alignItems: 'center', justifyContent: 'center' },
  actionButtonText: { fontSize: 13, fontWeight: '700' },
  equipmentSection: { borderWidth: 1, borderRadius: 12, overflow: 'hidden', marginBottom: 14 },
  equipmentContentContainer: { paddingHorizontal: 12, paddingVertical: 12, gap: 8 },
  equipmentHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 4 },
  equipmentHeaderTab: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 12, borderRadius: 10, borderWidth: 1, justifyContent: 'space-between' },
  equipmentSectionTitle: { fontSize: 13, fontWeight: '700', color: '#00D9FF', flex: 1 },
  equipmentItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10, backgroundColor: 'rgba(0,0,0,0.03)' },
  checkmark: { width: 28, height: 28, borderRadius: 6, justifyContent: 'center', alignItems: 'center' },
  equipmentName: { fontSize: 13, fontWeight: '600', flex: 1 },
  equipmentHint: { fontSize: 10, opacity: 0.5, marginTop: 2 },
  infoBox: { paddingVertical: 12, paddingHorizontal: 12, borderRadius: 10, gap: 8 },
  infoBoxHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  infoBoxTitle: { fontSize: 13, fontWeight: '700', flex: 1 },
  infoBoxText: { fontSize: 12, opacity: 0.8, lineHeight: 17, paddingLeft: 4 },
  premiumPaywall: { justifyContent: 'center', alignItems: 'center', paddingVertical: 80, gap: 16 },
  premiumTitle: { fontSize: 24, fontWeight: '800', textAlign: 'center' },
  premiumDescription: { fontSize: 14, textAlign: 'center', marginHorizontal: 20 },
  premiumButton: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12, gap: 8, alignItems: 'center' },
  premiumButtonText: { fontSize: 16, fontWeight: '800', color: 'white' },
  divider: { width: '100%', height: 1, backgroundColor: 'rgba(255, 255, 255, 0.1)', marginVertical: 8 },
  premiumButtonSecondary: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12, gap: 8, alignItems: 'center', borderWidth: 2, marginHorizontal: 20 },
  premiumButtonSecondaryText: { fontSize: 16, fontWeight: '800' },
});
