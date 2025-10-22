# 📊 Monetization Setup Guide

This document covers the implementation of Google AdMob ads and in-app purchases (IAP) for the Phasmophobia Guide app.

## ✅ What's Been Implemented

### 1. **AdMob Integration** ✅
- **Service**: `lib/services/admobService.ts`
  - Manages banner ads, interstitial ads, and rewarded video ads
  - Uses test IDs by default (safe for development)
  - Auto-loads ads in background
  - Proper error handling and retry logic

- **Components**:
  - `components/ad-banner.tsx` - Reusable banner ad component
  - Respects premium status (hides ads for paying users)
  - Gracefully handles load failures

### 2. **In-App Purchases (IAP)** ✅
- **Service**: `lib/services/premiumService.ts`
  - Manages premium account status
  - Handles purchase flow (event-based)
  - Restores purchases on new devices
  - Persistent storage of premium status

- **Hooks**:
  - `hooks/use-premium.ts` - Hook for managing premium status & purchases
  - `hooks/use-interstitial-ads.ts` - Hook for ad impression tracking

### 3. **UI Components** ✅
- **Paywall**: `components/premium-paywall-sheet.tsx`
  - Beautiful bottom sheet presentation
  - Displays all premium features
  - Shows pricing ($6.99 one-time)
  - Restore purchases button
  - Error handling

### 4. **App Initialization** ✅
- Updated `app/_layout.tsx` to:
  - Initialize AdMob on app launch
  - Initialize IAP service
  - Set up purchase listeners
  - Properly cleanup on app close

---

## 🔧 Next Steps: Integration into Screens

### 1. **Add Banner Ads to Home Tab**
```tsx
// app/(tabs)/index.tsx
import { AdBanner } from '@/components/ad-banner';

export default function HomeScreen() {
  return (
    <>
      {/* ... content ... */}
      <AdBanner />
    </>
  );
}
```

### 2. **Add Banner Ads to Equipment/Ghosts Lists**
```tsx
// app/(tabs)/equipments.tsx or ghosts.tsx
import { AdBanner } from '@/components/ad-banner';

return (
  <View>
    <ScrollView>
      {/* ... content ... */}
    </ScrollView>
    <AdBanner />  {/* Footer ad */}
  </View>
);
```

### 3. **Add Interstitial Ads**
```tsx
// app/(tabs)/ghosts.tsx
import { useInterstitialAds } from '@/hooks/use-interstitial-ads';

export default function GhostsScreen() {
  // Show interstitial after viewing 3 ghosts
  useInterstitialAds(`ghost-viewed-${selectedGhost?.id}`, 3);
  
  // ... rest of component
}
```

---

## 🔑 Getting Production Ad IDs

### For Google AdMob:

