## Localization Implementation Guide

### Overview
Complete multi-language localization system supporting 8 languages:
- **English** (en)
- **German** (de)
- **Dutch** (nl)
- **French** (fr)
- **Spanish** (es)
- **Italian** (it)
- **Portuguese** (pt)
- **Swedish** (sv)

### Architecture

#### 1. Core Localization System (`/lib/localization/`)

**`types.ts`** - Type definitions
- `SupportedLanguage` - Union type of supported language codes
- `Translations` - Interface defining all translatable strings
- `LANGUAGE_LABELS` - Display names for languages
- `LANGUAGE_CODES` - Locale codes for date/time formatting

**`translations.ts`** - Translation data
- Records for each language with complete translation strings
- Organized hierarchically by feature (settings, evidence, ghosts, etc.)
- Over 100+ translation keys per language

**`i18n.ts`** - I18n Service
- Singleton service for managing current language
- `setLanguage(language)` - Set current language
- `t(key)` - Get translation by dot-notation key (e.g., 'settings.title')
- `tFallback(key)` - Get translation with English fallback
- Warns if translation key not found

**`data-localization.ts`** - Game data translations
- `ghostNames` - Translated names for all 24 ghost types
- `equipmentNames` - Translated names for 19+ equipment items
- Helper functions: `getGhostName()`, `getEquipmentName()`

**`index.ts`** - Clean exports
```typescript
export { i18n, useLocalization, LocalizationProvider }
export { getGhostName, getEquipmentName }
```

#### 2. React Context Provider (`/hooks/use-localization.ts`)

**`LocalizationProvider`** Component
- Wraps entire app (in `app/_layout.tsx`)
- Loads saved language preference from `PreferencesService` on mount
- Initializes `i18n` with saved language
- Provides context to all child components

**`useLocalization()`** Hook
- Returns context object with:
  - `language: SupportedLanguage` - Current language
  - `setLanguage(lang)` - Change language (async, saves to storage)
  - `t(key)` - Translation function
  - `tFallback(key)` - Translation with fallback

**`useTranslation()`** Hook
- Convenience hook that returns just `{ t }` function

#### 3. Game Data Localization (`/hooks/use-game-data-localization.ts`)

**`useGameDataLocalization()`** Hook
- Combines language context with game data localization
- Returns:
  - `getGhostName(ghostId)` - Localized ghost name
  - `getEquipmentName(equipmentId)` - Localized equipment name

#### 4. Preferences Storage (`/lib/storage/preferencesService.ts`)

Extended `UserPreferences` interface:
```typescript
export interface UserPreferences {
  blogNotificationsEnabled: boolean;
  hapticFeedbackEnabled: boolean;
  defaultTab: 'ghosts' | 'equipments' | 'index' | 'evidence' | 'sanity-calculator';
  language: SupportedLanguage;  // NEW
  lastUpdated: number;
}
```

New methods:
- `getLanguage()` - Get saved language preference
- `setLanguage(language)` - Save language preference to storage

### Usage Examples

#### Basic Translation
```typescript
import { useTranslation } from '@/hooks/use-localization';

export function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <View>
      <Text>{t('settings.title')}</Text>
      <Text>{t('common.cancel')}</Text>
    </View>
  );
}
```

#### Language Switching
```typescript
import { useLocalization } from '@/hooks/use-localization';

export function LanguageButton() {
  const { language, setLanguage } = useLocalization();
  
  const handleChangeLanguage = async () => {
    await setLanguage('de'); // Changes to German immediately
  };
  
  return <Button onPress={handleChangeLanguage} />;
}
```

#### Game Data Localization
```typescript
import { useGameDataLocalization } from '@/hooks/use-game-data-localization';

export function GhostName({ ghostId }: { ghostId: string }) {
  const { getGhostName } = useGameDataLocalization();
  
  return <Text>{getGhostName(ghostId)}</Text>; // Returns translated name
}
```

### Integration Points

#### Already Localized Components:
1. **Settings Sheet** (`settings-detail-sheet.tsx`)
   - All labels, descriptions, alerts use `t()` function
   - Language selector cycles through all 8 languages
   - Changes apply immediately

