# 🔍 Hardcoded Values Audit & Localization Report

**Date:** October 22, 2025  
**Project:** Phasmophobia Guide (React Native App)  
**Status:** ⚠️ **ISSUES FOUND - See Details Below**

---

## 📋 Executive Summary

This audit identifies **hardcoded English strings** across the app that are **NOT properly localized** or are **partially localized**. The app has a comprehensive localization system in place, but several UI components still contain hardcoded section titles and labels that need translation.

### Key Findings:
- ✅ **App translations:** Fully localized (100+ strings × 8 languages)
- ✅ **Ghost data:** Fully localized (descriptions, abilities, etc.)
- ✅ **Equipment data:** Names localized, but descriptions still hardcoded in English
- ⚠️ **Component section titles:** Multiple hardcoded strings found
- ⚠️ **Status labels:** Some labels hardcoded (Safe, Danger, MUST BRING, etc.)

---

## 🚨 Critical Issues Found

### 1. **Ghost Detail Sheet** (`components/ghost-detail-sheet.tsx`)

#### Hardcoded Section Titles (NOT LOCALIZED):

| Line | Text | Status | Languages Missing |
|------|------|--------|-------------------|
| 197 | `"Description"` | ❌ Hardcoded | 7 languages |
| 201 | `"Evidence Required"` | ❌ Hardcoded | 7 languages |
| 210 | `"Hunt Sanity Threshold"` | ❌ Hardcoded | 7 languages |
| 216 | `"Ghost hunts when sanity drops below {value}%"` | ❌ Hardcoded | 7 languages |
| 227 | `"Safe"` | ❌ Hardcoded | 7 languages |
| 228 | `"Danger"` | ❌ Hardcoded | 7 languages |
| 255 | `"Special Abilities"` | ❌ Hardcoded | 7 languages |
| 299 | `"Strengths"` | ❌ Hardcoded | 7 languages |
| 312 | `"Weaknesses"` | ❌ Hardcoded | 7 languages |
| 342 | `"Counter Strategies"` | ❌ Hardcoded | 7 languages |
| 414 | `"Recommended Equipment"` | ❌ Hardcoded | 7 languages |
| 428 | `"⚠️ MUST BRING"` | ❌ Hardcoded | 7 languages |
| 448 | `"Recommended"` | ❌ Hardcoded | 7 languages |
| 468 | `"Optional"` | ❌ Hardcoded | 7 languages |
| 488 | `"Avoid"` | ❌ Hardcoded | 7 languages |
| N/A | Effectiveness badges (`"High"`, `"Medium"`, `"Low"`) | ❌ Hardcoded | 7 languages |

**Impact:** When user switches to German, Dutch, French, Spanish, Italian, Portuguese, or Swedish, these UI labels remain in English.

---

### 2. **Ghost List Screen** (`app/(tabs)/ghosts.tsx`)

#### Hardcoded Values:

| Line | Text | Current Status | Issue |
|------|------|----------------|-------|
| 48 | `"All"` (difficulty filter) | ❌ Hardcoded | Not in translations |
| 49-52 | `"Beginner"`, `"Intermediate"`, `"Advanced"`, `"Expert"` | ✅ Has `getDifficultyLabel()` | Working, but check consistency |

**Impact:** The "All" filter label is hardcoded English.

---

### 3. **Equipment Detail Sheet** (`components/equipment-detail-sheet.tsx`)

#### Hardcoded Section Titles:

| Line | Text | Status | Languages Missing |
|------|------|--------|-------------------|
| ? | `"Tiers"` | ❌ Needs check | 7 languages |
| ? | `"Evidence"` | ❌ Needs check | 7 languages |
| ? | `"Synergies"` | ❌ Needs check | 7 languages |
| ? | `"Recommended"` | ❌ Needs check | 7 languages |

**Note:** Equipment detail sheet section headers not yet reviewed in full.

---

### 4. **Static Text in Ghost/Equipment Data** 

#### Ghost Data (`lib/data/ghosts.ts`):

All ghost descriptions, abilities, strengths, weaknesses, etc., are **hardcoded in English**.

Example (Spirit ghost):
```typescript
description: 'Spirits are the most commonly encountered ghosts. They are very active...',
```

