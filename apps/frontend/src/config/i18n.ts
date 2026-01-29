/**
 * Arkyra i18n (Internationalization) Configuration
 *
 * Supports 5 languages:
 * - Arabic (ar) - RTL, default for AJ Arkyra
 * - English (en) - LTR, default for Arkyra SaaS
 * - French (fr) - LTR
 * - Spanish (es) - LTR
 * - German (de) - LTR
 */

export type SupportedLanguage = 'ar' | 'en' | 'fr' | 'es' | 'de';

export interface LanguageConfig {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  locale: string;
}

export const SUPPORTED_LANGUAGES: Record<SupportedLanguage, LanguageConfig> = {
  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    direction: 'rtl',
    locale: 'ar-AE',
  },
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    direction: 'ltr',
    locale: 'en-US',
  },
  fr: {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    direction: 'ltr',
    locale: 'fr-FR',
  },
  es: {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    direction: 'ltr',
    locale: 'es-ES',
  },
  de: {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    direction: 'ltr',
    locale: 'de-DE',
  },
};

/**
 * Get language configuration by code
 */
export function getLanguageConfig(code: string): LanguageConfig | null {
  return SUPPORTED_LANGUAGES[code as SupportedLanguage] || null;
}

/**
 * Get all supported languages
 */
export function getAllLanguages(): LanguageConfig[] {
  return Object.values(SUPPORTED_LANGUAGES);
}

/**
 * Check if a language is supported
 */
export function isLanguageSupported(code: string): boolean {
  return code in SUPPORTED_LANGUAGES;
}

/**
 * Get default language based on brand
 */
export function getDefaultLanguage(brandType: 'aj-arkyra' | 'arkyra-saas'): SupportedLanguage {
  return brandType === 'aj-arkyra' ? 'ar' : 'en';
}

/**
 * Get language from browser preference
 */
export function getBrowserLanguage(): SupportedLanguage {
  if (typeof navigator === 'undefined') return 'en';
  
  const browserLang = navigator.language.split('-')[0];
  
  if (isLanguageSupported(browserLang)) {
    return browserLang as SupportedLanguage;
  }
  
  return 'en';
}

/**
 * Get stored language from localStorage
 */
export function getStoredLanguage(): SupportedLanguage | null {
  if (typeof localStorage === 'undefined') return null;
  
  const stored = localStorage.getItem('language');
  if (stored && isLanguageSupported(stored)) {
    return stored as SupportedLanguage;
  }
  
  return null;
}

/**
 * Save language to localStorage
 */
export function saveLanguage(language: SupportedLanguage): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem('language', language);
}

/**
 * Determine language priority:
 * 1. Stored preference
 * 2. Browser preference
 * 3. Default for brand
 */
export function determineLanguage(
  brandType: 'aj-arkyra' | 'arkyra-saas'
): SupportedLanguage {
  const stored = getStoredLanguage();
  if (stored) return stored;
  
  const browser = getBrowserLanguage();
  if (isLanguageSupported(browser)) return browser as SupportedLanguage;
  
  return getDefaultLanguage(brandType);
}

/**
 * Translation key type for type safety
 */
export type TranslationKey = string;

/**
 * Translation namespace
 */
export interface Translations {
  [key: string]: string | Translations;
}

/**
 * Get nested translation value
 */
export function getTranslation(
  translations: Translations,
  key: TranslationKey,
  defaultValue: string = key
): string {
  const keys = key.split('.');
  let value: any = translations;
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return defaultValue;
    }
  }
  
  return typeof value === 'string' ? value : defaultValue;
}

/**
 * Format date based on language
 */
export function formatDateByLanguage(date: Date, language: SupportedLanguage): string {
  const config = SUPPORTED_LANGUAGES[language];
  return new Intl.DateTimeFormat(config.locale).format(date);
}

/**
 * Format number based on language
 */
export function formatNumberByLanguage(
  number: number,
  language: SupportedLanguage,
  options?: Intl.NumberFormatOptions
): string {
  const config = SUPPORTED_LANGUAGES[language];
  return new Intl.NumberFormat(config.locale, options).format(number);
}

/**
 * Format currency based on language
 */
export function formatCurrencyByLanguage(
  amount: number,
  language: SupportedLanguage,
  currency: string = 'USD'
): string {
  const config = SUPPORTED_LANGUAGES[language];
  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: currency,
  }).format(amount);
}
