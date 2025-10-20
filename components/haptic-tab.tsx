import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { ScrollView } from 'react-native';

// Global registry to store scroll refs by tab name
export const scrollRefRegistry = new Map<string, ScrollView | null>();

// Global event emitter for closing detail sheets
export const detailSheetEmitter = {
  listeners: new Set<() => void>(),
  
  subscribe: (callback: () => void) => {
    detailSheetEmitter.listeners.add(callback);
    return () => {
      detailSheetEmitter.listeners.delete(callback);
    };
  },
  
  emit: () => {
    detailSheetEmitter.listeners.forEach(callback => callback());
  },
};

export function HapticTab(props: BottomTabBarButtonProps) {
  const navigation = useNavigation();
  
  return (
    <PlatformPressable
      {...props}
      onPressIn={(ev) => {
        if (process.env.EXPO_OS === 'ios') {
          // Add a soft haptic feedback when pressing down on the tabs.
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        props.onPressIn?.(ev);
      }}
      onPress={(ev) => {
        // Get the navigation state
        const state = (navigation as any).getState?.();
        const currentIndex = state?.index ?? -1;
        
        // Extract route name from href (e.g., "/equipments" -> "equipments", "/ghosts" -> "ghosts")
        const href = (props as any).href ?? '';
        let pressedRouteName = href.replace(/^\//, ''); // Remove leading slash
        if (!pressedRouteName) {
          pressedRouteName = 'index'; // Root path is "index" tab
        }
        
        const currentRouteName = state?.routes[currentIndex]?.name ?? '';

        // Close any open detail sheets when navigating to a different tab
        if (pressedRouteName && currentRouteName !== pressedRouteName) {
          detailSheetEmitter.emit();
        }

        // Call the default press handler first
        props.onPress?.(ev);

        // If already on this tab, scroll to top
        if (currentRouteName === pressedRouteName && pressedRouteName) {
          const scrollRef = scrollRefRegistry.get(pressedRouteName);
          if (scrollRef) {
            setTimeout(() => {
              (scrollRef as any).scrollTo?.({ y: 0, animated: true });
            }, 0);
          }
        }
      }}
    />
  );
}