**Status:** ✅ Localized via `ghost-data.ts` and `ghost-abilities.ts`

#### Equipment Data (`lib/data/equipment.ts`):

Equipment descriptions and usage instructions are **hardcoded in English**.

Example (EMF Reader):
```typescript
description: 'A device that detects electromagnetic fields. Used to locate...',
usage: 'Hold in hand and watch for spikes...',
```

**Status:** ⚠️ **PARTIALLY localized** - Names are translated, but descriptions stored in data file are still English. Need to use localization helpers or move to localization files.

---

## 📊 Localization Coverage Summary

| Category | Covered | Missing | Status |
|----------|---------|---------|--------|
| **UI Translations** (`translations.ts`) | ~150+ strings | Section titles in components | ✅ Good |
| **Ghost Names** (`data-localization.ts`) | 24 ghosts × 8 languages | — | ✅ Complete |
| **Ghost Data** (`ghost-data.ts`) | Descriptions × 8 languages | — | ✅ Complete |
| **Ghost Abilities** (`ghost-abilities.ts`) | Abilities × 8 languages | — | ✅ Complete |
| **Equipment Names** (`data-localization.ts`) | ~35 items × 8 languages | — | ✅ Complete |
| **Equipment Data** (`lib/data/equipment.ts`) | English only | Descriptions × 8 languages | ⚠️ Missing |
| **Evidence Names** (`data-localization.ts`) | 7 evidence × 8 languages | — | ✅ Complete |
| **Component Section Titles** | Not tracked | 15+ titles | ❌ Missing |
| **Status Labels** | Partial | "Safe", "Danger", effectiveness labels | ⚠️ Partial |

---

## 🔧 Components Needing Updates

### Priority 1 - Critical (User-facing, affects multiple languages):

1. **`ghost-detail-sheet.tsx`** (15+ hardcoded section titles)
   - Lines: 197, 201, 210, 216, 227, 228, 255, 299, 312, 342, 414, 428, 448, 468, 488
   - Affects: All 8 languages when non-English is selected

2. **`equipment-detail-sheet.tsx`** (4+ section titles)
   - Likely similar issues to ghost-detail-sheet

### Priority 2 - Medium (Filter labels, status indicators):

3. **`ghosts.tsx`** (Line ~48: "All" filter label)
   - Missing translation

4. **Status indicator texts** (Safe, Danger, effectiveness levels)
   - May be in `ghost-detail-sheet.tsx` or shared utilities

### Priority 3 - Low (Data files, descriptions):

5. **`equipment.ts`** (Descriptions and usage strings)
   - Currently in English only
   - Solution: Move to `equipment-data.ts` or create `equipment-localization.ts`

---

## 💡 Recommended Fixes

### Fix 1: Add Missing UI Translations

**File:** `lib/localization/translations.ts`

Add new section for component labels:

```typescript
// Component UI Labels
componentLabels: {
  // Ghost Detail Sheet
  description: 'Description',
  evidenceRequired: 'Evidence Required',
  huntSanityThreshold: 'Hunt Sanity Threshold',
  ghostHuntsWhenSanity: 'Ghost hunts when sanity drops below {value}%',
  safe: 'Safe',
  danger: 'Danger',
  specialAbilities: 'Special Abilities',
  strengths: 'Strengths',
  weaknesses: 'Weaknesses',
  counterStrategies: 'Counter Strategies',
  recommendedEquipment: 'Recommended Equipment',
  mustBring: '⚠️ MUST BRING',
  recommended: 'Recommended',
  optional: 'Optional',
  avoid: 'Avoid',
  
  // Effectiveness levels
  high: 'High',
  medium: 'Medium',
  low: 'Low',
  
  // Equipment Detail Sheet
  tiers: 'Tiers',
  evidence: 'Evidence',
  synergies: 'Synergies',
  
  // Ghost List
  filterAll: 'All',
}
```

Add translations for **all 8 languages** (de, nl, fr, es, it, pt, sv).

### Fix 2: Update Components to Use Translations

**Example - `ghost-detail-sheet.tsx` Line 197:**

**Before:**
```tsx
<ThemedText style={styles.sectionTitle}>Description</ThemedText>
```

**After:**
```tsx
import { useLocalization } from '@/hooks/use-localization';

// In component:
const { t } = useLocalization();

<ThemedText style={styles.sectionTitle}>{t('componentLabels.description')}</ThemedText>
```

