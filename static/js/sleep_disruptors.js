document.addEventListener("DOMContentLoaded", () => {
    const disruptors = document.querySelectorAll(".disruptor");
    const dropzones = document.querySelectorAll(".dropzone");
    const originalList = document.querySelector(".disruptor-list");
  
    disruptors.forEach(d => {
      d.addEventListener("dragstart", e => {
        e.dataTransfer.setData("text/plain", d.id);
      });
    });
  
    dropzones.forEach(zone => {
      zone.addEventListener("dragover", e => {
        e.preventDefault();
        zone.classList.add("highlight");
      });
  
      zone.addEventListener("dragleave", () => {
        zone.classList.remove("highlight", "incorrect");
      });
  
      zone.addEventListener("drop", e => {
        e.preventDefault();
        zone.classList.remove("highlight");
  
        const disruptorId = e.dataTransfer.getData("text/plain");
        const draggedElement = document.getElementById(disruptorId);
        const correctStage = draggedElement.dataset.affects;
        const targetStage = zone.dataset.stage;
  
        if (correctStage === targetStage) {
          zone.querySelector(".zone-content").appendChild(draggedElement);
          draggedElement.setAttribute("draggable", "false");
          draggedElement.classList.add("correct");
        } else {
          // Add temporary red border or effect
          zone.classList.add("incorrect");
          setTimeout(() => {
            zone.classList.remove("incorrect");
          }, 1000);
  
          // Snap the element back to original list
          originalList.appendChild(draggedElement);
        }
      });
    });
  });
    