# Android Premium/Ad Functionality - Quick Issue Summary

## 🚨 CRITICAL ISSUES (Must Fix)

### 1. Android AdMob App ID is Test Account ❌
- **File:** `app.json:29`
- **Current:** `"androidAppId": "ca-app-pub-3940256099942544~3347511713"`
- **Problem:** This is Google's test account ID, not your actual AdMob account
- **Fix:** Replace with your actual AdMob Android app ID from Google AdMob dashboard

### 2. Android Ad Unit IDs are Test Placeholders ❌
- **File:** `lib/services/admobService.ts:39-54`
- **Current:**
  ```typescript
  android: [
    'ca-app-pub-3940256099942544/6300978111', // TEST ID
  ],
  // ... and similar for interstitial and rewarded
  ```
- **Problem:** Will not serve real ads - using Google's test units
- **Fix:** Replace all Android ad unit IDs with your production IDs from AdMob

### 3. No Receipt Validation for Purchases ❌
- **File:** `lib/services/premiumService.ts`
- **Problem:** App trusts client-side purchase without server verification
- **Risk:** Users could potentially fake purchases locally
- **Fix:** Implement Firebase receipt validation or use RevenueCat

### 4. Misconfigured Test Mode ❌
- **File:** `lib/services/admobService.ts:68`
- **Setting:** `const USE_TEST_IDS = false;`
- **Problem:** Says "use production IDs" but Android IDs are test placeholders
- **Fix:** Align configuration with actual IDs or set to `true` for development

---

## ⚠️ HIGH PRIORITY ISSUES

### 5. Missing Android ProGuard Rules
- **File:** `android/app/proguard-rules.pro`
- **Problem:** No rules for Google Mobile Ads or React Native IAP
- **Impact:** Potential crashes in production builds with minification
- **Fix:** Add ProGuard rules for both libraries

### 6. Limited Android Banner Ad Rotation
- **File:** `lib/services/admobService.ts:49-52`
- **Problem:** Only 1 Android banner unit vs. 3 iOS units
- **Impact:** Lower fill rates and fewer fallback options
- **Fix:** Create 2-3 Android banner units and add to rotation

### 7. Product ID Hardcoded
- **File:** `lib/services/premiumService.ts:25`
- **Value:** `'no_ad'`
- **Action:** Verify this SKU exactly matches your Play Store listing

---

## ✅ WORKING CORRECTLY

- ✅ Premium status persistence (AsyncStorage)
- ✅ Trial system (watch rewarded ad for 15 min trial)
- ✅ Ad frequency capping (3/session, 6/day, 2min apart)
- ✅ Exponential backoff retry logic
- ✅ Graceful error handling
- ✅ Expo Go compatibility
- ✅ Layout animations for Android
- ✅ Event-based architecture

---

## 📋 REQUIRED BEFORE ANDROID RELEASE

### Configuration
- [ ] Replace Android App ID in `app.json`
- [ ] Replace Android ad unit IDs (banner, interstitial, rewarded)
- [ ] Add ProGuard rules for Google Mobile Ads and React Native IAP
- [ ] Add 2-3 more Android banner units for rotation

### Testing
- [ ] Build APK: `eas build --platform android --local`
- [ ] Test on Android emulator
- [ ] Test on real Android device
- [ ] Verify premium purchase works
- [ ] Verify ads show (not test ads)
- [ ] Verify ads hidden for premium users
- [ ] Verify frequency capping

### Security
- [ ] Implement server-side receipt validation
- [ ] Integrate Firebase or RevenueCat
- [ ] Add monitoring for suspicious purchases

---

## 📁 Key Files to Update

1. **app.json**
   - Line 29: Android App ID

2. **lib/services/admobService.ts**
   - Lines 39-54: Android ad unit IDs
   - Line 68: USE_TEST_IDS flag

3. **android/app/proguard-rules.pro**
   - Add Google Mobile Ads rules
   - Add React Native IAP rules

4. **lib/services/premiumService.ts**
   - Lines 358-377: Add receipt validation (Firebase/RevenueCat)

---

## Quick Reference: Ad Unit IDs to Replace

### Current (Test):
```
Banner Android: ca-app-pub-3940256099942544/6300978111
Interstitial Android: ca-app-pub-3940256099942544/1033173712
Rewarded Android: ca-app-pub-3940256099942544/5224354917
App ID Android: ca-app-pub-3940256099942544~3347511713
```

### Action:
Find your real IDs in [Google AdMob Dashboard](https://admob.google.com) → Apps → Your App → Ad Units

Then replace all "3940256099942544" with your actual publisher ID
