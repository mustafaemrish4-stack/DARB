import os
import urllib.request
import ssl
import shutil

ssl._create_default_https_context = ssl._create_unverified_context

os.makedirs('public/videos', exist_ok=True)
os.makedirs('الفديوهات', exist_ok=True)

# Google Sample Videos Bucket (Extremely reliable and fast MP4s, 4K/HD quality)
videos = {
    'dinosaurs.mp4': 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', # 3D Open Source movie
    'animals.mp4': 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    'cartoon.mp4': 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', # Highly requested Cartoon
    'nature.mp4': 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    'garden.mp4': 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    'alaqsa.mp4': 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
}

print("Downloading High-Quality Videos from Google Repositories...")
for name, url in videos.items():
    dest_path = f'public/videos/{name}'
    if not os.path.exists(dest_path) or os.path.getsize(dest_path) < 100000:
        try:
            print(f"Downloading {name}...")
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, timeout=30) as res:
                with open(dest_path, 'wb') as f:
                    f.write(res.read())
            print(f"[{name}] Downloaded successfully!")
        except Exception as e:
            print(f"Failed {name}: {e}")
    else:
        print(f"[{name}] already exists.")

# Now copy all videos and 360 images to the visible arabic folder
for file in os.listdir('public/videos'):
    if file.endswith('.mp4'):
        shutil.copy2(f'public/videos/{file}', f'الفديوهات/{file}')

for file in os.listdir('public/360'):
    if file.endswith('.jpg'):
        shutil.copy2(f'public/360/{file}', f'الفديوهات/{file}')

print("All 360 images and High-Quality Videos have been populated in الفديوهات folder!")
