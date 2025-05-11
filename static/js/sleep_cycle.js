// Variables to control the animation
let currentStage = -1; // Current stage (-1 means no stage selected yet)
const stageOrder = ["N1", "N2", "N3", "REM"];
let animationFrame = null;
let waveX = 0; // Current position of the traveling wave (0-400)
const waveSpeed = 2; // Speed of the wave movement
let isAnimating = false;
let targetX = 0; // Target position to stop at

// Wave patterns for each stage
const wavePatterns = {
  N1: { 
    amplitude: 15, 
    frequency: 0.40,  // Increased from 0.05
    color: '#4ca1af' 
  },
  N2: { 
    amplitude: 10, 
    frequency: 0.50,  // Increased from 0.1
    spindles: true, 
    color: '#4ca1af' 
  },
  N3: { 
    amplitude: 30, 
    frequency: 0.50,  // Increased from 0.03
    color: '#4ca1af' 
  },
  REM: { 
    amplitude: 8, 
    frequency: 0.9,   // Increased from 0.15
    eyeMovements: true, 
    color: '#4ca1af' 
  }
};

// Create a description for each sleep stage
function createStageDescription() {
  const description = document.createElement('div');
  description.id = 'stage-description';
  description.style.fontSize = '12px';
  description.style.color = '#555';
  description.style.textAlign = 'center';
  description.style.marginTop = '5px';
  description.style.fontStyle = 'italic';
  description.style.height = '30px'; // Fixed height to prevent layout shifting
  
  return description;
}

// Update the stage description based on progress
function updateStageDescription() {
  const description = document.getElementById('stage-description');
  if (!description) return;
  
  // If no stages completed yet
  if (currentStage < 0) {
    description.textContent = '';
    return;
  }
  
  // Get the furthest stage reached
  const stage = stageOrder[currentStage];
  
  // Update text based on stage
  switch(stage) {
    case 'N1':
      description.textContent = 'N1: Light sleep with slow theta waves. You can be easily awakened.';
      break;
    case 'N2':
      description.textContent = 'N2: Sleep spindles and K-complexes appear. Body temperature drops.';
      break;
    case 'N3':
      description.textContent = 'N3: Deep sleep with slow delta waves. Physical restoration occurs.';
      break;
    case 'REM':
      description.textContent = 'REM: Rapid Eye Movement sleep. Dreams occur as brain activity increases.';
      break;
  }
}

