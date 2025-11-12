import { Ionicons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import React, { memo, useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AdBanner } from '@/components/ad-banner';
import { AnimatedScreen } from '@/components/animated-screen';
import { AnimatedSearchBar } from '@/components/animated-search-bar';
import { EquipmentDetailSheet } from '@/components/equipment-detail-sheet';
import { EquipmentOptimizerSheet } from '@/components/equipment-optimizer-sheet';
import { scrollRefRegistry } from '@/components/haptic-tab';
import { PlatformBlurView } from '@/components/platform-blur-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useLocalization } from '@/hooks/use-localization';
import { usePremium } from '@/hooks/use-premium';
import { ALL_EQUIPMENT, EQUIPMENT_LIST } from '@/lib/data/equipment';
import { getEquipmentDescription, getEquipmentName } from '@/lib/localization';
import { Equipment } from '@/lib/types';
import { getCategoryColor } from '@/lib/utils/colors';

// ============================================================================
// MEMOIZED EQUIPMENT CARD COMPONENT
// ============================================================================
interface EquipmentCardProps {
  item: Equipment;
  colors: typeof Colors['dark'];
  language: string;
  onPress: (equipment: Equipment) => void;
  getCategoryColor: (category: string) => string;
  getCategoryIcon: (category: string) => string;
  t: (key: string) => string;
  styles: any;
}

const EquipmentCard = memo(({
  item,
  colors,
  language,
  onPress,
  getCategoryColor: getCategoryColorProp,
  getCategoryIcon,
  t,
  styles,
}: EquipmentCardProps) => (
  <TouchableOpacity
    onPress={() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onPress(item);
    }}
    style={[
      styles.equipmentCard,
      {
        borderLeftWidth: 4,
        borderLeftColor: getCategoryColorProp(item.category),
        backgroundColor: getCategoryColorProp(item.category) + '10',
        borderColor: getCategoryColorProp(item.category) + '30',
      },
    ]}>
    <View style={styles.equipmentHeader}>
      <View style={{ flex: 1 }}>
        <ThemedText type="defaultSemiBold" style={styles.equipmentName}>
          {getEquipmentName(item.id, language as any)}
        </ThemedText>
      </View>
      <View
        style={[
          styles.categoryBadge,
          {
            backgroundColor: getCategoryColorProp(item.category) + '20',
            borderColor: getCategoryColorProp(item.category),
            borderWidth: 1,
          },
        ]}>
        <Ionicons
          size={12}
          name={getCategoryIcon(item.category) as any}
          color={getCategoryColorProp(item.category)}
        />
        <ThemedText style={[styles.categoryText, { color: getCategoryColorProp(item.category) }]}>
          {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
        </ThemedText>
      </View>
    </View>

    {item.description ? (
      <ThemedText style={styles.equipmentDescription}>{getEquipmentDescription(item.id, language as any)}</ThemedText>
    ) : null}

    <View style={styles.equipmentStats}>
      {item.cost && item.cost > 0 ? (
        <View style={styles.statItem}>
          <ThemedText style={styles.statLabel}>{t('tabs.equipment_costLabel')}</ThemedText>
          <ThemedText style={styles.statValue}>${item.cost}</ThemedText>
        </View>
      ) : null}
      {item.capacity ? (
        <View style={styles.statItem}>
          <ThemedText style={styles.statLabel}>{t('tabs.equipment_capacityLabel')}</ThemedText>
          <ThemedText style={styles.statValue}>{item.capacity}</ThemedText>
        </View>
      ) : null}
      <View style={[styles.tapIndicator, { opacity: 0.5, marginLeft: 'auto' }]}>
        <Ionicons size={16} name="information-circle-outline" color={colors.tabIconDefault} />
        <Ionicons size={14} name="chevron-forward" color={colors.tabIconDefault} />
      </View>
    </View>
  </TouchableOpacity>
), (prevProps, nextProps) => {
  // Return true if props are equal (skip re-render), false otherwise
  return (
    prevProps.item.id === nextProps.item.id &&
    prevProps.language === nextProps.language &&
    prevProps.colors === nextProps.colors
  );
});

EquipmentCard.displayName = 'EquipmentCard';

export default function EquipmentScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors['dark'];
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const navigation = useNavigation<any>();
  const { language, t } = useLocalization();
  const { isPremium } = usePremium();

  // NOTE: Premium status is automatically refreshed by PremiumContext:
  // - On app startup
  // - When app comes to foreground (AppState listener)
  // - When purchase completes (event listener)
  // No need to refresh on every tab focus - this causes unnecessary context updates
  
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [optimizerVisible, setOptimizerVisible] = useState(false);

  // Handle incoming equipment ID from navigation params
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const params = route.params as any;
      if (params?.selectedEquipmentId) {
        // Find equipment by ID and open detail sheet
        const equipment = ALL_EQUIPMENT[params.selectedEquipmentId];
        if (equipment) {
          setSelectedEquipment(equipment);
          
          // Clear params to prevent opening the same equipment on subsequent tab visits
          navigation.setParams({ selectedEquipmentId: undefined });
          
          // Optionally scroll to equipment if requested
          if (params?.scrollToEquipment) {
            setTimeout(() => {
              // Equipment sheet is now open, user can see details
            }, 100);
          }
        }
      }
    });

    return unsubscribe;
  }, [navigation, route]);

  // Use callback ref to always have the latest ref
  const handleScrollRef = (ref: ScrollView | null) => {
    if (ref) {
      scrollRefRegistry.set(route.name, ref as any);
    }
  };

  const categories = ['All', 'starter', 'optional', 'truck', 'cursed'];

  const filteredEquipment = useMemo(() => {
    return EQUIPMENT_LIST.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchText.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || item.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesType = !selectedType || item.type === selectedType;
      return matchesSearch && matchesCategory && matchesType;
    });
  }, [searchText, selectedCategory, selectedType]);

  const getCategoryIcon = (category: string): string => {
    const cat = category.toLowerCase();
    switch (cat) {
      case 'starter':
        return 'play';
      case 'optional':
        return 'star';
      case 'truck':
        return 'car';
      case 'cursed':
        return 'skull';
      default:
        return 'grid';
    }
  };

  const getCategoryColorLocal = (category: string) => {
    if (category === 'All') return colors.spectral;
    return getCategoryColor(category);
  };

  const handleEquipmentPress = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
  };

  return (
    <AnimatedScreen>
      <ThemedView style={styles.container}>
        <ScrollView ref={handleScrollRef} style={styles.content} showsVerticalScrollIndicator={false}>
        <AnimatedSearchBar
          placeholder={t('tabs.equipment_searchPlaceholder')}
          value={searchText}
          onChangeText={setSearchText}
          searchIconColor={colors.spectral}
          textColor={colors.text}
          placeholderTextColor={colors.tabIconDefault}
          backgroundColor={colors.surface}
          borderColor={colors.border}
          focusedBorderColor={colors.spectral}
          clearButtonColor={colors.spectral}
          style={[styles.searchContainer]}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={[styles.filterContainer]}
          contentContainerStyle={styles.filterContent}>
          {categories.map((cat) => {
            const count =
              cat === 'All'
                ? EQUIPMENT_LIST.length
                : EQUIPMENT_LIST.filter((item) => item.category.toLowerCase() === cat.toLowerCase()).length;
            const catColor = getCategoryColorLocal(cat);
            const displayLabel = cat === 'All' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1);
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelectedCategory(cat);
                }}
                style={[
                  styles.filterButton,
                  {
                    backgroundColor:
                      selectedCategory === cat
                        ? catColor + '25'
                        : colors.tabIconDefault + '10',
                    borderWidth: selectedCategory === cat ? 2 : 1,
                    borderColor: selectedCategory === cat ? catColor : colors.tabIconDefault + '20',
                  },
                ]}>
                <Ionicons
                  size={12}
                  name={getCategoryIcon(cat) as any}
                  color={selectedCategory === cat ? catColor : colors.tabIconDefault}
                />
                <ThemedText
                  style={{
                    color: selectedCategory === cat ? catColor : colors.tabIconDefault,
                    fontSize: 11,
                    fontWeight: selectedCategory === cat ? '700' : '500',
                    marginLeft: 4,
                  }}>
                  {displayLabel}
                </ThemedText>
                <View
                  style={[
                    styles.filterCount,
                    {
                      backgroundColor: selectedCategory === cat ? catColor + '30' : colors.tabIconDefault + '15',
                    },
                  ]}
                >
                  <ThemedText
                    style={{
                      color: selectedCategory === cat ? catColor : colors.tabIconDefault,
                      fontSize: 10,
                      fontWeight: 'bold',
                    }}
                  >
                    {count}
                  </ThemedText>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Equipment Type Filter - Premium Only */}
        {isPremium && (
          <View style={styles.filterSection}>
            <ThemedText style={styles.filterLabel}>Equipment Type</ThemedText>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={[styles.filterContainer]}
              contentContainerStyle={styles.filterContent}
            >
              {['detector', 'audio', 'camera', 'utility', 'protective', 'consumable'].map((type) => {
                const count = EQUIPMENT_LIST.filter((e) => e.type === type).length;
                const typeColor = colors.paranormal;
                const typeIcon = type === 'detector' ? 'pulse' : type === 'audio' ? 'volume-high' : type === 'camera' ? 'camera' : type === 'utility' ? 'construct' : type === 'protective' ? 'shield' : 'flask';
                return (
                  <TouchableOpacity
                    key={type}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setSelectedType(selectedType === type ? null : type);
                    }}
                    style={[
                      styles.filterButton,
                      {
                        backgroundColor:
                          selectedType === type
                            ? typeColor + '25'
                            : colors.tabIconDefault + '10',
                        borderWidth: selectedType === type ? 2 : 1,
                        borderColor: selectedType === type ? typeColor : colors.border,
                      },
                    ]}
                  >
                    <Ionicons
                      size={12}
                      name={typeIcon as any}
                      color={selectedType === type ? typeColor : colors.text}
                    />
                    <ThemedText
                      style={{
                        color: selectedType === type ? typeColor : colors.text,
                        fontSize: 11,
                        fontWeight: selectedType === type ? '700' : '500',
                        marginLeft: 4,
                      }}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </ThemedText>
                    <View
                      style={[
                        styles.filterCount,
                        {
                          backgroundColor: (selectedType === type ? typeColor : colors.text) + '30',
                        },
                      ]}
                    >
                      <ThemedText
                        style={{
                          color: selectedType === type ? typeColor : colors.text,
                          fontSize: 10,
                          fontWeight: 'bold',
                        }}
                      >
                        {count}
                      </ThemedText>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        <ThemedText style={styles.resultCounter}>
          {filteredEquipment.length} {filteredEquipment.length === 1 ? t('tabs.equipment_resultSingular') : t('tabs.equipment_resultPlural')}
        </ThemedText>

        {filteredEquipment.length > 0 ? (
          filteredEquipment.map((item, index) => (
            <React.Fragment key={item.id}>
              {/* Show banner ad in the middle of the list */}
              {index > 0 && index % 8 === 0 && (
                <View style={styles.adContainer}>
                  <AdBanner />
                </View>
              )}
              <EquipmentCard
                item={item}
                colors={colors}
                language={language}
                onPress={handleEquipmentPress}
                getCategoryColor={getCategoryColor}
                getCategoryIcon={getCategoryIcon}
                t={t}
                styles={styles}
              />
            </React.Fragment>
          ))
        ) : (
          <ThemedText style={styles.noResults}>{t('tabs.equipment_noResults')}</ThemedText>
        )}

        {/* Ad at the bottom of the list */}
        {filteredEquipment.length > 0 && (
          <View style={styles.adContainer}>
            <AdBanner />
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button - Glassmorphism Design with BlurView */}
      {selectedEquipment === null && !optimizerVisible && (
        <View
          style={{
            position: 'absolute',
            bottom: insets.bottom + 20,
            right: 20,
            width: 64,
            height: 64,
            borderRadius: 32,
            overflow: 'hidden',
            zIndex: 5,
            borderWidth: 1.5,
            borderColor: colors.spectral + '50',
          }}
        >
          <PlatformBlurView intensity={15} style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
          }}>
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setOptimizerVisible(true);
              }}
              activeOpacity={0.7}
              style={styles.fabContent}
            >
              <MaterialIcons name="construction" size={28} color={colors.spectral} />
            </TouchableOpacity>
          </PlatformBlurView>
        </View>
      )}

      <EquipmentDetailSheet
        equipment={selectedEquipment}
        isVisible={selectedEquipment !== null}
        onClose={() => setSelectedEquipment(null)}
      />

      <EquipmentOptimizerSheet
        isVisible={optimizerVisible}
        onClose={() => setOptimizerVisible(false)}
      />
      </ThemedView>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingVertical: 12, paddingHorizontal: 16, flexDirection: 'row', justifyContent: 'flex-end' },
  headerTitle: { fontSize: 28, fontWeight: 'bold' },
  adContainer: { marginVertical: 12, marginHorizontal: -16 },
  fab: { 
    position: 'absolute', 
    width: 64, 
    height: 64, 
    borderRadius: 32, 
    justifyContent: 'center', 
    alignItems: 'center', 
    shadowColor: '#00D9FF',
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.15, 
    shadowRadius: 8, 
    elevation: 5, 
    zIndex: 5,
    overflow: 'hidden',
  },
  fabContent: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    marginBottom: 16,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: { flex: 1, fontSize: 15, paddingVertical: 4 },
  filterContainer: { height: 52, flex: 0, marginBottom: 12 },
  filterContent: { paddingVertical: 6, gap: 10, flexGrow: 0, flexShrink: 0 },
  filterButton: {
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minHeight: 46,
  },
  filterCount: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 24,
  },
  filterSection: {
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
    opacity: 0.7,
  },
  resultCounter: { fontSize: 13, opacity: 0.6, marginBottom: 12, marginLeft: 2, fontWeight: '500' },
  equipmentCard: {
    borderWidth: 0,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    minHeight: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  equipmentHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 10 },
  equipmentName: { fontSize: 16, fontWeight: '700', flex: 1 },
  categoryBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6, flexDirection: 'row', alignItems: 'center', gap: 4 },
  categoryText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  equipmentDescription: { fontSize: 13, marginBottom: 10, lineHeight: 18, display: 'none' },
  equipmentStats: { flexDirection: 'row', gap: 12, marginBottom: 10, alignItems: 'center' },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statLabel: { fontSize: 13, opacity: 0.65, fontWeight: '500' },
  statValue: { fontSize: 13, fontWeight: '700' },
  tapIndicator: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  tapText: { fontSize: 12, opacity: 0.5, fontWeight: '400' },
  noResults: { textAlign: 'center', marginTop: 32, fontSize: 15, opacity: 0.5 },
});
