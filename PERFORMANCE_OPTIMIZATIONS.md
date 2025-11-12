# Performance Optimization Recommendations
## Phasmophobia Guide App - Fast Loading & Smooth Animations

---

## 📊 Current State Analysis
The app has a solid foundation with:
- ✅ Animation libraries (React Native Reanimated)
- ✅ Memoization patterns (useMemo, useCallback)
- ✅ Lazy loading capabilities
- ✅ Component-level animations (Staggered, Evidence Collection, Ghost Comparison)
- ✅ Haptic feedback integration

---

## 🚀 Priority 1: Critical Performance Bottlenecks

### 1. **Implement React.memo() for List Components**
**Impact:** High | **Effort:** Low | **Priority:** 🔴 Critical

**Current Issue:** 
- List items (ghosts, equipment, bookmarks) re-render unnecessarily when parent state changes
- Each item in `GhostsScreen`, `EquipmentScreen`, and bookmarks causes full re-render

**Solution:**
```tsx
// Before
const GhostListItem = ({ ghost, onPress }) => (...)

// After
const GhostListItem = React.memo(({ ghost, onPress }) => (...), (prev, next) => {
  return prev.ghost.id === next.ghost.id && prev.onPress === next.onPress;
})
```

**Files to Update:**
- `app/(tabs)/ghosts.tsx` - Ghost list items
- `app/(tabs)/equipments.tsx` - Equipment list items
- `components/bookmarks-detail-sheet.tsx` - Bookmark items
- `components/equipment-optimizer-sheet.tsx` - Result list items

**Expected Improvement:** 30-40% reduction in unnecessary re-renders

---

### 2. **Lazy Load Heavy Data Imports**
**Impact:** High | **Effort:** Medium | **Priority:** 🔴 Critical

**Current Issue:**
- All ghost data, equipment, maps loaded at app startup
- Large JSON objects in memory even if not currently visible
- `GHOST_LIST`, `ALL_EQUIPMENT`, `ALL_MAPS` loaded immediately

**Solution:**
```tsx
// Create lazy modules
// lib/data/ghosts-lazy.ts
export const loadGhosts = () => import('./ghosts').then(m => m.GHOSTS);

// Use in components
const [ghosts, setGhosts] = useState([]);
useEffect(() => {
  loadGhosts().then(setGhosts);
}, []);
```

**Files to Update:**
- `lib/data/ghosts.ts` → Create lazy wrapper
- `lib/data/equipment.ts` → Create lazy wrapper
- `lib/data/maps.ts` → Create lazy wrapper
- Update imports in main tabs

**Expected Improvement:** 20-35% faster app startup

---

### 3. **Virtualization for Long Lists**
**Impact:** High | **Effort:** Medium | **Priority:** 🔴 Critical

**Current Issue:**
- Rendering all 24 ghosts/items at once, even if not visible
- ScrollView renders everything in memory
- Poor performance on lower-end devices

**Solution:**
```tsx
import { FlashList } from '@shopify/flash-list';

// Replace ScrollView + map with FlashList
<FlashList
  data={ghosts}
  renderItem={({ item }) => <GhostItem ghost={item} />}
  keyExtractor={(item) => item.id}
  estimatedItemSize={80}
  scrollEventThrottle={16}
/>
```

**Files to Update:**
- `app/(tabs)/ghosts.tsx`
- `app/(tabs)/equipments.tsx`
- `components/bookmarks-detail-sheet.tsx`
- `components/ghost-comparison-sheet.tsx`
- `app/(tabs)/evidence.tsx` (for identified ghosts list)

**Expected Improvement:** 50-70% faster scrolling, lower memory usage

---

## 🎨 Priority 2: Animation Performance

### 4. **Optimize Staggered Animation Delays**
**Impact:** High | **Effort:** Low | **Priority:** 🟠 High

**Current Issue:**
- Staggered animations with 50ms delay per item can be slow (24 items = 1200ms)
- Creating too many animated views impacts frame rate

**Solution:**
```tsx
// Reduce delay multiplier for large lists
// Smart adjustment based on list size
const delayMultiplier = itemCount > 10 ? 25 : 50; // Fewer delays for long lists

// Or batch animate in groups
const batchSize = 5;
const delay = (index % batchSize) * 50 + Math.floor(index / batchSize) * 100;
```

**File:** `components/staggered-list-animation.tsx`

**Expected Improvement:** 200-400ms faster list appearance

---

### 5. **Reduce Animation Complexity**
**Impact:** Medium | **Effort:** Low | **Priority:** 🟠 High

**Current Issue:**
- Multiple animations running simultaneously (zoom, fade, scale, layout)
- `GhostComparisonAnimation` uses 3 animation types
- `Equipment` sheets with complex transitions

**Solution:**
```tsx
// Simplify animations - use spring instead of multiple transforms
// Before: ZoomIn + FadeInDown + Layout
// After: FadeInDown + Layout only (simpler, faster)

// Use faster animation presets
entering={FadeInDown.springify().damping(15)} // Increased damping = less computation
```

