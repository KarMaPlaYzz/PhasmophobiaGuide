import { translations } from './translations';
import { SupportedLanguage } from './types';

class I18nService {
  private currentLanguage: SupportedLanguage = 'en';

  constructor() {
    this.currentLanguage = 'en';
  }

  setLanguage(language: SupportedLanguage) {
    this.currentLanguage = language;
  }

  getLanguage(): SupportedLanguage {
    return this.currentLanguage;
  }

  t(key: string): string {
    const keys = key.split('.');
    let value: any = translations[this.currentLanguage];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }

    return typeof value === 'string' ? value : key;
  }

  /**
   * Get translation with fallback to English if not found
   */
  tFallback(key: string): string {
    const keys = key.split('.');
    let value: any = translations[this.currentLanguage];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English
        value = translations.en;
        for (const k2 of keys) {
          if (value && typeof value === 'object' && k2 in value) {
            value = value[k2];
          } else {
            console.warn(`Translation key not found: ${key}`);
            return key;
          }
        }
        return typeof value === 'string' ? value : key;
      }
    }

    return typeof value === 'string' ? value : key;
  }

  /**
   * Get all supported languages
   */
  getSupportedLanguages(): SupportedLanguage[] {
    return ['en', 'de', 'nl', 'fr', 'es', 'it', 'pt', 'sv'];
  }

  /**
   * Get device language code and map to supported language
   */
  getDeviceLanguage(): SupportedLanguage {
    // This would typically use Platform.locale or similar
    // For now, default to English
    // You can enhance this with react-native-localize if needed
    return 'en';
  }
}

export const i18n = new I18nService();
