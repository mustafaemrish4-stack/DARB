import urllib.request

urls = {
    'public/assets/gaza.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Gaza_City.JPG/960px-Gaza_City.JPG',
    'public/assets/jenin.jpg': 'https://upload.wikimedia.org/wikipedia/commons/8/80/Jenin-new.jpg',
    'public/360/gaza.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Gaza_City.JPG/960px-Gaza_City.JPG',
    'public/360/jenin.jpg': 'https://upload.wikimedia.org/wikipedia/commons/8/80/Jenin-new.jpg'
}

for path, url in urls.items():
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response, open(path, 'wb') as out_file:
            out_file.write(response.read())
            print(f"Downloaded {path}")
    except Exception as e:
        print(f"Failed to download {url}: {e}")
