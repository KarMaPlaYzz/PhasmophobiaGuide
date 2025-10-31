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
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';

import { CollapsibleSection } from '@/components/collapsible-section';
import { EquipmentDetailSheet } from '@/components/equipment-detail-sheet';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useLocalization } from '@/hooks/use-localization';
import { usePremiumContext } from '@/lib/context/PremiumContext';
import { ALL_EQUIPMENT } from '@/lib/data/equipment';
import loadoutService from '@/lib/services/loadoutService';
import { Equipment, LoadoutRecommendation } from '@/lib/types';

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
  const [expandedPresetActions, setExpandedPresetActions] = useState<string | null>(null);

  // Form state for create/edit
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tags: '',
  });

  // Details view state
  const [expandedEquipment, setExpandedEquipment] = useState(true);
  const [expandedTags, setExpandedTags] = useState(false);
  const [expandedFormSection, setExpandedFormSection] = useState(true);
  const [expandedSummarySection, setExpandedSummarySection] = useState(true);

  // Equipment detail sheet state
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [showEquipmentDetail, setShowEquipmentDetail] = useState(false);
  const [hasSeenLongPressHint, setHasSeenLongPressHint] = useState(false);

  // Load presets when sheet opens
  useEffect(() => {
    if (isVisible) {
      loadPresetsData();
    }
  }, [isVisible]);

  const loadPresetsData = async () => {
    try {
      console.log('[LoadoutPresetSheet.loadPresetsData] Starting to load presets...');
      setIsLoading(true);
      const data = await loadoutService.getPresets();
      console.log('[LoadoutPresetSheet.loadPresetsData] Loaded presets:', data.length);
      data.forEach((p, i) => {
        console.log(`  [${i}] ID: ${p.id}, Name: ${p.name}, Cost: $${p.totalCost}`);
      });
      setPresets(data);
    } catch (error) {
      console.error('[LoadoutPresetSheet] Error loading presets:', error);
      Alert.alert('Error', 'Failed to load presets');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEquipmentPress = (equipmentName: string) => {
    const equipment = ALL_EQUIPMENT[equipmentName as keyof typeof ALL_EQUIPMENT];
    if (equipment) {
      setSelectedEquipment(equipment);
      setShowEquipmentDetail(true);
    }
  };

  const handleSavePreset = async () => {
    console.log('[LoadoutPresetSheet] Save button pressed');
    console.log('[LoadoutPresetSheet] Current form data:', formData);
    console.log('[LoadoutPresetSheet] Current loadout:', currentLoadout);
    console.log('[LoadoutPresetSheet] currentLoadout type:', typeof currentLoadout);
    console.log('[LoadoutPresetSheet] currentLoadout keys:', currentLoadout ? Object.keys(currentLoadout) : 'undefined');
    
    if (!formData.name.trim()) {
      console.warn('[LoadoutPresetSheet] Save failed: No preset name provided');
      Alert.alert('Validation', 'Please enter a preset name');
      return;
    }

    if (!currentLoadout) {
      console.warn('[LoadoutPresetSheet] Save failed: No current loadout available');
      console.warn('[LoadoutPresetSheet] currentLoadout is:', currentLoadout);
      Alert.alert('Error', 'No loadout available to save. Open from Equipment Optimizer or load a preset first.');
      return;
    }

    try {
      setIsLoading(true);
      console.log('[LoadoutPresetSheet] Attempting to save preset:', formData.name);
      
      // Ensure essential and recommended are arrays
      const essential = Array.isArray(currentLoadout.essential) ? currentLoadout.essential : [];
      const recommended = Array.isArray(currentLoadout.recommended) ? currentLoadout.recommended : [];
      
      console.log('[LoadoutPresetSheet] Essential items:', essential);
      console.log('[LoadoutPresetSheet] Recommended items:', recommended);
      
      const presetData = {
        ...currentLoadout,
        name: formData.name,
        description: formData.description,
        tags: formData.tags
          .split(',')
          .map(t => t.trim())
          .filter(t => t.length > 0),
        essential: essential,
        recommended: recommended,
      };
      
      console.log('[LoadoutPresetSheet] Full preset data to save:', JSON.stringify(presetData, null, 2));
      
      const preset = await loadoutService.savePreset(presetData);

      console.log('[LoadoutPresetSheet] Preset saved successfully:', preset.id);
      console.log('[LoadoutPresetSheet] Saved preset object:', JSON.stringify(preset, null, 2));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Reset form
      setFormData({ name: '', description: '', tags: '' });
      
      // Add the new preset directly to the state for immediate UI update
      console.log('[LoadoutPresetSheet] Adding preset to presets state');
      setPresets(prev => {
        console.log('[LoadoutPresetSheet] Presets before:', prev.map(p => p.id));
        const updated = [...prev, preset];
        console.log('[LoadoutPresetSheet] Presets after:', updated.map(p => p.id));
        return updated;
      });
      setSearchQuery(''); // Clear search to show new preset
      
      console.log('[LoadoutPresetSheet] Adding new preset to list and returning to list view');
      
      // Show alert then navigate back to list
      Alert.alert('Success', `Preset "${preset.name}" saved!`, [
        {
          text: 'OK',
          onPress: () => {
            console.log('[LoadoutPresetSheet] User dismissed alert, switching to list view');
            setView('list');
            console.log('[LoadoutPresetSheet] Returned to list view with new preset');
          },
        },
      ]);
    } catch (error) {
      console.error('[LoadoutPresetSheet] Error saving preset:', error);
      console.error('[LoadoutPresetSheet] Error details:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
      Alert.alert('Error', `Failed to save preset: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePreset = async () => {
    console.log('[LoadoutPresetSheet] Update button pressed');
    console.log('[LoadoutPresetSheet] Current form data:', formData);
    console.log('[LoadoutPresetSheet] Selected preset:', selectedPreset);
    
    if (!formData.name.trim()) {
      console.warn('[LoadoutPresetSheet] Update failed: No preset name provided');
      Alert.alert('Validation', 'Please enter a preset name');
      return;
    }

    if (!selectedPreset) {
      console.warn('[LoadoutPresetSheet] Update failed: No preset selected');
      Alert.alert('Error', 'No preset selected for editing');
      return;
    }

    try {
      setIsLoading(true);
      console.log('[LoadoutPresetSheet] Attempting to update preset:', selectedPreset.id);
      
      const updates = {
        name: formData.name,
        description: formData.description,
        tags: formData.tags
          .split(',')
          .map(t => t.trim())
          .filter(t => t.length > 0),
      };
      
      console.log('[LoadoutPresetSheet] Updates to apply:', JSON.stringify(updates, null, 2));
      
      const updatedPreset = await loadoutService.updatePreset(selectedPreset.id, updates);
      
      console.log('[LoadoutPresetSheet] Preset updated successfully:', updatedPreset.id);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Update the selected preset state
      setSelectedPreset(updatedPreset);
      
      // Update the presets list
      setPresets(prev => 
        prev.map(preset => 
          preset.id === updatedPreset.id ? updatedPreset : preset
        )
      );
      
      console.log('[LoadoutPresetSheet] Updated preset in list and returning to details view');
      
      // Show alert then navigate back to details
      Alert.alert('Success', `Preset "${updatedPreset.name}" updated!`, [
        {
          text: 'OK',
          onPress: () => {
            console.log('[LoadoutPresetSheet] User dismissed update alert, switching to details view');
            setView('details');
            console.log('[LoadoutPresetSheet] Returned to details view with updated preset');
          },
        },
      ]);
    } catch (error) {
      console.error('[LoadoutPresetSheet] Error updating preset:', error);
      console.error('[LoadoutPresetSheet] Error details:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
      Alert.alert('Error', `Failed to update preset: ${error instanceof Error ? error.message : 'Unknown error'}`);
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

  // Premium gate - show paywall if not premium
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
        <View style={[styles.container]}>
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

  // LIST VIEW - only shown when isPremium is true
  if (view === 'list') {
    return (
      <>
        <BottomSheet
          snapPoints={[600, 800]}
          enablePanDownToClose={true}
          onClose={onClose}
          index={isVisible ? 0 : -1}
          animateOnMount={true}
          style={{ borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: 'hidden' }}
          backgroundComponent={() => (
            <BlurView intensity={90} tint="dark" style={StyleSheet.absoluteFillObject} />
          )}
          handleIndicatorStyle={{ backgroundColor: colors.spectral }}
        >
          <BottomSheetScrollView
            style={[styles.container]}
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

            {/* Action Buttons Row - Create & Load Presets */}
            <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 16, marginBottom: 12 }}>
              {currentLoadout && (
                <TouchableOpacity
                  style={[styles.createButton, { backgroundColor: colors.spectral, flex: 1 }]}
                  onPress={() => {
                    setFormData({ name: '', description: '', tags: '' });
                    setView('create');
                  }}
                >
                  <Ionicons name="add-circle" size={20} color="white" />
                  <ThemedText style={styles.createButtonText}>Create New</ThemedText>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.createButton, { backgroundColor: colors.spectral + '66', flex: 1 }]}
                onPress={() => {
                  Alert.prompt(
                    'Load Preset',
                    'Paste the shareable preset code:\n\nAccepts both short codes (BAL-EMF-SPIR-...) and JSON export strings',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      {
                        text: 'Load',
                        onPress: async (code: string | undefined) => {
                          if (!code?.trim()) {
                            Alert.alert('Error', 'Please enter a valid preset code');
                            return;
                          }
                          try {
                            setIsLoading(true);
                            // Use smart import that detects format
                            const importedPreset = await loadoutService.importPreset(code.trim());
                            if (importedPreset) {
                              setPresets([...presets, importedPreset]);
                              Alert.alert('Success', `Preset "${importedPreset.name}" loaded successfully`);
                              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                            } else {
                              Alert.alert('Error', 'Invalid preset code. Please check the format and try again.');
                            }
                          } catch (error) {
                            Alert.alert('Error', 'Failed to load preset. Make sure the code is valid.');
                            console.error('[LoadoutPresetSheet] Error loading preset:', error);
                          } finally {
                            setIsLoading(false);
                          }
                        },
                      },
                    ],
                    'plain-text'
                  );
                }}
              >
                <Ionicons name="download" size={20} color="white" />
                <ThemedText style={styles.createButtonText}>Load Preset</ThemedText>
              </TouchableOpacity>
            </View>

            {/* Search */}
            <View style={[styles.searchContainer, { backgroundColor: colors.surfaceLight, marginHorizontal: 16, marginBottom: 12 }]}>
              <Ionicons name="search" size={20} color={colors.text + '99'} />
              <TextInput
                style={[styles.searchInput, { color: colors.text }]}
                placeholder="Search presets..."
                placeholderTextColor={colors.text + '66'}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

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
              <View style={{ gap: 8 }}>
                {filteredPresets.map((preset, index) => (
                  <View key={preset.id}>
                    <TouchableOpacity
                      style={[styles.presetItemCard, { backgroundColor: colors.spectral + '12', borderColor: colors.spectral + '20', borderWidth: 1, borderRadius: 12 }]}
                      onPress={() => {
                        setSelectedPreset(preset);
                        setView('details');
                      }}
                      onLongPress={() => {
                        Haptics.selectionAsync();
                        setExpandedPresetActions(expandedPresetActions === preset.id ? null : preset.id);
                        if (index === 0 && !hasSeenLongPressHint) {
                          setHasSeenLongPressHint(true);
                        }
                      }}
                      delayLongPress={200}
                      activeOpacity={0.7}
                    >
                      <View style={{ flex: 1 }}>
                        <ThemedText style={[styles.presetItemCardName, { color: colors.text }]}>
                          {preset.name}
                        </ThemedText>
                        <View style={styles.presetItemCardMeta}>
                          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                            <Ionicons name="person" size={12} color={colors.spectral} />
                            <ThemedText style={[styles.presetItemCardMetaText, { color: colors.text + '99' }]}>
                              {preset.playstyle.charAt(0).toUpperCase() + preset.playstyle.slice(1)}
                            </ThemedText>
                          </View>
                          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                            <Ionicons name="cash" size={12} color={colors.spectral} />
                            <ThemedText style={[styles.presetItemCardMetaText, { color: colors.text + '99' }]}>
                              ${preset.totalCost}
                            </ThemedText>
                          </View>
                          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                            <Ionicons name="layers" size={12} color={colors.spectral} />
                            <ThemedText style={[styles.presetItemCardMetaText, { color: colors.text + '99' }]}>
                              {preset.essential.length + preset.recommended.length} items
                            </ThemedText>
                          </View>
                        </View>
                        {preset.description && (
                          <ThemedText style={[styles.presetItemCardDesc, { color: colors.text + '66' }]} numberOfLines={1}>
                            {preset.description}
                          </ThemedText>
                        )}
                        {index === 0 && !hasSeenLongPressHint && (
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
                            <Ionicons name="hand-left" size={11} color={colors.spectral + '66'} />
                            <ThemedText style={{ fontSize: 11, color: colors.spectral + '66', fontStyle: 'italic' }}>
                              Hold for options
                            </ThemedText>
                          </View>
                        )}
                      </View>
                      <Ionicons name="chevron-forward" size={18} color={colors.spectral + '66'} />
                    </TouchableOpacity>

                    {/* Action Buttons */}
                    {expandedPresetActions === preset.id && (
                      <Animated.View entering={FadeInDown.springify()} exiting={FadeOutUp.springify()} style={{ flexDirection: 'row', gap: 8, marginTop: 8, borderTopWidth: 1, borderTopColor: colors.spectral + '20', paddingTop: 8 }}>
                        <TouchableOpacity
                          style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 8, borderRadius: 8, backgroundColor: colors.spectral + '20' }}
                          onPress={() => {
                            handleLoadPreset(preset);
                            setExpandedPresetActions(null);
                          }}
                        >
                          <Ionicons name="checkmark" size={16} color={colors.spectral} />
                          <ThemedText style={{ fontSize: 13, fontWeight: '600', color: colors.spectral }}>Load</ThemedText>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 8, borderRadius: 8, backgroundColor: colors.spectral + '20' }}
                          onPress={() => {
                            handleSharePreset(preset);
                            setExpandedPresetActions(null);
                          }}
                        >
                          <Ionicons name="share-social" size={16} color={colors.spectral} />
                          <ThemedText style={{ fontSize: 13, fontWeight: '600', color: colors.spectral }}>Share</ThemedText>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 8, borderRadius: 8, backgroundColor: colors.spectral + '20' }}
                          onPress={() => {
                            handleClonePreset(preset);
                            setExpandedPresetActions(null);
                          }}
                        >
                          <Ionicons name="copy" size={16} color={colors.spectral} />
                          <ThemedText style={{ fontSize: 13, fontWeight: '600', color: colors.spectral }}>Clone</ThemedText>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 8, borderRadius: 8, backgroundColor: '#FF4444' }}
                          onPress={() => {
                            handleDeletePreset(preset.id);
                            setExpandedPresetActions(null);
                          }}
                        >
                          <Ionicons name="trash" size={16} color="white" />
                          <ThemedText style={{ fontSize: 13, fontWeight: '600', color: 'white' }}>Delete</ThemedText>
                        </TouchableOpacity>
                      </Animated.View>
                    )}
                  </View>
                ))}
              </View>
            )}

            <View style={{ height: 20 }} />
          </BottomSheetScrollView>
        </BottomSheet>
        <EquipmentDetailSheet
          equipment={selectedEquipment}
          isVisible={showEquipmentDetail}
          onClose={() => setShowEquipmentDetail(false)}
        />
      </>
    );
  }

  // CREATE VIEW
  if (view === 'create') {
    return (
      <>
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
              <TextInput
                style={[styles.title, { color: colors.text }]}
                value={formData.name}
                onChangeText={name => setFormData({ ...formData, name })}
                placeholder="Preset Name"
                placeholderTextColor={colors.text + '66'}
                editable={!isLoading}
                maxLength={30}
              />
              <View style={{ width: 24 }} />
            </View>

            {/* Form Section */}
            <CollapsibleSection
              title="Preset Details"
              isExpanded={expandedFormSection}
              onPress={() => setExpandedFormSection(!expandedFormSection)}
              backgroundColor={colors.spectral + '08'}
              borderColor={colors.spectral + '20'}
              headerBackgroundColor={colors.spectral + '12'}
              titleColor={colors.spectral}
              iconColor={colors.spectral}
            >
              <View style={{ gap: 16 }}>
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
              </View>
            </CollapsibleSection>

            {/* Current Loadout Summary */}
            {currentLoadout && (
              <CollapsibleSection
                title="Loadout Summary"
                isExpanded={expandedSummarySection}
                onPress={() => setExpandedSummarySection(!expandedSummarySection)}
                backgroundColor={colors.paranormal + '08'}
                borderColor={colors.paranormal + '20'}
                headerBackgroundColor={colors.paranormal + '12'}
                titleColor={colors.paranormal}
                iconColor={colors.paranormal}
              >
                <View style={{ gap: 12 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8, backgroundColor: colors.paranormal + '12' }}>
                    <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                      <Ionicons name="person" size={16} color={colors.paranormal} />
                      <ThemedText style={{ fontSize: 12, color: colors.text + '99' }}>Playstyle</ThemedText>
                    </View>
                    <ThemedText style={{ fontSize: 14, fontWeight: '600' }}>{currentLoadout.playstyle}</ThemedText>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8, backgroundColor: colors.paranormal + '12' }}>
                    <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                      <Ionicons name="cash" size={16} color={colors.paranormal} />
                      <ThemedText style={{ fontSize: 12, color: colors.text + '99' }}>Total Cost</ThemedText>
                    </View>
                    <ThemedText style={{ fontSize: 14, fontWeight: '600' }}>${currentLoadout.totalCost}</ThemedText>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8, backgroundColor: colors.paranormal + '12' }}>
                    <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                      <Ionicons name="layers" size={16} color={colors.paranormal} />
                      <ThemedText style={{ fontSize: 12, color: colors.text + '99' }}>Equipment</ThemedText>
                    </View>
                    <ThemedText style={{ fontSize: 14, fontWeight: '600' }}>
                      {currentLoadout.essential.length + currentLoadout.recommended.length} items
                    </ThemedText>
                  </View>
                </View>
              </CollapsibleSection>
            )}

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

            <View style={{ height: 20 }} />
          </BottomSheetScrollView>
        </BottomSheet>
        <EquipmentDetailSheet
          equipment={selectedEquipment}
          isVisible={showEquipmentDetail}
          onClose={() => setShowEquipmentDetail(false)}
        />
      </>
    );
  }

  // EDIT VIEW
  if (view === 'edit' && selectedPreset) {
    return (
      <>
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
              <TouchableOpacity onPress={() => setView('details')}>
                <Ionicons name="chevron-back" size={24} color={colors.spectral} />
              </TouchableOpacity>
              <TextInput
                style={[styles.title, { color: colors.text }]}
                value={formData.name}
                onChangeText={name => setFormData({ ...formData, name })}
                placeholder="Preset Name"
                placeholderTextColor={colors.text + '66'}
                editable={!isLoading}
                maxLength={30}
              />
              <View style={{ width: 24 }} />
            </View>

            {/* Form Section */}
            <CollapsibleSection
              title="Edit Preset Details"
              isExpanded={expandedFormSection}
              onPress={() => setExpandedFormSection(!expandedFormSection)}
              backgroundColor={colors.spectral + '08'}
              borderColor={colors.spectral + '20'}
              headerBackgroundColor={colors.spectral + '12'}
              titleColor={colors.spectral}
              iconColor={colors.spectral}
            >
              <View style={{ gap: 16 }}>
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
              </View>
            </CollapsibleSection>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border }]}
                onPress={() => setView('details')}
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
                  console.log('[LoadoutPresetSheet] Update button pressed');
                  handleUpdatePreset();
                }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <ThemedText style={styles.buttonText}>Update Preset</ThemedText>
                )}
              </TouchableOpacity>
            </View>

            <View style={{ height: 20 }} />
          </BottomSheetScrollView>
        </BottomSheet>
        <EquipmentDetailSheet
          equipment={selectedEquipment}
          isVisible={showEquipmentDetail}
          onClose={() => setShowEquipmentDetail(false)}
        />
      </>
    );
  }

  // DETAILS VIEW
  if (view === 'details' && selectedPreset) {
    return (
      <>
        <BottomSheet
          snapPoints={[700, 900]}
          enablePanDownToClose={true}
          onClose={onClose}
          index={isVisible ? 0 : -1}
          animateOnMount={true}
          style={{ borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: 'hidden' }}
          backgroundComponent={() => (
            <BlurView intensity={90} tint="dark" style={StyleSheet.absoluteFillObject} />
          )}
          handleIndicatorStyle={{ backgroundColor: colors.spectral }}
        >
          <BottomSheetScrollView
            style={[styles.container]}
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
              <TouchableOpacity 
                onPress={() => {
                  setFormData({
                    name: selectedPreset.name,
                    description: selectedPreset.description || '',
                    tags: selectedPreset.tags.join(', '),
                  });
                  setView('edit');
                }}
              >
                <Ionicons name="create-outline" size={24} color={colors.spectral} />
              </TouchableOpacity>
            </View>

            {/* Description */}
            {selectedPreset.description && (
              <View style={[styles.descriptionBox, { backgroundColor: colors.spectral + '15', borderColor: colors.spectral + '30', borderWidth: 1 }]}>
                <Ionicons name="information-circle" size={16} color={colors.spectral} />
                <ThemedText style={[styles.descriptionText, { color: colors.text + '99' }]}>
                  {selectedPreset.description}
                </ThemedText>
              </View>
            )}

            {/* Stats Grid */}
            <View style={styles.statsGrid}>
              <StatCard
                label="Playstyle"
                value={selectedPreset.playstyle.charAt(0).toUpperCase() + selectedPreset.playstyle.slice(1)}
                icon="person"
                colors={colors}
              />
              <StatCard
                label="Difficulty"
                value={selectedPreset.difficulty}
                icon="shield"
                colors={colors}
              />
              <StatCard
                label="Total Cost"
                value={`$${selectedPreset.totalCost}`}
                icon="cash"
                colors={colors}
              />
              <StatCard
                label="Efficiency"
                value={`${selectedPreset.efficiency}%`}
                icon="trending-up"
                colors={colors}
              />
            </View>

            {/* Equipment Collapsible */}
            <CollapsibleSection
              title={`Equipment (${selectedPreset.essential.length + selectedPreset.recommended.length})`}
              isExpanded={expandedEquipment}
              onPress={() => setExpandedEquipment(!expandedEquipment)}
              backgroundColor={colors.spectral + '08'}
              borderColor={colors.spectral + '20'}
              headerBackgroundColor={colors.spectral + '12'}
              titleColor={colors.spectral}
              iconColor={colors.spectral}
            >
              <View style={{ gap: 8 }}>
                {selectedPreset.essential.length > 0 && (
                  <>
                    <ThemedText style={[styles.equipmentSectionLabel, { color: colors.spectral }]}>
                      Essential
                    </ThemedText>
                    <View style={{ gap: 6 }}>
                      {selectedPreset.essential.map((eq, i) => (
                        <TouchableOpacity
                          key={`essential-${i}`}
                          style={[styles.equipmentItemNew, { backgroundColor: colors.spectral + '12', borderLeftColor: colors.spectral, borderLeftWidth: 3, paddingLeft: 12 }]}
                          onPress={() => handleEquipmentPress(eq)}
                          activeOpacity={0.7}
                        >
                          <Ionicons name="checkmark-circle" size={16} color={colors.spectral} />
                          <ThemedText style={styles.equipmentItemText} numberOfLines={1}>{formatEquipmentName(eq)}</ThemedText>
                          <Ionicons name="chevron-forward" size={16} color={colors.spectral + '66'} />
                        </TouchableOpacity>
                      ))}
                    </View>
                  </>
                )}

                {selectedPreset.recommended.length > 0 && (
                  <>
                    <ThemedText style={[styles.equipmentSectionLabel, { color: colors.text + '99', marginTop: selectedPreset.essential.length > 0 ? 12 : 0 }]}>
                      Recommended
                    </ThemedText>
                    <View style={{ gap: 6 }}>
                      {selectedPreset.recommended.map((eq, i) => (
                        <TouchableOpacity
                          key={`recommended-${i}`}
                          style={[styles.equipmentItemNew, { backgroundColor: colors.text + '08', borderLeftColor: colors.text + '33', borderLeftWidth: 3, paddingLeft: 12 }]}
                          onPress={() => handleEquipmentPress(eq)}
                          activeOpacity={0.7}
                        >
                          <Ionicons name="radio-button-on" size={16} color={colors.text + '66'} />
                          <ThemedText style={styles.equipmentItemText} numberOfLines={1}>{formatEquipmentName(eq)}</ThemedText>
                          <Ionicons name="chevron-forward" size={16} color={colors.text + '33'} />
                        </TouchableOpacity>
                      ))}
                    </View>
                  </>
                )}
              </View>
            </CollapsibleSection>

            {/* Tags Collapsible */}
            {selectedPreset.tags.length > 0 && (
              <CollapsibleSection
                title={`Tags (${selectedPreset.tags.length})`}
                isExpanded={expandedTags}
                onPress={() => setExpandedTags(!expandedTags)}
                backgroundColor={colors.paranormal + '08'}
                borderColor={colors.paranormal + '20'}
                headerBackgroundColor={colors.paranormal + '12'}
                titleColor={colors.paranormal}
                iconColor={colors.paranormal}
              >
                <View style={styles.tagsListNew}>
                  {selectedPreset.tags.map((tag, i) => (
                    <View key={i} style={[styles.tagNew, { backgroundColor: colors.paranormal + '20', borderColor: colors.paranormal + '40', borderWidth: 1 }]}>
                      <ThemedText style={[styles.tagTextNew, { color: colors.paranormal }]}>
                        {tag}
                      </ThemedText>
                    </View>
                  ))}
                </View>
              </CollapsibleSection>
            )}

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.spectral, flex: 1 }]}
                onPress={() => {
                  handleLoadPreset(selectedPreset);
                }}
              >
                <Ionicons name="checkmark" size={18} color="white" />
                <ThemedText style={[styles.buttonText, { color: 'white' }]}>Load</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.spectral + '66', flex: 1 }]}
                onPress={() => {
                  handleSharePreset(selectedPreset);
                }}
              >
                <Ionicons name="share-social" size={18} color="white" />
                <ThemedText style={[styles.buttonText, { color: 'white' }]}>Share</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.paranormal, flex: 1 }]}
                onPress={() => {
                  handleClonePreset(selectedPreset);
                }}
              >
                <Ionicons name="copy" size={18} color="white" />
                <ThemedText style={[styles.buttonText, { color: 'white' }]}>Clone</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#FF4444', flex: 1 }]}
                onPress={() => {
                  handleDeletePreset(selectedPreset.id);
                }}
              >
                <Ionicons name="trash" size={18} color="white" />
                <ThemedText style={[styles.buttonText, { color: 'white' }]}>Delete</ThemedText>
              </TouchableOpacity>
            </View>

            <View style={{ height: 20 }} />
          </BottomSheetScrollView>
        </BottomSheet>
        <EquipmentDetailSheet
          equipment={selectedEquipment}
          isVisible={showEquipmentDetail}
          onClose={() => setShowEquipmentDetail(false)}
        />
      </>
    );
  }

  return (
    <>
      <EquipmentDetailSheet
        equipment={selectedEquipment}
        isVisible={showEquipmentDetail}
        onClose={() => setShowEquipmentDetail(false)}
      />
    </>
  );
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
      delayLongPress={200}
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

// Helper function to convert kebab-case to readable format
const formatEquipmentName = (name: string): string => {
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Helper component for stat cards
const StatCard = ({ label, value, icon, colors }: any) => (
  <View style={{ flex: 1, minWidth: '48%', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 8, borderRadius: 12, backgroundColor: colors.spectral + '08', borderWidth: 1, borderColor: colors.spectral + '20', gap: 6 }}>
    <Ionicons name={icon} size={20} color={colors.spectral} />
    <ThemedText style={{ fontSize: 12, color: colors.text + '99' }}>{label}</ThemedText>
    <ThemedText style={{ fontSize: 14, fontWeight: '600' }}>{value}</ThemedText>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
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
  descriptionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 10,
    marginBottom: 16,
  },
  descriptionText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  equipmentSectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  equipmentItemNew: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  equipmentItemText: {
    fontSize: 14,
    flex: 1,
  },
  tagsListNew: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagNew: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  tagTextNew: {
    fontSize: 12,
    fontWeight: '600',
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
  // Preset Item Card (new collapsible style)
  presetItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 12,
  },
  presetItemCardName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
  },
  presetItemCardMeta: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 6,
  },
  presetItemCardMetaText: {
    fontSize: 12,
  },
  presetItemCardDesc: {
    fontSize: 12,
    marginTop: 4,
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
