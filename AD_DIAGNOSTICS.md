# Ad System Diagnostics & Fix Guide

## 🔴 CRITICAL ISSUE FOUND

**Problem:** Android banner ad unit IDs are **placeholder values**
- `2900256420` - Never replaced (marked as TODO)
- `8559777211` - Never replaced (marked as TODO)

**Impact:** 
- AdMob is rejecting requests for invalid ad units
- This directly causes low agreement % (ads not being served)
- Revenue loss

---

## ✅ Action Items

### 1. Get Real Ad Unit IDs from AdMob
**Steps:**
1. Go to [AdMob Console](https://admob.google.com)
2. Select **PhasmophobiaGuide** app
3. Go to **Ad Units**
4. For **Android**, verify or create banner ad units:
   - **Format:** Banner or Anchored Adaptive Banner
   - **Size:** 320x50 or ANCHORED_ADAPTIVE_BANNER
   - **Copy the Ad Unit ID** (format: `ca-app-pub-XXXXXXXX/YYYYYYYYY`)
5. Create **2-3 banner units** for rotation and fallback

### 2. Update Code with Real IDs
**File:** `lib/services/admobService.ts`

**Current (WRONG):**
```typescript
const PRODUCTION_BANNER_IDS = {
  android: [
    'ca-app-pub-1542092338741994/4213338090',  // Primary ✅
    'ca-app-pub-1542092338741994/2900256420',  // ❌ PLACEHOLDER - REPLACE
    'ca-app-pub-1542092338741994/8559777211',  // ❌ PLACEHOLDER - REPLACE
  ],
};
```

**Replace with your actual AdMob ad unit IDs:**
```typescript
const PRODUCTION_BANNER_IDS = {
  android: [
    'ca-app-pub-1542092338741994/YOUR-REAL-ID-1',  // Replace
    'ca-app-pub-1542092338741994/YOUR-REAL-ID-2',  // Replace
    'ca-app-pub-1542092338741994/YOUR-REAL-ID-3',  // Replace
  ],
};
```

### 3. Verify Content Rating
**Go to:** Google Play Console → PhasmophobiaGuide → Content → App content
- ✅ Set target audience to **Teens (13+)** or **Mature (17+)**
- ✅ Complete content rating questionnaire
- ✅ Mark paranormal/horror content if applicable
- ✅ Ensure category matches app content

### 4. Test Ad Serving
**After updating ad units:**
1. Build and deploy app to test device
2. Run the diagnostic command:
   ```bash
   # In your React Native console:
   getAdSystemStatus()
   ```
3. Check logs for:
   - Banner ad loading successfully
   - No `onAdFailedToLoad` errors
   - Agreement % should improve within 24-48 hours

---

## 📊 Expected Results After Fix

| Metric | Before | After |
|--------|--------|-------|
| Agreement % | 50.34% | 80%+ |
| eCPM | €0.69 | €1.00+ |
| Impressions | 2.98K | Better fill rate |

---

## 🔍 Debugging

If agreement % doesn't improve, check:

1. **Ad Unit Status in AdMob:**
   - Go to Ad Units → Check "Status" column
   - Look for warnings (red flags)
   - Verify IDs match your app

2. **Check Logs:**
   ```typescript
   // In your app, call:
   import { getAdSystemStatus } from '@/lib/services/admobService';
   getAdSystemStatus(); // Logs full status
   ```

3. **Content Rating:**
   - AdMob may restrict paranormal content
   - Ensure questionnaire is properly filled
   - Consider "advertiser-friendly content only" setting

4. **Banner Placement:**
   - Verify banner renders without errors
   - Check banner height is correct (50px for standard)
   - Ensure no overlapping elements

---

## 📝 Next Steps

1. **Copy your AdMob ad unit IDs** from console
2. **Update `lib/services/admobService.ts`** with real IDs (lines 61-63)
3. **Redeploy app** to device
4. **Wait 24-48 hours** for AdMob to process changes
5. **Monitor agreement %** in AdMob console
6. **Expected:** Should improve to 80%+ within 2-3 days

