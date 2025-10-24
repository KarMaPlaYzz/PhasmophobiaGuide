import * as premiumService from '@/lib/services/premiumService';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';

/**
 * Premium Context
 * Centralized state management for premium status
 * Uses AppState listener to detect when app comes to foreground
 * and syncs premium status from AsyncStorage
 * Also listens to premium purchase events for real-time updates
 */

interface PremiumContextType {
  isPremium: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  refreshPremiumStatus: () => Promise<void>;
}

const PremiumContext = createContext<PremiumContextType | undefined>(undefined);

export const usePremiumContext = () => {
  const context = useContext(PremiumContext);
  if (!context) {
    throw new Error('usePremiumContext must be used within PremiumProvider');
  }
  return context;
};

interface PremiumProviderProps {
  children: React.ReactNode;
}

export const PremiumProvider: React.FC<PremiumProviderProps> = ({ children }) => {
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track app state to know when to refresh
  const appStateRef = useRef<AppStateStatus>('active');
  const subscriptionRef = useRef<ReturnType<typeof AppState.addEventListener> | null>(null);
  const unsubscribeRefs = useRef<Array<() => void>>([]);

  /**
   * Refresh premium status from AsyncStorage
   */
  const refreshPremiumStatus = async () => {
    try {
      console.log('[PremiumContext] Refreshing premium status...');
      const premium = await premiumService.isPremiumUser();
      setIsPremium(premium);
      setError(null);
      console.log('[PremiumContext] Premium status updated:', premium);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('[PremiumContext] Error refreshing premium status:', errorMessage);
      setError(errorMessage);
    }
  };

  /**
   * Handle app state changes
   * When app comes to foreground, refresh premium status
   */
  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    if (
      appStateRef.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      // App has come to foreground
      console.log('[PremiumContext] App came to foreground, refreshing premium status');
      await refreshPremiumStatus();
    }

    appStateRef.current = nextAppState;
  };

  /**
   * Initialize premium context
   * - Load initial premium status
   * - Set up AppState listener
   * - Listen to premium purchase events
   */
  useEffect(() => {
    const initializePremium = async () => {
      try {
        setIsLoading(true);
        
        // Load initial premium status
        await refreshPremiumStatus();
        
        // Set up AppState listener to refresh when app comes to foreground
        subscriptionRef.current = AppState.addEventListener(
          'change',
          handleAppStateChange
        );

        // Listen to premium purchase events for real-time updates
        const unsubscribePremiumPurchased = premiumService.onPremiumPurchased((data) => {
          console.log('[PremiumContext] Premium purchased event received:', data);
          setIsPremium(true);
        });
        unsubscribeRefs.current.push(unsubscribePremiumPurchased);

        // Listen to premium status changed events
        const unsubscribePremiumStatusChanged = premiumService.onPremiumStatusChanged((isPremium) => {
          console.log('[PremiumContext] Premium status changed event received:', isPremium);
          setIsPremium(isPremium);
        });
        unsubscribeRefs.current.push(unsubscribePremiumStatusChanged);

        // Listen to purchase errors
        const unsubscribePurchaseError = premiumService.onPurchaseError((error) => {
          console.log('[PremiumContext] Purchase error event received:', error);
          setError(error.message);
        });
        unsubscribeRefs.current.push(unsubscribePurchaseError);

        setIsInitialized(true);
        console.log('[PremiumContext] Initialization complete');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error('[PremiumContext] Failed to initialize:', errorMessage);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    initializePremium();

    // Cleanup on unmount
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.remove();
        subscriptionRef.current = null;
      }
      
      // Unsubscribe from all events
      unsubscribeRefs.current.forEach((unsubscribe) => unsubscribe());
      unsubscribeRefs.current = [];
    };
  }, []);

  const value: PremiumContextType = {
    isPremium,
    isLoading,
    isInitialized,
    error,
    refreshPremiumStatus,
  };

  return (
    <PremiumContext.Provider value={value}>
      {children}
    </PremiumContext.Provider>
  );
};

