import AsyncStorage from '@react-native-async-storage/async-storage';
import { EventEmitter } from 'eventemitter3';
import * as RNIap from 'react-native-iap';

// Product ID as it appears in App Store Connect
const PREMIUM_PRODUCT_ID = 'no_ad';
const PREMIUM_STATUS_KEY = 'premium_status';
const PURCHASE_DATE_KEY = 'premium_purchase_date';

/**
 * Premium Service
 * Manages in-app purchases and premium feature access
 */

// Event emitter for premium status changes
const premiumEmitter = new EventEmitter();

export interface PremiumEvent {
  'premium-purchased': (data: { transactionDate: number }) => void;
  'premium-status-changed': (isPremium: boolean) => void;
  'purchase-error': (error: { code: string; message: string }) => void;
}

export const onPremiumPurchased = (callback: (data: { transactionDate: number }) => void) => {
  premiumEmitter.on('premium-purchased', callback);
  return () => premiumEmitter.off('premium-purchased', callback);
};

export const onPremiumStatusChanged = (callback: (isPremium: boolean) => void) => {
  premiumEmitter.on('premium-status-changed', callback);
  return () => premiumEmitter.off('premium-status-changed', callback);
};

export const onPurchaseError = (callback: (error: { code: string; message: string }) => void) => {
  premiumEmitter.on('purchase-error', callback);
  return () => premiumEmitter.off('purchase-error', callback);
};

let isInitialized = false;
let purchaseUpdateSubscription: RNIap.EventSubscription | null = null;
let purchaseErrorSubscription: RNIap.EventSubscription | null = null;

/**
 * Initialize the IAP service
 */
export const initializePremium = async () => {
  try {
    if (isInitialized) {
      console.log('[Premium] Already initialized');
      return;
    }

    console.log('[Premium] Starting initialization');
    
    // Setup connection to App Store/Google Play
    try {
      await RNIap.initConnection();
      console.log('[Premium] Connection established');
    } catch (error) {
      console.warn('[Premium] Connection failed, proceeding with cached data:', error);
    }
    
    isInitialized = true;

    // Check for existing purchases on app start
    try {
      await checkExistingPurchases();
      console.log('[Premium] Checked for existing purchases');
    } catch (error) {
      console.warn('[Premium] Error checking existing purchases:', error);
    }

    // Set up purchase listeners
    try {
      setupPurchaseListeners();
      console.log('[Premium] Purchase listeners set up');
    } catch (error) {
      console.warn('[Premium] Error setting up listeners:', error);
    }

    console.log('[Premium] Initialization complete');
  } catch (error) {
    console.error('[Premium] Failed to initialize:', error);
    throw error;
  }
};

/**
 * Setup purchase event listeners
 */
const setupPurchaseListeners = () => {
  purchaseUpdateSubscription = RNIap.purchaseUpdatedListener((purchase) => {
    console.log('[Premium] Purchase updated:', purchase);
    
    // Only process if it's our premium product and it's not already acknowledged
    if (purchase.productId === PREMIUM_PRODUCT_ID) {
      // Mark as premium immediately
      setPremiumStatus(true, purchase.transactionDate);
      
      // Finish the transaction to acknowledge purchase to the store
      try {
        RNIap.finishTransaction({
          purchase,
          isConsumable: false,
        }).catch((error) => {
          console.warn('[Premium] Error finishing transaction:', error);
          // Non-fatal error - user is marked as premium even if finish fails
        });
      } catch (error) {
        console.warn('[Premium] Error finishing transaction:', error);
      }
    }
  });

  purchaseErrorSubscription = RNIap.purchaseErrorListener((error) => {
    console.warn('[Premium] Purchase error:', error);
    
    // Check if error is user cancellation
    const isUserCancellation = 
      error.code === 'user-cancelled' || 
      error.message?.toLowerCase().includes('cancel');
    
    if (isUserCancellation) {
      console.log('[Premium] User cancelled purchase');
    } else {
      console.error('[Premium] Purchase failed with error:', error.code, error.message);
      premiumEmitter.emit('purchase-error', {
        code: error.code,
        message: error.message,
      });
    }
  });
};

/**
 * End IAP connection (call on app exit)
 */
export const endPremiumConnection = async () => {
  try {
    if (purchaseUpdateSubscription) {
      purchaseUpdateSubscription.remove();
    }
    if (purchaseErrorSubscription) {
      purchaseErrorSubscription.remove();
    }
    await RNIap.endConnection();
    isInitialized = false;
  } catch (error) {
    console.error('Failed to end premium connection:', error);
  }
};

/**
 * Check for existing purchases (for users who paid before)
 */
