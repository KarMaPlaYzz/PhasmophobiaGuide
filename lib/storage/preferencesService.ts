/**
 * Preferences Service
 * Handles user preferences and settings
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserPreferences {
  blogNotificationsEnabled: boolean;
  hapticFeedbackEnabled: boolean;
  defaultTab: 'ghosts' | 'equipments' | 'index' | 'evidence' | 'sanity-calculator';
  lastUpdated: number;
}

const STORAGE_KEY = '@phasmophobia_guide/user_preferences';

const DEFAULT_PREFERENCES: UserPreferences = {
  blogNotificationsEnabled: true,
  hapticFeedbackEnabled: true,
  defaultTab: 'index',
  lastUpdated: Date.now(),
};

export const PreferencesService = {
  /**
   * Initialize preferences - call once at app start
   */
  async initialize(): Promise<void> {
    try {
      const existing = await AsyncStorage.getItem(STORAGE_KEY);
      if (!existing) {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PREFERENCES));
      }
    } catch (error) {
      console.error('Error initializing preferences:', error);
    }
  },

  /**
   * Get all user preferences
   */
  async getPreferences(): Promise<UserPreferences> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
      return DEFAULT_PREFERENCES;
    } catch (error) {
      console.error('Error retrieving preferences:', error);
      return DEFAULT_PREFERENCES;
    }
  },

  /**
   * Update preferences
   */
  async updatePreferences(preferences: Partial<UserPreferences>): Promise<void> {
    try {
      const existing = await this.getPreferences();
      const updated = {
        ...existing,
        ...preferences,
        lastUpdated: Date.now(),
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  },

  /**
   * Get blog notifications setting
   */
  async isBlogNotificationsEnabled(): Promise<boolean> {
    try {
      const prefs = await this.getPreferences();
      return prefs.blogNotificationsEnabled;
    } catch (error) {
      console.error('Error getting blog notifications setting:', error);
      return true;
    }
  },

  /**
   * Set blog notifications
   */
  async setBlogNotifications(enabled: boolean): Promise<void> {
    try {
      await this.updatePreferences({ blogNotificationsEnabled: enabled });
    } catch (error) {
      console.error('Error setting blog notifications:', error);
    }
  },

  /**
   * Get haptic feedback setting
   */
  async isHapticFeedbackEnabled(): Promise<boolean> {
    try {
      const prefs = await this.getPreferences();
      return prefs.hapticFeedbackEnabled;
    } catch (error) {
      console.error('Error getting haptic feedback setting:', error);
      return true;
    }
  },

  /**
   * Set haptic feedback
   */
  async setHapticFeedback(enabled: boolean): Promise<void> {
    try {
      await this.updatePreferences({ hapticFeedbackEnabled: enabled });
    } catch (error) {
      console.error('Error setting haptic feedback:', error);
    }
  },

  /**
   * Get default tab
   */
  async getDefaultTab(): Promise<UserPreferences['defaultTab']> {
    try {
      const prefs = await this.getPreferences();
      return prefs.defaultTab;
    } catch (error) {
      console.error('Error getting default tab:', error);
      return 'index';
    }
  },

  /**
   * Set default tab
   */
  async setDefaultTab(tab: UserPreferences['defaultTab']): Promise<void> {
    try {
      await this.updatePreferences({ defaultTab: tab });
    } catch (error) {
      console.error('Error setting default tab:', error);
    }
  },

  /**
   * Reset to defaults
   */
  async reset(): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PREFERENCES));
    } catch (error) {
      console.error('Error resetting preferences:', error);
    }
  },
};
