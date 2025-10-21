# Evidence Identification Tool - Comprehensive Implementation Guide

## Overview
An interactive ghost identifier that allows players to collect evidence as they investigate, with real-time ghost filtering, confidence scoring, and equipment recommendations based on collected evidence.

## Features

### 1. Main Identification Interface
```
┌────────────────────────────────────────────────────┐
│     GHOST IDENTIFIER - Evidence Collector         │
├────────────────────────────────────────────────────┤
│ CONTRACT: 6 Tanglewood Drive | Time: 24:35        │
├────────────────────────────────────────────────────┤
│ COLLECT EVIDENCE:                                 │
│ ┌─ EMF Level 5 ──────────────────────────────────┐│
│ │ □ Not Found    ◐ Investigating    ✓ Confirmed  ││
│ │ Equipment: EMF Reader                          ││
│ │ Difficulty: Easy                               ││
│ └────────────────────────────────────────────────┘│
│                                                    │
│ ┌─ D.O.T.S. Projector ───────────────────────────┐│
│ │ □ Not Found    ◐ Investigating    ✓ Confirmed  ││
│ │ Equipment: D.O.T.S. Projector, Video Camera    ││
│ │ Difficulty: Easy                               ││
│ └────────────────────────────────────────────────┘│
│                                                    │
│ ┌─ Ultraviolet ──────────────────────────────────┐│
│ │ □ Not Found    ◐ Investigating    ✓ Confirmed  ││
│ │ Equipment: UV Light, Salt                      ││
│ │ Difficulty: Medium                             ││
│ └────────────────────────────────────────────────┘│
│                                                    │
│ ┌─ Ghost Orb ────────────────────────────────────┐│
│ │ □ Not Found    ◐ Investigating    ✓ Confirmed  ││
│ │ Equipment: Video Camera                        ││
│ │ Difficulty: Medium                             ││
│ └────────────────────────────────────────────────┘│
│                                                    │
│ ┌─ Ghost Writing ────────────────────────────────┐│
│ │ □ Not Found    ◐ Investigating    ✓ Confirmed  ││
│ │ Equipment: Ghost Writing Book                  ││
│ │ Difficulty: Easy                               ││
│ └────────────────────────────────────────────────┘│
│                                                    │
│ ┌─ Spirit Box ───────────────────────────────────┐│
│ │ □ Not Found    ◐ Investigating    ✓ Confirmed  ││
│ │ Equipment: Spirit Box                          ││
│ │ Difficulty: Medium                             ││
│ └────────────────────────────────────────────────┘│
│                                                    │
│ ┌─ Freezing Temperatures ────────────────────────┐│
│ │ □ Not Found    ◐ Investigating    ✓ Confirmed  ││
│ │ Equipment: Thermometer                         ││
│ │ Difficulty: Easy                               ││
│ └────────────────────────────────────────────────┘│
└────────────────────────────────────────────────────┘
```

### 2. Real-Time Ghost Filtering
```
CONFIRMED EVIDENCE: EMF Level 5, Ghost Writing, Spirit Box
          ↓
     [Filter in database]
          ↓
MATCHING GHOSTS (8/24 possible):

🎯 DEFINITE MATCH (100% confidence):
   • Spirit ✓ (3/3 evidence match)

🔥 VERY LIKELY (87% confidence):
   • Wraith ✗ (Has EMF + Spirit Box, missing Ghost Writing)
   • Poltergeist ✗ (Has Spirit Box + Ghost Writing, missing EMF)

⚠️  POSSIBLE MATCH (42% confidence):
   • Shade (1/3 evidence match - EMF Level 5)
   • Demon (1/3 evidence match - Ghost Writing)
   • Mare (1/3 evidence match - Spirit Box)

❌ IMPOSSIBLE (0% match):
   • Phantom (requires UV Light - not collected)
   • Banshee (requires Ghost Orb - not collected)
   • [5 more impossible ghosts...]

NEXT STEPS TO NARROW DOWN:
  → Confirm Ghost Orb (video camera)
    Helps eliminate: Phantom (would have it), Wraith (wouldn't)
  
  → Check Ultraviolet
    Helps distinguish: Poltergeist from Spirit
  
  → Check Freezing Temperatures
    Helps distinguish: Revenant, Shade, etc.
```

