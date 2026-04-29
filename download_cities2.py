import urllib.request

urls = {
    'public/assets/haifa.jpg': 'https://upload.wikimedia.org/wikipedia/commons/2/29/Bahai_Gardens_Haifa.jpg',
    'public/assets/nablus.jpg': 'https://upload.wikimedia.org/wikipedia/commons/6/67/Nablus_from_Mount_Gerizim.jpg',
    'public/assets/gaza.jpg': 'https://upload.wikimedia.org/wikipedia/commons/8/87/Gaza_Beach_2009.jpg'
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
