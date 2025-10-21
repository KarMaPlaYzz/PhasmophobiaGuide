# Bookmarks & View History Feature Guide

## Overview
Add personal collection management with bookmarks and view history tracking. Users can mark favorite ghosts, equipment, maps, and evidence for quick access, and the app tracks their browsing history.

## Features

### 1. Bookmark System

**Data Structure** (`lib/types/index.ts`):

```typescript
export interface Bookmark {
  id: string;
  type: 'ghost' | 'equipment' | 'map' | 'evidence';
  itemId: string;
  itemName: string;
  createdAt: number;
  tags: string[];
}

export interface UserLibrary {
  bookmarks: Bookmark[];
  history: HistoryItem[];
  customCategories: CustomCategory[];
  lastUpdated: number;
}

export interface CustomCategory {
  id: string;
  name: string;
  color: string;
  bookmarkIds: string[];
}
```

**Storage** (`lib/storage/storageService.ts`):

```typescript
export const BookmarkService = {
  // Bookmark operations
  async addBookmark(bookmark: Bookmark): Promise<void> {
    const library = await getLibrary();
    library.bookmarks.push(bookmark);
    library.lastUpdated = Date.now();
    await AsyncStorage.setItem('userLibrary', JSON.stringify(library));
  },

  async removeBookmark(bookmarkId: string): Promise<void> {
    const library = await getLibrary();
    library.bookmarks = library.bookmarks.filter(b => b.id !== bookmarkId);
    library.lastUpdated = Date.now();
    await AsyncStorage.setItem('userLibrary', JSON.stringify(library));
  },

  async isBookmarked(itemId: string, type: string): Promise<boolean> {
    const library = await getLibrary();
    return library.bookmarks.some(b => b.itemId === itemId && b.type === type);
  },

  async getBookmarks(type?: string): Promise<Bookmark[]> {
    const library = await getLibrary();
    if (type) {
      return library.bookmarks.filter(b => b.type === type);
    }
    return library.bookmarks;
  },

  async addTag(bookmarkId: string, tag: string): Promise<void> {
    const library = await getLibrary();
    const bookmark = library.bookmarks.find(b => b.id === bookmarkId);
    if (bookmark && !bookmark.tags.includes(tag)) {
      bookmark.tags.push(tag);
      library.lastUpdated = Date.now();
      await AsyncStorage.setItem('userLibrary', JSON.stringify(library));
    }
  },

  async removeTag(bookmarkId: string, tag: string): Promise<void> {
    const library = await getLibrary();
    const bookmark = library.bookmarks.find(b => b.id === bookmarkId);
    if (bookmark) {
      bookmark.tags = bookmark.tags.filter(t => t !== tag);
      library.lastUpdated = Date.now();
      await AsyncStorage.setItem('userLibrary', JSON.stringify(library));
    }
  },
};
```

### 2. History Tracking System

**Data Structure**:

```typescript
export interface HistoryItem {
  id: string;
  type: 'ghost' | 'equipment' | 'map' | 'evidence';
  itemId: string;
  itemName: string;
  viewedAt: number;
  timeSpent: number; // in milliseconds
}
```

**Storage**:

```typescript
export const HistoryService = {
  async trackView(type: string, itemId: string, itemName: string): Promise<void> {
    const library = await getLibrary();
    
    // Remove duplicate if exists (recent move to top)
    library.history = library.history.filter(h => !(h.itemId === itemId && h.type === type));
    
    // Add new entry
    library.history.unshift({
      id: generateId(),
      type,
      itemId,
      itemName,
      viewedAt: Date.now(),
      timeSpent: 0,
    });
    
    // Keep only last 100 items
    library.history = library.history.slice(0, 100);
    library.lastUpdated = Date.now();
    
    await AsyncStorage.setItem('userLibrary', JSON.stringify(library));
  },

  async getHistory(type?: string, limit: number = 20): Promise<HistoryItem[]> {
    const library = await getLibrary();
    let items = library.history;
    
    if (type) {
      items = items.filter(h => h.type === type);
    }
    
    return items.slice(0, limit);
  },

  async clearHistory(): Promise<void> {
    const library = await getLibrary();
    library.history = [];
    library.lastUpdated = Date.now();
    await AsyncStorage.setItem('userLibrary', JSON.stringify(library));
  },

  async updateTimeSpent(historyId: string, additionalTime: number): Promise<void> {
    const library = await getLibrary();
    const item = library.history.find(h => h.id === historyId);
    if (item) {
      item.timeSpent += additionalTime;
      library.lastUpdated = Date.now();
      await AsyncStorage.setItem('userLibrary', JSON.stringify(library));
    }
  },
};
```