### 3. Evidence Collection Card (Expandable)
```
┌─────────────────────────────────────────────────┐
│ 🔍 EMF LEVEL 5                        [Expand ▼] │
├─────────────────────────────────────────────────┤
│ Status: Investigating                           │
│                                                 │
│ HOW TO COLLECT:                                 │
│ 1. Hold EMF Reader in hand                     │
│ 2. Wait for ghost interaction                  │
│ 3. Watch for spikes up to level 5              │
│ 4. Up to 5 spikes = EMF Level 5                │
│                                                 │
│ TIPS:                                           │
│ • Ghost must be triggered/active               │
│ • Best during ghost events                     │
│ • Reliable for 50% of ghosts                   │
│ • No sanity drain from detection               │
│                                                 │
│ EQUIPMENT NEEDED:                              │
│ ✓ EMF Reader (Starter - $45)                  │
│                                                 │
│ GHOSTS WITH THIS EVIDENCE:                     │
│ Spirit, Wraith, Jinn, Shade, Oni, Myling,    │
│ Onryo, Raiju, Obake, Banshee                  │
│                                                 │
│ DIFFICULTY: ⭐ Easy                            │
│ RARITY: ⭐⭐⭐⭐⭐ Very Common (50% of ghosts) │
│                                                 │
│ GHOSTS THAT DON'T HAVE THIS:                   │
│ • Phantom (uses Ultraviolet instead)           │
│ • Poltergeist (uses Spirit Box instead)        │
│ • [6 more...]                                  │
│                                                 │
│ [✓ MARK AS CONFIRMED]  [LEARN MORE]            │
└─────────────────────────────────────────────────┘
```

### 4. Smart Elimination Suggestions
```
SMART ELIMINATION GUIDE:

Current Evidence: EMF Level 5, Spirit Box, Ghost Writing

🎯 NEXT BEST EVIDENCE TO CHECK:
   #1 Ghost Orb (eliminates 8 ghosts if found)
      → If found: Eliminates Spirit, Wraith, Shade, Demon...
      → If not found: Confirms Spirit is correct

   #2 Ultraviolet (eliminates 6 ghosts if found)
      → If found: Confirms Phantom or Poltergeist
      → If not found: Confirms Spirit

   #3 Freezing Temperatures (eliminates 5 ghosts)
      → If found: Adds narrowing ability
      → If not found: More confirms Spirit

✅ EVIDENCE NOT WORTH CHECKING NOW:
   • Spirit Box (already have)
   • Ghost Writing (already have)
   • D.O.T.S. (won't narrow down further)

💡 SPEED RUN ADVICE:
   If you want to confirm ASAP:
   → Check Ghost Orb first (quickest confirmation)
   → Then check Ultraviolet if still uncertain
   → Skip Spirit Box if you can confirm differently
```

### 5. Equipment Recommendation Sidebar
```
┌──────────────────────────────────────────────┐
│ 🎒 RECOMMENDED EQUIPMENT                    │
├──────────────────────────────────────────────┤
│ COLLECTED EVIDENCE REQUIRES:                 │
│ ✓ EMF Reader (have it)                      │
│ ✓ Spirit Box (have it)                      │
│ ✓ Ghost Writing Book (have it)              │
│                                              │
│ TO COMPLETE IDENTIFICATION:                 │
│ ○ Video Camera ............ $50 (tap to go) │
│   → For Ghost Orb detection                 │
│   → Essential to confirm Spirit vs. Wraith  │
│                                              │
│ ○ UV Light ................ $35 (tap to go) │
│   → For Ultraviolet detection               │
│   → Helps eliminate Phantom/Poltergeist     │
│                                              │
│ ○ Thermometer (upgrade) ... $30             │
│   → For Freezing Temperatures               │
│   → Nice-to-have for final confirmation     │
│                                              │
│ DEFENSIVE GEAR TO ADD:                      │
│ ✓ Crucifix ................. $30             │
│   → Recommended for any ghost               │
│ ✓ Sanity Medication ........ $20             │
│   → Use if sanity drops below 50%           │
│                                              │
│ ESTIMATED COST: $145 more for full setup   │
│ TOTAL WITH BASICS: $495                    │
└──────────────────────────────────────────────┘
```

