/**
 * BPM Finder Sheet Component
 * Bottom sheet for speed and EMF detection calibration (Premium Feature)
 */

import { ghostSelectionEmitter } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useLocalization } from '@/hooks/use-localization';
import { usePremium } from '@/hooks/use-premium';
import { GHOSTS, GHOST_LIST } from '@/lib/data/ghosts';
import { HistoryService } from '@/lib/storage/storageService';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  UIManager,
  View
} from 'react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface Props {
  isVisible: boolean;
  onClose: () => void;
}

type CalibrationMode = 'speed' | 'bpm' | 'timing';

const styles = StyleSheet.create({
  header: {
    paddingTop: 24,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
    lineHeight: 28,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.6,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sliderContainer: {
    marginVertical: 12,
  },
  sliderLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  sliderTrack: {
    height: 6,
    borderRadius: 3,
    marginBottom: 8,
  },
  sliderValueDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sliderValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  sliderButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  sliderButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  toggleContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  infoBox: {
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  infoText: {
    fontSize: 12,
    lineHeight: 16,
  },
  premiumPaywall: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    gap: 16,
  },
  premiumTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  premiumDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginHorizontal: 20,
    lineHeight: 20,
  },
  premiumButton: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  premiumButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});

export const EvidenceIdentifierSheet: React.FC<Props> = ({ isVisible, onClose }) => {
  const colors = Colors['dark'];
  const isDark = true;
  const { t } = useLocalization();
  const { isPremium } = usePremium();
  const snapPoints = useMemo(() => ['50%', '90%'], []);
  const bottomSheetRef = useRef<BottomSheet>(null);

  // BPM Finder state
  const [taps, setTaps] = useState<number[]>([]);
  const [calculatedBpm, setCalculatedBpm] = useState(0);
  const [calculatedSpeed, setCalculatedSpeed] = useState('0.00');
  const [tapVisualization, setTapVisualization] = useState('');
  const tapCounterRef = useRef(0);

  // Matched ghosts state
  const [matchedGhosts, setMatchedGhosts] = useState<{ id: string; name: string; type: 'exact' | 'los' }[]>([]);

  // Match ghosts based on detected speed
  const matchGhostsForSpeed = (speedMs: string) => {
    const detectedSpeed = parseFloat(speedMs);
    if (detectedSpeed === 0) {
      setMatchedGhosts([]);
      return;
    }

    const matches: { id: string; name: string; type: 'exact' | 'los' }[] = [];
    const tolerance = 0.05; // ±0.05 m/s tolerance

    Object.values(GHOSTS).forEach((ghost) => {
      if (!ghost.huntSpeed) return;

      // Check exact speed match
      if (Math.abs(ghost.huntSpeed - detectedSpeed) <= tolerance) {
        matches.push({ id: ghost.id, name: ghost.name, type: 'exact' });
      }
      // Check LoS variant if exists
      else if (ghost.huntSpeedLoS && Math.abs(ghost.huntSpeedLoS - detectedSpeed) <= tolerance) {
        matches.push({ id: ghost.id, name: ghost.name, type: 'los' });
      }
    });

    setMatchedGhosts(matches);
  };

  useEffect(() => {
    if (isVisible) {
      HistoryService.trackView('evidence', 'speed-emf-calibration', 'BPM Finder');
    }
  }, [isVisible]);

  // Convert BPM to milliseconds
  const bpmToMs = (bpm: number) => {
    const msPerBeat = 60000 / bpm;
    return msPerBeat.toFixed(2);
  };

  // Calculate BPM from tap intervals
  const calculateBpmFromTaps = (tapList: number[]) => {
    if (tapList.length < 2) return 0;

    const intervals: number[] = [];
    for (let i = 1; i < tapList.length; i++) {
      const interval = (tapList[i] - tapList[i - 1]) / 1000; // Convert to seconds
      if (interval > 0.2 && interval < 5) {
        // Filter out unrealistic intervals (200ms to 5s)
        intervals.push(60 / interval); // Convert to BPM
      }
    }

    if (intervals.length === 0) return 0;

    // Return average of last 5 intervals for smoothness
    const recentIntervals = intervals.slice(-5);
    const avgBpm = recentIntervals.reduce((a, b) => a + b) / recentIntervals.length;
    return Math.round(avgBpm * 100) / 100;
  };

  // Convert BPM to m/s (ghost speed)
  const bpmToSpeed = (bpm: number): string => {
    if (bpm === 0) return '0.00';
    // Convert BPM to frequency (Hz) then to m/s
    // Ghost speed = beats per second * distance per beat
    // Assuming standard ~1.4 meter distance between footsteps
    const beatsPerSecond = bpm / 60;
    const distancePerBeat = 1.4; // meters
    const speed = beatsPerSecond * distancePerBeat;
    return speed.toFixed(2);
  };

  // Handle tap button press
  const handleBpmTap = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const now = Date.now();
    const newTaps = [...taps, now];

    // Keep only last 24 taps (rolling window)
    if (newTaps.length > 24) {
      newTaps.shift();
    }

    setTaps(newTaps);

    // Reset if more than 5 seconds since last tap
    if (newTaps.length > 1 && now - newTaps[newTaps.length - 2] > 5000) {
      setTaps([now]);
      setTapVisualization('');
      tapCounterRef.current = 0;
      return;
    }

    // Update visualization
    const visualChar = tapCounterRef.current % 4 === 0 ? ' .' : '.';
    let newViz = tapVisualization + visualChar;
    if (newViz.length > 33) {
      newViz = newViz.substring(newViz.length - 33);
    }
    setTapVisualization(newViz);
    tapCounterRef.current += 1;

    // Calculate BPM if we have at least 2 taps
    if (newTaps.length >= 2) {
      const bpm = calculateBpmFromTaps(newTaps);
      setCalculatedBpm(bpm);
      const speed = bpmToSpeed(bpm);
      setCalculatedSpeed(speed);
      matchGhostsForSpeed(speed);
    }
  };

  // Clear BPM data
  const clearBpmData = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setTaps([]);
    setCalculatedBpm(0);
    setCalculatedSpeed('0.00');
    setMatchedGhosts([]);
    setTapVisualization('');
    tapCounterRef.current = 0;
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
        {/* Premium Paywall */}
        {!isPremium ? (
          <View style={styles.premiumPaywall}>
            <MaterialIcons name="lock" size={48} color={colors.spectral} />
            <Text style={[styles.premiumTitle, { color: colors.text }]}>Feature Locked</Text>
            <Text style={[styles.premiumDescription, { color: colors.text + '80' }]}>
              BPM Finder is a premium feature
            </Text>
            <Pressable
              onPress={() => {
                onClose();
                Alert.alert('Premium Feature', 'Upgrade to premium to unlock BPM Finder');
              }}
              style={[styles.premiumButton, { backgroundColor: colors.spectral }]}
            >
              <MaterialIcons name="diamond" size={20} color="white" />
              <Text style={styles.premiumButtonText}>Unlock Premium</Text>
            </Pressable>
          </View>
        ) : (
          <>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { color: colors.spectral }]}>
              BPM Finder
            </Text>
            <Text style={[styles.subtitle, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
              Premium detection tool
            </Text>
          </View>
        </View>

        {/* Tab Navigation */}
        {/* Removed - Only BPM section is kept */}

        {/* Speed Offset Calibration - REMOVED */}
        {/* Only BPM section is kept */}
          <View style={styles.section}>
            <View
              style={[
                styles.card,
                {
                  backgroundColor: isDark ? '#1f2937' : '#f9fafb',
                  borderColor: isDark ? '#374151' : '#e5e7eb',
                },
              ]}
            >
              {/* BPM Finder - Tap to Detect */}
              <View>
                <Text
                  style={[
                    styles.sectionTitle,
                    { color: isDark ? '#ffffff' : '#000000', marginBottom: 12 },
                  ]}
                >
                  🎯 BPM Finder (Tap Detection)
                </Text>

                {/* Tap Counter Display */}
                <View style={{ marginBottom: 12 }}>
                  <Text style={[styles.sliderLabel, { color: isDark ? '#d1d5db' : '#4b5563' }]}>
                    Detected BPM
                  </Text>
                  <View
                    style={{
                      backgroundColor: isDark ? '#111827' : '#f3f4f6',
                      borderRadius: 8,
                      padding: 12,
                      marginBottom: 8,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 28,
                        fontWeight: '700',
                        color: colors.spectral,
                        textAlign: 'center',
                      }}
                    >
                      {calculatedBpm === 0 ? '-' : Math.round(calculatedBpm)} BPM
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: isDark ? '#d1d5db' : '#4b5563',
                        textAlign: 'center',
                        marginTop: 6,
                      }}
                    >
                      Speed: {calculatedSpeed} m/s
                    </Text>
                  </View>
                </View>

                {/* Tap Visualization */}
                {tapVisualization.length > 0 && (
                  <View
                    style={{
                      backgroundColor: isDark ? '#111827' : '#f3f4f6',
                      borderRadius: 8,
                      padding: 8,
                      marginBottom: 12,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: 'monospace',
                        color: colors.spectral,
                        textAlign: 'center',
                        letterSpacing: 2,
                      }}
                    >
                      {tapVisualization}
                    </Text>
                  </View>
                )}

                {/* Tap Counter */}
                <Text
                  style={{
                    fontSize: 12,
                    color: isDark ? '#9ca3af' : '#6b7280',
                    textAlign: 'center',
                    marginBottom: 12,
                  }}
                >
                  {taps.length} tap{taps.length !== 1 ? 's' : ''} recorded
                </Text>

                {/* Tap Button */}
                <Pressable
                  onPress={handleBpmTap}
                  style={{
                    backgroundColor: colors.spectral,
                    borderRadius: 12,
                    paddingVertical: 14,
                    marginBottom: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '700',
                      color: '#ffffff',
                    }}
                  >
                    👆 TAP TO DETECT
                  </Text>
                </Pressable>

                {/* Clear Button */}
                {taps.length > 0 && (
                  <Pressable
                    onPress={clearBpmData}
                    style={{
                      backgroundColor: isDark ? '#374151' : '#e5e7eb',
                      borderRadius: 12,
                      paddingVertical: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: isDark ? '#d1d5db' : '#4b5563',
                        textAlign: 'center',
                      }}
                    >
                      Clear Taps
                    </Text>
                  </Pressable>
                )}

                <View
                  style={[
                    styles.infoBox,
                    {
                      backgroundColor: isDark ? '#111827' : '#f3f4f6',
                      marginTop: 12,
                    },
                  ]}
                >
                  <Text style={[styles.infoText, { color: isDark ? '#d1d5db' : '#4b5563' }]}>
                    Tap the button repeatedly to the rhythm of ghost footsteps. Minimum 2 taps required. The tool calculates average speed from your rhythm.
                  </Text>
                </View>

                {/* Matched Ghosts Display */}
                {matchedGhosts.length > 0 && (
                  <View style={{ marginTop: 16 }}>
                    <Text
                      style={[
                        styles.sectionTitle,
                        { color: isDark ? '#ffffff' : '#000000', marginBottom: 12, fontSize: 14 },
                      ]}
                    >
                      👻 Possible Ghosts
                    </Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
                      {matchedGhosts.map((match) => {
                        const ghost = GHOST_LIST.find(g => g.id === match.id);
                        return (
                          <Pressable
                            key={match.id}
                            onPress={() => {
                              if (ghost) {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                ghostSelectionEmitter.emit(ghost);
                              }
                            }}
                            style={{
                              backgroundColor:
                                match.type === 'exact'
                                  ? colors.spectral + '30'
                                  : colors.spectral + '15',
                              borderWidth: match.type === 'los' ? 2 : 1,
                              borderColor:
                                match.type === 'exact' ? colors.spectral : colors.spectral + '60',
                              borderRadius: 10,
                              paddingVertical: 10,
                              paddingHorizontal: 14,
                              marginRight: 10,
                              justifyContent: 'center',
                              alignItems: 'center',
                              minWidth: 110,
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 13,
                                fontWeight: '700',
                                color: colors.spectral,
                                textAlign: 'center',
                              }}
                            >
                              {match.name}
                            </Text>
                            {match.type === 'los' && (
                              <Text
                                style={{
                                  fontSize: 10,
                                  color: colors.spectral + 'CC',
                                  marginTop: 4,
                                }}
                              >
                                (LoS variant)
                              </Text>
                            )}
                          </Pressable>
                        );
                      })}
                    </ScrollView>
                  </View>
                )}
              </View>
            </View>
          </View>
        {/* Timing Mode Toggle - REMOVED */}
        {/* Only BPM section is kept */}

        {/* Quick Tips */}
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              { color: isDark ? '#ffffff' : '#000000', marginBottom: 12 },
            ]}
          >
            💡 Pro Tips
          </Text>
          <View
            style={[
              styles.card,
              {
                backgroundColor: isDark ? '#1f2937' : '#f9fafb',
                borderColor: isDark ? '#374151' : '#e5e7eb',
              },
            ]}
          >
            <Text style={[styles.infoText, { color: isDark ? '#d1d5db' : '#4b5563' }]}>
              • Tap to the rhythm of ghost footsteps for accurate BPM detection{'\n'}
              • Minimum 2 taps required to calculate speed{'\n'}
              • The tool calculates average speed from your rhythm pattern
            </Text>
          </View>
        </View>
          </>
        )}
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

export default EvidenceIdentifierSheet;
