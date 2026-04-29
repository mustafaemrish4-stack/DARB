import urllib.request
import os

os.makedirs('public/assets', exist_ok=True)

urls = {
    'public/assets/jerusalem.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Jerusalem_Dome_of_the_rock_front.jpg/800px-Jerusalem_Dome_of_the_rock_front.jpg',
    'public/assets/jaffa.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Jaffa_Port.jpg/800px-Jaffa_Port.jpg',
    'public/assets/haifa.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Bahai_Gardens_Haifa.jpg/800px-Bahai_Gardens_Haifa.jpg',
    'public/assets/nablus.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Nablus_from_Mount_Gerizim.jpg/800px-Nablus_from_Mount_Gerizim.jpg',
    'public/assets/gaza.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Gaza_Beach_2009.jpg/800px-Gaza_Beach_2009.jpg',
    'public/assets/vr_video.mp4': 'https://download.blender.org/peach/trailer/trailer_400p.ogg' # Very small video, actually let's use a standard mp4
}

# Change video to a tiny mp4 that works in a-frame
urls['public/assets/vr_video.mp4'] = 'https://media.w3.org/2010/05/sintel/trailer.mp4'

for path, url in urls.items():
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response, open(path, 'wb') as out_file:
            data = response.read()
            out_file.write(data)
            print(f"Downloaded {path}")
    except Exception as e:
        print(f"Failed to download {url}: {e}")
