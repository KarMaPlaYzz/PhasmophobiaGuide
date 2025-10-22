import { i18n, SupportedLanguage } from '@/lib/localization';
import { PreferencesService } from '@/lib/storage/preferencesService';
import React, { createContext, FC, ReactNode, useContext, useEffect, useState } from 'react';

interface LocalizationContextType {
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => Promise<void>;
  t: (key: string) => string;
  tFallback: (key: string) => string;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

interface LocalizationProviderProps {
  children: ReactNode;
}

export const LocalizationProvider: FC<LocalizationProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>('en');
  const [isLoading, setIsLoading] = useState(true);

  // Load language preference on mount
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        setIsLoading(true);
        const prefs = await PreferencesService.getPreferences();
        const savedLanguage = (prefs as any).language || 'en';
        setLanguageState(savedLanguage);
        i18n.setLanguage(savedLanguage);
      } catch (error) {
        console.error('Error loading language preference:', error);
        i18n.setLanguage('en');
        setLanguageState('en');
      } finally {
        setIsLoading(false);
      }
    };

    loadLanguage();
  }, []);

  const handleSetLanguage = async (newLanguage: SupportedLanguage) => {
    try {
      i18n.setLanguage(newLanguage);
      setLanguageState(newLanguage);
      await PreferencesService.updatePreferences({ language: newLanguage } as any);
    } catch (error) {
      console.error('Error setting language:', error);
    }
  };

  const value: LocalizationContextType = {
    language,
    setLanguage: handleSetLanguage,
    t: (key: string) => i18n.t(key),
    tFallback: (key: string) => i18n.tFallback(key),
  };

  // Return children immediately - loading state is handled internally
  return React.createElement(
    LocalizationContext.Provider,
    { value },
    children
  );
};

/**
 * Hook to use localization context
 */
export const useLocalization = (): LocalizationContextType => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within LocalizationProvider');
  }
  return context;
};

/**
 * Hook to access translation function
 */
export const useTranslation = () => {
  const { t } = useLocalization();
  return { t };
};
