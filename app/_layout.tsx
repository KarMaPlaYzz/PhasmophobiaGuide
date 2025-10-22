import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import { BookmarksDetailSheet } from '@/components/bookmarks-detail-sheet';
import { EquipmentDetailSheet } from '@/components/equipment-detail-sheet';
import { GhostDetailSheet } from '@/components/ghost-detail-sheet';
import { equipmentSelectionEmitter, ghostSelectionEmitter, mapSelectionEmitter } from '@/components/haptic-tab';
import { HistoryDetailSheet } from '@/components/history-detail-sheet';
import { LibraryHeader } from '@/components/library-header';
import { MapDetailSheet } from '@/components/map-detail-sheet';
import { WhatsNewDetailSheet } from '@/components/whats-new-detail-sheet';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { FEATURE_RELEASES, UPCOMING_FEATURES } from '@/lib/data/whats-new';
import { Equipment, Ghost } from '@/lib/types';
import { cleanupBlogNotifications, initializeBlogNotifications } from '@/lib/utils/blog-notifications';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [isBookmarksVisible, setIsBookmarksVisible] = useState(false);
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);
  const [isWhatsNewVisible, setIsWhatsNewVisible] = useState(false);
  const [selectedGhost, setSelectedGhost] = useState<Ghost | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [selectedMap, setSelectedMap] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = ghostSelectionEmitter.subscribe((ghost) => {
      setSelectedGhost(ghost);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = equipmentSelectionEmitter.subscribe((equipment) => {
      setSelectedEquipment(equipment);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = mapSelectionEmitter.subscribe((map) => {
      setSelectedMap(map);
    });
    return unsubscribe;
  }, []);

  // Initialize blog notifications
  useEffect(() => {
    initializeBlogNotifications();
    
    return () => {
      cleanupBlogNotifications();
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <BottomSheetModalProvider>
          <Stack
            screenOptions={{
              contentStyle: { backgroundColor: colors.background },
            }}
          >
            <Stack.Screen
              name="(tabs)"
              options={{
                headerShown: true,
                header: () => (
                  <LibraryHeader 
                    variant="compact"
                    onBookmarksPress={() => setIsBookmarksVisible(true)}
                    onHistoryPress={() => setIsHistoryVisible(true)}
                    onWhatsNewPress={() => setIsWhatsNewVisible(true)}
                  />
                ),
              }}
            />
          </Stack>

          <BookmarksDetailSheet
            isVisible={isBookmarksVisible}
            onClose={() => setIsBookmarksVisible(false)}
          />
          <HistoryDetailSheet
            isVisible={isHistoryVisible}
            onClose={() => setIsHistoryVisible(false)}
          />
          <WhatsNewDetailSheet
            isVisible={isWhatsNewVisible}
            onClose={() => setIsWhatsNewVisible(false)}
            releases={FEATURE_RELEASES}
            upcomingFeatures={UPCOMING_FEATURES}
          />
          <GhostDetailSheet
            ghost={selectedGhost}
            isVisible={selectedGhost !== null}
            onClose={() => setSelectedGhost(null)}
          />
          <EquipmentDetailSheet
            equipment={selectedEquipment}
            isVisible={selectedEquipment !== null}
            onClose={() => setSelectedEquipment(null)}
          />
          <MapDetailSheet
            map={selectedMap}
            isVisible={selectedMap !== null}
            onClose={() => setSelectedMap(null)}
          />
        </BottomSheetModalProvider>
        <StatusBar style="auto" />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
