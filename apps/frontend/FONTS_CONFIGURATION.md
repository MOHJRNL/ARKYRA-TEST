# Arkyra Font Configuration

## Overview

Arkyra uses a dynamic font system that automatically switches between different fonts based on:
- **Language Selection**: Arabic content uses Al Jazeera Arabic Bold, while other languages use Plus Jakarta Sans
- **Brand Configuration**: AJ Arkyra brand preferences are automatically applied
- **RTL Support**: Proper Right-to-Left layout for Arabic text

## Font Files

### Al Jazeera Arabic Bold
- **Location**: `/apps/frontend/public/fonts/Al-Jazeera-Arabic-Bold.ttf`
- **Usage**: Arabic text (ar language)
- **Weight**: 400 (normal) and 700 (bold)
- **Source**: Al Jazeera official branding package

### Plus Jakarta Sans
- **Source**: Google Fonts (next/font/google)
- **Usage**: English, French, Spanish, German, and other Latin-based languages
- **Weights**: 400, 500, 600, 700
- **Styles**: normal, italic

## Configuration Files

### 1. Font Configuration (`src/config/fonts.ts`)

Defines the fonts using Next.js font optimization:

```typescript
import localFont from 'next/font/local';
import { Plus_Jakarta_Sans } from 'next/font/google';

export const alJazeeraArabic = localFont({
  src: '../../../public/fonts/Al-Jazeera-Arabic-Bold.ttf',
  variable: '--font-al-jazeera-arabic',
  display: 'swap',
  weight: '400 700',
  fallback: ['Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
});

export const jakartaSans = Plus_Jakarta_Sans({
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-jakarta-sans',
  display: 'swap',
});
```

### 2. Global Styles (`src/styles/arkyra-globals.css`)

Applies fonts based on HTML language and direction attributes:

```css
/* RTL (Arabic) */
html[dir="rtl"] body {
  font-family: var(--font-al-jazeera-arabic, 'Al-Jazeera-Arabic-Bold'), sans-serif;
}

/* LTR (Other languages) */
html[dir="ltr"] body {
  font-family: var(--font-jakarta-sans, 'Inter'), sans-serif;
}

/* Language-specific overrides */
html[lang="ar"] body,
html[lang="ar"] * {
  font-family: var(--font-al-jazeera-arabic, 'Al-Jazeera-Arabic-Bold'), sans-serif !important;
}
```

### 3. Branding Configuration (`src/config/branding.ts`)

Defines font preferences for each brand:

```typescript
export const BRANDING_CONFIG = {
  'aj-arkyra': {
    fonts: {
      primary: 'Al-Jazeera-Arabic-Bold',
      secondary: 'Inter, system-ui, sans-serif',
    },
    defaultLanguage: 'ar',
    rtlLanguages: ['ar'],
  },
  'arkyra-saas': {
    fonts: {
      primary: 'Al-Jazeera-Arabic-Bold',
      secondary: 'Inter, system-ui, sans-serif',
    },
    defaultLanguage: 'en',
    rtlLanguages: ['ar'],
  },
};
```

### 4. Tailwind Configuration (`tailwind.config.js`)

Exposes font families as Tailwind utility classes:

```javascript
fontFamily: {
  sans: ['Helvetica Neue'],
  'al-jazeera-arabic': ['var(--font-al-jazeera-arabic)', 'sans-serif'],
  'jakarta-sans': ['var(--font-jakarta-sans)', 'sans-serif'],
},
```

## Usage

### In React Components (Client-side)

Use the `useFont` hook for dynamic font application:

```tsx
import { useFont } from '@gitroom/frontend/hooks/use-font';

export function MyComponent() {
  const { getFontClass, getFontStyle, usesArabicFont } = useFont();

  return (
    <div className={getFontClass()}>
      {usesArabicFont ? 'مرحبا' : 'Hello'}
    </div>
  );
}
```

### In Server Components

Use the helper functions for server-side font application:

```tsx
import { getFontClassName, getFontStyle } from '@gitroom/frontend/hooks/use-font';
import { headers } from 'next/headers';
import { headerName } from '@gitroom/react/translation/i18n.config';

export default async function Page() {
  const allHeaders = headers();
  const language = allHeaders.get(headerName) || 'en';

  return (
    <div className={getFontClassName(language)}>
      Content
    </div>
  );
}
```