1. **Sign up** at [Google AdMob](https://admob.google.com)
2. **Create an app** in AdMob console
3. **Create ad units** for each placement:
   - Banner (320x50 or Adaptive)
   - Interstitial (Full-screen)
   - Rewarded Video (Optional)
4. **Copy the ad unit IDs** (format: `ca-app-pub-xxxxxxxx/yyyyyyyy`)

### Replace in `lib/services/admobService.ts`:
```typescript
// Line 23-33: Replace with your real ad IDs
const PRODUCTION_BANNER_ID = {
  ios: 'ca-app-pub-YOUR-IOS-BANNER-ID',
  android: 'ca-app-pub-YOUR-ANDROID-BANNER-ID',
};

const PRODUCTION_INTERSTITIAL_ID = {
  ios: 'ca-app-pub-YOUR-IOS-INTERSTITIAL-ID',
  android: 'ca-app-pub-YOUR-ANDROID-INTERSTITIAL-ID',
};
```

### For Apple App Store:

1. Go to **App Store Connect**
2. Select your app
3. Go to **Pricing and Availability** → **In-App Purchases**
4. Create a new **Non-Consumable** in-app purchase:
   - **Product ID**: `com.Playzzon.PhasmophobiaGuide.no_ad`
   - **Reference Name**: Remove Ads / Premium Access
   - **Price Tier**: Select your country tiers (e.g., $2.99 USD)
   - Add screenshot and description

### For Google Play Store:

1. Go to **Google Play Console**
2. Select your app
3. **Monetization** → **In-app products**
4. Create a new **In-app Product** (not subscription):
   - **Product ID**: `com.Playzzon.PhasmophobiaGuide.no_ad`
   - **Title**: Remove Ads / Premium Access
   - **Price**: Set to $2.99 USD (or regional pricing)
   - Add description

---

## 📊 Switching to Production

### Step 1: Turn Off Test Ads
In `lib/services/admobService.ts`, line 34:
```typescript
// Change from:
const USE_TEST_IDS = true;

// To:
const USE_TEST_IDS = false;
```

### Step 2: Update App ID in app.json
```json
{
  "plugins": [
    [
      "react-native-google-mobile-ads",
      {
        "iosClientId": "ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy",
        "androidClientId": "ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy"
      }
    ]
  ]
}
```

### Step 3: Update In-App Purchase SKU
Verify in `lib/services/premiumService.ts`:
```typescript
const PREMIUM_PRODUCT_ID = 'com.Playzzon.PhasmophobiaGuide.no_ad';
```

---

## 💰 Revenue Optimization Tips

### Banner Ad Placement
- ✅ **GOOD**: Bottom of screens, between sections
- ❌ **BAD**: Over important UI, interrupting content

### Interstitial Timing
- ✅ **GOOD**: After user actions (viewed 3 ghosts, used tool)
- ❌ **BAD**: Immediately on app launch, during critical tasks

### Paywall Strategy
- Show after 5-10 free uses of premium features
- Don't be too aggressive (may cause uninstalls)
- Make premium value extremely clear

---

## 🧪 Testing Checklist

### Before Launch:

- [ ] Test ads load correctly in dev
- [ ] Premium purchase flow works end-to-end
- [ ] Ads don't show for premium users
- [ ] Banner ads on all major screens
- [ ] Interstitials trigger appropriately
- [ ] Restore purchase button works
- [ ] Premium features actually hidden behind paywall
- [ ] No crashes when ads fail to load
- [ ] Dark/light theme support for ads

### After Launch:

- [ ] Monitor Ad CTR (Click-Through Rate)
- [ ] Track purchase conversion rate
- [ ] Watch for crash reports
- [ ] Monitor revenue daily
- [ ] A/B test different placements
- [ ] Adjust interstitial frequency if needed

---

## 📈 Expected Metrics

| Metric | Target | Reality |
|--------|--------|---------|
| Ad Impressions | 100K/month | TBD |
| Ad CTR | 1-3% | TBD |
| Ad Revenue | $300-800/month | TBD |
| Premium Conversion | 5-10% | TBD |
| Premium Revenue | $3-6K/month | TBD |
| **Total Monthly** | **$3-7K** | **TBD** |

---

## 🚀 Production Build Commands

### iOS:
```bash
eas build --platform ios --auto-submit
```

### Android:
```bash
eas build --platform android --auto-submit
```

---

## 📝 File Locations Reference

```
lib/services/
  ├── admobService.ts .......... AdMob management
  └── premiumService.ts ........ IAP management

hooks/
  ├── use-premium.ts ........... Premium status hook
  └── use-interstitial-ads.ts .. Ad tracking hook

components/
  ├── ad-banner.tsx ............ Banner ad component
  └── premium-paywall-sheet.tsx  Premium paywall UI

app/
  └── _layout.tsx .............. Service initialization
```

---

## ⚠️ Important Notes

1. **Test IDs**: Always use test ad IDs during development to avoid policy violations
2. **Premium Check**: Ads are automatically hidden for premium users (no manual work needed)
3. **Error Handling**: Ads fail gracefully - app never crashes if ads won't load
4. **Offline**: IAP still works offline (checks stored premium status)
5. **Restore**: Users can restore purchases if they reinstall the app

---

## 🔗 Resources

- [Google AdMob Setup](https://developers.google.com/admob/android/quick-start)
- [react-native-google-mobile-ads Docs](https://react-native-google-mobile-ads.vercel.app/)
- [react-native-iap Docs](https://react-native-iap.vercel.app/)
- [App Store Connect Guide](https://help.apple.com/app-store-connect/)
- [Google Play Console Guide](https://support.google.com/googleplay/android-developer/)

---

**Last Updated**: October 23, 2025
