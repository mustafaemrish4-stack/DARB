import urllib.request

urls = {
    'public/assets/jerusalem.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Jerusalem_Dome_of_the_rock_front.jpg/800px-Jerusalem_Dome_of_the_rock_front.jpg',
    'public/assets/jaffa.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Jaffa_Port.jpg/800px-Jaffa_Port.jpg'
}

for path, url in urls.items():
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        with urllib.request.urlopen(req) as response, open(path, 'wb') as out_file:
            out_file.write(response.read())
            print(f"Downloaded {path}")
    except Exception as e:
        print(f"Failed {url}: {e}")
