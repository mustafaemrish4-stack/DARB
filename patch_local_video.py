with open('src/App.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', '/videos/nature.mp4')
# I'll also replace any http variant just in case
text = text.replace('http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', '/videos/nature.mp4')
# Change the title to just say Nature Dinosaur video
text = text.replace('فيديو الطبيعة والديناصورات', 'فيديو 360 طبيعة (بدون نت)')

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Linked local video.")