**Files to Update:**
- `components/ghost-comparison-animation.tsx`
- `components/equipment-optimizer-sheet.tsx`
- `components/bookmarks-detail-sheet.tsx`

**Expected Improvement:** 15-25% smoother 60fps maintenance

---

### 6. **Add `scrollEventThrottle` to All Scrollable Components**
**Impact:** Medium | **Effort:** Low | **Priority:** 🟠 High

**Current Issue:**
- Some ScrollViews fire scroll events 60 times per second
- Causes unnecessary re-renders and animation calculations

**Solution:**
```tsx
<ScrollView scrollEventThrottle={16}> {/* Fire events every 16ms = 60fps */}
  {/* content */}
</ScrollView>

// For bottom sheets using scroll-based animations
<ScrollView scrollEventThrottle={1}> {/* Higher frequency for parallax */}
```

**Files to Update:**
- `components/map-detail-sheet.tsx`
- `components/ghost-detail-sheet.tsx`
- `components/parallax-scroll-view.tsx`
- Evidence identifier sheet

**Expected Improvement:** 20-30% reduction in event handler calls

---

## 💾 Priority 3: Bundle & Memory Optimization

### 7. **Image Optimization & Lazy Loading**
**Impact:** Medium | **Effort:** Medium | **Priority:** 🟡 Medium

**Current Issue:**
- All ghost/equipment images loaded from Fandom wiki
- No caching or optimization
- Avatar images loaded eagerly
- High-resolution images served to low-end devices

**Solution:**
```tsx
// Use expo-image with caching
import { Image } from 'expo-image';

<Image
  source={{ uri: imageUrl }}
  placeholder={require('./placeholder.png')}
  cachePolicy="disk" // Persistent cache
  contentFit="cover"
  transition={1000}
/>

// Implement progressive image loading
<ProgressiveImage lowQuality={lowQualityUrl} highQuality={highQualityUrl} />

// Serve different resolutions based on device
const imageUrl = device.width > 800 
  ? imageUrl.replace('?', '/scale-to-width-down/600?')
  : imageUrl.replace('?', '/scale-to-width-down/400?');
```

**Expected Improvement:** 30-40% reduction in memory usage for images

---

### 8. **Code Splitting by Route**
**Impact:** Medium | **Effort:** High | **Priority:** 🟡 Medium

**Current Issue:**
- All screen components bundled together
- Larger initial bundle size
- All dependencies loaded upfront

**Solution:**
```tsx
// Use dynamic imports
const GhostsScreen = lazy(() => import('app/(tabs)/ghosts'));
const EquipmentScreen = lazy(() => import('app/(tabs)/equipments'));

// Add suspense boundaries
<Suspense fallback={<LoadingScreen />}>
  <GhostsScreen />
</Suspense>
```

**Expected Improvement:** 25-35% faster initial load time

---

## ⚡ Priority 4: State Management & Data Fetching

### 9. **Implement Local Data Caching Strategy**
**Impact:** Medium | **Effort:** Medium | **Priority:** 🟡 Medium

**Current Issue:**
- Equipment optimizer recalculates on every state change
- Ghost data fetched multiple times from GHOSTS object
- No memoization of filtered results

**Solution:**
```tsx
// Use useMemo for computed results
const filteredGhosts = useMemo(() => {
  return GHOSTS.filter(g => g.difficulty === selectedDifficulty)
    .filter(g => searchText === '' || g.name.includes(searchText));
}, [selectedDifficulty, searchText]);

// Cache expensive computations
const getGhostEquipment = useCallback(memoize((ghostId) => {
  return calculateOptimalEquipment(ghostId);
}), []);
```

**Files to Update:**
- `app/(tabs)/ghosts.tsx`
- `components/equipment-optimizer-sheet.tsx`
- `components/evidence-identifier-sheet.tsx`

**Expected Improvement:** 15-20% faster filtering & calculations

---

### 10. **Debounce Search Input**
**Impact:** Medium | **Effort:** Low | **Priority:** 🟡 Medium

**Current Issue:**
- Search filtering runs on every keystroke
- 24 ghosts × 7 equipment types re-filtered immediately

**Solution:**
```tsx
// Implement debounced search
const [searchText, setSearchText] = useState('');
const debouncedSearch = useCallback(
  debounce((text) => {
    // Update filtered results
  }, 300),
  []
);

const handleSearchChange = (text) => {
  setSearchText(text);
  debouncedSearch(text);
};
```

**File:** `app/(tabs)/ghosts.tsx`, `app/(tabs)/equipments.tsx`

**Expected Improvement:** Smoother typing, less CPU usage

---

## 🎯 Priority 5: Animation Refinements

### 11. **Native Driver Animations**
**Impact:** Medium | **Effort:** Medium | **Priority:** 🟡 Medium

**Current Issue:**
- React Native Reanimated uses worklets (good!) but could be optimized further
- Some spring configurations might be over-engineered

