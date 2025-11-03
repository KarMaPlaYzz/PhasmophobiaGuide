# Android Premium & Ad Functionality QA Report

**Generated:** November 3, 2025  
**Project:** PhasmophobiaGuide  
**Status:** Code Review Analysis (Static)

---

## Executive Summary

After comprehensive analysis of the codebase, the premium and ad functionality implementation is **well-architected** with proper error handling, graceful degradation, and platform-specific logic. However, several areas require verification through actual Android testing.

### Key Findings:
- ✅ **Well-designed architecture** with lazy-loading of native modules
- ✅ **Robust error handling** and graceful fallbacks
- ✅ **Proper app.json configuration** for AdMob plugin
- ⚠️ **Runtime verification needed** on actual Android devices/emulators
- ⚠️ **Ad serving IDs need validation** (some placeholders present)

---

## 1. Premium Functionality Status

### Implementation Details

**Location:** `/lib/services/premiumService.ts`

#### Initialization
- ✅ Uses React Native IAP v14.4.31
- ✅ Lazy-loads IAP module (only in native builds, not Expo Go)
- ✅ Proper error handling with fallback to mock premium in Expo Go

#### Purchase Flow
- ✅ Event-based architecture with EventEmitter3
- ✅ Platform-agnostic purchase request handling
- ✅ Transaction finishing/acknowledgment implemented
- ✅ Purchase listening and status updates

#### Status Management
- ✅ AsyncStorage-based persistence
- ✅ Real-time events on purchase/status changes
- ✅ Trial system support (15-minute temporary access)
- ✅ Mock premium for testing (Expo Go only)

### Verified Features:

| Feature | Status | Notes |
|---------|--------|-------|
| IAP Module Loading | ✅ | Lazy-loads with fallback |
| Purchase Request | ✅ | Platform-specific handling |
| Purchase Listener | ✅ | Event-based updates |
| Status Persistence | ✅ | AsyncStorage + events |
| Trial System | ✅ | 15-minute watch-ad trial |
| Mock Premium | ✅ | Expo Go only |
| Purchase Restore | ✅ | Implemented |

### Potential Issues & Required Testing:

1. **Firebase/RevenueCat Missing** ❌
   - **Severity:** CRITICAL
   - **Issue:** No Firebase or RevenueCat integration found
   - **Current State:** Using React Native IAP directly
   - **Risk:** 
     - No server-side receipt validation
     - No fraud prevention
     - Clients could theoretically manipulate purchase status locally
   - **Action Required:** 
     - Implement Firebase receipt validation, OR
     - Integrate RevenueCat for production safety
   - **Link:** `premiumService.ts:358-377`

2. **Product ID Hardcoded** ⚠️
   - **Severity:** MEDIUM
   - **Issue:** `PREMIUM_PRODUCT_ID = 'no_ad'` is hardcoded
   - **Current State:** Works for testing but needs validation on actual Play Store listing
   - **Action Required:** Verify SKU matches exact App Store/Play Store listing
   - **Link:** `premiumService.ts:25`

3. **No Receipt Validation** ⚠️
   - **Severity:** HIGH
   - **Issue:** Purchases are trusted without server-side verification
   - **Current State:** Client acknowledges transaction but doesn't validate
   - **Recommended:** Implement server-side receipt validation before setting premium flag
   - **Link:** `premiumService.ts:183-207`

---

## 2. Ad Functionality Status

### Implementation Details

**Location:** `/lib/services/admobService.ts`  
**Component:** `/components/ad-banner.tsx`

#### Initialization
- ✅ Lazy-loads Google Mobile Ads module
- ✅ Auto-initialized by Expo plugin
- ✅ Graceful degradation in Expo Go
- ✅ App state listener for session reset

#### Ad Types Supported

| Ad Type | Status | Frequency Capping | Notes |
|---------|--------|------------------|-------|
| Banner Ads | ✅ | N/A (persistent) | Rotation strategy with fallback |
| Interstitial Ads | ✅ | 2min between + 3/session + 6/day | Comprehensive capping |
| Rewarded Ads | ✅ | Trial system | Used for 15-min premium trial |

