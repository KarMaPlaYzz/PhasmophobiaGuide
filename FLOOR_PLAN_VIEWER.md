# Zoomable/Pannable Floor Plan Viewer

## Overview
A new interactive floor plan viewer component has been added to the map detail sheet, allowing users to zoom and pan around floor plan images.

## Components

### FloorPlanViewer Component
**File:** `/components/floor-plan-viewer.tsx`

**Features:**
- **Zoom Controls:**
  - Zoom In (up to 3x magnification)
  - Zoom Out (down to 1x)
  - Reset button to return to default view
  - Live zoom percentage display

- **Pan Gesture:**
  - Drag to pan around when zoomed in
  - Automatic boundary detection to prevent panning beyond image bounds
  - Smooth gesture handling with React Native's PanResponder

- **Visual Feedback:**
  - Loading indicator while floor plan image loads
  - Gesture hint when zoomed in ("Drag to pan")
  - Info bar with contextual instructions
  - Disabled state styling for unavailable controls

## Integration

The `FloorPlanViewer` component is now used in the `MapDetailSheet` component to replace the static floor plan image display.

**Updated File:** `/components/map-detail-sheet.tsx`

```tsx
{map.floorPlanUrl && (
  <View style={styles.section}>
    <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
      Floor Plan
    </ThemedText>
    <FloorPlanViewer imageUrl={map.floorPlanUrl} mapName={map.name} />
  </View>
)}
```

## Usage

### Basic Usage
```tsx
import { FloorPlanViewer } from '@/components/floor-plan-viewer';

<FloorPlanViewer 
  imageUrl="https://example.com/floor-plan.png"
  mapName="Map Name"
/>
```

### Props
- `imageUrl` (string): URL to the floor plan image
- `mapName` (string): Name of the map (for reference/accessibility)

## Features

### Zoom Functionality
- **Zoom In Button:** Increases scale by 0.5x (up to 3x max)
- **Zoom Out Button:** Decreases scale by 0.5x (min 1x)
- **Reset Button:** Returns to 1x scale and resets pan offset
- **Disabled States:** Buttons are disabled when limits are reached (e.g., "zoom out" when at 1x)

### Pan/Drag Functionality
- Only active when zoomed in (scale > 1)
- Smooth dragging with boundary detection
- Prevents dragging beyond image bounds
- `PanResponder` handles gesture tracking

### Visual Indicators
- Zoom percentage display (e.g., "Zoom: 200%")
- Loading overlay while image loads
- Gesture hint: "Drag to pan" appears when zoomed in
- Info text updates based on zoom state
- Color-coded controls (enabled vs. disabled)

## Styling

All styles are theme-aware and respect light/dark mode:
- Uses `Colors` and `useColorScheme` from app theme
- Rounded corners and consistent padding
- Smooth visual feedback for user interactions
- Accessible touch targets (40x40px buttons)

## Technical Details

### State Management
```tsx
- scale: number (1 to 3)
- offsetX: number (X-axis pan position)
- offsetY: number (Y-axis pan position)
- imageLoading: boolean
- imageDimensions: { width: number, height: number }
```

### Gesture Handling
- `PanResponder` for drag gestures
- Only activates when `scale > 1` (zoomed in)
- Calculates boundary limits based on:
  - Image dimensions
  - Current scale
  - Screen dimensions
- Clamps offset values to prevent over-panning

### Image Loading
- Progressive rendering enabled for better performance
- Placeholder shown while loading
- Error handling if image fails to load
- Dimensions captured on successful load for boundary calculation

## Browser/Mobile Support

Works on:
- iOS devices (with gesture support)
- Android devices (with gesture support)
- Expo Go / React Native environments

## Future Enhancements

Potential improvements:
- Double-tap to zoom to specific level
- Pinch-zoom gesture support (requires native module)
- Mini-map indicator showing current view position
- Export/save zoomed view
- Room labeling overlay on floor plans
- Touch-responsive hotspots for rooms

## Data Source

Floor plan images come from the Wikia CDN:
- URL pattern: `floorPlanUrl` in Map data structure
- Images are stored in `/lib/data/maps.ts`
- Example: `https://static.wikia.nocookie.net/phasmophobia/images/.../Rooms_Tanglewood.png`

## Testing

To test the component:
1. Open a map detail sheet in the Maps tab
2. Scroll to the "Floor Plan" section
3. Try the zoom controls (+ and -)
4. When zoomed in, try dragging to pan
5. Press reset to return to default view