**Solution:**
```tsx
// Verify all animations use native driver
useAnimatedStyle(() => ({
  transform: [{ translateY: animated.value }],
  // This runs on native thread - good!
}));

// Audit animation configs for excessive calculations
animationConfigs={{
  damping: 80,      // Default is fine
  mass: 1.2,        // Keep reasonable
  overshootClamping: true, // Prevents excessive overshoots
}}
```

**Files to Audit:**
- All components with `animationConfigs`
- `map-detail-sheet.tsx`
- `bottom-sheet` implementations

**Expected Improvement:** 10-15% smoother animations overall

---

### 12. **Disable Animations on Low-End Devices**
**Impact:** Low | **Effort:** Low | **Priority:** 🟡 Medium

**Current Issue:**
- Animations run on all devices regardless of capability
- Low-end devices struggle with 60fps animations

**Solution:**
```tsx
// Detect device performance
import { DeviceInfo } from 'react-native-device-info';

const canAnimateSmooth = () => {
  const ram = DeviceInfo.getTotalMemory();
  return ram > 2000000000; // > 2GB RAM
};

// Conditionally disable animations
const AnimatedComponent = canAnimateSmooth() 
  ? <ComplexAnimation />
  : <StaticComponent />;

// Or reduce animation intensity
const animationDuration = canAnimateSmooth() ? 400 : 150;
```

**Expected Improvement:** Better performance on 15-20% of devices

---

## 🔍 Priority 6: Profiling & Monitoring

### 13. **Add React DevTools Performance Monitoring**
**Impact:** Low | **Effort:** Low | **Priority:** 🟡 Medium

**Current Issue:**
- No real-time performance metrics
- Can't identify slow components

**Solution:**
```tsx
// In development
if (__DEV__) {
  const Profiler = require('react/unstable_trace');
  
  <Profiler
    id="GhostsList"
    onRender={(id, phase, actualDuration) => {
      console.log(`${id} (${phase}) took ${actualDuration}ms`);
    }}
  >
    <GhostsList />
  </Profiler>
}
```

**Expected Benefit:** Data-driven optimization decisions

---

### 14. **Implement App Performance Monitoring (Firebase)**
**Impact:** Low | **Effort:** Medium | **Priority:** 🟡 Medium

**Current Issue:**
- No production performance data
- Can't identify real-world bottlenecks

**Solution:**
```tsx
import { initializeApp } from 'firebase/app';
import { getPerformance } from 'firebase/performance';

const perf = getPerformance();

// Auto track screen rendering
perf.trace('load_ghosts_screen').start();
// ... load data ...
perf.trace('load_ghosts_screen').stop();
```

**Expected Benefit:** Real-world performance insights

---

## 📋 Quick Implementation Checklist

### Phase 1 (Week 1) - Critical Fixes
- [ ] Add React.memo() to list item components
- [ ] Implement lazy loading for data imports
- [ ] Add FlashList/virtualization to long lists
- [ ] Optimize staggered animation delays

### Phase 2 (Week 2) - Animation Polish
- [ ] Reduce animation complexity
- [ ] Add scrollEventThrottle globally
- [ ] Optimize animation spring configs
- [ ] Implement device capability detection

### Phase 3 (Week 3) - Advanced Optimizations
- [ ] Image lazy loading & caching
- [ ] Code splitting by route
- [ ] Data caching strategy
- [ ] Debounced search input

### Phase 4 (Week 4) - Monitoring
- [ ] Add React DevTools profiling
- [ ] Set up Firebase Performance
- [ ] Conduct performance baseline testing
- [ ] Create automated performance tests

---

## 📊 Expected Performance Improvements

| Optimization | Load Time | Scroll FPS | Memory | Priority |
|---|---|---|---|---|
| React.memo + useMemo | -15% | +10fps | -10% | 🔴 Critical |
| Lazy Loading Data | -25% | N/A | -20% | 🔴 Critical |
| Virtualized Lists | -20% | +20fps | -40% | 🔴 Critical |
| Animation Optimization | -5% | +15fps | -5% | 🟠 High |
| Image Optimization | -10% | +5fps | -30% | 🟡 Medium |
| **Total Cumulative** | **-60%** | **+50fps** | **-75%** | — |

---

## 🎯 Success Metrics

After optimizations, target:
- ✅ App startup: < 2 seconds
- ✅ Screen navigation: < 300ms
- ✅ List scrolling: 60fps consistently
- ✅ Memory usage: < 150MB (initial)
- ✅ Bundle size: < 5MB
- ✅ Animation frame drops: < 1%

---

## 📚 Resources & Tools

1. **React Native Performance**: https://reactnative.dev/docs/performance
2. **Reanimated Optimization**: https://docs.swmansion.com/react-native-reanimated/docs/debugging/performance
3. **FlashList Documentation**: https://shopify.github.io/flash-list
4. **Firebase Performance**: https://firebase.google.com/docs/perf-mod
5. **Hermes Debugger**: https://hermesengine.dev/

---

**Created:** November 12, 2025  
**App Version:** 1.0.0  
**Device Target:** iOS 14+, Android 9+
