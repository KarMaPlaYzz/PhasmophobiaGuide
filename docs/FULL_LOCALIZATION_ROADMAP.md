# Full Data Localization Roadmap & Implementation Strategy

## Executive Summary

This document outlines the complete strategy for localizing all hardcoded game data across 8 languages. The project is being completed in phases to manage complexity.

**Total Scope**: ~1000+ strings across 5 major data categories  
**Languages**: 8 (EN, DE, NL, FR, ES, IT, PT, SV)  
**Current Status**: Phase 2A Complete (24 ghost descriptions) - Phase 2B Starting

---

## Phase Breakdown

### Phase 2: Ghost Data Localization (1000 strings total)

#### 2A: ✅ COMPLETE - Ghost Descriptions (24 strings × 8 languages = 192)
**File**: `/lib/localization/ghost-data.ts`
- All 24 ghost descriptions translated
- Helper: `getGhostDescription(ghostId, language)`
- Status: COMPLETE, no errors

#### 2B: IN PROGRESS - Ghost Abilities, Strengths, Weaknesses, Tips, Strategies

**Estimated strings to translate**:
- Abilities: 50+ (names + descriptions)
- Strengths: 50+ (descriptions + mechanical advantage explanations)
- Weaknesses: 30+ (descriptions + counter explanations)
- Identification Tips: 80+ (3-5 tips per ghost)
- Counter Strategies: 50+ (strategy + tips)
- **Subtotal: ~260 strings**

**Structure**:
```typescript
// ghost-abilities.ts
export const ghostAbilities: Record<string, Record<SupportedLanguage, string>>;
export const getGhostAbility(ghostId: string, abilityName: string, language: SupportedLanguage);

// ghost-strengths.ts
export const ghostStrengths: Record<string, Record<SupportedLanguage, string>>;

// ghost-weaknesses.ts
export const ghostWeaknesses: Record<string, Record<SupportedLanguage, string>>;

// ghost-tips.ts
export const ghostIdentificationTips: Record<string, Record<SupportedLanguage, string[]>>;
export const ghostCounterStrategies: Record<string, Record<SupportedLanguage, string>>;
```

**Timeline**: ~3-4 hours

---

### Phase 3: Equipment Data Localization (~200 strings)

**Current state**: Equipment names already translated in `data-localization.ts`

**Additional needed**:
- Equipment descriptions (19+ items)
- Equipment usage instructions
- Equipment recommendations for each ghost
- Equipment category descriptions
- Setup/preset names and descriptions
- **Total: ~200 strings**

**Files to create**:
- `/lib/localization/equipment-data.ts`

**Helpers**:
```typescript
export const getEquipmentDescription(equipmentId: string, language: SupportedLanguage);
export const getEquipmentUsage(equipmentId: string, language: SupportedLanguage);
export const getEquipmentRecommendation(equipmentId: string, ghostId: string, language: SupportedLanguage);
```

**Timeline**: ~3-4 hours

---

### Phase 4: Evidence Data Localization (~200 strings)

**Scope**: Evidence types and collection guides

**Files to create**:
- `/lib/localization/evidence-data.ts`

**Content**:
- Evidence descriptions (7 evidence types)
- Detection methods (5+ per evidence)
- Evidence collection tips (5+ per evidence)
- Common mistakes (5+ per evidence)
- Visual indicators
- **Total: ~200 strings**

**Helpers**:
```typescript
export const getEvidenceDescription(evidenceId: string, language: SupportedLanguage);
export const getEvidenceDetectionMethod(evidenceId: string, index: number, language: SupportedLanguage);
export const getEvidenceTip(evidenceId: string, index: number, language: SupportedLanguage);
export const getEvidenceCommonMistake(evidenceId: string, index: number, language: SupportedLanguage);
```

**Timeline**: ~3 hours

---

### Phase 5: Utility Labels & Enums (~100 strings)

**Content**:
- Difficulty levels (Amateur, Intermediate, Professional, Nightmare)
- Rarity labels (Common, Uncommon, Rare, Very Rare)
- Status labels (Active, Inactive, Hunting, etc.)
- Movement speeds (Normal, Fast, Slow, Variable)
- Activity levels (Low, Medium, High, Very High)
- Equipment categories (Essential, Recommended, Optional)

**Files to create**:
- `/lib/localization/utility-labels.ts`

**Timeline**: ~1 hour

---

### Phase 6: Maps & Locations Data (~150 strings)

**Content**:
- Map names (already in some form)
- Map descriptions
- Room names per map
- Layout descriptions
- Exit descriptions
- Hazard descriptions
- Difficulty indicators

**Files to create**:
- `/lib/localization/maps-data.ts`

**Timeline**: ~2 hours

---

### Phase 7: Blog & What's New (~100 strings)

**Content**:
- Feature release titles
- Feature descriptions
- Changelog entries
- Upcoming features
- Patch notes

**Files to create**:
- `/lib/localization/whatsnew-data.ts`

**Note**: May require backend support for dynamic blog content

**Timeline**: ~1-2 hours

---

### Phase 8: Component Integration (~500 lines of code changes)

**Changes required**:
1. `ghost-detail-sheet.tsx` - Use localized descriptions, abilities, etc.
2. `equipment-detail-sheet.tsx` - Use localized equipment data
3. `evidence-identifier-sheet.tsx` - Use localized evidence data
4. Various display components
5. Map screens
6. What's new screens