// Create the wave animation container
function createWaveAnimation() {
  // If container already exists, don't create it again
  if (document.getElementById('wave-container')) return;
  
  console.log("Creating wave animation container");
  
  // Create the container
  const container = document.createElement('div');
  container.id = 'wave-container';
  //container.style.position = 'fixed';
  //container.style.bottom = '2rem';
  //container.style.left = '2rem';
  //container.style.width = '400px';
  //container.style.height = '180px';
  //container.style.background = 'white';
  //container.style.borderRadius = '12px';
  //container.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)';
  //container.style.padding = '15px';
  //container.style.zIndex = '1000';
  //container.style.display = 'none';




  container.style.position = 'absolute';  // not fixed
  container.style.bottom = '8rem';        // a bit above back button
  container.style.left = '10rem';           // near the right side
  container.style.width = '400px';
  container.style.height = '180px';
  container.style.background = 'white';
  container.style.borderRadius = '12px';
  container.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)';
  container.style.padding = '15px';
  container.style.zIndex = '1';            // not too high
  container.style.display = 'none';        // still hidden initially


  
  // Add title
  const title = document.createElement('div');
  title.innerHTML = '<strong>Brain Wave Patterns During Sleep</strong>';
  title.style.fontWeight = 'bold';
  title.style.textAlign = 'center';
  title.style.marginBottom = '5px';
  title.style.color = '#2c3e50';
  title.style.fontSize = '16px';
  
  // Add description
  const description = document.createElement('div');
  description.textContent = 'This animation shows how brain wave patterns change as you progress through different sleep stages.';
  description.style.textAlign = 'center';
  description.style.fontSize = '12px';
  description.style.color = '#555';
  description.style.marginBottom = '10px';
  
  // Create canvas for drawing
  const canvas = document.createElement('canvas');
  canvas.id = 'wave-canvas';
  canvas.width = 400;
  canvas.height = 100;
  canvas.style.display = 'block';
  
  // Create stage markers
  const markers = document.createElement('div');
  markers.style.display = 'flex';
  markers.style.justifyContent = 'space-between';
  markers.style.marginTop = '5px';
  
  stageOrder.forEach((stage, index) => {
    const marker = document.createElement('div');
    marker.textContent = stage;
    marker.id = `stage-marker-${stage}`;
    marker.style.fontWeight = 'bold';
    marker.style.color = '#888';
    markers.appendChild(marker);
  });
  
  // Add stage description element
  const stageDescription = createStageDescription();
  
  // Add reset button
  const resetButton = document.createElement('button');
  resetButton.textContent = 'Reset';
  resetButton.style.position = 'absolute';
  resetButton.style.top = '10px';
  resetButton.style.right = '10px';
  resetButton.style.padding = '4px 8px';
  resetButton.style.background = '#f8f9fa';
  resetButton.style.border = '1px solid #ddd';
  resetButton.style.borderRadius = '4px';
  resetButton.style.cursor = 'pointer';
  resetButton.onclick = resetWaveAnimation;
  
  // Add all elements to the container
  container.appendChild(title);
  container.appendChild(description);
  container.appendChild(canvas);
  container.appendChild(markers);
  container.appendChild(stageDescription);
  container.appendChild(resetButton);
  
  // Add container to the document
  //document.body.appendChild(container);
  document.querySelector('.cycle-image').appendChild(container);

  
  console.log("Wave animation container created");
}

// Calculate the Y position for a point at position X in the given stage
function getWaveY(x, stage) {
  const baseY = 50; // Center line
  const pattern = wavePatterns[stage];
  
  if (!pattern) return baseY;
  
  // Calculate position within the stage section (0-1)
  const stageIndex = stageOrder.indexOf(stage);
  const stageStart = stageIndex * 100;
  const stagePos = (x - stageStart) / 100;
  
  let y = baseY;
  
  // Basic sine wave
  y = baseY - Math.sin(stagePos * Math.PI * 2 * pattern.frequency * 10) * pattern.amplitude;
  
  // Add special patterns for different stages
  if (stage === 'N2' && pattern.spindles) {
    // Add occasional K-complex (sharp spike)
    if (x % 50 > 40 && x % 50 < 45) {
      y = baseY + 25;
    }
  }
  
  if (stage === 'REM' && pattern.eyeMovements) {
    // Create more subtle eye movements using a different sine wave pattern
    // This creates a more "chaotic" pattern but without abrupt jumps
    const fastWave = Math.sin(stagePos * Math.PI * 5) * 4;
    const mediumWave = Math.sin(stagePos * Math.PI * 12) * 3;
    
    // Add a bit of variation but smooth it out
    if (x % 30 > 25) {
      // Use a smoother transition instead of random jumps
      const eyeMovementIntensity = 8 * Math.sin(x * 0.8);
      y += eyeMovementIntensity * 0.5 + fastWave + mediumWave;
    }
  }
  
  // If we're at a boundary between N3 and REM, apply smoothing
  if (stage === 'REM') {
    const distanceFromBoundary = x - 300; // REM starts at x=300
    if (distanceFromBoundary < 15) {
      // Blend between N3 and REM in the first 15 pixels for a smooth transition
      const blendFactor = distanceFromBoundary / 15;
      const n3Y = getWaveY(x, 'N3');
      return n3Y * (1 - blendFactor) + y * blendFactor;
    }
  }
  
  return y;
}

