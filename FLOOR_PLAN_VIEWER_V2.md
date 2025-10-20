# Floor Plan Viewer - Updated v2

## What Changed

### Problem with v1
- Zoom increments were too large (0.5x each click, max 3x)
- PanResponder wasn't working properly for dragging
- Pan offset calculations were complex and buggy

### Solution in v2
✅ **Smaller, more reasonable zoom levels**: 1x → 1.25x → 1.5x → 1.75x → 2x
✅ **Native ScrollView drag**: Built-in iOS/Android scrolling and panning
✅ **Simpler implementation**: Fewer moving parts, more reliable
✅ **Better user experience**: Natural gesture feels like iOS/Android maps

## How It Works

### Zoom Controls
- **Minus (-)**: Decrease zoom level (disabled at 1x)
- **Plus (+)**: Increase zoom level (disabled at 2x max)
- **Refresh**: Reset to 1x and center view
- **Display**: Shows current zoom percentage in real-time

### Panning (Dragging)
- At **1x zoom**: ScrollView is disabled, can't drag
- At **>1x zoom**: ScrollView is enabled
  - Drag horizontally or vertically to move around
  - Scrollbars appear when zoomed in
  - Works smoothly on both iOS and Android
  - Automatically prevents scrolling beyond boundaries

### Architecture
```
FloorPlanViewer
├── Controls Bar (zoom buttons)
├── ScrollView (handles all dragging/panning)
│   └── Image with scale transform
└── Info Bar (instructions)
```

## Technical Details

### State
- `scale`: Current zoom level (1, 1.25, 1.5, 1.75, or 2)
- `imageLoading`: Loading state
- `scrollViewRef`: Reference to ScrollView for programmatic scroll control

### Zoom Logic
```tsx
const ZOOM_LEVELS = [1, 1.25, 1.5, 1.75, 2];
const currentZoomIndex = ZOOM_LEVELS.indexOf(scale);
const canZoomIn = currentZoomIndex < ZOOM_LEVELS.length - 1;
const canZoomOut = currentZoomIndex > 0;
```

### Drag Implementation
- Uses React Native's built-in `ScrollView` component
- `scrollEnabled={scale > 1}` - dragging only works when zoomed
- ScrollBars shown only when zoomed: `showsHorizontalScrollIndicator={scale > 1}`
- Native scroll physics (momentum, bounce) work automatically
- `scrollTo()` method handles reset animation

## Styling

- **Container**: Max height 400px to fit in bottom sheet
- **Image area**: 250px height when not zoomed
- **Controls**: 40x40px buttons with touch targets
- **Scroll area**: Flex 1 with min 250px height
- **All colors**: Theme-aware (light/dark mode)

## Usage Example

```tsx
import { FloorPlanViewer } from '@/components/floor-plan-viewer';

<FloorPlanViewer 
  imageUrl="https://example.com/floor-plan.png"
  mapName="Map Name"
/>
```

## Performance Considerations

✅ Uses native ScrollView (optimized by React Native)
✅ Minimal state updates (only scale and loading)
✅ Progressive image rendering
✅ Smooth 60fps scrolling on modern devices
✅ No complex gesture calculations

## Browser Support

✅ iOS (native scrolling)
✅ Android (native scrolling)  
✅ Expo Go
❌ Web (ScrollView has limited support)

## Comparison: v1 vs v2

| Feature | v1 | v2 |
|---------|----|----|
| Zoom Levels | 3.0x max | 2.0x max |
| Zoom Increments | 0.5x | 0.25x |
| Drag Implementation | PanResponder | ScrollView |
| Drag Responsiveness | Buggy | Works great |
| Touch Scrollbars | No | Yes (when zoomed) |
| Native Feel | No | Yes |
| Code Complexity | High | Low |
| Maintenance | Difficult | Easy |

## Future Enhancements

- Double-tap zoom to specific level
- Pinch zoom gesture (native support)
- Mini-map showing current view area
- Room labels overlay
- Pan constraints with edge detection

## Troubleshooting

**Can't drag the floor plan?**
- Make sure you're zoomed in (use + button first)
- The zoom level must be > 1.0

**Reset not working?**
- Tap the ⟳ button (may take 1-2 seconds to animate)

**Zoom buttons disabled?**
- At 1x: Only + button is enabled
- At 2x: Only - button is enabled
- This is intentional to prevent over-zooming
