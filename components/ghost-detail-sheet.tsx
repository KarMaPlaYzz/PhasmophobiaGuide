import { Ionicons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { BookmarkButton } from '@/components/bookmark-button';
import { detailSheetEmitter } from '@/components/haptic-tab';
import { ThemedText } from '@/components/themed-text';
import { Colors, DifficultyColors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ALL_EQUIPMENT } from '@/lib/data/equipment';
import { HistoryService } from '@/lib/storage/storageService';
import { Ghost } from '@/lib/types';
import { getSanityColor } from '@/lib/utils/colors';

interface GhostDetailSheetProps {
  ghost: Ghost | null;
  isVisible: boolean;
  onClose: () => void;
}

export const GhostDetailSheet = ({ ghost, isVisible, onClose }: GhostDetailSheetProps) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const navigation = useNavigation<any>();
  const snapPoints = useMemo(() => ['75%', '100%'], []);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    evidence: true,
    abilities: true,
    strengths: false,
    tactics: false,
    equipment: false,
    identification: false,
  });
  const [pressedEquipmentId, setPressedEquipmentId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = detailSheetEmitter.subscribe(() => {
      // Reset all sections before closing
      setExpandedSections({
        evidence: true,
        abilities: true,
        strengths: false,
        tactics: false,
        equipment: false,
        identification: false,
      });
      onClose();
    });
    return unsubscribe;
  }, [onClose]);

  // Track view when ghost is shown
  useEffect(() => {
    if (isVisible && ghost) {
      HistoryService.trackView('ghost', ghost.id, ghost.name);
    }
  }, [isVisible, ghost]);

  // Reset sections when sheet becomes invisible
  useEffect(() => {
    if (!isVisible) {
      setExpandedSections({
        evidence: true,
        abilities: true,
        strengths: false,
        tactics: false,
        equipment: false,
        identification: false,
      });
    }
  }, [isVisible]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleEquipmentPress = (equipmentName: string) => {
    setPressedEquipmentId(equipmentName);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Find the equipment in the database
    const equipment = Object.values(ALL_EQUIPMENT).find(
      (item: any) => item?.name === equipmentName
    );

    if (equipment) {
      // Navigate after brief delay for visual feedback
      setTimeout(() => {
        navigation.navigate('(tabs)', {
          screen: 'equipments',
          params: {
            selectedEquipmentId: (equipment as any).id,
            scrollToEquipment: true,
          },
        });

        // Emit event to close this detail sheet
        detailSheetEmitter.emit();
        setPressedEquipmentId(null);
      }, 100);
    }
  };

  const getDifficultyColor = (difficulty: string) =>
    DifficultyColors[difficulty as keyof typeof DifficultyColors] || colors.text;

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

  if (!ghost) return null;

  return (
    <BottomSheet
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      onClose={onClose}
      index={isVisible ? 0 : -1}
      animateOnMount={true}
      style={{ borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: 'hidden' }}
      backgroundComponent={() => (
        <BlurView intensity={94} style={StyleSheet.absoluteFillObject} />
      )}
      handleIndicatorStyle={{ backgroundColor: colors.spectral }}
    >
      <BottomSheetScrollView
        style={{ flex: 1, paddingHorizontal: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Ghost Image */}
        {ghost.imageUrl ? (
          <View style={[styles.imageContainer, { backgroundColor: colors.haunted + '30' }]}>
            <Image
              source={{ uri: ghost.imageUrl }}
              style={styles.ghostImage}
              onError={(error) => console.log('Image load error:', error)}
            />
          </View>
        ) : null}

        {/* Header: Name + Difficulty + Bookmark */}
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <ThemedText style={styles.bottomSheetTitle}>{ghost.name}</ThemedText>
            <View
              style={[
                styles.difficultyBadgeLarge,
                {
                  backgroundColor: getDifficultyColor(ghost.difficulty) + '20',
                  borderColor: getDifficultyColor(ghost.difficulty),
                  borderWidth: 1,
                },
              ]}
            >
              <Ionicons
                size={14}
                name={getDifficultyIcon(ghost.difficulty) as any}
                color={getDifficultyColor(ghost.difficulty)}
              />
              <ThemedText style={[styles.difficultyTextLarge, { color: getDifficultyColor(ghost.difficulty) }]}>
                {ghost.difficulty}
              </ThemedText>
            </View>
          </View>
          <BookmarkButton
            itemId={ghost.id}
            itemType="ghost"
            itemName={ghost.name}
            size={28}
            color={colors.spectral}
          />
        </View>

        {/* Description - Always Visible */}
        <ThemedText style={styles.sectionTitle}>Description</ThemedText>
        <ThemedText style={styles.description}>{ghost.description}</ThemedText>

        {/* Evidence - Always Visible */}
        <ThemedText style={styles.sectionTitle}>Evidence Required</ThemedText>
        <View style={styles.evidenceBadgesLarge}>
          {ghost.evidence.map((ev) => (
            <View key={ev} style={[styles.evidenceBadgeLarge, { backgroundColor: colors.spectral + '25' }]}>
              <ThemedText style={styles.evidenceTextLarge}>{ev}</ThemedText>
            </View>
          ))}
        </View>

        {/* Hunt Sanity Threshold Visualization */}
        <View style={[styles.thresholdContainer, { marginTop: 16, backgroundColor: colors.surface, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: colors.border }]}>
          <ThemedText style={styles.sectionTitle}>Hunt Sanity Threshold</ThemedText>
          <View style={styles.thresholdLabelRow}>
            <ThemedText style={styles.thresholdValue}>{ghost.huntSanityThreshold}%</ThemedText>
            <ThemedText style={styles.thresholdDescription}>
              Ghost hunts when sanity drops below {ghost.huntSanityThreshold}%
            </ThemedText>
          </View>
          
          {/* Threshold Bar */}
          <View style={[styles.thresholdBar, { backgroundColor: colors.tabIconDefault + '15', borderColor: colors.border }]}>
            <View
              style={[
                styles.thresholdMarker,
                {
                  left: `${ghost.huntSanityThreshold}%`,
                  backgroundColor: getSanityColor(ghost.huntSanityThreshold),
                  shadowColor: getSanityColor(ghost.huntSanityThreshold),
                },
              ]}
            />
          </View>
          
          {/* Threshold Labels */}
          <View style={styles.thresholdLabelsRow}>
            <ThemedText style={styles.thresholdLabelText}>Safe</ThemedText>
            <ThemedText style={styles.thresholdLabelText}>Danger</ThemedText>
          </View>
        </View>

        {/* Special Abilities - Collapsible (starts expanded) */}
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            toggleSection('abilities');
          }}
          style={[styles.collapsibleHeader, { backgroundColor: colors.spectral + '15', marginTop: 16 }]}
        >
          <Ionicons
            name={expandedSections.abilities ? 'chevron-down' : 'chevron-forward'}
            size={18}
            color={colors.spectral}
          />
          <ThemedText style={[styles.sectionTitle, { marginTop: 0, marginBottom: 0, marginLeft: 0, flex: 1 }]}>
            Special Abilities
          </ThemedText>
        </Pressable>
        {expandedSections.abilities && (
          <>
            {ghost.abilities.map((ability, idx) => (
              <View key={idx} style={styles.abilityItem}>
                <ThemedText style={styles.abilityName}>{ability.name}</ThemedText>
                <ThemedText style={styles.abilityDescription}>{ability.description}</ThemedText>
                {ability.effects.length > 0 && (
                  <View style={styles.effectsList}>
                    {ability.effects.map((effect, effIdx) => (
                      <View key={effIdx} style={styles.effectItem}>
                        <ThemedText style={styles.effectBullet}>◆</ThemedText>
                        <ThemedText style={styles.effectText}>{effect}</ThemedText>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </>
        )}

        {/* Strengths & Weaknesses - Collapsible */}
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            toggleSection('strengths');
          }}
          style={[styles.collapsibleHeader, { backgroundColor: colors.paranormal + '15', marginTop: 16 }]}
        >
          <Ionicons
            name={expandedSections.strengths ? 'chevron-down' : 'chevron-forward'}
            size={18}
            color={colors.paranormal}
          />
          <ThemedText style={[styles.sectionTitle, { marginTop: 0, marginBottom: 0, marginLeft: 0, flex: 1, color: colors.paranormal }]}>
            Strengths & Weaknesses
          </ThemedText>
        </Pressable>
        {expandedSections.strengths && (
          <>
            <ThemedText style={[styles.sectionSubtitle, { color: colors.paranormal, marginTop: 12 }]}>
              Strengths
            </ThemedText>
            {ghost.strengths.map((strength, idx) => (
              <View key={`strength-${idx}`} style={[styles.strengthItem, { borderColor: colors.paranormal }]}>
                <Ionicons size={16} name="checkmark-circle" color={colors.paranormal} />
                <View style={{ flex: 1 }}>
                  <ThemedText style={styles.strengthLabel}>{strength.description}</ThemedText>
                  <ThemedText style={styles.strengthDetail}>{strength.mechanicalAdvantage}</ThemedText>
                </View>
              </View>
            ))}

            <ThemedText style={[styles.sectionSubtitle, { color: '#FF4444', marginTop: 12 }]}>
              Weaknesses
            </ThemedText>
            {ghost.weaknesses.map((weakness, idx) => (
              <View key={`weakness-${idx}`} style={[styles.weaknessItem, { borderColor: '#FF4444' }]}>
                <Ionicons size={16} name="close-circle" color="#FF4444" />
                <View style={{ flex: 1 }}>
                  <ThemedText style={styles.weaknessLabel}>{weakness.description}</ThemedText>
                  <ThemedText style={styles.weaknessDetail}>{weakness.counter}</ThemedText>
                </View>
              </View>
            ))}
          </>
        )}

        {/* Counter Strategies - Collapsible */}
        {ghost.counterStrategies && ghost.counterStrategies.length > 0 && (
          <>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                toggleSection('tactics');
              }}
              style={[styles.collapsibleHeader, { backgroundColor: '#4CAF50' + '15', marginTop: 16 }]}
            >
              <Ionicons
                name={expandedSections.tactics ? 'chevron-down' : 'chevron-forward'}
                size={18}
                color="#4CAF50"
              />
              <ThemedText style={[styles.sectionTitle, { marginTop: 0, marginBottom: 0, marginLeft: 0, flex: 1, color: '#4CAF50' }]}>
                Counter Strategies
              </ThemedText>
            </Pressable>
            {expandedSections.tactics && (
              <>
                {ghost.counterStrategies.map((strategy, idx) => {
                  const effectColor =
                    strategy.effectiveness === 'High'
                      ? '#4CAF50'
                      : strategy.effectiveness === 'Medium'
                        ? '#FFC107'
                        : '#FF6F6F';
                  const emoji =
                    strategy.effectiveness === 'High'
                      ? '✓'
                      : strategy.effectiveness === 'Medium'
                        ? '~'
                        : '✗';
                  
                  return (
                    <View
                      key={idx}
                      style={[
                        styles.strategyItem,
                        { borderLeftColor: effectColor },
                      ]}
                    >
                      <View style={styles.strategyHeader}>
                        <ThemedText style={styles.strategyName}>{strategy.strategy}</ThemedText>
                        <View
                          style={[
                            styles.effectivenessBadge,
                            { backgroundColor: effectColor },
                          ]}
                        >
                          <ThemedText style={styles.effectivenessText}>
                            {emoji} {strategy.effectiveness}
                          </ThemedText>
                        </View>
                      </View>
                      <View style={styles.tipsContainer}>
                        {strategy.tips.map((tip, tipIdx) => (
                          <View key={tipIdx} style={styles.tipItem}>
                            <ThemedText style={styles.tipBullet}>→</ThemedText>
                            <ThemedText style={styles.tipText}>{tip}</ThemedText>
                          </View>
                        ))}
                      </View>
                    </View>
                  );
                })}
              </>
            )}
          </>
        )}

        {/* Recommended Equipment - Collapsible */}
        {ghost.recommendedEquipment && (
          <>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                toggleSection('equipment');
              }}
              style={[styles.collapsibleHeader, { backgroundColor: '#FF1744' + '15', marginTop: 16 }]}
            >
              <Ionicons
                name={expandedSections.equipment ? 'chevron-down' : 'chevron-forward'}
                size={18}
                color="#FF1744"
              />
              <ThemedText style={[styles.sectionTitle, { marginTop: 0, marginBottom: 0, marginLeft: 0, flex: 1, color: '#FF1744' }]}>
                Recommended Equipment
              </ThemedText>
            </Pressable>
            {expandedSections.equipment && (
              <>
                {ghost.recommendedEquipment?.essential && ghost.recommendedEquipment.essential.length > 0 && (
                  <>
                    <View
                      style={[
                        styles.equipmentCategory,
                        { borderColor: '#FF1744', backgroundColor: 'rgba(255, 23, 68, 0.12)', marginBottom: 12, paddingVertical: 12, paddingHorizontal: 10, borderRadius: 8 },
                      ]}
                    >
                      <MaterialIcons name="star" size={18} color="#FF1744" style={{ fontWeight: 'bold' }} />
                      <ThemedText style={[styles.equipmentCategoryTitle, { fontWeight: '700', fontSize: 14 }]}>
                        ⚠️ MUST BRING
                      </ThemedText>
                    </View>
                    <View style={styles.equipmentList}>
                      {ghost.recommendedEquipment.essential.map((item, idx) => (
                        <Pressable
                          key={idx}
                          onPress={() => handleEquipmentPress(item)}
                          style={[
                            styles.equipmentItem,
                            {
                              backgroundColor: pressedEquipmentId === item 
                                ? 'rgba(255, 23, 68, 0.2)' 
                                : 'rgba(255, 23, 68, 0.08)',
                              paddingVertical: 8,
                              paddingHorizontal: 8,
                              borderRadius: 4,
                              borderLeftWidth: 3,
                              borderLeftColor: '#FF1744',
                              opacity: pressedEquipmentId === item ? 0.8 : 1,
                            },
                          ]}
                        >
                          <MaterialIcons name="check-circle" size={16} color="#FF1744" />
                          <ThemedText style={[styles.equipmentItemText, { fontWeight: '600' }]}>
                            {item}
                          </ThemedText>
                          <MaterialIcons name="open-in-new" size={14} color="#FF1744" style={{ marginLeft: 'auto' }} />
                        </Pressable>
                      ))}
                    </View>
                  </>
                )}

                    {ghost.recommendedEquipment?.recommended && ghost.recommendedEquipment.recommended.length > 0 && (
                  <>
                    <View
                      style={[
                        styles.equipmentCategory,
                        { borderColor: '#FFC107', marginTop: 12 },
                      ]}
                    >
                      <MaterialIcons name="star-half" size={16} color="#FFC107" />
                      <ThemedText style={styles.equipmentCategoryTitle}>Recommended</ThemedText>
                    </View>
                    <View style={styles.equipmentList}>
                      {ghost.recommendedEquipment.recommended.map((item, idx) => (
                        <Pressable
                          key={idx}
                          onPress={() => handleEquipmentPress(item)}
                          style={[
                            styles.equipmentItem,
                            {
                              backgroundColor: pressedEquipmentId === item 
                                ? 'rgba(255, 193, 7, 0.15)' 
                                : 'rgba(255, 193, 7, 0.05)',
                              opacity: pressedEquipmentId === item ? 0.8 : 1,
                            },
                          ]}
                        >
                          <MaterialIcons name="circle" size={12} color="#FFC107" />
                          <ThemedText style={styles.equipmentItemText}>{item}</ThemedText>
                          <MaterialIcons name="open-in-new" size={14} color="#FFC107" style={{ marginLeft: 'auto' }} />
                        </Pressable>
                      ))}
                    </View>
                  </>
                )}

                {ghost.recommendedEquipment?.optional && ghost.recommendedEquipment.optional.length > 0 && (
                  <>
                    <View
                      style={[
                        styles.equipmentCategory,
                        { borderColor: '#2196F3', marginTop: 12 },
                      ]}
                    >
                      <MaterialIcons name="help" size={16} color="#2196F3" />
                      <ThemedText style={styles.equipmentCategoryTitle}>Optional</ThemedText>
                    </View>
                    <View style={styles.equipmentList}>
                      {ghost.recommendedEquipment.optional.map((item, idx) => (
                        <Pressable
                          key={idx}
                          onPress={() => handleEquipmentPress(item)}
                          style={[
                            styles.equipmentItem,
                            {
                              backgroundColor: pressedEquipmentId === item 
                                ? 'rgba(33, 150, 243, 0.15)' 
                                : 'rgba(33, 150, 243, 0.05)',
                              opacity: pressedEquipmentId === item ? 0.8 : 1,
                            },
                          ]}
                        >
                          <MaterialIcons name="radio-button-unchecked" size={12} color="#2196F3" />
                          <ThemedText style={styles.equipmentItemText}>{item}</ThemedText>
                          <MaterialIcons name="open-in-new" size={14} color="#2196F3" style={{ marginLeft: 'auto' }} />
                        </Pressable>
                      ))}
                    </View>
                  </>
                )}

                {ghost.recommendedEquipment?.avoid && ghost.recommendedEquipment.avoid.length > 0 && (
                  <>
                    <View
                      style={[
                        styles.equipmentCategory,
                        { borderColor: '#999', marginTop: 12 },
                      ]}
                    >
                      <MaterialIcons name="cancel" size={16} color="#999" />
                      <ThemedText style={styles.equipmentCategoryTitle}>Avoid</ThemedText>
                    </View>
                    <View style={styles.equipmentList}>
                      {ghost.recommendedEquipment.avoid.map((item, idx) => (
                        <Pressable
                          key={idx}
                          onPress={() => handleEquipmentPress(item)}
                          style={[
                            styles.equipmentItem,
                            {
                              backgroundColor: pressedEquipmentId === item 
                                ? 'rgba(153, 153, 153, 0.15)' 
                                : 'rgba(153, 153, 153, 0.05)',
                              opacity: pressedEquipmentId === item ? 0.8 : 0.6,
                            },
                          ]}
                        >
                          <MaterialIcons name="close" size={14} color="#999" />
                          <ThemedText style={[styles.equipmentItemText, { opacity: 0.6 }]}>
                            {item}
                          </ThemedText>
                          <MaterialIcons name="open-in-new" size={14} color="#999" style={{ marginLeft: 'auto' }} />
                        </Pressable>
                      ))}
                    </View>
                  </>
                )}
              </>
            )}
          </>
        )}

        {/* Identification Tips - Collapsible */}
        {ghost.identificationTips && ghost.identificationTips.length > 0 && (
          <>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                toggleSection('identification');
              }}
              style={[styles.collapsibleHeader, { backgroundColor: colors.spectral + '15', marginTop: 16 }]}
            >
              <Ionicons
                name={expandedSections.identification ? 'chevron-down' : 'chevron-forward'}
                size={18}
                color={colors.spectral}
              />
              <ThemedText style={[styles.sectionTitle, { marginTop: 0, marginBottom: 0, marginLeft: 0, flex: 1 }]}>
                Identification Tips
              </ThemedText>
            </Pressable>
            {expandedSections.identification && (
              <>
                {ghost.identificationTips.map((tip, idx) => (
                  <View key={idx} style={styles.tipItem}>
                    <ThemedText style={styles.tipBullet}>•</ThemedText>
                    <ThemedText style={styles.tipText}>{tip}</ThemedText>
                  </View>
                ))}
              </>
            )}
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
    height: 180,
    borderRadius: 14,
    overflow: 'hidden',
    marginTop: 16,
    marginBottom: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ghostImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 10,
  },
  bottomSheetTitle: { fontSize: 26, fontWeight: '700', marginBottom: 10, color: '#00D9FF' },
  difficultyBadgeLarge: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, alignSelf: 'flex-start', marginBottom: 20, flexDirection: 'row', alignItems: 'center', gap: 6 },
  difficultyTextLarge: { color: 'white', fontWeight: '700', fontSize: 13 },

  sectionTitle: { fontSize: 16, fontWeight: '700', marginTop: 20, marginBottom: 12, color: '#00D9FF' },
  sectionSubtitle: { fontSize: 15, fontWeight: '700', marginBottom: 12 },
  description: { fontSize: 14, lineHeight: 21, marginBottom: 20, opacity: 0.85 },
  collapsibleHeader: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 12, borderRadius: 10, marginBottom: 8, gap: 8 },

  evidenceBadgesLarge: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 16 },
  evidenceBadgeLarge: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10 },
  evidenceTextLarge: { fontSize: 13, fontWeight: '700' },

  abilityItem: { marginBottom: 20, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(107,74,172,0.15)' },
  abilityName: { fontWeight: '700', marginBottom: 6, fontSize: 15 },
  abilityDescription: { fontSize: 14, lineHeight: 20, opacity: 0.85 },
  effectsList: { marginTop: 10, paddingLeft: 14, gap: 6 },
  effectItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  effectBullet: { fontSize: 13, color: '#00D9FF', fontWeight: '700' },
  effectText: { fontSize: 13, flex: 1, lineHeight: 19, opacity: 0.8 },

  strengthItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12, gap: 10, paddingLeft: 10, borderLeftWidth: 3 },
  strengthLabel: { fontWeight: '700', marginBottom: 3, fontSize: 14 },
  strengthDetail: { fontSize: 13, opacity: 0.7 },
  weaknessItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12, gap: 10, paddingLeft: 10, borderLeftWidth: 3 },
  weaknessLabel: { fontWeight: '700', marginBottom: 3, fontSize: 14 },
  weaknessDetail: { fontSize: 13, opacity: 0.7 },

  strategyItem: { marginBottom: 20, paddingLeft: 13, borderLeftWidth: 4 },
  strategyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  strategyName: { fontWeight: '700', fontSize: 15, flex: 1 },
  effectivenessBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6 },
  effectivenessText: { color: 'white', fontSize: 12, fontWeight: '700' },
  tipsContainer: { gap: 8 },

  equipmentCategory: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, paddingLeft: 10, borderLeftWidth: 3, marginBottom: 10 },
  equipmentCategoryTitle: { fontWeight: '700', fontSize: 14, flex: 1 },
  equipmentList: { marginLeft: 10, marginBottom: 12, gap: 8 },
  equipmentItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  equipmentItemText: { fontSize: 14, flex: 1, fontWeight: '500' },

  tipItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  tipBullet: { fontSize: 17, fontWeight: 'bold', marginTop: -1, color: '#00D9FF' },
  tipText: { flex: 1, fontSize: 14, lineHeight: 20 },
  thresholdContainer: {},
  thresholdLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  thresholdValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#00D9FF',
  },
  thresholdDescription: {
    fontSize: 12,
    opacity: 0.7,
    flex: 1,
    lineHeight: 16,
  },
  thresholdBar: {
    height: 8,
    borderRadius: 4,
    position: 'relative',
    marginBottom: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  thresholdMarker: {
    width: 3,
    height: 16,
    borderRadius: 1.5,
    position: 'absolute',
    top: -4,
    shadowOpacity: 0.5,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  thresholdLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  thresholdLabelText: {
    fontSize: 11,
    opacity: 0.6,
    fontWeight: '500',
  },
});
