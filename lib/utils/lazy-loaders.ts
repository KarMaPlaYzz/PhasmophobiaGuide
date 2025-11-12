/**
 * Lazy Loaders for Data
 * 
 * These functions implement dynamic imports to avoid loading all game data upfront.
 * Data is only imported when the tab/screen is accessed, reducing initial bundle size
 * and improving startup performance.
 */

import { Ghost } from '@/lib/types';

// Cache for loaded data
let cachedGhosts: Ghost[] | null = null;
let cachedEquipment: any[] | null = null;
let cachedMaps: any[] | null = null;

/**
 * Lazy load ghosts data
 * Returns cached data on subsequent calls
 */
export const loadGhosts = async (): Promise<Ghost[]> => {
  if (cachedGhosts) {
    return cachedGhosts;
  }
  
  const module = await import('@/lib/data/ghosts');
  cachedGhosts = module.GHOST_LIST;
  return cachedGhosts || [];
};

/**
 * Lazy load equipment data
 * Returns cached data on subsequent calls
 */
export const loadEquipment = async (): Promise<any[]> => {
  if (cachedEquipment) {
    return cachedEquipment;
  }
  
  const module = await import('@/lib/data/equipment');
  cachedEquipment = module.EQUIPMENT_LIST;
  return cachedEquipment || [];
};

/**
 * Lazy load maps data
 * Returns cached data on subsequent calls
 */
export const loadMaps = async (): Promise<any[]> => {
  if (cachedMaps) {
    return cachedMaps;
  }
  
  const module = await import('@/lib/data/maps');
  cachedMaps = module.MAP_LIST;
  return cachedMaps || [];
};

/**
 * Preload all data (call once on app startup)
 * This can be called after app initialization to ensure data is ready
 */
export const preloadAllData = async (): Promise<void> => {
  try {
    await Promise.all([
      loadGhosts(),
      loadEquipment(),
      loadMaps(),
    ]);
  } catch (error) {
    console.warn('Error preloading data:', error);
  }
};