### 6. Confidence Meter & Progress
```
IDENTIFICATION PROGRESS:

Evidence Needed: 3 (typical ghost)
Evidence Collected: 2
Completion: 67% ████████░ 

CONFIDENCE LEVELS:

Ghost ID           Confidence    Match Level
─────────────────────────────────────────────
Spirit            100%  ████████████ CONFIRMED
Wraith            12%   █░░░░░░░░░░░ Unlikely
Shade             8%    █░░░░░░░░░░░ Possible
Demon             5%    ░░░░░░░░░░░░ Unlikely
Mare              3%    ░░░░░░░░░░░░ Unlikely

[+10 more ghosts at 0% - completely eliminated]

NEXT HINT: Check for Ghost Orb to confirm
TIME TO CONFIRMATION: ~5-10 minutes at current pace
```

### 7. Evidence Comparison Grid
```
YOUR EVIDENCE vs GHOST DATABASE:

Evidence Type          │ Have │ Spirit │ Wraith │ Phantom
───────────────────────┼──────┼────────┼────────┼─────────
EMF Level 5            │  ✓   │   ✓    │   ✓    │    ✗
Ghost Writing          │  ✓   │   ✓    │   ✗    │    ✗
Spirit Box             │  ✓   │   ✓    │   ✓    │    ✗
Ultraviolet            │  ✗   │   ✗    │   ✗    │    ✓
Ghost Orb              │  ?   │   ✗    │   ✗    │    ✗
Freezing Temperatures  │  ✗   │   ✗    │   ✗    │    ✗
D.O.T.S. Projector     │  ✗   │   ✗    │   ✓    │    ✓

ANALYSIS:
• Spirit: 3/3 MATCH ✅ (100% certain)
• Wraith: 2/3 MATCH (missing Ghost Writing)
• Phantom: 0/3 MATCH (needs UV Light)
```

### 8. Quick Actions
```
QUICK ACTION BUTTONS:

[✓ Confirm Evidence] - Save and move to next
[? Evidence Details] - Expand card, get tips
[⏱ Skip Evidence] - Mark as not applicable
[📷 Photo Hints] - Show visual examples
[🔗 Ghost Profile] - View current suspected ghost
[⚙️ Settings] - Change sensitivity, difficulty
```

### 9. Investigation Timeline
```
INVESTIGATION TIMELINE:

Contract Started: 24:35
├─ 00:00 - Entered 6 Tanglewood Drive
├─ 02:15 - Collected EMF Level 5 spikes in living room
│         Ghost ID Confidence: 14/24 possible
├─ 05:30 - Heard ghost respond via Spirit Box
│         Ghost ID Confidence: 9/24 possible
├─ 08:45 - Found ghost writing in upstairs bedroom
│         Ghost ID Confidence: 3/24 possible ⭐
│         → LIKELY GHOST: SPIRIT (100%)
├─ 10:00 - Collected Ghost Orb on video camera
│         NOT SPIRIT (contradiction)
│         New possible: Wraith, Phantom, Banshee
├─ 12:30 - Confirmed NO UV evidence (Phantom ruled out)
│         New possible: Wraith (most likely), Banshee
├─ 15:45 - Got confirmation image of Wraith silhouette
│         → CONFIRMED: WRAITH (97% confidence)
└─ 18:00 - Hunt triggered, equipment effective = confirmed!

LESSONS LEARNED:
• Wraith leaves no footprints in salt (key identifier)
• Wraith fears salt (strategy note)
• Used crucifix effectively to survive hunt
```

