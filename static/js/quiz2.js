document.addEventListener('DOMContentLoaded', function () {
    const draggables = document.querySelectorAll('.draggable');
    const dropColumns = document.querySelectorAll('.drop-column');
    const dragZone = document.querySelector('.drag-zone');
  
    draggables.forEach(item => {
      item.addEventListener('dragstart', dragStart);
    });
  
    dropColumns.forEach(zone => {
      zone.addEventListener('dragover', handleDragOver);
      zone.addEventListener('drop', handleDrop);
    });
  
    dragZone.addEventListener('dragover', handleDragOver);
    dragZone.addEventListener('drop', handleReturn);
  
    let draggedItem = null;
  
    function dragStart(e) {
      draggedItem = e.target;
      setTimeout(() => {
        e.target.style.display = 'none';
      }, 0);
    }
  
    function handleDragOver(e) {
      e.preventDefault();
    }
  
    function handleDrop(e) {
      e.preventDefault();
      if (!draggedItem) return;
  
      e.currentTarget.appendChild(draggedItem);
      draggedItem.style.display = 'block';
      draggedItem = null;
    }
  
    function handleReturn(e) {
      e.preventDefault();
      if (!draggedItem) return;
  
      dragZone.appendChild(draggedItem);
      draggedItem.style.display = 'block';
      draggedItem = null;
    }
});

// 提交答案并跳转
document.querySelector('.button.next').addEventListener('click', function (e) {
    e.preventDefault(); // Prevent default action
    
    const helps = [];
    const hurts = [];

    document.querySelectorAll('.drop-column.helps .draggable').forEach(item => {
        helps.push(item.getAttribute('data-value'));
    });

    document.querySelectorAll('.drop-column.hurts .draggable').forEach(item => {
        hurts.push(item.getAttribute('data-value'));
    });

    // Use fetch instead of XMLHttpRequest
    fetch('/submit_quiz2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            helps: helps,
            hurts: hurts
        })
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Submission failed');
    })
    .then(data => {
        if (data.success) {
            // Get next URL from button href or use hardcoded value
            const nextUrl = document.querySelector('.button.next').getAttribute('href') || '/quiz3';
            window.location.href = nextUrl;
        } else {
            alert('Submission failed, please try again');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Network error, please check your connection');
    });
});