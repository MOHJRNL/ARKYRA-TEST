#!/usr/bin/env python3
"""
Create optimized navigation icon from the logo
"""
from PIL import Image

# Load the icon
icon_path = "/Users/MOH/MOH - DATA/Work/Growingify /arkyra/apps/frontend/public/logos/arkyra-icon.png"
output_path = "/Users/MOH/MOH - DATA/Work/Growingify /arkyra/apps/frontend/public/logos/arkyra-nav-icon.png"

print("Loading icon...")
icon = Image.open(icon_path)
print(f"Original size: {icon.size}")

# Resize to 128x128 for navigation (good balance between quality and file size)
nav_icon = icon.resize((128, 128), Image.Resampling.LANCZOS)

# Save with optimization
nav_icon.save(output_path, "PNG", optimize=True)

# Get file sizes
import os
original_size = os.path.getsize(icon_path) / 1024
new_size = os.path.getsize(output_path) / 1024

print(f"✓ Created navigation icon: {output_path}")
print(f"  Original size: {original_size:.1f}KB")
print(f"  New size: {new_size:.1f}KB")
print(f"  Size: 128x128px")
print(f"  Reduction: {((original_size - new_size) / original_size * 100):.1f}%")
