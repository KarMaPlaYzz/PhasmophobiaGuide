# Phase 2: Balanced Interstitial Ad Implementation Guide

## 🎯 Strategy: Non-Intrusive Monetization

Instead of bombarding users with ads, we're implementing a **balanced approach** that:
- Shows ads only at **natural transition points** (after user completes an action)
- **Respects frequency caps** (max 3 ads per session, minimum 2 minutes between ads)
- **Exempts premium users** completely (no ads)
- Uses ads as a **"friction point"** that encourages premium purchase
- Maintains **excellent user experience** (fewer uninstalls, higher premium conversion)

## 📊 Frequency Capping System

```typescript
// Configuration in admobService.ts
const INTERSTITIAL_MIN_INTERVAL = 2 * 60 * 1000; // 2 minutes between ads
const INTERSTITIAL_MAX_PER_SESSION = 3;           // Max 3 ads per session
```

### How It Works

| Scenario | Behavior | User Experience |
|----------|----------|------------------|
| User sees first ad | Ad shows immediately | "Free feature demo" |
| User tries ad again in 1 min | Ad blocked (too soon) | "Buy premium to remove ads" |
| User tries ad again in 2 min | Ad shows (meets cap) | Gentle friction |
| User sees 3rd ad | Ad shows | "Consider going premium now" |
| User tries 4th ad in session | Blocked (session limit) | "Upgrade to remove ad limits" |

## 🚀 Implementation Workflow

### Step 1: Review Existing Code

**admobService.ts** now has:
```typescript
// Frequency capping state
let lastInterstitialShowTime = 0;
let interstitialShowCount = 0;

// Helper functions
canShowInterstitialAd(): boolean     // Check if ad can be shown
recordInterstitialAdShow(): void     // Track that ad was shown
resetSessionAdCounters(): void       // Reset when app resumes
```

**use-interstitial-ads.ts** hook now provides:
```typescript
const { showAd, canShowAd, isReady } = useInterstitialAds();

// canShowAd() returns false if:
// - User is premium
// - Less than 2 minutes since last ad
// - Already shown 3 ads this session
```

### Step 2: Integration Pattern

For each screen where you want to show ads:

```typescript
import { useInterstitialAds } from '@/hooks/use-interstitial-ads';
import { usePremium } from '@/hooks/use-premium';

export function MyScreen() {
  const { showAd, canShowAd } = useInterstitialAds();
  const { isPremium } = usePremium();

  const handleViewDetail = useCallback(async () => {
    // ... User completes action that triggers ad opportunity ...

    // Only show ad if possible (respects all caps)
    if (canShowAd()) {
      await showAd();
    }
  }, [canShowAd, showAd]);

  return (
    <>
      {/* UI */}
    </>
  );
}
```

## 📍 Recommended Ad Placements (Non-Intrusive)

### ✅ Ghost Details Screen
**When:** User taps ghost name to view full details  
**Why:** Perfect moment - user just finished viewing ghost in list  
**Frequency:** Once per ghost view (respects 2-min cap)

```typescript
const handleGhostTap = useCallback(async () => {
  // Show ghost detail sheet
  setSelectedGhost(ghost);
  
  // Show ad as they're reading details
  if (canShowAd()) {
    await showAd();
  }
}, [canShowAd, showAd]);
```

### ✅ Equipment Comparison
**When:** User opens equipment comparison sheet (after search/filter)  
**Why:** Natural pause point after filtering  
**Frequency:** Once per comparison session

```typescript
const handleComparisonOpen = useCallback(async () => {
  setShowComparison(true);
  
  // Show ad as they're comparing
  setTimeout(async () => {
    if (canShowAd()) {
      await showAd();
    }
  }, 500); // Small delay to let sheet animate
}, [canShowAd, showAd]);
```

### ✅ Map View
**When:** First time user opens map details this session  
**Why:** Natural transition point  
**Frequency:** Only once per session (then blocked by 2-min cap)

```typescript
const [mapShownThisSession, setMapShownThisSession] = useState(false);

const handleMapOpen = useCallback(async () => {
  setSelectedMap(map);
  
  // Only show ad first time this session
  if (!mapShownThisSession && canShowAd()) {
    await showAd();
    setMapShownThisSession(true);
  }
}, [canShowAd, showAd, mapShownThisSession]);
```

