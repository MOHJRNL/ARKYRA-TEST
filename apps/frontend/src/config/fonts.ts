/**
 * Font Configuration for Arkyra
 *
 * Configures:
 * - Al Jazeera Arabic Bold font for Arabic text
 * - Plus Jakarta Sans for Latin text
 */

import localFont from 'next/font/local';

/**
 * Al Jazeera Arabic Bold Font
 * Used for Arabic text across the platform
 */
export const alJazeeraArabic = localFont({
  src: '../../public/fonts/Al-Jazeera-Arabic-Bold.ttf',
  variable: '--font-al-jazeera-arabic',
  display: 'swap',
  weight: '400 700',
  fallback: ['Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
});

/**
 * Plus Jakarta Sans Font
 * Used for Latin text (English, French, Spanish, German, etc.)
 */
export const jakartaSans = localFont({
  src: [
    {
      path: '../../public/fonts/PlusJakartaSans-Variable.ttf',
      style: 'normal',
    },
    {
      path: '../../public/fonts/PlusJakartaSans-Italic-Variable.ttf',
      style: 'italic',
    },
  ],
  variable: '--font-jakarta-sans',
  display: 'swap',
  weight: '400 700',
  fallback: ['system-ui', 'sans-serif'],
});

/**
 * Get font class names based on language
 */
export function getFontClassName(language: string): string {
  const isArabic = language === 'ar';

  if (isArabic) {
    return `${alJazeeraArabic.variable} ${jakartaSans.variable}`;
  }

  return jakartaSans.variable;
}

/**
 * Get font family CSS based on language
 */
export function getFontFamily(language: string): string {
  const isArabic = language === 'ar';

  if (isArabic) {
    return 'var(--font-al-jazeera-arabic), sans-serif';
  }

  return 'var(--font-jakarta-sans), sans-serif';
}
