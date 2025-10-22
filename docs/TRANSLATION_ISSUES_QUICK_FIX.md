# 🔴 Translation Issues - Quick Reference

## Summary
**Total Issues Found:** 15+ hardcoded strings in components  
**Status:** Most game data IS translated, but UI component labels are NOT

---

## ❌ NOT TRANSLATING (Component Section Titles)

### Ghost Detail Sheet (`ghost-detail-sheet.tsx`)

These titles are **hardcoded English** and do NOT change when user switches language:

```tsx
// Line 197 - HARDCODED
<ThemedText>Description</ThemedText>
↓ Changes to:
"Description" (German: needs "Beschreibung")

// Line 201 - HARDCODED
<ThemedText>Evidence Required</ThemedText>
↓ Changes to:
"Evidence Required" (German: needs "Erforderliche Beweise")

// Line 210 - HARDCODED
<ThemedText>Hunt Sanity Threshold</ThemedText>
↓ Changes to:
"Hunt Sanity Threshold" (German: needs "Jagd-Verstandsschwelle")

// Line 216 - HARDCODED (template string)
<ThemedText>Ghost hunts when sanity drops below {value}%</ThemedText>
↓ Changes to:
"Ghost hunts when sanity drops below 50%" (German: needs translation)

// Line 227 - HARDCODED
<ThemedText>Safe</ThemedText>
↓ Changes to:
"Safe" (German: needs "Sicher")

// Line 228 - HARDCODED  
<ThemedText>Danger</ThemedText>
↓ Changes to:
"Danger" (German: needs "Gefahr")

// Line 255 - HARDCODED
<ThemedText>Special Abilities</ThemedText>
↓ Changes to:
"Special Abilities" (German: needs "Besondere Fähigkeiten")

// Line 299 - HARDCODED
<ThemedText>Strengths</ThemedText>
↓ Changes to:
"Strengths" (German: needs "Stärken")

// Line 312 - HARDCODED
<ThemedText>Weaknesses</ThemedText>
↓ Changes to:
"Weaknesses" (German: needs "Schwächen")

// Line 342 - HARDCODED
<ThemedText>Counter Strategies</ThemedText>
↓ Changes to:
"Counter Strategies" (German: needs "Gegenstrategien")

// Line 414 - HARDCODED
<ThemedText>Recommended Equipment</ThemedText>
↓ Changes to:
"Recommended Equipment" (German: needs "Empfohlene Ausrüstung")

// Line 428 - HARDCODED (with emoji)
<ThemedText>⚠️ MUST BRING</ThemedText>
↓ Changes to:
"⚠️ MUST BRING" (German: needs "⚠️ MITNEHMEN")

// Line 448 - HARDCODED
<ThemedText>Recommended</ThemedText>
↓ Changes to:
"Recommended" (German: needs "Empfohlen")

// Line 468 - HARDCODED
<ThemedText>Optional</ThemedText>
↓ Changes to:
"Optional" (German: needs "Optional")

// Line 488 - HARDCODED
<ThemedText>Avoid</ThemedText>
↓ Changes to:
"Avoid" (German: needs "Vermeiden")
```

### Effectiveness Badges

```tsx
// Somewhere in ghost-detail-sheet.tsx - HARDCODED
const effectivenessText = strategy.effectiveness; // "High" | "Medium" | "Low"
↓ Not translated
"High" (German: needs "Hoch")
"Medium" (German: needs "Mittel")
"Low" (German: needs "Gering")
```

---

## ✅ TRANSLATING CORRECTLY (Already working)

### These ARE properly localized:

```tsx
// Ghost names - ✅ WORKING
getGhostDescription(ghostId, language) 
// Returns: translated description in selected language

// Ghost difficulty - ✅ WORKING  
getDifficultyLabel(difficulty, language)
// Returns: "Anfänger", "Intermediate", etc. based on language

// Ghost names - ✅ WORKING
ghostNames[language][ghostId]
// Returns: translated ghost name
```

