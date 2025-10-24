import { usePremiumContext } from '@/lib/context/PremiumContext';
import { purchasePremium, restorePurchases } from '@/lib/services/premiumService';
import { useState } from 'react';

/**
 * Hook for managing premium purchases
 * Uses PremiumContext for centralized state
 */
export const usePremium = () => {
  const context = usePremiumContext();
  const [isPurchasing, setIsPurchasing] = useState(false);

  const handlePurchase = async () => {
    try {
      setIsPurchasing(true);
      await purchasePremium();
      // Premium status will be updated via event listener
    } catch (err) {
      console.error('Error purchasing premium:', err);
      throw err;
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleRestore = async () => {
    try {
      setIsPurchasing(true);
      await restorePurchases();
      // Premium status will be updated via event listener
    } catch (err) {
      console.error('Error restoring purchases:', err);
      throw err;
    } finally {
      setIsPurchasing(false);
    }
  };

  return {
    isPremium: context.isPremium,
    isLoading: context.isLoading,
    isPurchasing,
    error: context.error,
    checkPremiumStatus: context.refreshPremiumStatus,
    handlePurchase,
    handleRestore,
  };
};

