import urllib.request
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

req = urllib.request.Request('https://api.github.com/search/repositories?q=arabic+alphabet+mp3', headers={'User-Agent': 'Mozilla/5.0'})
try:
    resp = urllib.request.urlopen(req, context=ctx).read().decode('utf-8')
    data = json.loads(resp)
    for item in data['items'][:3]:
        print(f"{item['name']} - {item['html_url']}")
except Exception as e:
    print('Failed:', e)
