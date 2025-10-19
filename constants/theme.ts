/**
 * Enhanced Color Palette for Phasmophobia Guide App
 * Includes theme colors, difficulty levels, ghost types, and paranormal elements
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    // Enhanced palette
    surface: '#f5f5f5',
    border: '#e0e0e0',
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',
    // Paranormal/Ghost themed
    supernatural: '#2D1B4E',
    paranormal: '#1a4d2e',
    spectral: '#6B4FBB',
    cursed: '#8B0000',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    // Enhanced palette
    surface: '#242526',
    border: '#3a3a3c',
    success: '#66BB6A',
    warning: '#FFA726',
    error: '#EF5350',
    info: '#42A5F5',
    // Paranormal/Ghost themed
    supernatural: '#7C5FCC',
    paranormal: '#2D6A4F',
    spectral: '#9B7FBB',
    cursed: '#B22222',
  },
};

// Difficulty Colors
export const DifficultyColors = {
  Beginner: '#4CAF50',
  Intermediate: '#FF9800',
  Advanced: '#F44336',
  Expert: '#9C27B0',
};

// Ghost Type Colors
export const GhostTypeColors: Record<string, string> = {
  spirit: '#FFD700',
  wraith: '#87CEEB',
  phantom: '#DDA0DD',
  poltergeist: '#FF6347',
  banshee: '#9932CC',
  jinn: '#FF69B4',
  mare: '#4B0082',
  revenant: '#8B0000',
  shade: '#2F4F4F',
  demon: '#DC143C',
  yurei: '#00CED1',
  oni: '#FF4500',
  yokai: '#20B2AA',
  hantu: '#00BFFF',
  goryo: '#708090',
  myling: '#FF8C00',
  onryo: '#CD5C5C',
  'the-twins': '#BA55D3',
  raiju: '#FFD700',
  obake: '#FF1493',
  'the-mimic': '#696969',
  moroi: '#8B4513',
  deogen: '#A9A9A9',
  thaye: '#DEB887',
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

// Enhanced Shadow System
export const Shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
};
