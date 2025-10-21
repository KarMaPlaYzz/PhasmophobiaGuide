# Ghost Comparison Tool - Comprehensive Implementation Guide

## Overview
A side-by-side comparison tool that allows users to compare up to 3 ghosts simultaneously, viewing their abilities, evidence, strengths/weaknesses, recommended equipment, and identifying similarities.

## Features

### 1. Comparison Selection Interface
- **Multi-select capability**: Users can select 2-3 ghosts from a grid/list
- **Visual layout**: 
  - Search bar to find ghosts quickly
  - Chip/button style ghost selection
  - Clear visual indicators for selected ghosts
  - "Remove" button on each selected ghost chip
- **Constraints**: 
  - Minimum 2 ghosts to compare
  - Maximum 3 ghosts (beyond this becomes too cluttered)
  - Show tooltip: "Select 2-3 ghosts to compare"

### 2. Comparison View - Side-by-Side Layout
```
┌─────────────────────────────────────────────────────────┐
│         GHOST 1         │    GHOST 2     │    GHOST 3    │
├─────────────────────────────────────────────────────────┤
│ [Image/Icon]            │ [Image]        │ [Image]       │
│ Difficulty: Beginner    │ Intermediate   │ Advanced      │
│ Hunt Sanity: 50%        │ 50%            │ 60%           │
│ Movement: Normal        │ Variable       │ Fast          │
│ Activity: High          │ Very High      │ Medium        │
├─────────────────────────────────────────────────────────┤
│          ABILITIES                                       │
├─────────────────────────────────────────────────────────┤
│ • Poltergeist Activity  │ • Levitation   │ • Possession  │
│ • Throws objects        │ • Teleport     │ • Sanity Drain│
│                         │ • No footprints│                │
├─────────────────────────────────────────────────────────┤
│          EVIDENCE                                        │
├─────────────────────────────────────────────────────────┤
│ • EMF Level 5 ✓         │ • EMF Level 5  │ • Spirit Box  │
│ • Spirit Box ✓          │ • Spirit Box   │ • UV Light    │
│ • Ghost Writing ✓       │ • D.O.T.S.     │ • D.O.T.S.    │
├─────────────────────────────────────────────────────────┤
│          STRENGTHS                                       │
├─────────────────────────────────────────────────────────┤
│ • Very active           │ • Can float    │ • More visible│
│                         │ • Avoids salt  │ • Photos work │
└─────────────────────────────────────────────────────────┘
```

### 3. Comparison Sections

#### A. Basic Stats
- Difficulty
- Hunt sanity threshold
- Movement speed
- Activity level
- Description

#### B. Abilities
- Structured comparison with:
  - Ability name
  - Description
  - Mechanical effects

#### C. Evidence
- Show all evidence types
- Color-code common evidence (green highlight)
- Show evidence that separates them (unique to each)

#### D. Strengths & Weaknesses
- Side-by-side comparison
- Highlight common vs. unique attributes
- Visual strength indicators (bars or icons)

#### E. Recommended Equipment
- Essential, recommended, optional, avoid
- Highlight equipment needed by multiple ghosts
- Show cost if comparing equipment tabs

#### F. Counter Strategies
- List effective strategies for each ghost
- Identify universal vs. ghost-specific tactics

#### G. Identification Tips
- Quick tips for identifying each ghost
- Highlight distinguishing features

### 4. Ability Matrix View (Optional Tab)
```
Ability               │ Ghost 1 │ Ghost 2 │ Ghost 3
─────────────────────┼─────────┼─────────┼────────
Can Hunt at 50%      │    ✓    │    ✓    │    ✓
Throws Objects       │    ✓    │    ✗    │    ✗
Affects Sanity       │    ✗    │    ✗    │    ✓
Temperature Drop     │    ✗    │    ✗    │    ✗
```

### 5. Similarity Scoring Algorithm
```
calculateSimilarity(ghost1, ghost2) {
  let score = 0;
  const weights = {
    evidence: 0.3,      // Same evidence types
    abilities: 0.2,     // Similar abilities
    difficulty: 0.2,    // Same difficulty
    activity: 0.15,     // Similar activity level
    equipment: 0.15     // Same equipment recommendations
  };
  
  // Evidence match: shared evidence / total evidence
  score += (sharedEvidence / totalEvidence) * weights.evidence;
  
  // Difficulty exact match
  if (ghost1.difficulty === ghost2.difficulty) {
    score += weights.difficulty;
  }
  
  // Activity level similarity
  const activityMatch = isSimilarActivityLevel(ghost1, ghost2);
  score += activityMatch * weights.activity;
  
  // Equipment overlap
  score += calculateEquipmentOverlap(ghost1, ghost2) * weights.equipment;
  
  return Math.round(score * 100);
}
```

