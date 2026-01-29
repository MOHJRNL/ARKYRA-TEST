/**
 * Arkyra Branding Configuration
 *
 * This file defines the branding for both:
 * - AJ Arkyra: Internal enterprise platform for Al Jazeera
 * - Arkyra: SaaS product (arkyra.pro)
 */

export type BrandType = 'aj-arkyra' | 'arkyra-saas';

export interface BrandingConfig {
  name: string;
  displayName: string;
  description: string;
  website: string;
  logo: {
    light: string;
    dark: string;
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    gold: string;
  };
  fonts: {
    primary: string;
    secondary: string;
  };
  supportedLanguages: string[];
  defaultLanguage: string;
  rtlLanguages: string[];
}

export const BRANDING_CONFIG: Record<BrandType, BrandingConfig> = {
  'aj-arkyra': {
    name: 'AJ Arkyra',
    displayName: 'AJ Arkyra',
    description: 'Al Jazeera Enterprise Social Media Management Platform',
    website: 'https://internal.aljazeera.com/arkyra',
    logo: {
      light: '/logos/aj-arkyra-light.svg',
      dark: '/logos/aj-arkyra-light.svg',
    },
    colors: {
      primary: '#001969', // Al Jazeera Blue
      secondary: '#FFBE00', // Al Jazeera Gold
      accent: '#E74C3C', // Red for accents
      gold: '#FFBE00',
    },
    fonts: {
      primary: 'Al-Jazeera-Arabic-Bold',
      secondary: 'Inter, system-ui, sans-serif',
    },
    supportedLanguages: ['ar', 'en', 'fr', 'es', 'de', 'tr'],
    defaultLanguage: 'ar',
    rtlLanguages: ['ar'],
  },
  'arkyra-saas': {
    name: 'Arkyra',
    displayName: 'Arkyra Digital Command Center',
    description: 'Power. Precision. Scale.',
    website: 'https://arkyra.pro',
    logo: {
      light: '/logos/arkyra-logo-transparent.png',
      dark: '/logos/arkyra-logo-transparent.png',
    },
    colors: {
      primary: '#001969', // Al Jazeera Blue
      secondary: '#F8AB0C', // Al Jazeera Gold
      accent: '#048FCC', // Al Jazeera Light Blue
      gold: '#F8AB0C', // Al Jazeera Gold
    },
    fonts: {
      primary: 'Plus Jakarta Sans, Inter, system-ui, sans-serif',
      secondary: 'Inter, system-ui, sans-serif',
    },
    supportedLanguages: ['en', 'ar', 'fr', 'es', 'de', 'tr'],
    defaultLanguage: 'en',
    rtlLanguages: ['ar'],
  },
};

/**
 * Get branding configuration based on environment or brand type
 */
export function getBrandingConfig(brandType?: BrandType): BrandingConfig {
  const brand = brandType || (process.env.NEXT_PUBLIC_BRAND_TYPE as BrandType) || 'arkyra-saas';
  return BRANDING_CONFIG[brand];
}

/**
 * Get the current brand type
 */
export function getCurrentBrand(): BrandType {
  return (process.env.NEXT_PUBLIC_BRAND_TYPE as BrandType) || 'arkyra-saas';
}

/**
 * Check if current brand is AJ Arkyra (internal)
 */
export function isAJArkyra(): boolean {
  return getCurrentBrand() === 'aj-arkyra';
}

/**
 * Check if current brand is Arkyra SaaS
 */
export function isArkyraSaaS(): boolean {
  return getCurrentBrand() === 'arkyra-saas';
}

/**
 * Get the brand name for use in page titles and metadata
 */
export function getBrandName(): string {
  return getBrandingConfig().name;
}

/**
 * Get the brand display name
 */
export function getBrandDisplayName(): string {
  return getBrandingConfig().displayName;
}
