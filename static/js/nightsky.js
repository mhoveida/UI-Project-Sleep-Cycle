// nightsky.js - Handles night sky animation with stars
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the night sky with stars
    createStars();
});

/**
 * Creates stars in the night sky
 */
function createStars() {
    const nightSky = document.getElementById('nightSky');
    const starCount = 80; // Total stars
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        // Random position
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        
        // Random size - make stars larger since we're using clip-path
        const size = Math.random() * 5 + 5; // Between 5-13px
        
        // Random rotation for variety
        const rotation = Math.random() * 45; // Rotation between 0-45 degrees
        
        star.style.left = `${posX}%`;
        star.style.top = `${posY}%`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        // Add rotation for more natural look
        star.style.transform = `rotate(${rotation}deg)`;
        
        // Only make about 20% of stars twinkle
        if (Math.random() < 0.2) {
            star.classList.add('twinkle');
            
            // Make twinkling stars significantly larger
            const enlargeFactor = 2; // 80% larger than regular stars
            star.style.width = `${size * enlargeFactor}px`;
            star.style.height = `${size * enlargeFactor}px`;
            
            // Add random delay for twinkling stars
            const delay = Math.random() * 2;
            const duration = 4 + Math.random() * 2;
            
            star.style.animationDelay = `${delay}s`;
            star.style.animationDuration = `${duration}s`;
        }
        
        nightSky.appendChild(star);
    }
}