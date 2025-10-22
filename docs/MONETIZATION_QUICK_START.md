# 📱 Quick Start: Adding Monetization to Screens

## Copy-Paste Solutions

### 1️⃣ Add Banner Ads (Copy & Paste)

**File**: `app/(tabs)/index.tsx` or any screen

```tsx
// At the top
import { AdBanner } from '@/components/ad-banner';

// In your component JSX (at the bottom before closing tags):
export default function HomeScreen() {
  return (
    <>
      <ThemedView style={styles.container}>
        <ScrollView>
          {/* Your content here */}
        </ScrollView>
      </ThemedView>
      
      {/* Add this line - that's it! */}
      <AdBanner />
    </>
  );
}
```

**That's it!** The banner will:
- ✅ Auto-hide if user is premium
- ✅ Auto-hide if ads fail to load
- ✅ Handle all errors gracefully
- ✅ Support dark/light theme

---

### 2️⃣ Add Interstitial Ads (Copy & Paste)

**File**: `app/(tabs)/ghosts.tsx`

```tsx
// At the top
import { useInterstitialAds } from '@/hooks/use-interstitial-ads';

export default function GhostsScreen() {
  const [selectedGhost, setSelectedGhost] = useState<Ghost | null>(null);
  
  // Add this line - show ad after viewing 3 ghosts
  useInterstitialAds(`ghost-view-${selectedGhost?.id}`, 3);
  
  // Rest of your component...
  return (
    // Your JSX
  );
}
```

**That's it!** It will:
- ✅ Track views automatically
- ✅ Show interstitial every 3 times
- ✅ Auto-skip if user is premium
- ✅ Never break the app

---

### 3️⃣ Show Paywall Manually

**When to use**: When user tries to use a premium feature

```tsx
import { useState } from 'react';
import { Pressable } from 'react-native';
import { usePremium } from '@/hooks/use-premium';

export default function MyScreen() {
  const { isPremium } = usePremium();
  const [showPaywall, setShowPaywall] = useState(false);
  
  const handlePremiumFeature = () => {
    if (isPremium) {
      // Show feature
      doSomethingCool();
    } else {
      // Show paywall
      setShowPaywall(true);
    }
  };
  
  return (
    <Pressable onPress={handlePremiumFeature}>
      <Text>Premium Feature (Just $2.99!)</Text>
    </Pressable>
  );
}
```

---

## 🎯 Recommended Placements

### Banner Ads - Where to Add

```
Priority 1 (Must have):
├─ app/(tabs)/index.tsx
│  └─ Footer of home screen
└─ app/(tabs)/equipments.tsx
   └─ Footer of equipment list

Priority 2 (Should have):
├─ app/(tabs)/ghosts.tsx
│  └─ Footer of ghost list
└─ app/(tabs)/evidence.tsx
   └─ Footer of evidence list

Priority 3 (Nice to have):
└─ app/(tabs)/sanity-calculator.tsx
   └─ Footer of calculator
```

### Interstitial Ads - When to Show

```
Good triggers:
├─ After viewing 3+ ghosts
├─ After comparing 2+ equipment builds
├─ After using evidence identifier
└─ After visiting 2+ maps

NOT recommended:
├─ ❌ On app launch
├─ ❌ During search
├─ ❌ While user is typing
└─ ❌ On critical buttons
```

---

## 🧪 Testing Checklist

```
✅ Ads load: npx expo start → Check console logs
✅ Premium hides ads: Close app, purchase (sandbox), reopen
✅ Interstitials show: Navigate 3+ times through triggers
✅ No crashes: Leave app running 5 mins with ads
✅ Dark mode: Toggle settings → Check ad appearance
✅ Offline: Disconnect WiFi → Ads should still work
```

---

## 💰 How to See Revenue

### View in Test/Development:

```
Google AdMob:
1. Visit admob.google.com (after setting up account)
2. Dashboard shows impressions & estimated earnings
3. Revenue calculated every 24 hours
4. Payments go to registered AdSense account

In-App Purchases:
1. App Store Connect: Reports → Sales and Trends
2. Google Play Console: Monetize → Earnings
3. Real-time data updated every ~hour
```

---

## ⚠️ Common Issues & Fixes

### Issue: Ads not showing
```
Solution:
├─ Check console for errors
├─ Ensure usePremium() shows isPremium = false
├─ Check internet connection
├─ Verify ad IDs in admobService.ts
└─ Restart app
```

### Issue: Premium purchase not working
```
Solution:
├─ On iOS: Use sandbox account (Settings → iTunes)
├─ On Android: Use Google Play test account
├─ Check product SKU matches store config
├─ Ensure account has purchase history
└─ Check AdMob test ads not interfering
```

### Issue: Paywall doesn't appear
```
Solution:
├─ Ensure isPremium state is updating
├─ Check if component is rendered
├─ Verify snap points in BottomSheet
├─ Check console for errors
└─ Test with real device
```

---

## 📊 File Reference

```
Core Infrastructure:
├─ lib/services/admobService.ts ........... Ads
├─ lib/services/premiumService.ts ........ IAP
├─ hooks/use-premium.ts .................. Premium state
├─ hooks/use-interstitial-ads.ts ......... Ad tracking
├─ components/ad-banner.tsx ............. Banner component
└─ components/premium-paywall-sheet.tsx .. Paywall UI

Config:
└─ app.json .............................. Plugin config

Initialization:
└─ app/_layout.tsx ....................... Service init

Documentation:
├─ docs/MONETIZATION_SETUP.md ........... Setup guide
├─ docs/MONETIZATION_ARCHITECTURE.md ... Architecture
└─ docs/MONETIZATION_IMPLEMENTATION_COMPLETE.md .. Summary
```

---

## 🚀 Production Launch Checklist

```
Pre-Launch:
□ Add <AdBanner /> to 3 screens
□ Add useInterstitialAds() hooks to 2 screens
□ Get Google AdMob account
□ Create iOS in-app product
□ Create Android in-app product
□ Update admobService.ts with real IDs
□ Update app.json with AdMob client IDs

At Launch:
□ Set USE_TEST_IDS = false
□ eas build --platform ios --auto-submit
□ eas build --platform android --auto-submit
□ Monitor first 24 hours

Post-Launch:
□ Track daily revenue
□ Monitor ad performance
□ A/B test placements
□ Adjust interstitial frequency if needed
```

---

**Ready to go! 🎉**

Questions? Check the full docs:
- 📖 `docs/MONETIZATION_SETUP.md` - Complete setup guide
- 🏗️ `docs/MONETIZATION_ARCHITECTURE.md` - Architecture deep-dive
- ✅ `docs/MONETIZATION_IMPLEMENTATION_COMPLETE.md` - Implementation summary
