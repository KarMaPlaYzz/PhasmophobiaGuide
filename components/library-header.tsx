import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/theme';
import { useColorScheme } from '../hooks/use-color-scheme';
import { BookmarkService, HistoryService } from '../lib/storage/storageService';
import { ThemedText } from './themed-text';

interface LibraryHeaderProps {
  variant?: 'compact' | 'full';
  onBookmarksPress?: () => void;
  onHistoryPress?: () => void;
  onWhatsNewPress?: () => void;
}

/**
 * Library Header Component
 * Always displayed app-wide to show quick access to bookmarks and history
 * Displays badge counts for bookmarks and recent history items
 */
export const LibraryHeader: React.FC<LibraryHeaderProps> = ({ 
  variant = 'compact',
  onBookmarksPress,
  onHistoryPress,
  onWhatsNewPress,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();

  const [totalBookmarks, setTotalBookmarks] = useState(0);
  const [totalHistory, setTotalHistory] = useState(0);

  // Load counts when focused and set up periodic refresh
  useFocusEffect(
    useCallback(() => {
      loadCounts();
      
      // Set up an interval to refresh counts every 2 seconds while focused
      const interval = setInterval(() => {
        loadCounts();
      }, 2000);
      
      return () => {
        clearInterval(interval);
      };
    }, [])
  );

  const loadCounts = async () => {
    try {
      const bookmarks = await BookmarkService.getBookmarks();
      const history = await HistoryService.getHistory(undefined, 100);
      setTotalBookmarks(bookmarks.length);
      setTotalHistory(history.length);
    } catch (error) {
      console.error('Error loading library counts:', error);
    }
  };

  const handleBookmarksPress = () => {
    onBookmarksPress?.();
  };

  const handleHistoryPress = () => {
    onHistoryPress?.();
  };

  const handleWhatsNewPress = () => {
    onWhatsNewPress?.();
  };

  if (variant === 'compact') {
    return (
      <View style={[styles.compactContainer, { backgroundColor: 'transparent', borderBottomColor: colors.border, paddingTop: insets.top, borderBottomWidth: 0 }]}>
        <Pressable
          onPress={handleWhatsNewPress}
          style={styles.button}
          accessible
          accessibilityLabel="What's new - upcoming features"
          accessibilityRole="button"
        >
          <MaterialIcons name="new-releases" size={28} color={colors.spectral} />
        </Pressable>

        <Pressable
          onPress={handleBookmarksPress}
          style={styles.button}
          accessible
          accessibilityLabel={`Library with ${totalBookmarks} bookmarks`}
          accessibilityRole="button"
        >
          <MaterialIcons name="bookmark" size={28} color={colors.spectral} />
          {totalBookmarks > 0 && (
            <View style={[styles.badge, { backgroundColor: colors.haunted }]}>
              <ThemedText style={styles.badgeText}>
                {totalBookmarks > 99 ? '99+' : totalBookmarks}
              </ThemedText>
            </View>
          )}
        </Pressable>

        <Pressable
          onPress={handleHistoryPress}
          style={styles.button}
          accessible
          accessibilityLabel={`History with ${totalHistory} items`}
          accessibilityRole="button"
        >
          <MaterialIcons name="history" size={28} color={colors.spectral} />
          {/* History badge commented out to prevent UI clutter as history can stack up quickly */}
          {/* {totalHistory > 0 && (
            <View style={[styles.badge, { backgroundColor: colors.haunted }]}>
              <ThemedText style={styles.badgeText}>
                {totalHistory > 99 ? '99+' : totalHistory}
              </ThemedText>
            </View>
          )} */}
        </Pressable>
      </View>
    );
  }

  // Full variant (less commonly used)
  return (
    <View style={[styles.fullContainer, { backgroundColor: 'transparent', borderBottomColor: colors.border, paddingTop: insets.top, borderBottomWidth: 0 }]}>
      <View style={styles.section}>
        <Pressable
          onPress={handleBookmarksPress}
          style={styles.fullButton}
          accessible
          accessibilityLabel={`Library with ${totalBookmarks} bookmarks`}
          accessibilityRole="button"
        >
          <MaterialIcons name="favorite" size={24} color={colors.spectral} />
          <View style={styles.fullButtonText}>
            <ThemedText style={styles.label}>Bookmarks</ThemedText>
            <ThemedText style={styles.count}>{totalBookmarks}</ThemedText>
          </View>
        </Pressable>
      </View>

      <View style={styles.divider} />

      <View style={styles.section}>
        <Pressable
          onPress={handleHistoryPress}
          style={styles.fullButton}
          accessible
          accessibilityLabel={`History with ${totalHistory} items`}
          accessibilityRole="button"
        >
          <MaterialIcons name="history" size={24} color={colors.haunted} />
          <View style={styles.fullButtonText}>
            <ThemedText style={styles.label}>History</ThemedText>
            <ThemedText style={styles.count}>{totalHistory}</ThemedText>
          </View>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Compact variant - for header bars
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    gap: 4,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  button: {
    position: 'relative',
    padding: 12,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },

  // Full variant - for dedicated section
  fullContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    overflow: 'hidden',
  },
  section: {
    flex: 1,
  },
  fullButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  fullButtonText: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    opacity: 0.7,
  },
  count: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 2,
  },
  divider: {
    width: 1,
    opacity: 0.2,
  },
});
