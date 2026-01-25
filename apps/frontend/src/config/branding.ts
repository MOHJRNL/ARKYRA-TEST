/**
 * ARKYRA Branding Configuration
 * 
 * This file defines the branding for both:
 * - AJ ARKYRA: Internal enterprise platform for Al Jazeera
 * - ARKYRA: SaaS product (arkyra.pro)
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
    name: 'AJ ARKYRA',
    displayName: 'AJ ARKYRA',
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
    supportedLanguages: ['ar', 'en', 'fr', 'es', 'de'],
    defaultLanguage: 'ar',
    rtlLanguages: ['ar'],
  },
  'arkyra-saas': {
    name: 'ARKYRA',
    displayName: 'ARKYRA Pulse',
    description: 'Enterprise Social Media Management Platform',
    website: 'https://arkyra.pro',
    logo: {
      light: '/logos/arkyra-pulse-light.png',
      dark: '/logos/arkyra-pulse-light.png',
    },
    colors: {
      primary: '#001969', // Primary Blue
      secondary: '#FFBE00', // Gold
      accent: '#E74C3C', // Red
      gold: '#FFBE00',
    },
    fonts: {
      primary: 'Al-Jazeera-Arabic-Bold',
      secondary: 'Inter, system-ui, sans-serif',
    },
    supportedLanguages: ['ar', 'en', 'fr', 'es', 'de'],
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
 * Check if current brand is AJ ARKYRA (internal)
 */
export function isAJArkyra(): boolean {
  return getCurrentBrand() === 'aj-arkyra';
}

/**
 * Check if current brand is ARKYRA SaaS
 */
export function isArkyraSaaS(): boolean {
  return getCurrentBrand() === 'arkyra-saas';
}
