import urllib.request
import urllib.parse

urls = {
    'public/assets/jerusalem.jpg': 'https://placehold.co/1024x768/8A1734/ffffff/png?text=' + urllib.parse.quote('Jerusalem / Al-Aqsa'),
    'public/assets/jaffa.jpg': 'https://placehold.co/1024x768/1A365D/ffffff/png?text=' + urllib.parse.quote('Jaffa Port & Sea'),
    'public/assets/nablus.jpg': 'https://placehold.co/1024x768/31885F/ffffff/png?text=' + urllib.parse.quote('Nablus City')
}

for path, url in urls.items():
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response, open(path, 'wb') as out_file:
            out_file.write(response.read())
            print(f"Downloaded {path}")
    except Exception as e:
        print(f"Failed {url}: {e}")
