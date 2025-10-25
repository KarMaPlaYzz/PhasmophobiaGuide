/**
 * Loadout Preset Sheet Component
 * Bottom sheet UI for viewing, creating, editing, and sharing loadout presets
 * Premium feature - requires isPremium flag
 */

import { Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { BlurView } from 'expo-blur';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import * as Sharing from 'expo-sharing';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useLocalization } from '@/hooks/use-localization';
import { usePremiumContext } from '@/lib/context/PremiumContext';
import loadoutService from '@/lib/services/loadoutService';
import { LoadoutRecommendation } from '@/lib/types';

interface LoadoutPresetSheetProps {
  isVisible: boolean;
  onClose: () => void;
  currentLoadout?: LoadoutRecommendation;
  onLoadoutSelected?: (loadout: LoadoutRecommendation) => void;
}

type SheetView = 'list' | 'create' | 'edit' | 'details';

export const LoadoutPresetSheet = ({
  isVisible,
  onClose,
  currentLoadout,
  onLoadoutSelected,
}: LoadoutPresetSheetProps) => {
  const colors = Colors['dark'];
  const { t } = useLocalization();
  const { isPremium } = usePremiumContext();

  // State management
  const [view, setView] = useState<SheetView>('list');
  const [presets, setPresets] = useState<LoadoutRecommendation[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<LoadoutRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form state for create/edit
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tags: '',
  });

  // Load presets when sheet opens
  useEffect(() => {
    if (isVisible) {
      loadPresetsData();
    }
  }, [isVisible]);

  const loadPresetsData = async () => {
    try {
      setIsLoading(true);
      const data = await loadoutService.getPresets();
      setPresets(data);
    } catch (error) {
      console.error('[LoadoutPresetSheet] Error loading presets:', error);
      Alert.alert('Error', 'Failed to load presets');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePreset = async () => {
    console.log('[LoadoutPresetSheet] Save button pressed');
    
    if (!formData.name.trim()) {
      console.warn('[LoadoutPresetSheet] Save failed: No preset name provided');
      Alert.alert('Validation', 'Please enter a preset name');
      return;
    }

    if (!currentLoadout) {
      console.warn('[LoadoutPresetSheet] Save failed: No current loadout available');
      Alert.alert('Error', 'No loadout to save');
      return;
    }

    try {
      setIsLoading(true);
      console.log('[LoadoutPresetSheet] Attempting to save preset:', formData.name);
      
      const preset = await loadoutService.savePreset({
        ...currentLoadout,
        name: formData.name,
        description: formData.description,
        tags: formData.tags
          .split(',')
          .map(t => t.trim())
          .filter(t => t.length > 0),
      });

      console.log('[LoadoutPresetSheet] Preset saved successfully:', preset.id);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Success', `Preset "${preset.name}" saved!`);

      // Reset form and reload, then open details view
      setFormData({ name: '', description: '', tags: '' });
      console.log('[LoadoutPresetSheet] Loading presets and opening details view');
      
      await loadPresetsData();
      setSelectedPreset(preset);
      setView('details');
      
      console.log('[LoadoutPresetSheet] Details view opened for saved preset');
    } catch (error) {
      console.error('[LoadoutPresetSheet] Error saving preset:', error);
      Alert.alert('Error', 'Failed to save preset');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePreset = (presetId: string) => {
    Alert.alert('Delete Preset', 'Are you sure you want to delete this preset?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            setIsLoading(true);
            await loadoutService.deletePreset(presetId);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            await loadPresetsData();
            setView('list');
          } catch (error) {
            console.error('[LoadoutPresetSheet] Error deleting preset:', error);
            Alert.alert('Error', 'Failed to delete preset');
          } finally {
            setIsLoading(false);
          }
        },
      },
    ]);
  };

  const handleClonePreset = async (preset: LoadoutRecommendation) => {
    try {
      setIsLoading(true);
      const cloned = await loadoutService.clonePreset(preset.id, `${preset.name} (Copy)`);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Success', 'Preset cloned successfully!');
      await loadPresetsData();
    } catch (error) {
      console.error('[LoadoutPresetSheet] Error cloning preset:', error);
      Alert.alert('Error', 'Failed to clone preset');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSharePreset = async (preset: LoadoutRecommendation) => {
    try {
      const code = loadoutService.generatePresetCode(preset);
      const message = `📋 Loadout: ${preset.name}\n\nCode: ${code}\n\nCheck it out in Phasmophobia Guide!`;

      await Sharing.shareAsync('', {
        dialogTitle: 'Share Loadout',
        mimeType: 'text/plain',
        UTI: 'text/plain',
      });

      // Also copy code to clipboard
      await Clipboard.setStringAsync(code);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Copied', `Code copied to clipboard: ${code}`);
    } catch (error) {
      console.error('[LoadoutPresetSheet] Error sharing preset:', error);
    }
  };

  const handleLoadPreset = (preset: LoadoutRecommendation) => {
    Haptics.selectionAsync();
    onLoadoutSelected?.(preset);
    Alert.alert('Loaded', `Loadout "${preset.name}" applied!`);
    onClose();
  };

  const filteredPresets = presets.filter(
    p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Premium gate
  if (!isPremium) {
    return (
      <BottomSheet
        snapPoints={[300]}
        enablePanDownToClose={true}
        onClose={onClose}
        index={isVisible ? 0 : -1}
        animateOnMount={true}
        backgroundComponent={() => (
          <BlurView intensity={90} tint="dark" style={StyleSheet.absoluteFillObject} />
        )}
        handleIndicatorStyle={{ backgroundColor: colors.spectral }}
      >
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <View style={styles.premiumGate}>
            <Ionicons name="lock-closed" size={48} color={colors.spectral} />
            <ThemedText style={styles.premiumTitle}>Premium Feature</ThemedText>
            <ThemedText style={[styles.premiumDescription, { color: colors.text + '99' }]}>
              Loadout Presets are a premium feature
            </ThemedText>
          </View>
        </View>
      </BottomSheet>
    );
  }

  // LIST VIEW
  if (view === 'list') {
    return (
      <BottomSheet
        snapPoints={[600, 800]}
        enablePanDownToClose={true}
        onClose={onClose}
        index={isVisible ? 0 : -1}
        animateOnMount={true}
        backgroundComponent={() => (
          <BlurView intensity={90} tint="dark" style={StyleSheet.absoluteFillObject} />
        )}
        handleIndicatorStyle={{ backgroundColor: colors.spectral }}
      >
        <BottomSheetScrollView
          style={[styles.container, { backgroundColor: colors.background }]}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <ThemedText style={styles.title}>Loadout Presets</ThemedText>
            <ThemedText style={[styles.subtitle, { color: colors.text + '99' }]}>
              {presets.length} saved
            </ThemedText>
          </View>

          {/* Search */}
          <View style={[styles.searchContainer, { backgroundColor: colors.surfaceLight }]}>
            <Ionicons name="search" size={20} color={colors.text + '99'} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search presets..."
              placeholderTextColor={colors.text + '66'}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Create New Button */}
          {currentLoadout && (
            <TouchableOpacity
              style={[styles.createButton, { backgroundColor: colors.spectral }]}
              onPress={() => {
                setFormData({ name: '', description: '', tags: '' });
                setView('create');
              }}
            >
              <Ionicons name="add-circle" size={20} color="white" />
              <ThemedText style={styles.createButtonText}>Create New Preset</ThemedText>
            </TouchableOpacity>
          )}

          {/* Presets List */}
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.spectral} />
            </View>
          ) : filteredPresets.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="layers-outline" size={48} color={colors.text + '66'} />
              <ThemedText style={styles.emptyStateText}>No presets yet</ThemedText>
              <ThemedText style={[styles.emptyStateSubtext, { color: colors.text + '66' }]}>
                Create one from the Equipment Optimizer
              </ThemedText>
            </View>
          ) : (
            <View style={styles.presetsList}>
              {filteredPresets.map(preset => (
                <PresetListItem
                  key={preset.id}
                  preset={preset}
                  colors={colors}
                  onLoad={() => handleLoadPreset(preset)}
                  onDetails={() => {
                    setSelectedPreset(preset);
                    setView('details');
                  }}
                  onShare={() => handleSharePreset(preset)}
                  onClone={() => handleClonePreset(preset)}
                  onDelete={() => handleDeletePreset(preset.id)}
                />
              ))}
            </View>
          )}
        </BottomSheetScrollView>
      </BottomSheet>
    );
  }

  // CREATE VIEW
  if (view === 'create') {
    return (
      <BottomSheet
        snapPoints={[600, 800]}
        enablePanDownToClose={true}
        onClose={onClose}
        index={isVisible ? 0 : -1}
        animateOnMount={true}
        backgroundComponent={() => (
          <BlurView intensity={90} tint="dark" style={StyleSheet.absoluteFillObject} />
        )}
        handleIndicatorStyle={{ backgroundColor: colors.spectral }}
      >
        <BottomSheetScrollView
          style={[styles.container, { backgroundColor: colors.background }]}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setView('list')}>
              <Ionicons name="chevron-back" size={24} color={colors.spectral} />
            </TouchableOpacity>
            <ThemedText style={styles.title}>Save Preset</ThemedText>
            <View style={{ width: 24 }} />
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Name Input */}
            <View style={styles.formField}>
              <ThemedText style={styles.formLabel}>Preset Name *</ThemedText>
              <TextInput
                style={[styles.textInput, { borderColor: colors.spectral, color: colors.text }]}
                placeholder="e.g., Wraith Hunter"
                placeholderTextColor={colors.text + '66'}
                value={formData.name}
                onChangeText={name => setFormData({ ...formData, name })}
                editable={!isLoading}
              />
            </View>

            {/* Description Input */}
            <View style={styles.formField}>
              <ThemedText style={styles.formLabel}>Description (Optional)</ThemedText>
              <TextInput
                style={[
                  styles.textInput,
                  styles.textAreaInput,
                  { borderColor: colors.spectral, color: colors.text },
                ]}
                placeholder="e.g., Best loadout for aggressive hunting"
                placeholderTextColor={colors.text + '66'}
                value={formData.description}
                onChangeText={description => setFormData({ ...formData, description })}
                multiline
                numberOfLines={4}
                editable={!isLoading}
              />
            </View>

            {/* Tags Input */}
            <View style={styles.formField}>
              <ThemedText style={styles.formLabel}>Tags (Optional)</ThemedText>
              <ThemedText style={[styles.formHint, { color: colors.text + '66' }]}>
                Separate tags with commas
              </ThemedText>
              <TextInput
                style={[styles.textInput, { borderColor: colors.spectral, color: colors.text }]}
                placeholder="e.g., aggressive, wraith, solo"
                placeholderTextColor={colors.text + '66'}
                value={formData.tags}
                onChangeText={tags => setFormData({ ...formData, tags })}
                editable={!isLoading}
              />
            </View>

            {/* Current Loadout Summary */}
            {currentLoadout && (
              <View style={[styles.summaryBox, { backgroundColor: colors.surfaceLight }]}>
                <ThemedText style={styles.summaryTitle}>Loadout Summary</ThemedText>
                <View style={styles.summaryRow}>
                  <ThemedText style={styles.summaryLabel}>Playstyle:</ThemedText>
                  <ThemedText style={styles.summaryValue}>{currentLoadout.playstyle}</ThemedText>
                </View>
                <View style={styles.summaryRow}>
                  <ThemedText style={styles.summaryLabel}>Cost:</ThemedText>
                  <ThemedText style={styles.summaryValue}>${currentLoadout.totalCost}</ThemedText>
                </View>
                <View style={styles.summaryRow}>
                  <ThemedText style={styles.summaryLabel}>Equipment:</ThemedText>
                  <ThemedText style={styles.summaryValue}>
                    {currentLoadout.essential.length + currentLoadout.recommended.length} items
                  </ThemedText>
                </View>
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border }]}
              onPress={() => setView('list')}
              disabled={isLoading}
            >
              <ThemedText style={[styles.buttonText, { color: colors.text }]}>Cancel</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: colors.spectral, opacity: isLoading ? 0.6 : 1 },
              ]}
              onPress={() => {
                console.log('[LoadoutPresetSheet] Save button pressed (onPress event)');
                handleSavePreset();
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <ThemedText style={styles.buttonText}>Save Preset</ThemedText>
              )}
            </TouchableOpacity>
          </View>
        </BottomSheetScrollView>
      </BottomSheet>
    );
  }

  // DETAILS VIEW
  if (view === 'details' && selectedPreset) {
    return (
      <BottomSheet
        snapPoints={[700, 900]}
        enablePanDownToClose={true}
        onClose={onClose}
        index={isVisible ? 0 : -1}
        animateOnMount={true}
        backgroundComponent={() => (
          <BlurView intensity={90} tint="dark" style={StyleSheet.absoluteFillObject} />
        )}
        handleIndicatorStyle={{ backgroundColor: colors.spectral }}
      >
        <BottomSheetScrollView
          style={[styles.container, { backgroundColor: colors.background }]}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setView('list')}>
              <Ionicons name="chevron-back" size={24} color={colors.spectral} />
            </TouchableOpacity>
            <ThemedText style={styles.title} numberOfLines={1}>
              {selectedPreset.name}
            </ThemedText>
            <View style={{ width: 24 }} />
          </View>

          {/* Details */}
          <View style={styles.detailsContent}>
            {selectedPreset.description && (
              <View style={styles.detailSection}>
                <ThemedText style={styles.detailLabel}>Description</ThemedText>
                <ThemedText style={[styles.detailValue, { color: colors.text + '99' }]}>
                  {selectedPreset.description}
                </ThemedText>
              </View>
            )}

            <View style={[styles.detailsGrid, { backgroundColor: colors.surfaceLight }]}>
              <DetailCard
                label="Playstyle"
                value={selectedPreset.playstyle}
                colors={colors}
              />
              <DetailCard
                label="Difficulty"
                value={selectedPreset.difficulty}
                colors={colors}
              />
              <DetailCard
                label="Total Cost"
                value={`$${selectedPreset.totalCost}`}
                colors={colors}
              />
              <DetailCard
                label="Efficiency"
                value={`${selectedPreset.efficiency}%`}
                colors={colors}
              />
            </View>

            {/* Equipment */}
            <View style={styles.detailSection}>
              <ThemedText style={styles.detailLabel}>Equipment ({selectedPreset.essential.length + selectedPreset.recommended.length})</ThemedText>
              <View style={styles.equipmentList}>
                {selectedPreset.essential.map((eq, i) => (
                  <View key={i} style={[styles.equipmentItem, { backgroundColor: colors.surfaceLight }]}>
                    <View style={[styles.equipmentBadge, { backgroundColor: colors.spectral }]}>
                      <ThemedText style={styles.equipmentBadgeText}>E</ThemedText>
                    </View>
                    <ThemedText numberOfLines={1}>{eq}</ThemedText>
                  </View>
                ))}
                {selectedPreset.recommended.map((eq, i) => (
                  <View key={i} style={[styles.equipmentItem, { backgroundColor: colors.surfaceLight }]}>
                    <View style={[styles.equipmentBadge, { backgroundColor: colors.text + '33' }]}>
                      <ThemedText style={styles.equipmentBadgeText}>R</ThemedText>
                    </View>
                    <ThemedText numberOfLines={1}>{eq}</ThemedText>
                  </View>
                ))}
              </View>
            </View>

            {/* Tags */}
            {selectedPreset.tags.length > 0 && (
              <View style={styles.detailSection}>
                <ThemedText style={styles.detailLabel}>Tags</ThemedText>
                <View style={styles.tagsList}>
                  {selectedPreset.tags.map((tag, i) => (
                    <View key={i} style={[styles.tag, { backgroundColor: colors.spectral + '33' }]}>
                      <ThemedText style={[styles.tagText, { color: colors.spectral }]}>
                        {tag}
                      </ThemedText>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.detailActions}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.spectral }]}
              onPress={() => handleLoadPreset(selectedPreset)}
            >
              <Ionicons name="checkmark-circle" size={20} color="white" />
              <ThemedText style={styles.actionButtonText}>Load Preset</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.text + '22' }]}
              onPress={() => handleSharePreset(selectedPreset)}
            >
              <Ionicons name="share-social" size={20} color={colors.spectral} />
              <ThemedText style={[styles.actionButtonText, { color: colors.spectral }]}>
                Share
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.text + '22' }]}
              onPress={() => handleClonePreset(selectedPreset)}
            >
              <Ionicons name="copy" size={20} color={colors.spectral} />
              <ThemedText style={[styles.actionButtonText, { color: colors.spectral }]}>
                Clone
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#FF4444' }]}
              onPress={() => {
                handleDeletePreset(selectedPreset.id);
              }}
            >
              <Ionicons name="trash" size={20} color="white" />
              <ThemedText style={styles.actionButtonText}>Delete</ThemedText>
            </TouchableOpacity>
          </View>
        </BottomSheetScrollView>
      </BottomSheet>
    );
  }

  return null;
};

