document.addEventListener("DOMContentLoaded", () => {
    const disruptors = document.querySelectorAll(".disruptor");
    const dropzones = document.querySelectorAll(".dropzone");
    const originalList = document.querySelector(".disruptor-list");
    let currentDragged = null;
  
    disruptors.forEach(d => {
      d.addEventListener("dragstart", e => {
        currentDragged = d;
        e.dataTransfer.setData("text/plain", d.id);
      });
    });
  
    dropzones.forEach(zone => {
      zone.addEventListener("dragover", e => {
        e.preventDefault();
  
        const targetStage = zone.dataset.stage;
        const correctStage = currentDragged?.dataset.affects;
  
        // Add correct or incorrect class based on matching stage
        if (correctStage === targetStage) {
          zone.classList.add("correct-hover");
          zone.classList.remove("incorrect-hover");
        } else {
          zone.classList.add("incorrect-hover");
          zone.classList.remove("correct-hover");
        }
      });
  
      zone.addEventListener("dragleave", () => {
        zone.classList.remove("correct-hover", "incorrect-hover");
      });
  
      zone.addEventListener("drop", e => {
        e.preventDefault();
        zone.classList.remove("correct-hover", "incorrect-hover");
  
        const disruptorId = e.dataTransfer.getData("text/plain");
        const draggedElement = document.getElementById(disruptorId);
        const correctStage = draggedElement.dataset.affects;
        const targetStage = zone.dataset.stage;
  
        if (correctStage === targetStage) {
          zone.querySelector(".zone-content").appendChild(draggedElement);
          draggedElement.setAttribute("draggable", "false");
          draggedElement.classList.add("correct");
        } else {
          originalList.appendChild(draggedElement);
        }
      });
    });
  });
      