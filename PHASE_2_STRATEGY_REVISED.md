# Phase 2.2-2.5: Strategic, Non-Intrusive Ad Placement Strategy

## 🎯 Revised Philosophy: "Show Ads Only for Deep Engagement"

**Problem with original approach:**
- Tab switches = constant ad triggers ❌
- Filters/searches = annoying during browsing ❌
- Users uninstall rather than buy premium ❌

**New approach:**
- Only show ads when user **commits time** to a feature ✅
- Skip passive browsing (tabs, filters, searches) ✅
- Create friction only when it matters ✅
- Maximum 1 ad per 15-20 minute session ✅

## 📱 Recommended Ad Placements

### ✅ ONLY: Premium Feature Unlocks
These are the ONLY places we should show interstitial ads:

#### 1. **Equipment Optimizer Unlock**
- **Trigger:** User who is NOT premium tries to open equipment optimizer (premium feature)
- **Timing:** When they tap the locked feature button
- **Experience:** "Watch ad to try this feature for 15 minutes" or buy premium
- **Frequency:** Max once per session (already has rewarded ad button)
- **Why:** User intentionally clicked a premium feature - perfect moment

#### 2. **Ghost Comparison Unlock**
- **Trigger:** User who is NOT premium tries to open ghost comparison (premium feature)
- **Timing:** When they tap the locked feature button
- **Experience:** "Watch ad to compare ghosts" or buy premium
- **Frequency:** Max once per session (already has rewarded ad button)
- **Why:** User explicitly wanted this feature - natural friction point

#### 3. **Details/Info Sheets (Ghost, Map, Equipment)**
- **Trigger:** User views full details 3+ times in a session
- **Timing:** After detail sheet opened and user has spent 5+ seconds reading
- **Experience:** Ad shows after they've seen content
- **Frequency:** Once every 3 detail views (respects 2-min cap)
- **Why:** User is engaged with content, not just scrolling

#### 4. **Sanity Calculator Result View**
- **Trigger:** User calculates sanity 2+ times in a session
- **Timing:** After result displays (with 1-2 second delay for animation)
- **Experience:** Ad shows after they see their result
- **Frequency:** Every 2nd calculation (respects 2-min cap)
- **Why:** User is focused on the result, not distracted

### ❌ NEVER: Passive Actions
These trigger way too often and are ultra-intrusive:

❌ Tab switches  
❌ Scrolling lists  
❌ Filtering/searching  
❌ Opening sheets (without deep engagement)  
❌ Initial page load  
❌ Quick detail views (<2 seconds)  

## 🧠 Smart Engagement Detection

For detail views, implement timing-based detection:

```typescript
const [detailOpenTime, setDetailOpenTime] = useState<number | null>(null);
const [detailViewCount, setDetailViewCount] = useState(0);

const handleDetailOpen = useCallback(() => {
  setDetailOpenTime(Date.now());
  setShowDetail(true);
};

const handleDetailClose = useCallback(() => {
  if (detailOpenTime) {
    const timeSpent = Date.now() - detailOpenTime;
    
    // Only count as "engaged" if spent 5+ seconds reading
    if (timeSpent > 5000) {
      setDetailViewCount(prev => prev + 1);
      
      // Show ad only after 3 engaged views
      if (detailViewCount >= 2 && canShowAd()) {
        await showAd();
      }
    }
  }
  setShowDetail(false);
};
```

## 📊 Expected Ad Frequency

### Scenario: Casual User (30 minutes session)
- Opens tab: 5-8 times (no ads from this)
- Filters/searches: 3-4 times (no ads from this)
- Views details: 8-10 times (2-3 are deep engagement)
- **Total ads shown:** 1-2 (instead of 5-8 with aggressive approach)

### Scenario: Power User (60 minutes session)
- Engages with multiple features
- Views details many times
- **Total ads shown:** 2-3 (within our 3-per-session cap)

### Scenario: Casual Browser (5 minutes session)
- Just browsing/filtering
- No deep engagement
- **Total ads shown:** 0 (no ads from passive actions)

## 🎯 Implementation Pattern

For detail sheets (Ghost, Equipment, Map):

```typescript
import { useInterstitialAds } from '@/hooks/use-interstitial-ads';

export function DetailSheet() {
  const { showAd, canShowAd } = useInterstitialAds();
  const [detailOpenTime, setDetailOpenTime] = useState<number | null>(null);
  const [deepViewCount, setDeepViewCount] = useState(0);

  const handleOpen = useCallback(() => {
    setDetailOpenTime(Date.now());
  }, []);

  const handleClose = useCallback(async () => {
    if (!detailOpenTime) return;
    
    const timeSpent = Date.now() - detailOpenTime;
    
    // Track deep engagement (5+ seconds)
    if (timeSpent > 5000) {
      const newCount = deepViewCount + 1;
      setDeepViewCount(newCount);
      
      // Show ad after every 3 deep views (respects frequency caps)
      if (newCount % 3 === 0 && canShowAd()) {
        await showAd();
      }
    }
    
    setDetailOpenTime(null);
  }, [detailOpenTime, deepViewCount, canShowAd, showAd]);

  return (
    <ThemedView onOpenModal={handleOpen} onCloseModal={handleClose}>
      {/* Detail content */}
    </ThemedView>
  );
}
```

## 💰 Revenue Impact

| Approach | Ads/Day | Annual Revenue | Risk |
|----------|---------|-----------------|------|
| **Aggressive** (tab + filter) | 8-12 | €800-1200/mo | High uninstalls ⚠️ |
| **Balanced** (engagement-based) | 2-3 | €450-650/mo | Low risk ✅ |
| **Conservative** (unlock only) | 1 | €200-300/mo | Very safe ✅ |

**Recommendation:** Start with **Balanced approach** (engagement-based). Monitor:
- Uninstall rate
- Premium conversion rate
- Ad impressions per user
- User satisfaction ratings

Can adjust frequency if metrics look good.

## 🚀 Implementation Roadmap

### Option 1: Minimal (Safe, Low Revenue)
- Only show ads on premium feature unlock attempts
- ~1 ad per session per user
- Very low uninstall risk
- Projected: €200-300/month additional

### Option 2: Balanced (Recommended)
- Premium feature unlocks + engaged detail views (5+ seconds)
- ~2-3 ads per session per user
- Low uninstall risk
- Projected: €450-650/month additional

### Option 3: Aggressive (High Risk)
- Premium feature unlocks + frequent detail views + calculator results
- ~5-8 ads per session per user
- High uninstall risk
- Projected: €800-1200/month additional

**My recommendation: Start with Option 2 (Balanced). If metrics are good after 2 weeks, consider Option 3.**

## 🧪 Testing Checklist

When implementing:

- [ ] Test premium users see ZERO ads (in any scenario)
- [ ] Test free users see ads only on deep engagement (not on tab switches)
- [ ] Test frequency caps work (max 3/session, min 2 min apart)
- [ ] Test detail timing works (only after 5+ seconds)
- [ ] Test ad doesn't break detail sheet UX
- [ ] Check console logs for [AdMob] and [InterstitialAds] messages
- [ ] Verify no memory leaks from timers

## 🎯 Next: Choose Approach

Which implementation approach do you prefer?

1. **Minimal** - Only unlock features (safest)
2. **Balanced** - Unlocks + deep engagement (recommended)
3. **Aggressive** - Multiple triggers (highest revenue, higher risk)

Let me know and I'll implement accordingly!

---

**Key insight:** Users don't mind ads when they've made a deliberate choice to engage. They hate ads when they're just casually browsing. Let's respect that.
