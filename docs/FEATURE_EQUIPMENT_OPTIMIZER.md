# Equipment Loadout Optimizer - Comprehensive Implementation Guide

## Overview
An interactive tool that helps players build optimal equipment loadouts based on budget, ghost type, map size, and playstyle. Provides cost-effectiveness analysis and smart recommendations.

## Features

### 1. Loadout Builder Interface
```
┌──────────────────────────────────────────────────┐
│         EQUIPMENT LOADOUT BUILDER                │
├──────────────────────────────────────────────────┤
│ FILTERS:                                         │
│ ┌─ Budget Slider ──────────────────────────────┐ │
│ │ Min: $0          Max: $5000     Current: $800 │ │
│ └──────────────────────────────────────────────┘ │
│                                                  │
│ ┌─ Ghost Type ─────────────────────────────────┐ │
│ │ [Spirit] [Wraith] [Phantom] [Poltergeist]... │ │
│ └──────────────────────────────────────────────┘ │
│                                                  │
│ ┌─ Playstyle ──────────────────────────────────┐ │
│ │ ○ Aggressive (fast hunts)                    │ │
│ │ ○ Defensive (safety focused)                 │ │
│ │ ○ Balanced                                   │ │
│ │ ○ Solo Hunter                                │ │
│ │ ○ Team Coordinator                           │ │
│ └──────────────────────────────────────────────┘ │
│                                                  │
│ ┌─ Map Size ───────────────────────────────────┐ │
│ │ [Small] [Medium] [Large]                     │ │
│ └──────────────────────────────────────────────┘ │
│                                                  │
│ 🔄 GENERATE RECOMMENDATION                      │
└──────────────────────────────────────────────────┘
```

### 2. Recommendation Display
```
┌────────────────────────────────────────────────────┐
│     RECOMMENDED LOADOUT: "Spirit Hunter"           │
├────────────────────────────────────────────────────┤
│ Cost: $320 / $500 Budget | Efficiency: 94%       │
│ Difficulty: Beginner | Map Size: Small/Medium    │
├────────────────────────────────────────────────────┤
│ ESSENTIAL EQUIPMENT (70% of budget):              │
│ ┌───────────────────────────────────────────────┐ │
│ │ ✓ EMF Reader ...................... $45 (89%) │ │
│ │ ✓ Spirit Box ....................... $50 (92%)│ │
│ │ ✓ Ghost Writing Book ............... $40 (85%)│ │
│ │ ✓ UV Light ......................... $35 (88%)│ │
│ │ ✓ Video Camera ..................... $50 (90%)│ │
│ │ ✓ D.O.T.S. Projector .............. $65 (91%)│ │
│ └───────────────────────────────────────────────┘ │
│                                                    │
│ RECOMMENDED EQUIPMENT (20% of budget):            │
│ ┌───────────────────────────────────────────────┐ │
│ │ ✓ Crucifix ........................ $30 (95%) │ │
│ │ ✓ Sanity Medication ............... $20 (92%)│ │
│ │ ✓ Thermometer (upgrade) ........... $30 (87%)│ │
│ └───────────────────────────────────────────────┘ │
│                                                    │
│ OPTIONAL EQUIPMENT (if budget allows):            │
│ ┌───────────────────────────────────────────────┐ │
│ │ ○ Photo Camera ..................... $40      │ │
│ │ ○ Tripod ........................... $25      │ │
│ │ ○ Salt ............................. $15      │ │
│ └───────────────────────────────────────────────┘ │
├────────────────────────────────────────────────────┤
│ ⚙️  WHY THIS LOADOUT:                             │
│ • Covers all 7 evidence types                    │
│ • Balanced offense and defense                   │
│ • Cost-effective for solo/small teams            │
│ • Great for beginner ghosts                      │
│ • Flexible for map sizes                         │
│                                                   │
│ ⚠️  GAPS:                                         │
│ • No Parabolic Microphone (consider for Myling) │ │
│ • Limited firepower protection (1 crucifix)     │ │
│                                                   │
│ 🎯 GHOST MATCHUP:                                │
│ • Spirit: 95% effective (all evidence covered)  │ │
│ • Wraith: 88% effective (lacks salt detection)  │ │
│ • Phantom: 92% effective (all covered)          │ │
│                                                  │
│ 📊 EFFECTIVENESS SCORE: 91/100                   │
│                                                  │
│ [SAVE LOADOUT] [COMPARE BUILDS] [CUSTOMIZE]     │
└────────────────────────────────────────────────────┘
```