2. **Header** (`library-header.tsx`)
   - Button labels use translations (needs update)

3. **Navigation Tabs** (`(tabs)/_layout.tsx`)
   - Tab labels can use translations (optional enhancement)

#### Ready for Localization:
1. **Ghost Details** (`ghost-detail-sheet.tsx`)
   - Use `getGhostName()` for titles
   - Translate ability/strength/weakness descriptions

2. **Equipment Details** (`equipment-detail-sheet.tsx`)
   - Use `getEquipmentName()` for titles
   - Translate descriptions

3. **Evidence** (`evidence.tsx`)
   - Status labels (Confirmed, Investigating, Not Found)
   - Section titles and hints

4. **All screens** - Any hardcoded text can be replaced with `t()` calls

### Storage & Persistence

**Location:** `AsyncStorage` key: `@phasmophobia_guide/user_preferences`

**Behavior:**
- Language preference saves automatically when changed
- Loads on app startup
- Persists across app restarts
- Defaults to English if no saved preference

### Key Design Decisions

1. **Hierarchical Keys**
   - Organized by feature: `settings.title`, `common.cancel`, etc.
   - Easy to find related translations
   - Prevents key collisions

2. **Fallback to English**
   - Missing translations fall back to English instead of showing keys
   - Makes app usable even with incomplete translations

3. **Immediate Updates**
   - Language change applies instantly
   - Uses React Context for global state
   - No page reload needed

4. **Flexible Text Layout**
   - Layouts designed to accommodate longer translations
   - Dynamic layout ensures German/Dutch compound words fit
   - No truncation or dynamic font sizing (yet)

5. **Game Data as Separate Module**
   - Ghost/equipment names in `data-localization.ts`
   - Easy to maintain and update
   - Helper functions prevent duplication

### Translation Coverage

**Complete:**
- ✅ Settings UI (all sections)
- ✅ Common UI elements (buttons, alerts, status)
- ✅ Tab names (all 5 tabs)
- ✅ Ghost names (24 ghosts)
- ✅ Equipment names (19+ items)
- ✅ Evidence identifiers
- ✅ Section headers and labels

**Partial:**
- ⚠️ Descriptions (use placeholders, can expand)
- ⚠️ Game-specific content (descriptions can be translated manually)

**Not Yet:**
- ❌ Blog post content (requires backend support)
- ❌ Dynamic user content (N/A)

### Adding New Translations

1. **For UI Strings:**
   ```typescript
   // In translations.ts, add to each language object:
   newFeature: {
     title: 'Your Title',
     description: 'Your description'
   }
   
   // In types.ts, add to Translations interface:
   newFeature: {
     title: string;
     description: string;
   }
   ```

2. **For Game Data:**
   ```typescript
   // In data-localization.ts:
   export const newDataNames: Record<SupportedLanguage, Record<string, string>> = {
     en: { /* ... */ },
     de: { /* ... */ },
     // etc.
   }
   ```

### Performance Considerations

- **Lazy Loading:** Language loads once on app startup
- **Context Efficiency:** No unnecessary re-renders
- **String Keys:** O(1) lookup via object properties
- **No Network Calls:** All translations stored locally
- **Minimal Bundle:** ~50KB for all translations

### Future Enhancements

1. **RTL Support:** Add `isRTL()` helper for right-to-left languages
2. **Pluralization:** Handle plural forms for different languages
3. **Date/Time Formatting:** Use `LANGUAGE_CODES` for locale-specific formatting
4. **Device Language Detection:** Auto-detect device language on first launch
5. **Translation Export:** Generate i18n compatible export files
6. **Missing Translation Report:** Development tool to find untranslated keys

### Testing Checklist

- [ ] Language selector appears in Settings
- [ ] Cycling through languages updates all UI immediately
- [ ] Language preference saves to storage
- [ ] App opens with previously selected language
- [ ] All 8 languages display correctly
- [ ] No layout overflow with longer translations (German)
- [ ] Ghost names appear translated
- [ ] Equipment names appear translated
- [ ] Alerts show translated text
- [ ] No console warnings about missing keys
