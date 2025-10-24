/**
 * AsyncStorage Utility
 * Handles all persistent data storage for the app
 * 
 * This uses @react-native-async-storage/async-storage
 * Installation: npx expo install @react-native-async-storage/async-storage
 */

import { Bookmark, EvidenceSelection, HistoryItem, UserLibrary, UserProgress } from '@/lib/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const STORAGE_KEYS = {
  USER_PROGRESS: '@phasmophobia_guide/user_progress',
  EVIDENCE_SELECTION: '@phasmophobia_guide/evidence_selection',
  FAVORITES: '@phasmophobia_guide/favorites',
  LAST_UPDATE: '@phasmophobia_guide/last_update',
  USER_LIBRARY: '@phasmophobia_guide/user_library',
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

// ============================================================================
// USER LIBRARY (BOOKMARKS & HISTORY)
// ============================================================================

/**
 * Get or initialize user library
 */
async function getLibrary(): Promise<UserLibrary> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_LIBRARY);
    if (data) {
      return JSON.parse(data);
    }
    // Initialize default library
    const defaultLibrary: UserLibrary = {
      bookmarks: [],
      history: [],
      customCategories: [],
      lastUpdated: Date.now(),
    };
    await AsyncStorage.setItem(STORAGE_KEYS.USER_LIBRARY, JSON.stringify(defaultLibrary));
    return defaultLibrary;
  } catch (error) {
    console.error('Error getting library:', error);
    return {
      bookmarks: [],
      history: [],
      customCategories: [],
      lastUpdated: Date.now(),
    };
  }
}

/**
 * Generate a unique ID
 */
function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// ============================================================================
// BOOKMARK SERVICE
// ============================================================================