### 3. Playstyle Profiles
```
AGGRESSIVE HUNTER
├─ Focus: Evidence gathering speed
├─ Strategy: Quick in/out, minimal prep
├─ Equipment: High-detection gear, minimal safety
├─ Cost allocation: 80% detection, 20% safety
└─ Example build: "Speed Runner"

DEFENSIVE HUNTER
├─ Focus: Hunt survival and safety
├─ Strategy: Prepared for worst case scenario
├─ Equipment: Crucifixes, incense, sanity meds
├─ Cost allocation: 40% detection, 60% safety
└─ Example build: "Tank Support"

BALANCED HUNTER
├─ Focus: Equal evidence and survival
├─ Strategy: Versatile approach
├─ Equipment: Mix of detection and safety
├─ Cost allocation: 60% detection, 40% safety
└─ Example build: "Jack of All Trades"

SOLO HUNTER
├─ Focus: Remote monitoring and safety
├─ Strategy: Stay in truck, minimize risk
├─ Equipment: Cameras, sensors, less field equipment
├─ Cost allocation: 50% detection, 30% cameras, 20% safety
└─ Example build: "Truck Commander"

TEAM COORDINATOR
├─ Focus: Team coverage and equipment sharing
├─ Strategy: Divide specialized roles
├─ Equipment: Specialized gear for each role
├─ Cost allocation: Distributed across team
└─ Example build: "Squad Leader"
```

### 4. Cost-Effectiveness Analysis
```
Cost-Effectiveness Breakdown:

Equipment            │ Cost │ Evidence Types Covered │ Effectiveness
─────────────────────┼──────┼───────────────────────┼──────────────
EMF Reader           │ $45  │ 1 (EMF Level 5)       │ 95%
Spirit Box           │ $50  │ 1 (Spirit Box)        │ 92%
Thermometer          │ $30  │ 1 (Freezing)          │ 85%
Ghost Writing Book   │ $40  │ 1 (Ghost Writing)     │ 88%
UV Light             │ $35  │ 1 (Ultraviolet)       │ 90%
Video Camera         │ $50  │ 2 (Ghost Orb + D.O.T.S)│ 88%
D.O.T.S. Projector   │ $65  │ 1 (D.O.T.S.)          │ 92%

Cost per Evidence Type Covered:
$225 for 7 types = ~$32 per type (baseline)

Optimal efficiency (cost per type covered):
Video Camera: $25/type (best value - covers 2 types)
D.O.T.S.: $65/type
EMF Reader: $45/type
```

### 5. Ghost-Specific Recommendations
**For each selectable ghost:**
- Show optimal equipment
- Highlight must-have items
- Show effectiveness score (0-100%)
- Explain reasoning

**Example - Spirit:**
```
SPIRIT LOADOUT OPTIMIZER
Built-in Ability: Very active, common ghost
Must-Have Equipment:
  ✓ EMF Reader (detects activity spikes)
  ✓ Spirit Box (communication evidence)
  ✓ Ghost Writing Book (reliable evidence)

Recommended for full coverage:
  ✓ UV Light (fingerprint detection)
  ✓ Video Camera (orb/safety)
  ✓ D.O.T.S. Projector (visual confirmation)

Protection Gear:
  ✓ Crucifix (hunt prevention)
  ✓ Sanity Medication (activity management)

Effectiveness: 95% with recommended loadout
```

