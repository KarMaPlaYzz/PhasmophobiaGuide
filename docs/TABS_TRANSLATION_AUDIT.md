# Tab Translation Audit Report

## Overview
This document details all hardcoded UI strings found in the tab screens (`app/(tabs)/*.tsx`) that need localization.

---

## Summary Statistics
- **Total Tab Files**: 6
  - `ghosts.tsx` ✅ - Has hardcoded strings
  - `equipments.tsx` ✅ - Has hardcoded strings  
  - `evidence.tsx` ✅ - Has hardcoded strings
  - `index.tsx` (Maps) ✅ - Has hardcoded strings
  - `sanity-calculator.tsx` ✅ - Has hardcoded strings
  - `_layout.tsx` ✅ - **COMPLETED** (tab titles now use translations)

---

## Tab 1: `ghosts.tsx` - Ghost Browser

### Hardcoded Strings Found: 7

| Line | Text | Type | Translation Key Needed |
|------|------|------|------------------------|
| 132 | `"Search ghosts..."` | Placeholder | `tabs.ghosts.searchPlaceholder` |
| 279 | `"Speed"` | Label | `tabs.ghosts.speed` |
| 290 | `"Hunt"` | Label | `tabs.ghosts.hunt` |
| 302 | `"Sanity drain:"` | Label | `tabs.ghosts.sanityDrain` |
| 310 | `"Evidence:"` | Label | `tabs.ghosts.evidence` |
| 319 | `"Tap to view details →"` | Help Text | `tabs.ghosts.tapToViewDetails` |
| 323 | `"No ghosts match your search"` | Error Message | `tabs.ghosts.noResults` |

### Context
```tsx
// Line 132
<TextInput
  placeholder="Search ghosts..."  // ← NEEDS TRANSLATION
  
// Line 279
<ThemedText style={styles.statLabel}>Speed</ThemedText>  // ← NEEDS TRANSLATION

// Line 290  
<ThemedText style={styles.statLabel}>Hunt</ThemedText>  // ← NEEDS TRANSLATION

// Line 302
<ThemedText>Sanity drain: {getActivityLabel(ghost.activityLevel, language)}</ThemedText>  // ← "Sanity drain:" NEEDS TRANSLATION

// Line 310
<ThemedText>Evidence:</ThemedText>  // ← NEEDS TRANSLATION

// Line 319
<ThemedText>Tap to view details →</ThemedText>  // ← NEEDS TRANSLATION

// Line 323
<ThemedText>No ghosts match your search</ThemedText>  // ← NEEDS TRANSLATION
```

---

## Tab 2: `equipments.tsx` - Equipment Browser

### Hardcoded Strings Found: 3

| Line | Text | Type | Translation Key Needed |
|------|------|------|------------------------|
| 110 | `"Search equipment..."` | Placeholder | `tabs.equipment.searchPlaceholder` |
| ~155 | `"item"` / `"items"` | Plural Unit | `tabs.equipment.resultCounter` |
| ~245+ | `"Search equipment..."` reference | Placeholder | `tabs.equipment.searchPlaceholder` |

### Context
```tsx
// Line 110
<TextInput
  placeholder="Search equipment..."  // ← NEEDS TRANSLATION
  
// Result counter line
<ThemedText>{filteredEquipment.length} item{filteredEquipment.length !== 1 ? 's' : ''}</ThemedText>
// ← "item" / "items" should be translated
```

---

## Tab 3: `evidence.tsx` - Evidence Identifier

### Hardcoded Strings Found: Multiple (embedded in component)

The evidence tab imports `EvidenceIdentifierSheet` component which was already updated in Phase 7. However, the `evidence.tsx` tab wrapper may have additional UI strings.

### Sections to verify:
- Section titles
- Result labels
- Help text
- Empty state messages

---

## Tab 4: `index.tsx` - Maps Browser

### Hardcoded Strings Found: 3+

| Line | Text | Type | Translation Key Needed |
|------|------|------|------------------------|
| 115 | `"Search maps..."` | Placeholder | `tabs.maps.searchPlaceholder` |
| ~95 | `getSizeLabel()` returns `{ small: 'Small', medium: 'Medium', large: 'Large' }` | Labels | `tabs.maps.sizeSmall`, `tabs.maps.sizeMedium`, `tabs.maps.sizeLarge` |
| ~280+ | Map result counter | Unit | `tabs.maps.resultCounter` |

