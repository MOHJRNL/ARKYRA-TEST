#!/usr/bin/env python3
"""
Optimize Arkyra logo with transparent background
Creates multiple sizes for logo and favicon usage
"""
from PIL import Image
import os

# Paths
input_path = "/Users/MOH/MOH - DATA/AJM - DNR/AJ Branding/Arkyra Pro-N.png"
output_dir = "/Users/MOH/MOH - DATA/Work/Growingify /arkyra/apps/frontend/public"
logos_dir = os.path.join(output_dir, "logos")

# Create logos directory if it doesn't exist
os.makedirs(logos_dir, exist_ok=True)

print("Loading image...")
img = Image.open(input_path)
print(f"Original size: {img.size}")
print(f"Original mode: {img.mode}")

# Convert to RGBA if not already
if img.mode != 'RGBA':
    img = img.convert('RGBA')
    print("Converted to RGBA")

# Get image data
data = img.getdata()

# Create new image data with transparency
new_data = []
print("Processing transparency...")

# Define threshold for "white-ish" colors
# We'll make pixels that are very light (close to white) transparent
for item in data:
    # If the pixel is very light (close to white), make it transparent
    # RGB values all above 240 = very light/white
    if item[0] > 240 and item[1] > 240 and item[2] > 240:
        # Make transparent (0 alpha)
        new_data.append((255, 255, 255, 0))
    else:
        # Keep original pixel
        new_data.append(item)

# Update image data
img.putdata(new_data)
print("Transparency applied")

# Save full logo with transparent background
full_logo_path = os.path.join(logos_dir, "arkyra-logo-transparent.png")
img.save(full_logo_path, "PNG")
print(f"✓ Saved full logo with transparency: {full_logo_path}")

# Create optimized logo (512x512 max size for web usage)
logo_width, logo_height = img.size
if logo_width > 512 or logo_height > 512:
    # Maintain aspect ratio
    ratio = min(512/logo_width, 512/logo_height)
    new_size = (int(logo_width * ratio), int(logo_height * ratio))
    logo_optimized = img.resize(new_size, Image.Resampling.LANCZOS)
else:
    logo_optimized = img

optimized_path = os.path.join(logos_dir, "arkyra-new-logo.png")
logo_optimized.save(optimized_path, "PNG", optimize=True)
print(f"✓ Saved optimized logo: {optimized_path} ({logo_optimized.size})")

# Create logo icon only (crop to just the anchor symbol in top portion)
# The anchor symbol appears to be in approximately the top 60% of the image
icon_height = int(logo_height * 0.6)
icon_box = (0, 0, logo_width, icon_height)
logo_icon = img.crop(icon_box)

# Make it square by padding or cropping
icon_size = max(logo_icon.size)
icon_square = Image.new('RGBA', (icon_size, icon_size), (255, 255, 255, 0))
# Center the icon
paste_x = (icon_size - logo_icon.width) // 2
paste_y = (icon_size - logo_icon.height) // 2
icon_square.paste(logo_icon, (paste_x, paste_y), logo_icon)

icon_path = os.path.join(logos_dir, "arkyra-icon.png")
icon_square.save(icon_path, "PNG", optimize=True)
print(f"✓ Saved logo icon: {icon_path}")

# Generate favicon sizes from the icon
favicon_sizes = [16, 32, 48, 64, 128, 256]
print("\nGenerating favicon sizes...")

for size in favicon_sizes:
    favicon = icon_square.resize((size, size), Image.Resampling.LANCZOS)
    favicon_path = os.path.join(output_dir, f"favicon-{size}x{size}.png")
    favicon.save(favicon_path, "PNG", optimize=True)
    print(f"✓ Created {size}x{size} favicon")

# Create apple-touch-icon (180x180)
apple_icon = icon_square.resize((180, 180), Image.Resampling.LANCZOS)
apple_icon_path = os.path.join(output_dir, "apple-touch-icon.png")
apple_icon.save(apple_icon_path, "PNG", optimize=True)
print(f"✓ Created Apple touch icon (180x180)")

# Create favicon.ico with multiple sizes embedded
favicon_ico_path = os.path.join(output_dir, "favicon.ico")
icon_16 = icon_square.resize((16, 16), Image.Resampling.LANCZOS)
icon_32 = icon_square.resize((32, 32), Image.Resampling.LANCZOS)
icon_48 = icon_square.resize((48, 48), Image.Resampling.LANCZOS)
icon_16.save(favicon_ico_path, format='ICO', sizes=[(16, 16), (32, 32), (48, 48)])
print(f"✓ Created favicon.ico with multiple sizes")

print("\n✅ Logo optimization complete!")
print(f"\nGenerated files:")
print(f"  - Full logo: {optimized_path}")
print(f"  - Logo with transparency: {full_logo_path}")
print(f"  - Logo icon: {icon_path}")
print(f"  - Favicon sizes: 16x16, 32x32, 48x48, 64x64, 128x128, 256x256")
print(f"  - Apple touch icon: 180x180")
print(f"  - favicon.ico: Multi-size ICO file")
