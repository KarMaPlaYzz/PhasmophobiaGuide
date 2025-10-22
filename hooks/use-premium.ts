import { isPremiumUser, purchasePremium, restorePurchases } from '@/lib/services/premiumService';
import { useEffect, useState } from 'react';

/**
 * Hook for managing premium status and purchases
 */
export const usePremium = () => {
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check premium status on mount
  useEffect(() => {
    checkPremiumStatus();
  }, []);

  const checkPremiumStatus = async () => {
    try {
      setIsLoading(true);
      const premium = await isPremiumUser();
      setIsPremium(premium);
    } catch (err) {
      console.error('Error checking premium status:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePurchase = async () => {
    try {
      setIsPurchasing(true);
      setError(null);
      await purchasePremium();
      // Premium status will be updated via the purchase listener
      // Check again to be sure
      setTimeout(() => checkPremiumStatus(), 1000);
    } catch (err) {
      console.error('Error purchasing premium:', err);
      setError(err instanceof Error ? err.message : 'Purchase failed');
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleRestore = async () => {
    try {
      setIsPurchasing(true);
      setError(null);
      const restored = await restorePurchases();
      if (restored) {
        setIsPremium(true);
      }
    } catch (err) {
      console.error('Error restoring purchases:', err);
      setError(err instanceof Error ? err.message : 'Restore failed');
    } finally {
      setIsPurchasing(false);
    }
  };

  return {
    isPremium,
    isLoading,
    isPurchasing,
    error,
    checkPremiumStatus,
    handlePurchase,
    handleRestore,
  };
};
