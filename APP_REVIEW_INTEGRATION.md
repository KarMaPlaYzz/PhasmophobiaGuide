# App Review System - Integration Guide

## Overview

A sophisticated, non-obnoxious app review request system that:
- Uses native iOS App Store review prompts
- Tracks user engagement and frequency caps review requests
- Includes smart timing to avoid user annoyance
- Supports permanent dismissal by users

## Components Created

### 1. **appReviewService.ts** (`lib/services/appReviewService.ts`)
Service that manages review prompt logic and persistence.

**Key Features:**
- Tracks when to show review prompts based on:
  - Time since last request (60+ days minimum)
  - User engagement level (3+ interactions required)
  - Number of dismissals (after 3 "Later"s, wait 90 days)
  - User's "Never Ask" preference (permanent)
- Resets interaction count weekly to stay fresh
- New app versions reset the request history

**Key Functions:**
```typescript
// Record user interactions (call when user completes actions)
await appReviewService.recordAppInteraction();

// Check if we should show review prompt
const shouldShow = await appReviewService.shouldShowReviewPrompt();

// Handle user responses
await appReviewService.recordReviewRequested();  // "Rate Now"
await appReviewService.recordReviewDismissed();  // "Maybe Later"
await appReviewService.recordReviewDeclinedPermanently(); // "Never"

// Debug only
const data = await appReviewService.getReviewDebugInfo();
```

### 2. **app-review-modal.tsx** (`components/app-review-modal.tsx`)
Beautiful, non-intrusive modal component for review requests.

**Features:**
- Smooth scale + fade animations
- Three clear CTAs:
  - "Rate Now" - Opens App Store (purple button)
  - "Maybe Later" - Delays 1 week (outlined button)
  - "Never Ask Again" - Permanent dismiss (minimal button)
- Optional pre-review feedback form (commented out for now)
- Haptic feedback on interactions
- Themed to match app's dark Phasmophobia aesthetic

### 3. **use-app-review.ts** (`hooks/use-app-review.ts`)
React hook for easy integration in components.

**Usage:**
```typescript
const {
  isReviewModalVisible,
  closeReviewModal,
  checkAndShowReview,
  recordInteractionAndCheckReview,
} = useAppReview();
```

## Integration Steps

### Step 1: Add to Root Layout (`app/_layout.tsx`)

```typescript
import { AppReviewModal } from '@/components/app-review-modal';
import { useAppReview } from '@/hooks/use-app-review';

export default function RootLayout() {
  const { isReviewModalVisible, closeReviewModal } = useAppReview();

  return (
    <Stack screenOptions={...}>
      {/* Your existing screens */}
    </Stack>
    <AppReviewModal
      isVisible={isReviewModalVisible}
      onClose={closeReviewModal}
    />
  );
}
```

### Step 2: Track User Interactions

Call `recordAppInteraction()` when users complete meaningful actions. Examples:

**In `ghosts.tsx` (when user views ghost details):**
```typescript
import { useAppReview } from '@/hooks/use-app-review';

export default function GhostsScreen() {
  const { recordInteractionAndCheckReview } = useAppReview();

  const handleGhostPress = async (ghost: Ghost) => {
    // Show detail sheet
    setSelectedGhost(ghost);
    // Record interaction and check if we should show review
    await recordInteractionAndCheckReview(true); // true = check review
  };

  return (
    // ... existing code
  );
}
```

**In `equipments.tsx` (when user filters equipment):**
```typescript
const handleFilterChange = async (filter: string) => {
  setActiveFilter(filter);
  await recordInteractionAndCheckReview();
};
```

**In `sanity-calculator.tsx` (when user calculates):**
```typescript
const handleCalculate = async () => {
  const result = calculateSanity(/* ... */);
  // Record this interaction
  await recordInteractionAndCheckReview();
};
```

### Step 3: Update App Store URL

In `app-review-modal.tsx`, replace the placeholder IDs with your actual app ID:

```typescript
// Find these lines and replace 'id1234567890' with your app ID
const appStoreUrl = 'itms-apps://apps.apple.com/app/id1234567890?action=write-review';
const appStoreLink = 'https://apps.apple.com/app/id1234567890';
```

To find your app ID:
1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Select your app
3. Find "App ID" or use the URL from your App Store link

## Behavior Timeline

### User's First Day
- User completes 3+ interactions ✓
- But less than 60 days of usage
- Review prompt: **NOT shown**

### After 2 Months of Usage
- User completes any action
- Review prompt: **SHOWN**
- User sees: "Love This App? Rate us on the App Store"

### User Clicks "Rate Now"
- Opens App Store review page
- Interaction counter resets
- Next eligible review: 60+ days later

### User Clicks "Maybe Later" (First Time)
- Modal closes
- Dismiss counter increments to 1
- Next eligible review: 1 week later

### User Clicks "Maybe Later" 3 Times
- After 3rd dismiss, wait period increases
- Next eligible review: 90+ days later (instead of 60)

### User Clicks "Never Ask Again"
- Review prompts permanently disabled
- Flag stored in AsyncStorage
- **Even if app is uninstalled and reinstalled**, user won't be pestered

