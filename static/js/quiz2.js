const correctAnswers = {
    "Helps Sleep": ["Meditation", "Reading", "Shower"],
    "Hurts Sleep": ["Screen", "Stress", "Caffeine", "Alcohol", "Eating", "Irregular-schedule", "Exercising-late"]
  };
  
  let draggedItem = null;
  
  // Setup Drag
  document.querySelectorAll('.draggable').forEach(item => {
    item.addEventListener('dragstart', e => {
      draggedItem = item;
      setTimeout(() => item.style.display = "none", 0);
    });
    item.addEventListener('dragend', e => {
      setTimeout(() => {
        draggedItem.style.display = "block";
        draggedItem = null;
      }, 0);
    });
  });
  
  // Setup Drop Zones
  document.querySelectorAll('.drop-column').forEach(zone => {
    zone.addEventListener('dragover', e => e.preventDefault());
  
    zone.addEventListener('drop', e => {
      if (draggedItem) {
        zone.appendChild(draggedItem);
      }
    });
  });
  
  // Check Answer
  function checkAnswer() {
    let correct = true;
  
    document.querySelectorAll('.drop-column').forEach(zone => {
      const category = zone.getAttribute('data-category');
      const items = Array.from(zone.querySelectorAll('.draggable')).map(item => item.dataset.value);
  
      items.forEach(item => {
        if (!correctAnswers[category].includes(item)) {
          correct = false;
        }
      });
  
      // Also make sure they didn’t miss any correct items!
      correctAnswers[category].forEach(expected => {
        if (!items.includes(expected)) {
          correct = false;
        }
      });
    });
  
    if (correct) {
      let score = parseInt(sessionStorage.getItem('quizScore') || '0');
      sessionStorage.setItem('quizScore', score + 1);
      window.location.href = "{{ next_url }}";  // Flask Jinja renders this
    } else {
      alert("Not quite! Try sorting them correctly.");
    }
  }