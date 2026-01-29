/**
 * Arkyra Tailwind CSS Configuration
 *
 * This configuration extends the base Tailwind setup with:
 * - Al Jazeera brand colors
 * - RTL support for Arabic
 * - Dark mode support
 * - Custom color palette
 */

const { join } = require('path');

module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx,html}', '../../libraries/**/*.{ts,tsx,html}'],
  theme: {
    extend: {
      colors: {
        // Al Jazeera Brand Colors
        'aj-blue': {
          50: '#f0f4f9',
          100: '#e1e9f3',
          200: '#c3d3e7',
          300: '#a5bddb',
          400: '#5885c3',
          500: '#001969', // Primary Al Jazeera Blue
          600: '#00155e',
          700: '#001149',
          800: '#000d34',
          900: '#00091f',
        },
        'aj-gold': {
          50: '#fffbf0',
          100: '#fff7e1',
          200: '#ffefc3',
          300: '#ffe7a5',
          400: '#ffdf67',
          500: '#FFBE00', // Primary Al Jazeera Gold
          600: '#e6ab00',
          700: '#cc9800',
          800: '#b38500',
          900: '#997200',
        },
        // Primary Colors (mapped to Al Jazeera)
        primary: 'var(--color-primary, #001969)',
        secondary: 'var(--color-secondary, #FFBE00)',
        accent: 'var(--color-accent, #E74C3C)',
        
        // Semantic Colors
        success: '#27AE60',
        warning: '#F39C12',
        error: '#E74C3C',
        info: '#3498DB',
        
        // Text Colors
        textColor: 'var(--new-btn-text)',
        
        // UI Colors
        third: 'var(--color-third)',
        forth: 'var(--color-forth)',
        fifth: 'var(--color-fifth)',
        sixth: 'var(--color-sixth)',
        seventh: 'var(--color-seventh)',
        gray: 'var(--color-gray)',
        input: 'var(--color-input)',
        inputText: 'var(--color-input-text)',
        tableBorder: 'var(--color-table-border)',
        
        // Custom Colors (for flexibility)
        customColor1: 'var(--color-custom1)',
        customColor2: 'var(--color-custom2)',
        customColor3: 'var(--color-custom3)',
        customColor4: 'var(--color-custom4)',
        customColor5: 'var(--color-custom5)',
      },
      fontFamily: {
        // Al Jazeera Arabic Bold as primary
        'aj-arabic': ['Al-Jazeera-Arabic-Bold', 'system-ui', 'sans-serif'],
        // Fallback to Inter for Latin scripts
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        // Add custom spacing if needed
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'aj-sm': '0 1px 2px 0 rgba(0, 25, 105, 0.05)',
        'aj-md': '0 4px 6px -1px rgba(0, 25, 105, 0.1)',
        'aj-lg': '0 10px 15px -3px rgba(0, 25, 105, 0.1)',
      },
    },
  },
  plugins: [
    // RTL Support Plugin
    require('tailwindcss-rtl'),
    // Dark Mode Plugin (already built-in via darkMode: 'class')
  ],
  // RTL Configuration
  corePlugins: {
    direction: true,
  },
};
