# Implementing Clickable Equipment in Ghost Detail Sheet

## Overview
Make all equipment names in the ghost detail sheet clickable, allowing users to tap on equipment to navigate to the equipment tab and view full details.

## Implementation Steps

### Step 1: Update Equipment Display in Ghost Detail Sheet

**Location**: `components/ghost-detail-sheet.tsx`

In the "Recommended Equipment" section, replace simple text displays with clickable components:

**Current (Example from lines 270-290):**
```tsx
{ghost.recommendedEquipment.essential.map((item, idx) => (
  <View key={idx} style={[styles.equipmentItem, {...}]}>
    <Ionicons name="checkmark-circle" size={16} color="#FF1744" />
    <ThemedText style={[styles.equipmentItemText, {...}]}>{item}</ThemedText>
  </View>
))}
```

**Updated to:**
```tsx
{ghost.recommendedEquipment.essential.map((item, idx) => (
  <Pressable
    key={idx}
    onPress={() => navigateToEquipment(item)}
    style={[styles.equipmentItem, { ...styles.equipmentItemClickable }]}
  >
    <Ionicons name="checkmark-circle" size={16} color="#FF1744" />
    <ThemedText style={[styles.equipmentItemText, { ...}]}>{item}</ThemedText>
    <Ionicons name="open-outline" size={14} color="#FF1744" style={{ marginLeft: 'auto' }} />
  </Pressable>
))}
```

### Step 2: Add Navigation Function

Add this function to `ghost-detail-sheet.tsx`:

```typescript
const navigateToEquipment = (equipmentName: string) => {
  // Find the equipment in the database
  const equipment = Object.values(ALL_EQUIPMENT).find(
    (item) => item?.name === equipmentName
  );

  if (equipment) {
    // Get the tab navigation
    const navigationState = navigation.getState();
    
    // Navigate to the equipment tab
    navigation.navigate('(tabs)', {
      screen: 'equipments',
      params: { 
        selectedEquipmentId: equipment.id,
        scrollToEquipment: true 
      },
    });

    // Emit event to close this detail sheet
    detailSheetEmitter.emit('close');
  }
};
```

### Step 3: Import Required Dependencies

Add to imports at top of `ghost-detail-sheet.tsx`:

```typescript
import { ALL_EQUIPMENT } from '@/lib/data/equipment';
import { Equipment } from '@/lib/types';
import { useNavigation } from '@react-navigation/native';
```

And add to component props:

```typescript
const navigation = useNavigation<any>();
```

### Step 4: Update Equipment Item Styling

Add new styles to the `styles` StyleSheet at bottom of file:

```typescript
equipmentItemClickable: {
  pressOpacity: 0.7,
  // Will highlight on press
},
equipmentItemPressable: {
  opacity: 1,
},
equipmentItemPressed: {
  backgroundColor: 'rgba(255, 23, 68, 0.15)',
},
```

### Step 5: Add Active State Tracking

For better UX, track which equipment item is being pressed:

```typescript
const [pressedEquipmentId, setPressedEquipmentId] = useState<string | null>(null);

const handleEquipmentPress = (equipmentName: string) => {
  setPressedEquipmentId(equipmentName);
  
  // Haptic feedback
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  
  // Navigate after brief delay for visual feedback
  setTimeout(() => {
    navigateToEquipment(equipmentName);
    setPressedEquipmentId(null);
  }, 100);
};
```

### Step 6: Update All Equipment List Rendering

Apply the same `Pressable` wrapper to:
- Essential equipment list
- Recommended equipment list
- Optional equipment list
- Avoid equipment list

Each with appropriate styling and navigation.

### Step 7: Abilities Section Enhancement (Optional)

Also make equipment mentioned in ability descriptions clickable:

```typescript
// For each ability effect string that mentions equipment
const renderAbilityEffects = (effects: string[]) => {
  return effects.map((effect, idx) => {
    // Check if effect mentions any equipment
    const equipment = Object.values(ALL_EQUIPMENT).find(
      (eq) => effect.includes(eq.name)
    );
    
    if (equipment) {
      // Render with clickable equipment name
      const parts = effect.split(equipment.name);
      return (
        <View key={idx} style={styles.effectsList}>
          <ThemedText>{parts[0]}</ThemedText>
          <Pressable onPress={() => navigateToEquipment(equipment.name)}>
            <ThemedText style={{ color: colors.spectral, fontWeight: '600' }}>
              {equipment.name} →
            </ThemedText>
          </Pressable>
          <ThemedText>{parts[1]}</ThemedText>
        </View>
      );
    }
    
    return (
      <ThemedText key={idx} style={styles.effectsText}>{effect}</ThemedText>
    );
  });
};
```

