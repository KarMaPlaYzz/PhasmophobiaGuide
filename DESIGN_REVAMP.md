# Phasmophobia App Design Revamp

## Overview
The app has been completely revamped with a dark, haunting color theme that matches the Phasmophobia game aesthetic. The new design emphasizes supernatural and paranormal elements with a horror game atmosphere.

## Color Palette

### Primary Colors
- **Dark Background**: `#0F0E17` (Very dark purple-black)
- **Darker Background**: `#050404` (Almost pure black)
- **Surface**: `#1A1820` (Dark surface for components)
- **Surface Light**: `#2B2737` (Slightly lighter surface)

### Accent Colors
- **Primary Purple (Supernatural)**: `#6B4AAC` (Purple glow)
- **Cyan (Spectral/Ghost)**: `#00D9FF` (Bright cyan, main accent)
- **Green (Paranormal)**: `#1FB46B` (Eerie green for positive elements)
- **Haunted Purple**: `#4A3F78` (Darker purple tone)

### Status Colors
- **Success**: `#1FB46B` (Green)
- **Warning**: `#FFB84D` (Orange)
- **Error**: `#FF4444` (Red)
- **Info**: `#00D9FF` (Cyan)

### Difficulty Colors
- **Beginner**: `#1FB46B` (Green)
- **Intermediate**: `#FFB84D` (Orange)
- **Advanced**: `#FF4444` (Red)
- **Expert**: `#6B4AAC` (Purple)

### Text Colors
- **Primary Text**: `#E8E8F0` (Very light gray)
- **Borders**: `#3D3847` (Dark purple-gray)
- **Tab Icons Default**: `#9A95A8` (Muted purple)

## Design Changes by Component

### 1. Theme System (`constants/theme.ts`)
- Restructured color palette to use Phasmophobia-inspired colors
- Added new color properties: `ghostWhite`, `haunted`, `paranormal`, `supernatural`, `spectral`
- Updated shadow system to use purple and cyan glows instead of plain black shadows
- Updated ghost type colors to match the new theme

### 2. Tab Navigation (`app/(tabs)/_layout.tsx`)
- Updated tab bar styling with surface color background
- Border color now uses the Phasmophobia theme
- Tab icons use cyan for selected state, muted purple for inactive

### 3. Text Styling (`components/themed-text.tsx`)
- Title and subtitle text now include letter spacing for better readability
- Link color changed to cyan `#00D9FF`
- Enhanced typography for a more professional, mysterious feel

### 4. Ghost Detail Sheet (`components/ghost-detail-sheet.tsx`)
- Bottom sheet background uses surface color
- Handle indicator is cyan (spectral color)
- Section titles are cyan for emphasis
- Image containers have purple borders
- Ability separators use semi-transparent purple
- Strength indicators use green, weakness indicators use red
- Tips use cyan bullets

### 5. Equipment Detail Sheet (`components/equipment-detail-sheet.tsx`)
- Category colors updated to match new theme
- Evidence detection colors changed to cyan-based
- Tier items use green borders
- Synergies use cyan backgrounds
- Section titles are cyan
- Image containers have purple borders

### 6. Map Detail Sheet (`components/map-detail-sheet.tsx`)
- Background color updated to surface
- Section titles are cyan
- Statistics use cyan/purple icons
- Hazards use red indicators
- Special features use cyan indicators
- Best for section uses green indicators
- Bullet points in strategies are cyan

### 7. Identifier Screen (`app/(tabs)/index.tsx`)
- Header background is surface color
- Ghost Identifier title uses cyan color
- Evidence cards use cyan for selection
- Results title is cyan
- Ghost names are cyan
- Evidence matching badges use purple/cyan

## Visual Hierarchy

1. **Titles & Headings**: Cyan (`#00D9FF`) - Draws attention to key information
2. **Primary Content**: Light gray (`#E8E8F0`) - Main text on dark backgrounds
3. **Accents**: Purple (`#6B4AAC`) & Green (`#1FB46B`) - Interactive elements
4. **Subtle Elements**: Muted purple (`#9A95A8`) - Secondary information
5. **Warnings & Errors**: Red (`#FF4444`) - Alert colors

## Supernatural Effects

- **Shadow System**: Glowing shadows using purple and cyan instead of black shadows
- **Ghost Type Colors**: Updated to match Phasmophobia's spirit classifications
- **Difficulty Progression**: Green (easy) → Orange (medium) → Red (hard) → Purple (expert)

## Dark Mode
Since the app is primarily dark-themed, both light and dark modes now use the same color palette, creating a consistent haunting atmosphere throughout the application.

## Benefits

✅ **Immersive Experience**: Theme perfectly matches Phasmophobia game aesthetic  
✅ **Improved Readability**: High contrast between text and backgrounds  
✅ **Visual Consistency**: Unified color language across all screens  
✅ **User Guidance**: Color coding for difficulty, status, and ghost types  
✅ **Professional Look**: Modern dark theme with supernatural touches  
✅ **Accessibility**: Sufficient color contrast ratios maintained  

## Implementation Notes

All color values are defined in `constants/theme.ts` for easy maintenance and consistency. The `Colors` object structure supports both light and dark modes, with the dark theme being the primary design.

Ghost type colors in `GhostTypeColors` have been updated to match the new supernatural theme while maintaining distinctiveness for each ghost type.
