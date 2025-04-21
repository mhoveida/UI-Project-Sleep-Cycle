function showStage(stageId) {
    // Hide the intro section
    const intro = document.getElementById('intro-content');
    if (intro) intro.style.display = 'none';
  
    // Hide all stage info blocks
    document.querySelectorAll('.stage-info').forEach(el => {
      el.style.display = 'none';
    });
  
    // Show the selected stage's info
    const target = document.getElementById('info-' + stageId);
    if (target) target.style.display = 'block';
  }
  