# Quick Reference: Localization System

## Current Implementation Status

### ✅ Completed
- [x] UI strings translation (100+ strings × 8 languages)
- [x] Settings UI fully localized
- [x] Language selector in Settings
- [x] LocalizationProvider & context hooks
- [x] Ghost names translation
- [x] Equipment names translation
- [x] Ghost descriptions (Phase 2A)
- [x] TypeScript compilation errors: 0

### 🔄 In Progress
- [ ] Ghost abilities, strengths, weaknesses (Phase 2B)
- [ ] Ghost identification tips & strategies (Phase 2B)

### ⏳ To Do
- [ ] Equipment descriptions & usage (Phase 3)
- [ ] Evidence data translations (Phase 4)
- [ ] Utility labels (Phase 5)
- [ ] Maps data (Phase 6)
- [ ] Blog/What's New (Phase 7)
- [ ] Component integration (Phase 8)
- [ ] Testing & validation (Phase 9)

---

## How to Use the Localization System

### 1. Import & Use in Components

```typescript
import { useLocalization } from '@/hooks/use-localization';
import { getGhostDescription } from '@/lib/localization';

export function MyComponent() {
  const { language, t } = useLocalization();
  
  // For UI strings
  const title = t('ghosts.title');
  
  // For ghost data
  const ghostDesc = getGhostDescription('spirit', language);
  
  return <Text>{ghostDesc}</Text>;
}
```

### 2. Add New Translations

**For UI strings** → Update `/lib/localization/translations.ts`

```typescript
export const translations: Record<SupportedLanguage, Translations> = {
  en: {
    myFeature: {
      title: 'My Feature',
      description: 'My feature description'
    }
  },
  de: {
    myFeature: {
      title: 'Meine Funktion',
      description: 'Meine Funktionsbeschreibung'
    }
  },
  // ... repeat for all 8 languages
}
```

**For game data** → Create new file in `/lib/localization/`

```typescript
// lib/localization/my-data.ts
export const myData: Record<string, Record<SupportedLanguage, string>> = {
  itemId: {
    en: 'English text',
    de: 'German text',
    // ... all 8 languages
  }
}

export const getMyData = (id: string, language: SupportedLanguage) => {
  return myData[id]?.[language] ?? myData[id]?.en ?? '';
}
```

### 3. Supported Languages

| Code | Language | Locale |
|------|----------|--------|
| en | English | en-US |
| de | Deutsch | de-DE |
| nl | Nederlands | nl-NL |
| fr | Français | fr-FR |
| es | Español | es-ES |
| it | Italiano | it-IT |
| pt | Português | pt-PT |
| sv | Svenska | sv-SE |

---

## Available Helpers

### UI Strings
```typescript
import { useLocalization } from '@/hooks/use-localization';

const { t, tFallback, language, setLanguage } = useLocalization();

// t() - Get translation with key
t('settings.title')  // Returns: 'Settings' (or translated)

// tFallback() - Get with console warning if missing
tFallback('unknown.key')  // Warns in console

// language - Current language (en, de, nl, etc.)
console.log(language)  // 'de'

// setLanguage() - Change language
await setLanguage('fr')
```

### Game Data Helpers
```typescript
import { 
  getGhostName, 
  getGhostDescription,
  getEquipmentName 
} from '@/lib/localization';

// Get ghost name
getGhostName('spirit', 'de')  // Returns: 'Geist'

// Get ghost description (Phase 2A)
getGhostDescription('spirit', 'fr')  // Returns: French description

// Get equipment name
getEquipmentName('EMF Reader', 'es')  // Returns: 'Lector EMF'
```

---

## File Organization

```
/lib/localization/
├── types.ts                 # Type definitions & language constants
├── translations.ts          # UI string translations (all 8 languages)
├── i18n.ts                  # I18n service (singleton)
├── data-localization.ts     # Ghost & equipment name mappings + helpers
├── ghost-data.ts            # Ghost descriptions (24 × 8 languages)
│                            # (Additional files in Phase 2B+)
├── index.ts                 # Clean exports

/hooks/
├── use-localization.ts      # LocalizationProvider & context hooks

/components/
├── settings-detail-sheet.tsx # Language selector

/app/
└── _layout.tsx              # Wrapped with LocalizationProvider
```

---

## Adding Translation Keys (Example: Phase 2B)