#### Robust Features
- ✅ Multiple banner units with rotation (improves fill rate)
- ✅ Exponential backoff retry (up to 60 seconds cap)
- ✅ Daily frequency capping (24-hour rolling window)
- ✅ Session-based capping (resets on app foreground)
- ✅ Retry with max retry limits
- ✅ Component-level error handling in AdBanner

### Verified Features:

| Feature | Status | Details |
|---------|--------|---------|
| Banner Loading | ✅ | 3 unit rotation with retry |
| Interstitial Loading | ✅ | Exponential backoff retry |
| Rewarded Loading | ✅ | Exponential backoff retry |
| Frequency Capping | ✅ | 3/session, 2min apart, 6/day |
| Retry Logic | ✅ | Max 5 retries, 60s cap |
| Expo Go Handling | ✅ | Graceful disable |
| Premium Skip | ✅ | Ads not shown for premium users |

### Critical Issues Found:

1. **Test Ad IDs for Android** ❌
   - **Severity:** CRITICAL
   - **Issue:** Using test IDs from `TestIds.REWARDED` etc.
   - **Current State:** Lines show `'test_rewarded'`, `'test_interstitial'`, etc.
   - **Problem:** Will not serve real ads on Android
   - **Action Required:** 
     - Replace with real Ad IDs from AdMob dashboard
     - Current placeholder: `'ca-app-pub-3940256099942544/5224354917'` (Google test)
   - **Location:** `admobService.ts:56-65, 194-212`
   - **Impact:** NO ads will show on Android unless fixed

2. **Production Ad IDs Not Validated** ⚠️
   - **Severity:** HIGH
   - **Issue:** Ad Unit IDs appear to be partially configured
   - **Current State:**
     - iOS IDs present: ✅ `ca-app-pub-1542092338741994/...`
     - Android IDs: ⚠️ Test placeholders `ca-app-pub-3940256099942544/...`
   - **Location:** `admobService.ts:39-54`
   - **Action Required:** 
     ```typescript
     // BEFORE (current):
     android: [
       'ca-app-pub-3940256099942544/6300978111', // TEST ID - needs replacement
     ],
     
     // AFTER (required):
     android: [
       'ca-app-pub-YOUR-APP-ID/YOUR-BANNER-UNIT-ID',
     ],
     ```

3. **USE_TEST_IDS Flag** ⚠️
   - **Severity:** MEDIUM  
   - **Issue:** Currently set to `USE_TEST_IDS = false` but Android IDs are test placeholders
   - **Current State:** Line 68: `const USE_TEST_IDS = false;`
   - **Inconsistency:** Setting says "use production" but production IDs are test placeholders
   - **Action Required:** Either:
     - Keep `USE_TEST_IDS = true` for development, OR
     - Replace Android production IDs with actual AdMob dashboard IDs
   - **Location:** `admobService.ts:68`

4. **Banner Rotation Not Fully Configured for Android** ⚠️
   - **Severity:** MEDIUM
   - **Issue:** Only one Android banner unit configured vs. three iOS units
   - **Current State:**
     ```typescript
     android: [
       'ca-app-pub-3940256099942544/6300978111', // Only one unit
     ],
     ```
   - **Recommendation:** Add multiple Android banner units for rotation:
     ```typescript
     android: [
       'ca-app-pub-YOUR-APP-ID/BANNER-UNIT-1',
       'ca-app-pub-YOUR-APP-ID/BANNER-UNIT-2',
       'ca-app-pub-YOUR-APP-ID/BANNER-UNIT-3',
     ],
     ```
   - **Location:** `admobService.ts:49-52`

5. **AdMob App ID Might Be Test** ❌
   - **Severity:** HIGH
   - **Issue:** App IDs in `app.json` need verification
   - **Current State:** `app.json` lines 26-30:
     ```json
     "iosAppId": "ca-app-pub-1542092338741994~7842939410",
     "androidAppId": "ca-app-pub-3940256099942544~3347511713"
     ```
   - **Problem:** Android app ID `3940256099942544` is Google's test account
   - **Required Action:** 
     - Verify iOS app ID matches your actual AdMob account
     - **CRITICAL:** Replace Android app ID with your actual AdMob Android app ID from dashboard
   - **Location:** `app.json:26-30`

