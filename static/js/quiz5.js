// Single Choice Logic
document.querySelectorAll('.options.single-choice').forEach(group => {
  group.querySelectorAll('.option').forEach(option => {
    option.addEventListener('click', () => {
      // Remove 'selected' from siblings
      group.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
      option.classList.add('selected');
    });
  });
});

// Drag-Drop Logic
const draggables = document.querySelectorAll('.draggable');
const dropZone = document.querySelector('.drop-zone');

draggables.forEach(item => {
  item.addEventListener('dragstart', () => {
    item.classList.add('dragging');
  });

  item.addEventListener('dragend', () => {
    item.classList.remove('dragging');
  });
});

dropZone.addEventListener('dragover', e => {
  e.preventDefault();
});

dropZone.addEventListener('drop', e => {
  e.preventDefault();
  const draggingItem = document.querySelector('.dragging');
  if (draggingItem) {
    // Hide the placeholder text
    const placeholder = dropZone.querySelector('.placeholder');
    if (placeholder) {
      placeholder.style.display = 'none';
    }
    dropZone.appendChild(draggingItem);
  }
});