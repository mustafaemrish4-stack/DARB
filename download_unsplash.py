import urllib.request

urls = {
    'public/assets/jerusalem.jpg': 'https://images.unsplash.com/photo-1548231264-58a4df45eab0?q=80&w=1024',
    'public/assets/jaffa.jpg': 'https://images.unsplash.com/photo-1591185458000-bc5244510091?q=80&w=1024'
}

for path, url in urls.items():
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36'})
        with urllib.request.urlopen(req) as response, open(path, 'wb') as out_file:
            out_file.write(response.read())
            print(f"Downloaded {path}")
    except Exception as e:
        print(f"Failed {url}: {e}")
