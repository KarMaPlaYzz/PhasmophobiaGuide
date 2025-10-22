/**
 * Utility Labels & Enums Localization
 * Difficulty, rarity, status labels and common UI enums
 */

import { SupportedLanguage } from './types';

// Difficulty levels
export const difficultyLabels: Record<string, Record<SupportedLanguage, string>> = {
  beginner: {
    en: 'Beginner',
    de: 'Anfänger',
    nl: 'Beginner',
    fr: 'Débutant',
    es: 'Principiante',
    it: 'Principiante',
    pt: 'Iniciante',
    sv: 'Nybörjare',
  },
  intermediate: {
    en: 'Intermediate',
    de: 'Fortgeschrittene',
    nl: 'Gevorderd',
    fr: 'Intermédiaire',
    es: 'Intermedio',
    it: 'Intermedio',
    pt: 'Intermediário',
    sv: 'Mellanhand',
  },
  advanced: {
    en: 'Advanced',
    de: 'Erweitert',
    nl: 'Geavanceerd',
    fr: 'Avancé',
    es: 'Avanzado',
    it: 'Avanzato',
    pt: 'Avançado',
    sv: 'Avancerad',
  },
  expert: {
    en: 'Expert',
    de: 'Experte',
    nl: 'Expert',
    fr: 'Expert',
    es: 'Experto',
    it: 'Esperto',
    pt: 'Especialista',
    sv: 'Expert',
  },
};

// Rarity labels
export const rarityLabels: Record<string, Record<SupportedLanguage, string>> = {
  common: {
    en: 'Common',
    de: 'Gewöhnlich',
    nl: 'Gemeenschappelijk',
    fr: 'Commun',
    es: 'Común',
    it: 'Comune',
    pt: 'Comum',
    sv: 'Vanligt',
  },
  uncommon: {
    en: 'Uncommon',
    de: 'Ungewöhnlich',
    nl: 'Ongewoon',
    fr: 'Rare',
    es: 'Poco Común',
    it: 'Non Comune',
    pt: 'Incomum',
    sv: 'Ovanligt',
  },
  rare: {
    en: 'Rare',
    de: 'Selten',
    nl: 'Zeldzaam',
    fr: 'Très Rare',
    es: 'Raro',
    it: 'Raro',
    pt: 'Raro',
    sv: 'Sällsynt',
  },
  very_rare: {
    en: 'Very Rare',
    de: 'Sehr Selten',
    nl: 'Zeer Zeldzaam',
    fr: 'Extrêmement Rare',
    es: 'Muy Raro',
    it: 'Molto Raro',
    pt: 'Muito Raro',
    sv: 'Mycket sällsynt',
  },
};

// Status labels
export const statusLabels: Record<string, Record<SupportedLanguage, string>> = {
  hunting: {
    en: 'Hunting',
    de: 'Jagd',
    nl: 'Jagen',
    fr: 'Chasse',
    es: 'Cazando',
    it: 'Caccia',
    pt: 'Caçando',
    sv: 'Jakt',
  },
  active: {
    en: 'Active',
    de: 'Aktiv',
    nl: 'Actief',
    fr: 'Actif',
    es: 'Activo',
    it: 'Attivo',
    pt: 'Ativo',
    sv: 'Aktiv',
  },
  dormant: {
    en: 'Dormant',
    de: 'Ruheend',
    nl: 'Rusterend',
    fr: 'Dormant',
    es: 'Dormido',
    it: 'Inattivo',
    pt: 'Inativo',
    sv: 'Vilande',
  },
  dead: {
    en: 'Eliminated',
    de: 'Beseitigt',
    nl: 'Uitgeschakeld',
    fr: 'Éliminé',
    es: 'Eliminado',
    it: 'Eliminato',
    pt: 'Eliminado',
    sv: 'Eliminerad',
  },
};

// Movement speed labels
export const speedLabels: Record<string, Record<SupportedLanguage, string>> = {
  slow: {
    en: 'Slow',
    de: 'Langsam',
    nl: 'Traag',
    fr: 'Lent',
    es: 'Lento',
    it: 'Lento',
    pt: 'Lento',
    sv: 'Långsam',
  },
  normal: {
    en: 'Normal',
    de: 'Normal',
    nl: 'Normaal',
    fr: 'Normal',
    es: 'Normal',
    it: 'Normale',
    pt: 'Normal',
    sv: 'Normal',
  },
  fast: {
    en: 'Fast',
    de: 'Schnell',
    nl: 'Snel',
    fr: 'Rapide',
    es: 'Rápido',
    it: 'Veloce',
    pt: 'Rápido',
    sv: 'Snabb',
  },
  variable: {
    en: 'Variable',
    de: 'Variabel',
    nl: 'Variabel',
    fr: 'Variable',
    es: 'Variable',
    it: 'Variabile',
    pt: 'Variável',
    sv: 'Variabel',
  },
};

// Activity level labels
export const activityLabels: Record<string, Record<SupportedLanguage, string>> = {
  low: {
    en: 'Low',
    de: 'Niedrig',
    nl: 'Laag',
    fr: 'Basse',
    es: 'Baja',
    it: 'Bassa',
    pt: 'Baixa',
    sv: 'Låg',
  },
  medium: {
    en: 'Medium',
    de: 'Mittel',
    nl: 'Gemiddeld',
    fr: 'Moyenne',
    es: 'Media',
    it: 'Media',
    pt: 'Média',
    sv: 'Medel',
  },
  high: {
    en: 'High',
    de: 'Hoch',
    nl: 'Hoog',
    fr: 'Élevée',
    es: 'Alta',
    it: 'Alta',
    pt: 'Alta',
    sv: 'Hög',
  },
  very_high: {
    en: 'Very High',
    de: 'Sehr Hoch',
    nl: 'Zeer Hoog',
    fr: 'Très Élevée',
    es: 'Muy Alta',
    it: 'Molto Alta',
    pt: 'Muito Alta',
    sv: 'Mycket Hög',
  },
};

/**
 * Helper functions
 */
export const getDifficultyLabel = (difficulty: string, language: SupportedLanguage): string => {
  const difficultyLower = difficulty.toLowerCase();
  return difficultyLabels[difficultyLower]?.[language] ?? difficultyLabels[difficultyLower]?.en ?? difficulty;
};

export const getRarityLabel = (rarity: string, language: SupportedLanguage): string => {
  const rarityLower = rarity.toLowerCase();
  return rarityLabels[rarityLower]?.[language] ?? rarityLabels[rarityLower]?.en ?? rarity;
};

export const getStatusLabel = (status: string, language: SupportedLanguage): string => {
  const statusLower = status.toLowerCase();
  return statusLabels[statusLower]?.[language] ?? statusLabels[statusLower]?.en ?? status;
};

export const getSpeedLabel = (speed: string, language: SupportedLanguage): string => {
  const speedLower = speed.toLowerCase();
  return speedLabels[speedLower]?.[language] ?? speedLabels[speedLower]?.en ?? speed;
};

export const getActivityLabel = (activity: string, language: SupportedLanguage): string => {
  const activityLower = activity.toLowerCase();
  return activityLabels[activityLower]?.[language] ?? activityLabels[activityLower]?.en ?? activity;
};
