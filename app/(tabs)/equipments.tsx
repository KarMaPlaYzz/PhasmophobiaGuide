import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { EQUIPMENT_LIST } from '@/lib/data/equipment';

export default function EquipmentScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'starter', 'optional', 'truck', 'cursed'];

  const filteredEquipment = useMemo(() => {
    return EQUIPMENT_LIST.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchText.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchText, selectedCategory]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'starter':
        return '#4CAF50';
      case 'optional':
        return '#2196F3';
      case 'truck':
        return '#FF9800';
      case 'cursed':
        return '#9C27B0';
      default:
        return colors.text;
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { backgroundColor: colors.background, paddingTop: insets.top }]}>
        <ThemedText type="title" style={styles.headerTitle}>Equipment</ThemedText>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.searchContainer, { borderColor: colors.tabIconDefault }]}>
          <Ionicons size={20} name="search" color={colors.tabIconDefault} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search equipment..."
            placeholderTextColor={colors.tabIconDefault}
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText ? (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Ionicons size={20} name="close-circle" color={colors.tabIconDefault} />
            </TouchableOpacity>
          ) : null}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
          contentContainerStyle={styles.filterContent}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setSelectedCategory(cat)}
              style={[
                styles.filterButton,
                {
                  backgroundColor: selectedCategory === cat ? colors.tint : colors.tabIconDefault + '20',
                },
              ]}>
              <ThemedText
                style={{
                  color: selectedCategory === cat ? 'white' : colors.text,
                  fontSize: 12,
                  fontWeight: '600',
                }}>
                {cat === 'all' ? 'All' : cat.replace('_', ' ')}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ThemedText style={styles.resultCounter}>
          {filteredEquipment.length} item{filteredEquipment.length !== 1 ? 's' : ''}
        </ThemedText>

        {filteredEquipment.length > 0 ? (
          filteredEquipment.map((item) => (
            <View
              key={item.id}
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
                    {item.category.replace('_', ' ')}
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
              </View>
            </View>
          ))
        ) : (
          <ThemedText style={styles.noResults}>No equipment matches your search</ThemedText>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingVertical: 12, paddingHorizontal: 16 },
  headerTitle: { fontSize: 28, fontWeight: 'bold' },
  content: { flex: 1, paddingHorizontal: 16, paddingTop: 12 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 14, paddingVertical: 4 },
  filterContainer: { marginBottom: 12 },
  filterContent: { paddingVertical: 4, gap: 8 },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  resultCounter: { fontSize: 12, opacity: 0.6, marginBottom: 8, marginLeft: 2 },
  equipmentCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 5,
  },
  equipmentHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 },
  equipmentName: { fontSize: 16 },
  categoryBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  categoryText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  equipmentDescription: { fontSize: 12, marginBottom: 8, lineHeight: 16 },
  equipmentStats: { flexDirection: 'row', gap: 16 },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statLabel: { fontSize: 11, opacity: 0.7 },
  statValue: { fontSize: 11, fontWeight: '600' },
  noResults: { textAlign: 'center', marginTop: 32, fontSize: 14, opacity: 0.5 },
});
