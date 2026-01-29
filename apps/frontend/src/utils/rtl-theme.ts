/**
 * RTL and Theme Utilities for Arkyra
 *
 * Handles:
 * - RTL (Right-to-Left) layout for Arabic
 * - Dark mode theme switching
 * - Language-specific styling
 */

export type ThemeMode = 'light' | 'dark' | 'system';
export type LayoutDirection = 'ltr' | 'rtl';

/**
 * RTL Languages that require right-to-left layout
 * Only Arabic is supported for Arkyra
 */
export const RTL_LANGUAGES = ['ar'];

/**
 * Get layout direction based on language code
 */
export function getLayoutDirection(languageCode: string): LayoutDirection {
  return RTL_LANGUAGES.includes(languageCode) ? 'rtl' : 'ltr';
}

/**
 * Check if a language is RTL
 */
export function isRTLLanguage(languageCode: string): boolean {
  return RTL_LANGUAGES.includes(languageCode);
}

/**
 * Apply RTL/LTR direction to document
 */
export function applyLayoutDirection(direction: LayoutDirection): void {
  if (typeof document === 'undefined') return;
  
  const htmlElement = document.documentElement;
  htmlElement.setAttribute('dir', direction);
  htmlElement.setAttribute('lang', direction === 'rtl' ? 'ar' : 'en');
  
  // Apply to body as well
  document.body.setAttribute('dir', direction);
}

/**
 * Apply theme mode (light/dark)
 */
export function applyThemeMode(mode: ThemeMode): void {
  if (typeof document === 'undefined') return;
  
  const htmlElement = document.documentElement;
  
  if (mode === 'system') {
    // Use system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    htmlElement.classList.toggle('dark', prefersDark);
  } else {
    htmlElement.classList.toggle('dark', mode === 'dark');
  }
}

/**
 * Get current theme mode from localStorage
 */
export function getStoredThemeMode(): ThemeMode | null {
  if (typeof localStorage === 'undefined') return null;
  return (localStorage.getItem('theme-mode') as ThemeMode) || null;
}

/**
 * Save theme mode to localStorage
 */
export function saveThemeMode(mode: ThemeMode): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem('theme-mode', mode);
}

/**
 * Get current layout direction from localStorage
 */
export function getStoredLayoutDirection(): LayoutDirection | null {
  if (typeof localStorage === 'undefined') return null;
  return (localStorage.getItem('layout-direction') as LayoutDirection) || null;
}

/**
 * Save layout direction to localStorage
 */
export function saveLayoutDirection(direction: LayoutDirection): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem('layout-direction', direction);
}

/**
 * Initialize RTL/Theme on app load
 */
export function initializeRTLAndTheme(language: string, theme: ThemeMode = 'system'): void {
  const direction = getLayoutDirection(language);
  applyLayoutDirection(direction);
  saveLayoutDirection(direction);
  
  applyThemeMode(theme);
  saveThemeMode(theme);
}

/**
 * Get CSS class for RTL/LTR
 */
export function getRTLClass(direction: LayoutDirection): string {
  return direction === 'rtl' ? 'rtl' : 'ltr';
}

/**
 * Get CSS style object for RTL/LTR margins/padding
 */
export function getRTLMargin(
  direction: LayoutDirection,
  top?: string,
  right?: string,
  bottom?: string,
  left?: string
): React.CSSProperties {
  if (direction === 'rtl') {
    return {
      marginTop: top,
      marginLeft: right,
      marginBottom: bottom,
      marginRight: left,
    };
  }
  return {
    marginTop: top,
    marginRight: right,
    marginBottom: bottom,
    marginLeft: left,
  };
}

/**
 * Get CSS style object for RTL/LTR padding
 */
export function getRTLPadding(
  direction: LayoutDirection,
  top?: string,
  right?: string,
  bottom?: string,
  left?: string
): React.CSSProperties {
  if (direction === 'rtl') {
    return {
      paddingTop: top,
      paddingLeft: right,
      paddingBottom: bottom,
      paddingRight: left,
    };
  }
  return {
    paddingTop: top,
    paddingRight: right,
    paddingBottom: bottom,
    paddingLeft: left,
  };
}