### Using Tailwind Classes

Apply font classes directly in your JSX:

```tsx
// For Arabic text
<div className="font-al-jazeera-arabic">النص العربي</div>

// For Latin text
<div className="font-jakarta-sans">Latin text</div>
```

### Using CSS Variables

Reference fonts in CSS files or inline styles:

```css
.my-class {
  font-family: var(--font-al-jazeera-arabic), sans-serif;
}

.my-other-class {
  font-family: var(--font-jakarta-sans), sans-serif;
}
```

## Automatic Language Switching

The `HtmlComponent` automatically handles font switching when the user changes language:

```typescript
// src/components/layout/html.component.tsx
useEffect(() => {
  const bodyElement = document.querySelector('body');
  if (bodyElement) {
    const isArabic = currentLang === 'ar';
    if (isArabic) {
      bodyElement.style.fontFamily = 'var(--font-al-jazeera-arabic), sans-serif';
    } else {
      bodyElement.style.fontFamily = 'var(--font-jakarta-sans), sans-serif';
    }
  }
}, [currentLang]);
```

## RTL Support

The font system is integrated with RTL (Right-to-Left) support:

1. **Direction**: Automatically set based on language (`dir="rtl"` for Arabic)
2. **Text Alignment**: Right-aligned for Arabic, left-aligned for others
3. **Layout Mirroring**: Margins, padding, and positioning are automatically flipped

## Brand-Specific Font Application

When the AJ Arkyra brand is active:

```typescript
import { isAJArkyra, getBrandingConfig } from '@gitroom/frontend/config/branding';

const brandConfig = getBrandingConfig();
const primaryFont = brandConfig.fonts.primary; // 'Al-Jazeera-Arabic-Bold'
```

## Testing

To verify font configuration is working:

1. **Change Language**: Use the language selector to switch between Arabic and English
2. **Inspect Element**: Check the `font-family` CSS property in browser DevTools
3. **Visual Check**: Arabic text should appear in Al Jazeera Arabic Bold, English in Plus Jakarta Sans

### Test Cases

```typescript
// Test 1: Arabic language
changeLanguage('ar');
expect(document.documentElement.getAttribute('lang')).toBe('ar');
expect(document.documentElement.getAttribute('dir')).toBe('rtl');

// Test 2: English language
changeLanguage('en');
expect(document.documentElement.getAttribute('lang')).toBe('en');
expect(document.documentElement.getAttribute('dir')).toBe('ltr');
```

## Troubleshooting

### Font Not Loading

1. **Check File Path**: Ensure `/public/fonts/Al-Jazeera-Arabic-Bold.ttf` exists
2. **Verify Import**: Check that `arkyra-globals.css` is imported in layout
3. **Check CSS Variables**: Verify `--font-al-jazeera-arabic` is defined

### Font Not Switching on Language Change

1. **Check Language State**: Verify `i18next.resolvedLanguage` is updating
2. **Check HtmlComponent**: Ensure it's rendered in the layout
3. **Check Event Listener**: Verify `languageChanged` event is firing

### Wrong Font Displaying

1. **Check HTML Attributes**: Inspect `html` element for correct `lang` and `dir` attributes
2. **Check CSS Specificity**: Ensure no other styles are overriding font-family
3. **Clear Cache**: Clear browser cache and rebuild Next.js application

## Performance Optimization

- **Font Display Swap**: Fonts use `font-display: swap` for better loading performance
- **Preloading**: Next.js automatically preloads font files
- **CSS Variables**: Font variables enable instant switching without re-downloading
- **Fallback Fonts**: System fonts are used while custom fonts load

## Future Enhancements

- [ ] Add more Arabic font weights (Light, Regular, Medium)
- [ ] Support for additional Arabic scripts (Naskh, Kufi)
- [ ] Font subsetting for faster loading
- [ ] Variable fonts for better performance
- [ ] Font preview in settings

## References

- [Next.js Font Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)
- [Al Jazeera Branding Guidelines](https://internal.aljazeera.com/branding)
- [CSS Writing Modes](https://developer.mozilla.org/en-US/docs/Web/CSS/writing-mode)
- [Tailwind CSS RTL Plugin](https://github.com/20lives/tailwindcss-rtl)