### 6. Comparison Mode
```
┌─────────────────────────────────────────────────┐
│       BUILD COMPARISON: "Budget vs. Premium"    │
├─────────────────────────────────────────────────┤
│ Budget Build            │ Premium Build         │
│ Cost: $300              │ Cost: $800            │
├─────────────────────────────────────────────────┤
│ EMF Reader              │ EMF Reader (Tier 2)   │
│ Spirit Box              │ Spirit Box (Tier 2)   │
│ Ghost Writing Book      │ Ghost Writing Book    │
│ UV Light                │ UV Light (Tier 2)     │
│ Video Camera            │ Video Camera (Tier 2) │
│ D.O.T.S. Projector      │ D.O.T.S. Projector    │
│                         │ + Parabolic Mic       │
│                         │ + Sound Recorder      │
│                         │ + Motion Sensor       │
│                         │ + Tripod              │
│                         │ + Crucifix x2         │
│                         │ + Sanity Med x2       │
├─────────────────────────────────────────────────┤
│ Effectiveness: 72%      │ Effectiveness: 96%    │
│ Hunt Survivability: 60% │ Hunt Survivability:   │
│ Evidence Speed: 85%     │ Evidence Speed: 95%   │
│                         │ Safety Margin: 90%   │
└─────────────────────────────────────────────────┘
```

### 7. Customization Interface
- **Add equipment**: Browse and add specific items
- **Remove equipment**: Delete items from loadout
- **Swap tiers**: Upgrade/downgrade specific gear
- **Save variant**: Store alternate builds
- **Calculate totals**: Auto-update cost and effectiveness

### 8. Loadout History & Presets
```
SAVED LOADOUTS:
• "Beginner Spirit Killer" - $350, 88% effective
• "Premium All-Rounder" - $1200, 95% effective
• "Solo Tank Support" - $400, 92% effective
• "Team Coordinator" - $600, 94% effective

COMMUNITY PRESETS:
• "Myling Specialist" - $420, 97% for Myling
• "Demon Slayer" - $550, 95% for Demon
• "Budget Beginner" - $250, 78% for all
```

## Implementation Details

### Component Structure
```
EquipmentOptimizerScreen/
├── FilterPanel
│   ├── BudgetSlider
│   ├── GhostTypeSelector
│   ├── PlaystyleSelector
│   └── MapSizeSelector
├── RecommendationCard
│   ├── LoadoutName
│   ├── CostDisplay
│   ├── EfficiencyScore
│   ├── EquipmentCategories
│   ├── AnalysisSection
│   ├── GhostMatchupSection
│   └── ActionButtons
├── ComparisonMode
│   └── SideBySideComparison
└── CustomizationPanel
    ├── EquipmentBrowser
    ├── SelectedLoadout
    └── SaveOptions
```

### Recommendation Algorithm
```typescript
interface LoadoutRecommendation {
  name: string;
  equipment: string[];
  totalCost: number;
  efficiency: number; // 0-100
  explanation: string[];
  gaps: string[];
  ghostMatchup: {
    ghostId: string;
    effectiveness: number; // 0-100
    reason: string;
  }[];
}

function generateLoadout(
  budget: number,
  ghostType: string,
  playstyle: Playstyle,
  mapSize: MapSize
): LoadoutRecommendation {
  
  // 1. Get base equipment for all-evidence coverage
  let loadout = getBaseEquipment(); // ~$330
  
  // 2. Allocate remaining budget by playstyle
  const remaining = budget - calculateCost(loadout);
  const allocation = playstyle.budgetAllocation;
  
  // 3. Add ghost-specific equipment
  const ghostSpecific = getGhostSpecificEquipment(
    ghostType, 
    remaining * allocation.detection
  );
  loadout = [...loadout, ...ghostSpecific];
  
  // 4. Add safety equipment based on playstyle
  const safetyGear = getSafetyEquipment(
    playstyle,
    remaining * allocation.safety
  );
  loadout = [...loadout, ...safetyGear];
  
  // 5. Calculate effectiveness
  const efficiency = calculateEfficiency(loadout, ghostType);
  
  return {
    name: generateLoadoutName(playstyle, ghostType),
    equipment: loadout,
    totalCost: calculateCost(loadout),
    efficiency,
    explanation: generateExplanation(loadout),
    gaps: identifyGaps(loadout, ghostType),
    ghostMatchup: calculateMatchup(loadout)
  };
}
```

