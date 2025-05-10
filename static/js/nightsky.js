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
        
        // Random size - some stars slightly larger
        const size = Math.random() * 3.5 + 0.5;
        
        star.style.left = `${posX}%`;
        star.style.top = `${posY}%`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        // Only make about 15% of stars twinkle
        if (Math.random() < 0.15) {
            star.classList.add('twinkle');
            star.style.width = `${size * 2.5}px`;
            star.style.height = `${size * 2.5}px`;
            
            // Add random delay for twinkling stars
            const delay = Math.random() * 5; // More variation in delay
            const duration = 3 + Math.random() * 2; // Slower twinkling
            
            star.style.animationDelay = `${delay}s`;
            star.style.animationDuration = `${duration}s`;
        }
        
        nightSky.appendChild(star);
    }
}