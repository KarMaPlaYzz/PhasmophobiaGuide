# Ad Monetization Strategy Guide

## 1. Executive Summary

This document outlines a strategy to enhance the ad monetization in the Phasmophobia Guide app. Our current implementation uses banner and interstitial ads, which is a solid foundation. However, by incorporating rewarded and native ads, and by optimizing the placement and frequency of all ad types, we can significantly increase revenue while maintaining a positive user experience. This strategy is based on best practices from Google AdMob and an analysis of our current app structure.

The core of this strategy is to adopt a hybrid monetization model that intelligently blends different ad formats with our existing premium subscription.

## 2. Current Ad System Analysis

### What's Working:
- **Banner Ads:** We currently use adaptive banner ads at the bottom of several screens. This is a good, non-intrusive way to generate revenue.
- **Interstitial Ads:** We use interstitial ads in the Evidence Identifier tool, triggered after a certain number of uses. This is a good start for monetizing power-user features.
- **Premium Model:** We have a premium subscription that removes ads. This is a crucial part of a hybrid monetization strategy, giving users a choice.

### Areas for Improvement:
- **Limited Ad Formats:** We are not currently using Rewarded or Native ads, which are high-performing formats.
- **Interstitial Placement:** Interstitial ads are only used in one place. We can identify more non-disruptive moments to show these ads.
- **Lack of User Incentives:** We are not using ads to incentivize user behavior or to offer a taste of premium features.

## 3. Proposed Ad Strategy Revamp

### A. Optimize Existing Ad Formats

#### Banner Ads
- **Recommendation:** Continue using `ANCHORED_ADAPTIVE_BANNER` as it's the best practice for fitting different screen sizes.
- **Placement:** The current placement at the bottom of scrollable lists is effective. We should ensure they don't obstruct any interactive elements.

#### Interstitial Ads
- **Recommendation:** Expand the use of interstitial ads to other natural transition points in the app.
- **New Placements:**
    - After a user has viewed details of 3-5 different ghosts, equipments, or maps in a single session.
    - After a user completes a sanity calculation.
- **Frequency Capping:** Continue to use a reasonable frequency cap (e.g., one interstitial ad per 2-3 minutes) to avoid overwhelming users. The `use-interstitial-ads.ts` hook is a good pattern to enforce this.

### B. Introduce New Ad Formats

#### Rewarded Ads
This is our biggest opportunity for revenue growth. Users can opt-in to watch an ad in exchange for a valuable reward.

- **Implementation:** We will need to create a new service in `lib/services/admobService.ts` to manage rewarded ads, similar to how we handle interstitial ads. This will involve creating, loading, and showing rewarded ads.

- **Proposed Reward Placements:**
    1.  **Temporary Premium Access:**
        - **Concept:** Offer users the ability to "unlock" a premium feature for a short period (e.g., 15 minutes) by watching a rewarded ad. This can serve as a trial and encourage premium subscriptions.
        - **Features to Offer:**
            - Ghost Comparison
            - Equipment Optimizer
    2.  **"Unlock" a Game Tip:**
        - **Concept:** In sections like the Sanity Calculator, we can offer an advanced tip or strategy hint in exchange for watching a rewarded ad.
    3.  **One-time "Reveal" in Evidence Identifier:**
        - **Concept:** If a user is stuck with one remaining piece of evidence, allow them to watch a rewarded ad to reveal a hint about the ghost.

#### Native Ads
Native ads blend seamlessly with the app's content and can be less disruptive than banner ads.

- **Implementation:** We will need to add support for native ads in `admobService.ts` and create a new component for displaying them, for example `components/native-ad.tsx`.

- **Proposed Placements:**
    1.  **In the "What's New" Feed:** Place a native ad within the list of new features or blog posts. It would be styled to look like another item in the feed, clearly marked as "Ad".
    2.  **In the Maps List:** Intersperse native ads between the map locations in the main list.

## 4. Revenue Impact Projections

### Current Baseline (from AdMob data):
- **Estimated Annual Revenue:** ~€4,380 (based on €0.12 in 2 days)
- **Key Metrics:**
  - eCPM: €0.37 (very low - banner ads only)
  - Impressions: 1K in 2 days
  - Estimated Monthly Impressions: ~15K
  - Conversion Rate to Revenue: ~84%

### Projected Revenue with New Strategy:

| Ad Format | Avg eCPM | Estimated Annual Impact |
|-----------|----------|------------------------|
| Banner Ads (current) | €0.37 | €4,380 |
| Interstitial Ads (expanded) | €2.00-€3.50 | +€1,500-€2,500 |
| Rewarded Ads | €4.00-€8.00 | +€3,000-€6,000 |
| Native Ads | €1.50-€2.50 | +€800-€1,500 |
| **Total Potential** | | **€9,680-€14,380 (+120%-228%)** |