### Step 8: Add Tooltip/Hint (Optional)

For better UX, show a hint that equipment is clickable:

```typescript
<View style={styles.equipmentHint}>
  <Ionicons name="information-circle-outline" size={14} color={colors.text} />
  <ThemedText style={styles.equipmentHintText}>
    Tap any equipment to view details
  </ThemedText>
</View>
```

### Step 9: Test All Scenarios

1. **Basic Navigation**: Tap essential equipment → navigates to Equipment tab
2. **Visual Feedback**: Equipment highlights when pressed
3. **Sheet Closes**: Detail sheet closes after navigation
4. **Deep Linking**: Equipment loads with correct info displayed
5. **Error Handling**: Unknown equipment name doesn't crash
6. **Multiple Sections**: Equipment in different categories all clickable
7. **Mobile Responsive**: Touch targets are large enough (min 44x44 pt)

### Step 10: Equipment Tab Integration

In `app/(tabs)/equipments.tsx`, handle the incoming parameter:

```typescript
const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | null>(null);

// Get from navigation params
useEffect(() => {
  const unsubscribe = navigation.addListener('focus', () => {
    const params = route.params as any;
    if (params?.selectedEquipmentId) {
      setSelectedEquipmentId(params.selectedEquipmentId);
      
      // Optionally scroll to or highlight this equipment
      if (params?.scrollToEquipment) {
        // Scroll to this equipment in list
        setTimeout(() => {
          // Find equipment in list and scroll to it
          const equipment = ALL_EQUIPMENT[params.selectedEquipmentId];
          if (equipment) {
            openEquipmentDetail(equipment);
          }
        }, 100);
      }
    }
  });

  return unsubscribe;
}, [navigation, route]);
```

## Visual Design

### Before (Current)
```
⚠️ MUST BRING
✓ EMF Reader
✓ Spirit Box
✓ Ghost Writing Book
```

### After (Clickable)
```
⚠️ MUST BRING
✓ EMF Reader →  [highlighted on press]
✓ Spirit Box →
✓ Ghost Writing Book →
```

### Hover/Press States
- **Default**: Normal styling
- **Pressed**: Slight opacity change + highlight color
- **Navigation**: Brief animation transition

## Accessibility Considerations

1. **Keyboard Navigation**: All equipment items focusable via keyboard
2. **VoiceOver**: "EMF Reader, button, tap to view details"
3. **Screen Reader**: "Equipment name, link to equipment tab"
4. **Touch Target**: Minimum 44x44 points
5. **Color**: Not sole indicator of interactivity (includes → arrow)

## Performance Notes

- Equipment lookup is O(n) but n is small (~40 items)
- Can memoize if performance needed: `useMemo(() => ALL_EQUIPMENT)`
- Navigation happens after sheet closes (good UX)

## Code References

### Files to Modify
- `components/ghost-detail-sheet.tsx` - Main changes
- `app/(tabs)/equipments.tsx` - Handle incoming params
- `lib/data/equipment.ts` - Already has ALL_EQUIPMENT exported

### Files to Create
- `components/clickable-equipment.tsx` - Reusable component (optional)

## Testing Checklist

- [ ] Tap equipment in "Must Bring" section → navigates
- [ ] Tap equipment in "Recommended" section → navigates
- [ ] Tap equipment in "Optional" section → navigates
- [ ] Tap equipment in "Avoid" section → navigates
- [ ] Visual feedback on press (opacity/highlight)
- [ ] Detail sheet closes after navigation
- [ ] Equipment tab opens with correct item highlighted
- [ ] Equipment details display correctly
- [ ] Works on both light and dark themes
- [ ] Mobile touch targets are large enough
- [ ] No crash if equipment not found
- [ ] Can navigate back to ghost (and detail sheet still works)
- [ ] Haptic feedback plays on tap
- [ ] Keyboard navigation works

## Future Enhancements

1. **Tooltip**: "Click to view details" on hover (Web/Desktop)
2. **Equipment Comparison**: Quick compare view without leaving ghost
3. **Cost Display**: Show equipment cost inline
4. **Availability**: Show if equipment is unlocked for user level
5. **Quick Add**: "Add to loadout" button in mini popup
6. **Ghost-Specific**: Highlight which equipment is most effective
7. **Deep Link**: Support `app://ghost/spirit?equipment=emf-reader`

## Implementation Time Estimate

- **Basic Version**: 1-2 hours
- **With Polish & Testing**: 2-3 hours
- **With Enhancements**: 4-5 hours

## Related Features

This feature complements:
- **Equipment Loadout Optimizer**: Users can quickly compare equipment
- **Equipment Tab**: Accessed directly from ghost profiles
- **Ghost Comparison**: See equipment overlaps between ghosts
