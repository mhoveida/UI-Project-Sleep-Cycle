document.addEventListener('DOMContentLoaded', function() {
    // 单选逻辑
    document.querySelectorAll('.options.single-choice').forEach(group => {
        group.querySelectorAll('.option').forEach(option => {
            option.addEventListener('click', () => {
                group.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
            });
        });
    });

    // 拖拽逻辑
    const draggables = document.querySelectorAll('.draggable');
    const dropZone = document.querySelector('.drop-zone');

    draggables.forEach(item => {
        item.addEventListener('dragstart', () => {
            item.classList.add('dragging');
        });

        item.addEventListener('dragend', () => {
            item.classList.remove('dragging');
        });
    });

    dropZone.addEventListener('dragover', e => {
        e.preventDefault();
    });

    dropZone.addEventListener('drop', e => {
        e.preventDefault();
        const draggingItem = document.querySelector('.dragging');
        if (draggingItem) {
            const placeholder = dropZone.querySelector('.placeholder');
            if (placeholder) {
                placeholder.style.display = 'none';
            }
            // 确保不重复添加
            if (!dropZone.querySelector(`[data-value="${draggingItem.getAttribute('data-value')}"]`)) {
                const clone = draggingItem.cloneNode(true);
                dropZone.appendChild(clone);
                
                // 添加删除功能
                clone.addEventListener('click', () => {
                    clone.remove();
                    if (dropZone.querySelectorAll('.draggable').length === 0) {
                        const placeholder = dropZone.querySelector('.placeholder');
                        if (placeholder) {
                            placeholder.style.display = '';
                        }
                    }
                });
            }
        }
    });

    // 提交处理
    document.querySelector('.button.next').addEventListener('click', function(e) {
        e.preventDefault();
        
        // 获取问题1答案
        const q1Answer = document.querySelector('.question.q1 .option.selected');
        let q1Value = null;
        if (q1Answer) {
            q1Value = q1Answer.getAttribute('data-value') || q1Answer.textContent.trim();
        }
        
        // 获取问题2答案（多选拖拽题）
        const q2Answers = [];
        dropZone.querySelectorAll('.draggable').forEach(item => {
            const value = item.getAttribute('data-value') || item.textContent.trim();
            if (value) {
                q2Answers.push(value);
            }
        });
        
        // 获取问题3答案
        const q3Answer = document.querySelector('.question.q3 .option.selected');
        let q3Value = null;
        if (q3Answer) {
            q3Value = q3Answer.getAttribute('data-value') || q3Answer.textContent.trim();
        }

        fetch('/submit_quiz5', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                q1: q1Value,
                q2: q2Answers,
                q3: q3Value
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = '/quiz_results';
            } else {
                console.error("Submission failed.");
            }
        })
        .catch(error => {
            console.error("Error:", error);
        });
    });
});