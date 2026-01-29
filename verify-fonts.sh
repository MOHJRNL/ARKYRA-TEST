#!/bin/bash

echo "=========================================="
echo "ARKYRA Font Configuration Verification"
echo "=========================================="
echo ""

# Check font file
echo "1. Checking font file..."
if [ -f "apps/frontend/public/fonts/Al-Jazeera-Arabic-Bold.ttf" ]; then
    echo "   ✅ Font file exists"
    ls -lh "apps/frontend/public/fonts/Al-Jazeera-Arabic-Bold.ttf"
else
    echo "   ❌ Font file NOT found"
fi
echo ""

# Check config files
echo "2. Checking configuration files..."

if [ -f "apps/frontend/src/config/fonts.ts" ]; then
    echo "   ✅ fonts.ts exists"
else
    echo "   ❌ fonts.ts NOT found"
fi

if [ -f "apps/frontend/src/styles/arkyra-globals.css" ]; then
    echo "   ✅ arkyra-globals.css exists"
else
    echo "   ❌ arkyra-globals.css NOT found"
fi

if [ -f "apps/frontend/src/hooks/use-font.ts" ]; then
    echo "   ✅ use-font.ts exists"
else
    echo "   ❌ use-font.ts NOT found"
fi

if [ -f "apps/frontend/src/components/ui/font-test.component.tsx" ]; then
    echo "   ✅ font-test.component.tsx exists"
else
    echo "   ❌ font-test.component.tsx NOT found"
fi
echo ""

# Check imports in layout
echo "3. Checking layout.tsx imports..."
if grep -q "arkyra-globals.css" "apps/frontend/src/app/(app)/layout.tsx"; then
    echo "   ✅ arkyra-globals.css imported"
else
    echo "   ❌ arkyra-globals.css NOT imported"
fi

if grep -q "from '@gitroom/frontend/config/fonts'" "apps/frontend/src/app/(app)/layout.tsx"; then
    echo "   ✅ fonts config imported"
else
    echo "   ❌ fonts config NOT imported"
fi
echo ""

# Check Tailwind config
echo "4. Checking Tailwind configuration..."
if grep -q "font-al-jazeera-arabic" "apps/frontend/tailwind.config.js"; then
    echo "   ✅ Arabic font in Tailwind config"
else
    echo "   ❌ Arabic font NOT in Tailwind config"
fi

if grep -q "font-jakarta-sans" "apps/frontend/tailwind.config.js"; then
    echo "   ✅ Jakarta Sans in Tailwind config"
else
    echo "   ❌ Jakarta Sans NOT in Tailwind config"
fi
echo ""

# Check documentation
echo "5. Checking documentation..."
if [ -f "apps/frontend/FONTS_CONFIGURATION.md" ]; then
    echo "   ✅ FONTS_CONFIGURATION.md exists"
else
    echo "   ❌ FONTS_CONFIGURATION.md NOT found"
fi

if [ -f "FONT_SETUP_SUMMARY.md" ]; then
    echo "   ✅ FONT_SETUP_SUMMARY.md exists"
else
    echo "   ❌ FONT_SETUP_SUMMARY.md NOT found"
fi

if [ -f "FONT_QUICK_REFERENCE.md" ]; then
    echo "   ✅ FONT_QUICK_REFERENCE.md exists"
else
    echo "   ❌ FONT_QUICK_REFERENCE.md NOT found"
fi
echo ""

echo "=========================================="
echo "Verification Complete!"
echo "=========================================="
