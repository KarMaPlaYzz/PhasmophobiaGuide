# Ghost Comparison Tool - Implementation Guide

## Overview
The Ghost Comparison Tool enables users to compare 2-3 ghosts side-by-side to identify similarities, differences, and counter-strategies. Accessed via a FAB (Floating Action Button) on the Ghosts tab, it provides comprehensive multi-tab comparison views.

## Components

### 1. **GhostComparisonSheet** (`components/ghost-comparison-sheet.tsx`)
Main detail sheet component using Gorhom BottomSheet with tabbed interface.

**Features:**
- Multi-select capability (2-3 ghosts max)
- Horizontal scrolling for each comparison section
- 5 comparison tabs: Basic Stats, Abilities, Evidence, Equipment, Strategies
- Similarity scoring algorithm
- Real-time search and filtering
- Haptic feedback on interactions

**Props:**
```typescript
interface GhostComparisonSheetProps {
  isVisible: boolean;
  onClose: () => void;
  initialGhostIds?: string[];
}
```

**State Management:**
```typescript
- selectedGhostIds: string[] // Currently compared ghosts
- searchText: string // Search query for ghost filtering
- activeTab: 'basic' | 'abilities' | 'evidence' | 'equipment' | 'strategies'
```

## Integration in ghosts.tsx

### FAB Button
```tsx
<TouchableOpacity
  onPress={() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowComparisonSheet(true);
  }}
  style={[styles.fab, { bottom: insets.bottom + 20 }]}
  activeOpacity={0.8}
>
  <BlurView intensity={85} style={StyleSheet.absoluteFillObject} />
  <View style={[styles.fabContent, { backgroundColor: colors.spectral + '90' }]}>
    <MaterialIcons name="compare-arrows" size={24} color="white" />
  </View>
</TouchableOpacity>
```

