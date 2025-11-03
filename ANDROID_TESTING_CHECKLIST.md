# Android Premium & Ad Functionality - Testing Checklist

**App:** PhasmophobiaGuide  
**Date:** 2025-11-03  
**Status:** Ready for Android Build & Testing

---

## 🔴 PRE-BUILD FIXES REQUIRED

### AdMob Configuration
- [ ] **Get your real AdMob IDs** from [admob.google.com](https://admob.google.com)
  - [ ] Android App ID (format: `ca-app-pub-XXXXX~YYYYY`)
  - [ ] Banner Ad Unit ID
  - [ ] Interstitial Ad Unit ID  
  - [ ] Rewarded Ad Unit ID

- [ ] **Update `app.json`**
  ```json
  "androidAppId": "YOUR-REAL-ID-HERE"
  ```

- [ ] **Update `lib/services/admobService.ts`**
  ```typescript
  // Line 49-52 (Banner Android):
  android: [
    'YOUR-REAL-BANNER-ID-1',
    'YOUR-REAL-BANNER-ID-2', // Add more for rotation
    'YOUR-REAL-BANNER-ID-3',
  ],
  
  // Line 51 (Interstitial Android):
  android: 'YOUR-REAL-INTERSTITIAL-ID',
  
  // Line 53 (Rewarded Android):
  android: 'YOUR-REAL-REWARDED-ID',
  ```

- [ ] **Verify Play Store IAP**
  - [ ] Product SKU is set to `"no_ad"` in Play Store
  - [ ] Price set to $2.99
  - [ ] Product status is "ACTIVE"

- [ ] **Add ProGuard Rules**
  - [ ] Edit `android/app/proguard-rules.pro`
  - [ ] Add Google Mobile Ads rules
  - [ ] Add React Native IAP rules

---

## 🟡 BUILD & DEPLOY

### Build APK for Testing
```bash
# Clean build
eas build --platform android --local

# Or with specific profile
eas build --platform android --local --profile preview
```

- [ ] Build completes without errors
- [ ] APK generated successfully
- [ ] Check for warnings in build log
- [ ] Verify all dependencies resolved:
  - [ ] react-native-google-mobile-ads
  - [ ] react-native-iap
  - [ ] GooglePlayServicesAds
  - [ ] GooglePlayServicesBilling

### Deploy to Device
- [ ] Connect Android device via USB
- [ ] Enable Developer Mode and USB Debugging
- [ ] Install APK: `adb install app-debug.apk`
- [ ] Verify app installs without errors

---

## 🟢 FUNCTIONAL TESTING

### Premium Purchase Flow
- [ ] App launches without crashes
- [ ] Settings sheet shows "✨ Premium" section (non-premium users)
- [ ] Tap "Unlock Premium" button
- [ ] Premium paywall sheet appears with:
  - [ ] Feature cards displayed
  - [ ] $2.99 price shown
  - [ ] Watch Ad trial button (if rewarded ad ready)
  - [ ] Purchase button visible
- [ ] Tap "Restore Purchases" (first-time user)
  - [ ] No crash
  - [ ] Appropriate message
- [ ] Tap "Watch Ad for Trial"
  - [ ] Rewarded ad plays (if available)
  - [ ] User notified of 15-min trial
  - [ ] Ads disappear for 15 minutes
  - [ ] After 15 min, ads return
- [ ] Tap "Purchase" button
  - [ ] Play Store billing appears
  - [ ] Purchase completes (use test account)
  - [ ] App returns to paywall
  - [ ] Premium status shows as "✨ Premium Unlocked"
  - [ ] Ads disappear permanently
  - [ ] Settings shows "✅ Premium Unlocked"

### Ad Display
- [ ] **Banner Ads**
  - [ ] Banner appears at bottom of screens
  - [ ] Banner is touchable
  - [ ] Ad rotates if first fails (check logs)
  - [ ] Hidden for premium users
  - [ ] No banner for premium after purchase

- [ ] **Interstitial Ads**
  - [ ] Show after screen transitions
  - [ ] Only show every 2+ minutes
  - [ ] Max 3 per session
  - [ ] Max 6 per 24 hours
  - [ ] Not shown to premium users
  - [ ] Can close/dismiss

- [ ] **Rewarded Ads**
  - [ ] Play for trial or other rewards
  - [ ] Full-screen immersive experience
  - [ ] User can close before reward
  - [ ] Reward granted after completion

### Frequency Capping
- [ ] Close and reopen app
- [ ] Check that session counter reset (new ads should show)
- [ ] Note times of ads shown
- [ ] Verify 2+ minute spacing between interstitials
- [ ] Monitor over 24 hours that max 6 daily limit holds

### Ad Fallback & Retry
- [ ] **Disable Internet**
  - [ ] Banner shows spinner
  - [ ] After 10s, spinner disappears
  - [ ] Ad keeps retrying in background
- [ ] **Re-enable Internet**
  - [ ] Banner successfully loads
  - [ ] Spinner clears
- [ ] **Check Logs** (adb logcat)
  ```bash
  adb logcat | grep -E '\[Premium\]|\[AdMob\]|\[AdBanner\]'
  ```
  - [ ] No error spam
  - [ ] Exponential backoff visible
  - [ ] Successful load messages

### Premium Status Persistence
- [ ] Purchase premium
- [ ] Force stop app (Settings → Apps → PhasmophobiaGuide → Force Stop)
- [ ] Reopen app
- [ ] Verify premium status retained
- [ ] Ads still hidden

### Mock Premium (Dev Builds Only)
- [ ] In Settings, scroll to "🧪 Mock Premium" section
- [ ] Toggle "Enable Mock Premium"
- [ ] All premium features unlock
- [ ] Ads disappear
- [ ] Toggle off
- [ ] Ads return

---

## 🔍 DEBUGGING & LOGS

### Monitor Initialization
```bash
adb logcat | grep -E '\[App\]|\[Premium\]|\[AdMob\]'
```

**Look for:**
- [ ] `[App] Initializing AdMob`
- [ ] `[App] AdMob initialized successfully`
- [ ] `[App] Initializing Premium`
- [ ] `[App] Premium initialized successfully`
- [ ] `[AdMob] === INITIALIZING ADMOB SERVICE ===`
- [ ] `[AdMob] ✅ Ads available`

### Monitor Ad Loading
```bash
adb logcat | grep '\[AdMob\]'
```

**Look for:**
- [ ] `[AdMob] === LOADING INTERSTITIAL AD ===`
- [ ] `[AdMob] ✅ Interstitial ad loaded successfully`
- [ ] `[AdMob] === LOADING REWARDED AD ===`
- [ ] `[AdMob] ✅ Rewarded ad loaded successfully`

**If failing:**
- [ ] `[AdMob] ❌ Interstitial ad failed to load`
- [ ] Check error code and message
- [ ] Verify ad unit ID is correct
- [ ] Check network connectivity

### Monitor Premium
```bash
adb logcat | grep '\[Premium\]'
```

**Look for:**
- [ ] `[Premium] Connection established`
- [ ] `[Premium] Checked for existing purchases`
- [ ] `[Premium] Purchase updated`
- [ ] `[Premium] Premium purchased, emitting event`
- [ ] No `[Premium] Error` messages

### Banner Component Logs
```bash
adb logcat | grep '\[AdBanner\]'
```

**Look for:**
- [ ] `[AdBanner] Banner ad loaded successfully`
- [ ] `[AdBanner] Banner rotation` (if failures occurred)
- [ ] Not excessive retry messages (max ~8)

---

## ❌ KNOWN ISSUES & WORKAROUNDS

### Google Play Services Not Available
- **Symptom:** App crashes with "Google Play Services Not Available"
- **Cause:** Emulator doesn't have Google Play installed
- **Solution:** 
  - [ ] Use Android device with Google Play Services
  - [ ] Or use Genymotion emulator with Google Play
  - [ ] Or ignore ads on emulator (expected limitation)

### Network Issues on Emulator
- **Symptom:** Ads fail to load
- **Cause:** Emulator network isolation
- **Solution:**
  - [ ] Use real device for testing
  - [ ] Or configure emulator network: `emulator -avd MyPhone -netfast`

### IAP Not Available on Emulator
- **Symptom:** Purchase button does nothing
- **Cause:** Play Billing requires Google Play
- **Solution:**
  - [ ] Must use real device with Play Store
  - [ ] Mock premium toggle for development

### Ads Show as Blank/White
- **Symptom:** Ad space visible but no creative
- **Cause:** Test account showing blank placeholders
- **Solution:**
  - [ ] Normal for test accounts (expected)
  - [ ] Verify prod IDs once in real account

---

## 📊 POST-TESTING VERIFICATION

After all tests pass, confirm:

### Performance
- [ ] App startup time < 3 seconds
- [ ] No UI lag when ads load
- [ ] No memory leaks (use Android Profiler)
- [ ] Battery usage reasonable

### Stability
- [ ] 0 crashes across test run
- [ ] No ANR (Application Not Responding) dialogs
- [ ] No force closes

### Revenue
- [ ] Verify ad impressions in AdMob dashboard
- [ ] Check estimated earnings
- [ ] Verify IAP revenue in Play Console

### Security
- [ ] [ ] Implement server-side receipt validation
- [ ] [ ] No purchase data logged to client logs
- [ ] [ ] No hardcoded credentials visible

---

## ✅ FINAL CHECKLIST BEFORE RELEASE

- [ ] All critical AdMob IDs replaced with production
- [ ] ProGuard rules added
- [ ] All tests pass on real Android device
- [ ] No crashes in logs
- [ ] Receipt validation implemented
- [ ] Firebase/RevenueCat integrated
- [ ] Play Store listing complete
- [ ] Privacy policy updated
- [ ] Testing complete
- [ ] Ready for beta release

---

## 📞 SUPPORT RESOURCES

- **Google AdMob:** https://admob.google.com/
- **Google Play Console:** https://play.google.com/console
- **React Native IAP Docs:** https://github.com/react-native-iap/react-native-iap
- **React Native Google Mobile Ads:** https://github.com/invertase/react-native-google-mobile-ads
- **Expo Docs:** https://docs.expo.dev/

---

**Generated:** 2025-11-03  
**Last Updated:** Ready for Build & Test Phase
