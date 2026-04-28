import os
import requests
from PIL import Image
from io import BytesIO

pano_id = "CIHM0ogKEICAgICuloKUvQE"
zoom = 3
# At zoom 3, a street view panorama is 13 tiles wide and 7 tiles high
width_tiles = 13
height_tiles = 7
tile_width = 512
tile_height = 512

print("جاري سحب مجسم المسجد الأقصى بصيغة Tiles وتجميعه...")
output_image = Image.new('RGB', (width_tiles * tile_width, height_tiles * tile_height))

for x in range(width_tiles):
    for y in range(height_tiles):
        url = f"https://cbk0.google.com/cbk?output=tile&panoid={pano_id}&zoom={zoom}&x={x}&y={y}"
        try:
            response = requests.get(url, timeout=10)
            if response.status_code == 200:
                tile = Image.open(BytesIO(response.content))
                output_image.paste(tile, (x * tile_width, y * tile_height))
        except Exception as e:
            print(f"Error fetching tile {x},{y}: {e}")

# The right side and bottom might have black space depending on true limits, but mostly Google pads it.
final_path = "public/360/alaqsa.jpg"
output_image.save(final_path, "JPEG", quality=90)

import shutil
os.makedirs("الفديوهات", exist_ok=True)
shutil.copy2(final_path, "الفديوهات/alaqsa.jpg")
print(f"✅ تمت العملية بنجاح! تم حفظ المسجد الأقصى في {final_path}")