---

## 🔍 Testing Current State

### Test 1: Switch to German and open a ghost
**Current behavior (WRONG):**
```
English ✓:
- Description
- Evidence Required  
- Special Abilities
- Strengths & Weaknesses

German ✗ (should translate but doesn't):
- Description  ← Still English!
- Evidence Required ← Still English!
- Special Abilities ← Still English!
- Strengths & Weaknesses ← Still English!
```

**Expected behavior (AFTER FIX):**
```
German ✓:
- Beschreibung
- Erforderliche Beweise
- Besondere Fähigkeiten
- Stärken & Schwächen
```

---

## 📋 Files to Fix

| File | Issue | Severity | Lines |
|------|-------|----------|-------|
| `components/ghost-detail-sheet.tsx` | 15 hardcoded section titles | 🔴 HIGH | 197, 201, 210, 216, 227, 228, 255, 299, 312, 342, 414, 428, 448, 468, 488 |
| `components/equipment-detail-sheet.tsx` | Unknown section titles | 🟡 MEDIUM | Need to check |
| `app/(tabs)/ghosts.tsx` | "All" filter label hardcoded | 🟡 MEDIUM | ~48 |
| `lib/localization/translations.ts` | Missing componentLabels section | 🔴 HIGH | Need to add |

---

## ⚡ Quick Fix (5-10 minutes per component)

### Step 1: Add translations
Edit: `lib/localization/translations.ts`

Add this to each language object (en, de, nl, fr, es, it, pt, sv):

```typescript
// English example
en: {
  // ... existing translations ...
  componentLabels: {
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
    high: 'High',
    medium: 'Medium',
    low: 'Low',
  }
}

// German example
de: {
  // ... existing translations ...
  componentLabels: {
    description: 'Beschreibung',
    evidenceRequired: 'Erforderliche Beweise',
    huntSanityThreshold: 'Jagd-Verstandsschwelle',
    ghostHuntsWhenSanity: 'Geist jagt, wenn der Verstand unter {value}% fällt',
    safe: 'Sicher',
    danger: 'Gefahr',
    specialAbilities: 'Besondere Fähigkeiten',
    strengths: 'Stärken',
    weaknesses: 'Schwächen',
    counterStrategies: 'Gegenstrategien',
    recommendedEquipment: 'Empfohlene Ausrüstung',
    mustBring: '⚠️ MITNEHMEN',
    recommended: 'Empfohlen',
    optional: 'Optional',
    avoid: 'Vermeiden',
    high: 'Hoch',
    medium: 'Mittel',
    low: 'Gering',
  }
}

// ... and repeat for nl, fr, es, it, pt, sv
```

### Step 2: Update component
Edit: `components/ghost-detail-sheet.tsx` Line 197

```typescript
// Add import
import { useLocalization } from '@/hooks/use-localization';

// In component function, add:
const { t } = useLocalization();

// Replace all hardcoded strings:
// Before:
<ThemedText style={styles.sectionTitle}>Description</ThemedText>

// After:
<ThemedText style={styles.sectionTitle}>{t('componentLabels.description')}</ThemedText>
```

### Step 3: Test
1. Open app
2. Tap Settings → Language → German
3. Open a ghost → Labels should now be in German ✓

---

## 🎯 Priority Fixes

1. **ghost-detail-sheet.tsx** → Fix 15 hardcoded titles ← DO THIS FIRST
2. **Add componentLabels translations** → All 8 languages ← DO THIS FIRST  
3. **equipment-detail-sheet.tsx** → Fix section titles
4. **ghosts.tsx** → Fix "All" filter label
5. **effectiveness labels** → Translate High/Medium/Low

---

**Status:** Ready to implement  
**Estimated Time:** 1-2 hours for all fixes  
**Impact:** Will achieve 100% localization across all 8 languages