---

## 3. Configuration Analysis

### app.json - AdMob Plugin Configuration

```json
{
  "plugins": [
    [
      "react-native-google-mobile-ads",
      {
        "iosAppId": "ca-app-pub-1542092338741994~7842939410",
        "androidAppId": "ca-app-pub-3940256099942544~3347511713"  // ⚠️ TEST ID
      }
    ]
  ]
}
```

**Status:** ⚠️ Android App ID is test account  
**Action:** Replace with actual AdMob Android app ID

### AndroidManifest.xml Integration

The plugin should auto-generate manifest entries for:
- Google Play Services
- AdMob initialization
- Required permissions

**Verification Needed:** Build and check generated `android/app/src/main/AndroidManifest.xml`

### Gradle Configuration

**File:** `android/app/build.gradle`

```groovy
dependencies {
  // React Native IAP
  // (auto-linked by autolinkLibrariesWithApp())
  
  // Google Mobile Ads
  // (auto-linked by autolinkLibrariesWithApp())
}
```

**Status:** ✅ Using Expo auto-linking  
**Verification:** Run `eas build --platform android --local` to verify all dependencies resolve

### ProGuard Rules

**File:** `android/app/proguard-rules.pro`

Current rules:
```proguard
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }
```

**Missing Rules:** ⚠️ May need additional rules for:
- React Native IAP
- Google Mobile Ads
- RevenueCat (if added)

**Recommendation:**
```proguard
# Google Mobile Ads
-keep class com.google.android.gms.ads.** { *; }
-keep interface com.google.android.gms.ads.** { *; }

# React Native IAP
-keep class com.reactnative.iap.** { *; }
-keep interface com.reactnative.iap.** { *; }

# Existing rules
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }
```

**Location:** `android/app/proguard-rules.pro`

---

## 4. Premium Paywall Component

**Location:** `/components/premium-paywall-sheet.tsx`

### Features Implemented:
- ✅ Trial button (watch rewarded ad → 15-minute premium access)
- ✅ Purchase button (direct IAP purchase)
- ✅ Restore button (for users on new device)
- ✅ Error handling with user alerts
- ✅ Mock premium for Expo Go
- ✅ Loading states

### Potential Issues:

1. **Trial System Dependency** ⚠️
   - Trial requires rewarded ad to be ready
   - If rewarded ad fails to load, trial button is disabled
   - **Acceptable:** This is intentional design

2. **No Subscription Flow** ℹ️
   - Current implementation: One-time $2.99 purchase
   - No subscription support (auto-renewing)
   - **Note:** This may be intentional

---

## 5. Android-Specific Concerns

### Known Android Native Module Issues:

1. **React Native IAP on Android** ⚠️
   - Requires Play Billing Library integration (handled by Expo)
   - Must have Google Play Services installed on device
   - Testing requires real device or properly configured emulator
   - **Verification needed on actual Android device**

2. **Google Mobile Ads on Android** ⚠️
   - Requires Google Play Services
   - May have fill rate issues on emulators
   - Network requests must succeed (emulator networking needed)
   - **Verification needed on actual Android device**

3. **Layout Animations** ✅
   - Already handled: `collapsible-section-animation.tsx` and `index.tsx`
   - Check: `Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental`
   - Status: Properly implemented

---

## 6. Testing Checklist

### Before Production:

- [ ] **Build & Deploy**
  - [ ] Run: `eas build --platform android --local`
  - [ ] Verify all dependencies resolve
  - [ ] Check for build warnings/errors
  - [ ] Test on Android emulator
  - [ ] Test on real Android device

- [ ] **Premium Functionality (Android)**
  - [ ] Verify Play Store IAP product SKU is "no_ad"
  - [ ] Attempt purchase flow (use test account)
  - [ ] Verify purchase is recorded in AsyncStorage
  - [ ] Verify ads disappear after purchase
  - [ ] Test restore purchases on new device simulation
  - [ ] Test mock premium in dev builds

