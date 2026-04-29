import urllib.request
import os

os.makedirs('public/assets', exist_ok=True)

urls = {
    'public/assets/parent_icon.png': 'https://em-content.zobj.net/source/microsoft-teams/363/family-man-woman-girl-boy_1f468-200d-1f469-200d-1f467-200d-1f466.png',
    'public/assets/boy_icon.png': 'https://em-content.zobj.net/source/microsoft-teams/363/boy_1f466.png',
    'public/assets/girl_icon.png': 'https://em-content.zobj.net/source/microsoft-teams/363/girl_1f467.png'
}

for path, url in urls.items():
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response, open(path, 'wb') as out_file:
            data = response.read()
            out_file.write(data)
            print(f"Downloaded {path}")
    except Exception as e:
        print(f"Failed to download {url}: {e}")
