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
  },
};

// Difficulty Colors
export const DifficultyColors = {
  Beginner: ACCENT_GREEN,
  Intermediate: '#FFB84D',
  Advanced: '#FF4444',
  Expert: PRIMARY_PURPLE,
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
  'the-twins': '#9B5FFF',
  raiju: '#FFD700',
  obake: '#FF69B4',
  'the-mimic': '#6B5B95',
  moroi: '#8B4513',
  deogen: '#A9A9A9',
  thaye: '#8B6B47',
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
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
