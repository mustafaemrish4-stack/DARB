import urllib.request
import mimetypes
import os

def upload_to_catbox(file_path):
    url = 'https://catbox.moe/user/api.php'
    boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW'
    
    with open(file_path, 'rb') as f:
        file_content = f.read()
        
    mime_type = 'audio/mpeg'
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
        print('Success:', response.read().decode('utf-8'))
    except Exception as e:
        print('Error:', e)

upload_to_catbox('public/assets/lullaby.mp3')
