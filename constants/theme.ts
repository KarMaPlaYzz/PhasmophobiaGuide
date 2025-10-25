/**
 * Phasmophobia-Themed Color Palette for Guide App
 * Dark horror aesthetic with purple, cyan, and ghostly accents
 * Inspired by Phasmophobia's supernatural atmosphere
 */

import { Platform } from 'react-native';

// Primary Phasmophobia colors
const PRIMARY_PURPLE = '#6B4AAC';
const ACCENT_CYAN = '#00D9FF';
const ACCENT_GREEN = '#1FB46B';
const DARK_BG = '#0F0E17';
const DARKER_BG = '#050404';
const SURFACE_DARK = '#1A1820';
const SURFACE_LIGHTER = '#2B2737';

const tintColorLight = ACCENT_CYAN;
const tintColorDark = ACCENT_CYAN;

export const Colors = {
  light: {
    text: '#E8E8F0',
    background: DARK_BG,
    tint: tintColorLight,
    icon: ACCENT_CYAN,
    tabIconDefault: '#9A95A8',
    tabIconSelected: ACCENT_CYAN,
    // Enhanced palette
    surface: SURFACE_DARK,
    surfaceLight: SURFACE_LIGHTER,
    border: '#3D3847',
    success: ACCENT_GREEN,
    warning: '#FFB84D',
    error: '#FF4444',
    info: ACCENT_CYAN,
    // Paranormal/Ghost themed
    supernatural: PRIMARY_PURPLE,
    paranormal: ACCENT_GREEN,
    spectral: ACCENT_CYAN,
    cursed: '#8B0000',
    ghostWhite: '#E8E8F0',
    haunted: '#4A3F78',
    // Difficulty colors
    difficulty: {
      beginner: '#4CAF50',
      intermediate: '#FFC107',
      advanced: '#FF9800',
      expert: '#FF5252',
    },
    // Activity level colors
    activity: {
      low: '#4CAF50',
      medium: '#FFC107',
      high: '#FF9800',
      veryHigh: '#FF5252',
      variable: '#9C27B0',
    },
    // Movement speed colors
    movement: {
      slow: '#4CAF50',
      normal: '#2196F3',
      fast: '#FF9800',
      variable: '#9C27B0',
    },
  },
  dark: {
    text: '#E8E8F0',
    background: DARKER_BG,
    tint: tintColorDark,
    icon: ACCENT_CYAN,
    tabIconDefault: '#9A95A8',
    tabIconSelected: ACCENT_CYAN,
    // Enhanced palette
    surface: SURFACE_DARK,
    surfaceLight: SURFACE_LIGHTER,
    border: '#3D3847',
    success: ACCENT_GREEN,
    warning: '#FFB84D',
    error: '#FF4444',
    info: ACCENT_CYAN,
    // Paranormal/Ghost themed
    supernatural: PRIMARY_PURPLE,
    paranormal: ACCENT_GREEN,
    spectral: ACCENT_CYAN,
    cursed: '#8B0000',
    ghostWhite: '#E8E8F0',
    haunted: '#4A3F78',
    // Difficulty colors (lighter for dark mode)
    difficulty: {
      beginner: '#66bb6a',
      intermediate: '#fdd835',
      advanced: '#ffb74d',
      expert: '#ff6e6e',
    },
    // Activity level colors (lighter for dark mode)
    activity: {
      low: '#66bb6a',
      medium: '#fdd835',
      high: '#ffb74d',
      veryHigh: '#ff6e6e',
      variable: '#ba68c8',
    },
    // Movement speed colors (lighter for dark mode)
    movement: {
      slow: '#66bb6a',
      normal: '#42a5f5',
      fast: '#ffb74d',
      variable: '#ba68c8',
    },
    // Overlay colors for better dark mode text readability
    overlays: {
      dark: 'rgba(0, 0, 0, 0.7)',
      light: 'rgba(255, 255, 255, 0.1)',
      medium: 'rgba(255, 255, 255, 0.05)',
    },
  },
};

// Difficulty Colors
export const DifficultyColors = {
  Beginner: ACCENT_GREEN,
  Intermediate: '#FFB84D',
  Advanced: '#FF4444',
  Expert: PRIMARY_PURPLE,
};

// Activity Level Colors
export const ActivityColors = {
  'Low': '#4CAF50',
  'Medium': '#FFC107',
  'High': '#FF9800',
  'Very High': '#FF5252',
  'Variable': '#9C27B0',
};

// Movement Speed Colors
export const MovementColors = {
  'Slow': '#4CAF50',
  'Normal': '#2196F3',
  'Fast': '#FF9800',
  'Variable': '#9C27B0',
};

// Equipment Category Colors
export const EquipmentCategoryColors = {
  'starter': '#2196F3',
  'optional': '#FF9800',
  'truck': '#4CAF50',
  'cursed': '#F44336',
};

// Ghost Type Colors - Phasmophobia Themed
export const GhostTypeColors: Record<string, string> = {
  spirit: '#A8D5FF',
  wraith: '#00D9FF',
  phantom: '#9B5FFF',
  poltergeist: '#FF6B6B',
  banshee: '#B45FFF',
  jinn: '#FF69B4',
  mare: '#6B4AAC',
  revenant: '#8B0000',
  shade: '#1A1820',
  demon: '#FF3333',
  yurei: '#00D9FF',
  oni: '#FF5722',
  yokai: '#00D9FF',
  hantu: '#5DDEF4',
  goryo: '#8A8A9E',
  myling: '#FF8C42',
  onryo: '#FF6B6B',
  theTwins: '#9B5FFF',
  raiju: '#FFD700',
  obake: '#FF69B4',
  theMinic: '#6B5B95',
  moroi: '#8B4513',
  deogen: '#A9A9A9',
  thaye: '#8B6B47',
};

export const Fonts = Platform.select({
  ios: {
    /** Outfit Regular */
    outfit_400: 'Outfit_400Regular',
    /** Outfit SemiBold */
    outfit_600: 'Outfit_600SemiBold',
    /** Outfit Bold */
    outfit_700: 'Outfit_700Bold',
    /** Outfit ExtraBold */
    outfit_800: 'Outfit_800ExtraBold',
  },
  android: {
    /** Outfit Regular */
    outfit_400: 'Outfit_400Regular',
    /** Outfit SemiBold */
    outfit_600: 'Outfit_600SemiBold',
    /** Outfit Bold */
    outfit_700: 'Outfit_700Bold',
    /** Outfit ExtraBold */
    outfit_800: 'Outfit_800ExtraBold',
  },
  default: {
    /** Fallback fonts */
    outfit_400: 'normal',
    outfit_600: 'normal',
    outfit_700: 'bold',
    outfit_800: 'bold',
  },
  web: {
    /** Outfit Regular */
    outfit_400: "Outfit, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    /** Outfit SemiBold */
    outfit_600: "Outfit, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    /** Outfit Bold */
    outfit_700: "Outfit, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    /** Outfit ExtraBold */
    outfit_800: "Outfit, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  },
});

// Enhanced Shadow System - Supernatural Glow Effect
export const Shadows = {
  small: {
    shadowColor: PRIMARY_PURPLE,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: ACCENT_CYAN,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: PRIMARY_PURPLE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
};
