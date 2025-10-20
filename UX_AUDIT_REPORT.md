# Phasmophobia Guide App - UX Audit Report
**Date:** October 20, 2025  
**Context:** Game companion app for active gameplay - players have limited time while playing

---

## Executive Summary
The app is functional but needs **UX optimization for fast gameplay reference**. Players need to access critical information quickly without deep scrolling or multiple tab switches.

---

## 🎯 Critical Issues (Must Fix)

### 1. **Ghost Identifier - Evidence Selection Not Visible Enough**
- **Issue:** Counter Strategies visible only after scrolling through Overview → Evidence → Abilities → Strengths tabs
- **Impact:** Player needs to hunt through sheets to find strategies while actively playing
- **Recommendation:** 
  - Move Counter Strategies to the **Overview tab as a quick summary**
  - Create "Quick Tips" at the top of Ghost Detail Sheet
  - Show effectiveness badges prominently (High/Medium/Low)

### 2. **Map Detail Sheet - Zone Information Too Deep**
- **Issue:** Zones are in a separate tab, not immediately visible on Overview
- **Impact:** Players hunting on a map can't quickly reference zone strategies
- **Recommendation:**
  - Add zone list to Overview tab with collapsible sections
  - Show top 3-5 zones by difficulty rating by default
  - Include zone names as quick links in the Overview

### 3. **Bottom Tab Navigation - No Pulse/Badge Indicator**
- **Issue:** No visual indicator when there's critical new information or when tabs have updated content
- **Impact:** Players might miss important updates (though less critical than above)
- **Recommendation:** Good to add badges later (e.g., "! " badge on Sanity tab when sanity below 20%)

---

## ⚠️ High Priority Issues

### 4. **Touch Targets Too Small for Gameplay**
- **Issue:** Evidence cards (12px padding), Equipment buttons, tab buttons all relatively small
- **Impact:** Misclicks while playing, frustration during intense moments
- **Recommendation:**
  ```
  - Evidence card minimum height: 50px (currently ~46px)
  - Tab buttons: increase padding to 14px horizontal
  - Clear button and action buttons: minimum height 48px
  ```

### 5. **Counter Strategies Not Scannable**
- **Issue:** Current format shows strategy → effectiveness badge → tips, but lacking visual hierarchy
- **Current:** Green/Yellow/Red badges but hard to scan at a glance
- **Recommendation:**
  - Bold the strategy name
  - Put effectiveness badge on same line as strategy name for faster scanning
  - Consider **emoji indicators** (✓ High, ~ Medium, ✗ Low) for instant recognition
  - Highlight "High" effectiveness strategies in a different color section

### 6. **Equipment Recommendations Not Prioritized**
- **Issue:** Equipment section lists Essential, Recommended, Optional, Avoid but all equally spaced
- **Impact:** Player doesn't quickly know "must bring this" vs "nice to have"
- **Recommendation:**
  - **Essential items should be visually prominent** (larger, bold, highlighted)
  - Add brief explanation: "Do NOT hunt without these"
  - Optional and Avoid can be secondary/collapsed by default

---

## 🟡 Medium Priority Issues

### 7. **Sanity Calculator - Not Accessible Enough**
- **Issue:** Sanity calculator is in a separate tab; players might forget to check it
- **Impact:** Players don't prepare equipment based on sanity drain rates
- **Recommendation:**
  - Add **quick sanity drain indicator** to Ghost Detail Sheet (e.g., "Drains 10% sanity per minute")
  - Add sanity % to Ghost Identifier when ghost is identified
  - Consider adding a persistent mini-widget on Identifier tab showing current sanity simulation

### 8. **Ghost Detail Sheet - Navigation Confusion**
- **Issue:** 6 tabs (Overview, Evidence, Abilities, Strengths, Counters, Equipment) requires horizontal scrolling
- **Impact:** Not immediately clear what information is available
- **Recommendation:**
  - Collapse to 4 tabs maximum: Overview (with quick stats), Evidence, Strategies (counters + tips), Equipment
  - Move Abilities/Strengths into Overview as collapsible sections
  - Example layout: **[Quick Facts] [Evidence] [Tactics] [Gear]**

