import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Identifier',
          tabBarIcon: ({ color }) => <Ionicons size={28} name="finger-print" color={color} />,
        }}
      />
      <Tabs.Screen
        name="ghosts"
        options={{
          title: 'Ghosts',
          tabBarIcon: ({ color }) => <Ionicons size={28} name="skull" color={color} />,
        }}
      />
      <Tabs.Screen
        name="equipments"
        options={{
          title: 'Equipment',
          tabBarIcon: ({ color }) => <Ionicons size={28} name="flashlight" color={color} />,
        }}
      />
      <Tabs.Screen
        name="maps"
        options={{
          title: 'Maps',
          tabBarIcon: ({ color }) => <Ionicons size={28} name="home" color={color} />,
        }}
      />
    </Tabs>
  );
}
