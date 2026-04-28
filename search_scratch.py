import urllib.request
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

req = urllib.request.Request('https://api.scratch.mit.edu/search/projects?q=arabic+alphabet', headers={'User-Agent': 'Mozilla/5.0'})
try:
    resp = urllib.request.urlopen(req, context=ctx).read().decode('utf-8')
    data = json.loads(resp)
    print("Letters:", [f"{item['id']} - {item['title']}" for item in data[:3]])

    req2 = urllib.request.Request('https://api.scratch.mit.edu/search/projects?q=memory+game', headers={'User-Agent': 'Mozilla/5.0'})
    resp2 = urllib.request.urlopen(req2, context=ctx).read().decode('utf-8')
    data2 = json.loads(resp2)
    print("Memory:", [f"{item['id']} - {item['title']}" for item in data2[:3]])
except Exception as e:
    print('Failed:', e)
