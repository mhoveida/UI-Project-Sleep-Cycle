document.addEventListener("DOMContentLoaded", () => {
    const dragZone = document.querySelector(".drag-zone");
    const empties = document.querySelectorAll(".empty");
    
    // 初始化每个 draggable 的 dragstart 事件
    function setupDraggables() {
      const draggables = document.querySelectorAll(".draggable");
      draggables.forEach(el => {
        el.addEventListener("dragstart", e => {
          e.dataTransfer.setData("text/plain", el.id);
        });
      });
    }
    
    setupDraggables(); // 初始绑定
    
    // 允许拖进 drop 区
    empties.forEach(zone => {
      zone.addEventListener("dragover", e => e.preventDefault());
      
      zone.addEventListener("drop", e => {
        e.preventDefault();
        const draggedId = e.dataTransfer.getData("text/plain");
        const dragged = document.getElementById(draggedId);
        
        // 清除 empty 内容后插入新图
        zone.innerHTML = "";
        
        // 克隆拖动的元素，并且不要设置pointer-events: none
        const clonedDragged = dragged.cloneNode(true);
        clonedDragged.classList.add("dropped");
        clonedDragged.style.pointerEvents = "auto"; // 确保可以被拖动
        clonedDragged.draggable = true;
        
        zone.appendChild(clonedDragged);
        dragged.style.display = "none"; // 隐藏原始元素
        
        // 为克隆的元素添加拖动事件
        clonedDragged.addEventListener("dragstart", evt => {
          evt.dataTransfer.setData("text/plain", draggedId);
        });
      });
    });
    
    // 允许拖回原 drag-zone 区域
    dragZone.addEventListener("dragover", e => e.preventDefault());
    
    dragZone.addEventListener("drop", e => {
      e.preventDefault();
      const draggedId = e.dataTransfer.getData("text/plain");
      const originalDragged = document.getElementById(draggedId);
      
      // 找到当前在哪个 empty 槽，清空它
      empties.forEach(zone => {
        const droppedElement = zone.querySelector(".draggable");
        if (droppedElement && droppedElement.id === draggedId) {
          // 恢复 empty 的原始图片
          zone.innerHTML = `<img src="${zone.dataset.img || '/static/media/Quiz/Q1/quiz1-empty.png'}" alt="Drop Slot">`;
        }
      });
      
      // 显示原始元素
      originalDragged.style.display = "";
    });
  });
  const nextUrl = "{{ next_url }}"; // 来自 Python 渲染的变量

  function checkAnswer() {
    const correct = true; // 你可以换成验证逻辑
    if (correct) {
      window.location.href = nextUrl;
    } else {
      alert("Not quite! Try again.");
    }
  }    