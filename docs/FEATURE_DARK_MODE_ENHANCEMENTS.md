# Dark Mode Color Optimization & Difficulty Color Coding

## Overview
Enhanced dark mode with better visual hierarchy, difficulty color coding in search/filters, and activity level visual indicators throughout the app.

## Features

### 1. Enhanced Color Palette

**Current Difficulty Colors** (keep these):
```typescript
export const DifficultyColors = {
  'Beginner': '#4CAF50',      // Green
  'Intermediate': '#FFC107',   // Amber
  'Advanced': '#FF9800',       // Orange
  'Expert': '#FF5252',         // Red
};
```

**Add Activity Level Colors** (new):
```typescript
export const ActivityColors = {
  'Low': '#4CAF50',             // Green
  'Medium': '#FFC107',          // Amber
  'High': '#FF9800',            // Orange
  'Very High': '#FF5252',       // Red
  'Variable': '#9C27B0',        // Purple
};
```

**Add Movement Speed Colors** (new):
```typescript
export const MovementColors = {
  'Slow': '#4CAF50',            // Green
  'Normal': '#2196F3',          // Blue
  'Fast': '#FF9800',            // Orange
  'Variable': '#9C27B0',        // Purple
};
```

### 2. Dark Mode Enhancements

**File**: `constants/theme.ts`

Update color definitions for better dark mode contrast:

```typescript
export const Colors = {
  light: {
    text: '#1a1a1a',
    background: '#ffffff',
    surface: '#f5f5f5',
    tint: '#007AFF',
    spectral: '#6366f1',
    haunted: '#8b5cf6',
    ghost: {
      beginner: '#4CAF50',
      intermediate: '#FFC107',
      advanced: '#FF9800',
      expert: '#FF5252',
    },
    activity: {
      low: '#4CAF50',
      medium: '#FFC107',
      high: '#FF9800',
      veryHigh: '#FF5252',
      variable: '#9C27B0',
    },
  },
  dark: {
    text: '#f0f0f0',
    background: '#0a0e27',      // Darker, more blue-tinted
    surface: '#1a1f3a',         // Slightly lighter than background
    tint: '#40a9ff',            // Brighter for dark mode
    spectral: '#818cf8',        // Lighter purple for dark
    haunted: '#a78bfa',         // Lighter purple for dark
    ghost: {
      beginner: '#66bb6a',      // Lighter green for dark
      intermediate: '#fdd835',   // Lighter amber for dark
      advanced: '#ffb74d',       // Lighter orange for dark
      expert: '#ff6e6e',        // Lighter red for dark
    },
    activity: {
      low: '#66bb6a',
      medium: '#fdd835',
      high: '#ffb74d',
      veryHigh: '#ff6e6e',
      variable: '#ba68c8',
    },
    // Add overlay colors for better dark mode text readability
    overlays: {
      dark: 'rgba(0, 0, 0, 0.7)',
      light: 'rgba(255, 255, 255, 0.1)',
      medium: 'rgba(255, 255, 255, 0.05)',
    },
  },
};
```

### 3. Enhanced Search/Filter Display

**Location**: `app/(tabs)/ghosts.tsx`

Add visual indicators in difficulty filter pills:

```typescript
const renderDifficultyFilter = (difficulty: string) => {
  const color = getDifficultyColor(difficulty);
  const icon = getDifficultyIcon(difficulty);
  
  return (
    <Pressable
      key={difficulty}
      onPress={() => setSelectedDifficulty(difficulty)}
      style={[
        styles.filterPill,
        {
          backgroundColor: 
            selectedDifficulty === difficulty 
              ? color + '30' 
              : colors.surface,
          borderColor: color,
          borderWidth: selectedDifficulty === difficulty ? 2 : 1,
        },
      ]}
    >
      <Ionicons name={icon} size={16} color={color} />
      <ThemedText
        style={{
          color: selectedDifficulty === difficulty ? color : colors.text,
          fontWeight: selectedDifficulty === difficulty ? '700' : '500',
          marginLeft: 4,
        }}
      >
        {difficulty}
      </ThemedText>
    </Pressable>
  );
};
```

### 4. Ghost Card Activity Indicators

**Location**: `app/(tabs)/ghosts.tsx` - Ghost list items

