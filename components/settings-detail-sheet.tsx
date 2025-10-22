import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Switch, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useLocalization } from '@/hooks/use-localization';
import { PreferencesService } from '@/lib/storage/preferencesService';
import { BookmarkService, HistoryService } from '@/lib/storage/storageService';

interface SettingsDetailSheetProps {
  isVisible: boolean;
  onClose: () => void;
}

export const SettingsDetailSheet = ({
  isVisible,
  onClose,
}: SettingsDetailSheetProps) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const snapPoints = useMemo(() => ['60%', '100%'], []);
  const { t } = useLocalization();

  const [blogNotificationsEnabled, setBlogNotificationsEnabled] = useState(true);
  const [hapticFeedbackEnabled, setHapticFeedbackEnabled] = useState(true);
  const [defaultTab, setDefaultTab] = useState<'ghosts' | 'equipments' | 'index' | 'evidence' | 'sanity-calculator'>('index');
  const [appVersion, setAppVersion] = useState('1.0.0');
  const [gameVersionDate, setGameVersionDate] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Load preferences on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const prefs = await PreferencesService.getPreferences();
      setBlogNotificationsEnabled(prefs.blogNotificationsEnabled);
      setHapticFeedbackEnabled(prefs.hapticFeedbackEnabled);
      setDefaultTab(prefs.defaultTab);

      // Get app version from package.json or set a constant
      setAppVersion('1.0.0'); // You can update this in app.json

      // Set game version date (current date)
      const lastUpdated = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
      setGameVersionDate(lastUpdated);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBlogNotificationsChange = async (value: boolean) => {
    try {
      if (hapticFeedbackEnabled) {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      setBlogNotificationsEnabled(value);
      await PreferencesService.setBlogNotifications(value);
    } catch (error) {
      console.error('Error updating blog notifications:', error);
    }
  };

  const handleHapticFeedbackChange = async (value: boolean) => {
    try {
      if (hapticFeedbackEnabled) {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      setHapticFeedbackEnabled(value);
      await PreferencesService.setHapticFeedback(value);
    } catch (error) {
      console.error('Error updating haptic feedback:', error);
    }
  };

  const handleDefaultTabChange = async (tab: typeof defaultTab) => {
    try {
      if (hapticFeedbackEnabled) {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      setDefaultTab(tab);
      await PreferencesService.setDefaultTab(tab);
    } catch (error) {
      console.error('Error updating default tab:', error);
    }
  };

  const handleClearHistory = () => {
    Alert.alert(
      t('settings.clearHistoryConfirm'),
      t('settings.clearHistoryMessage'),
      [
        {
          text: t('common.cancel'),
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: t('common.clear'),
          onPress: async () => {
            try {
              if (hapticFeedbackEnabled) {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              }
              await HistoryService.clearHistory();
              Alert.alert(t('settings.clearSuccess'), t('settings.clearHistory'));
            } catch (error) {
              console.error('Error clearing history:', error);
              Alert.alert(t('settings.clearError'), t('settings.clearHistory'));
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleClearBookmarks = () => {
    Alert.alert(
      t('settings.clearBookmarksConfirm'),
      t('settings.clearBookmarksMessage'),
      [
        {
          text: t('common.cancel'),
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: t('common.clear'),
          onPress: async () => {
            try {
              if (hapticFeedbackEnabled) {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              }
              const bookmarks = await BookmarkService.getBookmarks();
              for (const bookmark of bookmarks) {
                await BookmarkService.removeBookmark(bookmark.id);
              }
              Alert.alert(t('settings.clearSuccess'), t('settings.clearBookmarks'));
            } catch (error) {
              console.error('Error clearing bookmarks:', error);
              Alert.alert(t('settings.clearError'), t('settings.clearBookmarks'));
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  if (isLoading) {
    return (
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
        handleIndicatorStyle={{ backgroundColor: colors.spectral }}
      >
        <BottomSheetScrollView style={{ flex: 1, paddingHorizontal: 16 }}>
          <View style={styles.loadingContainer}>
            <Ionicons name="refresh" size={40} color={colors.spectral} />
            <ThemedText style={styles.loadingText}>{t('common.loading')}</ThemedText>
          </View>
        </BottomSheetScrollView>
      </BottomSheet>
    );
  }

  return (
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
      handleIndicatorStyle={{ backgroundColor: colors.spectral }}
    >
      <BottomSheetScrollView
        style={{ flex: 1, paddingHorizontal: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <ThemedText style={styles.headerTitle}>{t('settings.title')}</ThemedText>
            <ThemedText style={styles.headerSubtitle}>
              {t('settings.managePreferences')}
            </ThemedText>
          </View>
          <Ionicons name="settings" size={28} color={colors.spectral} />
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>{t('settings.notificationsUpdates')}</ThemedText>
          <SettingItem
            icon="newspaper"
            label={t('settings.blogNotifications')}
            description={t('settings.blogNotificationsDesc')}
            toggle={true}
            value={blogNotificationsEnabled}
            onToggle={handleBlogNotificationsChange}
            colors={colors}
          />
        </View>

        {/* Data & Storage Section */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>{t('settings.dataStorage')}</ThemedText>
          <SettingItem
            icon="trash"
            label={t('settings.clearHistory')}
            description={t('settings.clearHistoryDesc')}
            onPress={handleClearHistory}
            colors={colors}
            destructive
          />
          <SettingItem
            icon="bookmark-outline"
            label={t('settings.clearBookmarks')}
            description={t('settings.clearBookmarksDesc')}
            onPress={handleClearBookmarks}
            colors={colors}
            destructive
          />
        </View>

        {/* Behavior & Preferences Section */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>{t('settings.behaviorPreferences')}</ThemedText>
          <SettingItem
            icon="hand-right"
            label={t('settings.hapticFeedback')}
            description={t('settings.hapticFeedbackDesc')}
            toggle={true}
            value={hapticFeedbackEnabled}
            onToggle={handleHapticFeedbackChange}
            colors={colors}
          />
          <DefaultTabSelector
            selectedTab={defaultTab}
            onTabChange={handleDefaultTabChange}
            colors={colors}
          />
        </View>

        {/* About & Info Section */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>{t('settings.aboutInfo')}</ThemedText>
          <SettingItem
            icon="information-circle"
            label={t('settings.appVersion')}
            description={appVersion}
            colors={colors}
            disabled
          />
          <SettingItem
            icon="calendar"
            label={t('settings.gameDataUpdated')}
            description={gameVersionDate}
            colors={colors}
            disabled
          />
        </View>

        <View style={{ height: 20 }} />
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

interface SettingItemProps {
  icon: string;
  label: string;
  description: string;
  colors: typeof Colors.light;
  toggle?: boolean;
  value?: boolean;
  onToggle?: (value: boolean) => void;
  onPress?: () => void;
  destructive?: boolean;
  disabled?: boolean;
}

const SettingItem: React.FC<SettingItemProps> = ({
  icon,
  label,
  description,
  colors,
  toggle = false,
  value = false,
  onToggle,
  onPress,
  destructive = false,
  disabled = false,
}) => {
  const handlePress = () => {
    if (!disabled && onPress) {
      onPress();
    }
  };

  const iconColor = destructive ? colors.error : colors.spectral;

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || toggle}
      style={[
        styles.settingItem,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          opacity: disabled ? 0.6 : 1,
        },
      ]}
    >
      <View style={styles.settingItemLeft}>
        <Ionicons name={icon as any} size={24} color={iconColor} />
        <View style={styles.settingItemText}>
          <ThemedText style={styles.settingLabel}>{label}</ThemedText>
          <ThemedText style={styles.settingDescription}>{description}</ThemedText>
        </View>
      </View>
      {toggle && onToggle ? (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: colors.border, true: colors.spectral }}
          thumbColor="#FFFFFF"
        />
      ) : (
        !disabled && <Ionicons name="chevron-forward" size={20} color={colors.spectral} />
      )}
    </Pressable>
  );
};

interface DefaultTabSelectorProps {
  selectedTab: 'ghosts' | 'equipments' | 'index' | 'evidence' | 'sanity-calculator';
  onTabChange: (tab: 'ghosts' | 'equipments' | 'index' | 'evidence' | 'sanity-calculator') => void;
  colors: typeof Colors.light;
}

const DefaultTabSelector: React.FC<DefaultTabSelectorProps> = ({
  selectedTab,
  onTabChange,
  colors,
}) => {
  const { t } = useLocalization();
  
  const TAB_OPTIONS = [
    { id: 'ghosts', label: t('tabs.ghosts'), icon: <Ionicons name="skull" size={24} color={colors.spectral} /> },
    { id: 'equipments', label: t('tabs.equipment'), icon: <Ionicons name="flashlight" size={24} color={colors.spectral} /> },
    { id: 'index', label: t('tabs.maps'), icon: <Ionicons name="home" size={24} color={colors.spectral} /> },
    { id: 'evidence', label: t('tabs.evidence'), icon: <MaterialIcons name="fingerprint" size={24} color={colors.spectral} /> },
    { id: 'sanity-calculator', label: t('tabs.sanity'), icon: <Ionicons name="pulse" size={24} color={colors.spectral} /> },
  ] as const;

  const currentTabIndex = TAB_OPTIONS.findIndex((tab) => tab.id === selectedTab);
  const safeIndex = currentTabIndex >= 0 ? currentTabIndex : 0;
  const currentTab = TAB_OPTIONS[safeIndex];

  const handleCycleTab = () => {
    const nextIndex = (safeIndex + 1) % TAB_OPTIONS.length;
    onTabChange(TAB_OPTIONS[nextIndex].id as any);
  };

  return (
    <Pressable
      onPress={handleCycleTab}
      style={[
        styles.settingItem,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          marginBottom: 10,
        },
      ]}
    >
      <View style={styles.settingItemLeft}>
        {currentTab.icon}
        <View style={styles.settingItemText}>
          <ThemedText style={styles.settingLabel}>{t('settings.defaultTab')}</ThemedText>
          <ThemedText style={styles.settingDescription}>
            {t('settings.defaultTabDesc')}
          </ThemedText>
        </View>
      </View>
      <View style={styles.tabBadge}>
        <ThemedText style={styles.tabBadgeText}>{currentTab.label}</ThemedText>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
    marginTop: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 12,
    opacity: 0.6,
  },

  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
    opacity: 0.7,
  },

  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
  },
  settingItemLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingItemText: {
    flex: 1,
    justifyContent: 'center',
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 11,
    opacity: 0.6,
    lineHeight: 14,
  },

  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  loadingText: {
    fontSize: 13,
    opacity: 0.6,
  },

  tabBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#00D9FF',
  },
  tabBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
