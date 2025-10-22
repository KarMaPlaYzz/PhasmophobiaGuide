# 🔧 Integration Examples

## Example 1: Add Banner Ads to Home Screen

**File**: `app/(tabs)/index.tsx`

### Current Code:
```tsx
export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        {/* content */}
      </ScrollView>
    </ThemedView>
  );
}
```

### Updated Code:
```tsx
import { AdBanner } from '@/components/ad-banner';  // ADD THIS LINE

export default function HomeScreen() {
  return (
    <>  {/* CHANGE: Wrap in fragment */}
      <ThemedView style={styles.container}>
        <ScrollView>
          {/* content */}
        </ScrollView>
      </ThemedView>
      <AdBanner />  {/* ADD THIS LINE */}
    </>  {/* ADD THIS LINE */}
  );
}
```

**That's it!** 4 lines changed.

---

## Example 2: Add Interstitials to Ghost Viewing

**File**: `app/(tabs)/ghosts.tsx`

### Current Code:
```tsx
import { useLocalization } from '@/hooks/use-localization';

export default function GhostsScreen() {
  const [selectedGhost, setSelectedGhost] = useState<Ghost | null>(null);
  
  return (
    // JSX
  );
}
```

### Updated Code:
```tsx
import { useLocalization } from '@/hooks/use-localization';
import { useInterstitialAds } from '@/hooks/use-interstitial-ads';  // ADD THIS LINE

export default function GhostsScreen() {
  const [selectedGhost, setSelectedGhost] = useState<Ghost | null>(null);
  
  // ADD THESE 2 LINES
  useInterstitialAds(`ghost-view-${selectedGhost?.id}`, 3);  // Show ad every 3 views
  
  return (
    // JSX
  );
}
```

**That's it!** 2 lines added.

---

## Example 3: Show Paywall for Premium Features

**File**: Any screen with premium features (e.g., `components/ghost-comparison-sheet.tsx`)

### Current Code:
```tsx
export const GhostComparisonSheet = ({ ... }) => {
  const handleCompare = () => {
    // Comparison logic
  };
  
  return (
    <Pressable onPress={handleCompare}>
      <Text>Compare</Text>
    </Pressable>
  );
}
```

### Updated Code:
```tsx
import { usePremium } from '@/hooks/use-premium';  // ADD THIS LINE
import { useState } from 'react';  // ADD IF NOT PRESENT

export const GhostComparisonSheet = ({ ... }) => {
  const { isPremium } = usePremium();  // ADD THIS LINE
  const [showPaywall, setShowPaywall] = useState(false);  // ADD THIS LINE
  
  const handleCompare = () => {
    if (isPremium) {  // ADD THESE LINES
      // Comparison logic
    } else {
      setShowPaywall(true);  // Show paywall
    }
  };
  
  return (
    <>  {/* CHANGE: Wrap in fragment if not already */}
      <Pressable onPress={handleCompare}>
        <Text>Compare</Text>
      </Pressable>
      
      {/* ADD THESE LINES - Component is already in root! */}
      {/* The paywall is auto-shown based on the isVisible prop in root layout */}
    </>
  );
}
```

---

## Example 4: Full Screen Integration (Equipment Tab)

**File**: `app/(tabs)/equipments.tsx`

### Show "Before/After" - Free vs Premium

```tsx
import React, { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { AdBanner } from '@/components/ad-banner';  // ADD THIS
import { useInterstitialAds } from '@/hooks/use-interstitial-ads';  // ADD THIS
import { usePremium } from '@/hooks/use-premium';  // ADD THIS

export default function EquipmentScreen() {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  
  // ADD THESE LINES
  const { isPremium } = usePremium();
  useInterstitialAds(`equipment-view-${selectedEquipment?.id}`, 2);
  
  const filteredEquipment = useMemo(() => {
    return EQUIPMENT_LIST.filter((eq) => {
      const matchesSearch = eq.name.toLowerCase().includes(searchText.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || eq.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchText, selectedCategory]);

  return (
    <>  {/* WRAP IN FRAGMENT IF NOT ALREADY */}
      <ThemedView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Search */}
          {/* Category filter */}
          
          {/* Equipment list */}
          {filteredEquipment.map((equipment) => (
            <TouchableOpacity
              key={equipment.id}
              onPress={() => setSelectedEquipment(equipment)}
            >
              {/* Equipment card */}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ThemedView>
      
      {/* ADD THIS LINE - Shows ads for free users */}
      <AdBanner />
    </>
  );
}
```

---

## Example 5: Conditional Features (Evidence Identifier)

**File**: `components/evidence-identifier-sheet.tsx`

### Show Premium Badge or Lock Icon

```tsx
import { Ionicons } from '@expo/vector-icons';
import { usePremium } from '@/hooks/use-premium';  // ADD THIS

export const EvidenceIdentifierSheet = ({ ... }) => {
  const { isPremium } = usePremium();  // ADD THIS
  
  return (
    <BottomSheetScrollView>
      <View style={styles.header}>
        <ThemedText type="title">Evidence Identifier</ThemedText>
        {!isPremium && (  {/* ADD THESE LINES */}
          <View style={[styles.badge, { backgroundColor: colors.tint + '20' }]}>
            <Ionicons name="star" size={14} color={colors.tint} />
            <ThemedText style={{ color: colors.tint, fontSize: 12, fontWeight: '600' }}>
              Premium
            </ThemedText>
          </View>
        )}
      </View>
      
      {/* Evidence selection UI */}
      
      {isPremium ? (  {/* ADD THESE LINES */}
        <ThemedText>Selected: {selectedEvidences.join(', ')}</ThemedText>
      ) : (
        <View style={[styles.lockedView, { backgroundColor: colors.tint + '10' }]}>
          <Ionicons name="lock" size={48} color={colors.tint} />
          <ThemedText type="title">Upgrade to Premium</ThemedText>
          <ThemedText>Unlock the Evidence Identifier tool</ThemedText>
        </View>
      )}
    </BottomSheetScrollView>
  );
}
```

---

## Summary of Changes

### Required Changes: **Minimal** ✅
```
Home Screen:      +4 lines
Ghost Screen:     +2 lines
Equipment Screen: +3 lines
Premium Features: +1 conditional check each

TOTAL: ~15-20 lines across 3-4 screens
TIME: ~30 minutes
```

### Auto-Handled by Infrastructure: ✅
```
✅ Ad initialization
✅ Ad display/hiding
✅ Premium status checking
✅ Error handling
✅ Theme support
✅ Offline support
✅ Purchase event handling
```

---

## Testing Each Integration

### Test Banner Ads:
```tsx
npm start
// Open home screen
// Should see banner ad at bottom
// "Tap here to see the ad" for test ads
```

### Test Interstitials:
```tsx
npm start
// Navigate to ghosts screen 3+ times
// On 3rd navigation, should see full-screen ad
// Close ad to return to app
```

### Test Premium Status:
```tsx
npm start
// Check console: "isPremium: false" initially
// Try to access premium feature
// Should show lock screen or paywall trigger
```

---

## Production Deployment

### Before Building:
```bash
# 1. Add ads to screens (above)
# 2. Get AdMob IDs
# 3. Get IAP product IDs

# 4. Update config files:
# - admobService.ts (lines 23-33)
# - app.json (plugin config)
# - Set USE_TEST_IDS = false
```

### Build Commands:
```bash
# iOS
eas build --platform ios --auto-submit

# Android  
eas build --platform android --auto-submit
```

---

**That's it! You're ready to monetize!** 🎉
