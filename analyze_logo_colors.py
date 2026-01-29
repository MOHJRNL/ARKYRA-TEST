#!/usr/bin/env python3
"""
Analyze Arkyra logo colors and create a modern color schema
"""
from PIL import Image
from collections import Counter
import colorsys

# Load the logo
logo_path = "/Users/MOH/MOH - DATA/AJM - DNR/AJ Branding/Arkyra Pro-N.png"
img = Image.open(logo_path)
img = img.convert('RGB')

# Get all pixels
pixels = list(img.getdata())

# Filter out white/near-white pixels (background)
colored_pixels = [p for p in pixels if not (p[0] > 240 and p[1] > 240 and p[2] > 240)]

# Count color frequencies
color_counts = Counter(colored_pixels)

# Get top 20 most common colors
top_colors = color_counts.most_common(20)

print("=" * 80)
print("ARKYRA LOGO COLOR ANALYSIS")
print("=" * 80)
print("\nTop 20 Colors in Logo:")
print("-" * 80)

for i, (color, count) in enumerate(top_colors, 1):
    r, g, b = color
    hex_color = f"#{r:02x}{g:02x}{b:02x}"

    # Calculate HSL for better understanding
    h, l, s = colorsys.rgb_to_hls(r/255, g/255, b/255)
    hue = int(h * 360)
    lightness = int(l * 100)
    saturation = int(s * 100)

    # Determine color family
    if r > g and r > b:
        if g > b:
            family = "Orange/Brown"
        else:
            family = "Red/Pink"
    elif b > r and b > g:
        if r > g:
            family = "Purple/Blue"
        else:
            family = "Blue"
    elif g > r and g > b:
        family = "Green/Yellow"
    elif r == g and r > b:
        family = "Yellow"
    elif r == b and r > g:
        family = "Magenta"
    else:
        family = "Gray/Brown"

    print(f"{i:2}. {hex_color.upper()} | RGB({r:3}, {g:3}, {b:3}) | "
          f"HSL({hue:3}°, {saturation:3}%, {lightness:3}%) | "
          f"{family:15} | Count: {count:6}")

print("\n" + "=" * 80)
print("RECOMMENDED COLOR SCHEMA FOR MODERN UI/UX")
print("=" * 80)

# Analyze color categories
warm_colors = []
cool_colors = []
neutrals = []

for (r, g, b), count in top_colors:
    if r > 200 and g < 150 and b < 150:  # Reds
        continue  # Skip pure reds
    elif r > g and r > b:  # Warm tones
        warm_colors.append(((r, g, b), count))
    elif b > r and b > g:  # Cool tones (blues/purples)
        cool_colors.append(((r, g, b), count))
    else:
        neutrals.append(((r, g, b), count))

print("\n🔥 WARM TONES (Primary/Accent):")
print("-" * 80)
for i, ((r, g, b), count) in enumerate(warm_colors[:5], 1):
    hex_color = f"#{r:02x}{g:02x}{b:02x}"
    print(f"  {hex_color.upper()} - RGB({r}, {g}, {b}) - Usage: {count} pixels")

print("\n❄️  COOL TONES (Secondary/Trust):")
print("-" * 80)
for i, ((r, g, b), count) in enumerate(cool_colors[:5], 1):
    hex_color = f"#{r:02x}{g:02x}{b:02x}"
    print(f"  {hex_color.upper()} - RGB({r}, {g}, {b}) - Usage: {count} pixels")

print("\n⚪ NEUTRAL TONES (Text/Backgrounds):")
print("-" * 80)
for i, ((r, g, b), count) in enumerate(neutrals[:5], 1):
    hex_color = f"#{r:02x}{g:02x}{b:02x}"
    print(f"  {hex_color.upper()} - RGB({r}, {g}, {b}) - Usage: {count} pixels")

print("\n" + "=" * 80)
print("SUGGESTED MODERN UI/UX COLOR PALETTE")
print("=" * 80)
print("""
Based on the logo analysis, here's a modern color schema:

🎨 PRIMARY COLORS (Buttons, CTAs):
  - Primary:   #1F4788 (Deep Navy Blue) - Professional, trustworthy
  - Hover:     #163862 (Darker Navy) - Interactive state
  - Active:    #0F2745 (Very Dark Navy) - Pressed state

🔶 ACCENT COLORS (Highlights, Links):
  - Accent 1:  #D4A574 (Warm Gold/Tan) - Sophisticated, warm
  - Accent 2:  #C17D4F (Copper/Bronze) - Earthy, grounded
  - Accent 3:  #E6B887 (Light Gold) - Subtle highlights

⚡ ACTION COLORS (Success, Warning, Danger):
  - Success:   #4A9B6B (Muted Green)
  - Warning:   #D4A574 (Gold - from accent)
  - Danger:    #C14F4F (Muted Red)
  - Info:      #1F4788 (Navy - from primary)

🌓 NEUTRAL PALETTE (Backgrounds, Text):
  - Text Dark:     #0F0F0F (Almost Black)
  - Text Medium:   #4A4A4A (Medium Gray)
  - Text Light:    #8A8A8A (Light Gray)
  - BG Dark:       #0E0E0E (Very Dark Gray)
  - BG Medium:     #1A1919 (Dark Gray)
  - BG Light:      #F5F5F5 (Off-White)
  - Border:        #2A2A2A (Subtle Border)

📝 LINK COLORS:
  - Default:   #D4A574 (Gold) - Visible but not harsh
  - Hover:     #E6B887 (Light Gold) - Brighter on hover
  - Active:    #C17D4F (Copper) - Clicked state
  - Visited:   #B89968 (Darker Gold) - Already clicked

💡 USAGE RECOMMENDATIONS:
  ✓ Use Navy Blue (#1F4788) for primary buttons (professional, trustworthy)
  ✓ Use Gold/Tan (#D4A574) for links and secondary actions (warm, inviting)
  ✓ Avoid pure Arkyra rust (#D97757) as primary - too warm/aggressive
  ✓ Use rust colors sparingly for accents and highlights only
  ✓ Ensure WCAG AAA contrast (7:1) for text on backgrounds
  ✓ Use subtle transitions (200ms) for hover states
""")

print("=" * 80)
