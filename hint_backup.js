document.addEventListener('DOMContentLoaded', function() {
    const hintIcon = document.querySelector('.hint-icon');
    const hintBox = document.querySelector('.hint-box');
    
    if (hintIcon && hintBox) {
        // Add click event to hint icon
        hintIcon.addEventListener('click', function() {
            hintBox.classList.toggle('show');
        });
        
        // Close hint when clicking outside
        document.addEventListener('click', function(event) {
            if (!hintIcon.contains(event.target) && !hintBox.contains(event.target)) {
                hintBox.classList.remove('show');
            }
        });
    }
}); 