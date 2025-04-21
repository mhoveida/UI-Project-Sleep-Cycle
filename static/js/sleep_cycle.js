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

  document.addEventListener('DOMContentLoaded', () => {
    // Handle clicks on characteristic titles
    document.querySelectorAll('.characteristics').forEach(charList => {
      const items = Array.from(charList.querySelectorAll('.characteristic-item'));
      items.forEach((item, index) => {
        const button = item.querySelector('.char-button');
        if (button) {
          button.addEventListener('click', () => {
            // Show next item if exists
            if (index + 1 < items.length) {
              items[index + 1].style.display = 'block';
            } else {
              // Show next stage button if this was the last item
              const nextButton = item.closest('.stage-info').querySelector('.next-stage-button');
              if (nextButton) nextButton.style.display = 'inline-block';
            }
          });
        }
      });
    });
  
    // Handle "Next Stage" button
    document.querySelectorAll('.next-stage-button').forEach(btn => {
      btn.addEventListener('click', () => {
        const currentId = btn.closest('.stage-info').id.replace('info-', '');
        const stageOrder = ["N1", "N2", "N3", "REM"];
        const nextIndex = stageOrder.indexOf(currentId) + 1;
        const nextId = stageOrder[nextIndex];
        if (nextId) {
          showStage(nextId);
        }
      });
    });
  });
  