import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
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
import { HistoryService } from '@/lib/storage/storageService';
import { HistoryItem } from '@/lib/types';

interface HistoryDetailSheetProps {
  isVisible: boolean;
  onClose: () => void;
}

type CategoryType = 'all' | 'ghost' | 'equipment' | 'map' | 'evidence';

export const HistoryDetailSheet = ({ 
  isVisible, 
  onClose,
}: HistoryDetailSheetProps) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const navigation = useNavigation<any>();
  const snapPoints = useMemo(() => ['50%', '90%'], []);

  const [history, setHistory] = useState<HistoryItem[]>([]);
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
      loadHistory();
    }
  }, [isVisible, selectedCategory]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const categoryFilter = selectedCategory === 'all' ? undefined : selectedCategory;
      const items = await HistoryService.getHistory(categoryFilter);
      setHistory(items);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear all your history? This action cannot be undone.',
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        {
          text: 'Clear',
          onPress: async () => {
            await HistoryService.clearHistory();
            loadHistory();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleNavigateToItem = (item: HistoryItem) => {
    switch (item.type) {
      case 'ghost': {
        const ghost = GHOST_LIST.find(g => g.id === item.itemId);
        if (ghost) {
          onClose();
          // Emit after closing to ensure proper stacking
          setTimeout(() => ghostSelectionEmitter.emit(ghost), 100);
        }
        break;
      }
      case 'equipment': {
        const equipment = EQUIPMENT_LIST.find(e => e.id === item.itemId);
        if (equipment) {
          onClose();
          setTimeout(() => equipmentSelectionEmitter.emit(equipment), 100);
        }
        break;
      }
      case 'map': {
        const map = MAP_LIST.find(m => m.id === item.itemId);
        if (map) {
          onClose();
          setTimeout(() => mapSelectionEmitter.emit(map), 100);
        }
        break;
      }
      case 'evidence':
        // Evidence doesn't have a detail sheet, navigate to evidence tab
        navigation.navigate('(tabs)', {
          screen: 'evidence',
        });
        onClose();
        break;
    }
  };

  const getCategoryIcon = (type: string): any => {
    const icons: Record<string, any> = {
      ghost: 'skull',
      equipment: 'flashlight',
      map: 'home',
      evidence: 'finger-print',
    };
    return icons[type] || 'time';
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

  const formatTime = (timestamp: number): string => {
    const now = new Date();
    const viewDate = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - viewDate.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return viewDate.toLocaleDateString();
  };

  const renderHistoryItem = ({ item }: { item: HistoryItem }) => (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        handleNavigateToItem(item);
      }}
      style={({ pressed }) => [
        styles.historyItem,
        { borderLeftColor: colors.info, opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <View style={styles.historyContent}>
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
        <View style={styles.historyText}>
          <ThemedText style={styles.historyName}>{item.itemName}</ThemedText>
          <ThemedText style={styles.historyTime}>
            {item.type.charAt(0).toUpperCase() + item.type.slice(1)} • {formatTime(item.viewedAt)}
          </ThemedText>
        </View>
        <MaterialIcons name="chevron-right" size={20} color={colors.text} opacity={0.5} />
      </View>
    </Pressable>
  );

  const renderCategoryFilter = () => (
    <View style={styles.filterContainer}>
      {(['all', 'ghost', 'equipment', 'map', 'evidence'] as const).map((cat) => (
        <Pressable
          key={cat}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setSelectedCategory(cat);
          }}
          style={[
            styles.filterPill,
            {
              backgroundColor:
                selectedCategory === cat ? colors.info : colors.surfaceLight,
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
      <View style={[styles.emptyIconContainer, { backgroundColor: colors.info + '20' }]}>
        <MaterialIcons name="access-time" size={48} color={colors.info} />
      </View>
      <ThemedText style={styles.emptyText}>No history yet</ThemedText>
      <ThemedText style={styles.emptySubtext}>
        Items you view will appear here
      </ThemedText>
    </View>
  );

  if (!isVisible) return null;

  return (
    <>
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
        handleIndicatorStyle={{ backgroundColor: colors.info }}
      >
        <BottomSheetScrollView
          style={{ flex: 1, paddingHorizontal: 16 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <ThemedText style={styles.title} numberOfLines={1}>History</ThemedText>
              <ThemedText style={styles.subtitle} numberOfLines={1}>
                {history.length} item{history.length !== 1 ? 's' : ''} viewed
              </ThemedText>
            </View>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                handleClearHistory();
              }}
              disabled={history.length === 0}
              style={({ pressed }) => [
                styles.clearIconButton,
                { opacity: history.length === 0 ? 0.4 : pressed ? 0.6 : 1 },
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
          ) : history.length === 0 ? (
            renderEmptyState()
          ) : (
            <>
              <FlatList
                data={history}
                renderItem={renderHistoryItem}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                style={styles.listContainer}
              />
            </>
          )}

          <View style={{ height: 20 }} />
        </BottomSheetScrollView>
      </BottomSheet>
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
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginVertical: 4,
    borderRadius: 8,
    borderLeftWidth: 4,
    backgroundColor: 'rgba(0, 150, 255, 0.05)',
  },
  historyContent: {
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
  historyText: {
    flex: 1,
  },
  historyName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  historyTime: {
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
