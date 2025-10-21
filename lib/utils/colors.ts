/**
 * Color utility functions for enhanced dark mode and visual indicators
 */

/**
 * Get activity indicator information (icon and color)
 * @param activityLevel - The activity level (Low, Medium, High, Very High, Variable)
 * @returns Object with color and icon name
 */
export const getActivityIndicator = (
  activityLevel: string
): { color: string; icon: string } => {
  switch (activityLevel) {
    case 'Low':
      return { color: '#4CAF50', icon: 'arrow-down' };
    case 'Medium':
      return { color: '#FFC107', icon: 'trending-up' };
    case 'High':
      return { color: '#FF9800', icon: 'arrow-up' };
    case 'Very High':
      return { color: '#FF5252', icon: 'flame' };
    case 'Variable':
      return { color: '#9C27B0', icon: 'shuffle' };
    default:
      return { color: '#999999', icon: 'help-circle' };
  }
};

/**
 * Get movement speed indicator information
 * @param speed - The movement speed (Slow, Normal, Fast, Variable)
 * @returns Object with color and icon name
 */
export const getMovementIndicator = (
  speed: string
): { color: string; icon: string } => {
  switch (speed) {
    case 'Slow':
      return { color: '#4CAF50', icon: 'walk' };
    case 'Normal':
      return { color: '#2196F3', icon: 'speedometer' };
    case 'Fast':
      return { color: '#FF9800', icon: 'flash' };
    case 'Variable':
      return { color: '#9C27B0', icon: 'shuffle' };
    default:
      return { color: '#999999', icon: 'help-circle' };
  }
};

/**
 * Get sanity level color based on percentage
 * @param sanityLevel - Sanity level as percentage (0-100)
 * @returns Color string
 */
export const getSanityColor = (sanityLevel: number): string => {
  if (sanityLevel > 80) return '#4CAF50';    // Green - Safe
  if (sanityLevel > 60) return '#8BC34A';    // Light Green - Caution
  if (sanityLevel > 40) return '#FFC107';    // Amber - Warning
  if (sanityLevel > 20) return '#FF9800';    // Orange - Danger
  return '#FF5252';                          // Red - Critical
};

/**
 * Calculate luminance of a color to determine if text should be light or dark
 * @param backgroundColor - Hex color string
 * @param lightColor - Color to use if background is dark (default: #ffffff)
 * @param darkColor - Color to use if background is light (default: #000000)
 * @param threshold - Luminance threshold (default: 128)
 * @returns Appropriate text color
 */
export const getContrastColor = (
  backgroundColor: string,
  lightColor: string = '#ffffff',
  darkColor: string = '#000000',
  threshold: number = 128
): string => {
  // Remove # if present and convert to RGB
  const hex = backgroundColor.replace('#', '');
  const rgb = parseInt(hex, 16);
  
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  
  // Calculate luminance using standard formula
  const luminance = (r * 299 + g * 587 + b * 114) / 1000;
  
  // Return light text for dark backgrounds, dark text for light backgrounds
  return luminance > threshold ? darkColor : lightColor;
};

/**
 * Get difficulty indicator information
 * @param difficulty - The difficulty level (Beginner, Intermediate, Advanced, Expert)
 * @returns Object with color and icon name
 */
export const getDifficultyIndicator = (
  difficulty: string
): { color: string; icon: string } => {
  switch (difficulty) {
    case 'Beginner':
      return { color: '#4CAF50', icon: 'star' };
    case 'Intermediate':
      return { color: '#FFC107', icon: 'star-half' };
    case 'Advanced':
      return { color: '#FF9800', icon: 'flame' };
    case 'Expert':
      return { color: '#FF5252', icon: 'flash' };
    default:
      return { color: '#999999', icon: 'help-circle' };
  }
};

/**
 * Get equipment category color
 * @param category - Equipment category (starter, optional, truck, cursed)
 * @returns Color string
 */
export const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    'starter': '#2196F3',      // Blue
    'optional': '#FF9800',     // Orange
    'truck': '#4CAF50',        // Green
    'cursed': '#F44336',       // Red
  };
  return colors[category.toLowerCase()] || '#999999';
};

/**
 * Get evidence difficulty color
 * @param difficulty - Evidence difficulty (Easy, Medium, Hard, Expert)
 * @returns Color string
 */
export const getEvidenceDifficultyColor = (difficulty: string): string => {
  const colors: Record<string, string> = {
    'Easy': '#4CAF50',
    'Medium': '#FFC107',
    'Hard': '#FF9800',
    'Expert': '#FF5252',
  };
  return colors[difficulty] || '#999999';
};
