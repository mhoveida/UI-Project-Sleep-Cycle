document.addEventListener("DOMContentLoaded", () => {
    const dragZone = document.querySelector(".drag-zone");
    const empties = document.querySelectorAll(".empty");
  
    function setupDraggables() {
      const draggables = document.querySelectorAll(".draggable");
      draggables.forEach(el => {
        el.addEventListener("dragstart", e => {
          e.dataTransfer.setData("text/plain", el.id);
        });
      });
    }
  
    setupDraggables();
  
    empties.forEach(zone => {
      zone.addEventListener("dragover", e => e.preventDefault());
  
      zone.addEventListener("drop", e => {
        e.preventDefault();
        const draggedId = e.dataTransfer.getData("text/plain");
        const dragged = document.getElementById(draggedId);
  
        // 如果当前 zone 已有 draggable，移回原位
        const existing = zone.querySelector(".draggable, .dropped");
        if (existing) {
          const existingId = existing.id || existing.dataset.originalId;
          if (existingId) {
            const originalExisting = document.getElementById(existingId);
            if (originalExisting) {
              originalExisting.style.display = ""; // 显示回原 drag-zone
            }
          }
          existing.remove();
        }
  
        // 替换 drop 区内容
        zone.innerHTML = "";
        const clonedDragged = dragged.cloneNode(true);
        clonedDragged.classList.add("dropped");
        clonedDragged.style.pointerEvents = "auto";
        clonedDragged.draggable = true;
        clonedDragged.dataset.originalId = dragged.id; // 存储原始ID
        clonedDragged.dataset.value = dragged.dataset.value;
  
        zone.appendChild(clonedDragged);
        dragged.style.display = "none"; // 隐藏原始元素
  
        // 为克隆的元素添加拖动事件
        clonedDragged.addEventListener("dragstart", evt => {
          evt.dataTransfer.setData("text/plain", draggedId);
        });
      });
    });
  
    dragZone.addEventListener("dragover", e => e.preventDefault());
  
    dragZone.addEventListener("drop", e => {
      e.preventDefault();
      const draggedId = e.dataTransfer.getData("text/plain");
      const originalDragged = document.getElementById(draggedId);
  
      // 查找在哪个 drop 区并移除
      empties.forEach(zone => {
        const droppedElement = zone.querySelector(".dropped");
        if (droppedElement && (droppedElement.id === draggedId || droppedElement.dataset.originalId === draggedId)) {
          // 恢复 empty 的原始图片
          zone.innerHTML = `<img src="/static/media/Quiz/Q1/quiz1-empty.png" alt="Drop Slot">`;
        }
      });
  
      // 显示原 drag-zone 中的项
      if (originalDragged) {
        originalDragged.style.display = "";
      }
    });

    // Next 按钮点击事件 - 提交答案并跳转
    document.querySelector('.button.next').addEventListener('click', function(e) {
      e.preventDefault(); // 阻止默认跳转
      
      const answer = [];
      document.querySelectorAll('.empty .dropped').forEach(el => {
        //answer.push(el.dataset.value);
        const value = el.dataset.value || el.textContent.trim();
        answer.push(value);
      });

      // 检查是否所有空位都已填充
      if (answer.length < 4) {
        alert("Please place all sleep cycle stages in order before continuing.");
        return;
      }

      // 使用AJAX提交数据
      fetch('/submit_quiz1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer: answer })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // 获取下一页URL并跳转
          const nextUrl = document.querySelector('.button.next').getAttribute('href');
          window.location.href = nextUrl;
        } else {
          alert("Error submitting your answer.");
        }
      })
      .catch(error => {
        console.error("Error:", error);
        alert("An error occurred. Please try again.");
      });
    });
});