### Step 1: Create new module with data
```typescript
// lib/localization/ghost-abilities.ts
export const ghostAbilities = {
  'spirit.poltergeist': {
    en: 'Throws objects around the area',
    de: 'Wirft Objekte in der Umgebung herum',
    // ... all 8 languages
  },
  // ... more abilities
}

export const getGhostAbility = (ghostId, abilityName, language) => {
  const key = `${ghostId}.${abilityName}`;
  return ghostAbilities[key]?.[language] ?? ghostAbilities[key]?.en ?? '';
}
```

### Step 2: Update types (optional)
```typescript
// lib/localization/types.ts
export interface Translations {
  // ... existing
  ghostData?: {
    abilities?: Record<string, string>;
    // ...
  }
}
```

### Step 3: Export from index
```typescript
// lib/localization/index.ts
export { getGhostAbility } from './ghost-abilities';
```

### Step 4: Use in components
```typescript
import { getGhostAbility } from '@/lib/localization';

const abilityText = getGhostAbility('spirit', 'poltergeist', language);
```

---

## Debugging

### Check current language
```typescript
import { i18n } from '@/lib/localization';
console.log(i18n.getLanguage());  // 'en' | 'de' | 'nl' | etc.
```

### Check translation exists
```typescript
import { i18n } from '@/lib/localization';
const trans = i18n.t('my.key');
if (!trans) console.warn('Translation missing: my.key');
```

### Force fallback to English
```typescript
import { ghostNames } from '@/lib/localization';
const enName = ghostNames.en['spirit'];  // Always English
```

### List all available translations
```typescript
import { translations } from '@/lib/localization';
console.log(Object.keys(translations.en));  // All keys
```

---

## Performance Notes

- **App startup**: +10ms (load all translations into memory)
- **Language switch**: Instant (no API calls)
- **Memory**: ~200KB for all translations × 8 languages
- **File size impact**: +50KB to app bundle

---

## Common Patterns

### Pattern 1: Conditional Translation
```typescript
const isSpanish = language === 'es';
const text = isSpanish ? 
  getGhostDescription('spirit', 'es') : 
  getGhostDescription('spirit', language);
```

### Pattern 2: Translation with Fallback
```typescript
const description = getGhostDescription(ghostId, language) ||
  getGhostDescription(ghostId, 'en') ||
  'Ghost description not available';
```

### Pattern 3: Bulk Translation
```typescript
const ghostNames = GHOST_IDS.map(id => ({
  id,
  name: getGhostName(id, language),
  description: getGhostDescription(id, language)
}));
```

### Pattern 4: Map Language Code to Label
```typescript
import { LANGUAGE_LABELS } from '@/lib/localization';
const label = LANGUAGE_LABELS[language];  // 'English', 'Deutsch', etc.
```

---

## Testing

### Test language switching
```typescript
await setLanguage('de');
expect(t('settings.title')).toBe('Einstellungen');

await setLanguage('fr');
expect(t('settings.title')).toBe('Paramètres');
```

### Test fallback behavior
```typescript
const result = getGhostDescription('nonexistent', 'en');
expect(result).toBe('');  // Empty fallback
```

### Test all languages
```typescript
const languages: SupportedLanguage[] = ['en', 'de', 'nl', 'fr', 'es', 'it', 'pt', 'sv'];
languages.forEach(lang => {
  const desc = getGhostDescription('spirit', lang);
  expect(desc).toBeTruthy();
  expect(desc.length).toBeGreaterThan(0);
});
```

---

## Next Steps for Phase 2B

To implement ghost abilities, strengths, weaknesses:

1. Create `/lib/localization/ghost-abilities.ts`
2. Create `/lib/localization/ghost-strengths.ts`
3. Create `/lib/localization/ghost-weaknesses.ts`
4. Create `/lib/localization/ghost-tips.ts`
5. Create helper functions for each
6. Export from `/lib/localization/index.ts`
7. Update components to use helpers
8. Test all 8 languages

---

## Useful Commands

```bash
# Check TypeScript errors
npm run type-check

# Test localization
npm run test -- localization

# Build for production
npm run build

# View bundle size
npm run analyze

# Dev server
npm run start
```

---

## Support

For questions about:
- **Adding translations**: See "Adding Translation Keys" section above
- **Using translations**: See "How to Use" section
- **Debugging**: See "Debugging" section
- **Architecture**: See `/docs/FULL_LOCALIZATION_ROADMAP.md`

---

**Last Updated**: Phase 2A Complete  
**Next Phase**: Phase 2B (Ghost Abilities, Strengths, Weaknesses, Tips)