export const BookmarkService = {
  /**
   * Add a bookmark
   */
  async addBookmark(bookmark: Bookmark): Promise<void> {
    try {
      const library = await getLibrary();
      library.bookmarks.push(bookmark);
      library.lastUpdated = Date.now();
      await AsyncStorage.setItem(STORAGE_KEYS.USER_LIBRARY, JSON.stringify(library));
    } catch (error) {
      console.error('Error adding bookmark:', error);
    }
  },

  /**
   * Remove a bookmark by ID
   */
  async removeBookmark(bookmarkId: string): Promise<void> {
    try {
      const library = await getLibrary();
      library.bookmarks = library.bookmarks.filter(b => b.id !== bookmarkId);
      library.lastUpdated = Date.now();
      await AsyncStorage.setItem(STORAGE_KEYS.USER_LIBRARY, JSON.stringify(library));
    } catch (error) {
      console.error('Error removing bookmark:', error);
    }
  },

  /**
   * Check if an item is bookmarked
   */
  async isBookmarked(itemId: string, type: string): Promise<boolean> {
    try {
      const library = await getLibrary();
      return library.bookmarks.some(b => b.itemId === itemId && b.type === type);
    } catch (error) {
      console.error('Error checking bookmark:', error);
      return false;
    }
  },

  /**
   * Get bookmarks, optionally filtered by type
   */
  async getBookmarks(type?: string): Promise<Bookmark[]> {
    try {
      const library = await getLibrary();
      if (type) {
        return library.bookmarks.filter(b => b.type === type);
      }
      return library.bookmarks;
    } catch (error) {
      console.error('Error getting bookmarks:', error);
      return [];
    }
  },

  /**
   * Add a tag to a bookmark
   */
  async addTag(bookmarkId: string, tag: string): Promise<void> {
    try {
      const library = await getLibrary();
      const bookmark = library.bookmarks.find(b => b.id === bookmarkId);
      if (bookmark && !bookmark.tags.includes(tag)) {
        bookmark.tags.push(tag);
        library.lastUpdated = Date.now();
        await AsyncStorage.setItem(STORAGE_KEYS.USER_LIBRARY, JSON.stringify(library));
      }
    } catch (error) {
      console.error('Error adding tag:', error);
    }
  },

  /**
   * Remove a tag from a bookmark
   */
  async removeTag(bookmarkId: string, tag: string): Promise<void> {
    try {
      const library = await getLibrary();
      const bookmark = library.bookmarks.find(b => b.id === bookmarkId);
      if (bookmark) {
        bookmark.tags = bookmark.tags.filter(t => t !== tag);
        library.lastUpdated = Date.now();
        await AsyncStorage.setItem(STORAGE_KEYS.USER_LIBRARY, JSON.stringify(library));
      }
    } catch (error) {
      console.error('Error removing tag:', error);
    }
  },

  // ========================================================================
  // PREMIUM FEATURES
  // ========================================================================

  /**
   * Add a personal note to a bookmark (Premium)
   */
  async addNoteToBookmark(bookmarkId: string, note: string): Promise<void> {
    try {
      const library = await getLibrary();
      const bookmark = library.bookmarks.find(b => b.id === bookmarkId);
      if (bookmark) {
        bookmark.note = note;
        library.lastUpdated = Date.now();
        await AsyncStorage.setItem(STORAGE_KEYS.USER_LIBRARY, JSON.stringify(library));
      }
    } catch (error) {
      console.error('Error adding note to bookmark:', error);
    }
  },

  /**
   * Pin/unpin a bookmark (Premium)
   */
  async togglePinBookmark(bookmarkId: string): Promise<void> {
    try {
      const library = await getLibrary();
      const bookmark = library.bookmarks.find(b => b.id === bookmarkId);
      if (bookmark) {
        bookmark.isPinned = !bookmark.isPinned;
        library.lastUpdated = Date.now();
        await AsyncStorage.setItem(STORAGE_KEYS.USER_LIBRARY, JSON.stringify(library));
      }
    } catch (error) {
      console.error('Error pinning bookmark:', error);
    }
  },

  /**
   * Set custom color for a bookmark (Premium)
   */
  async setBookmarkColor(bookmarkId: string, color: string): Promise<void> {
    try {
      const library = await getLibrary();
      const bookmark = library.bookmarks.find(b => b.id === bookmarkId);
      if (bookmark) {
        bookmark.color = color;
        library.lastUpdated = Date.now();
        await AsyncStorage.setItem(STORAGE_KEYS.USER_LIBRARY, JSON.stringify(library));
      }
    } catch (error) {
      console.error('Error setting bookmark color:', error);
    }
  },

  /**
   * Create a collection (Premium)
   */
  async createCollection(name: string, description?: string, color?: string): Promise<string> {
    try {
      const library = await getLibrary();
      if (!library.bookmarkCollections) {
        library.bookmarkCollections = [];
      }

      const collectionId = `collection_${Date.now()}`;
      library.bookmarkCollections.push({
        id: collectionId,
        name,
        description,
        color: color || '#FF6B9D',
        bookmarkIds: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      library.lastUpdated = Date.now();
      await AsyncStorage.setItem(STORAGE_KEYS.USER_LIBRARY, JSON.stringify(library));
      return collectionId;
    } catch (error) {
      console.error('Error creating collection:', error);
      throw error;
    }
  },

  /**
   * Add bookmark to collection (Premium)
   */
  async addBookmarkToCollection(bookmarkId: string, collectionId: string): Promise<void> {
    try {
      const library = await getLibrary();
      if (!library.bookmarkCollections) {
        library.bookmarkCollections = [];
      }

      const bookmark = library.bookmarks.find(b => b.id === bookmarkId);
      const collection = library.bookmarkCollections.find(c => c.id === collectionId);

      if (bookmark && collection) {
        bookmark.collectionId = collectionId;
        if (!collection.bookmarkIds.includes(bookmarkId)) {
          collection.bookmarkIds.push(bookmarkId);
        }
        collection.updatedAt = Date.now();
        library.lastUpdated = Date.now();
        await AsyncStorage.setItem(STORAGE_KEYS.USER_LIBRARY, JSON.stringify(library));
      }
    } catch (error) {
      console.error('Error adding bookmark to collection:', error);
    }
  },

  /**
   * Remove bookmark from collection (Premium)
   */
  async removeBookmarkFromCollection(bookmarkId: string, collectionId: string): Promise<void> {
    try {
      const library = await getLibrary();
      if (!library.bookmarkCollections) {
        return;
      }

      const bookmark = library.bookmarks.find(b => b.id === bookmarkId);
      const collection = library.bookmarkCollections.find(c => c.id === collectionId);

      if (bookmark && collection) {
        bookmark.collectionId = undefined;
        collection.bookmarkIds = collection.bookmarkIds.filter(id => id !== bookmarkId);
        collection.updatedAt = Date.now();
        library.lastUpdated = Date.now();
        await AsyncStorage.setItem(STORAGE_KEYS.USER_LIBRARY, JSON.stringify(library));
      }
    } catch (error) {
      console.error('Error removing bookmark from collection:', error);
    }
  },

  /**
   * Get all collections (Premium)
   */
  async getCollections(): Promise<any[]> {
    try {
      const library = await getLibrary();
      return library.bookmarkCollections || [];
    } catch (error) {
      console.error('Error getting collections:', error);
      return [];
    }
  },

  /**
   * Get bookmarks in collection (Premium)
   */
  async getCollectionBookmarks(collectionId: string): Promise<Bookmark[]> {
    try {
      const library = await getLibrary();
      return library.bookmarks.filter(b => b.collectionId === collectionId);
    } catch (error) {
      console.error('Error getting collection bookmarks:', error);
      return [];
    }
  },

  /**
   * Update collection (Premium)
   */
  async updateCollection(collectionId: string, updates: { name?: string; description?: string; color?: string }): Promise<void> {
    try {
      const library = await getLibrary();
      if (!library.bookmarkCollections) {
        return;
      }

      const collection = library.bookmarkCollections.find(c => c.id === collectionId);
      if (collection) {
        if (updates.name) collection.name = updates.name;
        if (updates.description) collection.description = updates.description;
        if (updates.color) collection.color = updates.color;
        collection.updatedAt = Date.now();
        library.lastUpdated = Date.now();
        await AsyncStorage.setItem(STORAGE_KEYS.USER_LIBRARY, JSON.stringify(library));
      }
    } catch (error) {
      console.error('Error updating collection:', error);
    }
  },

  /**
   * Delete collection (Premium)
   */
  async deleteCollection(collectionId: string): Promise<void> {
    try {
      const library = await getLibrary();
      if (!library.bookmarkCollections) {
        return;
      }

      library.bookmarkCollections = library.bookmarkCollections.filter(c => c.id !== collectionId);
      // Remove collection reference from bookmarks
      library.bookmarks.forEach(b => {
        if (b.collectionId === collectionId) {
          b.collectionId = undefined;
        }
      });
      library.lastUpdated = Date.now();
      await AsyncStorage.setItem(STORAGE_KEYS.USER_LIBRARY, JSON.stringify(library));
    } catch (error) {
      console.error('Error deleting collection:', error);
    }
  },

  /**
   * Get pinned bookmarks (Premium)
   */
  async getPinnedBookmarks(): Promise<Bookmark[]> {
    try {
      const library = await getLibrary();
      return library.bookmarks.filter(b => b.isPinned === true);
    } catch (error) {
      console.error('Error getting pinned bookmarks:', error);
      return [];
    }
  },
};


// ============================================================================
// HISTORY SERVICE
// ============================================================================

export const HistoryService = {
  /**
   * Track a view of an item
   */
  async trackView(type: 'ghost' | 'equipment' | 'map' | 'evidence', itemId: string, itemName: string): Promise<void> {
    try {
      const library = await getLibrary();
      
      // Remove duplicate if exists (recent move to top)
      library.history = library.history.filter(h => !(h.itemId === itemId && h.type === type));
      
      // Add new entry at the beginning
      library.history.unshift({
        id: generateId(),
        type,
        itemId,
        itemName,
        viewedAt: Date.now(),
        timeSpent: 0,
      });
      
      // Keep only last 100 items
      library.history = library.history.slice(0, 100);
      library.lastUpdated = Date.now();
      
      await AsyncStorage.setItem(STORAGE_KEYS.USER_LIBRARY, JSON.stringify(library));
    } catch (error) {
      console.error('Error tracking view:', error);
    }
  },

  /**
   * Get history items, optionally filtered by type and limited
   */
  async getHistory(type?: 'ghost' | 'equipment' | 'map' | 'evidence', limit: number = 20): Promise<HistoryItem[]> {
    try {
      const library = await getLibrary();
      let items = library.history;
      
      if (type) {
        items = items.filter(h => h.type === type);
      }
      
      return items.slice(0, limit);
    } catch (error) {
      console.error('Error getting history:', error);
      return [];
    }
  },

  /**
   * Clear all history
   */
  async clearHistory(): Promise<void> {
    try {
      const library = await getLibrary();
      library.history = [];
      library.lastUpdated = Date.now();
      await AsyncStorage.setItem(STORAGE_KEYS.USER_LIBRARY, JSON.stringify(library));
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  },

  /**
   * Update time spent on a history item
   */
  async updateTimeSpent(historyId: string, additionalTime: number): Promise<void> {
    try {
      const library = await getLibrary();
      const item = library.history.find(h => h.id === historyId);
      if (item) {
        item.timeSpent += additionalTime;
        library.lastUpdated = Date.now();
        await AsyncStorage.setItem(STORAGE_KEYS.USER_LIBRARY, JSON.stringify(library));
      }
    } catch (error) {
      console.error('Error updating time spent:', error);
    }
  },
};

export const libraryStorageService = {
  getLibrary,
};

// Update default storageService object to include initialization of library
const originalInitialize = storageService.initialize.bind(storageService);
storageService.initialize = async function() {
  await originalInitialize();
  try {
    // Ensure library exists
    await getLibrary();
  } catch (error) {
    console.error('Error initializing library:', error);
  }
};

export default storageService;
