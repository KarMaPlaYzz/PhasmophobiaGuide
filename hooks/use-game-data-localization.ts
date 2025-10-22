import { getEquipmentName, getGhostName } from '@/lib/localization';
import { useLocalization } from './use-localization';

/**
 * Hook to get localized game data
 */
export const useGameDataLocalization = () => {
  const { language } = useLocalization();

  return {
    getGhostName: (ghostId: string) => getGhostName(ghostId, language),
    getEquipmentName: (equipmentId: string) => getEquipmentName(equipmentId, language),
  };
};
