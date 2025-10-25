import Constants from 'expo-constants';

/**
 * Detect if the app is running in Expo Go
 * Expo Go has a specific channel and doesn't support native modules
 */
export const isExpoGo = (): boolean => {
  try {
    return Constants.appOwnership === 'expo';
  } catch (error) {
    console.warn('[IsExpoGo] Error checking Expo Go status:', error);
    return false;
  }
};

/**
 * Detect if the app is running in development client or development build
 */
export const isDevelopmentBuild = (): boolean => {
  try {
    return (
      Constants.appOwnership === 'expo' ||
      __DEV__
    );
  } catch (error) {
    return __DEV__;
  }
};
