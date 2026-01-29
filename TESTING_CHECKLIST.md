# ARKYRA UI/UX Testing Checklist

## Quick Testing Guide

Use this checklist to verify all UI/UX fixes are working correctly.

---

## 1. Calendar Component Testing

### Light Mode Tests
1. **Navigate to:** `/launches` (Calendar page)
2. **Switch to:** Light mode (sun icon in top bar)
3. **Verify:**
   - [ ] Time labels (e.g., "9:00 AM") are dark and clearly visible
   - [ ] Day names (Monday, Tuesday, etc.) are dark and readable
   - [ ] Date numbers are bold and visible
   - [ ] Hour labels in week view are readable
   - [ ] All text has good contrast against light background

### Dark Mode Tests
1. **Switch to:** Dark mode (moon icon)
2. **Verify:**
   - [ ] All text remains white/light colored
   - [ ] No contrast issues
   - [ ] Hover states work correctly

### View Switching
1. **Test each view:**
   - [ ] Day view - times visible
   - [ ] Week view - all labels readable
   - [ ] Month view - date numbers clear

---

## 2. Add Channel Modal Testing

### Open Modal
1. **Navigate to:** `/launches`
2. **Click:** "Add Channel" button
3. **Verify:**

### Light Mode
- [ ] Modal has clear borders
- [ ] Social media icons visible
- [ ] Platform names readable (text-gray-900)
- [ ] Hover state shows blue border (#048FCC)
- [ ] Shadow appears on hover
- [ ] Each box is clearly separated

### Dark Mode
- [ ] Text is white/light
- [ ] Borders visible (gray-700)
- [ ] Hover effects work
- [ ] Icons remain visible

### Articles Section
- [ ] Article provider boxes have borders
- [ ] Text is readable
- [ ] Hover states work

---

## 3. Integration Tools (Plugs) Testing

### Access Plugs
1. **Navigate to:** `/plugs`
2. **Select:** Any channel from left sidebar

### Verify Cards
- [ ] Each plug card has clear borders
- [ ] Light mode: gray-200 borders, gray-900 text
- [ ] Dark mode: gray-700 borders, white text
- [ ] Shadow visible (shadow-sm)
- [ ] Hover shows enhanced shadow (shadow-md)
- [ ] Hover shows blue accent border (#048FCC)
- [ ] Description text is limited to 4 lines
- [ ] Title is bold and readable
- [ ] "Set Plug" / "Edit Plug" button visible

---

## 4. Third-Party Integrations Testing

### Access Page
1. **Navigate to:** `/third-party`

### Verify Integration Cards
- [ ] Each card has clear border
- [ ] Light mode: borders visible, text dark
- [ ] Dark mode: borders visible, text light
- [ ] Icons/logos are visible
- [ ] Title is bold and prominent
- [ ] Description text has good contrast
- [ ] Hover state shows:
  - [ ] Enhanced shadow
  - [ ] Blue accent border
  - [ ] Smooth transition
- [ ] "Add" button is visible

### Verify Logos
Check that all these integration logos display correctly:
- [ ] Airtable
- [ ] Amplitude
- [ ] D-ID
- [ ] ElevenLabs
- [ ] Google Analytics 4
- [ ] Google Sheets
- [ ] HeyGen
- [ ] Looker Studio
- [ ] Make
- [ ] Murf
- [ ] n8n
- [ ] Notion
- [ ] Play.ht
- [ ] PostHog
- [ ] Runway
- [ ] Synthesia
- [ ] Webhooks
- [ ] Zapier

---

## 5. Language Settings Testing

### Access Settings
1. **Click:** Language flag in top bar (or go to `/settings`)
2. **Modal should open** with language grid

### Verify Modal
- [ ] Modal appears (not blocked by z-index issues)
- [ ] Grid of 4 columns shows all languages
- [ ] Each language has:
  - [ ] Country flag visible
  - [ ] Language name in native script
  - [ ] Clear border (gray-200 in light, gray-700 in dark)
- [ ] Current language has blue border (#048FCC)
- [ ] Hover shows shadow effect
- [ ] All cards are clickable

### Test Language Switching
Try switching to each language:
- [ ] English (GB flag)
- [ ] Arabic (SA flag) - **Verify RTL layout works**
- [ ] Spanish (ES flag)
- [ ] French (FR flag)
- [ ] German (DE flag)
- [ ] Japanese (JP flag)

### Arabic Language Specific Tests
1. **Switch to:** Arabic
2. **Verify:**
   - [ ] Text direction is right-to-left
   - [ ] Language selector still works
   - [ ] All settings are clickable
   - [ ] No layout issues

---

## 6. Copyright Footer Testing

### Main Site Pages
Check footer appears on these pages:
- [ ] `/launches` (Calendar)
- [ ] `/analytics`
- [ ] `/media`
- [ ] `/plugs`
- [ ] `/third-party`
- [ ] `/settings`
- [ ] `/agents`
- [ ] `/billing`

### Verify Footer
- [ ] Text reads: "Made with love ❤️ by Noah Hendy"
- [ ] Light mode: text is gray-600
- [ ] Dark mode: text is gray-400
- [ ] "Noah Hendy" link is blue (#048FCC)
- [ ] Hover changes color to yellow (#F8AB0C)
- [ ] Hover shows underline
- [ ] Link opens noahhendy.com in new tab
- [ ] Border-top is visible

### Auth Pages
1. **Navigate to:** `/auth/login`
2. **Verify:**
   - [ ] Footer appears on right side (testimonial section)
   - [ ] Same styling as main site

---

## 7. Design/Media Icons Testing

### Access Launch Editor
1. **Navigate to:** `/launches`
2. **Click:** Add new post or edit existing
3. **Find:** AI Image and AI Video buttons

### Verify Buttons
- [ ] AI Image button visible
- [ ] AI Video button visible
- [ ] Both buttons have blue background (#048FCC)
- [ ] Text is white (correct for colored background)
- [ ] Icons are white
- [ ] Hover shows darker blue (#235170)
- [ ] Hover shows shadow

---

## 8. Global Theme Switching Test

### Complete Theme Test
1. **Start in:** Light mode
2. **Visit each page:**
   - Calendar, Analytics, Media, Plugs, Third-Party, Settings, Agents
3. **Verify:** All text readable, borders visible, no contrast issues
4. **Switch to:** Dark mode
5. **Visit same pages again**
6. **Verify:** All elements adapt correctly

---

## 9. Responsive Design Testing

### Desktop (1920x1080)
- [ ] All components display correctly
- [ ] Footer visible
- [ ] Borders and shadows render properly

### Tablet (1024x768)
- [ ] Layout adapts
- [ ] Text remains readable
- [ ] Buttons accessible

### Mobile View (375x667)
- [ ] Mobile menu works
- [ ] Text not cut off
- [ ] Footer visible

---

## 10. Accessibility Testing

### Keyboard Navigation
- [ ] Tab through language modal
- [ ] Tab through integration cards
- [ ] Tab through plug cards
- [ ] All focusable elements have visible focus state

### Screen Reader Test (Optional)
- [ ] Alt text on images
- [ ] Proper heading hierarchy
- [ ] Form labels present

### Color Contrast
- [ ] Light mode text passes WCAG AA
- [ ] Dark mode text passes WCAG AA
- [ ] Links distinguishable from text

---

## 11. Browser Compatibility

Test in these browsers:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

---

## 12. Console Error Check

### Developer Tools
1. **Open:** Browser Developer Console (F12)
2. **Navigate:** Through all pages
3. **Verify:**
   - [ ] No JavaScript errors
   - [ ] No CSS warnings
   - [ ] No failed resource loads (especially logo images)

---

## Bug Report Template

If you find any issues, report them with this format:

```
**Component:** [Calendar/Modal/Integration/etc.]
**Theme:** [Light/Dark]
**Browser:** [Chrome/Firefox/Safari/Edge]
**Issue:** [Description]
**Steps to Reproduce:**
1.
2.
3.

**Expected:** [What should happen]
**Actual:** [What actually happens]
**Screenshot:** [If applicable]
```

---

## Quick Visual Test (5 minutes)

If short on time, do this quick test:

1. ✅ Switch to light mode
2. ✅ Open calendar - verify times are dark
3. ✅ Open "Add Channel" modal - verify borders
4. ✅ Go to `/third-party` - verify cards have borders
5. ✅ Click language flag - verify modal works
6. ✅ Scroll to bottom - verify footer exists
7. ✅ Switch to dark mode
8. ✅ Verify nothing broke

---

## Success Criteria

All items in this checklist should be checked ✅

If any item fails:
1. Document the issue
2. Check if it's a new bug or expected behavior
3. Report to development team

---

**Last Updated:** January 29, 2026
**Platform:** ARKYRA
**Status:** Ready for Testing
