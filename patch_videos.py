import sys

with open('src/VideosView.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace("عالم الكرتون", "الفضاء والكون")
text = text.replace("/videos/cartoon.mp4", "/videos/space.mp4")
text = text.replace("🎨", "🚀")

with open('src/VideosView.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
