import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace the entire activeTab === 'videos' block with the VideosView component
pattern = r"\{activeTab === 'videos' && \(\s*<motion\.div.*?key=\"videos\".*?</motion\.div>\s*\)\}"
replacement = "{activeTab === 'videos' && (<VideosView onBack={() => setActiveTab('home')} />)}"

# re.DOTALL is critical to match across newlines
new_text = re.sub(pattern, replacement, text, flags=re.DOTALL)

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(new_text)

print('Patched App.tsx videos tab successfully')
