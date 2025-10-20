# Phasmophobia App - Color Palette Reference

## Primary Palette

### Background Colors
```
Dark Background:     #0F0E17  ████████████████████ Very dark purple-black
Darker Background:   #050404  ████████████████████ Almost pure black
Surface:             #1A1820  ████████████████████ Dark surface
Surface Light:       #2B2737  ████████████████████ Lighter surface
```

### Accent Colors
```
Primary Purple:      #6B4AAC  ████████████████████ Supernatural/Paranormal feel
Spectral Cyan:       #00D9FF  ████████████████████ Bright, haunted glow
Paranormal Green:    #1FB46B  ████████████████████ Eerie/Active state
Haunted Purple:      #4A3F78  ████████████████████ Darker supernatural tone
```

### Status & Alert Colors
```
Success/Positive:    #1FB46B  ████████████████████ Green
Warning/Caution:     #FFB84D  ████████████████████ Orange
Error/Danger:        #FF4444  ████████████████████ Red
Info/Special:        #00D9FF  ████████████████████ Cyan
```

### Text & UI Colors
```
Primary Text:        #E8E8F0  ████████████████████ Very light gray
Secondary Text:      #9A95A8  ████████████████████ Muted purple
Border Colors:       #3D3847  ████████████████████ Dark purple-gray
```

## Difficulty Progression

```
Beginner:     #1FB46B  ████████████████████ Green (Easiest)
Intermediate: #FFB84D  ████████████████████ Orange (Medium)
Advanced:     #FF4444  ████████████████████ Red (Hard)
Expert:       #6B4AAC  ████████████████████ Purple (Hardest)
```

## Ghost Type Color Mapping

The app uses specific colors for each ghost type to aid identification:

```
Spirit:        #A8D5FF  (Light Blue)
Wraith:        #00D9FF  (Cyan - Spectral)
Phantom:       #9B5FFF  (Purple)
Poltergeist:   #FF6B6B  (Red)
Banshee:       #B45FFF  (Purple)
Jinn:          #FF69B4  (Pink)
Mare:          #6B4AAC  (Dark Purple)
Revenant:      #8B0000  (Dark Red)
Shade:         #1A1820  (Black)
Demon:         #FF3333  (Red)
Yurei:         #00D9FF  (Cyan)
Oni:           #FF5722  (Orange)
Yokai:         #00D9FF  (Cyan)
Hantu:         #5DDEF4  (Light Cyan)
Goryo:         #8A8A9E  (Gray)
Myling:        #FF8C42  (Orange)
Onryo:         #FF6B6B  (Red)
The Twins:     #9B5FFF  (Purple)
Raiju:         #FFD700  (Gold)
Obake:         #FF69B4  (Pink)
The Mimic:     #6B5B95  (Dark Purple)
Moroi:         #8B4513  (Brown)
Deogen:        #A9A9A9  (Gray)
Thaye:         #8B6B47  (Tan)
```

## Shadow System

The app uses colored glows instead of standard shadows for a supernatural effect:

```
Small Shadow:    Purple glow (#6B4AAC) - 15% opacity, 4px blur
Medium Shadow:   Cyan glow (#00D9FF) - 20% opacity, 8px blur
Large Shadow:    Purple glow (#6B4AAC) - 25% opacity, 16px blur
```

## Design Philosophy

- **Dark Atmosphere**: Creates immersive, supernatural feeling
- **Cyan Highlights**: Represents spectral/ghost-like elements
- **Purple Accents**: Represents paranormal/supernatural aspects
- **Green Indicators**: Used for positive/affirmative states
- **Red Warnings**: Used for dangers/weaknesses
- **High Contrast**: Ensures readability on dark backgrounds

## Component Usage Examples

### Tab Navigation
- Active Tab Icon: Cyan (#00D9FF)
- Inactive Tab Icon: Muted Purple (#9A95A8)
- Tab Bar Background: Surface (#1A1820)

### Evidence Selection
- Selected Evidence: Cyan background + border
- Unselected Evidence: Dark surface
- Evidence Badges: Purple or cyan based on context

### Difficulty Badges
- Beginner: Green background
- Intermediate: Orange background
- Advanced: Red background
- Expert: Purple background

### Ghost Results
- Ghost Name: Cyan text
- Selected Evidence: Cyan with white text
- Unselected Evidence: Cyan with 30% opacity

### Detail Sheets
- Background: Surface (#1A1820)
- Handle Indicator: Cyan (#00D9FF)
- Section Titles: Cyan (#00D9FF)
- Image Borders: Purple (#6B4AAC)

## Tips for Future Updates

1. Always use the theme constants from `constants/theme.ts`
2. Maintain the dark atmosphere - avoid bright backgrounds
3. Use cyan for interactive elements and highlights
4. Reserve red for warnings and dangers only
5. Keep text contrast above 7:1 ratio for accessibility
6. Test all colors in both light and dark contexts
