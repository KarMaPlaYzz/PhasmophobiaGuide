# Full App Localization - Phase Breakdown

## Major Categories of Hardcoded English Strings to Translate

### 1. **Ghost Data** (`lib/data/ghosts.ts`)
- 24 ghost names (already have in data-localization.ts)
- 24 ghost descriptions
- All abilities/powers descriptions
- All strengths descriptions  
- All weaknesses descriptions
- All counter strategies
- All identification tips (per ghost)
- Recommended equipment labels

### 2. **Equipment Data** (`lib/data/equipment.ts`)
- 19+ equipment names (already have in data-localization.ts)
- Equipment descriptions
- Equipment usage instructions
- Equipment categories/types
- Equipment tier descriptions
- Recommended uses per equipment
- Tips for each equipment

### 3. **Evidence Data** (`lib/data/evidence.ts` & `evidence-identifier.ts`)
- 7 evidence type names (already in data-localization.ts)
- Evidence descriptions
- Evidence collection tips
- Common mistakes for each evidence
- Difficulty labels
- Rarity labels
- Visual indicators

### 4. **Util/Helper Data**
- Difficulty levels (Easy, Medium, Hard, Expert, Intermediate, Professional, Nightmare)
- Rarity labels (Common, Uncommon, Rare, Very Rare)
- Status labels (Active, Inactive, etc.)
- Speed/Movement descriptions (Normal, Fast, Slow, Variable)
- Activity level descriptions

### 5. **Contract/Mission Data**
- Contract difficulty names (Amateur, Intermediate, Professional, Nightmare)
- Equipment preset names & descriptions
- Strategy descriptions

## Implementation Order

### Phase 1: Extend translations.ts (THIS PHASE)
- Add ghost section with all 24 ghost translations
- Add equipment section with detailed equipment translations
- Add evidence section with detailed evidence translations
- Add difficulty/rarity/status labels
- Add utility strings

### Phase 2: Create Localization Helpers
- Build function to get translated ghost data
- Build function to get translated equipment data
- Build function to get translated evidence data
- Hooks for easy component access

### Phase 3: Update Components
- Modify ghost-detail-sheet to use localized data
- Modify equipment-detail-sheet to use localized data
- Modify evidence screens to use localized data
- Update all text rendering to use t() function

### Phase 4: Validation & Testing
- Test all 8 languages for layout issues
- Verify large translations don't break UI
- Test long German compound words
- Check equipment descriptions fit properly

## File Size Consideration
- translations.ts will grow significantly
- May need to break into separate files if > 1000 lines
- Current structure: ~800 lines, adding ~300-400 more lines
