import urllib.request
import urllib.parse
import base64

letters = [
    ('أ', 'أسد'), ('ب', 'بطة'), ('ت', 'تفاح'), ('ث', 'ثعلب'), ('ج', 'جمل'),
    ('ح', 'حصان'), ('خ', 'خروف'), ('د', 'ديك'), ('ذ', 'ذئب'), ('ر', 'رمان'),
    ('ز', 'زرافة'), ('س', 'سمكة'), ('ش', 'شمس'), ('ص', 'صقر'), ('ض', 'ضفدع'),
    ('ط', 'طائرة'), ('ظ', 'ظرف'), ('ع', 'عصفور'), ('غ', 'غزال'), ('ف', 'فيل'),
    ('ق', 'قرد'), ('ك', 'كلب'), ('ل', 'ليمون'), ('م', 'موز'), ('ن', 'نحلة'),
    ('هـ', 'هدهد'), ('و', 'وردة'), ('ي', 'يمامة')
]

out = 'export const audioData: Record<string, string> = {\n'

for l, w in letters:
    text = urllib.parse.quote(l + '. ' + w)
    url = 'https://translate.google.com/translate_tts?ie=UTF-8&tl=ar&client=tw-ob&q=' + text
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
with open('c:/Users/Musta/Downloads/darb---درب/src/audioData.ts', 'w', encoding='utf-8') as f:
    f.write(out)
print('Done!')
