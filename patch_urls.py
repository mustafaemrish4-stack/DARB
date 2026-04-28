import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace local paths in places array
text = text.replace("image: '/360/jerusalem.jpg'", "image: 'https://images.unsplash.com/photo-1548232938-1a5266cb2273?q=80&w=2048&auto=format&fit=crop'")
text = text.replace("image: '/360/nature.jpg'", "image: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/2294472375_24a3b8ef46_o.jpg'")
text = text.replace("image: '/360/jaffa.jpg'", "image: 'https://images.unsplash.com/photo-1589830571068-1542f561ee6a?q=80&w=2048&auto=format&fit=crop'")
text = text.replace("image: '/360/space.jpg'", "image: 'https://ucarecdn.com/bcece0a8-86ce-460e-856b-40dac4875f15/'")
text = text.replace("image: '/360/safari.jpg'", "image: 'https://images.unsplash.com/photo-1516426122078-a6279f04ca38?q=80&w=2048&auto=format&fit=crop'")
text = text.replace("image: '/360/hebron.jpg'", "image: 'https://images.unsplash.com/photo-1594993433602-d9ee3b290fb4?q=80&w=2048&auto=format&fit=crop'")
text = text.replace("image: '/360/nablus.jpg'", "image: 'https://images.unsplash.com/photo-1601758174493-45d0a4d3e407?q=80&w=2048&auto=format&fit=crop'")
text = text.replace("image: '/360/gaza.jpg'", "image: 'https://images.unsplash.com/photo-1574100004472-e536d3b6bacc?q=80&w=2048&auto=format&fit=crop'")

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Linked Real URLs to App.tsx")
