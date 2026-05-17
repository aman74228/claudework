#!/usr/bin/env python3
"""Generate PNG icons for UnitX PWA using only stdlib (struct + zlib)."""

import struct
import zlib
import os

# Purple background color
BG_R, BG_G, BG_B = 124, 58, 237  # #7c3aed

# Lightning bolt polygon points as fractions of icon size (regular)
BOLT_REGULAR = [
    (0.62, 0.08),
    (0.38, 0.50),
    (0.55, 0.50),
    (0.35, 0.92),
    (0.62, 0.50),
    (0.45, 0.50),
]

# Maskable: same polygon scaled to 80% of canvas, centered
BOLT_MASKABLE_SCALE = 0.80


def point_in_polygon(px, py, polygon):
    """Ray-casting algorithm to test if point (px,py) is inside polygon."""
    n = len(polygon)
    inside = False
    x, y = px, py
    j = n - 1
    for i in range(n):
        xi, yi = polygon[i]
        xj, yj = polygon[j]
        if ((yi > y) != (yj > y)) and (x < (xj - xi) * (y - yi) / (yj - yi) + xi):
            inside = not inside
        j = i
    return inside


def make_png(size, polygon_fractions):
    """Create a PNG image of given size with purple bg and white bolt polygon."""
    width = height = size

    # Convert fractional polygon coords to pixel coords
    polygon_px = [(fx * width, fy * height) for (fx, fy) in polygon_fractions]

    # Build raw pixel rows: filter byte 0 + RGB bytes
    rows = []
    for y in range(height):
        row = bytearray()
        row.append(0)  # filter type: None
        for x in range(width):
            if point_in_polygon(x + 0.5, y + 0.5, polygon_px):
                row += bytes([255, 255, 255])  # white
            else:
                row += bytes([BG_R, BG_G, BG_B])  # purple
        rows.append(bytes(row))

    raw_data = b''.join(rows)
    compressed = zlib.compress(raw_data, 9)

    def make_chunk(chunk_type, data):
        chunk_len = len(data)
        chunk_data = chunk_type + data
        crc = zlib.crc32(chunk_data) & 0xFFFFFFFF
        return struct.pack('>I', chunk_len) + chunk_data + struct.pack('>I', crc)

    # PNG signature
    signature = b'\x89PNG\r\n\x1a\n'

    # IHDR: width, height, bit_depth=8, color_type=2 (RGB), compress=0, filter=0, interlace=0
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 2, 0, 0, 0)
    ihdr = make_chunk(b'IHDR', ihdr_data)

    # IDAT
    idat = make_chunk(b'IDAT', compressed)

    # IEND
    iend = make_chunk(b'IEND', b'')

    return signature + ihdr + idat + iend


def maskable_polygon(size):
    """Return bolt polygon fractions scaled to 80% safe zone centered in the icon."""
    scale = BOLT_MASKABLE_SCALE
    offset = (1.0 - scale) / 2.0
    return [(offset + fx * scale, offset + fy * scale) for (fx, fy) in BOLT_REGULAR]


output_dir = os.path.join(os.path.dirname(__file__), 'icons')
os.makedirs(output_dir, exist_ok=True)

icons = [
    ('icon-192.png',          192, BOLT_REGULAR),
    ('icon-512.png',          512, BOLT_REGULAR),
    ('icon-maskable-192.png', 192, None),   # None = use maskable_polygon(size)
    ('icon-maskable-512.png', 512, None),
]

for filename, size, poly in icons:
    polygon = poly if poly is not None else maskable_polygon(size)
    png_bytes = make_png(size, polygon)
    out_path = os.path.join(output_dir, filename)
    with open(out_path, 'wb') as f:
        f.write(png_bytes)
    print(f"Generated {out_path} ({len(png_bytes)} bytes)")

print("Done.")