Add visual indicators for activity level:

```typescript
const renderActivityIndicator = (activityLevel: string) => {
  const { color, icon } = getActivityIndicator(activityLevel);
  
  return (
    <View style={styles.activityIndicator}>
      <Ionicons name={icon} size={14} color={color} />
      <ThemedText style={{ color, fontSize: 11, marginLeft: 4 }}>
        {activityLevel}
      </ThemedText>
    </View>
  );
};

// In ghost card:
<View style={styles.ghostCardFooter}>
  <View style={styles.statsRow}>
    {renderActivityIndicator(ghost.activityLevel)}
    <View style={styles.speedIndicator}>
      <Ionicons 
        name={ghost.movementSpeed === 'Fast' ? 'flash' : 'walk'} 
        size={14} 
        color={MovementColors[ghost.movementSpeed]} 
      />
      <ThemedText style={{ color: MovementColors[ghost.movementSpeed] }}>
        {ghost.movementSpeed}
      </ThemedText>
    </View>
  </View>
</View>
```

### 5. Equipment Category Color Coding

**Location**: `app/(tabs)/equipments.tsx`

Color-code equipment by category:

```typescript
const getCategoryColor = (category: string) => {
  const colors = {
    starter: '#2196F3',      // Blue
    optional: '#FF9800',     // Orange
    truck: '#4CAF50',        // Green
    cursed: '#F44336',       // Red
  };
  return colors[category] || '#999';
};

// In equipment list item:
<View
  style={[
    styles.equipmentCard,
    {
      borderLeftWidth: 4,
      borderLeftColor: getCategoryColor(equipment.category),
      backgroundColor: getCategoryColor(equipment.category) + '10',
    },
  ]}
>
```

### 6. Sanity Level Indicators

**Location**: Enhanced color usage throughout

```typescript
const getSanityColor = (sanityLevel: number) => {
  if (sanityLevel > 80) return '#4CAF50';    // Green - Safe
  if (sanityLevel > 60) return '#8BC34A';    // Light Green
  if (sanityLevel > 40) return '#FFC107';    // Amber - Caution
  if (sanityLevel > 20) return '#FF9800';    // Orange - Warning
  return '#FF5252';                          // Red - Danger
};

// Sanity bar component:
const SanityBar = ({ level }: { level: number }) => (
  <View style={styles.sanityBarContainer}>
    <View
      style={[
        styles.sanityBarFill,
        {
          width: `${level}%`,
          backgroundColor: getSanityColor(level),
          borderRadius: level === 0 ? 0 : 4,
        },
      ]}
    />
  </View>
);
```

### 7. Map Difficulty Indicators

**Location**: `app/(tabs)/maps.tsx`

Color-code map difficulty:

```typescript
const MapCard = ({ map }: { map: Map }) => (
  <View style={styles.mapCard}>
    {/* ... existing content ... */}
    <View
      style={[
        styles.difficultyBadge,
        {
          backgroundColor: DifficultyColors[map.difficulty] + '20',
          borderColor: DifficultyColors[map.difficulty],
          borderWidth: 1,
        },
      ]}
    >
      <Ionicons 
        name={getDifficultyIcon(map.difficulty)} 
        size={16} 
        color={DifficultyColors[map.difficulty]} 
      />
      <ThemedText style={{ color: DifficultyColors[map.difficulty] }}>
        {map.difficulty}
      </ThemedText>
    </View>
  </View>
);
```

### 8. Hunt Sanity Threshold Visualization

**Location**: Ghost detail sheet

Add visual indicator for hunt threshold:

```typescript
const HuntThresholdIndicator = ({ threshold }: { threshold: number }) => (
  <View style={styles.thresholdContainer}>
    <ThemedText style={styles.thresholdLabel}>Hunt Threshold: {threshold}%</ThemedText>
    <View style={styles.thresholdBar}>
      <View
        style={[
          styles.thresholdMarker,
          {
            left: `${threshold}%`,
            backgroundColor: getSanityColor(threshold),
          },
        ]}
      />
    </View>
    <View style={styles.thresholdLabels}>
      <ThemedText style={styles.thresholdLabelLeft}>0%</ThemedText>
      <ThemedText style={styles.thresholdLabelRight}>100%</ThemedText>
    </View>
  </View>
);
```