### 6. Similar Ghosts Suggestions
- After comparison, show:
  - "Similar to these ghosts: [Ghost A] (85% match), [Ghost B] (72% match)"
  - Tap to compare with suggested ghost
  - Helps users understand ghost families

### 7. Filter & Sort Options
- **Filter by**:
  - Evidence type
  - Difficulty
  - Ability type
- **Sort by**:
  - Difficulty
  - Activity level
  - Hunt sanity threshold

## Implementation Details

### Component Structure
```
ComparisonScreen/
├── GhostSelectionSheet
│   ├── SearchBar
│   ├── GhostGrid
│   └── SelectedChips
├── ComparisonView
│   ├── TabNavigator
│   ├── BasicStatsTab
│   ├── AbilitiesTab
│   ├── EvidenceTab
│   ├── EquipmentTab
│   ├── StrategiesTab
│   └── AbilityMatrixTab
└── SimilarGhostsCard
```

### Data Structure
```typescript
interface ComparisonData {
  ghosts: Ghost[];
  similarities: {
    score: number;
    commonEvidence: EvidenceType[];
    uniqueEvidence: Map<string, EvidenceType[]>;
    commonAbilities: string[];
  };
}
```

### Navigation Integration
- Add "Compare" button to ghost detail sheet
- Create `(tabs)/ghost-comparison.tsx` or modal
- Pass ghost IDs through navigation params
- Allow pre-selection: `?compare=spirit,wraith,phantom`

### State Management
```typescript
const [selectedGhosts, setSelectedGhosts] = useState<string[]>([]);
const [comparisonData, setComparisonData] = useState<ComparisonData>();

useEffect(() => {
  if (selectedGhosts.length >= 2) {
    const data = calculateComparisonData(selectedGhosts);
    setComparisonData(data);
  }
}, [selectedGhosts]);
```

### Color Coding
- **Evidence matches**: Green highlight
- **Unique evidence**: Neutral/grey
- **Strength indicators**: Orange-to-red gradient
- **Difficulty**: Use existing difficulty colors

### Performance Considerations
- Lazy load comparison data for 3-ghost comparisons
- Memoize similarity calculations
- Virtual scrolling for long evidence/ability lists
- Debounce search input

## User Workflows

### Workflow 1: Quick Comparison
1. User navigates to ghost comparison
2. Searches for "Spirit"
3. Taps Spirit, Wraith, Phantom
4. Sees side-by-side comparison
5. Learns that Spirit and Wraith both have EMF Level 5
6. Learns Phantom is distinguishable by UV Light

### Workflow 2: Counter Strategy Learning
1. User sees new player using Spirit
2. Opens comparison
3. Selects Spirit
4. Compares to 2-3 other ghosts
5. Learns which equipment helps differentiate
6. Reads unique counter strategies for each

### Workflow 3: Discovery
1. User compares two ghosts
2. Sees "Similar ghosts" suggestion
3. Taps suggestion to compare new ghost
4. Learns about ghost family patterns

## UI/UX Considerations

### Mobile Layout (Horizontal Scroll)
- For 3 ghosts on mobile, use horizontal scroll instead of 3 columns
- Snap scroll between ghosts for easy navigation
- Show indicator: "1/3 • 2/3 • 3/3"

### Tablet Layout (Vertical Columns)
- Full 3-column layout for tablets
- Maximizes screen real estate
- Pin header while scrolling content

### Accessibility
- Clear ghost labels above each column
- High contrast for color-coded elements
- Semantic HTML with proper heading hierarchy
- Voice-over support for comparison descriptions

### Empty States
- "Select 2-3 ghosts to start comparing"
- Show ghost grid with selection guidance
- Add preset comparisons: "Compare all Beginner ghosts"

## Testing Checklist
- [ ] Select 2 ghosts - displays correctly
- [ ] Select 3 ghosts - displays correctly
- [ ] Remove ghost - updates comparison
- [ ] Search works - filters ghost list
- [ ] Similarity scoring accurate
- [ ] Scroll doesn't break layout
- [ ] Mobile layout responsive
- [ ] Colors accessible for colorblind users
- [ ] Performance acceptable with 3 ghosts
- [ ] Navigation persists selection during scroll

## Future Enhancements
1. **Export comparisons**: Save as image/PDF
2. **Comparison history**: Remember last 5 comparisons
3. **Advanced filters**: Filter by map difficulty compatibility
4. **Team composition**: Compare what one ghost setup needs vs. another
5. **Hunt comparison**: Show hunt survivability by equipment setup
6. **Ability duration**: Show how long abilities last
