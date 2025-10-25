import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { AnimatedPressable } from '@/components/animated-pressable';
import { EmptyStateAnimation } from '@/components/empty-state-animation';
import { detailSheetEmitter, equipmentSelectionEmitter, ghostSelectionEmitter, mapSelectionEmitter } from '@/components/haptic-tab';
import { PremiumBookmarksFeaturesSheet } from '@/components/premium-bookmarks-features';
import { PremiumPaywallSheet } from '@/components/premium-paywall-sheet';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { usePremium } from '@/hooks/use-premium';
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
  const colors = Colors['dark'];
  const navigation = useNavigation<any>();
  const { isPremium } = usePremium();
  const snapPoints = useMemo(() => ['50%', '90%'], []);

  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [selectedCollection, setSelectedCollection] = useState<string | undefined>();
  const [showPinnedOnly, setShowPinnedOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [premiumSheetVisible, setPremiumSheetVisible] = useState(false);
  const [premiumPaywallVisible, setPremiumPaywallVisible] = useState(false);
  const [selectedBookmark, setSelectedBookmark] = useState<Bookmark | undefined>();
  const [collectionsMap, setCollectionsMap] = useState<Record<string, { name: string; color: string }>>({});
  const [collectionsArray, setCollectionsArray] = useState<Array<{ id: string; name: string; color: string }>>([]);
  
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressTriggeredRef = useRef(false);
  const LONG_PRESS_DURATION = 200; // 200ms instead of default 500ms

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
  }, [isVisible, selectedCategory, selectedCollection, showPinnedOnly]);

  useEffect(() => {
    if (isVisible) {
      // Reset premium sheets when bookmarks sheet opens
      setPremiumSheetVisible(false);
      setPremiumPaywallVisible(false);
    }
  }, [isVisible]);

  const loadBookmarks = async () => {
    setLoading(true);
    try {
      let items = await BookmarkService.getBookmarks();
      
      // Premium: Sort pinned bookmarks to top, then by date
      if (isPremium) {
        items = items.sort((a, b) => {
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          return b.createdAt - a.createdAt;
        });
        
        // Load collections map and array for premium users
        try {
          const collections = await BookmarkService.getCollections();
          const map: Record<string, { name: string; color: string }> = {};
          const array: Array<{ id: string; name: string; color: string }> = [];
          collections.forEach(col => {
            map[col.id] = { name: col.name, color: col.color };
            array.push({ id: col.id, name: col.name, color: col.color });
          });
          setCollectionsMap(map);
          setCollectionsArray(array);
        } catch (error) {
          console.error('Error loading collections:', error);
        }
      } else {
        // Free: Just sort by date
        items = items.sort((a, b) => b.createdAt - a.createdAt);
        setCollectionsArray([]);
      }
      
      // Apply category filter (type: ghost, equipment, map, evidence)
      if (selectedCategory !== 'all') {
        items = items.filter(b => b.type === selectedCategory);
      }
      
      // Apply collection filter (overrides category filter)
      if (selectedCollection) {
        items = items.filter(b => b.collectionId === selectedCollection);
      }
      
      // Apply pinned filter
      if (showPinnedOnly) {
        items = items.filter(b => b.isPinned);
      }
      
      setBookmarks(items);
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBookmark = async (bookmarkId: string) => {
    Alert.alert(
      'Remove Bookmark',
      'Are you sure you want to remove this bookmark?',
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        {
          text: 'Remove',
          onPress: async () => {
            await BookmarkService.removeBookmark(bookmarkId);
            loadBookmarks();
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleDeleteCollection = async (collectionId: string, collectionName: string) => {
    Alert.alert(
      'Delete Collection',
      `Are you sure you want to delete "${collectionName}"? Bookmarks in this collection will not be deleted.`,
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            await BookmarkService.deleteCollection(collectionId);
            setSelectedCollection(undefined); // Reset collection filter
            loadBookmarks();
          },
          style: 'destructive',
        },
      ]
    );
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

  const handleLongPressStart = () => {
    longPressTriggeredRef.current = false;
    longPressTimerRef.current = setTimeout(() => {
      longPressTriggeredRef.current = true;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }, LONG_PRESS_DURATION);
  };

  const handleLongPressEnd = (callback: () => void) => {
    callback();
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

  const renderBookmarkItem = ({ item }: { item: Bookmark }) => {
    const collection = item.collectionId ? collectionsMap[item.collectionId] : null;
    
    return (
    <AnimatedPressable
      onPress={() => {
        // Only navigate if this wasn't a long-press
        if (!longPressTriggeredRef.current) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          handleNavigateToItem(item);
        } else {
          longPressTriggeredRef.current = false;
        }
      }}
      onPressIn={() => handleLongPressStart()}
      onPressOut={() => {
        if (longPressTriggeredRef.current) {
          handleLongPressEnd(() => {
            setSelectedBookmark(item);
            if (isPremium) {
              setPremiumSheetVisible(true);
            } else {
              setPremiumPaywallVisible(true);
            }
          });
        } else {
          if (longPressTimerRef.current) {
            clearTimeout(longPressTimerRef.current);
            longPressTimerRef.current = null;
          }
        }
      }}
      style={[
        styles.bookmarkItem,
        {
          borderLeftColor: item.color || colors.spectral,
          borderLeftWidth: 4,
          backgroundColor: item.color ? item.color + '15' : 'rgba(0, 217, 255, 0.05)',
        },
      ]}
    >
      <View style={styles.bookmarkContent}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: getCategoryColor(item.type) + '20' },
          ]}
        >
          <Ionicons
            name={getCategoryIcon(item.type)}
            size={16}
            color={getCategoryColor(item.type)}
          />
        </View>
        <View style={styles.bookmarkText}>
          {/* Primary row: Name + Pin */}
          <View style={styles.nameRow}>
            <ThemedText style={styles.bookmarkName} numberOfLines={1}>
              {item.itemName}
            </ThemedText>
            {isPremium && item.isPinned && (
              <MaterialIcons name="push-pin" size={14} color={colors.warning} style={{ marginLeft: 6 }} />
            )}
          </View>
          
          {/* Secondary row: Type */}
          <ThemedText style={styles.bookmarkType}>
            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
          </ThemedText>
          
          {/* Premium features: Note */}
          {isPremium && item.note && (
            <ThemedText style={styles.bookmarkNote} numberOfLines={2}>
              "{item.note}"
            </ThemedText>
          )}
          
          {/* Premium features: Collection + Color */}
          {isPremium && (collection || item.color) && (
            <View style={styles.premiumBadgesRow}>
              {collection && (
                <View style={[styles.premiumBadge, { borderColor: collection.color }]}>
                  <MaterialIcons name="folder" size={12} color={collection.color} />
                  <ThemedText style={styles.premiumBadgeText} numberOfLines={1}>
                    {collection.name}
                  </ThemedText>
                </View>
              )}
              {item.color && (
                <View
                  style={[
                    styles.colorBadge,
                    {
                      backgroundColor: item.color,
                      borderColor: colors.border,
                    },
                  ]}
                />
              )}
            </View>
          )}
        </View>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            if (isPremium) {
              setSelectedBookmark(item);
              setPremiumSheetVisible(true);
            } else {
              setPremiumPaywallVisible(true);
            }
          }}
          style={({ pressed }) => [
            styles.actionIcon,
            {
              opacity: !isPremium ? 0.4 : pressed ? 0.7 : 1,
              borderColor: colors.spectral,
            },
          ]}
        >
          <MaterialIcons name="more-vert" size={20} color={colors.spectral} />
          {!isPremium && (
            <View style={styles.lockOverlay}>
              <Ionicons name="lock-closed" size={12} color="#fff" />
            </View>
          )}
        </Pressable>
      </View>
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          handleRemoveBookmark(item.id);
        }}
        style={({ pressed }) => [
          styles.deleteIcon,
          {
            opacity: pressed ? 0.6 : 1,
            borderColor: colors.error,
          },
        ]}
      >
        <MaterialIcons name="close" size={20} color={colors.error} />
      </Pressable>
    </AnimatedPressable>
    );
  };

  const renderCategoryFilter = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filterContentContainer}
      style={styles.filterScroll}
    >
      {isPremium && (
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setShowPinnedOnly(!showPinnedOnly);
          }}
          style={[
            styles.filterPill,
            {
              backgroundColor: showPinnedOnly ? colors.warning : colors.surfaceLight,
            },
          ]}
        >
          <MaterialIcons
            name="push-pin"
            size={14}
            color={showPinnedOnly ? '#000' : colors.text}
            style={{ marginRight: 4 }}
          />
          <ThemedText
            style={{
              color: showPinnedOnly ? '#000' : colors.text,
              fontWeight: showPinnedOnly ? '700' : '500',
              fontSize: 13,
            }}
          >
            Pinned
          </ThemedText>
        </Pressable>
      )}
      
      {(['all', 'ghost', 'equipment', 'map', 'evidence'] as const).map((cat) => (
        <Pressable
          key={cat}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setSelectedCategory(cat);
            setSelectedCollection(undefined); // Reset collection filter when switching categories
          }}
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
    </ScrollView>
  );

  const renderCollectionFilter = () => (
    isPremium && collectionsArray.length > 0 ? (
      <View>
        <ThemedText style={styles.filterLabel}>Collections</ThemedText>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContentContainer}
          style={styles.filterScroll}
        >
          {collectionsArray.map((collection) => (
            <Pressable
              key={collection.id}
              onPress={() => {
                // Only select collection if this wasn't a long-press
                if (!longPressTriggeredRef.current) {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelectedCollection(collection.id);
                  setSelectedCategory('all'); // Reset category to 'all' when selecting collection
                } else {
                  longPressTriggeredRef.current = false;
                }
              }}
              onPressIn={() => handleLongPressStart()}
              onPressOut={() => {
                if (longPressTriggeredRef.current) {
                  longPressTriggeredRef.current = false;
                  handleDeleteCollection(collection.id, collection.name);
                } else {
                  if (longPressTimerRef.current) {
                    clearTimeout(longPressTimerRef.current);
                    longPressTimerRef.current = null;
                  }
                }
              }}
              style={[
                styles.filterPill,
                {
                  backgroundColor:
                    selectedCollection === collection.id
                      ? collection.color + '40'
                      : colors.surfaceLight,
                  borderColor: selectedCollection === collection.id ? collection.color : colors.border,
                  borderWidth: 1,
                },
              ]}
            >
              <MaterialIcons
                name="folder"
                size={13}
                color={selectedCollection === collection.id ? collection.color : collection.color}
                style={{ marginRight: 4 }}
              />
              <ThemedText
                style={{
                  color: selectedCollection === collection.id ? collection.color : colors.text,
                  fontWeight: selectedCollection === collection.id ? '700' : '500',
                  fontSize: 13,
                }}
                numberOfLines={1}
              >
                {collection.name}
              </ThemedText>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    ) : null
  );

  const renderEmptyState = () => (
    <EmptyStateAnimation type="float">
      <View style={styles.centerContainer}>
        <View style={[styles.emptyIconContainer, { backgroundColor: colors.spectral + '20' }]}>
          <MaterialIcons name="favorite-border" size={48} color={colors.spectral} />
        </View>
        <ThemedText style={styles.emptyText}>No bookmarks yet</ThemedText>
        <ThemedText style={styles.emptySubtext}>
          Add items to your favorites to see them here
        </ThemedText>
      </View>
    </EmptyStateAnimation>
  );

  if (!isVisible) return null;

  return (
    <>
      <BottomSheet
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        onClose={() => {
          setPremiumSheetVisible(false);
          setPremiumPaywallVisible(false);
          onClose();
        }}
        index={isVisible ? 0 : -1}
        animateOnMount={true}
        animationConfigs={{
          damping: 80,
          mass: 1.2,
          overshootClamping: true,
        }}
        style={{ borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: 'hidden' }}
        backgroundComponent={() => (
          <BlurView intensity={94} tint="dark" style={StyleSheet.absoluteFillObject} />
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
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                handleClearAllBookmarks();
              }}
              disabled={bookmarks.length === 0}
            style={({ pressed }) => [
              styles.clearIconButton,
              { opacity: bookmarks.length === 0 ? 0.4 : pressed ? 0.6 : 1 },
            ]}
          >
            <MaterialIcons name="highlight-off" size={24} color={colors.error} />
          </Pressable>
        </View>

        {renderCategoryFilter()}

        {renderCollectionFilter()}

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

    {/* Premium Features Sheet */}
    <PremiumBookmarksFeaturesSheet
      isVisible={premiumSheetVisible}
      onClose={() => {
        setPremiumSheetVisible(false);
        setSelectedBookmark(undefined);
        loadBookmarks(); // Reload to reflect changes
      }}
      onBookmarkUpdate={loadBookmarks}
      bookmark={selectedBookmark}
    />

    {/* Premium Paywall Sheet - Only render when needed */}
    {premiumPaywallVisible && (
      <PremiumPaywallSheet
        isVisible={premiumPaywallVisible}
        onClose={() => setPremiumPaywallVisible(false)}
      />
    )}
    </>
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
    paddingVertical: 4,
    gap: 8,
  },
  filterScroll: {
    maxHeight: 50,
    overflow: 'visible',
  },
  filterContentContainer: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.7,
    marginBottom: 4,
    marginLeft: 12,
    marginTop: 8,
  },
  listContainer: {
    flex: 1,
    marginTop: 18,
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
    gap: 6,
  },
  bookmarkContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
    justifyContent: 'space-between',
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
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookmarkNote: {
    fontSize: 11,
    opacity: 0.6,
    fontStyle: 'italic',
    marginTop: 4,
  },
  bookmarkType: {
    fontSize: 12,
    opacity: 0.6,
  },
  premiumBadgesRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 6,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  premiumBadgeText: {
    fontSize: 10,
    opacity: 0.7,
  },
  colorBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
  },
  actionIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 8,
    paddingRight: 8,
    paddingVertical: 8,
    borderWidth: 1.5,
    borderRadius: 8,
    backgroundColor: '#2B2737',
  },
  deleteIcon: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderWidth: 1.5,
    borderRadius: 8,
    backgroundColor: '#2B2737',
  },
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
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
  lockOverlay: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#FF6B6B',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#2B2737',
  },
});
