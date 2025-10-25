import { disableMockPremium, enableMockPremium, isMockPremiumEnabled } from '@/lib/services/premiumService';
import { isExpoGo } from '@/lib/utils/is-expo-go';
import { useEffect, useState } from 'react';

/**
 * Hook for managing mock premium in Expo Go
 * Only available during Expo Go development for testing premium features
 */
export const useMockPremium = () => {
  const [isMockEnabled, setIsMockEnabled] = useState(false);
  const isInExpoGo = isExpoGo();

  useEffect(() => {
    // Check if mock premium is already enabled
    if (isInExpoGo) {
      isMockPremiumEnabled().then(setIsMockEnabled);
    }
  }, [isInExpoGo]);

  const enable = async () => {
    if (!isInExpoGo) {
      console.warn('[MockPremium] Only available in Expo Go');
      return;
    }
    await enableMockPremium();
    setIsMockEnabled(true);
  };

  const disable = async () => {
    await disableMockPremium();
    setIsMockEnabled(false);
  };

  const toggle = async () => {
    if (isMockEnabled) {
      await disable();
    } else {
      await enable();
    }
  };

  return {
    isMockPremiumEnabled: isMockEnabled,
    enableMockPremium: enable,
    disableMockPremium: disable,
    toggleMockPremium: toggle,
    isAvailable: isInExpoGo,
  };
};