### 9. Evidence Difficulty Badges

**Location**: Evidence details

Show difficulty color in evidence cards:

```typescript
const evidenceDifficultyColor = {
  'Easy': '#4CAF50',
  'Medium': '#FFC107',
  'Hard': '#FF9800',
  'Expert': '#FF5252',
};

<View
  style={[
    styles.difficultyBadge,
    { backgroundColor: evidenceDifficultyColor[evidence.difficulty] + '20' },
  ]}
>
  <ThemedText 
    style={{ color: evidenceDifficultyColor[evidence.difficulty] }}
  >
    {evidence.difficulty} to detect
  </ThemedText>
</View>
```

### 10. Contrast Checker for Dark Mode

Add a utility function to ensure text is readable:

```typescript
export const getContrastColor = (
  backgroundColor: string,
  lightColor: string = '#ffffff',
  darkColor: string = '#000000',
  threshold: number = 128
): string => {
  // Convert hex to RGB and calculate luminance
  // Return lightColor if background is dark, darkColor if background is light
  
  const rgb = parseInt(backgroundColor.slice(1), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  
  const luminance = (r * 299 + g * 587 + b * 114) / 1000;
  
  return luminance > threshold ? darkColor : lightColor;
};
```

## Implementation Guide

### Step 1: Update Theme Constants
- Edit `constants/theme.ts`
- Add new color palettes for activity, movement, sanity
- Enhance dark mode colors

### Step 2: Create Helper Functions
- `getActivityIndicator(level)` - Returns color and icon
- `getSanityColor(level)` - Returns appropriate color
- `getDifficultyColor(difficulty)` - Already exists, ensure it's used everywhere
- `getContrastColor(background)` - Ensure readability

### Step 3: Update Ghost Screen
- Add activity level indicators to ghost cards
- Add movement speed indicators
- Update difficulty filter pills with colors

### Step 4: Update Equipment Screen
- Add category color badges
- Update equipment cards with color-coded borders

### Step 5: Update Ghost Detail Sheet
- Add hunt sanity threshold visualization
- Color-code abilities and effects
- Highlight important stats with color

### Step 6: Update Map Screen
- Color-code difficulty badges
- Add visual indicators for map characteristics

### Step 7: Update Evidence Screen
- Color-code difficulty badges
- Add rarity indicators with colors

### Step 8: Test Dark Mode
- Test all screens in dark mode
- Verify text contrast meets WCAG AA standard
- Test on various phone models

## Styling Examples

### Before (Plain)
```
Difficulty: Beginner
Activity Level: High
Hunt Threshold: 50%
```

### After (Color-Coded)
```
🟢 Difficulty: Beginner
🔥 Activity Level: High  
❗ Hunt Threshold: 50%
```

## Accessibility Notes

- Ensure color is not the only indicator
- Use icons + color combinations
- Maintain sufficient contrast (4.5:1 for text)
- Test with colorblind simulator (Protanopia, Deuteranopia)

## Testing Checklist

- [ ] All difficulty colors visible in light mode
- [ ] All difficulty colors visible in dark mode
- [ ] Activity level indicators clear and visible
- [ ] Sanity bar changes color appropriately
- [ ] Dark mode text is readable (WCAG AA)
- [ ] Color contrasts work on various backgrounds
- [ ] Icons match the color intentions
- [ ] No pure white or pure black in dark mode
- [ ] Ghost cards show all indicators
- [ ] Equipment cards are visually distinct

## Performance Impact

- Minimal: Just color constant lookups
- Memoize icon/color combinations if needed
- No additional API calls required

## File Changes Summary

- `constants/theme.ts` - Add new colors
- `app/(tabs)/ghosts.tsx` - Add indicators
- `app/(tabs)/equipments.tsx` - Add color coding
- `app/(tabs)/maps.tsx` - Add color coding
- `app/(tabs)/evidence.tsx` - Add color coding
- `components/ghost-detail-sheet.tsx` - Enhanced visuals
- New utility file: `lib/utils/colors.ts` - Helper functions

## Related Features

Works well with:
- Ghost Comparison Tool (color-coded differences)
- Equipment Optimizer (color-coded effectiveness)
- Evidence Identifier (color-coded matches)
- Sanity Calculator (color-coded danger levels)
