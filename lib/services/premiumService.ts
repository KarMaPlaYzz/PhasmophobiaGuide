import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RNIap from 'react-native-iap';

const PREMIUM_PRODUCT_ID = 'com.Playzzon.PhasmophobiaGuide.no_ad';
const PREMIUM_STATUS_KEY = 'premium_status';
const PURCHASE_DATE_KEY = 'premium_purchase_date';

/**
 * Premium Service
 * Manages in-app purchases and premium feature access
 */

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
    console.log('Purchase updated:', purchase);
    if (purchase.productId === PREMIUM_PRODUCT_ID) {
      setPremiumStatus(true, purchase.transactionDate);
    }
  });

  purchaseErrorSubscription = RNIap.purchaseErrorListener((error) => {
    console.error('Purchase error:', error);
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
    await AsyncStorage.setItem(PREMIUM_STATUS_KEY, isPremium.toString());
    if (isPremium && purchaseDate) {
      await AsyncStorage.setItem(PURCHASE_DATE_KEY, purchaseDate.toString());
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
 * Note: This is event-based, listen for purchaseUpdatedListener
 */
export const purchasePremium = async (): Promise<void> => {
  try {
    const products = await RNIap.fetchProducts({
      skus: [PREMIUM_PRODUCT_ID],
    });
    
    if (!products || products.length === 0) {
      throw new Error('Premium product not found');
    }

    // Request purchase with new API structure
    await RNIap.requestPurchase({
      sku: PREMIUM_PRODUCT_ID,
      type: 'in-app',
    } as any); // Use 'any' as a workaround for the new type system
  } catch (error) {
    console.error('Error requesting premium purchase:', error);
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
