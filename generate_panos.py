from PIL import Image, ImageDraw, ImageFont # type: ignore
import random
import os

os.makedirs('public/360', exist_ok=True)

def generate_pano(filename, color_top, color_bottom):
    img = Image.new('RGB', (2048, 1024), color=color_top)
    draw = ImageDraw.Draw(img)
    # Simple gradient
    for y in range(1024):
        r = int(color_top[0] + (color_bottom[0] - color_top[0]) * (y / 1024))
        g = int(color_top[1] + (color_bottom[1] - color_top[1]) * (y / 1024))
        b = int(color_top[2] + (color_bottom[2] - color_top[2]) * (y / 1024))
        draw.line([(0, y), (2048, y)], fill=(r,g,b))
    img.save(filename)
    print(f"Generated {filename}")

# Cities (Desert / Sandstone colors)
generate_pano('public/360/jerusalem.jpg', (135, 206, 235), (210, 180, 140))
generate_pano('public/360/gaza.jpg', (135, 206, 235), (244, 164, 96))
generate_pano('public/360/nablus.jpg', (135, 206, 235), (189, 183, 107))
generate_pano('public/360/hebron.jpg', (135, 206, 235), (205, 133, 63))
generate_pano('public/360/jaffa.jpg', (135, 206, 235), (70, 130, 180)) # Sea color for Jaffa

# Nature (Green/Forest)
generate_pano('public/360/nature.jpg', (135, 206, 235), (34, 139, 34))

# Safari (Savanna)
generate_pano('public/360/safari.jpg', (135, 206, 235), (218, 165, 32))

# Space (Stars)
space = Image.new('RGB', (2048, 1024), color='black')
draw = ImageDraw.Draw(space)
for _ in range(5000):
    x = random.randint(0, 2047)
    y = random.randint(0, 1023)
    s = random.randint(1, 3)
    c = random.randint(150, 255)
    draw.ellipse((x, y, x+s, y+s), fill=(c,c,c))
space.save('public/360/space.jpg')
print("Generated space.jpg")

print("All textures created locally!")
