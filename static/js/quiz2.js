

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
    const helps = [];
    const hurts = [];

    document.querySelectorAll('.drop-column.helps .draggable').forEach(item => {
        helps.push(item.getAttribute('data-value'));
    });

    document.querySelectorAll('.drop-column.hurts .draggable').forEach(item => {
        hurts.push(item.getAttribute('data-value'));
    });

    // 使用 XMLHttpRequest 进行 AJAX 提交
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/submit_quiz2', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    
    xhr.onload = function() {
        if (xhr.status === 200) {
            // 成功后跳转
            window.location.href = next_url;
        } else {
            // 处理错误情况
            console.error('提交失败', xhr.statusText);
            alert('提交失败，请重试');
        }
    };

    xhr.onerror = function() {
        console.error('网络错误');
        alert('网络错误，请检查您的连接');
    };

    // 发送数据
    xhr.send(JSON.stringify({
        helps: helps,
        hurts: hurts
    }));
});