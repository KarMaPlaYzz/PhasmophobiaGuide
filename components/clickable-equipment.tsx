import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Pressable, Text } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ALL_EQUIPMENT } from '@/lib/data/equipment';

interface ClickableEquipmentProps {
  equipmentName: string;
  style?: any;
  textStyle?: any;
  onPress?: () => void;
}

export const ClickableEquipment: React.FC<ClickableEquipmentProps> = ({
  equipmentName,
  style,
  textStyle,
  onPress,
}) => {
  const navigation = useNavigation<any>();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }

    // Find equipment by name
    const equipment = Object.values(ALL_EQUIPMENT).find(
      (item: any) => item?.name === equipmentName
    );

    if (equipment) {
      // Navigate to equipment tab with specific equipment selected
      (navigation as any).navigate('equipments', {
        params: { selectedEquipmentId: (equipment as any).id },
      });
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      style={[
        {
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 4,
          backgroundColor: colors.spectral + '20',
          borderWidth: 1,
          borderColor: colors.spectral + '40',
        },
        style,
      ]}
    >
      <Text
        style={[
          {
            color: colors.spectral,
            fontWeight: '500',
            fontSize: 13,
          },
          textStyle,
        ]}
      >
        {equipmentName} →
      </Text>
    </Pressable>
  );
};

export default ClickableEquipment;
