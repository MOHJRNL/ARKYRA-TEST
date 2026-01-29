# ARKYRA Font System - Quick Reference

## 🎯 Quick Start

### Change Language to Arabic
The font will automatically switch to Al Jazeera Arabic Bold when you change the language to Arabic (ar).

```typescript
// User clicks language selector → Arabic
// Font automatically changes
```

## 📁 Key Files

| File | Purpose |
|------|---------|
| `/public/fonts/Al-Jazeera-Arabic-Bold.ttf` | Font file (50KB) |
| `/src/config/fonts.ts` | Font definitions |
| `/src/styles/arkyra-globals.css` | Global font styles |
| `/src/hooks/use-font.ts` | Font utility hook |
| `/src/app/(app)/layout.tsx` | Main layout with fonts |

## 🔤 Font Usage

### Method 1: Tailwind Classes (Recommended)

```tsx
// Arabic font
<div className="font-al-jazeera-arabic">النص العربي</div>

// Latin font
<div className="font-jakarta-sans">Latin text</div>
```

### Method 2: Use Hook (Dynamic)

```tsx
import { useFont } from '@gitroom/frontend/hooks/use-font';

function MyComponent() {
  const { getFontClass } = useFont();
  return <div className={getFontClass()}>Auto font</div>;
}
```

### Method 3: CSS Variables

```css
.my-class {
  font-family: var(--font-al-jazeera-arabic), sans-serif;
}
```

### Method 4: Inline Styles

```tsx
import { useFont } from '@gitroom/frontend/hooks/use-font';

function MyComponent() {
  const { getFontStyle } = useFont();
  return <div style={getFontStyle()}>Auto font</div>;
}
```

## 🌐 Language Support

| Language | Font | Direction |
|----------|------|-----------|
| Arabic (ar) | Al Jazeera Arabic Bold | RTL |
| English (en) | Plus Jakarta Sans | LTR |
| French (fr) | Plus Jakarta Sans | LTR |
| Spanish (es) | Plus Jakarta Sans | LTR |
| German (de) | Plus Jakarta Sans | LTR |

## 🎨 CSS Variables

```css
--font-al-jazeera-arabic  /* Al Jazeera font for Arabic */
--font-jakarta-sans       /* Jakarta Sans for Latin */
```

## ⚙️ Automatic Behavior

The font system automatically:
- ✅ Detects current language
- ✅ Applies correct font family
- ✅ Switches direction (RTL/LTR)
- ✅ Updates on language change
- ✅ Respects brand configuration

## 🔍 Debugging

### Check Font Loading
```javascript
// Open DevTools Console
console.log(document.fonts.check('1em Al-Jazeera-Arabic-Bold'));
// Should return true if loaded
```

### Check CSS Variables
```javascript
// Open DevTools Console
getComputedStyle(document.body).fontFamily;
// Should show current font
```

### Check HTML Attributes
```html
<!-- For Arabic -->
<html lang="ar" dir="rtl">

<!-- For English -->
<html lang="en" dir="ltr">
```

## 📊 Font Test Component

```tsx
import { FontTestComponent } from '@gitroom/frontend/components/ui/font-test.component';

export default function TestPage() {
  return <FontTestComponent />;
}
```

## 🚀 Performance

- Font file size: 50KB
- Preloaded by Next.js
- Uses `font-display: swap`
- Cached by browser
- No layout shift (FOUT prevented)

## 📱 RTL Support

```tsx
// Automatic RTL for Arabic
html[dir="rtl"] {
  direction: rtl;
  text-align: right;
}

// Use RTL utilities
<div className="rtl:pr-4 ltr:pl-4">Content</div>
```

## 🎭 Brand Integration

```typescript
import { getBrandingConfig } from '@gitroom/frontend/config/branding';

const brand = getBrandingConfig();
// brand.fonts.primary === 'Al-Jazeera-Arabic-Bold'
```

## ⚠️ Common Issues

### Font not loading
- Check file path: `/public/fonts/Al-Jazeera-Arabic-Bold.ttf`
- Clear `.next` cache: `rm -rf .next`
- Rebuild: `npm run build`

### Font not switching
- Check `HtmlComponent` is rendered
- Verify language state in DevTools
- Check i18next configuration

### Wrong font displaying
- Inspect CSS specificity
- Check for conflicting styles
- Verify CSS variables are defined

## 📚 Documentation

Full documentation: `/apps/frontend/FONTS_CONFIGURATION.md`

## 🛠️ Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Type check
npm run type-check

# Lint
npm run lint
```

## 📝 Examples

### Example 1: Multilingual Component
```tsx
export function WelcomeMessage() {
  const { usesArabicFont } = useFont();

  return (
    <h1 className={getFontClass()}>
      {usesArabicFont ? 'مرحباً' : 'Welcome'}
    </h1>
  );
}
```

### Example 2: Force Arabic Font
```tsx
export function ArabicTitle({ children }) {
  return (
    <h2 className="font-al-jazeera-arabic" dir="rtl">
      {children}
    </h2>
  );
}
```

### Example 3: Conditional Styling
```tsx
export function Article({ content, language }) {
  const fontClass = language === 'ar'
    ? 'font-al-jazeera-arabic'
    : 'font-jakarta-sans';

  return (
    <article className={fontClass}>
      {content}
    </article>
  );
}
```

## ✅ Checklist

- [x] Font file copied to `/public/fonts/`
- [x] Font configuration in `src/config/fonts.ts`
- [x] Global styles updated
- [x] Tailwind config updated
- [x] Layout updated with fonts
- [x] HTML component handles language changes
- [x] RTL support integrated
- [x] Brand configuration respects fonts
- [x] Documentation created
- [x] Test component available

## 🎉 Ready to Use!

The Al Jazeera Arabic Bold font is now fully configured and ready for use in your ARKYRA application. Simply change the language to Arabic, and the font will automatically be applied!
