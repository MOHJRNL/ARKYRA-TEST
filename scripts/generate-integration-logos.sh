#!/bin/bash

# Script to create placeholder SVG logos for integrations
# Run this script to generate default logos for all integrations

ICONS_DIR="/Users/MOH/MOH - DATA/Work/Growingify /arkyra/apps/frontend/public/icons/third-party"

# Create directory if it doesn't exist
mkdir -p "$ICONS_DIR"

echo "Generating placeholder logos for integrations..."

# Create a default placeholder
cat > "$ICONS_DIR/default.png" << 'EOL'
<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#6366f1"/>
  <text x="256" y="256" font-family="Arial" font-size="48" fill="white" text-anchor="middle" dominant-baseline="middle">?</text>
</svg>
EOL

echo "✓ Created default.png"

# List of integrations that need logos
INTEGRATIONS=(
  "synthesia"
  "d-id"
  "runway"
  "elevenlabs"
  "murf"
  "playht"
  "openai"
  "claude"
  "mistral"
  "webhooks"
  "zapier"
  "make"
  "n8n"
  "notion"
  "google-sheets"
  "airtable"
  "ga4"
  "looker-studio"
  "posthog"
  "amplitude"
)

# Create placeholder for each integration
for integration in "${INTEGRATIONS[@]}"; do
  # Get first letter uppercase
  first_letter=$(echo "$integration" | cut -c1 | tr '[:lower:]' '[:upper:]')

  # Create SVG placeholder
  cat > "$ICONS_DIR/${integration}.svg" << EOL
<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad-${integration}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" fill="url(#grad-${integration})" rx="80"/>
  <text x="256" y="280" font-family="Arial, sans-serif" font-size="200" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">${first_letter}</text>
</svg>
EOL

  echo "✓ Created ${integration}.svg"
done

echo ""
echo "✅ All placeholder logos generated!"
echo ""
echo "Note: These are SVG placeholders. For production, please replace with:"
echo "  - Official brand logos from each service"
echo "  - 512x512px PNG format"
echo "  - Transparent backgrounds"
echo ""
echo "You can download official logos from:"
echo "  - Service websites"
echo "  - Brand asset pages"
echo "  - https://worldvectorlogo.com/"
echo "  - https://seeklogo.com/"