// Draw the current state of the wave
function drawWave() {
  const canvas = document.getElementById('wave-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw center line
  ctx.beginPath();
  ctx.strokeStyle = '#e0e0e0';
  ctx.setLineDash([5, 5]);
  ctx.moveTo(0, 50);
  ctx.lineTo(400, 50);
  ctx.stroke();
  ctx.setLineDash([]);
  
  // Draw stage dividers
  for (let i = 1; i < stageOrder.length; i++) {
    ctx.beginPath();
    ctx.strokeStyle = '#e0e0e0';
    ctx.setLineDash([3, 3]);
    ctx.moveTo(i * 100, 10);
    ctx.lineTo(i * 100, 90);
    ctx.stroke();
  }
  ctx.setLineDash([]);
  
  // Don't draw the wave if we haven't started yet
  if (currentStage < 0 || waveX <= 0) return;
  
  // Draw the wave line
  ctx.beginPath();
  ctx.strokeStyle = '#4ca1af';
  ctx.lineWidth = 2;
  ctx.moveTo(0, 50); // Start at center left
  
  // Draw the line up to the current position
  for (let x = 0; x <= Math.min(waveX, 400); x += 2) {
    // Determine which stage this point is in
    const stageIndex = Math.floor(x / 100);
    
    // Only draw up to the current stage
    if (stageIndex > currentStage) break;
    
    const stage = stageOrder[stageIndex];
    const y = getWaveY(x, stage);
    
    ctx.lineTo(x, y);
  }
  
  ctx.stroke();
}

// Start or continue the wave animation to the specified stage
function animateWave(stageId) {
  const stageIndex = stageOrder.indexOf(stageId);
  if (stageIndex === -1) return;
  
  console.log(`Animating wave to stage: ${stageId} (index ${stageIndex})`);
  
  // Show the container
  const container = document.getElementById('wave-container');
  if (container) {
    container.style.display = 'block';
  }
  
  // Update current stage if advancing
  if (stageIndex > currentStage) {
    currentStage = stageIndex;
  }
  
  // Set the target position (end of the current stage)
  targetX = (stageIndex + 1) * 100;
  
  // Start the animation if not already running
  if (!isAnimating) {
    isAnimating = true;
    animateFrame();
  }
  
  // Update stage markers
  updateStageMarkers();
  
  // Update stage description
  updateStageDescription();
}

// Animate a single frame and schedule the next one
function animateFrame() {
  // Advance the wave position
  waveX += waveSpeed;
  
  // Stop at the target position
  if (waveX >= targetX) {
    waveX = targetX;
    
    // If we've completed a full cycle, show message
    if (currentStage === stageOrder.length - 1 && !document.getElementById('cycle-complete')) {
      showCycleComplete();
    }
  }
  
  // Draw the current state
  drawWave();
  
  // Schedule the next frame if we haven't reached the target
  if (waveX < targetX) {
    animationFrame = requestAnimationFrame(animateFrame);
  } else {
    isAnimating = false;
  }
}

// Update the stage markers based on progress
function updateStageMarkers() {
  // Calculate which stages have been reached by the wave
  const reachedStage = Math.floor(waveX / 100);
  
  stageOrder.forEach((stage, index) => {
    const marker = document.getElementById(`stage-marker-${stage}`);
    if (marker) {
      if (index <= reachedStage) {
        marker.style.color = '#4ca1af';
      } else {
        marker.style.color = '#888';
      }
    }
  });
}

// Show the cycle complete message
function showCycleComplete() {
  const container = document.getElementById('wave-container');
  if (!container) return;
  
  const message = document.createElement('div');
  message.id = 'cycle-complete';
  message.textContent = 'Full Sleep Cycle Complete! (90 minutes)';
  message.style.textAlign = 'center';
  message.style.fontWeight = 'bold';
  message.style.color = '#27ae60';
  message.style.marginTop = '10px';
  container.appendChild(message);
}

// Reset the wave animation
function resetWaveAnimation() {
  console.log("Resetting wave animation");
  
  // Cancel any ongoing animation
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
    animationFrame = null;
  }
  
  // Reset variables
  currentStage = -1;
  waveX = 0;
  isAnimating = false;
  
  // Redraw the wave (will be empty)
  drawWave();
  
  // Reset stage markers
  stageOrder.forEach(stage => {
    const marker = document.getElementById(`stage-marker-${stage}`);
    if (marker) {
      marker.style.color = '#888';
    }
  });
  
  // Reset stage description
  updateStageDescription();
  
  // Remove completion message
  const message = document.getElementById('cycle-complete');
  if (message) {
    message.remove();
  }
}