### Context
```tsx
// Line 115
<TextInput
  placeholder="Search maps..."  // ← NEEDS TRANSLATION

// Line 95-97
const getSizeLabel = (size: string) => {
  const labels = { small: 'Small', medium: 'Medium', large: 'Large' };  // ← NEED TRANSLATION
  return labels[size as keyof typeof labels] || size;
};
```

---

## Tab 5: `sanity-calculator.tsx` - Sanity Calculator

### Hardcoded Strings Found: 8+

| Line | Text | Type | Translation Key Needed |
|------|------|------|------------------------|
| 21-26 | Difficulty labels: `'Amateur'`, `'Intermediate'`, `'Professional'`, `'Nightmare'`, `'Insanity'` | Labels | `tabs.sanity.diffAmateur` through `tabs.sanity.diffInsanity` |
| 28-31 | Map size labels: `'Small'`, `'Medium'`, `'Large'` | Labels | `tabs.sanity.sizeSmall` through `tabs.sanity.sizeLarge` |
| Various | Time format labels and status indicators | Labels | Multiple keys needed |

### Context
```tsx
// Lines 21-26
const DIFFICULTIES: { key: Difficulty; label: string }[] = [
  { key: 'amateur', label: 'Amateur' },  // ← NEEDS TRANSLATION
  { key: 'intermediate', label: 'Intermediate' },  // ← NEEDS TRANSLATION
  { key: 'professional', label: 'Professional' },  // ← NEEDS TRANSLATION
  { key: 'nightmare', label: 'Nightmare' },  // ← NEEDS TRANSLATION
  { key: 'insanity', label: 'Insanity' },  // ← NEEDS TRANSLATION
];

// Lines 28-31
const MAP_SIZES: { key: MapSize; label: string; multiplier: number }[] = [
  { key: 'small', label: 'Small', multiplier: 1.0 },  // ← NEEDS TRANSLATION
  { key: 'medium', label: 'Medium', multiplier: 1.2 },  // ← NEEDS TRANSLATION
  { key: 'large', label: 'Large', multiplier: 1.5 },  // ← NEEDS TRANSLATION
];
```

---

## Tab 6: `_layout.tsx` - Tab Navigation

### Status: ✅ COMPLETED

Tab titles have been updated to use translations:
```tsx
<Tabs.Screen
  name="ghosts"
  options={{ title: t('tabs.ghosts'), ... }}
/>
<Tabs.Screen
  name="equipments"
  options={{ title: t('tabs.equipment'), ... }}
/>
<Tabs.Screen
  name="index"
  options={{ title: '', ... }}  // Home tab kept empty
/>
<Tabs.Screen
  name="evidence"
  options={{ title: t('tabs.evidence'), ... }}
/>
<Tabs.Screen
  name="sanity-calculator"
  options={{ title: t('tabs.sanity'), ... }}
/>
```

---

## Translation Keys Inventory

### New Keys Needed (Organized by section):

#### `tabs.ghosts.*`
```
tabs.ghosts.searchPlaceholder: "Search ghosts..."
tabs.ghosts.speed: "Speed"
tabs.ghosts.hunt: "Hunt"
tabs.ghosts.sanityDrain: "Sanity drain:"
tabs.ghosts.evidence: "Evidence:"
tabs.ghosts.tapToViewDetails: "Tap to view details →"
tabs.ghosts.noResults: "No ghosts match your search"
```

#### `tabs.equipment.*`
```
tabs.equipment.searchPlaceholder: "Search equipment..."
tabs.equipment.resultItem: "item"
tabs.equipment.resultItems: "items"
```

#### `tabs.maps.*`
```
tabs.maps.searchPlaceholder: "Search maps..."
tabs.maps.sizeSmall: "Small"
tabs.maps.sizeMedium: "Medium"
tabs.maps.sizeLarge: "Large"
```

#### `tabs.sanity.*`
```
tabs.sanity.diffAmateur: "Amateur"
tabs.sanity.diffIntermediate: "Intermediate"
tabs.sanity.diffProfessional: "Professional"
tabs.sanity.diffNightmare: "Nightmare"
tabs.sanity.diffInsanity: "Insanity"
tabs.sanity.sizeSmall: "Small"
tabs.sanity.sizeMedium: "Medium"
tabs.sanity.sizeLarge: "Large"
```