const checkExistingPurchases = async () => {
  try {
    const availablePurchases = await RNIap.getAvailablePurchases();
    
    for (const purchase of availablePurchases) {
      if (purchase.productId === PREMIUM_PRODUCT_ID) {
        // Verify purchase receipt (optional but recommended)
        // For now, just mark as premium
        await setPremiumStatus(true, purchase.transactionDate);
        console.log('Existing premium purchase found');
        return;
      }
    }
  } catch (error) {
    console.error('Error checking existing purchases:', error);
  }
};

/**
 * Check if user has premium access
 */
export const isPremiumUser = async (): Promise<boolean> => {
  try {
    const status = await AsyncStorage.getItem(PREMIUM_STATUS_KEY);
    return status === 'true';
  } catch (error) {
    console.error('Error checking premium status:', error);
    return false;
  }
};

/**
 * Set premium status in storage
 */
export const setPremiumStatus = async (isPremium: boolean, purchaseDate?: number) => {
  try {
    const previousStatus = await isPremiumUser();
    
    await AsyncStorage.setItem(PREMIUM_STATUS_KEY, isPremium.toString());
    if (isPremium && purchaseDate) {
      await AsyncStorage.setItem(PURCHASE_DATE_KEY, purchaseDate.toString());
    }

    // Emit events if status changed
    if (isPremium && !previousStatus) {
      console.log('[Premium] Premium purchased, emitting event');
      premiumEmitter.emit('premium-purchased', { transactionDate: purchaseDate || Date.now() });
    }
    
    if (isPremium !== previousStatus) {
      console.log('[Premium] Premium status changed:', isPremium);
      premiumEmitter.emit('premium-status-changed', isPremium);
    }
  } catch (error) {
    console.error('Error setting premium status:', error);
  }
};

/**
 * Get purchase date
 */
export const getPurchaseDate = async (): Promise<number | null> => {
  try {
    const date = await AsyncStorage.getItem(PURCHASE_DATE_KEY);
    return date ? parseInt(date, 10) : null;
  } catch (error) {
    console.error('Error getting purchase date:', error);
    return null;
  }
};

/**
 * Get available products (premium plans)
 */
export const getAvailableProducts = async () => {
  try {
    const products = await RNIap.fetchProducts({
      skus: [PREMIUM_PRODUCT_ID],
    });

    return products || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

/**
 * Request premium purchase
 * Call this when user taps "Upgrade to Premium"
 * Note: This is event-based. Listen for purchase updates in the component.
 * Returns immediately after requesting - actual result comes via event listeners.
 */
export const purchasePremium = async (): Promise<void> => {
  try {
    console.log('[Premium] Attempting to fetch products...');
    const products = await RNIap.fetchProducts({
      skus: [PREMIUM_PRODUCT_ID],
    });
    
    console.log('[Premium] Fetched products:', products);
    
    if (!products || products.length === 0) {
      console.warn('[Premium] No products found. This is expected in development builds without NitroModules.');
      console.warn('[Premium] To test IAP, build with: eas build --platform ios --local');
      throw new Error(
        'Premium product not found. This feature only works in production builds. ' +
        'Run "eas build --platform ios --local" to test on a real device.'
      );
    }

    console.log('[Premium] Requesting purchase for:', PREMIUM_PRODUCT_ID);
    // Request purchase with platform-specific structure
    // The actual result will come through the purchase event listeners
    await RNIap.requestPurchase({
      request: {
        ios: { sku: PREMIUM_PRODUCT_ID },
        android: { skus: [PREMIUM_PRODUCT_ID] }
      },
      type: 'in-app'
    });
    
    // Don't show success here - wait for the purchase listener callback
    console.log('[Premium] Purchase request sent, waiting for store response...');
  } catch (error: any) {
    console.error('[Premium] Error requesting premium purchase:', error);
    throw error;
  }
};

/**
 * Restore purchases (for users on new device)
 */
export const restorePurchases = async (): Promise<boolean> => {
  try {
    // Get available purchases
    const purchases = await RNIap.getAvailablePurchases();
    
    for (const purchase of purchases) {
      if (purchase.productId === PREMIUM_PRODUCT_ID) {
        await setPremiumStatus(true, purchase.transactionDate);
        console.log('Purchase restored');
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error('Error restoring purchases:', error);
    return false;
  }
};

/**
 * Reset premium status (for testing - remove in production)
 */
export const resetPremiumStatus = async () => {
  try {
    await AsyncStorage.removeItem(PREMIUM_STATUS_KEY);
    await AsyncStorage.removeItem(PURCHASE_DATE_KEY);
    console.log('Premium status reset');
  } catch (error) {
    console.error('Error resetting premium status:', error);
  }
};

export default {
  initializePremium,
  endPremiumConnection,
  isPremiumUser,
  setPremiumStatus,
  getPurchaseDate,
  getAvailableProducts,
  purchasePremium,
  restorePurchases,
  resetPremiumStatus,
};
