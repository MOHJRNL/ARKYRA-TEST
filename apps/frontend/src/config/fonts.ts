/**
 * Font Configuration for Arkyra
 *
 * Configures:
 * - Al Jazeera Arabic Bold font for Arabic text
 * - Plus Jakarta Sans for Latin text
 */

import localFont from 'next/font/local';
import { Plus_Jakarta_Sans } from 'next/font/google';

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
export const jakartaSans = Plus_Jakarta_Sans({
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-jakarta-sans',
  display: 'swap',
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
