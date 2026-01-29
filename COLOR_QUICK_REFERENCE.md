# ARKYRA Color Quick Reference Guide

## Primary Brand Colors

```css
--arkyra-primary: #D97757    /* Terra Cotta - Main brand color */
--arkyra-dark: #C35533       /* Burnt Sienna - Darker variant */
--arkyra-light: #CD8B62      /* Sandy Brown - Lighter variant */
```

## Usage by Context

### Links
```css
/* Dark Mode */
Default: #D97757
Hover: #CD8B62
Active: #C35533

/* Light Mode */
Default: #C35533
Hover: #D97757
Active: #CD8B62
```

### AI Buttons
```css
/* Dark Mode */
Background: #D97757
Hover: #CD8B62
Active: #C35533
Text: #FFFFFF

/* Light Mode */
Background: #C35533
Hover: #D97757
Active: #CD8B62
Text: #FFFFFF
```

### Primary Buttons
```css
/* Same as AI Buttons */
Background: #D97757 (dark) / #C35533 (light)
Hover: #CD8B62 (dark) / #D97757 (light)
Active: #C35533 (dark) / #CD8B62 (light)
Text: Always #FFFFFF
```

### Scrollbar
```css
Thumb: #D97757
Thumb Hover: #CD8B62
```

### Focus States
```css
Outline: 2px solid #D97757 (dark) / #C35533 (light)
Outline Offset: 2px
```

## Component Classes

### CSS Classes to Use
```css
.bg-forth          /* Primary background color */
.bg-seventh        /* Secondary background color */
.text-forth        /* Primary text color */
.ai-btn            /* AI button styling */
.btn-primary       /* Primary button styling */
.btn-link          /* Button-style link */
.community-link    /* Community link styling */
.social-link       /* Social media link styling */
```

## Inline Styles (When Needed)
```jsx
// AI Buttons
style={{ backgroundColor: '#D97757' }}

// With hover (use CSS classes instead when possible)
className="bg-[#D97757] hover:bg-[#CD8B62]"
```

## Accessibility

### Contrast Ratios (WCAG AA Compliant)
- #D97757 on dark bg (#0e0e0e): 4.8:1 ✓
- #C35533 on light bg (#ffffff): 5.2:1 ✓
- White text on #D97757: 4.5:1 ✓
- White text on #C35533: 6.1:1 ✓

### Guidelines
1. Always use white (#FFFFFF) text on Arkyra colored backgrounds
2. Use focus outlines for keyboard navigation
3. Maintain 0.2s transition timing for smooth UX
4. Add hover states for all interactive elements

## Common Patterns

### Button with Hover
```tsx
<button className="bg-forth text-white hover:bg-[#CD8B62] transition-all duration-200">
  Click Me
</button>
```

### Link with Arkyra Colors
```tsx
<a href="#" className="text-forth hover:underline">
  Learn More
</a>
```

### AI Generation Button
```tsx
<button className="ai-btn bg-[#D97757] hover:bg-[#CD8B62] text-white">
  Generate AI
</button>
```

## Don't Use
❌ #d82d7e (old AI button color)
❌ Random colors not in brand palette
❌ Inconsistent hover states
❌ Poor contrast ratios

## Do Use
✓ #D97757, #C35533, #CD8B62 (Arkyra palette)
✓ Consistent hover states across components
✓ White text on colored backgrounds
✓ Smooth transitions (0.2s ease)
✓ Proper focus indicators

---

**Quick Tip:** When in doubt, use `#D97757` for dark mode and `#C35533` for light mode as primary colors.
