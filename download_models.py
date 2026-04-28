import urllib.request
import os

os.makedirs('public/models', exist_ok=True)

models = {
    'car.glb': 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/ToyCar/glTF-Binary/ToyCar.glb',
    'fox.glb': 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Fox/glTF-Binary/Fox.glb',
    'robot.glb': 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/CesiumMan/glTF-Binary/CesiumMan.glb',
    'duck.glb': 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb'
}

for name, url in models.items():
    print(f"Downloading {name}...")
    try:
        urllib.request.urlretrieve(url, f'public/models/{name}')
        print(f"Success: {name}")
    except Exception as e:
        print(f"Failed to download {name}: {e}")