## Implementation Details

### Component Structure
```
EvidenceIdentifierScreen/
├── ContractHeader
│   ├── LocationName
│   ├── Timer
│   └── DifficultyIndicator
├── EvidenceCollectionList
│   ├── EvidenceCard
│   │   ├── Status Toggle
│   │   ├── ExpandableDetails
│   │   ├── EquipmentNeeded
│   │   └── ActionButtons
│   └── ... (7 cards)
├── FilteringPanel
│   ├── GhostMatchList
│   ├── ConfidenceMeter
│   └── NextStepsHints
├── EquipmentRecommendation
│   ├── CollectedEquipment
│   ├── RecommendedEquipment
│   └── LinkToEquipmentTab
└── ComparisonGrid (Optional Tab)
    └── EvidenceMatchMatrix
```

### State Management
```typescript
interface EvidenceState {
  collected: {
    [evidenceType: string]: 'not-found' | 'investigating' | 'confirmed'
  };
  timestamp: {
    [evidenceType: string]: number
  };
  notes: {
    [evidenceType: string]: string
  };
}

interface GhostMatchResult {
  ghostId: string;
  confidence: number; // 0-100
  matchedEvidence: EvidenceType[];
  missingEvidence: EvidenceType[];
  extraEvidence: EvidenceType[];
  contradictions: string[];
}

const [evidenceState, setEvidenceState] = useState<EvidenceState>({
  collected: {
    'EMF Level 5': 'not-found',
    'D.O.T.S. Projector': 'not-found',
    // ... etc
  },
  timestamp: {},
  notes: {}
});

const [possibleGhosts, setPossibleGhosts] = useState<GhostMatchResult[]>([]);
```

### Filtering Algorithm
```typescript
function filterGhostsByEvidence(
  collectedEvidence: Map<EvidenceType, 'confirmed' | 'investigating' | 'not-found'>
): GhostMatchResult[] {
  const confirmedEvidence = Array.from(collectedEvidence.entries())
    .filter(([_, status]) => status === 'confirmed')
    .map(([type, _]) => type);
  
  const results: GhostMatchResult[] = GHOST_LIST.map(ghost => {
    const ghostEvidence = new Set(ghost.evidence);
    const matchedEvidence = confirmedEvidence.filter(e => ghostEvidence.has(e));
    const missingEvidence = confirmedEvidence.filter(e => !ghostEvidence.has(e));
    
    // Confidence calculation
    let confidence = 0;
    
    if (missingEvidence.length > 0) {
      // Confirmed evidence that ghost DOESN'T have = 0% confidence
      confidence = 0;
    } else {
      // How many of ghost's evidence do we have?
      const matchPercentage = matchedEvidence.length / ghost.evidence.length;
      confidence = matchPercentage * 100;
      
      // Bonus if we have all their evidence
      if (matchedEvidence.length === ghost.evidence.length) {
        confidence = 100;
      }
    }
    
    return {
      ghostId: ghost.id,
      confidence,
      matchedEvidence,
      missingEvidence: ghost.evidence.filter(e => !confirmedEvidence.includes(e)),
      extraEvidence: confirmedEvidence.filter(e => !ghostEvidence.has(e)),
      contradictions: missingEvidence.length > 0 
        ? [`Has confirmed evidence ghost doesn't have`] 
        : []
    };
  });
  
  return results.sort((a, b) => b.confidence - a.confidence);
}
```

### Smart Hint Generation
```typescript
function generateNextStepHints(
  possibleGhosts: GhostMatchResult[],
  collectedEvidence: EvidenceType[]
): EvidenceType[] {
  const allEvidenceTypes = ['EMF Level 5', 'D.O.T.S. Projector', ...];
  const uncollected = allEvidenceTypes.filter(e => !collectedEvidence.includes(e));
  
  // Score each uncollected evidence by elimination power
  const scores = uncollected.map(evidence => {
    const eliminationPower = possibleGhosts.filter(
      ghost => !ghost.ghost.evidence.includes(evidence)
    ).length;
    
    return { evidence, eliminationPower };
  });
  
  // Return top 3 by elimination power
  return scores
    .sort((a, b) => b.eliminationPower - a.eliminationPower)
    .slice(0, 3)
    .map(s => s.evidence);
}
```

### Navigation Integration
- Create `(tabs)/evidence-identifier.tsx` or modal
- Add button to maps or dedicated section
- Allow starting from map detail: `?identifier=true`
- Pass contract location as parameter

### Data Persistence
```typescript
// Save investigation session
interface InvestigationSession {
  contractId: string;
  location: string;
  difficulty: string;
  startTime: number;
  evidenceProgress: EvidenceState;
  ghostGuesses: GhostMatchResult[];
  finalResult?: string;
  completionTime?: number;
}

