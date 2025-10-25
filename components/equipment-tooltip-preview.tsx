import { Colors } from '@/constants/theme';
import {
    getCategoryColor,
    getEquipmentDetail
} from '@/lib/utils/equipment-details';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from './themed-text';

interface EquipmentTooltipProps {
  equipmentId: string;
  onPress?: () => void;
}

/**
 * Quick tooltip/preview of equipment information
 * Tappable to open full details
 */
export const EquipmentTooltipPreview = ({
  equipmentId,
  onPress,
}: EquipmentTooltipProps) => {
  const colors = Colors['dark'];
  const trimmedId = equipmentId?.trim?.() || equipmentId;
  const detail = getEquipmentDetail(trimmedId);

  console.log('EquipmentTooltipPreview rendering - ID:', trimmedId, 'Found:', !!detail);

  // Debug: Log if detail not found
  if (!detail) {
    console.warn(`Equipment not found for ID: "${trimmedId}"`);
    return (
      <View style={[styles.container, { backgroundColor: colors.spectral + '08', borderColor: '#FF6B6B' }]}>
        <ThemedText style={[styles.name, { color: '#FF6B6B' }]}>Equipment not found</ThemedText>
        <ThemedText style={styles.description}>{trimmedId}</ThemedText>
      </View>
    );
  }

  const categoryColor = getCategoryColor(detail.category);

  console.log('Rendering equipment:', detail.name);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: pressed ? colors.spectral + '15' : colors.spectral + '08',
          borderColor: categoryColor,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <ThemedText style={styles.name}>{detail.name}</ThemedText>
          <View style={styles.meta}>
            <MaterialIcons name="attach-money" size={12} color={colors.spectral} />
            <ThemedText style={styles.metaText}>${detail.cost}</ThemedText>
          </View>
        </View>
        <MaterialIcons name="info" size={16} color={colors.spectral} />
      </View>

      {detail.detects.length > 0 && (
        <ThemedText style={styles.detects} numberOfLines={1}>
          Detects: {detail.detects.join(', ')}
        </ThemedText>
      )}

      <ThemedText style={styles.description} numberOfLines={2}>
        {detail.description}
      </ThemedText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 2,
    gap: 10,
    minHeight: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  name: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 2,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '700',
    opacity: 0.9,
  },
  detects: {
    fontSize: 12,
    color: '#00D9FF',
    fontWeight: '700',
    opacity: 1,
    marginTop: 4,
  },
  description: {
    fontSize: 12,
    lineHeight: 16,
    opacity: 0.85,
    marginTop: 4,
  },
});
