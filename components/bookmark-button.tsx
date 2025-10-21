import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useEffect, useState } from 'react';
import { Pressable } from 'react-native';
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
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Pressable
      onPress={toggleBookmark}
      disabled={loading}
      style={{ opacity: loading ? 0.5 : 1 }}
      accessible
      accessibilityLabel={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
      accessibilityRole="button"
    >
      <MaterialIcons
        name={isBookmarked ? 'favorite' : 'favorite-border'}
        size={size}
        color={isBookmarked ? color : '#999'}
      />
    </Pressable>
  );
};
