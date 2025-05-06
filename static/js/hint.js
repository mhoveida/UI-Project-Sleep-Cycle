/**
 * Popup hint functionality for quiz pages
 * Shows a popup with the hint for 5 seconds
 */
// Super basic hint implementation with direct alert
console.log("Hint script loading...");

// Function that runs when document is ready
function setupHints() {
  console.log("Setting up hints...");
  
  // Try to get the hint icon
  var icons = document.querySelectorAll('.hint-icon');
  console.log("Found hint icons:", icons.length);
  
  // Add direct inline onclick handler as a backup method
  for (var i = 0; i < icons.length; i++) {
    var icon = icons[i];
    console.log("Setting up icon", i);
    
    icon.onclick = function() {
      console.log("ICON CLICKED!");
      
      // Get hint text
      var parentDiv = this.parentNode;
      var hintText = parentDiv.querySelector('.hint-text');
      var hintContent = "No hint available";
      
      if (hintText) {
        hintContent = hintText.innerHTML;
        console.log("Found hint content:", hintContent);
      } else {
        console.log("Could not find hint-text element");
      }
      
      // Display hint
      alert("HINT: " + hintContent.replace(/<[^>]*>/g, ''));
      return false;
    };
    
    // Make it very obvious it's clickable
    icon.style.cursor = 'pointer';
    icon.title = 'Click for hint';
  }
  
  // Try direct click handler attachment
  var firstIcon = document.querySelector('.hint-icon');
  if (firstIcon) {
    console.log("Adding direct click listener to first icon");
    firstIcon.addEventListener('click', function(e) {
      console.log("DIRECT CLICK EVENT FIRED!");
      e.preventDefault();
      e.stopPropagation();
      
      // Try to show alert
      alert("Hint icon clicked!");
    });
  }
  
  console.log("Hint setup complete");
}

// Add event listener for page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupHints);
} else {
  // Document already loaded
  setupHints();
}

// Additionally try with window.onload as a fallback
window.onload = function() {
  console.log("Window.onload event - trying setupHints again");
  setupHints();
}; 