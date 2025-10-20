import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { scrollRefRegistry } from '@/components/haptic-tab';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
    DIFFICULTY_SETTINGS,
    getSanityStatus,
} from '@/lib/data/sanity';

type Difficulty = 'amateur' | 'intermediate' | 'professional' | 'nightmare' | 'insanity';
type MapSize = 'small' | 'medium' | 'large';

const DIFFICULTIES: { key: Difficulty; label: string }[] = [
  { key: 'amateur', label: 'Amateur' },
  { key: 'intermediate', label: 'Intermediate' },
  { key: 'professional', label: 'Professional' },
  { key: 'nightmare', label: 'Nightmare' },
  { key: 'insanity', label: 'Insanity' },
];

const MAP_SIZES: { key: MapSize; label: string; multiplier: number }[] = [
  { key: 'small', label: 'Small', multiplier: 1.0 },
  { key: 'medium', label: 'Medium', multiplier: 1.2 },
  { key: 'large', label: 'Large', multiplier: 1.5 },
];

export default function SanityCulculatorScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  const route = useRoute();

  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('professional');
  const [selectedMapSize, setSelectedMapSize] = useState<MapSize>('medium');
  const [currentSanity, setCurrentSanity] = useState(100);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Use callback ref to always have the latest ref
  const handleScrollRef = (ref: ScrollView | null) => {
    if (ref) {
      scrollRefRegistry.set(route.name, ref as any);
    }
  };

  // Get difficulty settings
  const difficultySettings = useMemo(() => {
    return DIFFICULTY_SETTINGS[selectedDifficulty];
  }, [selectedDifficulty]);

  // Get map size multiplier
  const mapMultiplier = useMemo(() => {
    return MAP_SIZES.find((m) => m.key === selectedMapSize)?.multiplier || 1.0;
  }, [selectedMapSize]);

  // Calculate adjusted drain rate with map size
  const drainRatePerSecond = useMemo(() => {
    if (!difficultySettings) return 0;
    return difficultySettings.passiveDrainPerSecond * mapMultiplier;
  }, [difficultySettings, mapMultiplier]);

  // Calculate sanity at hunt threshold
  const sanityAtHunt = useMemo(() => {
    if (!difficultySettings) return 40;
    return difficultySettings.huntTriggerSanity;
  }, [difficultySettings]);

  // Calculate time to hunt
  const timeToHunt = useMemo(() => {
    const sanityDifference = currentSanity - sanityAtHunt;
    if (sanityDifference <= 0) return 0;
    return Math.ceil(sanityDifference / drainRatePerSecond);
  }, [currentSanity, sanityAtHunt, drainRatePerSecond]);

  // Get sanity status
  const sanityStatus = useMemo(() => {
    return getSanityStatus(currentSanity);
  }, [currentSanity]);

  // Calculate sanity timeline (when it will reach key thresholds)
  const timeline = useMemo(() => {
    const thresholds = [100, 80, 60, 40, 20, 0];
    return thresholds.map((sanity) => {
      const timeToreachSanity = Math.ceil(
        (currentSanity - sanity) / drainRatePerSecond
      );
      return {
        sanity,
        timeSeconds: timeToreachSanity >= 0 ? timeToreachSanity : 0,
        timeMinutes: Math.floor(timeToreachSanity / 60),
      };
    });
  }, [currentSanity, drainRatePerSecond]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'amateur':
        return '#1FB46B';
      case 'intermediate':
        return '#FFB84D';
      case 'professional':
        return '#FF4444';
      case 'nightmare':
        return '#6B4AAC';
      case 'insanity':
        return '#FF0000';
      default:
        return colors.text;
    }
  };

  const formatTime = (seconds: number) => {
    if (seconds === 0) return '0s';
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (minutes === 0) return `${secs}s`;
    return `${minutes}m ${secs}s`;
  };

  const getSanityColor = (sanity: number) => {
    if (sanity >= 60) return '#1FB46B';
    if (sanity >= 40) return '#FFB84D';
    if (sanity >= 20) return '#FF4444';
    return '#FF0000';
  };

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <ThemedText
          type="title"
          style={[styles.headerTitle, { color: colors.spectral }]}
        >
          Sanity Calculator
        </ThemedText>
      </View>

      <ScrollView ref={handleScrollRef} style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Difficulty Selection */}
        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: colors.spectral }]}>
            Difficulty
          </ThemedText>
          <View style={styles.buttonGrid}>
            {DIFFICULTIES.map((diff) => (
              <TouchableOpacity
                key={diff.key}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelectedDifficulty(diff.key);
                }}
                style={[
                  styles.difficultyButton,
                  {
                    backgroundColor:
                      selectedDifficulty === diff.key
                        ? getDifficultyColor(diff.key)
                        : colors.surface,
                    borderColor:
                      selectedDifficulty === diff.key
                        ? getDifficultyColor(diff.key)
                        : colors.border,
                  },
                ]}
              >
                <ThemedText
                  style={[
                    styles.buttonText,
                    {
                      color:
                        selectedDifficulty === diff.key ? 'white' : colors.text,
                      fontWeight: selectedDifficulty === diff.key ? 'bold' : '600',
                    },
                  ]}
                >
                  {diff.label}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Map Size Selection */}
        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: colors.spectral }]}>
            Map Size
          </ThemedText>
          <View style={styles.buttonRow}>
            {MAP_SIZES.map((size) => (
              <TouchableOpacity
                key={size.key}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelectedMapSize(size.key);
                }}
                style={[
                  styles.sizeButton,
                  {
                    backgroundColor:
                      selectedMapSize === size.key
                        ? colors.spectral
                        : colors.surface,
                    borderColor: colors.border,
                  },
                ]}
              >
                <ThemedText
                  style={[
                    styles.buttonText,
                    {
                      color:
                        selectedMapSize === size.key ? 'white' : colors.text,
                    },
                  ]}
                >
                  {size.label}
                </ThemedText>
                <ThemedText
                  style={[
                    styles.multiplierText,
                    {
                      color:
                        selectedMapSize === size.key
                          ? 'rgba(255,255,255,0.8)'
                          : colors.text + 'AA',
                    },
                  ]}
                >
                  {size.multiplier}x
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Current Sanity Slider */}
        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: colors.spectral }]}>
            Current Sanity: {currentSanity}%
          </ThemedText>
          <View style={styles.sliderContainer}>
            <View
              style={[
                styles.sliderTrack,
                { backgroundColor: colors.spectral + '30' },
              ]}
            >
              <View
                style={[
                  styles.sliderFill,
                  {
                    width: `${currentSanity}%`,
                    backgroundColor: getSanityColor(currentSanity),
                  },
                ]}
              />
            </View>
          </View>
          <View style={styles.sliderButtonRow}>
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setCurrentSanity(Math.max(0, currentSanity - 10));
              }}
              style={[
                styles.sliderButton,
                { backgroundColor: colors.spectral + '20' },
              ]}
            >
              <Ionicons
                size={20}
                name="remove"
                color={colors.spectral}
              />
              <ThemedText style={{ color: colors.spectral }}>10%</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setCurrentSanity(Math.min(100, currentSanity + 10));
              }}
              style={[
                styles.sliderButton,
                { backgroundColor: colors.spectral + '20' },
              ]}
            >
              <Ionicons
                size={20}
                name="add"
                color={colors.spectral}
              />
              <ThemedText style={{ color: colors.spectral }}>10%</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setCurrentSanity(100)}
              style={[
                styles.sliderButton,
                { backgroundColor: colors.spectral + '20' },
              ]}
            >
              <Ionicons
                size={20}
                name="refresh"
                color={colors.spectral}
              />
              <ThemedText style={{ color: colors.spectral }}>Reset</ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sanity Status Card */}
        <View
          style={[
            styles.statusCard,
            {
              backgroundColor: colors.spectral + '15',
              borderColor: colors.spectral,
            },
          ]}
        >
          <View style={styles.statusRow}>
            <ThemedText style={styles.statusLabel}>Status:</ThemedText>
            <ThemedText style={[styles.statusValue, { color: colors.spectral }]}>
              {sanityStatus.status}
            </ThemedText>
          </View>

          <View style={styles.statusRow}>
            <ThemedText style={styles.statusLabel}>Hunt Allowed:</ThemedText>
            <ThemedText
              style={[
                styles.statusValue,
                {
                  color: sanityStatus.huntsAllowed ? '#FF4444' : '#1FB46B',
                },
              ]}
            >
              {sanityStatus.huntsAllowed ? 'YES ⚠️' : 'No'}
            </ThemedText>
          </View>

          <View style={styles.statusRow}>
            <ThemedText style={styles.statusLabel}>Activity:</ThemedText>
            <ThemedText style={[styles.statusValue, { color: colors.spectral }]}>
              {sanityStatus.ghostActivity}
            </ThemedText>
          </View>
        </View>

        {/* Drain Rate Info */}
        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: colors.spectral }]}>
            Drain Rate
          </ThemedText>
          <View
            style={[
              styles.infoCard,
              { backgroundColor: colors.surfaceLight, borderColor: colors.border },
            ]}
          >
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>
                Drain Rate (per second):
              </ThemedText>
              <ThemedText style={styles.infoValue}>
                {drainRatePerSecond.toFixed(2)}% / sec
              </ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>
                Drain Rate (per minute):
              </ThemedText>
              <ThemedText style={styles.infoValue}>
                {(drainRatePerSecond * 60).toFixed(1)}% / min
              </ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>
                Time to Hunt Threshold:
              </ThemedText>
              <ThemedText style={styles.infoValue}>
                {formatTime(timeToHunt)}
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Timeline 
        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: colors.spectral }]}>
            Sanity Timeline
          </ThemedText>
          <View
            style={[
              styles.timelineContainer,
              {
                backgroundColor: colors.surfaceLight,
                borderColor: colors.border,
              },
            ]}
          >
            {timeline.map((item, index) => (
              <View key={index}>
                <View style={styles.timelineItem}>
                  <View
                    style={[
                      styles.timelineDot,
                      { backgroundColor: getSanityColor(item.sanity) },
                    ]}
                  />
                  <View style={styles.timelineContent}>
                    <ThemedText style={styles.timelineSanity}>
                      {item.sanity}% Sanity
                    </ThemedText>
                    <ThemedText style={styles.timelineTime}>
                      {item.timeMinutes > 0
                        ? `${item.timeMinutes}m ${item.timeSeconds % 60}s`
                        : `${item.timeSeconds}s`}
                    </ThemedText>
                  </View>
                </View>
                {index < timeline.length - 1 && (
                  <View
                    style={[
                      styles.timelineLine,
                      { backgroundColor: colors.border },
                    ]}
                  />
                )}
              </View>
            ))}
          </View>
        </View>*/}

        {/* Tips Section */}
        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: colors.spectral }]}>
            💡 Tips
          </ThemedText>
          <View style={styles.tipsContainer}>
            <ThemedText style={styles.tipText}>
              • Map size affects sanity drain rate. Larger maps mean slower drain.
            </ThemedText>
            <ThemedText style={styles.tipText}>
              • Use sanity medications strategically before hunt threshold.
            </ThemedText>
            <ThemedText style={styles.tipText}>
              • Group with teammates to reduce sanity drain by 5% per player.
            </ThemedText>
            <ThemedText style={styles.tipText}>
              • Firelights provide 20-40% drain reduction while burning.
            </ThemedText>
            <ThemedText style={styles.tipText}>
              • Stay calm - higher sanity means fewer ghost hunts!
            </ThemedText>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingVertical: 16, paddingHorizontal: 16 },
  headerTitle: { fontSize: 28, fontWeight: 'bold' },
  content: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },

  // Sections
  section: { marginBottom: 28 },
  sectionTitle: { fontSize: 17, fontWeight: '700', marginBottom: 14 },

  // Difficulty Selection
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  difficultyButton: {
    flex: 1,
    minWidth: '30%',
    paddingVertical: 13,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 0,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },

  // Map Size Selection
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  sizeButton: {
    flex: 1,
    paddingVertical: 13,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 0,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  multiplierText: { fontSize: 13, marginTop: 5, opacity: 0.65, fontWeight: '500' },

  // Slider
  sliderContainer: { marginBottom: 14 },
  sliderTrack: {
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
  },
  sliderFill: { height: '100%', borderRadius: 18 },
  sliderButtonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  sliderButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },

  // Button Text
  buttonText: { fontSize: 14, textAlign: 'center', fontWeight: '700' },

  // Status Card
  statusCard: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 0,
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statusLabel: { fontSize: 14, opacity: 0.65, fontWeight: '500' },
  statusValue: { fontSize: 15, fontWeight: '700' },

  // Info Card
  infoCard: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
  },
  infoLabel: { fontSize: 13, opacity: 0.65, fontWeight: '500' },
  infoValue: { fontSize: 14, fontWeight: '700' },

  // Timeline
  timelineContainer: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  timelineDot: {
    width: 13,
    height: 13,
    borderRadius: 6.5,
    marginRight: 13,
  },
  timelineContent: { flex: 1 },
  timelineSanity: { fontSize: 15, fontWeight: '700' },
  timelineTime: { fontSize: 13, opacity: 0.65, marginTop: 3, fontWeight: '500' },
  timelineLine: {
    height: 22,
    width: 2,
    marginLeft: 6,
  },

  // Tips
  tipsContainer: { gap: 10 },
  tipText: { fontSize: 14, opacity: 0.75, lineHeight: 20 },
});
