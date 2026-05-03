import urllib.request
import os

videos = [
    r'الفديوهات\garden.mp4',
    r'الفديوهات\1.mp4',
    r'الفديوهات\6.mp4',
    r'الفديوهات\7.mp4',
    r'الفديوهات\5.mp4'
]

def upload_to_catbox(file_path):
    url = 'https://catbox.moe/user/api.php'
    boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW'
    try:
        with open(file_path, 'rb') as f:
            file_content = f.read()
    except Exception as e:
        print('Error reading', file_path, e)
        return
        
    mime_type = 'video/mp4'
    filename = os.path.basename(file_path)
    
    body = (
        f'--{boundary}\r\n'
        f'Content-Disposition: form-data; name="reqtype"\r\n\r\n'
        f'fileupload\r\n'
        f'--{boundary}\r\n'
        f'Content-Disposition: form-data; name="fileToUpload"; filename="{filename}"\r\n'
        f'Content-Type: {mime_type}\r\n\r\n'
    ).encode('utf-8') + file_content + f'\r\n--{boundary}--\r\n'.encode('utf-8')
    
    req = urllib.request.Request(url, data=body, headers={
        'Content-Type': f'multipart/form-data; boundary={boundary}',
        'Content-Length': len(body)
    })
    
    try:
        response = urllib.request.urlopen(req)
        print(f'{filename}: {response.read().decode("utf-8")}')
    except Exception as e:
        print('Error:', e)

for v in videos:
    upload_to_catbox(v)
