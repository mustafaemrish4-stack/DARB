import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Fix the BottomNav
text = text.replace("{ id: 'experiences', icon: Layers, label: 'فيديوهات' }", "{ id: 'videos', icon: Play, label: 'فيديوهات' }")
text = text.replace("{ id: 'experiences', icon: Layers, label: 'O U,OOUSO3USOc' }", "{ id: 'videos', icon: Play, label: 'فيديوهات' }")
# If it's garbled:
text = re.sub(r"\{\s*id:\s*'experiences',\s*icon:\s*Layers,\s*label:\s*'.*?'\s*\}", "{ id: 'videos', icon: Play, label: 'فيديوهات' }", text)

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print('Patched BottomNav in App.tsx')
