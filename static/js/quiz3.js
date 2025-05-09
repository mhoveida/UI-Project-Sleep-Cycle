document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".match-container");
    const svg = document.querySelector(".match-lines");
    
    let selectedConnector = null;
    let connections = [];
    let tempLine = null;
    
    // 获取连接点的中心坐标
    function getConnectorCenter(connector) {
      const rect = connector.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2 - containerRect.left,
        y: rect.top + rect.height / 2 - containerRect.top
      };
    }
    
    // 绘制连线
    function drawLine(from, to, isTemp = false) {
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", from.x);
      line.setAttribute("y1", from.y);
      line.setAttribute("x2", to.x);
      line.setAttribute("y2", to.y);
      
      if (isTemp) {
        line.classList.add("temp");
      }
      
      svg.appendChild(line);
      return line;
    }
    
    // 更新SVG尺寸
    function updateSvgSize() {
      const containerRect = container.getBoundingClientRect();
      svg.setAttribute("width", containerRect.width);
      svg.setAttribute("height", containerRect.height);
    }
    
    // 移除所有临时线条
    function removeTempLines() {
      const tempLines = svg.querySelectorAll(".temp");
      tempLines.forEach(line => line.remove());
    }
    
    // 移除特定连接
    function removeConnection(index1, index2) {
      connections = connections.filter(conn => 
        !(conn.from === index1 && conn.to === index2) &&
        !(conn.from === index2 && conn.to === index1)
      );
      redrawAllConnections();
    }
    
    // 重绘所有连接
    function redrawAllConnections() {
      svg.innerHTML = "";
      connections.forEach(conn => {
        const fromConnector = document.querySelector(`.left-connector[data-index="${conn.from}"]`);
        const toConnector = document.querySelector(`.right-connector[data-index="${conn.to}"]`);
        
        if (fromConnector && toConnector) {
          const from = getConnectorCenter(fromConnector);
          const to = getConnectorCenter(toConnector);
          drawLine(from, to);
        }
      });
    }
    
    // 初始化
    updateSvgSize();
    window.addEventListener("resize", () => {
      updateSvgSize();
      redrawAllConnections();
    });
    
    // 鼠标移动事件处理
    container.addEventListener("mousemove", (e) => {
      if (selectedConnector) {
        removeTempLines();
        const from = getConnectorCenter(selectedConnector);
        const containerRect = container.getBoundingClientRect();
        const to = {
          x: e.clientX - containerRect.left,
          y: e.clientY - containerRect.top
        };
        tempLine = drawLine(from, to, true);
      }
    });
    
    // 连接点点击事件
    const connectors = document.querySelectorAll(".connector");
    connectors.forEach(connector => {
      connector.addEventListener("click", (e) => {
        e.stopPropagation();
        
        if (!selectedConnector) {
          // 选择第一个连接点
          selectedConnector = connector;
          connector.classList.add("selected");
        } else {
          // 选择第二个连接点，创建连接
          const isSameSide = (selectedConnector.classList.contains("left-connector") && 
                             connector.classList.contains("left-connector")) ||
                            (selectedConnector.classList.contains("right-connector") && 
                             connector.classList.contains("right-connector"));
          
          if (!isSameSide) {
            // 创建连接
            const index1 = parseInt(selectedConnector.dataset.index);
            const index2 = parseInt(connector.dataset.index);
            
            // 检查是否已经存在连接
            const existingConnection = connections.find(conn => 
              (conn.from === index1 && conn.to === index2) ||
              (conn.from === index2 && conn.to === index1)
            );
            
            if (!existingConnection) {
              if (selectedConnector.classList.contains("left-connector")) {
                connections.push({ from: index1, to: index2 });
              } else {
                connections.push({ from: index2, to: index1 });
              }
              
              selectedConnector.classList.add("connected");
              connector.classList.add("connected");
              
              redrawAllConnections();
            }
          }
          
          // 清除选择
          selectedConnector.classList.remove("selected");
          selectedConnector = null;
          removeTempLines();
        }
      });
    });
    
    // 点击空白处取消选择
    container.addEventListener("click", () => {
      if (selectedConnector) {
        selectedConnector.classList.remove("selected");
        selectedConnector = null;
        removeTempLines();
      }
    });
    
    // 双击连接点删除连接
    connectors.forEach(connector => {
      connector.addEventListener("dblclick", (e) => {
        e.stopPropagation();
        const index = parseInt(connector.dataset.index);
        
        // 找到所有包含此连接点的连接
        connections = connections.filter(conn => 
          conn.from !== index && conn.to !== index
        );
        
        connector.classList.remove("connected");
        redrawAllConnections();
      });
    });
    
    // Replace your checkAnswer function with this version
    window.checkAnswer = function() {
      // Create a simple mapping for the connections
      const matches = {};
      
      // 获取所有已连接的左侧连接点
      const leftConnectors = document.querySelectorAll('.left-connector.connected');
      
      leftConnectors.forEach(connector => {
        const leftIndex = parseInt(connector.dataset.index);
        const leftKey = `question_${leftIndex}`;
        
        // 找到该连接点的连接
        const connection = connections.find(conn => conn.from === leftIndex);
        
        if (connection) {
          const rightIndex = connection.to;
          const rightKey = `answer_${rightIndex}`;
          
          // 以服务器期望的格式存储
          matches[leftKey] = rightKey;
        }
      });

      // 提交到正确的端点
      fetch('/submit_quiz3', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matches: matches
        })
      }).then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Failed to save answer");
      }).then(data => {
        if (data.success) {
          // Redirect to the next quiz
          window.location.href = '/quiz4';
        } else {
          alert("Failed to save answer, please try again.");
        }
      }).catch(error => {
        console.error('Error:', error);
        alert("Network error, please try again.");
      });
    };
  });