/**
 * AsyncStorage Utility
 * Handles all persistent data storage for the app
 * 
 * This uses @react-native-async-storage/async-storage
 * Installation: npx expo install @react-native-async-storage/async-storage
 */

import { EvidenceSelection, UserProgress } from '@/lib/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const STORAGE_KEYS = {
  USER_PROGRESS: '@phasmophobia_guide/user_progress',
  EVIDENCE_SELECTION: '@phasmophobia_guide/evidence_selection',
  FAVORITES: '@phasmophobia_guide/favorites',
  LAST_UPDATE: '@phasmophobia_guide/last_update',
} as const;

// ============================================================================
// USER PROGRESS
// ============================================================================

export const storageService = {
  /**
   * Initialize AsyncStorage - call this once when app starts
   */
  async initialize(): Promise<void> {
    try {
      // Create default user progress if it doesn't exist
      const existing = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
      if (!existing) {
        const defaultProgress: UserProgress = {
          favoriteGhosts: [],
          favoriteEquipment: [],
          favoriteMaps: [],
          lastVisitedSection: 'home',
          lastUpdated: Date.now(),
        };
        await AsyncStorage.setItem(
          STORAGE_KEYS.USER_PROGRESS,
          JSON.stringify(defaultProgress)
        );
      }
    } catch (error) {
      console.error('Error initializing storage:', error);
    }
  },

  /**
   * Get all user progress data
   */
  async getUserProgress(): Promise<UserProgress | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error retrieving user progress:', error);
      return null;
    }
  },

  /**
   * Update user progress
   */
  async updateUserProgress(progress: Partial<UserProgress>): Promise<void> {
    try {
      const existing = await this.getUserProgress();
      const updated = {
        ...existing,
        ...progress,
        lastUpdated: Date.now(),
      };
      await AsyncStorage.setItem(
        STORAGE_KEYS.USER_PROGRESS,
        JSON.stringify(updated)
      );
    } catch (error) {
      console.error('Error updating user progress:', error);
    }
  },

  /**
   * Add favorite ghost
   */
  async addFavoriteGhost(ghostId: string): Promise<void> {
    try {
      const progress = await this.getUserProgress();
      if (progress && !progress.favoriteGhosts.includes(ghostId)) {
        progress.favoriteGhosts.push(ghostId);
        await this.updateUserProgress(progress);
      }
    } catch (error) {
      console.error('Error adding favorite ghost:', error);
    }
  },

  /**
   * Remove favorite ghost
   */
  async removeFavoriteGhost(ghostId: string): Promise<void> {
    try {
      const progress = await this.getUserProgress();
      if (progress) {
        progress.favoriteGhosts = progress.favoriteGhosts.filter(
          (id) => id !== ghostId
        );
        await this.updateUserProgress(progress);
      }
    } catch (error) {
      console.error('Error removing favorite ghost:', error);
    }
  },

  /**
   * Check if ghost is favorite
   */
  async isFavoriteGhost(ghostId: string): Promise<boolean> {
    try {
      const progress = await this.getUserProgress();
      return progress?.favoriteGhosts.includes(ghostId) ?? false;
    } catch (error) {
      console.error('Error checking favorite ghost:', error);
      return false;
    }
  },

  /**
   * Get all favorite ghosts
   */
  async getFavoriteGhosts(): Promise<string[]> {
    try {
      const progress = await this.getUserProgress();
      return progress?.favoriteGhosts ?? [];
    } catch (error) {
      console.error('Error getting favorite ghosts:', error);
      return [];
    }
  },

  // ============================================================================
  // EQUIPMENT FAVORITES
  // ============================================================================

  /**
   * Add favorite equipment
   */
  async addFavoriteEquipment(equipmentId: string): Promise<void> {
    try {
      const progress = await this.getUserProgress();
      if (progress && !progress.favoriteEquipment.includes(equipmentId)) {
        progress.favoriteEquipment.push(equipmentId);
        await this.updateUserProgress(progress);
      }
    } catch (error) {
      console.error('Error adding favorite equipment:', error);
    }
  },

  /**
   * Remove favorite equipment
   */
  async removeFavoriteEquipment(equipmentId: string): Promise<void> {
    try {
      const progress = await this.getUserProgress();
      if (progress) {
        progress.favoriteEquipment = progress.favoriteEquipment.filter(
          (id) => id !== equipmentId
        );
        await this.updateUserProgress(progress);
      }
    } catch (error) {
      console.error('Error removing favorite equipment:', error);
    }
  },

  /**
   * Get all favorite equipment
   */
  async getFavoriteEquipment(): Promise<string[]> {
    try {
      const progress = await this.getUserProgress();
      return progress?.favoriteEquipment ?? [];
    } catch (error) {
      console.error('Error getting favorite equipment:', error);
      return [];
    }
  },

  // ============================================================================
  // MAP FAVORITES
  // ============================================================================

  /**
   * Add favorite map
   */
  async addFavoriteMap(mapId: string): Promise<void> {
    try {
      const progress = await this.getUserProgress();
      if (progress && !progress.favoriteMaps.includes(mapId)) {
        progress.favoriteMaps.push(mapId);
        await this.updateUserProgress(progress);
      }
    } catch (error) {
      console.error('Error adding favorite map:', error);
    }
  },

  /**
   * Remove favorite map
   */
  async removeFavoriteMap(mapId: string): Promise<void> {
    try {
      const progress = await this.getUserProgress();
      if (progress) {
        progress.favoriteMaps = progress.favoriteMaps.filter(
          (id) => id !== mapId
        );
        await this.updateUserProgress(progress);
      }
    } catch (error) {
      console.error('Error removing favorite map:', error);
    }
  },

  /**
   * Get all favorite maps
   */
  async getFavoriteMaps(): Promise<string[]> {
    try {
      const progress = await this.getUserProgress();
      return progress?.favoriteMaps ?? [];
    } catch (error) {
      console.error('Error getting favorite maps:', error);
      return [];
    }
  },

  // ============================================================================
  // EVIDENCE TRACKING
  // ============================================================================

  /**
   * Save evidence selection for identification tool
   */
  async saveEvidenceSelection(selection: EvidenceSelection): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.EVIDENCE_SELECTION,
        JSON.stringify(selection)
      );
    } catch (error) {
      console.error('Error saving evidence selection:', error);
    }
  },

  /**
   * Get saved evidence selection
   */
  async getEvidenceSelection(): Promise<EvidenceSelection | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.EVIDENCE_SELECTION);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error retrieving evidence selection:', error);
      return null;
    }
  },

  /**
   * Clear evidence selection
   */
  async clearEvidenceSelection(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.EVIDENCE_SELECTION);
    } catch (error) {
      console.error('Error clearing evidence selection:', error);
    }
  },

  // ============================================================================
  // NAVIGATION
  // ============================================================================

  /**
   * Save last visited section
   */
  async setLastVisitedSection(section: string): Promise<void> {
    try {
      const progress = await this.getUserProgress();
      if (progress) {
        progress.lastVisitedSection = section;
        await this.updateUserProgress(progress);
      }
    } catch (error) {
      console.error('Error setting last visited section:', error);
    }
  },

  /**
   * Get last visited section
   */
  async getLastVisitedSection(): Promise<string> {
    try {
      const progress = await this.getUserProgress();
      return progress?.lastVisitedSection ?? 'home';
    } catch (error) {
      console.error('Error getting last visited section:', error);
      return 'home';
    }
  },

  // ============================================================================
  // UTILITIES
  // ============================================================================

  /**
   * Clear all data (for debugging or reset)
   */
  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
      await this.initialize();
    } catch (error) {
      console.error('Error clearing all data:', error);
    }
  },

  /**
   * Get total storage usage
   */
  async getStorageInfo(): Promise<{ used: number; total: number } | null> {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const allData = await AsyncStorage.multiGet(allKeys);
      const used = JSON.stringify(allData).length;
      return { used, total: 5242880 }; // 5MB typical limit
    } catch (error) {
      console.error('Error getting storage info:', error);
      return null;
    }
  },
};

export default storageService;
