#!/bin/bash

echo "🔍 Verifying Backend Integration Providers"
echo "=========================================="
echo ""

PROVIDERS_DIR="/Users/MOH/MOH - DATA/Work/Growingify /arkyra/libraries/nestjs-libraries/src/3rdparties"

# Count total providers
TOTAL=$(find "$PROVIDERS_DIR" -name "*.provider.ts" | wc -l | tr -d ' ')
echo "📦 Total Providers: $TOTAL"
echo ""

# List all providers by category
echo "📁 Provider Files:"
echo ""

echo "🎬 Video/Media (4):"
ls -1 "$PROVIDERS_DIR"/heygen/*.provider.ts 2>/dev/null | xargs -I {} basename {} .provider.ts
ls -1 "$PROVIDERS_DIR"/synthesia/*.provider.ts 2>/dev/null | xargs -I {} basename {} .provider.ts
ls -1 "$PROVIDERS_DIR"/d-id/*.provider.ts 2>/dev/null | xargs -I {} basename {} .provider.ts
ls -1 "$PROVIDERS_DIR"/runway/*.provider.ts 2>/dev/null | xargs -I {} basename {} .provider.ts
echo ""

echo "🎙️ Audio (3):"
ls -1 "$PROVIDERS_DIR"/elevenlabs/*.provider.ts 2>/dev/null | xargs -I {} basename {} .provider.ts
ls -1 "$PROVIDERS_DIR"/murf/*.provider.ts 2>/dev/null | xargs -I {} basename {} .provider.ts
ls -1 "$PROVIDERS_DIR"/playht/*.provider.ts 2>/dev/null | xargs -I {} basename {} .provider.ts
echo ""

echo "⚙️ Automation (4):"
ls -1 "$PROVIDERS_DIR"/webhooks/*.provider.ts 2>/dev/null | xargs -I {} basename {} .provider.ts
ls -1 "$PROVIDERS_DIR"/zapier/*.provider.ts 2>/dev/null | xargs -I {} basename {} .provider.ts
ls -1 "$PROVIDERS_DIR"/make/*.provider.ts 2>/dev/null | xargs -I {} basename {} .provider.ts
ls -1 "$PROVIDERS_DIR"/n8n/*.provider.ts 2>/dev/null | xargs -I {} basename {} .provider.ts
echo ""

echo "📊 Content Sources (7):"
ls -1 "$PROVIDERS_DIR"/notion/*.provider.ts 2>/dev/null | xargs -I {} basename {} .provider.ts
ls -1 "$PROVIDERS_DIR"/google-sheets/*.provider.ts 2>/dev/null | xargs -I {} basename {} .provider.ts
ls -1 "$PROVIDERS_DIR"/airtable/*.provider.ts 2>/dev/null | xargs -I {} basename {} .provider.ts
ls -1 "$PROVIDERS_DIR"/ga4/*.provider.ts 2>/dev/null | xargs -I {} basename {} .provider.ts
ls -1 "$PROVIDERS_DIR"/looker-studio/*.provider.ts 2>/dev/null | xargs -I {} basename {} .provider.ts
ls -1 "$PROVIDERS_DIR"/posthog/*.provider.ts 2>/dev/null | xargs -I {} basename {} .provider.ts
ls -1 "$PROVIDERS_DIR"/amplitude/*.provider.ts 2>/dev/null | xargs -I {} basename {} .provider.ts
echo ""

# Verify structure
echo "🔍 Verifying Provider Structure:"
echo ""

for file in $(find "$PROVIDERS_DIR" -name "*.provider.ts"); do
    provider_name=$(basename $(dirname "$file"))
    
    # Check for required patterns
    has_decorator=$(grep -c "@ThirdParty" "$file")
    has_check=$(grep -c "checkConnection" "$file")
    has_send=$(grep -c "sendData" "$file")
    has_extends=$(grep -c "extends ThirdPartyAbstract" "$file")
    
    if [ "$has_decorator" -gt 0 ] && [ "$has_check" -gt 0 ] && [ "$has_send" -gt 0 ] && [ "$has_extends" -gt 0 ]; then
        echo "✅ $provider_name - Valid structure"
    else
        echo "❌ $provider_name - Missing required methods or decorator"
    fi
done

echo ""
echo "📊 Code Statistics:"
find "$PROVIDERS_DIR" -name "*.provider.ts" -exec wc -l {} \; | awk '{sum+=$1} END {print "Total Lines: " sum}'

echo ""
echo "✅ Verification Complete!"