// Local storage
localStorage.setItem(
  `investigation_${contractId}`,
  JSON.stringify(session)
);
```

## User Workflows

### Workflow 1: New Investigator Learning
1. Opens Evidence Identifier
2. Sees 7 evidence types with clear descriptions
3. Investigates location with equipment
4. Confirms EMF Level 5 (taps ✓ button)
5. Sees ghost list narrow down in real-time
6. Gets hint: "Check for Ghost Orb next"
7. Confirms Ghost Orb, then Ghost Writing
8. Gets 100% confidence on Spirit
9. Views Spirit profile from results
10. Hunts and confirms

### Workflow 2: Speedrunner
1. Opens Evidence Identifier
2. Quickly confirms 3 evidence types
3. Sees exactly 1 ghost matches (100%)
4. Notes confirmation
5. Moves on to hunt

### Workflow 3: Troubleshooting
1. Collected contradictory evidence
2. Identifier shows 0% matches
3. Gets warning: "Check your evidence"
4. Re-confirms one piece
5. Resolution achieved

### Workflow 4: Expert Mode
1. Uses comparison grid view
2. Analyzes which evidence distinguishes ghosts
3. Strategically tests differentiating evidence
4. Efficiently narrows down ghost

## UI/UX Considerations

### Progressive Disclosure
- Collapse evidence cards by default
- Expand only when needed
- Show critical info in collapsed state

### Visual Feedback
- Confirmation checkmarks animate
- Confidence meter animates changes
- Ghost list reorders smoothly

### Color Coding
- **Confirmed**: Green
- **Investigating**: Yellow/Orange
- **Not Found**: Grey
- **Confidence bars**: Green→Yellow→Red gradient

### Mobile Optimization
- Full-screen evidence cards (swipeable)
- Card-based layout for small screens
- Collapsible sections to save space
- Bottom sheet for ghost list

### Accessibility
- All toggles keyboard accessible
- Screen reader support for confidence levels
- High contrast text
- Large touch targets for confirmation

## Testing Checklist
- [ ] Evidence confirmation updates ghost list
- [ ] Contradictory evidence shows warning
- [ ] Confidence meter calculates correctly
- [ ] Smart hints are relevant
- [ ] Equipment links to Equipment tab
- [ ] Ghost profile links to Ghost details
- [ ] Mobile layout is responsive
- [ ] Investigation sessions save correctly
- [ ] Performance is smooth with 24 ghosts
- [ ] Dark mode colors accessible
- [ ] All evidence types work correctly
- [ ] Timer tracks accurately

## Future Enhancements
1. **Voice input**: "Confirmed ghost writing"
2. **AR camera**: Point camera at evidence
3. **Photo evidence**: Attach photos to evidence
4. **Multiplayer sync**: Share evidence with teammates
5. **Hunt tracking**: Note ghost behavior during hunt
6. **Post-hunt analysis**: Compare to actual ghost
7. **Statistics**: Track identification accuracy
8. **Leaderboards**: Fastest identification times
9. **Challenge mode**: Identify ghosts with restrictions
10. **Export reports**: Generate investigation reports