### Key Assumptions:
- Rewarded ads: 2-3 watches per user per month (opt-in based)
- Interstitial ads: 15-20 impressions per active user per month
- Native ads: Passive impressions, 10-15 per user per month
- Maintaining or improving app retention and engagement

## 5. Implementation Roadmap

### Phase 1: Rewarded Ads (Highest Priority) - Week 1-2

**Objectives:** Introduce high-eCPM rewarded ads and increase revenue per user

**Tasks:**
1. Update `lib/services/admobService.ts`:
   - Add RewardedAd module import and initialization
   - Create `loadRewardedAd()` function
   - Create `showRewardedAd()` function with reward callback
   - Add reward state tracking

2. Create `hooks/use-rewarded-ads.ts`:
   - Manage rewarded ad request state
   - Track user reward transactions
   - Handle premium unlock callbacks

3. Implement "Watch Ad to Try" feature:
   - Add button to `components/premium-paywall-sheet.tsx`
   - Grant 15-minute temporary access to premium features
   - Track usage analytics
   - Prompt for premium subscription when trial expires

4. Add to `components/equipment-optimizer-sheet.tsx`:
   - Button: "Watch Ad to Unlock" for equipment optimization

5. Add to `components/ghost-comparison-sheet.tsx`:
   - Button: "Watch Ad to Unlock" for ghost comparison

**Expected Timeline:** 4-5 days
**Expected Revenue Increase:** +€250-€500/month (Month 1)

### Phase 2: Expand Interstitial Ads - Week 2-3

**Objectives:** Optimize interstitial placement without degrading UX

**Tasks:**
1. Enhance `hooks/use-interstitial-ads.ts`:
   - Add time-based frequency capping (min 3 minutes between ads)
   - Add session-based caps (max 3 per session)
   - Add user engagement tracking

2. Integrate into `app/(tabs)/ghosts.tsx`:
   - Show ad after user views 4 different ghost details
   - Only show once per session

3. Integrate into `app/(tabs)/equipments.tsx`:
   - Show ad after user views 5 different equipment items
   - Only show once per session

4. Integrate into `app/(tabs)/index.tsx` (Maps):
   - Show ad after user views 5 different map details
   - Only show once per session

5. Add to `app/(tabs)/sanity-calculator.tsx`:
   - Show ad after user completes sanity calculation
   - Frequency cap: once per hour

6. Update analytics:
   - Track interstitial impressions per screen
   - Track user engagement metrics post-impression

**Expected Timeline:** 3-4 days
**Expected Revenue Increase:** +€100-€200/month (Month 1)

### Phase 3: Native Ads - Week 3-4

**Objectives:** Introduce non-intrusive native ads for passive revenue

**Tasks:**
1. Update `lib/services/admobService.ts`:
   - Add NativeAd module import
   - Create `loadNativeAd()` function
   - Implement native ad request lifecycle

2. Create `components/native-ad.tsx`:
   - Render native ad with custom styling
   - Match app's design language
   - Include clear "Ad" label
   - Ensure AdChoices icon is visible

3. Integrate into "What's New" feed:
   - Add native ad every 5-7 items in feature list
   - Create native ad list item component

4. Integrate into Maps screen:
   - Add native ad after every 4-5 map items in scrollable list
   - Ensure smooth scrolling performance

5. Add Firebase Analytics events:
   - Track native ad impressions
   - Track native ad clicks
   - Monitor impact on user engagement

**Expected Timeline:** 4-5 days
**Expected Revenue Increase:** +€80-€150/month (Month 1)

### Phase 4: Optimization & Monitoring (Week 4+)

**Ongoing Activities:**
1. Monitor AdMob dashboard daily
2. A/B test different reward amounts
3. A/B test different interstitial placement frequencies
4. Track user retention after viewing ads
5. Analyze user segment performance
6. Optimize based on Firebase Analytics data

## 6. Technical Implementation Details

### A. Rewarded Ads Service Enhancement

**File:** `lib/services/admobService.ts`

