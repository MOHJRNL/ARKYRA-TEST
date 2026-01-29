/**
 * Font Utilities Hook
 *
 * Provides utilities to get the correct font based on:
 * - Current language
 * - Brand configuration
 * - RTL/LTR direction
 */

import { useCallback, useMemo } from 'react';
import i18next from 'i18next';
import { getBrandingConfig, isAJArkyra } from '@gitroom/frontend/config/branding';

export function useFont() {
  const currentLanguage = i18next.resolvedLanguage || 'en';
  const brandConfig = getBrandingConfig();
  const isArabic = currentLanguage === 'ar';

  /**
   * Get the primary font family based on current language
   */
  const getFontFamily = useCallback((): string => {
    if (isArabic) {
      return 'var(--font-al-jazeera-arabic), sans-serif';
    }
    return 'var(--font-jakarta-sans), sans-serif';
  }, [isArabic]);

  /**
   * Get Tailwind font class based on current language
   */
  const getFontClass = useCallback((): string => {
    if (isArabic) {
      return 'font-al-jazeera-arabic';
    }
    return 'font-jakarta-sans';
  }, [isArabic]);

  /**
   * Get font style object for inline styles
   */
  const getFontStyle = useCallback((): React.CSSProperties => {
    return {
      fontFamily: getFontFamily(),
    };
  }, [getFontFamily]);

  /**
   * Check if current language uses Arabic font
   */
  const usesArabicFont = useMemo(() => isArabic, [isArabic]);

  /**
   * Check if current language is RTL
   */
  const isRTL = useMemo(() => isArabic, [isArabic]);

  /**
   * Get font family from brand config
   */
  const brandPrimaryFont = useMemo(() => brandConfig.fonts.primary, [brandConfig]);
  const brandSecondaryFont = useMemo(() => brandConfig.fonts.secondary, [brandConfig]);

  return {
    getFontFamily,
    getFontClass,
    getFontStyle,
    usesArabicFont,
    isRTL,
    currentLanguage,
    brandPrimaryFont,
    brandSecondaryFont,
  };
}

/**
 * Get font class name for server components
 */
export function getFontClassName(language: string): string {
  const isArabic = language === 'ar';
  if (isArabic) {
    return 'font-al-jazeera-arabic';
  }
  return 'font-jakarta-sans';
}

/**
 * Get font style for server components
 */
export function getFontStyle(language: string): React.CSSProperties {
  const isArabic = language === 'ar';
  return {
    fontFamily: isArabic
      ? 'var(--font-al-jazeera-arabic), sans-serif'
      : 'var(--font-jakarta-sans), sans-serif',
  };
}