## Smart Features

### 1. **Interaction Tracking**
- Counts meaningful user actions
- Resets every 7 days if review hasn't been requested
- Prevents showing prompts to inactive users

### 2. **Version-Based Resets**
- Major app updates can re-enable review requests
- Users who rated on v1.0 will be asked again for v2.0
- Prevents requesting multiple reviews for same version

### 3. **Escalating Cooldown**
- First request: After 60 days
- If dismissed once: Ask again in 1 week
- If dismissed 3+ times: Ask again in 90 days
- User learns we respect their time

### 4. **Permanent Opt-Out**
- "Never Ask Again" is truly permanent
- Even after app reinstall, respected
- Improves app retention and user satisfaction

## Testing

### Debug Functions

```typescript
import { appReviewService } from '@/lib/services/appReviewService';

// Check current review eligibility
const data = await appReviewService.getReviewDebugInfo();
console.log(data);

// Reset everything (for testing)
await appReviewService.resetReviewPromptData();

// Manually trigger review check
await appReviewService.recordAppInteraction();
await appReviewService.recordAppInteraction();
await appReviewService.recordAppInteraction();
const shouldShow = await appReviewService.shouldShowReviewPrompt();
```

### Recommended Testing Flow

1. **Reset data:**
   ```typescript
   await appReviewService.resetReviewPromptData();
   ```

2. **Trigger interactions:**
   ```typescript
   for (let i = 0; i < 3; i++) {
     await appReviewService.recordAppInteraction();
   }
   ```

3. **Check eligibility:**
   ```typescript
   const should = await appReviewService.shouldShowReviewPrompt();
   // Should be true now (3+ interactions, no prior requests)
   ```

4. **Test response flows:**
   - Click "Rate Now" → Opens App Store
   - Click "Maybe Later" → Modal closes, resets timer to 1 week
   - Click "Never" → Permanently disables

## Configuration

Edit `lib/services/appReviewService.ts` to adjust:

```typescript
const CONFIG = {
  MIN_INTERACTIONS_FOR_PROMPT: 3,           // Minimum actions before eligible
  DAYS_BETWEEN_REQUESTS: 60,                // Days between review requests
  MAX_DISMISSALS_BEFORE_WAITING_LONGER: 3,  // Trigger extended wait
  EXTENDED_WAIT_DAYS: 90,                   // Extended wait period
  INTERACTION_RESET_DAYS: 7,                // Reset interactions every X days
};
```

## Analytics Integration (Optional)

Add to your analytics provider:

```typescript
// In appReviewService.ts recordReviewRequested():
logAnalytics('review_requested', { timestamp: Date.now() });

// In app-review-modal.tsx handleRateNow():
logAnalytics('review_completed', { ...feedback });

// In app-review-modal.tsx handleMaybeLater():
logAnalytics('review_dismissed', { dismiss_count: data.dismissCount });

// In app-review-modal.tsx handleNeverAsk():
logAnalytics('review_declined_permanently', {});
```

## Best Practices

### ✅ DO:
- Track interactions naturally (search, compare, filter)
- Wait 60+ days before first request
- Respect the "Never" choice permanently
- Use haptic feedback
- Include smooth animations

### ❌ DON'T:
- Show on app startup
- Request after every single action
- Ignore "Never Ask Again"
- Use popup alerts (use modal instead)
- Ask immediately after negative experiences

## Troubleshooting

### Modal isn't showing
- Check: Did you integrate `AppReviewModal` into root layout?
- Check: Have you recorded 3+ interactions?
- Check: Is enough time passed (60+ days from startup)?

### App Store link not working
- Verify App ID in `app-review-modal.tsx`
- Ensure you're testing on a real device (simulator doesn't support App Store)
- Check device has internet connection

### User still sees prompt after clicking "Never"
- Data might not have persisted
- Check AsyncStorage is working: `await AsyncStorage.getAllKeys()`
- Look for `@phasmophobia_guide/review_prompt_data` key

## Files Modified/Created

```
lib/services/appReviewService.ts      ✨ NEW - Service logic
components/app-review-modal.tsx       ✨ NEW - UI component
hooks/use-app-review.ts              ✨ NEW - React hook
app/_layout.tsx                       📝 INTEGRATE - Add modal
app/(tabs)/ghosts.tsx                 📝 INTEGRATE - Track interactions
app/(tabs)/equipments.tsx             📝 INTEGRATE - Track interactions
app/(tabs)/sanity-calculator.tsx      📝 INTEGRATE - Track interactions
```

## Success Metrics

Once integrated, track:
- **Review Request Rate:** % of users who receive prompt
- **Conversion Rate:** % who click "Rate Now"
- **Permanent Decline Rate:** % who click "Never"
- **App Store Rating:** Should improve over time
- **Retention:** Respecting preferences improves retention

## Next Steps

1. ✅ Create service and components (DONE)
2. ⬜ Update App Store URL with correct app ID
3. ⬜ Add `AppReviewModal` to root layout
4. ⬜ Add `recordInteractionAndCheckReview()` calls to key screens
5. ⬜ Test thoroughly on physical device
6. ⬜ Monitor analytics after release
