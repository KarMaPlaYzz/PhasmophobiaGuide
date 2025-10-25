import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { BookmarkService } from '@/lib/storage/storageService';
import { Bookmark, BookmarkCollection } from '@/lib/types';

interface PremiumBookmarksFeaturesProps {
  isVisible: boolean;
  onClose: () => void;
  bookmark?: Bookmark;
  onBookmarkUpdate?: () => void;
}

type TabType = 'note' | 'collection' | 'color' | 'info';

const COLOR_OPTIONS = [
  '#00D9FF', // Cyan (spectral - primary theme)
  '#6B4AAC', // Purple (supernatural)
  '#1FB46B', // Green (paranormal)
  '#FF6B6B', // Red (cursed/danger)
  '#FFA500', // Orange (warning)
  '#FFD700', // Gold (premium)
  '#4ECDC4', // Teal (cool)
  '#FF69B4', // Pink (vibrant)
];

export const PremiumBookmarksFeaturesSheet = ({
  isVisible,
  onClose,
  bookmark,
  onBookmarkUpdate,
}: PremiumBookmarksFeaturesProps) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const snapPoints = useMemo(() => ['60%', '90%'], []);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const [activeTab, setActiveTab] = useState<TabType>('note');
  const [note, setNote] = useState(bookmark?.note || '');
  const [collections, setCollections] = useState<BookmarkCollection[]>([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState(bookmark?.collectionId);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [showNewCollectionInput, setShowNewCollectionInput] = useState(false);
  const [newCollectionColor, setNewCollectionColor] = useState(COLOR_OPTIONS[0]);
  const [localBookmark, setLocalBookmark] = useState(bookmark);
  const [isPinned, setIsPinned] = useState(bookmark?.isPinned || false);
  
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const LONG_PRESS_DURATION = 200; // 200ms instead of default 500ms

  // Load collections on mount
  useEffect(() => {
    if (isVisible && bookmark) {
      loadCollections();
      setLocalBookmark(bookmark);
      setIsPinned(bookmark.isPinned || false);
    }
  }, [isVisible, bookmark]);

  const loadCollections = async () => {
    try {
      const cols = await BookmarkService.getCollections();
      setCollections(cols);
    } catch (error) {
      console.error('Error loading collections:', error);
    }
  };

  const handleSaveNote = async () => {
    if (bookmark) {
      await BookmarkService.addNoteToBookmark(bookmark.id, note);
      Alert.alert('Success', 'Note saved!');
    }
  };

  const handleTogglePin = async () => {
    if (bookmark) {
      await BookmarkService.togglePinBookmark(bookmark.id);
      // Update local state immediately for live feedback
      setIsPinned(!isPinned);
      onBookmarkUpdate?.();
    }
  };

  const handleCreateCollection = async () => {
    if (newCollectionName.trim()) {
      try {
        const collectionId = await BookmarkService.createCollection(
          newCollectionName,
          undefined,
          newCollectionColor
        );
        if (bookmark) {
          await BookmarkService.addBookmarkToCollection(bookmark.id, collectionId);
          setSelectedCollectionId(collectionId);
        }
        setNewCollectionName('');
        setNewCollectionColor(COLOR_OPTIONS[0]);
        setShowNewCollectionInput(false);
        await loadCollections();
        Alert.alert('Success', 'Collection created and bookmark added!');
      } catch (error) {
        Alert.alert('Error', 'Failed to create collection');
      }
    }
  };

  const handleAddToCollection = async (collectionId: string) => {
    if (bookmark) {
      if (selectedCollectionId === collectionId) {
        // Remove from collection
        await BookmarkService.removeBookmarkFromCollection(bookmark.id, collectionId);
        setSelectedCollectionId(undefined);
      } else {
        // Add to collection
        if (selectedCollectionId) {
          await BookmarkService.removeBookmarkFromCollection(bookmark.id, selectedCollectionId);
        }
        await BookmarkService.addBookmarkToCollection(bookmark.id, collectionId);
        setSelectedCollectionId(collectionId);
      }
      await loadCollections();
    }
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
            if (selectedCollectionId === collectionId) {
              setSelectedCollectionId(undefined);
            }
            await loadCollections();
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleSetColor = async (color: string) => {
    if (bookmark) {
      // Update local state immediately for live feedback
      setLocalBookmark({ ...localBookmark, color } as Bookmark);
      // Update in database
      await BookmarkService.setBookmarkColor(bookmark.id, color);
      // Notify parent to refresh bookmarks list
      onBookmarkUpdate?.();
    }
  };

  const longPressTriggeredRef = useRef(false);

  const handleLongPressStart = () => {
    longPressTriggeredRef.current = false;
    longPressTimerRef.current = setTimeout(() => {
      longPressTriggeredRef.current = true;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }, LONG_PRESS_DURATION);
  };

  const renderNoteTab = () => (
    <View style={styles.tabContent}>
      <ThemedText style={styles.tabTitle}>Personal Note</ThemedText>
      <ThemedText style={[styles.tabSubtitle, { color: colors.text + '80' }]}>
        Add a personal note to remember details about this bookmark
      </ThemedText>

      <View
        style={[
          styles.noteInput,
          {
            borderColor: colors.border,
            backgroundColor: colors.surface,
          },
        ]}
      >
        <TextInput
          placeholder="Add a note..."
          placeholderTextColor={colors.text + '50'}
          value={note}
          onChangeText={setNote}
          maxLength={100}
          multiline
          numberOfLines={6}
          style={{
            color: colors.text,
            fontSize: 14,
            fontFamily: Fonts.outfit_400,
          }}
        />
      </View>

      <View style={styles.actionButtons}>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            handleSaveNote();
          }}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: colors.tint, opacity: pressed ? 0.8 : 1, flex: 1 },
          ]}
        >
          <Ionicons name="checkmark" size={18} color={colors.background} />
          <ThemedText style={{ color: colors.background, fontWeight: '600' }}>
            Save Note
          </ThemedText>
        </Pressable>
      </View>
    </View>
  );

  const renderCollectionTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.tabHeader}>
        <ThemedText style={styles.tabTitle}>Collections</ThemedText>
        {!showNewCollectionInput && (
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowNewCollectionInput(true);
            }}
            style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
          >
            <MaterialIcons name="add-circle-outline" size={24} color={colors.tint} />
          </Pressable>
        )}
      </View>

      <ThemedText style={[styles.tabSubtitle, { color: colors.text + '80' }]}>
        Organize bookmarks into collections
      </ThemedText>

      {showNewCollectionInput && (
        <View>
          <View
            style={[
              styles.newCollectionInput,
              { borderColor: colors.tint, backgroundColor: colors.surface },
            ]}
          >
            <TextInput
              placeholder="Collection name..."
              placeholderTextColor={colors.text + '60'}
              value={newCollectionName}
              onChangeText={setNewCollectionName}
              maxLength={24}
              style={{
                color: colors.text,
                fontSize: 14,
                flex: 1,
                padding: 0,
              }}
            />
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                handleCreateCollection();
              }}
              disabled={!newCollectionName.trim()}
              style={({ pressed }) => [
                styles.collectionActionButton,
                {
                  opacity: pressed ? 0.6 : !newCollectionName.trim() ? 0.4 : 1,
                  borderColor: colors.tint,
                  backgroundColor: colors.surface,
                },
              ]}
            >
              <Ionicons name="checkmark-circle" size={20} color={colors.tint} />
            </Pressable>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowNewCollectionInput(false);
                setNewCollectionName('');
                setNewCollectionColor(COLOR_OPTIONS[0]);
              }}
              style={({ pressed }) => [
                styles.collectionActionButton,
                {
                  opacity: pressed ? 0.6 : 1,
                  borderColor: colors.error,
                  backgroundColor: colors.surface,
                },
              ]}
            >
              <MaterialIcons name="close" size={20} color={colors.error} />
            </Pressable>
          </View>
          <View style={styles.collectionColorGrid}>
            {COLOR_OPTIONS.map((color) => (
              <Pressable
                key={color}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setNewCollectionColor(color);
                }}
                style={[
                  styles.collectionColorOption,
                  {
                    backgroundColor: color,
                    borderWidth: newCollectionColor === color ? 3 : 2,
                    borderColor: newCollectionColor === color ? colors.text : colors.border,
                  },
                ]}
              />
            ))}
          </View>
        </View>
      )}

      <FlatList
        data={collections}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View style={styles.collectionItemContainer}>
            <Pressable
              onPress={() => {
                // Only select collection if this wasn't a long-press
                if (!longPressTriggeredRef.current) {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  handleAddToCollection(item.id);
                } else {
                  longPressTriggeredRef.current = false;
                }
              }}
              onPressIn={() => handleLongPressStart()}
              onPressOut={() => {
                if (longPressTriggeredRef.current) {
                  longPressTriggeredRef.current = false;
                  handleDeleteCollection(item.id, item.name);
                } else {
                  if (longPressTimerRef.current) {
                    clearTimeout(longPressTimerRef.current);
                    longPressTimerRef.current = null;
                  }
                }
              }}
              style={({ pressed }) => [
                styles.collectionItem,
                {
                  backgroundColor:
                    selectedCollectionId === item.id
                      ? item.color + '30'
                      : colors.surface,
                  borderColor: selectedCollectionId === item.id ? item.color : colors.border,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <View
                style={[
                  styles.collectionIcon,
                  { backgroundColor: item.color + '20' },
                ]}
              >
                <MaterialIcons name="folder" size={18} color={item.color} />
              </View>
              <View style={styles.collectionInfo}>
                <ThemedText style={styles.collectionName}>{item.name}</ThemedText>
                <ThemedText style={[styles.collectionCount, { color: colors.text + '60' }]}>
                  {item.bookmarkIds.length} item{item.bookmarkIds.length !== 1 ? 's' : ''}
                </ThemedText>
              </View>
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  handleDeleteCollection(item.id, item.name);
                }}
                style={({ pressed }) => [
                  styles.collectionDeleteButton,
                  {
                    opacity: pressed ? 0.6 : 1,
                    borderColor: colors.error,
                  },
                ]}
              >
                <MaterialIcons name="close" size={18} color={colors.error} />
              </Pressable>
            </Pressable>
            {selectedCollectionId === item.id && (
              <View style={styles.collectionCheckmark}>
                <Ionicons name="checkmark-circle" size={18} color={item.color} />
              </View>
            )}
          </View>
        )}
        ListEmptyComponent={
          !showNewCollectionInput ? (
            <View style={styles.emptyState}>
              <ThemedText style={[styles.emptyText, { color: colors.text + '60' }]}>
                No collections yet
              </ThemedText>
            </View>
          ) : null
        }
        style={{ maxHeight: 300 }}
      />
    </View>
  );

  const renderColorTab = () => (
    <View style={styles.tabContent}>
      <ThemedText style={styles.tabTitle}>Custom Color</ThemedText>
      <ThemedText style={[styles.tabSubtitle, { color: colors.text + '80' }]}>
        Choose a color to identify this bookmark
      </ThemedText>

      <View style={styles.colorGrid}>
        {COLOR_OPTIONS.map((color) => (
          <Pressable
            key={color}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              handleSetColor(color);
            }}
            style={({ pressed }) => [
              styles.colorOption,
              {
                backgroundColor: color,
                opacity: pressed ? 0.8 : 1,
                borderWidth: localBookmark?.color === color ? 3 : 2,
                borderColor: localBookmark?.color === color ? colors.text : colors.border,
                transform: [{ scale: pressed ? 0.95 : 1 }],
              },
            ]}
          >
            {localBookmark?.color === color && (
              <View style={styles.colorCheckmark}>
                <Ionicons name="checkmark" size={22} color="#fff" />
              </View>
            )}
          </Pressable>
        ))}
      </View>
    </View>
  );

  const renderInfoTab = () => (
    <View style={styles.tabContent}>
      <ThemedText style={styles.tabTitle}>Info</ThemedText>
      <ThemedText style={[styles.tabSubtitle, { color: colors.text + '80' }]}>
        {bookmark?.itemName}
      </ThemedText>

      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <MaterialIcons name="info" size={18} color={colors.tint} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <ThemedText style={styles.infoLabel}>Type</ThemedText>
            <ThemedText style={[styles.infoValue, { color: colors.text + '70' }]}>
              {bookmark && (bookmark.type.charAt(0).toUpperCase() + bookmark.type.slice(1))}
            </ThemedText>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="time" size={18} color={colors.tint} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <ThemedText style={styles.infoLabel}>Added</ThemedText>
            <ThemedText style={[styles.infoValue, { color: colors.text + '70' }]}>
              {new Date(bookmark?.createdAt || 0).toLocaleDateString()}
            </ThemedText>
          </View>
        </View>
      </View>
    </View>
  );

  if (!isVisible || !bookmark) return null;

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      onClose={onClose}
      enablePanDownToClose={true}
      style={{ borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: 'hidden' }}
      backgroundComponent={() => (
        <BlurView intensity={94} style={StyleSheet.absoluteFillObject} />
      )}
      handleIndicatorStyle={{ backgroundColor: colors.spectral }}
    >
      <BottomSheetScrollView
        style={[styles.content]}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <ThemedText style={styles.title} numberOfLines={1}>
              {bookmark.itemName}
            </ThemedText>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                handleTogglePin();
              }}
              style={({ pressed }) => [
                styles.pinButton,
                {
                  opacity: pressed ? 0.6 : 1,
                },
              ]}
            >
              <MaterialIcons
                name="push-pin"
                size={20}
                color={isPinned ? colors.warning : colors.text + '60'}
              />
            </Pressable>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {(['note', 'collection', 'color', 'info'] as const).map((tab) => (
            <Pressable
              key={tab}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setActiveTab(tab);
              }}
              style={({ pressed }) => [
                styles.tab,
                {
                  borderBottomColor:
                    activeTab === tab ? colors.tint : 'transparent',
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Ionicons
                name={
                  tab === 'note'
                    ? 'document-text'
                    : tab === 'collection'
                      ? 'folder'
                      : tab === 'color'
                        ? 'color-palette'
                        : 'information-circle'
                }
                size={18}
                color={activeTab === tab ? colors.tint : colors.text + '60'}
              />
              <ThemedText
                style={[
                  styles.tabLabel,
                  { color: activeTab === tab ? colors.tint : colors.text + '60' },
                ]}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </ThemedText>
            </Pressable>
          ))}
        </View>

        {/* Tab Content */}
        {activeTab === 'note' && renderNoteTab()}
        {activeTab === 'collection' && renderCollectionTab()}
        {activeTab === 'color' && renderColorTab()}
        {activeTab === 'info' && renderInfoTab()}

        <View style={{ height: 32 }} />
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  handleContainer: {
    paddingTop: 12,
    paddingBottom: 8,
    alignItems: 'center',
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
  },

  // Header
  header: {
    marginBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    flex: 1,
  },
  pinButton: {
    padding: 8,
    borderRadius: 8,
  },

  // Tabs
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    gap: 0,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    gap: 6,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
  },

  // Tab Content
  tabContent: {
    gap: 12,
  },
  tabTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 8,
  },
  tabSubtitle: {
    fontSize: 13,
    fontWeight: '500',
  },
  tabHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },

  // Note Tab
  noteInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginVertical: 12,
    minHeight: 120,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 6,
  },

  // Collection Tab
  newCollectionInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginVertical: 12,
    gap: 8,
  },
  collectionColorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
    justifyContent: 'center',
  },
  collectionColorOption: {
    width: '23%', 
    borderRadius: 8,
    minHeight: 40,
  },
  collectionActionButton: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderWidth: 1.5,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  collectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginVertical: 6,
    gap: 12,
  },
  collectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  collectionInfo: {
    flex: 1,
  },
  collectionName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  collectionCount: {
    fontSize: 12,
  },
  collectionItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  collectionDeleteButton: {
    paddingVertical: 6,
    paddingHorizontal: 6,
    marginLeft: 8,
    borderWidth: 1.5,
    borderRadius: 8,
    backgroundColor: '#2B2737',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  collectionCheckmark: {
    paddingLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Color Tab
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginVertical: 16,
    justifyContent: 'center',
  },
  colorOption: {
    width: '22%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 40,
  },
  colorCheckmark: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Info Tab
  infoSection: {
    gap: 16,
    marginTop: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 13,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '500',
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyText: {
    fontSize: 13,
    fontWeight: '500',
  },
});