// Sub-component: Preset List Item
const PresetListItem = ({
  preset,
  colors,
  onLoad,
  onDetails,
  onShare,
  onClone,
  onDelete,
}: {
  preset: LoadoutRecommendation;
  colors: typeof Colors['dark'];
  onLoad: () => void;
  onDetails: () => void;
  onShare: () => void;
  onClone: () => void;
  onDelete: () => void;
}) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <TouchableOpacity
      style={[styles.presetItem, { backgroundColor: colors.surfaceLight }]}
      onPress={onDetails}
      onLongPress={() => {
        Haptics.selectionAsync();
        setShowActions(!showActions);
      }}
    >
      <View style={styles.presetItemContent}>
        <ThemedText style={styles.presetItemName}>{preset.name}</ThemedText>
        <View style={styles.presetItemMeta}>
          <ThemedText style={[styles.presetItemMetaText, { color: colors.text + '99' }]}>
            {preset.playstyle}
          </ThemedText>
          <ThemedText style={[styles.presetItemMetaText, { color: colors.text + '99' }]}>
            • ${preset.totalCost}
          </ThemedText>
        </View>
        {preset.description && (
          <ThemedText style={[styles.presetItemDesc, { color: colors.text + '66' }]} numberOfLines={1}>
            {preset.description}
          </ThemedText>
        )}
      </View>

      {showActions && (
        <View style={styles.presetActions}>
          <TouchableOpacity style={styles.presetActionButton} onPress={onLoad}>
            <Ionicons name="checkmark" size={16} color={colors.spectral} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.presetActionButton} onPress={onShare}>
            <Ionicons name="share-social" size={16} color={colors.spectral} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.presetActionButton} onPress={onClone}>
            <Ionicons name="copy" size={16} color={colors.spectral} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.presetActionButton} onPress={onDelete}>
            <Ionicons name="trash" size={16} color="#FF4444" />
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

