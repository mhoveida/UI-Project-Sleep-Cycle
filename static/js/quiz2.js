document.addEventListener('DOMContentLoaded', function () {
    const draggables = document.querySelectorAll('.draggable');
    const dropColumns = document.querySelectorAll('.drop-column');
    const dragZone = document.querySelector('.drag-zone');
  
    // 初始化拖拽项
    draggables.forEach(item => {
      setupDraggable(item);
    });
  
    // 设置放置区域
    dropColumns.forEach(zone => {
      zone.addEventListener('dragover', handleDragOver);
      zone.addEventListener('drop', handleDrop);
    });
  
    // 设置拖拽区域（返回原始位置）
    dragZone.addEventListener('dragover', handleDragOver);
    dragZone.addEventListener('drop', handleReturn);
  
    let draggedItem = null;
  
    // 设置拖拽项的所有事件和属性
    function setupDraggable(item) {
      item.draggable = true;
      item.addEventListener('dragstart', dragStart);
      
      // 添加点击删除功能（只对放置在drop-column里的元素有效）
      if (item.closest('.drop-column')) {
        item.addEventListener('click', function() {
          // 恢复原来被隐藏的元素
          const dataValue = item.getAttribute('data-value');
          const originalItem = findOriginalItem(dataValue);
          if (originalItem) originalItem.style.display = 'block';
          
          // 移除当前克隆
          item.remove();
        });
      }
    }
    
    // 寻找原始拖拽项
    function findOriginalItem(dataValue) {
      return Array.from(dragZone.querySelectorAll('.draggable')).find(item => 
        item.getAttribute('data-value') === dataValue
      );
    }
  
    function dragStart(e) {
      draggedItem = e.target;
      e.dataTransfer.setData('text/plain', draggedItem.getAttribute('data-value'));
      
      // 如果不是来自drop-column中的元素，则隐藏原始元素
      if (!draggedItem.closest('.drop-column')) {
        setTimeout(() => {
          draggedItem.style.display = 'none';
        }, 0);
      }
    }
  
    function handleDragOver(e) {
      e.preventDefault();
    }
  
    function handleDrop(e) {
      e.preventDefault();
      
      // 获取拖拽的数据
      const dataValue = e.dataTransfer.getData('text/plain');
      if (!dataValue) return;
      
      // 确定原始元素
      const originalItem = findOriginalItem(dataValue);
      
      // 创建新克隆
      const clone = document.createElement('img');
      clone.src = originalItem ? originalItem.src : draggedItem.src;
      clone.alt = dataValue;
      clone.className = 'draggable';
      clone.setAttribute('data-value', dataValue);
      clone.style.display = 'block';
      clone.draggable = true;
      
      // 添加到放置区
      e.currentTarget.appendChild(clone);
      
      // 设置新克隆的事件
      setupDraggable(clone);
      
      // 添加点击删除功能
      clone.addEventListener('click', function() {
        // 恢复原始元素
        if (originalItem) originalItem.style.display = 'block';
        // 移除克隆
        clone.remove();
      });
      
      // 重置拖拽状态
      draggedItem = null;
    }
  
    function handleReturn(e) {
      e.preventDefault();
      // 获取拖拽的数据
      const dataValue = e.dataTransfer.getData('text/plain');
      if (!dataValue) return;
      
      // 找到原始元素
      const originalItem = findOriginalItem(dataValue);
      if (originalItem) {
        originalItem.style.display = 'block';
      }
      
      // 如果是从drop-column拖回的元素，则删除拖拽源
      if (draggedItem && draggedItem.closest('.drop-column')) {
        draggedItem.remove();
      }
      
      // 重置拖拽状态
      draggedItem = null;
    }

    // 提交答案并跳转
    document.querySelector('.button.next').addEventListener('click', function (e) {
        e.preventDefault(); // Prevent default action
        
        const helps = [];
        const hurts = [];

        document.querySelectorAll('.drop-column.helps .draggable').forEach(item => {
            const value = item.getAttribute('data-value') || item.textContent.trim();
            if (value) {
                helps.push(value);
            }
        });

        document.querySelectorAll('.drop-column.hurts .draggable').forEach(item => {
            const value = item.getAttribute('data-value') || item.textContent.trim();
            if (value) {
                hurts.push(value);
            }
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
});