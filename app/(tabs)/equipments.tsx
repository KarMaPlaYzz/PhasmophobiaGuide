import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EquipmentDetailSheet } from '@/components/equipment-detail-sheet';
import { scrollRefRegistry } from '@/components/haptic-tab';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { EQUIPMENT_LIST } from '@/lib/data/equipment';
import { Equipment } from '@/lib/types';

export default function EquipmentScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  const route = useRoute();
  
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);

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
      return matchesSearch && matchesCategory;
    });
  }, [searchText, selectedCategory]);

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

  const getCategoryColor = (category: string) => {
    if (category === 'All') return colors.spectral;
    const cat = category.toLowerCase();
    switch (cat) {
      case 'starter':
        return '#1FB46B';
      case 'optional':
        return '#00D9FF';
      case 'truck':
        return '#FFB84D';
      case 'cursed':
        return '#6B4AAC';
      default:
        return colors.text;
    }
  };

  const handleEquipmentPress = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
  };

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        {/*<ThemedText type="title" style={[styles.headerTitle, { color: colors.spectral }]}>Equipment</ThemedText>*/}
      </View>

      <ScrollView ref={handleScrollRef} style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.searchContainer, { borderColor: colors.border, backgroundColor: colors.surface }]}>
          <Ionicons size={20} name="search" color={colors.spectral} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search equipment..."
            placeholderTextColor={colors.tabIconDefault}
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText ? (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Ionicons size={20} name="close-circle" color={colors.spectral} />
            </TouchableOpacity>
          ) : null}
        </View>

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
            const catColor = getCategoryColor(cat);
            const displayLabel = cat === 'All' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1);
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                style={[
                  styles.filterButton,
                  {
                    backgroundColor:
                      selectedCategory === cat
                        ? catColor
                        : colors.tabIconDefault + '15',
                    borderWidth: selectedCategory === cat ? 0 : 1,
                    borderColor: colors.border,
                  },
                ]}>
                <Ionicons
                  size={12}
                  name={getCategoryIcon(cat) as any}
                  color={selectedCategory === cat ? 'white' : colors.text}
                />
                <ThemedText
                  style={{
                    color: selectedCategory === cat ? 'white' : colors.text,
                    fontSize: 11,
                    fontWeight: '600',
                    marginLeft: 4,
                  }}>
                  {displayLabel}
                </ThemedText>
                <View
                  style={[
                    styles.filterCount,
                    {
                      backgroundColor:
                        selectedCategory === cat ? 'rgba(255,255,255,0.3)' : catColor + '30',
                    },
                  ]}
                >
                  <ThemedText
                    style={{
                      color: selectedCategory === cat ? 'white' : catColor,
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

        <ThemedText style={styles.resultCounter}>
          {filteredEquipment.length} item{filteredEquipment.length !== 1 ? 's' : ''}
        </ThemedText>

        {filteredEquipment.length > 0 ? (
          filteredEquipment.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => handleEquipmentPress(item)}
              style={[
                styles.equipmentCard,
                { borderColor: colors.tabIconDefault + '30', backgroundColor: colors.tabIconDefault + '10' },
              ]}>
              <View style={styles.equipmentHeader}>
                <View style={{ flex: 1 }}>
                  <ThemedText type="defaultSemiBold" style={styles.equipmentName}>
                    {item.name}
                  </ThemedText>
                </View>
                <View
                  style={[
                    styles.categoryBadge,
                    { backgroundColor: getCategoryColor(item.category) },
                  ]}>
                  <ThemedText style={styles.categoryText}>
                    {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                  </ThemedText>
                </View>
              </View>

              {item.description ? (
                <ThemedText style={styles.equipmentDescription}>{item.description}</ThemedText>
              ) : null}

              <View style={styles.equipmentStats}>
                {item.cost && item.cost > 0 ? (
                  <View style={styles.statItem}>
                    <ThemedText style={styles.statLabel}>Cost:</ThemedText>
                    <ThemedText style={styles.statValue}>${item.cost}</ThemedText>
                  </View>
                ) : null}
                {item.capacity ? (
                  <View style={styles.statItem}>
                    <ThemedText style={styles.statLabel}>Cap:</ThemedText>
                    <ThemedText style={styles.statValue}>{item.capacity}</ThemedText>
                  </View>
                ) : null}
                <View style={[styles.tapIndicator, { opacity: 0.5, marginLeft: 'auto' }]}>
                  <Ionicons size={16} name="information-circle-outline" color={colors.tabIconDefault} />
                  <Ionicons size={14} name="chevron-forward" color={colors.tabIconDefault} />
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <ThemedText style={styles.noResults}>No equipment matches your search</ThemedText>
        )}
      </ScrollView>

      <EquipmentDetailSheet
        equipment={selectedEquipment}
        isVisible={selectedEquipment !== null}
        onClose={() => setSelectedEquipment(null)}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingVertical: 16, paddingHorizontal: 16 },
  headerTitle: { fontSize: 28, fontWeight: 'bold' },
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
    gap: 7,
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
  categoryBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6 },
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
