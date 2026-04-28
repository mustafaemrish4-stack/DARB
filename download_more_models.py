import urllib.request
import os

os.makedirs('public/models', exist_ok=True)
os.makedirs('public/textures', exist_ok=True)

urls = {
    'public/models/cesium_man.glb': 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/CesiumMan/glTF-Binary/CesiumMan.glb',
    'public/models/buggy.glb': 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Buggy/glTF-Binary/Buggy.glb',
    'public/textures/forest360.jpg': 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Photosphere_of_the_forest_in_the_village_of_Ushguli.jpg'
}

for path, url in urls.items():
    if not os.path.exists(path):
        print(f"Downloading {path}...")
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req) as response, open(path, 'wb') as out_file:
                out_file.write(response.read())
            print(f"Success: {path}")
        except Exception as e:
            print(f"Failed to download {path}: {e}")
print("Done!")
