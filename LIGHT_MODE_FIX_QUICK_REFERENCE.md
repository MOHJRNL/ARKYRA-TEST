# Light Mode Text Visibility - Quick Reference Guide

## The Problem
White text (`text-white`) appears invisible on white backgrounds in light mode.

## The Solution
Always use dual-mode text colors with Tailwind's `dark:` variant.

---

## Quick Fix Pattern

### ❌ WRONG (Broken in Light Mode)
```tsx
<div className="text-white">Content</div>
<button className="bg-blue-500 text-white">Click</button>
<CheckIcon className="text-white" />
```

### ✅ CORRECT (Works in Both Modes)
```tsx
<div className="text-gray-900 dark:text-white">Content</div>
<button className="bg-blue-500 text-gray-900 dark:text-white">Click</button>
<CheckIcon className="text-gray-900 dark:text-white" />
```

---

## Color Recommendations

| Use Case | Light Mode | Dark Mode | Tailwind Classes |
|----------|-----------|-----------|------------------|
| **Primary Text** | `text-gray-900` | `text-white` | `text-gray-900 dark:text-white` |
| **Secondary Text** | `text-gray-700` | `text-gray-200` | `text-gray-700 dark:text-gray-200` |
| **Muted Text** | `text-gray-600` | `text-gray-300` | `text-gray-600 dark:text-gray-300` |
| **Link Text** | `text-blue-600` | `text-blue-400` | `text-blue-600 dark:text-blue-400` |
| **Error Text** | `text-red-600` | `text-red-400` | `text-red-600 dark:text-red-400` |
| **Success Text** | `text-green-600` | `text-green-400` | `text-green-600 dark:text-green-400` |

---

## Common Scenarios

### 1. Buttons with Colored Backgrounds
```tsx
// Primary button
<button className="bg-[#048FCC] text-gray-900 dark:text-white">
  Click Me
</button>

// Success button
<button className="bg-green-500 text-gray-900 dark:text-white">
  Save
</button>

// Danger button
<button className="bg-red-500 text-gray-900 dark:text-white">
  Delete
</button>
```

### 2. Icons
```tsx
// Regular icon
<CheckIcon className="text-gray-900 dark:text-white" />

// Icon on colored background
<div className="bg-blue-500 p-4">
  <StarIcon className="text-gray-900 dark:text-white" />
</div>

// Icon with conditional visibility
<WarningIcon
  className={clsx(
    'w-5 h-5',
    isError && 'text-gray-900 dark:text-white'
  )}
/>
```

### 3. Badges and Tags
```tsx
// Tag with custom background
<span className="bg-[#F8AB0C] text-gray-900 dark:text-white px-2 py-1 rounded">
  Featured
</span>

// Status badge
<span className={clsx(
  'px-3 py-1 rounded-full text-sm',
  isActive
    ? 'bg-green-500 text-gray-900 dark:text-white'
    : 'bg-gray-300 text-gray-900 dark:text-gray-100'
)}>
  {status}
</span>
```

### 4. Form Elements
```tsx
// Input label
<label className="text-gray-900 dark:text-white">
  Username
</label>

// Helper text
<p className="text-gray-600 dark:text-gray-300 text-sm">
  Enter your username
</p>

// Error message
<p className="text-red-600 dark:text-red-400 text-sm">
  This field is required
</p>
```

### 5. Modal/Dialog Content
```tsx
<div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
  <h2 className="text-gray-900 dark:text-white text-xl font-bold">
    Confirm Action
  </h2>
  <p className="text-gray-700 dark:text-gray-200 mt-2">
    Are you sure you want to proceed?
  </p>
  <div className="flex gap-4 mt-4">
    <button className="bg-blue-500 text-gray-900 dark:text-white px-4 py-2 rounded">
      Confirm
    </button>
    <button className="bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white px-4 py-2 rounded">
      Cancel
    </button>
  </div>
</div>
```

### 6. Cards
```tsx
<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
  <h3 className="text-gray-900 dark:text-white text-lg font-semibold">
    Card Title
  </h3>
  <p className="text-gray-700 dark:text-gray-200 mt-2">
    Card description goes here
  </p>
  <div className="mt-4 flex items-center justify-between">
    <span className="text-gray-600 dark:text-gray-300 text-sm">
      Last updated: 2 hours ago
    </span>
    <button className="text-blue-600 dark:text-blue-400 hover:underline">
      View Details
    </button>
  </div>
</div>
```

---

## Testing Checklist

Before committing, always test:

- [ ] Component renders correctly in **Light Mode**
- [ ] Component renders correctly in **Dark Mode**
- [ ] Text is **readable** on all backgrounds
- [ ] Hover states work in both modes
- [ ] Active/pressed states work in both modes
- [ ] Disabled states are visible in both modes
- [ ] Icons and text have proper contrast

---

## Development Tips

1. **Use Browser DevTools:**
   - Toggle dark mode in browser settings
   - Use Chrome DevTools' dark mode emulation
   - Test with actual OS dark mode

2. **Consistent Pattern:**
   - Always pair light and dark variants
   - Use conditional classes with `clsx()` for complex logic
   - Keep color intensity balanced

3. **Avoid These:**
   - ❌ `text-white` without `dark:` variant
   - ❌ `text-black` (use `text-gray-900` instead)
   - ❌ Hard-coded hex colors for text (use Tailwind colors)
   - ❌ Assuming users only use one theme

4. **When in Doubt:**
   - Use `text-gray-900 dark:text-white` for primary text
   - Use `text-gray-700 dark:text-gray-200` for secondary text
   - Test both modes immediately

---

## Background Color Pairing Guide

| Background | Light Mode Text | Dark Mode Text |
|------------|----------------|----------------|
| `bg-white` | `text-gray-900` | N/A (white bg in light only) |
| `bg-gray-100` | `text-gray-900` | N/A |
| `bg-gray-800` | N/A | `text-white` |
| `bg-blue-500` | `text-gray-900` | `text-white` |
| `bg-green-500` | `text-gray-900` | `text-white` |
| `bg-red-500` | `text-gray-900` | `text-white` |
| `bg-[#048FCC]` | `text-gray-900` | `text-white` |

---

## Files Already Fixed ✅

All these files now have proper light/dark mode support:

1. `apps/frontend/src/components/launches/helpers/top.title.component.tsx`
2. `apps/frontend/src/components/launches/ai.video.tsx`
3. `apps/frontend/src/components/launches/ai.image.tsx`
4. `apps/frontend/src/components/launches/tags.component.tsx`
5. `apps/frontend/src/components/launches/new.post.tsx`
6. `apps/frontend/src/components/launches/information.component.tsx`
7. `apps/frontend/src/components/launches/time.table.tsx`
8. `apps/frontend/src/components/launches/web3/providers/telegram.provider.tsx`

Use these as reference examples for fixing other files.

---

## Search for Issues

Find potential light mode issues in your codebase:

```bash
# Find text-white without dark mode variant
grep -r "text-white[^-]" apps/frontend/src/components/ --include="*.tsx"

# Find text-gray-100 (might be too light in light mode)
grep -r "text-gray-100" apps/frontend/src/components/ --include="*.tsx"

# Find text-gray-200 (might be too light)
grep -r "text-gray-200" apps/frontend/src/components/ --include="*.tsx"
```

---

**Last Updated:** 2026-02-01
**Status:** Production Ready ✅
