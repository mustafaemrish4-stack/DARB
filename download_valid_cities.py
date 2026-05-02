import urllib.request

urls = {
    'public/assets/jaffa.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/ISR-2013-Aerial-Jaffa-Port_of_Jaffa.jpg/960px-ISR-2013-Aerial-Jaffa-Port_of_Jaffa.jpg',
    'public/assets/jerusalem.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Jerusalem-2013-Temple_Mount-Al-Aqsa_Mosque_%28NE_exposure%29.jpg/960px-Jerusalem-2013-Temple_Mount-Al-Aqsa_Mosque_%28NE_exposure%29.jpg',
    'public/assets/nablus.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Nablus_2013.jpg/960px-Nablus_2013.jpg',
    'public/assets/gaza.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Images_of_war_23-25_from_Gaza%2C_by_Jaber_Badwen%2C_IMG_6315.jpg/960px-Images_of_war_23-25_from_Gaza%2C_by_Jaber_Badwen%2C_IMG_6315.jpg'
}

for path, url in urls.items():
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response, open(path, 'wb') as out_file:
            out_file.write(response.read())
            print(f"Downloaded {path}")
    except Exception as e:
        print(f"Failed to download {url}: {e}")
