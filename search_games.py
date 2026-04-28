import urllib.request as r
import re
try:
    html = r.urlopen('https://wordwall.net/ar/community/%D8%A7%D9%84%D8%AD%D8%B1%D9%88%D9%81-%D8%A7%D9%84%D8%B9%D8%B1%D8%A8%D9%8A%D8%A9').read().decode('utf-8')
    links = re.findall(r'href="/ar/resource/(\d+/[a-z0-9-]+)"', html)
    print("Letters:", links[:5])
    
    html2 = r.urlopen('https://wordwall.net/ar/community/%D8%A7%D9%84%D8%B0%D8%A7%D9%83%D8%B1%D8%A9-%D9%84%D9%84%D8%A7%D8%B7%D9%81%D8%A7%D9%84').read().decode('utf-8')
    links2 = re.findall(r'href="/ar/resource/(\d+/[a-z0-9-]+)"', html2)
    print("Memory:", links2[:5])
except Exception as e:
    print(e)