### 3. Library Header Component

**Location**: Create `components/library-header.tsx`

```typescript
import React from 'react';
import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText, ThemedView } from './themed-text';
import { useNavigation } from '@react-navigation/native';
import { useColorScheme } from '../hooks/use-color-scheme';
import { Colors } from '../constants/theme';

interface LibraryHeaderProps {
  totalBookmarks: number;
  totalHistory: number;
}

export const LibraryHeader: React.FC<LibraryHeaderProps> = ({
  totalBookmarks,
  totalHistory,
}) => {
  const navigation = useNavigation<any>();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <ThemedView style={styles.container}>
      <Pressable
        onPress={() => navigation.navigate('library')}
        style={styles.libraryButton}
      >
        <Ionicons name="heart" size={24} color={colors.spectral} />
        <View style={styles.badge}>
          <ThemedText style={styles.badgeText}>{totalBookmarks}</ThemedText>
        </View>
      </Pressable>

      <Pressable
        onPress={() => navigation.navigate('history')}
        style={styles.historyButton}
      >
        <Ionicons name="time" size={24} color={colors.haunted} />
        <View style={styles.badge}>
          <ThemedText style={styles.badgeText}>{totalHistory}</ThemedText>
        </View>
      </Pressable>
    </ThemedView>
  );
};
```

### 4. Bookmark Button Component

**Location**: `components/bookmark-button.tsx`

```typescript
import React, { useState, useEffect } from 'react';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BookmarkService } from '../lib/storage/storageService';

interface BookmarkButtonProps {
  itemId: string;
  itemType: 'ghost' | 'equipment' | 'map' | 'evidence';
  itemName: string;
  size?: number;
  color?: string;
  onToggle?: (isBookmarked: boolean) => void;
}

export const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  itemId,
  itemType,
  itemName,
  size = 24,
  color = '#FF6B9D',
  onToggle,
}) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkBookmark();
  }, [itemId, itemType]);

  const checkBookmark = async () => {
    const bookmarked = await BookmarkService.isBookmarked(itemId, itemType);
    setIsBookmarked(bookmarked);
  };

  const toggleBookmark = async () => {
    setLoading(true);
    try {
      if (isBookmarked) {
        // Remove bookmark
        const bookmarks = await BookmarkService.getBookmarks(itemType);
        const bookmark = bookmarks.find(b => b.itemId === itemId);
        if (bookmark) {
          await BookmarkService.removeBookmark(bookmark.id);
        }
        setIsBookmarked(false);
        onToggle?.(false);
      } else {
        // Add bookmark
        const id = `${itemType}_${itemId}_${Date.now()}`;
        await BookmarkService.addBookmark({
          id,
          type: itemType,
          itemId,
          itemName,
          createdAt: Date.now(),
          tags: [],
        });
        setIsBookmarked(true);
        onToggle?.(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Pressable
      onPress={toggleBookmark}
      disabled={loading}
      style={{ opacity: loading ? 0.5 : 1 }}
    >
      <Ionicons
        name={isBookmarked ? 'heart' : 'heart-outline'}
        size={size}
        color={isBookmarked ? color : '#999'}
      />
    </Pressable>
  );
};
```

### 5. Library Screen

**Location**: Create `app/(tabs)/library.tsx`

