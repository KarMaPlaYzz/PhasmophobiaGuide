# Ghosts.tsx Translation Issues Audit

## Issues Found: 4 Categories

### 1. ❌ Difficulty Filter Labels - NOT TRANSLATED

**Location**: Line 158 in the filter button map
**Current Code**:
```tsx
{diff === 'All' ? t('componentLabels.filterAll') : diff}
```

**Problem**: 
- Only 'All' uses translation via `t('componentLabels.filterAll')`
- 'Beginner', 'Intermediate', 'Advanced', 'Expert' are hardcoded directly
- These need to be translated for each language

**Fix Required**: Use `getDifficultyLabel()` helper function
```tsx
{diff === 'All' ? t('componentLabels.filterAll') : getDifficultyLabel(diff, language)}
```

---

### 2. ❌ Result Counter Plural Form - NOT TRANSLATED

**Location**: Line 171
**Current Code**:
```tsx
<ThemedText style={styles.resultCounter}>
  {filteredGhosts.length} ghost{filteredGhosts.length !== 1 ? 's' : ''}
</ThemedText>
```

**Problem**:
- Hardcoded English plural "ghost/ghosts"
- Other languages have different pluralization rules
- Not translatable

**Fix Required**: Add translation keys
- `tabs.ghosts_resultSingular`: "ghost" → "Gespenst" (DE), "geest" (NL), etc.
- `tabs.ghosts_resultPlural`: "ghosts" → "Gespenster" (DE), "geesten" (NL), etc.

**Updated Code**:
```tsx
<ThemedText style={styles.resultCounter}>
  {filteredGhosts.length} {filteredGhosts.length === 1 ? t('tabs.ghosts_resultSingular') : t('tabs.ghosts_resultPlural')}
</ThemedText>
```

---

### 3. ❌ Evidence Badge Names - NOT TRANSLATED

**Location**: Lines 315-322 in the evidence container
**Current Code**:
```tsx
{ghost.evidence.map((ev) => (
  <View key={ev} style={[styles.evidenceBadge, { backgroundColor: colors.tint + '25' }]}>
    <ThemedText style={styles.evidenceText}>{ev}</ThemedText>
  </View>
))}
```

**Problem**:
- Evidence names like "EMF Level 5", "D.O.T.S. Projector", "Ultraviolet", etc. are displayed directly
- These are NOT using any translation system
- No helper function currently exists to translate evidence names

**Evidence Types Needing Translation**:
1. EMF Level 5
2. D.O.T.S. Projector
3. Ultraviolet
4. Ghost Orb
5. Ghost Writing
6. Spirit Box
7. Freezing Temperatures

**Fix Required**: 
1. Create translation keys for each evidence type (already have descriptions, but not short names)
2. Create helper function `getEvidenceDisplayName(evidenceType, language)`
3. Use helper in component

**Updated Code**:
```tsx
{ghost.evidence.map((ev) => (
  <View key={ev} style={[styles.evidenceBadge, { backgroundColor: colors.tint + '25' }]}>
    <ThemedText style={styles.evidenceText}>{getEvidenceDisplayName(ev, language)}</ThemedText>
  </View>
))}
```

---

### 4. ⚠️ Hardcoded Difficulty Array (Line 47)

**Location**: Line 47
**Current Code**:
```tsx
const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];
```

**Problem**:
- Array of difficulty names is hardcoded in the component
- Should be centralized or translated

**Options**:
1. Keep as is (these are internal values used for filtering - acceptable)
2. Move to a centralized configuration
3. Create a translation-aware getter function

**Status**: Lower priority since these are internal filter values, but the display labels (item 1) are critical

---

## Summary Table

| Issue | Severity | Type | Fix Required |
|-------|----------|------|-------------|
| Difficulty filter labels | 🔴 High | Translation missing | Add getDifficultyLabel() call |
| Result counter plural | 🔴 High | Translation missing | Add translation keys + logic |
| Evidence badge names | 🔴 High | Translation missing | Create evidence name keys + helper |
| Hardcoded difficulty array | 🟡 Medium | Code organization | Keep or refactor (lower priority) |

---

## Translation Keys Needed

### New Keys to Add to translations.ts

```typescript
// Result counter plurals (add to tabs section)
tabs.ghosts_resultSingular: "ghost" / "Gespenst" / "geest" / etc.
tabs.ghosts_resultPlural: "ghosts" / "Gespenster" / "geesten" / etc.

// Evidence type names (add to evidence section if not exists)
evidence.emf: "EMF Level 5"
evidence.dots: "D.O.T.S. Projector"
evidence.ultraviolet: "Ultraviolet"
evidence.orb: "Ghost Orb"
evidence.writing: "Ghost Writing"
evidence.spiritbox: "Spirit Box"
evidence.freezing: "Freezing Temperatures"
```

---

## Components Affected

1. **ghosts.tsx** - Main file with issues
2. **Needs supporting changes**:
   - `lib/localization/translations.ts` - Add evidence type names if not present
   - `lib/localization/types.ts` - Update Translations interface
   - Possibly create new helper function for evidence names

