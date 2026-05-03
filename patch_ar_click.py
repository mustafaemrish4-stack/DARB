import re

with open('public/ar-experience.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Add the click listener back to the balloon creation
click_listener = """
      // Click listener for popping
      sphere.addEventListener('click', function() {
        score += 10;
        document.getElementById('score-text').innerText = `النقاط: ${score}`;
        
        // Particle effect
        for(let p=0; p<8; p++) {
          const particle = document.createElement('a-entity');
          particle.setAttribute('geometry', 'primitive: sphere; radius: 0.05');
          particle.setAttribute('material', `color: ${color}`);
          particle.setAttribute('position', balloon.getAttribute('position'));
          particle.setAttribute('animation', `property: position; to: ${x + (Math.random()-0.5)} ${y + (Math.random()-0.5)} ${z + (Math.random()-0.5)}; dur: 400; easing: easeOutQuad`);
          particle.setAttribute('animation__scale', 'property: scale; to: 0 0 0; dur: 400; easing: easeOutQuad');
          scene.appendChild(particle);
          setTimeout(() => { if(particle.parentNode) particle.parentNode.removeChild(particle); }, 400);
        }

        if(balloon.parentNode) balloon.parentNode.removeChild(balloon);
        setTimeout(spawnBalloon, 1000);
      });
      
      // Add floating animation
"""

content = content.replace('      // Add floating animation', click_listener)

with open('public/ar-experience.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Patched ar-experience.html")