- [ ] **Ad Functionality (Android)**
  - [ ] Replace test Ad Unit IDs with production IDs
  - [ ] Replace Android App ID in `app.json`
  - [ ] Verify banner ads load (may fail on emulator without connectivity)
  - [ ] Verify banner rotation on failure
  - [ ] Verify interstitial ads show at appropriate times
  - [ ] Verify frequency capping works (3/session, 2min apart)
  - [ ] Verify rewarded ads show for trial
  - [ ] Verify ads are hidden for premium users
  - [ ] Test ad retry logic by blocking internet
  - [ ] Check logs for exponential backoff behavior

- [ ] **Security**
  - [ ] Implement server-side receipt validation (Firebase or RevenueCat)
  - [ ] Add user ID/authentication if applicable
  - [ ] Monitor for fraud patterns
  - [ ] Test disabling premium to verify ads show

- [ ] **Logs & Debugging**
  - [ ] Run: `adb logcat | grep -E '\[Premium\]|\[AdMob\]|\[AdBanner\]'`
  - [ ] Check for initialization success messages
  - [ ] Verify no unhandled exceptions
  - [ ] Monitor retry attempts

---

## 7. Issues Summary

### Critical Issues (Must Fix Before Release):

| # | Issue | Severity | File | Action |
|---|-------|----------|------|--------|
| 1 | No receipt validation | CRITICAL | `premiumService.ts` | Implement Firebase or RevenueCat |
| 2 | Android App ID is test | CRITICAL | `app.json` | Replace with real AdMob Android app ID |
| 3 | Android ad unit IDs are test | CRITICAL | `admobService.ts:39-54` | Replace with real production IDs |
| 4 | USE_TEST_IDS=false with test IDs | CRITICAL | `admobService.ts:68` | Fix configuration mismatch |

### High Priority Issues:

| # | Issue | Severity | File | Action |
|---|-------|----------|------|--------|
| 5 | Missing ProGuard rules | HIGH | `proguard-rules.pro` | Add Google Mobile Ads & IAP rules |
| 6 | Limited Android banner rotation | MEDIUM | `admobService.ts:49-52` | Add more Android banner units |
| 7 | Product ID hardcoded | MEDIUM | `premiumService.ts:25` | Verify matches Play Store listing |

### Medium Priority (Recommendations):

| # | Item | File | Note |
|---|------|------|------|
| 8 | Update subscription flow | `premium-paywall-sheet.tsx` | Consider auto-renewing subscriptions |
| 9 | Add revenue tracking | `admobService.ts` | Integrate with Firebase Analytics |
| 10 | Add crash reporting | `app/_layout.tsx` | Sentry or Firebase Crashlytics |

---

## 8. Success Criteria

### For Production Release:

✅ All critical issues resolved  
✅ Premium functionality tested on real Android device  
✅ Ads serving real units (not test IDs)  
✅ No unhandled exceptions in logs  
✅ Receipt validation implemented  
✅ ProGuard rules preventing crashes on minified builds  

---

## Next Steps

1. **Immediate:** Fix AdMob configuration (app ID and ad unit IDs)
2. **High Priority:** Implement receipt validation
3. **Testing:** Run on Android emulator and real device
4. **Monitoring:** Set up Firebase Analytics for ad revenue tracking
5. **Security:** Implement anti-fraud measures

---

## Appendix: Code References

### Key Service Files:
- Premium: `/lib/services/premiumService.ts` (527 lines)
- AdMob: `/lib/services/admobService.ts` (788 lines)
- Ad Banner: `/components/ad-banner.tsx` (well-structured with retry logic)
- Premium Paywall: `/components/premium-paywall-sheet.tsx`

### Configuration Files:
- App: `/app.json`
- Android Build: `/android/app/build.gradle`
- ProGuard: `/android/app/proguard-rules.pro`
- Gradle Props: `/android/gradle.properties`

### Package Versions:
- react-native-google-mobile-ads: ^15.8.3
- react-native-iap: ^14.4.31
- React Native: 0.81.4
- Expo: ~54.0.13

---

**Report Generated:** 2025-11-03  
**Status:** Code Analysis Complete - Physical Testing Required
