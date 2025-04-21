function showStage(stageId) {
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
  }
  