/**
 * Loadout Service
 * Manages saving, loading, sharing, and managing equipment presets
 * All data persisted locally using AsyncStorage
 */

import { LoadoutRecommendation } from '@/lib/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@phasmophobia_guide/loadout_presets';
const MAX_PRESETS = 20;

/**
 * Generate a unique ID for a preset
 */
function generateId(): string {
  return `loadout_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Loadout Service - Core methods for managing equipment presets
 */
export const loadoutService = {
  /**
   * Save a new loadout preset
   * Takes a LoadoutRecommendation and saves it to storage
   */
  async savePreset(
    preset: Omit<LoadoutRecommendation, 'id' | 'savedAt'>
  ): Promise<LoadoutRecommendation> {
    try {
      console.log('[LoadoutService.savePreset] Input preset:', JSON.stringify(preset, null, 2));
      
      const fullPreset: LoadoutRecommendation = {
        ...preset,
        id: generateId(),
        savedAt: Date.now(),
      };

      console.log('[LoadoutService.savePreset] Full preset with ID:', JSON.stringify(fullPreset, null, 2));

      // Get existing presets
      const existing = await this.getPresets();
      console.log('[LoadoutService.savePreset] Existing presets count:', existing.length);

      // Add new preset to beginning (most recent first)
      const updated = [fullPreset, ...existing].slice(0, MAX_PRESETS);
      console.log('[LoadoutService.savePreset] Updated presets count:', updated.length);

      // Save to AsyncStorage
      const jsonString = JSON.stringify(updated);
      console.log('[LoadoutService.savePreset] Saving to AsyncStorage, size:', jsonString.length, 'bytes');
      
      await AsyncStorage.setItem(STORAGE_KEY, jsonString);

      console.log('[LoadoutService.savePreset] Preset saved successfully:', fullPreset.name, 'with ID:', fullPreset.id);
      
      // Verify it was saved
      const verify = await AsyncStorage.getItem(STORAGE_KEY);
      if (verify) {
        const verifyParsed = JSON.parse(verify);
        console.log('[LoadoutService.savePreset] Verification - presets in storage:', verifyParsed.length);
        console.log('[LoadoutService.savePreset] First preset ID in storage:', verifyParsed[0]?.id);
      }
      
      return fullPreset;
    } catch (error) {
      console.error('[LoadoutService] Error saving preset:', error);
      console.error('[LoadoutService] Error type:', error instanceof Error ? error.message : typeof error);
      throw error;
    }
  },

  /**
   * Get all saved presets
   */
  async getPresets(): Promise<LoadoutRecommendation[]> {
    try {
      console.log('[LoadoutService.getPresets] Fetching from storage key:', STORAGE_KEY);
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      console.log('[LoadoutService.getPresets] Raw data from storage:', data ? `${data.length} bytes` : 'null');
      
      if (data) {
        const parsed = JSON.parse(data);
        console.log('[LoadoutService.getPresets] Parsed presets:', parsed.length);
        return parsed;
      }
      console.log('[LoadoutService.getPresets] No data in storage, returning empty array');
      return [];
    } catch (error) {
      console.error('[LoadoutService.getPresets] Error getting presets:', error);
      return [];
    }
  },

  /**
   * Get a specific preset by ID
   */
  async getPreset(id: string): Promise<LoadoutRecommendation | null> {
    try {
      const presets = await this.getPresets();
      return presets.find(p => p.id === id) || null;
    } catch (error) {
      console.error('[LoadoutService] Error getting preset:', error);
      return null;
    }
  },

  /**
   * Delete a preset
   */
  async deletePreset(id: string): Promise<void> {
    try {
      const presets = await this.getPresets();
      const updated = presets.filter(p => p.id !== id);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      console.log('[LoadoutService] Preset deleted:', id);
    } catch (error) {
      console.error('[LoadoutService] Error deleting preset:', error);
      throw error;
    }
  },

  /**
   * Update an existing preset
   */
  async updatePreset(id: string, updates: Partial<LoadoutRecommendation>): Promise<LoadoutRecommendation> {
    try {
      const presets = await this.getPresets();
      const index = presets.findIndex(p => p.id === id);

      if (index === -1) {
        throw new Error('Preset not found');
      }

      const updated = {
        ...presets[index],
        ...updates,
        id: presets[index].id,
        savedAt: presets[index].savedAt,
      };

      presets[index] = updated;
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(presets));

      console.log('[LoadoutService] Preset updated:', id);
      return updated;
    } catch (error) {
      console.error('[LoadoutService] Error updating preset:', error);
      throw error;
    }
  },

  /**
   * Clone a preset with a new name
   */
  async clonePreset(id: string, newName: string): Promise<LoadoutRecommendation> {
    try {
      const original = await this.getPreset(id);
      if (!original) {
        throw new Error('Preset not found');
      }

      const cloned: LoadoutRecommendation = {
        ...original,
        id: generateId(),
        name: newName,
        savedAt: Date.now(),
      };

      const presets = await this.getPresets();
      const updated = [cloned, ...presets].slice(0, MAX_PRESETS);

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      console.log('[LoadoutService] Preset cloned:', newName);
      return cloned;
    } catch (error) {
      console.error('[LoadoutService] Error cloning preset:', error);
      throw error;
    }
  },

  /**
   * Generate a shareable preset code
   * Format: PLAYSTYLE-EQ1-EQ2-EQ3-... (max 8 equipment items)
   * Example: BALANCED-EMF-THERM-CRUCI-SMUDGE
   */
  generatePresetCode(preset: LoadoutRecommendation): string {
    try {
      // Use playstyle or difficulty as prefix
      const prefix = preset.playstyle.substring(0, 3).toUpperCase();

      // Get top 8 equipment (essential + recommended)
      const equipment = [...preset.essential, ...preset.recommended].slice(0, 8);

      // Convert equipment IDs to short codes (first 4 chars, uppercase)
      const equipmentCodes = equipment
        .map(id => id.substring(0, 4).toUpperCase())
        .join('-');

      const code = `${prefix}-${equipmentCodes}`;
      return code;
    } catch (error) {
      console.error('[LoadoutService] Error generating preset code:', error);
      return 'INVALID-CODE';
    }
  },

  /**
   * Decode a short preset code
   * Format: PLAYSTYLE-EQ1-EQ2-EQ3-... (max 8 equipment items)
   * Example: BAL-EMF--SPIR--GHOS--UV-L-VIDE-DOTS-CRUC-SANI
   */
  async decodePresetCode(code: string): Promise<LoadoutRecommendation | null> {
    try {
      console.log('[LoadoutService] Decoding preset code:', code);
      
      const parts = code.split('-').filter(p => p.length > 0);
      if (parts.length < 1) {
        console.warn('[LoadoutService] Invalid code format: too short');
        return null;
      }

      // First part is playstyle prefix (3 letters)
      const playstylePrefix = parts[0].toLowerCase();
      const playstyleMap: { [key: string]: string } = {
        'agg': 'aggressive',
        'bal': 'balanced',
        'def': 'defensive',
        'exp': 'explorer',
        'sol': 'solo',
        'cau': 'cautious',
      };
      
      const playstyle = playstyleMap[playstylePrefix] || 'balanced';
      console.log('[LoadoutService] Decoded playstyle:', playstyle);

      // Rest are equipment codes - match by checking against known equipment IDs
      const equipmentMap: { [key: string]: string } = {
        'emf-': 'emf-reader',
        'ther': 'thermometer',
        'spir': 'spirit-box',
        'ghos': 'ghost-writing-book',
        'uv-l': 'uv-light',
        'vide': 'video-camera',
        'dots': 'dots-projector',
        'cruc': 'crucifix',
        'crus': 'crucifix',
        'sani': 'sanity-pills',
        'salt': 'salt',
        'smud': 'smudge-sticks',
        'incn': 'incense',
        'foto': 'photo-camera',
        'phot': 'photo-camera',
        'trip': 'tripod',
        'anem': 'anemometer',
        'taur': 'taurus',
        'head': 'headphones',
        'flsh': 'flashlight',
        'paus': 'pause-button',
        'drog': 'drog-detector',
        'infr': 'infrared-head-mounted-display',
        'laur': 'laurel-wreath',
        'mire': 'mire-amethyst-gem',
        'obsi': 'obsidian-knife',
        'pent': 'pentagram-book',
        'ring': 'rune-ring',
        'tabu': 'tabu-mask',
        'turn': 'turns-statuette',
      };

      const equipment: string[] = [];
      for (let i = 1; i < parts.length; i++) {
        const part = parts[i].toLowerCase();
        if (part.length >= 3) {
          // Try to find matching equipment
          const match = equipmentMap[part.substring(0, 4)] || equipmentMap[part.substring(0, 3)];
          if (match) {
            equipment.push(match);
            console.log('[LoadoutService] Decoded equipment:', part, '->', match);
          } else {
            console.warn('[LoadoutService] Unknown equipment code:', part);
          }
        }
      }

      // Create a basic loadout from decoded data
      // Calculate totalCost from equipment
      const allEquipment = [...equipment.slice(0, 4), ...equipment.slice(4, 8)];
      const equipmentCosts: Record<string, number> = {
        'emf-reader': 45, 'spirit-box': 50, 'ghost-writing-book': 40, 'uv-light': 35,
        'video-camera': 50, 'dots-projector': 65, 'thermometer': 30, 'parabolic-microphone': 45,
        'sound-recorder': 50, 'motion-sensor': 40, 'temperature-sensor': 35, 'head-mounted-camera': 60,
        'crucifix': 30, 'sanity-medication': 20, 'smudge-sticks': 35, 'incense': 30,
        'salt': 15, 'prayer-candle': 25, 'photo-camera': 40, 'tripod': 25,
      };
      const totalCost = allEquipment.reduce((sum, item) => sum + (equipmentCosts[item] || 0), 0);
      
      // Calculate basic efficiency (0-100)
      let efficiency = 60; // Base score
      efficiency += Math.min(20, allEquipment.length * 5); // Equipment count bonus
      efficiency = Math.min(100, efficiency);

      const preset: Omit<LoadoutRecommendation, 'id' | 'savedAt'> = {
        name: `Imported ${playstyle.charAt(0).toUpperCase() + playstyle.slice(1)} Loadout`,
        description: 'Imported from shareable code',
        playstyle: playstyle as any,
        difficulty: 'Intermediate',
        ghostType: 'all',
        essential: equipment.slice(0, 4),
        recommended: equipment.slice(4, 8),
        optional: [],
        totalCost,
        maxBudget: 1000,
        efficiency,
        explanation: ['Imported from shared code'],
        gaps: [],
        ghostMatchup: [],
        tags: [playstyle, 'imported'],
      };

      console.log('[LoadoutService] Decoded preset:', JSON.stringify(preset, null, 2));
      return await this.savePreset(preset);
    } catch (error) {
      console.error('[LoadoutService] Error decoding preset code:', error);
      return null;
    }
  },

  /**
   * Smart import - detects format and imports accordingly
   * Supports both short codes (BAL-EMF-...) and JSON strings
   */
  async importPreset(input: string): Promise<LoadoutRecommendation | null> {
    try {
      const trimmed = input.trim();
      console.log('[LoadoutService] Smart import attempting on:', trimmed.substring(0, 50));

      // Try to detect format
      if (trimmed.startsWith('{')) {
        // Looks like JSON
        console.log('[LoadoutService] Detected JSON format');
        return await this.importPresetJSON(trimmed);
      } else if (trimmed.includes('-') && /^[A-Z]{3}-/.test(trimmed)) {
        // Looks like short code format: XXX-YYYY-...
        console.log('[LoadoutService] Detected short code format');
        return await this.decodePresetCode(trimmed);
      } else {
        // Try JSON parsing anyway
        console.log('[LoadoutService] Trying JSON parse as fallback');
        return await this.importPresetJSON(trimmed);
      }
    } catch (error) {
      console.error('[LoadoutService] Error in smart import:', error);
      return null;
    }
  },

  /**
   * Export preset as JSON string (for sharing/backup)
   */
  exportPresetJSON(preset: LoadoutRecommendation): string {
    try {
      return JSON.stringify(
        {
          name: preset.name,
          description: preset.description,
          playstyle: preset.playstyle,
          difficulty: preset.difficulty,
          ghostType: preset.ghostType,
          essential: preset.essential,
          recommended: preset.recommended,
          optional: preset.optional,
          totalCost: preset.totalCost,
          tags: preset.tags,
        },
        null,
        2
      );
    } catch (error) {
      console.error('[LoadoutService] Error exporting preset:', error);
      return '{}';
    }
  },

  /**
   * Import preset from JSON string (for loading shared presets)
   */
  async importPresetJSON(jsonString: string): Promise<LoadoutRecommendation | null> {
    try {
      console.log('[LoadoutService] Parsing JSON preset...');
      const data = JSON.parse(jsonString);
      
      // Equipment costs lookup
      const equipmentCosts: Record<string, number> = {
        'emf-reader': 45, 'spirit-box': 50, 'ghost-writing-book': 40, 'uv-light': 35,
        'video-camera': 50, 'dots-projector': 65, 'thermometer': 30, 'parabolic-microphone': 45,
        'sound-recorder': 50, 'motion-sensor': 40, 'temperature-sensor': 35, 'head-mounted-camera': 60,
        'crucifix': 30, 'sanity-medication': 20, 'smudge-sticks': 35, 'incense': 30,
        'salt': 15, 'prayer-candle': 25, 'photo-camera': 40, 'tripod': 25,
      };
      
      // Get equipment arrays
      const essential = data.essential || [];
      const recommended = data.recommended || [];
      const allEquipment = [...essential, ...recommended];
      
      // Calculate totalCost from equipment if not provided or is 0
      let totalCost = data.totalCost || 0;
      if (totalCost === 0 && allEquipment.length > 0) {
        totalCost = allEquipment.reduce((sum: number, item: string) => sum + (equipmentCosts[item] || 0), 0);
      }
      
      // Calculate efficiency if not provided or is 0
      let efficiency = data.efficiency || 0;
      if (efficiency === 0 && allEquipment.length > 0) {
        efficiency = 60 + Math.min(20, allEquipment.length * 5);
        efficiency = Math.min(100, efficiency);
      }
      
      const preset: Omit<LoadoutRecommendation, 'id' | 'savedAt'> = {
        name: data.name || 'Imported Preset',
        description: data.description || '',
        playstyle: data.playstyle || 'balanced',
        difficulty: data.difficulty || 'Intermediate',
        ghostType: data.ghostType || 'all',
        essential,
        recommended,
        optional: data.optional || [],
        totalCost,
        maxBudget: data.maxBudget || 1000,
        efficiency,
        explanation: data.explanation || [],
        gaps: data.gaps || [],
        ghostMatchup: data.ghostMatchup || [],
        tags: data.tags || [],
      };
      console.log('[LoadoutService] JSON preset parsed successfully');
      return await this.savePreset(preset);
    } catch (error) {
      console.error('[LoadoutService] Error importing JSON preset:', error);
      return null;
    }
  },

  /**
   * Get presets filtered by ghost type
   */
  async getPresetsByGhost(ghostId: string): Promise<LoadoutRecommendation[]> {
    try {
      const presets = await this.getPresets();
      return presets.filter(p => p.ghostType === ghostId);
    } catch (error) {
      console.error('[LoadoutService] Error getting presets by ghost:', error);
      return [];
    }
  },

  /**
   * Get presets filtered by playstyle
   */
  async getPresetsByPlaystyle(playstyle: string): Promise<LoadoutRecommendation[]> {
    try {
      const presets = await this.getPresets();
      return presets.filter(p => p.playstyle === playstyle);
    } catch (error) {
      console.error('[LoadoutService] Error getting presets by playstyle:', error);
      return [];
    }
  },

  /**
   * Get presets filtered by tag
   */
  async getPresetsByTag(tag: string): Promise<LoadoutRecommendation[]> {
    try {
      const presets = await this.getPresets();
      return presets.filter(p => p.tags.includes(tag));
    } catch (error) {
      console.error('[LoadoutService] Error getting presets by tag:', error);
      return [];
    }
  },

  /**
   * Search presets by name or description
   */
  async searchPresets(query: string): Promise<LoadoutRecommendation[]> {
    try {
      const presets = await this.getPresets();
      const lowerQuery = query.toLowerCase();
      return presets.filter(
        p =>
          p.name.toLowerCase().includes(lowerQuery) ||
          p.description.toLowerCase().includes(lowerQuery)
      );
    } catch (error) {
      console.error('[LoadoutService] Error searching presets:', error);
      return [];
    }
  },

  /**
   * Clear all presets (for debugging/reset)
   */
  async clearAllPresets(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      console.log('[LoadoutService] All presets cleared');
    } catch (error) {
      console.error('[LoadoutService] Error clearing presets:', error);
      throw error;
    }
  },

  /**
   * Get total storage used by presets
   */
  async getStorageInfo(): Promise<{ used: number; limit: number; percentage: number }> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      const used = data ? new TextEncoder().encode(data).length : 0;
      const limit = 1048576; // 1MB limit for this key
      return {
        used,
        limit,
        percentage: (used / limit) * 100,
      };
    } catch (error) {
      console.error('[LoadoutService] Error getting storage info:', error);
      return { used: 0, limit: 1048576, percentage: 0 };
    }
  },
};

export default loadoutService;