// Function to show completed stage message
function showCompletedStageMessage(stageInfo, nextStageId) {
  // First, remove any existing completion messages and arrows
  const existingWrappers = stageInfo.querySelectorAll('.stage-completion-wrapper');
  existingWrappers.forEach(wrapper => wrapper.remove());
  
  // Create a wrapper div to hold both message and up arrow
  const messageWrapper = document.createElement('div');
  messageWrapper.className = 'stage-completion-wrapper';
  messageWrapper.style.display = 'flex';
  messageWrapper.style.alignItems = 'center';
  messageWrapper.style.gap = '1rem';
  messageWrapper.style.marginTop = '2rem';
  
  // Create the completion message element
  const completionMessage = document.createElement('div');
  completionMessage.className = 'stage-completion-message';
  
  // Style the message
  completionMessage.style.flex = '1';
  completionMessage.style.padding = '0.75rem';
  completionMessage.style.backgroundColor = 'rgba(76, 161, 175, 0.1)';
  completionMessage.style.borderRadius = '8px';
  completionMessage.style.borderLeft = '4px solid #4ca1af';
  completionMessage.style.color = '#2c3e50';
  completionMessage.style.fontWeight = 'bold';
  completionMessage.style.textAlign = 'center';
  completionMessage.style.boxShadow = '0 2px 5px rgba(0,0,0,0.05)';
  
  // Set message content based on current stage
  if (nextStageId) {
    // Not final stage
    completionMessage.textContent = `Stage complete! Click on ${nextStageId} in the image to continue.`;
    
    // Add subtle pulsing animation
    completionMessage.style.animation = 'pulse 2s infinite';
  } else {
    // Final stage (REM)
    completionMessage.textContent = `All stages complete! Click on N1 to restart or continue to next section.`;
    completionMessage.style.whiteSpace = 'nowrap';
    completionMessage.style.textOverflow = 'ellipsis';


    
    // Different color for completion
    completionMessage.style.borderLeft = '4px solid #4ca1af';
    completionMessage.style.backgroundColor ='rgba(76, 161, 175, 0.1)';
  }
  
  // Create the up arrow button
  const upArrowButton = document.createElement('button');
  upArrowButton.className = 'scroll-top-button';
  upArrowButton.innerHTML = '&#8679;'; // Up arrow Unicode character
  
  // Style the up arrow button
  upArrowButton.style.display = 'flex';
  upArrowButton.style.justifyContent = 'center';
  upArrowButton.style.alignItems = 'center';
  upArrowButton.style.width = '40px';
  upArrowButton.style.height = '40px';
  upArrowButton.style.borderRadius = '50%';
  upArrowButton.style.backgroundColor = '#4ca1af';
  upArrowButton.style.color = 'white';
  upArrowButton.style.fontSize = '24px';
  upArrowButton.style.border = 'none';
  upArrowButton.style.cursor = 'pointer';
  upArrowButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
  upArrowButton.style.transition = 'transform 0.2s ease';
  
  // Add hover effect
  upArrowButton.onmouseover = function() {
    this.style.transform = 'translateY(-3px)';
  };
  upArrowButton.onmouseout = function() {
    this.style.transform = 'translateY(0)';
  };
  
  // Add click event to scroll to top
  upArrowButton.onclick = function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  // Add tooltip
  upArrowButton.title = "Scroll to top";
  
  // Add message and button to wrapper
  messageWrapper.appendChild(completionMessage);
  messageWrapper.appendChild(upArrowButton);
  
  // Add wrapper to the stage info container
  stageInfo.appendChild(messageWrapper);
  
  // Scroll to make the message visible
  messageWrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
  
  // Remove automatic scroll timeout - now user only controls with button
  // No more automatic scrolling
}

