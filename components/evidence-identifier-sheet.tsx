/**
 * Evidence Identifier Sheet Component
 * Bottom sheet for collecting evidence and identifying ghosts
 */

import { EvidenceCollectionAnimation } from '@/components/evidence-collection-animation';
import { Colors } from '@/constants/theme';
import { useInterstitialAds } from '@/hooks/use-interstitial-ads';
import { useLocalization } from '@/hooks/use-localization';
import { usePremium } from '@/hooks/use-premium';
import {
  ALL_EVIDENCE_TYPES,
  EVIDENCE_DATABASE,
} from '@/lib/data/evidence-identifier';
import { getEvidenceTip } from '@/lib/localization';
import { BookmarkService, HistoryService } from '@/lib/storage/storageService';
import { EvidenceType } from '@/lib/types';
import {
  calculateProgress,
  EvidenceState,
  filterGhostsByEvidence,
  generateSmartHints,
  getCollectedEquipment,
  getIdentificationStatus,
  getNextStepRecommendations,
  getRequiredEquipment,
  validateEvidence,
} from '@/lib/utils/evidence-identifier';
import { Ionicons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useMemo, useState } from 'react';
import {
  LayoutAnimation,
  Platform,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface Props {
  isVisible: boolean;
  onClose: () => void;
}

export const EvidenceIdentifierSheet: React.FC<Props> = ({ isVisible, onClose }) => {
  const colors = Colors['dark'];
  const isDark = true; // Always use dark mode for this sheet
  const { language, t } = useLocalization();
  const { isPremium } = usePremium();
  const snapPoints = useMemo(() => ['50%', '90%'], []);
  const navigation = useNavigation<any>();
  
  // Evidence state management
  const [evidenceState, setEvidenceState] = useState<EvidenceState>({
    'EMF Level 5': 'not-found',
    'D.O.T.S. Projector': 'not-found',
    'Ultraviolet': 'not-found',
    'Ghost Orb': 'not-found',
    'Ghost Writing': 'not-found',
    'Spirit Box': 'not-found',
    'Freezing Temperatures': 'not-found',
  });

  const [expandedEvidence, setExpandedEvidence] = useState<string | null>(null);
  const [usageCount, setUsageCount] = useState(0);

  // Track ad impressions - show ad every 5 uses
  useInterstitialAds('evidence-identifier', 5, usageCount);

  // Track view when opened
  useEffect(() => {
    if (isVisible) {
      HistoryService.trackView('evidence', 'evidence-identifier', 'Evidence Identifier');
    }
  }, [isVisible]);

  // Calculate all results
  const filteredResults = useMemo(
    () => filterGhostsByEvidence(evidenceState),
    [evidenceState]
  );

  const smartHints = useMemo(
    () => generateSmartHints(evidenceState, filteredResults),
    [evidenceState, filteredResults]
  );

  const requiredEquipment = useMemo(
    () => getRequiredEquipment(smartHints),
    [smartHints]
  );

  const collectedEquipment = useMemo(
    () => getCollectedEquipment(evidenceState),
    [evidenceState]
  );

  const progress = useMemo(() => calculateProgress(evidenceState), [evidenceState]);

  const identificationStatus = useMemo(
    () => getIdentificationStatus(evidenceState, filteredResults),
    [evidenceState, filteredResults]
  );

  const nextSteps = useMemo(
    () => getNextStepRecommendations(evidenceState, filteredResults),
    [evidenceState, filteredResults]
  );

  const validation = useMemo(() => validateEvidence(evidenceState), [evidenceState]);

  // Navigate to ghost detail sheet
  const navigateToGhost = (ghostName: string) => {
    navigation.navigate('(tabs)', {
      screen: 'ghosts',
      params: {
        selectedGhostName: ghostName,
        scrollToGhost: true,
      },
    });
    onClose();
  };

  // Toggle evidence status cyclically: not-found -> investigating -> confirmed -> not-found
  const toggleEvidenceStatus = (evidence: EvidenceType) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setEvidenceState((prev: EvidenceState): EvidenceState => {
      const current = prev[evidence];
      let next: 'not-found' | 'investigating' | 'confirmed';
      if (current === 'not-found') {
        next = 'investigating';
      } else if (current === 'investigating') {
        next = 'confirmed';
      } else {
        next = 'not-found';
      }
      return { ...prev, [evidence]: next };
    });

    // Track usage for ad display (free users only)
    if (!isPremium) {
      BookmarkService.incrementEvidenceIdentifierUsage().then((count) => {
        setUsageCount(count);
        // Ad will be triggered via useInterstitialAds hook dependency on usageCount
      });
    }
  };

  // Get status icon and color
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'confirmed':
        return {
          icon: 'checkmark-circle',
          color: '#22c55e', // green
          label: `✓ ${t('evidence.confirmed')}`,
        };
      case 'investigating':
        return {
          icon: 'help-circle',
          color: '#f59e0b', // amber
          label: `◐ ${t('evidence.investigating')}`,
        };
      default:
        return {
          icon: 'ellipse-outline',
          color: '#6b7280', // gray
          label: `□ ${t('evidence.notFound')}`,
        };
    }
  };

  // Get ghost match color
  const getConfidenceColor = (confidence: number) => {
    if (confidence === 100) return '#22c55e'; // green
    if (confidence >= 80) return '#3b82f6'; // blue
    if (confidence >= 50) return '#f59e0b'; // amber
    return '#ef4444'; // red
  };

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
      backgroundStyle={{
        backgroundColor: isDark ? colors.surface : '#ffffff',
      }}
      handleIndicatorStyle={{
        backgroundColor: isDark ? '#6b7280' : '#d1d5db',
      }}
    >
      <BottomSheetScrollView
        style={{ flex: 1, paddingHorizontal: 16 }}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ marginBottom: 20 }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: 'bold',
              color: isDark ? '#ffffff' : '#000000',
              marginBottom: 4,
            }}
          >
            🔍 Evidence Identifier
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: isDark ? '#9ca3af' : '#6b7280',
            }}
          >
            Collect evidence to identify the ghost
          </Text>
        </View>

        {/* Status Message */}
        <View
          style={{
            backgroundColor: isDark ? colors.spectral + '20' : '#e0f2fe',
            borderRadius: 12,
            padding: 12,
            marginBottom: 16,
            borderLeftWidth: 4,
            borderLeftColor: colors.spectral,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              color: isDark ? colors.spectral : '#0369a1',
              fontWeight: '600',
            }}
          >
            {identificationStatus}
          </Text>
        </View>

        {/* Progress Bar */}
        <View style={{ marginBottom: 20 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 8,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: '600',
                color: isDark ? '#ffffff' : '#000000',
              }}
            >
              Evidence Collected
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '600',
                color: colors.spectral,
              }}
            >
              {progress.collected}/{progress.remaining + progress.collected}
            </Text>
          </View>
          <View
            style={{
              height: 8,
              backgroundColor: isDark ? '#374151' : '#e5e7eb',
              borderRadius: 4,
              overflow: 'hidden',
            }}
          >
            <View
              style={{
                height: '100%',
                width: `${progress.percentage}%`,
                backgroundColor: colors.spectral,
              }}
            />
          </View>
        </View>

        {/* Validation Errors */}
        {!validation.valid && validation.issues.length > 0 && (
          <View
            style={{
              backgroundColor: '#fee2e2',
              borderRadius: 12,
              padding: 12,
              marginBottom: 16,
              borderLeftWidth: 4,
              borderLeftColor: '#ef4444',
            }}
          >
            {validation.issues.map((issue, idx) => (
              <Text
                key={idx}
                style={{
                  fontSize: 13,
                  color: '#991b1b',
                  marginBottom: idx < validation.issues.length - 1 ? 6 : 0,
                }}
              >
                ⚠️ {issue}
              </Text>
            ))}
          </View>
        )}

        {/* Evidence Collection Cards */}
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '700',
              color: isDark ? '#ffffff' : '#000000',
              marginBottom: 12,
            }}
          >
            COLLECT EVIDENCE
          </Text>

          {ALL_EVIDENCE_TYPES.map((evidenceType, idx) => {
            const info = EVIDENCE_DATABASE[evidenceType];
            const status = evidenceState[evidenceType];
            const statusStyle = getStatusStyle(status);
            const isExpanded = expandedEvidence === evidenceType;
            const isCollected = status === 'confirmed';

            return (
              <EvidenceCollectionAnimation
                key={idx}
                isCollected={isCollected}
                delay={idx * 50}
              >
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setExpandedEvidence(isExpanded ? null : evidenceType);
                  }}
                >
                <View
                  style={{
                    backgroundColor: isDark ? '#1f2937' : '#f9fafb',
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: isDark ? '#374151' : '#e5e7eb',
                    padding: 12,
                    marginBottom: 12,
                    overflow: 'hidden',
                  }}
                >
                  {/* Evidence Header */}
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={{ fontSize: 20, marginRight: 8 }}>{info.emoji}</Text>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            fontSize: 15,
                            fontWeight: '600',
                            color: isDark ? '#ffffff' : '#000000',
                            marginBottom: 4,
                          }}
                        >
                          {evidenceType}
                        </Text>
                        <Text
                          style={{
                            fontSize: 12,
                            color: isDark ? '#9ca3af' : '#6b7280',
                          }}
                        >
                          Difficulty: {info.difficulty}
                        </Text>
                      </View>
                    </View>
                    <Ionicons
                      name={isExpanded ? 'chevron-up' : 'chevron-down'}
                      size={20}
                      color={isDark ? '#9ca3af' : '#6b7280'}
                      style={{ marginLeft: 8 }}
                    />
                  </View>

                  {/* Status Buttons */}
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 12,
                      gap: 8,
                    }}
                  >
                    {[
                      { label: `□ ${t('evidence.notFound')}`, value: 'not-found' },
                      { label: `◐ ${t('evidence.investigating')}`, value: 'investigating' },
                      { label: `✓ ${t('evidence.confirmed')}`, value: 'confirmed' },
                    ].map((btn, i) => (
                      <TouchableOpacity
                        key={i}
                        onPress={() => {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                          LayoutAnimation.configureNext(
                            LayoutAnimation.Presets.easeInEaseOut
                          );
                          setEvidenceState(prev => ({
                            ...prev,
                            [evidenceType]: btn.value as any,
                          }));
                        }}
                        style={{
                          flex: 1,
                          paddingVertical: 8,
                          paddingHorizontal: 8,
                          borderRadius: 8,
                          borderWidth: 1.5,
                          borderColor:
                            status === btn.value ? statusStyle.color : '#d1d5db',
                          backgroundColor:
                            status === btn.value
                              ? statusStyle.color + '15'
                              : 'transparent',
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 12,
                            fontWeight: '600',
                            color:
                              status === btn.value
                                ? statusStyle.color
                                : isDark
                                  ? '#9ca3af'
                                  : '#6b7280',
                            textAlign: 'center',
                          }}
                        >
                          {btn.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <View style={{ marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: isDark ? '#374151' : '#e5e7eb' }}>
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: '600',
                          color: isDark ? '#e5e7eb' : '#1f2937',
                          marginBottom: 8,
                        }}
                      >
                        How to collect:
                      </Text>
                      {info.howToCollect.map((step, i) => (
                        <Text
                          key={i}
                          style={{
                            fontSize: 12,
                            color: isDark ? '#d1d5db' : '#4b5563',
                            marginBottom: 6,
                            marginLeft: 12,
                          }}
                        >
                          {i + 1}. {step}
                        </Text>
                      ))}

                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: '600',
                          color: isDark ? '#e5e7eb' : '#1f2937',
                          marginTop: 10,
                          marginBottom: 8,
                        }}
                      >
                        💡 Tips:
                      </Text>
                      {[0, 1, 2].map((tipIndex) => {
                        const tip = getEvidenceTip(evidenceType as any, tipIndex, language);
                        return tip ? (
                          <Text
                            key={tipIndex}
                            style={{
                              fontSize: 12,
                              color: isDark ? '#d1d5db' : '#4b5563',
                              marginBottom: 4,
                              marginLeft: 12,
                            }}
                          >
                            • {tip}
                          </Text>
                        ) : null;
                      })}

                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: '600',
                          color: isDark ? '#e5e7eb' : '#1f2937',
                          marginTop: 10,
                          marginBottom: 6,
                        }}
                      >
                        🎒 Equipment: {info.equipment.join(', ')}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
              </EvidenceCollectionAnimation>
            );
          })}
        </View>

        {/* Ghost Matching Results */}
        {progress.collected > 0 && (
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '700',
                color: isDark ? '#ffffff' : '#000000',
                marginBottom: 12,
              }}
            >
              🎯 MATCHING GHOSTS
            </Text>

            {/* Definite Matches */}
            {filteredResults.definiteMatches.length > 0 && (
              <View style={{ marginBottom: 16 }}>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: '700',
                    color: '#22c55e',
                    marginBottom: 8,
                    textTransform: 'uppercase',
                  }}
                >
                  ✓ CONFIRMED MATCH
                </Text>
                {filteredResults.definiteMatches.map((result, idx) => (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      navigateToGhost(result.ghostName);
                    }}
                    activeOpacity={0.7}
                  >
                    <View
                      style={{
                        backgroundColor: '#dcfce7',
                        borderRadius: 10,
                        padding: 12,
                        marginBottom: 8,
                        borderLeftWidth: 4,
                        borderLeftColor: '#22c55e',
                      }}
                    >
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: 4,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 15,
                            fontWeight: '700',
                            color: '#15803d',
                          }}
                        >
                          {result.ghostName}
                        </Text>
                        <MaterialIcons name="chevron-right" size={18} color="#22c55e" />
                      </View>
                      <Text
                        style={{
                          fontSize: 12,
                          color: '#166534',
                        }}
                      >
                        {result.reason}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Very Likely Matches */}
            {filteredResults.veryLikely.length > 0 && (
              <View style={{ marginBottom: 16 }}>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: '700',
                    color: '#3b82f6',
                    marginBottom: 8,
                    textTransform: 'uppercase',
                  }}
                >
                  🔥 VERY LIKELY
                </Text>
                {filteredResults.veryLikely.slice(0, 3).map((result, idx) => (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      navigateToGhost(result.ghostName);
                    }}
                    activeOpacity={0.7}
                  >
                    <View
                      style={{
                        backgroundColor: '#dbeafe',
                        borderRadius: 10,
                        padding: 12,
                        marginBottom: 8,
                        borderLeftWidth: 4,
                        borderLeftColor: '#3b82f6',
                      }}
                    >
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: 4,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: '700',
                            color: '#1e40af',
                          }}
                        >
                          {result.ghostName}
                        </Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 4,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 12,
                              fontWeight: '700',
                              color: '#3b82f6',
                            }}
                          >
                            {result.confidence}%
                          </Text>
                          <MaterialIcons name="chevron-right" size={16} color="#3b82f6" />
                        </View>
                      </View>
                      <Text
                        style={{
                          fontSize: 12,
                          color: '#1e3a8a',
                        }}
                      >
                        {result.reason}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Possible Matches */}
            {filteredResults.possible.length > 0 &&
              filteredResults.definiteMatches.length === 0 &&
              filteredResults.veryLikely.length === 0 && (
                <View>
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: '700',
                      color: '#f59e0b',
                      marginBottom: 8,
                      textTransform: 'uppercase',
                    }}
                  >
                    ⚠️ POSSIBLE ({filteredResults.possible.length})
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: isDark ? '#9ca3af' : '#6b7280',
                    }}
                  >
                    Collect more evidence to narrow down further
                  </Text>
                </View>
              )}

            {/* Eliminated Count */}
            {filteredResults.impossible.length > 0 && (
              <View
                style={{
                  backgroundColor: isDark ? '#374151' : '#f3f4f6',
                  borderRadius: 10,
                  padding: 10,
                  marginTop: 12,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    color: isDark ? '#9ca3af' : '#6b7280',
                  }}
                >
                  ✓ Eliminated {filteredResults.impossible.length} ghosts from consideration
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Smart Hints */}
        {progress.collected > 0 && smartHints.length > 0 && (
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '700',
                color: isDark ? '#ffffff' : '#000000',
                marginBottom: 12,
              }}
            >
              💡 NEXT BEST EVIDENCE TO CHECK
            </Text>

            {smartHints.slice(0, 3).map((hint, idx) => (
              <View
                key={idx}
                style={{
                  backgroundColor: isDark ? '#1f2937' : '#f9fafb',
                  borderRadius: 10,
                  padding: 12,
                  marginBottom: 10,
                  borderLeftWidth: 4,
                  borderLeftColor:
                    hint.priority === 'high'
                      ? '#ef4444'
                      : hint.priority === 'medium'
                        ? '#f59e0b'
                        : '#6b7280',
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 6,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: '700',
                      color: isDark ? '#e5e7eb' : '#1f2937',
                    }}
                  >
                    #{idx + 1} {hint.evidence}
                  </Text>
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: '600',
                      color:
                        hint.priority === 'high'
                          ? '#ef4444'
                          : hint.priority === 'medium'
                            ? '#f59e0b'
                            : '#6b7280',
                      textTransform: 'uppercase',
                    }}
                  >
                    {hint.priority} priority
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 12,
                    color: isDark ? '#d1d5db' : '#4b5563',
                    marginBottom: 6,
                  }}
                >
                  {hint.reason}
                </Text>
                <Text
                  style={{
                    fontSize: 11,
                    color: isDark ? '#9ca3af' : '#6b7280',
                  }}
                >
                  📦 Equipment: {requiredEquipment[idx] || 'Unknown'}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Equipment Summary */}
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '700',
              color: isDark ? '#ffffff' : '#000000',
              marginBottom: 12,
            }}
          >
            🎒 EQUIPMENT
          </Text>

          {collectedEquipment.length > 0 && (
            <View style={{ marginBottom: 12 }}>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '600',
                  color: '#22c55e',
                  marginBottom: 8,
                }}
              >
                ✓ Collected Equipment:
              </Text>
              {collectedEquipment.map((eq, idx) => (
                <Text
                  key={idx}
                  style={{
                    fontSize: 12,
                    color: isDark ? '#d1d5db' : '#4b5563',
                    marginBottom: 4,
                    marginLeft: 8,
                  }}
                >
                  • {eq}
                </Text>
              ))}
            </View>
          )}

          {requiredEquipment.length > 0 && (
            <View>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '600',
                  color: '#f59e0b',
                  marginBottom: 8,
                }}
              >
                ○ Recommended Next:
              </Text>
              {requiredEquipment.map((eq, idx) => (
                <Text
                  key={idx}
                  style={{
                    fontSize: 12,
                    color: isDark ? '#d1d5db' : '#4b5563',
                    marginBottom: 4,
                    marginLeft: 8,
                  }}
                >
                  • {eq}
                </Text>
              ))}
            </View>
          )}
        </View>

        {/* Next Steps */}
        {nextSteps.length > 0 && (
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '700',
                color: isDark ? '#ffffff' : '#000000',
                marginBottom: 12,
              }}
            >
              ➡️ NEXT STEPS
            </Text>

            {nextSteps.map((step, idx) => (
              <View
                key={idx}
                style={{
                  backgroundColor: isDark ? '#374151' : '#e0e7ff',
                  borderRadius: 10,
                  padding: 12,
                  marginBottom: 10,
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    marginRight: 10,
                  }}
                >
                  {idx === 0 ? '🎯' : idx === 1 ? '📍' : '✓'}
                </Text>
                <Text
                  style={{
                    flex: 1,
                    fontSize: 12,
                    color: isDark ? '#e5e7eb' : '#1e293b',
                    lineHeight: 18,
                  }}
                >
                  {step}
                </Text>
              </View>
            ))}
          </View>
        )}
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

export default EvidenceIdentifierSheet;
