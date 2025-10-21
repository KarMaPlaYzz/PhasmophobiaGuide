import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import React, { useEffect, useMemo, useState } from 'react';
import {
    Alert,
    FlatList,
    Pressable,
    StyleSheet,
    View,
} from 'react-native';

import { detailSheetEmitter, equipmentSelectionEmitter, ghostSelectionEmitter, mapSelectionEmitter } from '@/components/haptic-tab';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { EQUIPMENT_LIST } from '@/lib/data/equipment';
import { GHOST_LIST } from '@/lib/data/ghosts';
import { MAP_LIST } from '@/lib/data/maps';
import { BookmarkService } from '@/lib/storage/storageService';
import { Bookmark } from '@/lib/types';

interface BookmarksDetailSheetProps {
  isVisible: boolean;
  onClose: () => void;
}

type CategoryType = 'all' | 'ghost' | 'equipment' | 'map' | 'evidence';

export const BookmarksDetailSheet = ({ isVisible, onClose }: BookmarksDetailSheetProps) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const navigation = useNavigation<any>();
  const snapPoints = useMemo(() => ['50%', '90%'], []);

  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = detailSheetEmitter.subscribe(() => {
      onClose();
    });
    return unsubscribe;
  }, [onClose]);

  useEffect(() => {
    if (isVisible) {
      loadBookmarks();
    }
  }, [isVisible, selectedCategory]);

  const loadBookmarks = async () => {
    setLoading(true);
    try {
      const categoryFilter = selectedCategory === 'all' ? undefined : selectedCategory;
      const items = await BookmarkService.getBookmarks(categoryFilter);
      setBookmarks(items);
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBookmark = async (bookmarkId: string) => {
    await BookmarkService.removeBookmark(bookmarkId);
    loadBookmarks();
  };

  const handleClearAllBookmarks = () => {
    Alert.alert(
      'Clear All Bookmarks',
      'Are you sure you want to remove all bookmarks? This action cannot be undone.',
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        {
          text: 'Remove',
          onPress: async () => {
            const allBookmarks = await BookmarkService.getBookmarks();
            for (const bookmark of allBookmarks) {
              await BookmarkService.removeBookmark(bookmark.id);
            }
            loadBookmarks();
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleNavigateToItem = (bookmark: Bookmark) => {
    switch (bookmark.type) {
      case 'ghost': {
        const ghost = GHOST_LIST.find(g => g.id === bookmark.itemId);
        if (ghost) {
          onClose();
          setTimeout(() => ghostSelectionEmitter.emit(ghost), 100);
        }
        break;
      }
      case 'equipment': {
        const equipment = EQUIPMENT_LIST.find(e => e.id === bookmark.itemId);
        if (equipment) {
          onClose();
          setTimeout(() => equipmentSelectionEmitter.emit(equipment), 100);
        }
        break;
      }
      case 'map': {
        const map = MAP_LIST.find(m => m.id === bookmark.itemId);
        if (map) {
          onClose();
          setTimeout(() => mapSelectionEmitter.emit(map), 100);
        }
        break;
      }
      case 'evidence':
        navigation.navigate('(tabs)', {
          screen: 'evidence',
          params: {
            selectedEvidenceId: bookmark.itemId,
            scrollToEvidence: true,
          },
        });
        break;
    }
    onClose();
  };

  const getCategoryIcon = (type: string): any => {
    const icons: Record<string, any> = {
      ghost: 'skull',
      equipment: 'flashlight',
      map: 'home',
      evidence: 'finger-print',
    };
    return icons[type] || 'bookmark';
  };

  const getCategoryColor = (type: string): string => {
    const iconColors: Record<string, string> = {
      ghost: colors.paranormal,
      equipment: colors.warning,
      map: colors.info,
      evidence: colors.success,
    };
    return iconColors[type] || colors.icon;
  };

  const renderBookmarkItem = ({ item }: { item: Bookmark }) => (
    <Pressable
      onPress={() => handleNavigateToItem(item)}
      style={({ pressed }) => [
        styles.bookmarkItem,
        { borderLeftColor: colors.spectral, opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <View style={styles.bookmarkContent}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: getCategoryColor(item.type) + '20' },
          ]}
        >
          <MaterialIcons
            name={getCategoryIcon(item.type)}
            size={16}
            color={getCategoryColor(item.type)}
          />
        </View>
        <View style={styles.bookmarkText}>
          <ThemedText style={styles.bookmarkName}>{item.itemName}</ThemedText>
          <ThemedText style={styles.bookmarkType}>
            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
          </ThemedText>
        </View>
        <MaterialIcons name="chevron-right" size={20} color={colors.text} opacity={0.5} />
      </View>
      <Pressable
        onPress={() => handleRemoveBookmark(item.id)}
        style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
      >
        <MaterialIcons name="close" size={20} color={colors.error} />
      </Pressable>
    </Pressable>
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
                selectedCategory === cat ? colors.spectral : colors.surfaceLight,
            },
          ]}
        >
          <ThemedText
            style={{
              color: selectedCategory === cat ? '#000' : colors.text,
              fontWeight: selectedCategory === cat ? '700' : '500',
              fontSize: 13,
            }}
          >
            {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </ThemedText>
        </Pressable>
      ))}
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.centerContainer}>
      <View style={[styles.emptyIconContainer, { backgroundColor: colors.spectral + '20' }]}>
        <MaterialIcons name="favorite-border" size={48} color={colors.spectral} />
      </View>
      <ThemedText style={styles.emptyText}>No bookmarks yet</ThemedText>
      <ThemedText style={styles.emptySubtext}>
        Add items to your favorites to see them here
      </ThemedText>
    </View>
  );

  if (!isVisible) return null;

  return (
    <BottomSheet
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      onClose={onClose}
      index={isVisible ? 0 : -1}
      animateOnMount={true}
      style={{ borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: 'hidden' }}
      backgroundComponent={() => (
        <BlurView intensity={94} style={StyleSheet.absoluteFillObject} />
      )}
      handleIndicatorStyle={{ backgroundColor: colors.spectral }}
    >
      <BottomSheetScrollView
        style={{ flex: 1, paddingHorizontal: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={{ flex: 1, paddingRight: 12 }}>
            <ThemedText style={styles.title} numberOfLines={1}>Bookmarks</ThemedText>
            <ThemedText style={styles.subtitle} numberOfLines={1}>
              {bookmarks.length} saved item{bookmarks.length !== 1 ? 's' : ''}
            </ThemedText>
          </View>
          <Pressable
            onPress={handleClearAllBookmarks}
            disabled={bookmarks.length === 0}
            style={({ pressed }) => [
              styles.clearIconButton,
              { opacity: bookmarks.length === 0 ? 0.4 : pressed ? 0.6 : 1 },
            ]}
          >
            <MaterialIcons name="delete-outline" size={24} color={colors.error} />
          </Pressable>
        </View>

        {renderCategoryFilter()}

        {loading ? (
          <View style={styles.centerContainer}>
            <ThemedText>Loading...</ThemedText>
          </View>
        ) : bookmarks.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={bookmarks}
            renderItem={renderBookmarkItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            style={styles.listContainer}
          />
        )}

        <View style={{ height: 20 }} />
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 0,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 2,
    lineHeight: 28,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.6,
    lineHeight: 18,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingVertical: 12,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  listContainer: {
    flex: 1,
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
    backgroundColor: 'rgba(0, 217, 255, 0.05)',
  },
  bookmarkContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
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
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    minHeight: 200,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
    maxWidth: '80%',
  },
  clearIconButton: {
    padding: 8,
    borderRadius: 8,
    marginLeft: 16,
    flexShrink: 0,
  },
});
