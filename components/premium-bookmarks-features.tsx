import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { BlurView } from 'expo-blur';
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
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { BookmarkService } from '@/lib/storage/storageService';
import { Bookmark, BookmarkCollection } from '@/lib/types';

interface PremiumBookmarksFeaturesProps {
  isVisible: boolean;
  onClose: () => void;
  bookmark?: Bookmark;
}

type TabType = 'note' | 'collection' | 'color' | 'manage';

const COLOR_OPTIONS = [
  '#FF6B9D', // Pink (default)
  '#FF6B6B', // Red
  '#FFA500', // Orange
  '#FFD700', // Gold
  '#4ECDC4', // Teal
  '#45B7D1', // Blue
  '#96CEB4', // Green
  '#DDA0DD', // Purple
];

export const PremiumBookmarksFeaturesSheet = ({
  isVisible,
  onClose,
  bookmark,
}: PremiumBookmarksFeaturesProps) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const snapPoints = useMemo(() => ['50%', '90%'], []);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const [activeTab, setActiveTab] = useState<TabType>('note');
  const [note, setNote] = useState(bookmark?.note || '');
  const [collections, setCollections] = useState<BookmarkCollection[]>([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState(bookmark?.collectionId);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [showNewCollectionInput, setShowNewCollectionInput] = useState(false);

  // Load collections on mount
  useEffect(() => {
    if (isVisible && bookmark) {
      loadCollections();
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
      Alert.alert('Success', bookmark.isPinned ? 'Bookmark unpinned' : 'Bookmark pinned to top');
    }
  };

  const handleCreateCollection = async () => {
    if (newCollectionName.trim()) {
      try {
        const collectionId = await BookmarkService.createCollection(
          newCollectionName,
          undefined,
          '#FF6B9D'
        );
        if (bookmark) {
          await BookmarkService.addBookmarkToCollection(bookmark.id, collectionId);
          setSelectedCollectionId(collectionId);
        }
        setNewCollectionName('');
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

  const handleSetColor = async (color: string) => {
    if (bookmark) {
      await BookmarkService.setBookmarkColor(bookmark.id, color);
      Alert.alert('Success', 'Color updated!');
    }
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
          multiline
          numberOfLines={6}
          style={{
            color: colors.text,
            fontSize: 14,
            fontFamily: 'System',
          }}
        />
      </View>

      <View style={styles.actionButtons}>
        <Pressable
          onPress={handleSaveNote}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: colors.tint, opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <Ionicons name="checkmark" size={18} color={colors.background} />
          <ThemedText style={{ color: colors.background, fontWeight: '600' }}>
            Save Note
          </ThemedText>
        </Pressable>

        <Pressable
          onPress={handleTogglePin}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: colors.surface, opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <MaterialIcons
            name={bookmark?.isPinned ? 'pin' : 'push-pin'}
            size={18}
            color={colors.warning}
          />
          <ThemedText style={{ color: colors.text, fontWeight: '600' }}>
            {bookmark?.isPinned ? 'Pinned' : 'Pin to Top'}
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
            onPress={() => setShowNewCollectionInput(true)}
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
        <View
          style={[
            styles.newCollectionInput,
            { borderColor: colors.tint, backgroundColor: colors.surface },
          ]}
        >
          <TextInput
            placeholder="Collection name..."
            placeholderTextColor={colors.text + '50'}
            value={newCollectionName}
            onChangeText={setNewCollectionName}
            style={{
              color: colors.text,
              fontSize: 14,
              flex: 1,
            }}
          />
          <Pressable
            onPress={handleCreateCollection}
            disabled={!newCollectionName.trim()}
            style={({ pressed }) => [
              { opacity: pressed ? 0.6 : !newCollectionName.trim() ? 0.4 : 1 },
            ]}
          >
            <Ionicons name="checkmark-circle" size={24} color={colors.tint} />
          </Pressable>
          <Pressable
            onPress={() => {
              setShowNewCollectionInput(false);
              setNewCollectionName('');
            }}
            style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
          >
            <MaterialIcons name="close" size={24} color={colors.error} />
          </Pressable>
        </View>
      )}

      <FlatList
        data={collections}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => handleAddToCollection(item.id)}
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
            {selectedCollectionId === item.id && (
              <Ionicons name="checkmark-circle" size={20} color={item.color} />
            )}
          </Pressable>
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
            onPress={() => handleSetColor(color)}
            style={({ pressed }) => [
              styles.colorOption,
              {
                backgroundColor: color,
                opacity: pressed ? 0.8 : 1,
                borderWidth: bookmark?.color === color ? 3 : 0,
                borderColor: colors.text,
              },
            ]}
          >
            {bookmark?.color === color && (
              <Ionicons name="checkmark" size={20} color="#fff" />
            )}
          </Pressable>
        ))}
      </View>
    </View>
  );

  const renderManageTab = () => (
    <View style={styles.tabContent}>
      <ThemedText style={styles.tabTitle}>Manage</ThemedText>
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
          <MaterialIcons name="tag" size={18} color={colors.tint} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <ThemedText style={styles.infoLabel}>Tags</ThemedText>
            <View style={styles.tagsContainer}>
              {bookmark?.tags && bookmark.tags.length > 0 ? (
                bookmark.tags.map((tag) => (
                  <View
                    key={tag}
                    style={[
                      styles.tag,
                      { backgroundColor: colors.tint + '20' },
                    ]}
                  >
                    <ThemedText style={[styles.tagText, { color: colors.tint }]}>
                      {tag}
                    </ThemedText>
                  </View>
                ))
              ) : (
                <ThemedText style={[styles.infoValue, { color: colors.text + '70' }]}>
                  No tags
                </ThemedText>
              )}
            </View>
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
      handleComponent={() => (
        <View style={[styles.handleContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.handle, { backgroundColor: colors.text + '30' }]} />
        </View>
      )}
      backgroundComponent={() => (
        <BlurView intensity={90} style={StyleSheet.absoluteFillObject} />
      )}
    >
      <BottomSheetScrollView
        style={[styles.content, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <ThemedText style={styles.title} numberOfLines={1}>
            {bookmark.itemName}
          </ThemedText>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {(['note', 'collection', 'color', 'manage'] as const).map((tab) => (
            <Pressable
              key={tab}
              onPress={() => setActiveTab(tab)}
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
                        : 'settings'
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
        {activeTab === 'manage' && renderManageTab()}

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
  title: {
    fontSize: 24,
    fontWeight: '700',
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
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginVertical: 12,
    gap: 8,
  },
  collectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
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

  // Color Tab
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginVertical: 16,
    justifyContent: 'space-between',
  },
  colorOption: {
    width: '22%',
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Manage Tab
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
