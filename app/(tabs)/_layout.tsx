import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
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
  );
}