### 9. **Map Detail Sheet - Stats Not Immediately Visible**
- **Issue:** Max Rooms, Max Players, Fuse availability buried in stats grid
- **Impact:** Good placement, but could be larger/bolder
- **Recommendation:**
  - Increase stat card size by 15-20%
  - Add icons with better visual distinction
  - Consider showing room count as "🏠 8/10 rooms" with progress bar for larger maps

---

## 🟢 Low Priority Issues / Good Work

### 10. **Evidence Identifier - Good UX**
✅ Evidence selection with visual feedback (checkmark + highlight)  
✅ Clear button always visible  
✅ Progress indicator showing "X ghosts possible"  
✅ Identified ghost highlighted  
**Keep this design pattern**

### 11. **Color Coding System**
✅ Consistent use of colors for difficulty levels  
✅ Effectiveness badges (High=Green, Medium=Yellow, Low=Red)  
✅ Equipment categories color-coded  
**Well thought out**

### 12. **Tab Navigation**
✅ Scroll-to-top on double-tap works  
✅ Detail sheets close on tab switch  
✅ Haptic feedback on iOS  
**Solid implementation**

---

## 📋 Quick Fixes (Easy Wins)

1. **Increase all touch target heights to minimum 48px**
   - Evidence cards: current ~46px → 50px
   - Buttons: add 2px vertical padding

2. **Make Counter Strategies more scannable**
   - Strategy name: increase font size from 15px → 17px
   - Add emoji indicators: ✓ / ~ / ✗ instead of just text badges

3. **Make Equipment Essential section stand out**
   - Essential items bold: `fontWeight: '700'` instead of '600'
   - Add border or background color to Essential section
   - Add text label: "Must Bring" in red

4. **Add Sanity Drain to Ghost Overview**
   - Display quick reference: "Sanity Drain: [High/Medium/Low]" with visual indicator

---

## 🔄 Recommended UX Flow Changes

### Current Flow:
```
Identifier Tab
  → Select Evidence
    → Click Ghost
      → BottomSheet opens (6 tabs)
        → Scroll through tabs to find Counters
```

### Optimized Flow:
```
Identifier Tab
  → Select Evidence (faster: bigger touch targets)
    → View identified ghost with highlighted badge
      → Click ghost
        → BottomSheet opens
          → Overview tab shows:
             - Ghost image
             - Difficulty badge
             - Quick stats (Speed, Activity, Hunt %)
             - TOP 3 Counter Strategies (collapsed Abilities/Strengths)
             - Essential Equipment (highlighted)
          → [Evidence] [Tactics] [Gear] tabs for details
```

---

## 🎮 Gaming Context Considerations

Players are typically:
- **Playing actively** (not sitting idle reading)
- **In dark environments** (may have reduced contrast settings)
- **Using one hand** (need thumb-reachable buttons)
- **In 2-3 second decision windows** (need instant scanning, not reading)

### Current Alignment:
- ✅ Tab navigation works well (quick switching)
- ✅ Detail sheets don't block main screen
- ⚠️ Too much information in sheets (overwhelming)
- ⚠️ Too many tabs (mental load)

---

## Implementation Priority

### Phase 1 (Critical - Do First):
1. Move Counter Strategies to Overview as "Quick Tips" section
2. Increase touch target sizes to 48px minimum
3. Make Equipment Essential section visually distinct (bold, color highlight)

### Phase 2 (High - Do Next):
1. Reduce Ghost Detail Sheet tabs from 6 to 4
2. Add zone list to Map Overview tab
3. Add sanity drain indicator to ghost cards

### Phase 3 (Medium - Nice to Have):
1. Add emoji indicators to effectiveness badges
2. Add mini sanity calculator to Identifier tab
3. Optimize ghost card layout for scanning

---

## Success Metrics

After implementing changes, test with:
- ⏱️ **Time to find counter strategy:** < 3 seconds from identifying ghost
- ⏱️ **Time to view zone tactics:** < 2 seconds from selecting map
- 👆 **Misclick rate:** Should decrease with larger touch targets
- 📱 **Screen real estate:** Essential info visible without scrolling first time

---

## Conclusion

The app is **functionally solid** with good visual design and working features. However, it needs **UX optimization for active gameplay reference**. The main goal should be reducing information hierarchy depth and increasing scannability for time-critical gameplay scenarios.

**Key takeaway:** Players shouldn't need to hunt through multiple tabs to answer "What counters this ghost?" or "What's on this map?" - these should be instantly accessible.