### Data Structure
```typescript
interface PlaystyleProfile {
  id: Playstyle;
  name: string;
  description: string;
  budgetAllocation: {
    detection: number;    // 0-1
    safety: number;       // 0-1
    utility: number;      // 0-1
  };
  priorityEquipment: string[];
  avoidEquipment: string[];
}

interface LoadoutBuild {
  id: string;
  name: string;
  description: string;
  playstyle: Playstyle;
  difficulty: Difficulty;
  mapSize?: MapSize;
  ghostType?: string;
  equipment: string[];
  totalCost: number;
  efficiency: number;
  savedAt: number;
  tags: string[];
}
```

### Navigation Integration
- Add "Optimize Equipment" button to equipment screen
- Create `(tabs)/equipment-optimizer.tsx`
- Allow sharing loadout: `?loadout=beginner-spirit-killer`
- Deep link to equipment details from recommendation

### Performance Optimization
- Memoize recommendation calculations
- Lazy load ghost matchup data
- Debounce filter changes
- Cache previous recommendations

## User Workflows

### Workflow 1: New Player Building First Loadout
1. Opens Equipment Optimizer
2. Sets budget to $500 (starting money)
3. Selects "Balanced" playstyle
4. Gets recommendation: "Beginner Starter"
5. Views equipment breakdown
6. Sees all 7 evidence types covered
7. Buys recommended equipment

### Workflow 2: Advanced Player Specializing
1. Opens optimizer
2. Selects "Myling" ghost
3. Sets budget to $800
4. Selects "Aggressive" playstyle
5. Gets: "Myling Audio Specialist"
6. Includes Parabolic Microphone + Sound Recorder
7. Shows 97% effectiveness for Myling
8. Compares to "Jack of All Trades" build
9. Decides based on effectiveness

### Workflow 3: Team Coordinator
1. Opens optimizer
2. Sets budget to $3000 (5-person team fund)
3. Selects "Team Coordinator" playstyle
4. Generates loadout
5. Divides equipment across team members
6. Each member gets specialized role
7. Team purchases equipment together

### Workflow 4: Budget Conscious
1. Opens optimizer
2. Sets budget to $200
3. Selects any ghost
4. Gets "Budget Beginner" recommendation
5. Shows ~78% effectiveness
6. Explains what's missing
7. Gets upsell paths to better loadouts

## UI/UX Considerations

### Visual Hierarchy
- Budget slider most prominent (primary choice)
- Playstyle as secondary
- Ghost type as optional refinement

### Color Coding
- **Essential equipment**: Green
- **Recommended equipment**: Blue
- **Optional equipment**: Grey
- **Cost per piece**: Shows value/cost ratio

### Accessibility
- All sliders keyboard accessible
- Clear labels for all filters
- High contrast for cost displays
- Semantic pricing: "$40-50 range" not just "$45"

### Mobile-First Design
- Stackable filter sections
- Swipeable equipment carousel
- Collapsible categories
- Tap-to-expand for details

### Empty States
- "Set filters to see recommendations"
- Show example loadouts
- Suggest starting points

## Testing Checklist
- [ ] Budget slider affects recommendations
- [ ] Playstyle changes equipment allocation
- [ ] Ghost type recommendations accurate
- [ ] Cost calculations correct
- [ ] Effectiveness scoring reasonable
- [ ] Comparison side-by-side clear
- [ ] Mobile layout responsive
- [ ] Filter combinations work
- [ ] Saved loadouts persist
- [ ] Navigation deep links work
- [ ] Performance acceptable with all filters

## Future Enhancements
1. **Difficulty scaling**: Adjust recommendations for Professional+
2. **Team mode**: Build loadouts for 4-person squads
3. **Map-specific**: Optimize for specific map hazards
4. **Hunt optimization**: Equipment choices for hunt evasion
5. **Cost calculator**: Show earning path to afford builds
6. **Tier progression**: Suggest tier upgrades as player levels
7. **Challenge mode**: Special equipment recommendations
8. **Community sharing**: Export and share builds with codes
9. **Success rate tracking**: Learn from user success data
10. **Streaming support**: Share current loadout with viewers