**Per file estimates**: 20-30 lines each

**Timeline**: ~4-5 hours

---

### Phase 9: Testing & Validation (~3 hours)

**Testing checklist**:
- [ ] All 8 languages render correctly
- [ ] No text overflow in UI
- [ ] German compound words fit properly
- [ ] No missing translations (fallback to English)
- [ ] Character encoding correct for all languages
- [ ] Performance acceptable (no lag)
- [ ] Layout doesn't break with longer text
- [ ] RTL languages compatible (if applicable)
- [ ] Punctuation and formatting correct per language

---

## Total Project Scope

| Phase | Content | Strings | Hours | Status |
|-------|---------|---------|-------|--------|
| 2A | Ghost Descriptions | 192 | 1 | ✅ COMPLETE |
| 2B | Ghost Abilities/Tips | 260 | 3-4 | 🔄 IN PROGRESS |
| 3 | Equipment Data | 200 | 3-4 | ⏳ TODO |
| 4 | Evidence Data | 200 | 3 | ⏳ TODO |
| 5 | Utility Labels | 100 | 1 | ⏳ TODO |
| 6 | Maps Data | 150 | 2 | ⏳ TODO |
| 7 | Blog/What's New | 100 | 1-2 | ⏳ TODO |
| 8 | Component Integration | N/A | 4-5 | ⏳ TODO |
| 9 | Testing | N/A | 3 | ⏳ TODO |
| **TOTAL** | **~1200 strings** | **~8 languages** | **20-22** | **0%** |

---

## Architecture Decisions

### Why Separate Files Per Data Type?

1. **Maintainability**: Each file is <300 lines
2. **Modularity**: Can update one type without touching others
3. **Type Safety**: Specific interfaces for each data type
4. **Performance**: Lazy-loading possible per category
5. **Git Diffs**: Easier to review changes

### Translation Storage Strategy

**Option A: All in translations.ts** (Current approach for UI strings)
- Pros: Single source of truth
- Cons: File becomes enormous (3000+ lines)

**Option B: Separate files with category-specific exports** (Recommended for Phase 2+)
- Pros: Organized, scalable, maintainable
- Cons: Requires more imports

**Chosen**: Option B for Phase 2+ (game data), Option A for UI (already working)

### Helper Function Pattern

All data modules follow this pattern:

```typescript
// 1. Data structure
export const ghostAbilities: Record<string, Record<SupportedLanguage, string>>;

// 2. Helper function
export const getGhostAbility = (ghostId: string, language: SupportedLanguage): string => {
  return ghostAbilities[ghostId]?.[language] ?? ghostAbilities[ghostId]?.en ?? '';
};

// 3. Export from localization/index.ts
export { getGhostAbility } from './ghost-data';
```

### Using in Components

```typescript
import { i18n } from '@/lib/localization';
import { getGhostAbility } from '@/lib/localization/ghost-data';

function GhostCard({ ghostId }) {
  const language = i18n.getLanguage();
  const ability = getGhostAbility(ghostId, language);
  return <Text>{ability}</Text>;
}
```

---

## Implementation Order (Recommended)

1. **Phase 2B First** - Maximizes value for ghosts (most viewed content)
2. **Phase 3** - Equipment (second most viewed)
3. **Phase 4** - Evidence (critical for gameplay)
4. **Phase 5** - Utility labels (quick wins)
5. **Phase 6** - Maps (less urgent)
6. **Phase 7** - Blog (nice to have)
7. **Phase 8** - Integration (cross-cutting)
8. **Phase 9** - Testing (final polish)

---

## Quality Assurance

### Translation Guidelines

1. **Consistency**: Use same terms across all phases
2. **Terminology**: 
   - Ghost abilities should match game documentation
   - Equipment names match in-game names
   - Evidence types match game evidence names
3. **Tone**: Professional but accessible
4. **Length**: Consider UI constraints (especially German)

### Layout Considerations

- German translations 20-30% longer than English
- Some UI elements may need redesign for longer text
- Test with max length strings

### Performance

- All data loaded at app start (negligible impact: ~200KB)
- No additional API calls
- Instant language switching
- No runtime translation needed

---

## Deployment Strategy

### Stage 1: Ghost Data (Phase 2-2B)
- Deploy with existing UI translations
- No UI changes needed
- Backward compatible

### Stage 2: All Game Data (Phase 3-7)
- Deploy new helpers alongside existing
- Update components incrementally
- No breaking changes

### Stage 3: Full Integration (Phase 8)
- All components using localized data
- Remove any hardcoded English strings
- Feature complete

### Stage 4: Polish & Release (Phase 9)
- Test all languages
- Fix any UI issues
- Release to production

---

## Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| Missing translations | Fallback to English always available |
| Text overflow | Pre-test all strings with UI |
| Performance | Monitor with React DevTools |
| Inconsistent terminology | Translation glossary per language |
| UI breaks with long text | Responsive design review per phase |

---

## Success Metrics

✅ All 1000+ strings translated to 8 languages  
✅ No compilation errors  
✅ All components render localized content  
✅ No UI breakage with any language  
✅ Language switching instant and transparent  
✅ All tests passing  
✅ Production deployment successful  

---

## Notes

- This roadmap is subject to adjustment based on feedback
- Token budget allows ~15-20 hours of work
- Some tasks may parallelize (e.g., multiple translation files)
- Community feedback on translations encouraged
- Consider user testing with native speakers per language

