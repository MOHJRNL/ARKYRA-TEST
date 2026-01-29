# Font Migration Guide for Developers

## Overview

This guide helps developers understand and work with the new Al Jazeera Arabic font system in ARKYRA.

## What Changed?

### Before
- Single font (Plus Jakarta Sans) for all languages
- No automatic font switching
- Manual RTL handling
- No Arabic font support

### After
- **Al Jazeera Arabic Bold** for Arabic text
- **Plus Jakarta Sans** for Latin text
- Automatic font switching based on language
- Integrated RTL support
- Brand-aware font selection

## Breaking Changes

### ⚠️ None!

The font system is designed to be **backward compatible**. Existing code will continue to work without modifications.

## New Features

### 1. Font Variables

Two new CSS variables are available:

```css
--font-al-jazeera-arabic  /* For Arabic text */
--font-jakarta-sans       /* For Latin text */
```

### 2. Tailwind Utilities

Two new Tailwind classes:

```tsx
className="font-al-jazeera-arabic"  // Force Arabic font
className="font-jakarta-sans"       // Force Latin font
```

### 3. Font Hook

New React hook for dynamic font usage:

```tsx
import { useFont } from '@gitroom/frontend/hooks/use-font';

function MyComponent() {
  const {
    getFontClass,      // Get Tailwind class
    getFontStyle,      // Get inline style
    getFontFamily,     // Get font-family string
    usesArabicFont,    // Boolean: is Arabic active?
    isRTL,             // Boolean: is RTL active?
    currentLanguage,   // Current language code
  } = useFont();

  return <div className={getFontClass()}>Content</div>;
}
```

## Migration Path

### Level 1: No Changes Required (Automatic)

If you don't modify your code, the font system will still work:
- Language changes automatically apply correct font
- RTL layout works as expected
- Brand configuration is respected

### Level 2: Explicit Font Usage (Recommended)

For components that need explicit font control:

```tsx
// Before
<div className="font-sans">Text</div>

// After (automatic font based on language)
import { useFont } from '@gitroom/frontend/hooks/use-font';

function MyComponent() {
  const { getFontClass } = useFont();
  return <div className={getFontClass()}>Text</div>;
}

// Or (force specific font)
<div className="font-al-jazeera-arabic">النص العربي</div>
<div className="font-jakarta-sans">Latin text</div>
```

### Level 3: Advanced Usage (Optional)

For complex scenarios:

```tsx
import { useFont } from '@gitroom/frontend/hooks/use-font';
import { getBrandingConfig } from '@gitroom/frontend/config/branding';

function AdvancedComponent() {
  const { usesArabicFont, isRTL, currentLanguage } = useFont();
  const brand = getBrandingConfig();

  // Conditional rendering based on font
  if (usesArabicFont) {
    return <ArabicLayout />;
  }

  return <LatinLayout />;
}
```

## Common Scenarios

### Scenario 1: Multilingual Text

```tsx
function WelcomeMessage() {
  const { getFontClass, usesArabicFont } = useFont();

  const message = usesArabicFont
    ? 'مرحباً بك في أركيرا'
    : 'Welcome to ARKYRA';

  return (
    <h1 className={getFontClass()}>
      {message}
    </h1>
  );
}
```

### Scenario 2: Mixed Content

```tsx
function MixedContent() {
  return (
    <div>
      {/* Arabic section */}
      <section className="font-al-jazeera-arabic" dir="rtl">
        <h2>عنوان عربي</h2>
        <p>نص عربي...</p>
      </section>

      {/* English section */}
      <section className="font-jakarta-sans" dir="ltr">
        <h2>English Title</h2>
        <p>English text...</p>
      </section>
    </div>
  );
}
```

### Scenario 3: Dynamic Styling

```tsx
function DynamicCard({ title, content, language }) {
  const fontClass = language === 'ar'
    ? 'font-al-jazeera-arabic'
    : 'font-jakarta-sans';

  const direction = language === 'ar' ? 'rtl' : 'ltr';

  return (
    <div className={`${fontClass} p-4`} dir={direction}>
      <h3 className="text-xl font-bold">{title}</h3>
      <p>{content}</p>
    </div>
  );
}
```

### Scenario 4: Server Components

```tsx
import { getFontClassName, getFontStyle } from '@gitroom/frontend/hooks/use-font';
import { headers } from 'next/headers';
import { headerName } from '@gitroom/react/translation/i18n.config';

export default async function ServerPage() {
  const allHeaders = headers();
  const language = allHeaders.get(headerName) || 'en';
  const fontClass = getFontClassName(language);

  return (
    <div className={fontClass}>
      <h1>Server-rendered content</h1>
    </div>
  );
}
```

## Best Practices

### DO ✅

1. **Use the hook for dynamic content**
   ```tsx
   const { getFontClass } = useFont();
   <div className={getFontClass()}>Dynamic content</div>
   ```

2. **Force fonts for mixed-language content**
   ```tsx
   <div className="font-al-jazeera-arabic">عربي</div>
   <div className="font-jakarta-sans">English</div>
   ```

3. **Check language state for conditional rendering**
   ```tsx
   const { usesArabicFont } = useFont();
   if (usesArabicFont) { /* Arabic-specific UI */ }
   ```