```typescript
import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  Pressable,
  SectionList,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText, ThemedView } from '../components/themed-text';
import { useColorScheme } from '../hooks/use-color-scheme';
import { Colors } from '../constants/theme';
import { BookmarkService } from '../lib/storage/storageService';
import { Bookmark } from '../lib/types';

export default function LibraryScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'ghost' | 'equipment' | 'map' | 'evidence'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookmarks();
  }, [selectedCategory]);

  const loadBookmarks = async () => {
    setLoading(true);
    try {
      const categoryFilter = selectedCategory === 'all' ? undefined : selectedCategory;
      const items = await BookmarkService.getBookmarks(categoryFilter);
      setBookmarks(items);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBookmark = async (bookmarkId: string) => {
    await BookmarkService.removeBookmark(bookmarkId);
    loadBookmarks();
  };

  const getCategoryIcon = (type: string) => {
    const icons = {
      ghost: 'skull',
      equipment: 'briefcase',
      map: 'map',
      evidence: 'search',
    };
    return icons[type] || 'bookmark';
  };

  const renderBookmarkItem = ({ item }: { item: Bookmark }) => (
    <View style={[styles.bookmarkItem, { borderLeftColor: colors.spectral }]}>
      <View style={styles.bookmarkContent}>
        <Ionicons
          name={getCategoryIcon(item.type)}
          size={20}
          color={colors.text}
        />
        <View style={styles.bookmarkText}>
          <ThemedText style={styles.bookmarkName}>{item.itemName}</ThemedText>
          <ThemedText style={styles.bookmarkType}>{item.type}</ThemedText>
        </View>
      </View>
      <Pressable onPress={() => handleRemoveBookmark(item.id)}>
        <Ionicons name="close" size={20} color={colors.text} />
      </Pressable>
    </View>
  );

  const renderCategoryFilter = () => (
    <View style={styles.filterContainer}>
      {(['all', 'ghost', 'equipment', 'map', 'evidence'] as const).map((cat) => (
        <Pressable
          key={cat}
          onPress={() => setSelectedCategory(cat)}
          style={[
            styles.filterPill,
            {
              backgroundColor:
                selectedCategory === cat ? colors.spectral : colors.surface,
            },
          ]}
        >
          <ThemedText
            style={{
              color: selectedCategory === cat ? '#fff' : colors.text,
              fontWeight: selectedCategory === cat ? '700' : '500',
            }}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </ThemedText>
        </Pressable>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Bookmarks</ThemedText>
        <ThemedText style={styles.subtitle}>
          {bookmarks.length} saved items
        </ThemedText>
      </View>

      {renderCategoryFilter()}

      {loading ? (
        <View style={styles.centerContainer}>
          <ThemedText>Loading...</ThemedText>
        </View>
      ) : bookmarks.length === 0 ? (
        <View style={styles.centerContainer}>
          <Ionicons name="heart-outline" size={48} color={colors.text} />
          <ThemedText style={styles.emptyText}>
            No bookmarks yet
          </ThemedText>
          <ThemedText style={styles.emptySubtext}>
            Add items to your favorites to see them here
          </ThemedText>
        </View>
      ) : (
        <FlatList
          data={bookmarks}
          renderItem={renderBookmarkItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={true}
          style={styles.listContainer}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.6,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  bookmarkItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginVertical: 4,
    borderRadius: 8,
    borderLeftWidth: 4,
    backgroundColor: 'rgba(99, 102, 241, 0.05)',
  },
  bookmarkContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  bookmarkText: {
    flex: 1,
  },
  bookmarkName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  bookmarkType: {
    fontSize: 12,
    opacity: 0.6,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
  },
});
```

### 6. History Screen

**Location**: Create `app/(tabs)/history.tsx`

```typescript
import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  Pressable,
  SectionList,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText, ThemedView } from '../components/themed-text';
import { useColorScheme } from '../hooks/use-color-scheme';
import { Colors } from '../constants/theme';
import { HistoryService } from '../lib/storage/storageService';
import { HistoryItem } from '../lib/types';

export default function HistoryScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const items = await HistoryService.getHistory(undefined, 100);
      setHistory(items);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    await HistoryService.clearHistory();
    loadHistory();
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return new Date(timestamp).toLocaleDateString();
  };

  const getCategoryIcon = (type: string) => {
    const icons = {
      ghost: 'skull',
      equipment: 'briefcase',
      map: 'map',
      evidence: 'search',
    };
    return icons[type] || 'bookmark';
  };

  const renderHistoryItem = ({ item, index }: { item: HistoryItem; index: number }) => (
    <View style={[styles.historyItem, { borderLeftColor: colors.haunted }]}>
      <View style={styles.itemNumber}>
        <ThemedText style={styles.itemNumberText}>{index + 1}</ThemedText>
      </View>
      <View style={styles.historyContent}>
        <Ionicons
          name={getCategoryIcon(item.type)}
          size={20}
          color={colors.text}
        />
        <View style={styles.historyText}>
          <ThemedText style={styles.historyName}>{item.itemName}</ThemedText>
          <ThemedText style={styles.historyMeta}>
            {item.type} • {formatTime(item.viewedAt)}
          </ThemedText>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View style={styles.headerTitle}>
          <ThemedText style={styles.title}>History</ThemedText>
          {history.length > 0 && (
            <Pressable
              onPress={handleClearHistory}
              style={styles.clearButton}
            >
              <Ionicons name="trash" size={20} color={colors.text} />
              <ThemedText style={{ fontSize: 12 }}>Clear</ThemedText>
            </Pressable>
          )}
        </View>
        <ThemedText style={styles.subtitle}>
          {history.length} items viewed
        </ThemedText>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ThemedText>Loading...</ThemedText>
        </View>
      ) : history.length === 0 ? (
        <View style={styles.centerContainer}>
          <Ionicons name="time-outline" size={48} color={colors.text} />
          <ThemedText style={styles.emptyText}>No history yet</ThemedText>
          <ThemedText style={styles.emptySubtext}>
            Items you view will appear here
          </ThemedText>
        </View>
      ) : (
        <FlatList
          data={history}
          renderItem={renderHistoryItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={true}
          style={styles.listContainer}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.6,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginVertical: 4,
    borderRadius: 8,
    borderLeftWidth: 4,
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
    gap: 12,
  },
  itemNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemNumberText: {
    fontSize: 12,
    fontWeight: '700',
  },
  historyContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  historyText: {
    flex: 1,
  },
  historyName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  historyMeta: {
    fontSize: 12,
    opacity: 0.6,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
  },
});
```

