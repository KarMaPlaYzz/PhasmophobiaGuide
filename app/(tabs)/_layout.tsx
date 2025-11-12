import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Tabs, useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';

import { AdBanner } from '@/components/ad-banner';
import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { PreferencesService } from '@/lib/storage/preferencesService';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors['dark'];
  const router = useRouter();
  const hasNavigated = useRef(false);

  // Load default tab preference on first mount
  useEffect(() => {
    const loadAndNavigate = async () => {
      if (hasNavigated.current) return; // Prevent multiple navigations
      
      try {
        const defaultTab = await PreferencesService.getDefaultTab();
        console.log('Default tab from preferences:', defaultTab);
        
        // Only navigate if it's not the default index tab
        if (defaultTab !== 'index') {
          hasNavigated.current = true;
          // Use router.replace to navigate within the tab stack
          router.replace(`/(tabs)/${defaultTab}` as any);
        }
      } catch (error) {
        console.error('Error loading default tab:', error);
      }
    };

    // Small delay to ensure navigation is ready
    const timer = setTimeout(loadAndNavigate, 100);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={{ flex: 1 }}>
      {/* Ad Banner above Tab Navigation */}
      <View style={{ 
        backgroundColor: colors.surface,
        borderBottomColor: colors.border,
        borderBottomWidth: 1,
        paddingHorizontal: 0,
        paddingVertical: 8,
      }}>
        <AdBanner />
      </View>
      
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.tint,
          tabBarInactiveTintColor: colors.tabIconDefault,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
            borderTopWidth: 1,
            height: 70,
            paddingTop: 12,
            paddingBottom: 16,
            justifyContent: 'center',
            alignItems: 'center',
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
            marginTop: 2,
            marginBottom: 0,
          },
          tabBarIconStyle: {
            marginBottom: 0,
          },
        }}
      >
      <Tabs.Screen
        name="ghosts"
        options={{
          title: '',
          tabBarIcon: ({ color }) => <Ionicons size={28} name="skull" color={color} />,
        }}
      />
      <Tabs.Screen
        name="equipments"
        options={{
          title: '',
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="flashlight-on" color={color} />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: '',
          tabBarIcon: ({ color }) => <Ionicons size={28} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="evidence"
        options={{
          title: '',
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="fingerprint" color={color} />,
        }}
      />
      <Tabs.Screen
        name="sanity-calculator"
        options={{
          title: '',
          tabBarIcon: ({ color }) => <Ionicons size={28} name="pulse" color={color} />,
        }}
      />
      </Tabs>
    </View>
  );
}