**Styling:**
- Position: Fixed bottom-right with safe area insets
- Size: 56x56 (24pt icon)
- Blur: BlurView intensity 85 for glassmorphism
- Color: Cyan/spectral (#00D9FF)
- Shadow: 4pt offset with 0.3 opacity

## Comparison Tabs

### 1. **Basic Stats Tab**
Displays fundamental ghost properties in side-by-side columns:
- Ghost Name (with difficulty color coding)
- Difficulty Level (with badge)
- Hunt Sanity Threshold
- Activity Level

### 2. **Abilities Tab**
Shows unique ghost abilities with descriptions:
- Ability Name
- Mechanical Description
- Effect Details
- Distinguishing Features

### 3. **Evidence Tab**
Color-coded evidence comparison:
- **Common Evidence** (Green) - Present in all compared ghosts
- **Unique Evidence** (Gray) - Specific to individual ghosts
- Check circle indicator for common evidence

### 4. **Equipment Tab**
Recommended equipment by category:
- **Essential** (Red) - Required for safe hunting
- **Recommended** (Default) - Highly recommended items
- Cost indicators
- Effectiveness ratings

### 5. **Strategies Tab**
Counter-strategies and counter-play tactics:
- Strategy Name
- Tactical Tips (bullet points)
- Effectiveness indicators
- Recommended approach

## Data Structures

### ComparisonData
```typescript
interface ComparisonData {
  ghosts: Ghost[];
  commonEvidence: string[];
  uniqueEvidence: Map<string, string[]>;
  similarities: { score: number };
}
```

## Algorithms

### Similarity Scoring
Calculates a 0-100% similarity score based on multiple factors:

```typescript
function calculateSimilarity(ghosts: Ghost[]): { score: number }

Weighting:
- Evidence Match: 30%
  (Common evidence / Total unique evidence)
- Difficulty Match: 20%
  (Exact match = 100%, no match = 0%)
- Activity Level Match: 15%
  (Exact match = 100%, no match = 0%)
- Hunt Sanity Similarity: 15%
  (Within ±10% = 100%, linear falloff)
- Equipment Recommendations: 20%
  (Overlap percentage)
```

**Returns:** Integer 0-100 representing similarity percentage

### Evidence Categorization
```typescript
- Common Evidence: Evidence present in ALL compared ghosts
- Unique Evidence: Evidence in SOME but not all compared ghosts
- Distinction Score: Ratio of unique to total evidence
```

## User Workflows

### 1. Quick Comparison
1. Open Ghosts tab
2. Tap comparison FAB
3. Search for ghost names (optional)
4. Select 2-3 ghosts using quick-select buttons
5. View comparison in active tab
6. Horizontal scroll to see all columns
7. Switch tabs to explore different aspects

### 2. Evidence Learning
1. Open comparison sheet
2. Select 2-3 similar-looking ghosts
3. Go to Evidence tab
4. Compare common vs unique evidence
5. Use visual cues (color, icons) to identify differences

### 3. Strategy Planning
1. Select 3 challenging ghosts
2. Review Strategies tab
3. Compare counter-approaches
4. Check Equipment tab for optimal loadout
5. Review Abilities tab for unique mechanics

### 4. Ghost Discovery
1. Select a known ghost
2. Add a mystery ghost for comparison
3. Check similarity score
4. Review Basic Stats tab
5. Use evidence tab to learn identifying features

## UI/UX Features

### Visual Design
- **Color Coding:** Difficulty colors for ghost names
- **Icons:** MaterialIcons for visual recognition
- **Glassmorphism:** BlurView effects for modern aesthetic
- **Badges:** Difficulty and category indicators
- **Spacing:** Consistent gaps for readability

### Interactions
- **Haptic Feedback:**
  - Light impact on ghost selection
  - Medium impact on tab changes
  - Warning notification when max ghosts selected
- **Animations:** Smooth transitions between tabs
- **Responsive Layout:** Horizontal scrolling for mobile, multi-column for wider screens

### Accessibility
- **Color Contrast:** Maintains WCAG AA standards
- **Text Sizing:** Minimum 11px for readability
- **Touch Targets:** Minimum 44x44 pt for buttons
- **Labels:** Clear category labels and descriptions
- **Icons + Text:** Both provided for clarity

## Performance Optimizations

### Memoization
```typescript
- comparisonData: useMemo()
  Recalculates only when selectedGhostIds change
  
- filteredGhosts: useMemo()
  Recalculates only when searchText changes
```

### Rendering
- Horizontal ScrollView for layout flexibility
- Lazy rendering of tabs
- Efficient re-renders using keys
- No unnecessary component rerenders

## Customization

### Adding New Comparison Tabs
1. Add tab name to activeTab union type
2. Create new render function (e.g., `renderNewTab()`)
3. Add case to switch statement in `renderTabContent()`
4. Add tab button in tabs container
5. Add styles if needed

### Changing Similarity Algorithm
Modify `calculateSimilarity()` function:
1. Adjust weights object values
2. Implement new comparison logic
3. Ensure result is 0-100 integer
4. Test with various ghost combinations

### Styling Customization
All styles defined in StyleSheet at component bottom:
- Colors: Use `colors` from theme
- Spacing: Update margin/padding values
- Typography: Adjust fontSize/fontWeight
- Borders: Modify borderRadius/borderWidth

## Testing Checklist

### Functionality
- [ ] Select 2 ghosts and view comparison
- [ ] Select 3 ghosts (max) and verify max limit
- [ ] Switch between all 5 tabs
- [ ] Horizontal scroll shows all columns
- [ ] Search filters ghost list correctly
- [ ] Clear search returns all ghosts
- [ ] Remove ghost from selected reverts to selection view
- [ ] FAB opens comparison sheet
- [ ] Close detail sheet properly
- [ ] Similarity score calculates correctly

### UI/UX
- [ ] Layout looks good in light mode
- [ ] Layout looks good in dark mode
- [ ] Text contrast passes accessibility
- [ ] Icons render correctly
- [ ] Colors match theme specification
- [ ] Spacing looks balanced
- [ ] Bottom sheet rounds properly at top
- [ ] FAB appears at correct position with safe areas

### Performance
- [ ] App doesn't lag when selecting ghosts
- [ ] Tab switching is smooth
- [ ] Horizontal scrolling is performant
- [ ] No memory leaks on sheet close/reopen

### Edge Cases
- [ ] Comparing same ghost twice shows 100% similarity
- [ ] Comparing ghosts with no common evidence works
- [ ] Comparing ghosts with same evidence shows high similarity
- [ ] Sheet handles rapid open/close cycles
- [ ] Search handles special characters
- [ ] Long ghost names don't break layout

## Future Enhancements

### Phase 2 Features
1. **Ability Matrix View**
   - Checkbox table of abilities across ghosts
   - Filter by ability type
   - Identify ability overlaps

2. **Similar Ghosts Suggestions**
   - Auto-suggest similar ghosts after comparison
   - Based on similarity algorithm
   - Quick-add to comparison

3. **Export Comparison**
   - Share comparison as image
   - Export to PDF
   - Copy to clipboard

4. **Advanced Filters**
   - Filter by evidence type
   - Filter by difficulty range
   - Filter by hunt sanity threshold

5. **Comparison History**
   - Save favorite comparisons
   - Recently compared ghosts
   - Quick-access shortcuts

### Phase 3 Features
1. **Weighted Comparison**
   - Custom weight selection for factors
   - Personalized similarity scoring
   
2. **3D Model Viewer**
   - Overlay ghost models
   - Animate special abilities
   
3. **Audio Comparison**
   - Ghost sound analysis
   - Sound identification tips

## Troubleshooting

### Issue: Similarity score always 0
**Solution:** Check that ghosts array has at least 2 elements before calculating

### Issue: Horizontal scroll not working
**Solution:** Ensure ScrollView has explicit width set on columns
Verify contentContainerStyle has gap property

### Issue: Tab switching lags
**Solution:** Memoize render functions or implement lazy loading
Check for unnecessary re-renders using React DevTools

### Issue: FAB not visible
**Solution:** Check safe area insets calculation
Verify bottom position isn't being overridden
Check z-index isn't being blocked by other elements

## Files Modified/Created

### Created:
- `components/ghost-comparison-sheet.tsx` - Main comparison sheet component

### Modified:
- `app/(tabs)/ghosts.tsx` - Added FAB button and comparison sheet integration

### Dependencies Used:
- `@gorhom/bottom-sheet` - Detail sheet component
- `expo-blur` - BlurView for glassmorphism
- `expo-haptics` - Haptic feedback
- `@expo/vector-icons/MaterialIcons` - Icon system
- React hooks (useState, useMemo, useCallback)

## Code Examples

### Using in Other Screens
```tsx
import { GhostComparisonSheet } from '@/components/ghost-comparison-sheet';

const [showComparison, setShowComparison] = useState(false);

// In render:
<GhostComparisonSheet 
  isVisible={showComparison} 
  onClose={() => setShowComparison(false)}
/>

// To trigger:
<Button onPress={() => setShowComparison(true)} />
```

### Accessing Selected Ghosts
```tsx
const selectedGhosts = GHOST_LIST.filter(g => 
  selectedGhostIds.includes(g.id)
);
```

### Adding Custom Similarity Logic
```tsx
const customSimilarity = useMemo(() => {
  // Custom calculation based on specific properties
  return calculateCustomSimilarity(comparisonData.ghosts);
}, [comparisonData.ghosts]);
```

## Resources

- [Gorhom BottomSheet Docs](https://gorhom.dev/bottom-sheet/)
- [Expo Blur Documentation](https://docs.expo.dev/versions/latest/sdk/blur/)
- [MaterialIcons Reference](https://fonts.google.com/icons)
- [React Hooks Documentation](https://react.dev/reference/react)
- [React Native ScrollView API](https://reactnative.dev/docs/scrollview)

## Version History

### v1.0 - Initial Release
- Basic 2-3 ghost comparison
- 5 comparison tabs
- Similarity scoring algorithm
- FAB integration in Ghosts tab
- Full documentation

---

**Last Updated:** 2024
**Status:** Production Ready ✅
**Maintained By:** Development Team