// Sub-component: Detail Card
const DetailCard = ({
  label,
  value,
  colors,
}: {
  label: string;
  value: string;
  colors: typeof Colors['dark'];
}) => (
  <View style={styles.detailCard}>
    <ThemedText style={[styles.detailCardLabel, { color: colors.text + '66' }]}>
      {label}
    </ThemedText>
    <ThemedText style={styles.detailCardValue}>{value}</ThemedText>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  // Premium Gate
  premiumGate: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  premiumTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
  },
  premiumDescription: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 14,
  },
  // Create Button
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
  },
  createButtonText: {
    fontWeight: '600',
    fontSize: 16,
    color: 'white',
  },
  // Presets List
  presetsList: {
    gap: 12,
  },
  presetItem: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  presetItemContent: {
    flex: 1,
  },
  presetItemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  presetItemMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  presetItemMetaText: {
    fontSize: 12,
  },
  presetItemDesc: {
    fontSize: 12,
    marginTop: 4,
  },
  presetActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingTop: 8,
  },
  presetActionButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
  },
  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
  },
  emptyStateSubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  // Loading
  loadingContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  // Form
  form: {
    gap: 20,
    marginBottom: 20,
  },
  formField: {
    gap: 8,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  formHint: {
    fontSize: 12,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  textAreaInput: {
    minHeight: 80,
    paddingTop: 10,
    textAlignVertical: 'top',
  },
  summaryBox: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  summaryTitle: {
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    fontSize: 12,
  },
  summaryValue: {
    fontSize: 12,
    fontWeight: '600',
  },
  // Buttons
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 16,
  },
  // Details View
  detailsContent: {
    gap: 20,
    marginBottom: 20,
  },
  detailSection: {
    gap: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 14,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    borderRadius: 12,
    padding: 12,
  },
  detailCard: {
    flex: 1,
    minWidth: '48%',
    alignItems: 'center',
  },
  detailCardLabel: {
    fontSize: 12,
  },
  detailCardValue: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  equipmentList: {
    gap: 6,
  },
  equipmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
  },
  equipmentBadge: {
    width: 24,
    height: 24,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  equipmentBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  // Detail Actions
  detailActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    minWidth: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 8,
  },
  actionButtonText: {
    fontWeight: '600',
    fontSize: 14,
    color: 'white',
  },
});