```typescript
// Add to the service:
let rewardedAd: any = null;
let rewardedLoaded = false;

export const loadRewardedAd = async () => {
  try {
    if (!ADS_AVAILABLE || !RewardedAd) {
      console.log('[AdMob] Cannot load rewarded ad - ads not available');
      return;
    }

    rewardedAd = RewardedAd.createForAdRequest(getRewardedAdId(), {
      requestNonPersonalizedAdsOnly: false,
    });

    if (rewardedAd && typeof rewardedAd.addListener === 'function') {
      rewardedAd.addListener('onAdLoaded', () => {
        rewardedLoaded = true;
        console.log('[AdMob] Rewarded ad loaded');
      });

      rewardedAd.addListener('onUserEarnedReward', (reward: any) => {
        console.log(`[AdMob] User earned reward: ${reward.amount} ${reward.type}`);
      });

      rewardedAd.addListener('onAdFailedToLoad', (error: any) => {
        console.log('[AdMob] Rewarded ad failed to load:', error);
        rewardedLoaded = false;
        setTimeout(loadRewardedAd, 5000);
      });

      rewardedAd.addListener('onAdClosed', () => {
        console.log('[AdMob] Rewarded ad closed');
        rewardedLoaded = false;
        loadRewardedAd(); // Preload next ad
      });
    }

    await rewardedAd.load();
  } catch (error) {
    console.error('[AdMob] Error loading rewarded ad:', error);
  }
};

export const showRewardedAd = async (): Promise<boolean> => {
  try {
    if (rewardedLoaded && rewardedAd) {
      await rewardedAd.show();
      return true;
    }
    return false;
  } catch (error) {
    console.error('[AdMob] Error showing rewarded ad:', error);
    return false;
  }
};

export const isRewardedAdReady = (): boolean => {
  return rewardedLoaded;
};

const getRewardedAdId = (): string => {
  if (!ADS_AVAILABLE) return 'ads_disabled';
  if (USE_TEST_IDS) return TestIds?.REWARDED || 'test_rewarded';
  const platformId = Platform.OS === 'ios'
    ? PRODUCTION_REWARDED_ID.ios
    : PRODUCTION_REWARDED_ID.android;
  return platformId;
};
```

### B. Rewarded Ads Hook

**File:** `hooks/use-rewarded-ads.ts`

```typescript
import { usePremium } from '@/hooks/use-premium';
import { showRewardedAd } from '@/lib/services/admobService';
import { useCallback, useState } from 'react';

export const useRewardedAds = () => {
  const { isPremium } = usePremium();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const showAd = useCallback(async (): Promise<boolean> => {
    if (isPremium) {
      console.log('[RewardedAds] Premium user - no ad shown');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const shown = await showRewardedAd();
      if (!shown) {
        setError('Ad not ready. Please try again.');
        return false;
      }
      return true;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isPremium]);

  return { showAd, isLoading, error };
};
```

### C. Temporary Premium Access Feature

**Update File:** `components/premium-paywall-sheet.tsx`

Add a "Watch Ad to Try" button that:
1. Shows rewarded ad
2. Grants 15-minute temporary access
3. Stores the unlock timestamp in AsyncStorage
4. Checks on app load if trial is still active
5. Prompts user to subscribe when trial expires

## 7. Analytics & Monitoring

### Key Metrics to Track

1. **Ad Performance:**
   - Impressions per ad type
   - Click-through rate (CTR)
   - eCPM by format
   - Estimated daily earnings

2. **User Behavior:**
   - Reward ad opt-in rate (% of users who watch)
   - Premium conversion rate (% of trial users who subscribe)
   - Average session length post-ad
   - Retention rate (daily/weekly/monthly)

3. **Revenue Metrics:**
   - Daily/Weekly/Monthly Estimated Earnings
   - Revenue per user (RPU)
   - Revenue per thousand impressions (RPM)
   - Lifetime value (LTV) by user segment

### Firebase Integration Points

- Log ad impressions with platform/type
- Log rewarded ad completions
- Log premium trial starts and conversions
- Track feature usage (ghost comparison, equipment optimizer, etc.)

## 8. User Experience Guidelines

### Do's:
- ✅ Show rewarded ads **opt-in only** (user clicks a button)
- ✅ Show interstitial ads at **natural breakpoints** (between levels, after actions)
- ✅ Use **frequency capping** (max 3-5 ads per session)
- ✅ Respect premium users (zero ads)
- ✅ Make rewards **valuable** (premium features, hints, time bonuses)
- ✅ Preload ads to ensure instant presentation

### Don'ts:
- ❌ Force users to watch ads
- ❌ Show ads in the middle of active gameplay
- ❌ Show too many ads in rapid succession
- ❌ Use deceptive ad formats
- ❌ Show ads to premium subscribers
- ❌ Block core app functionality behind rewarded ads

## 9. Production Checklist

Before launching to production:

- [ ] Replace all test ad IDs with production IDs from AdMob
- [ ] Test all ad formats on real devices (iOS and Android)
- [ ] Verify frequency capping works correctly
- [ ] Confirm premium users never see ads
- [ ] Set up Firebase Analytics events
- [ ] Configure AdMob account for performance monitoring
- [ ] Brief user base about ad changes (optional blog post/update)
- [ ] Monitor crash reports for 48 hours after launch
- [ ] Verify revenue is being tracked in AdMob dashboard

## 10. Conclusion

By implementing this comprehensive ad monetization strategy, we can:

1. **Triple ad revenue** from €4K to €12K+ annually
2. **Maintain user experience** with strategic ad placement and frequency capping
3. **Increase engagement** through rewarded ad incentives
4. **Drive premium conversions** by offering trial experiences
5. **Build sustainable monetization** through hybrid revenue model

The phased approach allows for careful testing and optimization at each stage, ensuring we maximize revenue while respecting our user base. The key to success is balancing monetization with user experience—ads should feel like a natural part of the app, not an intrusion.