### DON'T ❌

1. **Don't hardcode font families**
   ```tsx
   // Bad
   <div style={{ fontFamily: 'Al-Jazeera-Arabic-Bold' }}>Text</div>

   // Good
   <div className="font-al-jazeera-arabic">Text</div>
   ```

2. **Don't ignore RTL directionality**
   ```tsx
   // Bad
   <div className="font-al-jazeera-arabic">النص</div>

   // Good
   <div className="font-al-jazeera-arabic" dir="rtl">النص</div>
   ```

3. **Don't mix font utilities with legacy styles**
   ```tsx
   // Bad
   <div className="font-sans font-al-jazeera-arabic">Text</div>

   // Good
   <div className="font-al-jazeera-arabic">Text</div>
   ```

## Testing Your Changes

### 1. Visual Testing

```bash
# Start dev server
npm run dev

# Open http://localhost:3000
# Change language to Arabic
# Verify Arabic text uses Al Jazeera font
```

### 2. Component Testing

```tsx
import { render } from '@testing-library/react';
import { useFont } from '@gitroom/frontend/hooks/use-font';

// Mock the hook
jest.mock('@gitroom/frontend/hooks/use-font');

test('uses correct font for Arabic', () => {
  (useFont as jest.Mock).mockReturnValue({
    getFontClass: () => 'font-al-jazeera-arabic',
    usesArabicFont: true,
  });

  const { container } = render(<MyComponent />);
  expect(container.querySelector('.font-al-jazeera-arabic')).toBeInTheDocument();
});
```

### 3. Integration Testing

```tsx
// Test language switching
changeLanguage('ar');
await waitFor(() => {
  expect(document.documentElement.getAttribute('lang')).toBe('ar');
  expect(document.documentElement.getAttribute('dir')).toBe('rtl');
});

changeLanguage('en');
await waitFor(() => {
  expect(document.documentElement.getAttribute('lang')).toBe('en');
  expect(document.documentElement.getAttribute('dir')).toBe('ltr');
});
```

## Troubleshooting

### Issue: Font not applying to my component

**Solution**: Ensure your component is not overriding the font-family:

```tsx
// Check for conflicting styles
<div className="font-al-jazeera-arabic" style={{ fontFamily: 'Arial' }}>
  {/* This won't work - inline style overrides class */}
</div>

// Use only class
<div className="font-al-jazeera-arabic">
  {/* This works */}
</div>
```

### Issue: Font changes on page load

**Solution**: The font system responds to language changes. This is expected behavior. To prevent flashing:

```tsx
// In your component
useEffect(() => {
  // Preload fonts
  document.fonts.load('1em Al-Jazeera-Arabic-Bold');
}, []);
```

### Issue: TypeScript errors with useFont

**Solution**: Ensure you're importing from the correct path:

```tsx
// Correct
import { useFont } from '@gitroom/frontend/hooks/use-font';

// Incorrect
import { useFont } from 'hooks/use-font';
```

## Performance Considerations

### Font Loading

- Fonts are preloaded by Next.js
- Uses `font-display: swap` to prevent FOIT
- Font files are cached by browser
- Total additional size: ~50KB (Al Jazeera font)

### Optimization Tips

1. **Preload fonts in critical pages**
   ```tsx
   <link
     rel="preload"
     href="/fonts/Al-Jazeera-Arabic-Bold.ttf"
     as="font"
     type="font/ttf"
     crossOrigin="anonymous"
   />
   ```

2. **Use font-display: swap**
   Already configured in `arkyra-globals.css`

3. **Subset fonts for production**
   Future optimization - subset font to include only used glyphs

## Rollback Plan

If you need to rollback to the old font system:

1. Remove font imports from `layout.tsx`:
   ```tsx
   // Remove these lines
   import '../../styles/arkyra-globals.css';
   import { alJazeeraArabic, jakartaSans } from '@gitroom/frontend/config/fonts';
   ```

2. Restore original layout:
   ```tsx
   <body className={clsx(jakartaSans.className, 'dark text-primary !bg-primary')}>
   ```

3. Remove font configurations (optional)

## Questions?

- 📖 Full documentation: `/apps/frontend/FONTS_CONFIGURATION.md`
- 🚀 Quick reference: `/FONT_QUICK_REFERENCE.md`
- ✅ Setup summary: `/FONT_SETUP_SUMMARY.md`
- 🧪 Test component: `@gitroom/frontend/components/ui/font-test.component`

## Changelog

### Version 1.0.0 (2026-01-27)
- ✅ Initial font system implementation
- ✅ Al Jazeera Arabic Bold font integration
- ✅ Automatic language-based font switching
- ✅ RTL support integration
- ✅ Brand configuration support
- ✅ Tailwind utilities
- ✅ React hooks for dynamic usage
- ✅ Comprehensive documentation

## Next Steps

1. Review the [Quick Reference](/FONT_QUICK_REFERENCE.md)
2. Check the [Font Test Component](/apps/frontend/src/components/ui/font-test.component.tsx)
3. Start using the new font system in your components
4. Test with different languages
5. Report any issues or suggestions

Happy coding! 🎉
