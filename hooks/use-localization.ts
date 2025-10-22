import { i18n, SupportedLanguage } from '@/lib/localization';
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

  // Initialize with English - no dynamic language loading
  useEffect(() => {
    try {
      setIsLoading(true);
      i18n.setLanguage('en');
      setLanguageState('en');
    } catch (error) {
      console.error('Error initializing language:', error);
      i18n.setLanguage('en');
      setLanguageState('en');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSetLanguage = async (newLanguage: SupportedLanguage) => {
    // Language is locked to English, ignore any attempts to change it
    console.warn('Language selection is disabled. Language is locked to English.');
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
