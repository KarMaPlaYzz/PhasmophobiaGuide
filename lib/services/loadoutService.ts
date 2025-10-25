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
      const fullPreset: LoadoutRecommendation = {
        ...preset,
        id: generateId(),
        savedAt: Date.now(),
      };

      // Get existing presets
      const existing = await this.getPresets();

      // Add new preset to beginning (most recent first)
      const updated = [fullPreset, ...existing].slice(0, MAX_PRESETS);

      // Save to AsyncStorage
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      console.log('[LoadoutService] Preset saved:', fullPreset.name);
      return fullPreset;
    } catch (error) {
      console.error('[LoadoutService] Error saving preset:', error);
      throw error;
    }
  },

  /**
   * Get all saved presets
   */
  async getPresets(): Promise<LoadoutRecommendation[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('[LoadoutService] Error getting presets:', error);
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
