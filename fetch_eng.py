import urllib.request
import urllib.parse
import base64

letters = [
    ('A', 'Apple'), ('B', 'Bear'), ('C', 'Cat'), ('D', 'Dog'), ('E', 'Elephant'),
    ('F', 'Frog'), ('G', 'Giraffe'), ('H', 'Horse'), ('I', 'Iguana'), ('J', 'Jaguar'),
    ('K', 'Kangaroo'), ('L', 'Lion'), ('M', 'Monkey'), ('N', 'Newt'), ('O', 'Owl'),
    ('P', 'Penguin'), ('Q', 'Quail'), ('R', 'Rabbit'), ('S', 'Snake'), ('T', 'Tiger'),
    ('U', 'Unicorn'), ('V', 'Vulture'), ('W', 'Wolf'), ('X', 'X-ray fish'), ('Y', 'Yak'),
    ('Z', 'Zebra')
]

out = 'export const englishAudioData: Record<string, string> = {\n'

for l, w in letters:
    text = urllib.parse.quote(l + '. ' + w)
    url = 'https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=' + text
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        audio = urllib.request.urlopen(req).read()
        b64 = base64.b64encode(audio).decode('utf-8')
        out += f'  "{l}": "data:audio/mp3;base64,{b64}",\n'
        print(f"Generated {l}")
    except Exception as e:
        print(f'Failed {l}:', e)
        out += f'  "{l}": "",\n'

out += '};\n'
with open('c:/Users/Musta/Downloads/darb---درب/src/englishAudioData.ts', 'w', encoding='utf-8') as f:
    f.write(out)
print('English Audio Done!')
