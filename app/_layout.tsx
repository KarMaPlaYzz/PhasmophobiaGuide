import { Outfit_400Regular, Outfit_600SemiBold, Outfit_700Bold, Outfit_800ExtraBold } from '@expo-google-fonts/outfit';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as Notifications from 'expo-notifications';
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
import { PremiumPaywallSheet } from '@/components/premium-paywall-sheet';
import { SettingsDetailSheet } from '@/components/settings-detail-sheet';
import { WhatsNewDetailSheet } from '@/components/whats-new-detail-sheet';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { LocalizationProvider } from '@/hooks/use-localization';
import { PremiumProvider } from '@/lib/context/PremiumContext';
import { FEATURE_RELEASES, UPCOMING_FEATURES } from '@/lib/data/whats-new';
import { initializeAdMob } from '@/lib/services/admobService';
import { initializePremium, restorePurchases } from '@/lib/services/premiumService';
import { PreferencesService } from '@/lib/storage/preferencesService';
import { Equipment, Ghost } from '@/lib/types';
import { cleanupBlogNotifications, initializeBlogNotifications } from '@/lib/utils/blog-notifications';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors['dark'];

  const [fontsLoaded] = useFonts({
    Outfit_400Regular,
    Outfit_600SemiBold,
    Outfit_700Bold,
    Outfit_800ExtraBold,
  });

  const [isBookmarksVisible, setIsBookmarksVisible] = useState(false);
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);
  const [isWhatsNewVisible, setIsWhatsNewVisible] = useState(false);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [isPremiumPaywallVisible, setIsPremiumPaywallVisible] = useState(false);
  const [isOnboardingVisible, setIsOnboardingVisible] = useState(false);
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

  const handleOnboardingClose = async () => {
    setIsOnboardingVisible(false);
    await PreferencesService.setOnboardingCompleted();
  };

  // Initialize blog notifications
  useEffect(() => {
    const initializeServices = async () => {
      try {
        console.log('[App] Starting app initialization');
        
        try {
          console.log('[App] Initializing blog notifications');
          initializeBlogNotifications();
          console.log('[App] Blog notifications initialized');
        } catch (error) {
          console.warn('[App] Blog notifications failed:', error);
        }
        
        try {
          console.log('[App] Initializing preferences');
          PreferencesService.initialize();
          console.log('[App] Preferences initialized');
          
          // Check if onboarding has been completed
          const onboardingCompleted = await PreferencesService.isOnboardingCompleted();
          if (!onboardingCompleted) {
            setIsOnboardingVisible(true);
          }
        } catch (error) {
          console.warn('[App] Preferences initialization failed:', error);
        }
        
        // Initialize AdMob with error handling
        try {
          console.log('[App] Initializing AdMob');
          await initializeAdMob();
          console.log('[App] AdMob initialized successfully');
        } catch (error) {
          console.warn('[App] AdMob initialization failed (non-critical):', error);
        }
        
        // Initialize Premium/IAP with error handling
        try {
          console.log('[App] Initializing Premium');
          await initializePremium();
          console.log('[App] Premium initialized successfully');
          
          // Attempt to restore purchases on app launch
          try {
            console.log('[App] Attempting to restore purchases');
            await restorePurchases();
            console.log('[App] Restore purchases completed');
          } catch (error) {
            console.warn('[App] Restore purchases failed:', error);
          }
        } catch (error) {
          console.warn('[App] Premium initialization failed (non-critical):', error);
        }
        
        // Request notification permissions
        try {
          console.log('[App] Requesting notification permissions');
          const { status } = await Notifications.requestPermissionsAsync();
          if (status !== 'granted') {
            console.log('[App] Notification permission not granted');
          } else {
            console.log('[App] Notification permissions granted');
          }
        } catch (error) {
          console.error('[App] Failed to request notification permissions:', error);
        }
        
        console.log('[App] App initialization completed successfully');
      } catch (error) {
        console.error('[App] Error during app initialization:', error);
      }
    };
    
    initializeServices();
    
    return () => {
      try {
        console.log('[App] Cleaning up app services');
        cleanupBlogNotifications();
        // endPremiumConnection removed - requires native modules not available in dev builds
      } catch (error) {
        console.warn('[App] Error during cleanup:', error);
      }
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {!fontsLoaded ? null : (
        <LocalizationProvider>
          <PremiumProvider>
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
                        onSettingsPress={() => setIsSettingsVisible(true)}
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
              <SettingsDetailSheet
                isVisible={isSettingsVisible}
                onClose={() => setIsSettingsVisible(false)}
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
              {/* OnboardingScreen temporarily disabled due to crashes */}
              {/* <OnboardingScreen
                isVisible={isOnboardingVisible}
                onClose={handleOnboardingClose}
                onShowPremium={() => setIsPremiumPaywallVisible(true)}
              /> */}
              {isPremiumPaywallVisible && (
                <PremiumPaywallSheet
                  isVisible={isPremiumPaywallVisible}
                  onClose={() => setIsPremiumPaywallVisible(false)}
                />
              )}
            </BottomSheetModalProvider>
            <StatusBar style="auto" />
          </ThemeProvider>
        </PremiumProvider>
      </LocalizationProvider>
      )}
    </GestureHandlerRootView>
  );
}
