# Premium Features Analysis

## Current Premium Features

The app currently offers a **one-time purchase** for **$2.99** with the following features:

### Currently Implemented ✅

1. **No Ads** - Removes all AdMob banner ads throughout the app
   - Ads appear on: Ghosts tab, Evidence tab, Equipments tab, Sanity Calculator tab, Home tab
   - Implementation: `AdBanner` component checks `isPremium` and returns null if true

2. **Ghost Comparison** - Compare 2+ ghosts side-by-side
   - Location: `components/ghost-comparison-sheet.tsx`
   - Shows: Basic info, abilities, evidence, equipment recommendations, strategies

3. **Equipment Optimizer** - Build optimal equipment loadouts
   - Location: `components/equipment-optimizer-sheet.tsx`
   - Features: Budget control, playstyle selection (balanced, aggressive, defensive, support), ghost-specific builds, map size/difficulty filters

4. **Evidence Identifier** - Collect evidence and identify ghosts
   - Location: `components/evidence-identifier-sheet.tsx`
   - Features: Evidence collection, ghost filtering, smart hints, required equipment tracking

5. **Advanced Filters** - Filter by activity, difficulty, speed
   - Mentioned in paywall but needs verification for actual implementation

6. **Export Guides** - Save strategy guides as PDF
   - Mentioned in paywall but needs verification for actual implementation

7. **Bookmarks Enhancement** - Organize and manage your favorite items
   - Location: `components/bookmarks-detail-sheet.tsx` and `components/premium-bookmarks-features.tsx`
   - Features:
     - **Personal Notes**: Add detailed notes to each bookmark
     - **Pin Bookmarks**: Pin frequently used bookmarks to the top
     - **Custom Colors**: Assign custom colors to bookmarks for quick identification
     - **Collections**: Create organized collections of bookmarks (e.g., "Aggie Strategies", "Banshee Counter Setups")
     - **Collection Management**: Create, edit, delete collections; move bookmarks between collections
     - **Smart Sorting**: Pinned bookmarks appear first, followed by recent additions
   - Backend Storage: All data persisted in AsyncStorage via `BookmarkService`

---

## Suggested New Premium Features

### Tier 1: Easy to Implement (MVP)
- **Favorites/Bookmarks** - Already partially implemented, could enhance with sync
- **Custom Notes** - Add personal notes to ghosts/equipment
- **Dark Mode Toggle** - More granular control over theme
- **Quick Reference Cards** - Exportable ghost cheat sheets

### Tier 2: Medium Effort
- **Hunt Planner/Mission Builder** - Create custom hunts with loadouts
- **Statistics Tracking** - Track hunts, win rates, ghost encounters
- **Equipment Loadout Presets** - Save and quickly swap between loadout configs
- **Evidence Tips by Location** - Map-specific evidence tips and strategies
- **Streamer Mode** - Hide sensitive info for streaming

### Tier 3: Higher Effort
- **Offline Mode** - Download full game data for offline access
- **Custom Difficulty Calculator** - Advanced sanity/hunt mechanics simulator
- **Ghost Hunt Simulator** - Practice identifying ghosts
- **Community Guides Integration** - Access curated strategies from community
- **Real-time Hunt Assistant** - Active hunt companion with voice commands
- **Patch Notes Integration** - Auto-update with latest game patches

### Tier 4: Future/Advanced
- **Cross-platform Sync** - Sync progress across devices (requires backend)
- **Online Multiplayer Stats** - Compare stats with other players
- **AI Ghost Identifier** - Camera-based evidence identification
- **Push Notifications** - Game updates, tip of the day
- **Widget Support** - Home screen widget with quick info

---

## Marketing Positioning

### Current Value Proposition
"Unlock Full Power - Get unlimited access to all features"

### Enhanced Value Proposition Ideas
- **For Casual Players**: "Master Every Ghost - Get comparison tools and smart identification"
- **For Competitive Players**: "Optimize Your Loadouts - AI equipment recommendations and hunt planning"
- **For Streamers**: "Stream Like a Pro - Streamer mode + statistics overlay"
- **For Completionists**: "Never Miss a Detail - Offline access + custom notes + full tracking"

---

## Implementation Notes

## Implementation Notes

### Current Architecture
- Premium state managed via `PremiumContext` with `isPremium` boolean
- Syncs with AsyncStorage and app lifecycle
- IAP handled through `react-native-iap` with Apple App Store / Google Play
- Product ID: `no_ad` (one-time purchase)

### Bookmarks Enhancement Implementation

#### New Files Created
- `components/premium-bookmarks-features.tsx` - New bottom sheet component for premium bookmark features
  - Tabbed interface: Note, Collection, Color, Manage
  - Long-press on bookmark to open features sheet
  - Only visible to premium users

#### Types Updated
- `lib/types/index.ts`: Extended `Bookmark` interface with:
  - `note?: string` - Personal note content
  - `collectionId?: string` - Reference to parent collection
  - `color?: string` - Custom color hex code
  - `isPinned?: boolean` - Whether bookmark is pinned
- Added new `BookmarkCollection` interface with:
  - `id`, `name`, `description`, `color`, `icon`
  - `bookmarkIds[]` - Array of bookmark IDs in collection
  - `createdAt`, `updatedAt` timestamps

#### Storage Service Extended
- `lib/storage/storageService.ts`: Added 10 new methods to `BookmarkService`:
  - `addNoteToBookmark()` - Save personal note
  - `togglePinBookmark()` - Pin/unpin bookmarks
  - `setBookmarkColor()` - Set custom color
  - `createCollection()` - Create new collection
  - `addBookmarkToCollection()` - Add bookmark to collection
  - `removeBookmarkFromCollection()` - Remove from collection
  - `getCollections()` - Fetch all collections
  - `getCollectionBookmarks()` - Fetch bookmarks in specific collection
  - `updateCollection()` - Edit collection details
  - `deleteCollection()` - Delete collection
  - `getPinnedBookmarks()` - Get all pinned bookmarks

#### UI Updates
- `components/bookmarks-detail-sheet.tsx`:
  - Integrated `usePremium` hook to check premium status
  - Added long-press handler to open premium features sheet
  - Smart sorting: Pinned bookmarks appear first (premium only)
  - Display pin icon next to pinned bookmarks
  - Show preview of personal notes in bookmark item
  - Color-coded bookmark items based on custom color
  - Added new styles: `nameRow`, `bookmarkNote`

#### User Experience
- Premium users can long-press any bookmark to access all features
- Free users can view bookmarks normally (basic functionality unchanged)
- All premium data automatically persisted to AsyncStorage
- Changes reflected immediately in UI
- Smooth animations and haptic feedback

### For New Features
1. Most features can use simple `isPremium` boolean checks
2. For more advanced tiering (multiple SKUs), would need to extend the service
3. Data persistence features use AsyncStorage or SQLite backend
4. Sync features require backend infrastructure

### Localization Ready
- Paywall strings use the localization hook (`useLocalization`)
- Feature descriptions should be added to localization files

---

## Recommendation

**Phase 1 (Immediate)**: Implement quick wins
- Favorites enhancement
- Custom notes
- Quick reference cards

**Phase 2 (Next release)**: Feature expansion
- Hunt planner
- Statistics tracking
- Loadout presets

**Phase 3 (Future)**: Advanced features
- Offline mode
- Simulator
- Backend sync

This approach maximizes value perception while maintaining reasonable implementation complexity.