### 7. Integration Points

**In ghost detail sheet** (`components/ghost-detail-sheet.tsx`):

```typescript
// Add bookmark button to header
<View style={styles.detailHeader}>
  <ThemedText style={styles.ghostName}>{ghost.name}</ThemedText>
  <BookmarkButton
    itemId={ghost.id}
    itemType="ghost"
    itemName={ghost.name}
  />
</View>

// Track view on open
useEffect(() => {
  HistoryService.trackView('ghost', ghost.id, ghost.name);
}, [ghost]);
```

**In tab navigation** (`app/(tabs)/_layout.tsx`):

Add new tabs for Library and History:

```typescript
<Tabs.Screen
  name="library"
  options={{
    title: 'Library',
    headerShown: false,
    tabBarIcon: ({ color, focused }) => (
      <Ionicons
        name={focused ? 'heart' : 'heart-outline'}
        size={24}
        color={color}
      />
    ),
  }}
/>

<Tabs.Screen
  name="history"
  options={{
    title: 'History',
    headerShown: false,
    tabBarIcon: ({ color, focused }) => (
      <Ionicons
        name={focused ? 'time' : 'time-outline'}
        size={24}
        color={color}
      />
    ),
  }}
/>
```

## Implementation Guide

### Step 1: Update Type Definitions
- Add Bookmark, HistoryItem, UserLibrary, CustomCategory interfaces to `lib/types/index.ts`

### Step 2: Create Storage Service
- Add BookmarkService methods to `lib/storage/storageService.ts`
- Add HistoryService methods to `lib/storage/storageService.ts`

### Step 3: Create Components
- Create `components/bookmark-button.tsx`
- Create `components/library-header.tsx`

### Step 4: Create Screens
- Create `app/(tabs)/library.tsx`
- Create `app/(tabs)/history.tsx`

### Step 5: Integration
- Add bookmark buttons to detail sheets
- Add history tracking to detail sheets
- Update navigation to include new tabs
- Add library header to tab navigation

### Step 6: Testing
- Test bookmark creation/removal
- Test history tracking
- Test category filtering
- Test clearing history
- Test persistence across app sessions

## Features

### Bookmarks
- ✅ Add/remove bookmarks for any item
- ✅ View all bookmarks organized by type
- ✅ Tag bookmarks with custom categories
- ✅ Quick access from library screen
- ✅ Persistent storage

### History
- ✅ Automatic tracking of viewed items
- ✅ Newest items first (most recent at top)
- ✅ Time tracking (when viewed)
- ✅ Last 100 items stored
- ✅ Clear history option
- ✅ Filter by type

## Testing Checklist

- [ ] Bookmark button appears in detail sheets
- [ ] Can bookmark an item
- [ ] Bookmark button updates visual state
- [ ] Can remove bookmark
- [ ] Bookmarks persist across sessions
- [ ] Library screen shows all bookmarks
- [ ] Can filter bookmarks by type
- [ ] History tracks viewed items
- [ ] History shows items in reverse chronological order
- [ ] Can clear history
- [ ] History items show correct time
- [ ] Can navigate from history to item detail
- [ ] Cannot bookmark same item twice
- [ ] Storage doesn't exceed reasonable limits