---

## Implementation Checklist

### Phase 8a: Add Translation Keys

- [ ] Add all new keys to `lib/localization/types.ts`
- [ ] Add English translations to `lib/localization/translations.ts` (EN section)
- [ ] Add German translations to `lib/localization/translations.ts` (DE section)
- [ ] Add Dutch translations to `lib/localization/translations.ts` (NL section)
- [ ] Add French translations to `lib/localization/translations.ts` (FR section)
- [ ] Add Spanish translations to `lib/localization/translations.ts` (ES section)
- [ ] Add Italian translations to `lib/localization/translations.ts` (IT section)
- [ ] Add Portuguese translations to `lib/localization/translations.ts` (PT section)
- [ ] Add Swedish translations to `lib/localization/translations.ts` (SV section)

### Phase 8b: Update Tab Components

#### `ghosts.tsx`
- [ ] Add `useLocalization` import if not present
- [ ] Extract `t` from `useLocalization()` hook
- [ ] Replace "Search ghosts..." with `t('tabs.ghosts.searchPlaceholder')`
- [ ] Replace "Speed" label with `t('tabs.ghosts.speed')`
- [ ] Replace "Hunt" label with `t('tabs.ghosts.hunt')`
- [ ] Replace "Sanity drain:" with `t('tabs.ghosts.sanityDrain')`
- [ ] Replace "Evidence:" with `t('tabs.ghosts.evidence')`
- [ ] Replace "Tap to view details →" with `t('tabs.ghosts.tapToViewDetails')`
- [ ] Replace "No ghosts match your search" with `t('tabs.ghosts.noResults')`

#### `equipments.tsx`
- [ ] Add `useLocalization` import if not present
- [ ] Extract `t` from `useLocalization()` hook
- [ ] Replace "Search equipment..." with `t('tabs.equipment.searchPlaceholder')`
- [ ] Update result counter to use `t('tabs.equipment.resultItem')` and `t('tabs.equipment.resultItems')`

#### `index.tsx` (Maps)
- [ ] Add `useLocalization` import if not present
- [ ] Extract `t` from `useLocalization()` hook
- [ ] Replace "Search maps..." with `t('tabs.maps.searchPlaceholder')`
- [ ] Update `getSizeLabel()` function to use translation keys

#### `sanity-calculator.tsx`
- [ ] Add `useLocalization` import if not present
- [ ] Extract `t` from `useLocalization()` hook
- [ ] Replace difficulty labels with `t()` calls
- [ ] Replace map size labels with `t()` calls

#### `evidence.tsx`
- [ ] Verify translations are properly used (likely inherits from component)

---

## Notes

1. **Import Pattern**: All tab files need to import `useLocalization` from `@/hooks/use-localization`
2. **Hook Destructuring**: Each component needs `const { t } = useLocalization();` or `const { t, language } = useLocalization();`
3. **Type Safety**: All keys must be defined in `lib/localization/types.ts` first
4. **Language Coverage**: All 8 languages must have matching translations for type safety
5. **Plural Handling**: Consider using a translation system for plural forms (item/items) or handle in component logic

---

## Previous Completions

✅ **Tab Navigation Labels** (Phase 7)
- Updated `app/(tabs)/_layout.tsx` with translated tab titles
- Keys: `tabs.ghosts`, `tabs.equipment`, `tabs.evidence`, `tabs.sanity`

✅ **Evidence Identifier Sheet** (Phase 7)
- Status labels: `evidence.confirmed`, `evidence.investigating`, `evidence.notFound`
- Used in both `EvidenceIdentifierSheet` component and `evidence.tsx` tab

✅ **Equipment Optimizer Sheet** (Phase 7)
- Equipment budget strings: `componentLabels.budget`, `componentLabels.cost`, `componentLabels.budgetLeft`

---

## Next Steps

1. Add all translation keys from inventory to `types.ts`
2. Add English translations
3. Add translations for remaining 7 languages (EN, DE, NL, FR, ES, IT, PT, SV)
4. Update each tab component starting with highest priority (ghosts.tsx, equipments.tsx)
5. Run `get_errors` to verify TypeScript compilation
6. Test on device with different language settings

