document.addEventListener("DOMContentLoaded", () => {
    // 获取所有选项元素
    const options = document.querySelectorAll(".option");
    
    // 获取Next按钮
    const nextButton = document.querySelector(".button.next");
    
    // 存储用户选择
    let selectedOption = null;
    
    // 为每个选项添加点击事件
    options.forEach(option => {
      option.addEventListener("click", () => {
        // 移除之前的选择
        options.forEach(opt => opt.classList.remove("selected"));
        
        // 添加新的选择
        option.classList.add("selected");
        
        // 储存选择的答案
        selectedOption = option.dataset.answer;
        
        // 可选：更新顶部的wake-up time显示
        updateWakeupTime(selectedOption);
      });
    });
    
    // 更新顶部的wake-up time显示（可选）
    function updateWakeupTime(time) {
      const questionMark = document.querySelector(".question-mark");
      if (questionMark) {
        questionMark.style.display = "none";
      }
      
      // 可选：更新顶部时钟图像或添加时间文本
    }
    
    // 检查答案（如果需要）
    window.checkAnswer = function() {
      if (!selectedOption) {
        alert("Please select a wake-up time!");
        return false;
      }
      
      // 直接允许进入下一页，不验证正确答案
      return true;
    };
    
    // 如果Next按钮需要验证
    if (nextButton) {
      nextButton.addEventListener("click", (e) => {
        if (!checkAnswer()) {
          e.preventDefault();
        }
      });
    }
  });