// Modify your existing showStage function to include the wave animation
function showStage(stageId) {
  console.log("Show stage called for:", stageId);
  
  // Hide intro
  const intro = document.getElementById('intro-content');
  if (intro) intro.style.display = 'none';

  // Hide all stage content
  document.querySelectorAll('.stage-info').forEach(el => {
    el.style.display = 'none';
  });

  // Show selected stage block
  const target = document.getElementById('info-' + stageId);
  if (target) target.style.display = 'block';

  // Swap the main image to the clicked stage
  const mainImg = document.getElementById('sleep-cycle-img');
  if (mainImg) {
    mainImg.src = `/static/media/Sleep-cycle/Characteristics/${stageId}.png`;
    mainImg.alt = `${stageId} Sleep Stage`;
  }
  
  // Animate the wave to this stage
  animateWave(stageId);
  
  // NEW: Scroll to the top of the page when a new stage is shown
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', () => {
  console.log("Page loaded, initializing sleep cycle animation");
  
  // Create the wave animation container
  //createWaveAnimation();
  
  // Track any active completion message cleanup timeouts
  let messageCleanupTimeout = null;
  
  // Handle clicks on characteristic titles
  document.querySelectorAll('.characteristics').forEach(charList => {
    const items = Array.from(charList.querySelectorAll('.characteristic-item'));
    items.forEach((item, index) => {
      const button = item.querySelector('.char-button');
      if (button) {
        button.addEventListener('click', () => {
          if (index + 1 < items.length) {
            const nextItem = items[index + 1];
            nextItem.style.display = 'block';
            nextItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
          } else {
            // Find the stage info container
            const stageInfo = item.closest('.stage-info');
            const currentId = stageInfo.id.replace('info-', '');
            const stageOrder = ["N1", "N2", "N3", "REM"];
            const currentIndex = stageOrder.indexOf(currentId);
            
            // Check if there's a next stage
            const nextId = currentIndex < stageOrder.length - 1 ? stageOrder[currentIndex + 1] : null;
            
            // Remove any existing next stage button
            const existingButton = stageInfo.querySelector('.next-stage-button');
            if (existingButton) {
              existingButton.remove();
            }
            
            // Remove any existing completion message
            const existingMessage = stageInfo.querySelector('.stage-completion-message');
            if (existingMessage) {
              existingMessage.remove();
            }
            
            // Clear any previous timeout that might be running
            if (messageCleanupTimeout) {
              clearTimeout(messageCleanupTimeout);
            }
            
            // Show the completion message instead of the button
            showCompletedStageMessage(stageInfo, nextId);
          }
        });
      }
    });    
  });

  // We're not using the Next Stage buttons anymore, so we can remove this handler
  // But keeping it commented out for reference
  /*
  document.querySelectorAll('.next-stage-button').forEach(btn => {
    btn.addEventListener('click', () => {
      const currentId = btn.closest('.stage-info').id.replace('info-', '');
      const stageOrder = ["N1", "N2", "N3", "REM"];
      const nextIndex = stageOrder.indexOf(currentId) + 1;
      const nextId = stageOrder[nextIndex];
  
      if (nextId) {
        showStage(nextId);
  
        // Reset the page scroll to the top
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    });
  });
  */
});

// Add a style element for animations
document.addEventListener('DOMContentLoaded', () => {
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    @keyframes pulse {
      0% { opacity: 0.8; }
      50% { opacity: 1; }
      100% { opacity: 0.8; }
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-5px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .scroll-top-button:hover {
      background-color: #5dafbd !important;
      box-shadow: 0 4px 8px rgba(0,0,0,0.3) !important;
    }
    
    .scroll-top-button:active {
      transform: translateY(2px) !important;
      box-shadow: 0 1px 3px rgba(0,0,0,0.2) !important;
    }
    
  `;
  document.head.appendChild(styleElement);
});