### Fix 3: Move Equipment Descriptions to Localization

**Create file:** `lib/localization/equipment-localization.ts`

Move descriptions from `equipment.ts` to localization file with translations.

### Fix 4: Update Ghost List Component

**File:** `app/(tabs)/ghosts.tsx` Line 48

**Before:**
```tsx
const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];
```

**After:**
```tsx
const { t } = useLocalization();

const difficulties = useMemo(() => [
  { label: t('componentLabels.filterAll'), value: 'All' },
  { label: t('common.difficulty.beginner'), value: 'Beginner' },
  { label: t('common.difficulty.intermediate'), value: 'Intermediate' },
  { label: t('common.difficulty.advanced'), value: 'Advanced' },
  { label: t('common.difficulty.expert'), value: 'Expert' },
], [t]);
```

---

## ✅ Translation Checklist

### To achieve 100% localization, complete these steps:

- [ ] **Step 1:** Add `componentLabels` object to `translations.ts`
- [ ] **Step 2:** Translate `componentLabels` to all 8 languages (de, nl, fr, es, it, pt, sv)
- [ ] **Step 3:** Update `ghost-detail-sheet.tsx` to use `t()` for all 15 hardcoded titles
- [ ] **Step 4:** Update `equipment-detail-sheet.tsx` to use `t()` for section titles
- [ ] **Step 5:** Update `ghosts.tsx` to use `t()` for "All" filter label
- [ ] **Step 6:** Update effectiveness labels to use translations (High, Medium, Low)
- [ ] **Step 7:** Test all 8 languages in Settings → Language
- [ ] **Step 8:** Verify no console warnings about missing translations
- [ ] **Step 9:** Check for overflow/layout issues with longer translations
- [ ] **Step 10:** Document final status in `LOCALIZATION_COMPLETE.md`

---

## 📝 Testing Guide

### Manual Testing Steps:

1. **Open app** and navigate to **Settings → Language**
2. **Change language to German** (Deutsch)
3. **Go to Ghosts tab** and tap a ghost to open detail sheet
4. **Verify all labels appear in German:**
   - ✓ "Description" → "Beschreibung"
   - ✓ "Special Abilities" → "Besondere Fähigkeiten"
   - ✓ "Strengths & Weaknesses" → "Stärken & Schwächen"
   - etc.
5. **Repeat for all 8 languages**
6. **Check console** for missing translation warnings
7. **Test layout** with longer translations (German is longest)

### Automated Testing:

```typescript
// Test: All componentLabels exist in all languages
const languages = ['en', 'de', 'nl', 'fr', 'es', 'it', 'pt', 'sv'];
const paths = [
  'componentLabels.description',
  'componentLabels.specialAbilities',
  'componentLabels.strengths',
  // ... all 15+
];

for (const lang of languages) {
  for (const path of paths) {
    const value = i18n.getTranslation(lang, path);
    expect(value).toBeDefined();
    expect(value).not.toEqual(path); // Ensure not fallback key
  }
}
```

---

## 📚 Related Documentation

- **Localization System:** [docs/LOCALIZATION.md](./LOCALIZATION.md)
- **Quick Reference:** [docs/LOCALIZATION_QUICK_REFERENCE.md](./LOCALIZATION_QUICK_REFERENCE.md)
- **Status:** [LOCALIZATION_COMPLETE.md](../LOCALIZATION_COMPLETE.md)

---

## 🎯 Next Steps

1. **Review this audit** with the team
2. **Prioritize fixes** (Priority 1 > Priority 2 > Priority 3)
3. **Assign tasks** to implement each fix
4. **Test thoroughly** using the testing guide above
5. **Deploy** when all issues resolved

---

## 📞 Questions?

Refer to:
- **Localization guide:** See [LOCALIZATION.md](./LOCALIZATION.md) for implementation details
- **Type definitions:** Check `lib/localization/types.ts` for the Translations interface
- **Current system:** Review `hooks/use-localization.ts` to understand how `t()` function works

---

**Report Generated:** October 22, 2025  
**Last Updated:** October 22, 2025  
**Severity Level:** 🟡 **Medium** (UI labels remain English, but game data is translated)