### ✅ Sanity Calculator Result
**When:** User calculates sanity (after entering data)  
**Why:** Perfect moment - completed an action, waiting for result  
**Frequency:** Once per calculation session

```typescript
const handleCalculate = useCallback(async () => {
  const result = calculateSanity(input);
  setResult(result);
  
  // Show ad after they see result
  setTimeout(async () => {
    if (canShowAd()) {
      await showAd();
    }
  }, 1000); // Let result animate first
}, [canShowAd, showAd]);
```

## ⚠️ Anti-Patterns (What NOT to do)

❌ **DON'T:** Show ads on app launch  
❌ **DON'T:** Show ads during active data entry  
❌ **DON'T:** Show ads on error screens  
❌ **DON'T:** Stack multiple ads back-to-back  
❌ **DON'T:** Show ads to premium users  
❌ **DON'T:** Bypass frequency caps

## 🧪 Testing Frequency Caps

```typescript
// Test in your screen
const { showAd, canShowAd } = useInterstitialAds();

// First call: should show ad
await showAd();  // ✅ Shown (0/3 shown so far)

// Second call after 30 seconds: should be blocked
await showAd();  // ❌ Blocked (too soon - need 2 minutes)

// Third call after 2 minutes: should show ad
// Wait 120+ seconds...
await showAd();  // ✅ Shown (1/3 shown so far)

// Continue until 3rd ad...
// Fourth call after 3rd ad: should be blocked
await showAd();  // ❌ Blocked (session limit reached 3/3)
```

## 📱 App Lifecycle Integration

Reset session counters when app resumes (call in your root layout):

```typescript
import { useAppState } from '@react-native-camera-roll/camera-roll';
import admobService from '@/lib/services/admobService';

export function RootLayout() {
  const appState = useAppState();

  useEffect(() => {
    if (appState === 'active') {
      // Reset session ad count when app comes to foreground
      admobService.resetSessionAdCounters();
    }
  }, [appState]);

  // ... rest of layout
}
```

Or simpler approach (in app initialization):

```typescript
// In your _layout.tsx or root file
const { isPremium } = usePremium();

useEffect(() => {
  // Reset session when user changes (e.g., logs out)
  admobService.resetSessionAdCounters();
}, [isPremium]);
```

## 🎯 Revenue Projection

**Current state (Phase 1):**
- Banner ads only: ~€0.12 per 2 days
- Projected annual: ~€4,380

**With Phase 2 (smart interstitials):**
- Frequency cap: 3 ads per session, ~2-3 sessions per user per day
- Expected: 6-9 ad impressions per active user per day
- Projected additional revenue: €150-€250/month
- **Total projected with Phase 1+2: €615-€865/month**

**Premium incentive:**
- Users who buy premium remove all ads
- Better user experience = higher conversion
- Frequency caps create gentle friction toward premium

## 🔧 Configuration Tuning

If you need to adjust frequency caps in production:

```typescript
// More aggressive monetization (higher risk of uninstalls)
const INTERSTITIAL_MIN_INTERVAL = 1 * 60 * 1000;  // 1 minute
const INTERSTITIAL_MAX_PER_SESSION = 5;            // 5 ads per session

// More conservative (lower revenue, better retention)
const INTERSTITIAL_MIN_INTERVAL = 3 * 60 * 1000;  // 3 minutes
const INTERSTITIAL_MAX_PER_SESSION = 2;            // 2 ads per session
```

**Recommended:** Start conservative (current settings) and increase after measuring retention.

## ✅ Implementation Checklist

- [ ] **Phase 2.1** - Frequency capping system: ✅ DONE
- [ ] **Phase 2.2** - Ghost details interstitial
- [ ] **Phase 2.3** - Equipment comparison interstitial
- [ ] **Phase 2.4** - Maps interstitial
- [ ] **Phase 2.5** - Sanity calculator interstitial
- [ ] **Testing** - Verify frequency caps work
- [ ] **App lifecycle** - Reset counters on app resume
- [ ] **Monitoring** - Track impressions and revenue

---

**Next:** Implement interstitial placements in Ghost details screen (Phase 2.2)
