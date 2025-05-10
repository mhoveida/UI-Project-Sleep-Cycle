document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".match-container");
  const svg = document.querySelector(".match-lines");
  
  // Update SVG size to match container
  function updateSvgSize() {
    const containerRect = container.getBoundingClientRect();
    svg.setAttribute("width", containerRect.width);
    svg.setAttribute("height", containerRect.height);
  }

  // Initialize and handle window resize
  updateSvgSize();
  window.addEventListener("resize", updateSvgSize);

  // Correct answers (these are the correct connections)
  const correctConnections = [
    {from: 3, to: 5},  // Sufficient N3 Deep Sleep to Recovery
    {from: 1, to: 3},  // Complete REM Cycles to Solve
    {from: 2, to: 0},  // Insufficient N3 Deep Sleep to Sick
    {from: 5, to: 2},  // Multiple REM cycles to Forget
    {from: 4, to: 4},  // N2 Deeper Light Sleep to Guitar
    {from: 0, to: 1}   // Disrupted N3 Deep Sleep to Sport
  ];

  // Update line positions based on connector positions for responsive layout
  function updateLines() {
    const lines = svg.querySelectorAll("line");
    
    correctConnections.forEach((conn, index) => {
      const leftConnector = document.querySelector(`.left-connector[data-index="${conn.from}"]`);
      const rightConnector = document.querySelector(`.right-connector[data-index="${conn.to}"]`);
      
      if (leftConnector && rightConnector && lines[index]) {
        const leftRect = leftConnector.getBoundingClientRect();
        const rightRect = rightConnector.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        const x1 = leftRect.left + leftRect.width/2 - containerRect.left;
        const y1 = leftRect.top + leftRect.height/2 - containerRect.top;
        const x2 = rightRect.left + rightRect.width/2 - containerRect.left;
        const y2 = rightRect.top + rightRect.height/2 - containerRect.top;
        
        lines[index].setAttribute("x1", x1);
        lines[index].setAttribute("y1", y1);
        lines[index].setAttribute("x2", x2);
        lines[index].setAttribute("y2", y2);
      }
    });
  }
  
  // Update line positions initially and on resize
  updateLines();
  window.addEventListener("resize", updateLines);
});